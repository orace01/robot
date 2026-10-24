import "server-only";

import { and, asc, eq, gt, inArray, isNull, lt, notExists, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  orderItems,
  orders,
  supplierOrders,
  type OrderItemRow,
  type OrderRow,
  type SupplierOrderRow,
  type SupplierState,
} from "@/db/schema";
import { openCjSession, type CjRequest } from "@/lib/cj/api";
import { getCjOrder, placeCjOrder, supplierMode, supplierStateFromCj, type CjOrderDetail } from "@/lib/cj/orders";
import { fastestOption, getSupplierCatalog, orderableOptions, type SupplierCatalog } from "@/lib/cj/supplier";
import { formatUsd } from "@/lib/format";
import { TEST_PAYMENT_PROVIDERS } from "@/lib/payments/mepaye";
import { getProduct } from "@/lib/products";
import { addSupplierEvent, changeOrderStatus, setTracking } from "./service";

/**
 * Transmission automatique des commandes payées à CJ Dropshipping, puis suivi :
 * - à la commande, chaque groupe d'articles d'un même entrepôt devient une commande CJ,
 *   payée aussitôt sur le solde CJ ;
 * - ensuite, l'état de chaque commande CJ est relu (tâche planifiée /api/cj/sync,
 *   consultation du suivi par le client, bouton de l'administration) : numéro de suivi,
 *   expédition et livraison sont reportés sur la commande du client.
 */

export const supplierStateLabels: Record<SupplierState, string> = {
  sending: "Transmission en cours",
  sent: "Payée, en préparation chez CJ",
  unpaid: "Créée chez CJ, non payée",
  shipped: "Expédiée par CJ",
  delivered: "Livrée",
  cancelled: "Annulée par CJ",
  error: "Échec de transmission",
};

/** États où la commande CJ évolue encore. */
const ACTIVE_STATES: SupplierState[] = ["sent", "unpaid", "shipped"];
/** Une transmission « en cours » depuis plus longtemps a été interrompue : on la reprend. */
const STALE_SENDING_MS = 10 * 60_000;
/** Rattrapage des commandes payées jamais transmises (serveur redémarré…) : 3 derniers jours. */
const CATCH_UP_MS = 3 * 24 * 3600_000;

const UNPAID_MESSAGE =
  "solde CJ insuffisant ? Recharge le solde, puis paie la commande dans ton espace CJ (My Orders) : la suite reprendra seule";

const amount = (dollars: number | null) => (dollars == null ? "montant inconnu" : formatUsd(dollars));

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Articles regroupés par entrepôt d'expédition : une commande CJ par entrepôt. */
function groupByWarehouse(items: OrderItemRow[]): Map<string, OrderItemRow[]> {
  const groups = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const from = getProduct(item.productSlug)?.cj.shipFrom;
    if (!from) throw new Error(`Le produit « ${item.productSlug} » n'est plus dans le catalogue.`);
    groups.set(from, [...(groups.get(from) ?? []), item]);
  }
  return groups;
}

/** Transporteur accepté par CJ pour tous les articles du groupe : le moins cher, ou le plus rapide en express. */
function chooseLogistic(catalog: SupplierCatalog, items: OrderItemRow[], method: OrderRow["shippingMethod"]): string {
  const [first, ...rest] = items.map((item) => orderableOptions(catalog[item.cjSku] ?? null));
  const common = first.filter((option) => rest.every((options) => options.some((o) => o.name === option.name)));
  const option = method === "express" ? fastestOption(common) : common[0];
  if (!option) throw new Error("aucun transporteur CJ disponible pour ces articles (CJ injoignable ?)");
  return option.name;
}

/**
 * Réserve l'envoi d'un groupe : une seule transmission à la fois, grâce à l'index unique
 * (commande, entrepôt). Une ligne existante n'est reprise qu'après un échec ou une interruption.
 */
async function claimShipment(
  row: Pick<SupplierOrderRow, "orderId" | "fromCountry" | "reference" | "sandbox">,
): Promise<SupplierOrderRow | undefined> {
  const db = await getDb();
  const now = new Date();
  const [created] = await db
    .insert(supplierOrders)
    .values({ ...row, state: "sending", attempts: 1, createdAt: now, updatedAt: now })
    .onConflictDoNothing()
    .returning();
  if (created) return created;

  const [retried] = await db
    .update(supplierOrders)
    .set({ state: "sending", attempts: sql`${supplierOrders.attempts} + 1`, updatedAt: now })
    .where(
      and(
        eq(supplierOrders.orderId, row.orderId),
        eq(supplierOrders.fromCountry, row.fromCountry),
        or(
          eq(supplierOrders.state, "error"),
          and(eq(supplierOrders.state, "sending"), lt(supplierOrders.updatedAt, new Date(now.getTime() - STALE_SENDING_MS))),
        ),
      ),
    )
    .returning();
  return retried;
}

/** Enregistre l'état CJ d'un groupe. */
async function saveShipment(
  id: number,
  detail: CjOrderDetail,
  values: { state: SupplierState; error: string | null; logisticName?: string },
) {
  const db = await getDb();
  const now = new Date();
  await db
    .update(supplierOrders)
    .set({
      state: values.state,
      error: values.error,
      cjOrderId: detail.cjOrderId ?? detail.orderId,
      cjStatus: [detail.orderStatus, detail.subStatus].filter(Boolean).join(" / "),
      ...((detail.logisticName ?? values.logisticName) && { logisticName: detail.logisticName ?? values.logisticName }),
      ...(detail.orderAmount != null && { amountUsdCents: Math.round(detail.orderAmount * 100) }),
      trackNumber: detail.trackNumber || null,
      trackingUrl: detail.trackingUrl || null,
      updatedAt: now,
      syncedAt: now,
    })
    .where(eq(supplierOrders.id, id));
}

/**
 * Transmet à CJ une commande payée. Sans effet si elle l'est déjà : on peut l'appeler
 * autant de fois que voulu, seuls les groupes en échec sont retentés.
 */
export async function forwardOrderToSupplier(orderId: number): Promise<void> {
  const mode = supplierMode();
  if (mode === "off") return;

  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.status !== "paid") return;
  // Une commande au paiement simulé ou de test ne part jamais en vraie commande CJ.
  const sandbox = mode === "sandbox" || !order.paymentProvider || TEST_PAYMENT_PROVIDERS.includes(order.paymentProvider);

  let groups: Map<string, OrderItemRow[]>;
  try {
    groups = groupByWarehouse(await db.select().from(orderItems).where(eq(orderItems.orderId, orderId)));
  } catch (error) {
    console.error(`[CJ] ${order.number} :`, errorMessage(error));
    await addSupplierEvent(orderId, `Transmission à CJ impossible : ${errorMessage(error)}.`);
    return;
  }

  let catalog: SupplierCatalog | undefined;
  let request: CjRequest | undefined;
  for (const [fromCountry, items] of groups) {
    const row = await claimShipment({
      orderId,
      fromCountry,
      reference: `${sandbox ? "TEST-" : ""}${order.number}${groups.size > 1 ? `-${fromCountry}` : ""}`,
      sandbox,
    });
    if (!row) continue; // déjà transmise, ou transmission en cours ailleurs

    try {
      catalog ??= await getSupplierCatalog();
      request ??= await openCjSession();
      const logisticName = chooseLogistic(catalog, items, order.shippingMethod);
      const { detail, warning } = await placeCjOrder(request, {
        reference: row.reference,
        createdAt: order.createdAt,
        recipient: order,
        fromCountry,
        logisticName,
        products: items.map((item) => ({ vid: item.cjVid, quantity: item.quantity })),
        sandbox: row.sandbox,
      });
      const state = supplierStateFromCj(detail) ?? "sent";
      const error = state === "unpaid" ? (warning ?? UNPAID_MESSAGE) : null;
      await saveShipment(row.id, detail, { state, error, logisticName });

      const label = `${detail.cjOrderId ?? detail.orderId}${row.sandbox ? " (mode test)" : ""}${groups.size > 1 ? `, depuis ${fromCountry}` : ""}`;
      await addSupplierEvent(
        orderId,
        error
          ? `Créée chez CJ mais pas payée (${label}) : ${error}.`
          : `Transmise à CJ : ${label}, ${detail.logisticName ?? logisticName}, ${amount(detail.orderAmount)} payés sur le solde CJ.`,
      );
    } catch (error) {
      const message = errorMessage(error);
      console.error(`[CJ] transmission de ${row.reference} impossible :`, message);
      await db
        .update(supplierOrders)
        .set({ state: "error", error: message, updatedAt: new Date() })
        .where(eq(supplierOrders.id, row.id));
      // Pas de doublon dans l'historique quand la tâche planifiée réessaie avec la même erreur.
      if (row.attempts === 1 || row.error !== message) {
        await addSupplierEvent(
          orderId,
          `Transmission à CJ impossible (essai n° ${row.attempts}) : ${message}. Nouvel essai automatique.`,
        );
      }
    }
  }

  await reconcileOrder(orderId);
}

/**
 * Relit chez CJ l'état des commandes en cours et reporte suivi, expédition et livraison
 * sur les commandes clients. Retente aussi les transmissions en échec et rattrape les
 * commandes payées jamais transmises.
 */
export async function syncSupplierOrders({
  orderId,
  staleMinutes = 0,
  limit = 30,
}: {
  /** Une seule commande (sinon toutes). */
  orderId?: number;
  /** Ne relit que les commandes CJ consultées il y a plus de N minutes. */
  staleMinutes?: number;
  limit?: number;
} = {}): Promise<{ forwarded: number; checked: number }> {
  if (supplierMode() === "off") return { forwarded: 0, checked: 0 };
  const db = await getDb();
  const now = Date.now();
  const ofOrder = orderId === undefined ? undefined : eq(supplierOrders.orderId, orderId);

  // 1. Transmissions à (re)faire : échecs, envois interrompus, commandes payées sans commande CJ.
  const failed = await db
    .selectDistinct({ orderId: supplierOrders.orderId })
    .from(supplierOrders)
    .where(
      and(
        ofOrder,
        or(
          eq(supplierOrders.state, "error"),
          and(eq(supplierOrders.state, "sending"), lt(supplierOrders.updatedAt, new Date(now - STALE_SENDING_MS))),
        ),
      ),
    )
    .limit(limit);
  const missing = await db
    .select({ orderId: orders.id })
    .from(orders)
    .where(
      and(
        orderId === undefined ? undefined : eq(orders.id, orderId),
        eq(orders.status, "paid"),
        gt(orders.paidAt, new Date(now - CATCH_UP_MS)),
        lt(orders.paidAt, new Date(now - 2 * 60_000)),
        notExists(db.select({ id: supplierOrders.id }).from(supplierOrders).where(eq(supplierOrders.orderId, orders.id))),
      ),
    )
    .limit(limit);
  const toForward = new Set([...failed, ...missing].map((row) => row.orderId));
  for (const id of toForward) await forwardOrderToSupplier(id);

  // 2. Suivi des commandes CJ en cours, les moins récemment consultées d'abord.
  const rows = await db
    .select()
    .from(supplierOrders)
    .where(
      and(
        ofOrder,
        inArray(supplierOrders.state, ACTIVE_STATES),
        staleMinutes > 0
          ? or(isNull(supplierOrders.syncedAt), lt(supplierOrders.syncedAt, new Date(now - staleMinutes * 60_000)))
          : undefined,
      ),
    )
    .orderBy(asc(supplierOrders.syncedAt))
    .limit(limit);
  if (rows.length === 0) return { forwarded: toForward.size, checked: 0 };

  const request = await openCjSession();
  const changed = new Set<number>();
  for (const row of rows) {
    try {
      const detail = await getCjOrder(request, row.reference);
      const state = supplierStateFromCj(detail) ?? row.state;
      await saveShipment(row.id, detail, { state, error: state === "unpaid" ? (row.error ?? UNPAID_MESSAGE) : null });
      if (state !== row.state || (detail.trackNumber || null) !== row.trackNumber) changed.add(row.orderId);
      if (state === row.state) continue;
      if (row.state === "unpaid" && state !== "cancelled") {
        await addSupplierEvent(row.orderId, `Payée chez CJ : commande ${detail.cjOrderId ?? detail.orderId}, ${amount(detail.orderAmount)}.`);
      }
      if (state === "cancelled") {
        await addSupplierEvent(
          row.orderId,
          `CJ a annulé la commande ${detail.cjOrderId ?? detail.orderId} : vérifie dans ton espace CJ, puis renvoie-la ou rembourse le client.`,
        );
      }
    } catch (error) {
      console.error(`[CJ] suivi de ${row.reference} impossible :`, errorMessage(error));
    }
  }
  for (const id of changed) await reconcileOrder(id);
  return { forwarded: toForward.size, checked: rows.length };
}

/** Nom du transporteur montré au client. */
function carrierLabel(rows: SupplierOrderRow[]): string {
  return rows.every((row) => row.logisticName?.startsWith("DHL")) ? "DHL" : "international";
}

/**
 * Reporte l'état des commandes CJ sur la commande du client : en préparation dès que
 * tout est payé chez CJ, expédiée avec les numéros de suivi, puis livrée.
 */
async function reconcileOrder(orderId: number): Promise<void> {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return;
  const rows = await db.select().from(supplierOrders).where(eq(supplierOrders.orderId, orderId));
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const expected = new Set(items.map((item) => getProduct(item.productSlug)?.cj.shipFrom)).size;
  const all = (states: SupplierState[]) =>
    rows.length === expected && rows.every((row) => states.includes(row.state));

  let status = order.status;
  if (status === "paid" && all(["sent", "shipped", "delivered"])) {
    await changeOrderStatus(order.number, "processing");
    status = "processing";
  }
  if ((status === "processing" || status === "shipped") && all(["shipped", "delivered"])) {
    const tracking = rows.map((row) => row.trackNumber).filter(Boolean).join(", ");
    if (tracking && rows.every((row) => row.trackNumber) && tracking !== order.trackingNumber) {
      await setTracking(order.number, carrierLabel(rows), tracking);
      status = "shipped";
    }
  }
  if (status === "shipped" && all(["delivered"])) {
    await changeOrderStatus(order.number, "delivered");
  }
}

/** Commandes CJ d'une commande client, pour l'administration. */
export async function getSupplierOrders(orderId: number): Promise<SupplierOrderRow[]> {
  const db = await getDb();
  return db.select().from(supplierOrders).where(eq(supplierOrders.orderId, orderId)).orderBy(supplierOrders.id);
}

/** Commandes CJ de plusieurs commandes clients, regroupées par commande. */
export async function getSupplierOrdersFor(orderIds: number[]): Promise<Map<number, SupplierOrderRow[]>> {
  const db = await getDb();
  const rows = orderIds.length
    ? await db.select().from(supplierOrders).where(inArray(supplierOrders.orderId, orderIds))
    : [];
  const byOrder = new Map<number, SupplierOrderRow[]>();
  for (const row of rows) byOrder.set(row.orderId, [...(byOrder.get(row.orderId) ?? []), row]);
  return byOrder;
}
