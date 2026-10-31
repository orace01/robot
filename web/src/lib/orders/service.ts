import "server-only";

import { randomInt } from "node:crypto";
import { and, count, desc, eq, inArray, like, or, sum } from "drizzle-orm";
import { getDb } from "@/db";
import { orderEvents, orderItems, orders, type OrderEventRow, type OrderItemRow, type OrderRow } from "@/db/schema";
import type { ShippingOffer } from "@/lib/delivery";
import type { CustomerFields } from "./checkout";
import { canTransition, statusLabels, type OrderStatus } from "./status";

export interface NewOrderItem {
  slug: string;
  name: string;
  sku: string;
  vid: string;
  unitPrice: number;
  quantity: number;
}

export interface NewOrder {
  customer: CustomerFields;
  newsletter: boolean;
  items: NewOrderItem[];
  shipping: ShippingOffer;
  subtotal: number;
  vat: number;
  total: number;
}

export interface OrderWithDetails extends OrderRow {
  items: OrderItemRow[];
  events: OrderEventRow[];
}

/** Message affiché au client pour chaque statut. */
const statusMessages: Record<OrderStatus, string> = {
  pending_payment: "Commande enregistrée",
  paid: "Paiement confirmé",
  processing: "Commande en préparation",
  shipped: "Colis expédié",
  delivered: "Colis livré",
  cancelled: "Commande annulée",
  refunded: "Commande remboursée",
};

export class OrderError extends Error {
  name = "OrderError";
}

async function newOrderNumber(): Promise<string> {
  const db = await getDb();
  for (let attempt = 0; attempt < 10; attempt++) {
    const number = `CL-${randomInt(100000, 1000000)}`;
    const [existing] = await db.select({ id: orders.id }).from(orders).where(eq(orders.number, number)).limit(1);
    if (!existing) return number;
  }
  throw new OrderError("Impossible d'attribuer un numéro de commande.");
}

export async function createOrder(input: NewOrder): Promise<OrderRow> {
  const db = await getDb();
  const number = await newOrderNumber();
  const now = new Date();

  return db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        number,
        status: "pending_payment",
        ...input.customer,
        newsletter: input.newsletter,
        shippingMethod: input.shipping.id,
        shippingLabel: input.shipping.label,
        shippingPrice: input.shipping.price,
        deliveryMinDays: input.shipping.range.minDays,
        deliveryMaxDays: input.shipping.range.maxDays,
        subtotal: input.subtotal,
        vat: input.vat,
        total: input.total,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await tx.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        productSlug: item.slug,
        productName: item.name,
        cjSku: item.sku,
        cjVid: item.vid,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.unitPrice * item.quantity,
      })),
    );

    await tx.insert(orderEvents).values({
      orderId: order.id,
      type: "status",
      status: "pending_payment",
      message: statusMessages.pending_payment,
      visibleToCustomer: true,
      createdAt: now,
    });

    return order;
  });
}

const paidMessages: Record<string, string> = {
  simulation: "Paiement confirmé (simulation)",
  mepaye_test: "Paiement confirmé (paiement de test)",
};

/** Rattache à la commande le paiement en cours (page de paiement ouverte, pas encore payé). */
export async function attachPayment(orderId: number, payment: { provider: string; reference: string }) {
  const db = await getDb();
  await db
    .update(orders)
    .set({ paymentProvider: payment.provider, paymentReference: payment.reference, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

/**
 * Enregistre le paiement d'une commande. Renvoie false si elle n'attendait plus de
 * paiement (déjà payée, annulée…) : rien n'est modifié.
 */
export async function markOrderPaid(orderId: number, payment: { provider: string; reference: string }): Promise<boolean> {
  const db = await getDb();
  const now = new Date();
  return db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) throw new OrderError("Commande introuvable.");
    if (order.status !== "pending_payment") return false;
    await tx
      .update(orders)
      .set({
        status: "paid",
        paymentProvider: payment.provider,
        paymentReference: payment.reference,
        paidAt: now,
        updatedAt: now,
      })
      .where(eq(orders.id, orderId));
    await tx.insert(orderEvents).values({
      orderId,
      type: "status",
      status: "paid",
      message: paidMessages[payment.provider] ?? statusMessages.paid,
      visibleToCustomer: true,
      createdAt: now,
    });
    return true;
  });
}

async function findByNumber(number: string): Promise<OrderRow | undefined> {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.number, number)).limit(1);
  return order;
}

export async function changeOrderStatus(number: string, to: OrderStatus): Promise<void> {
  const db = await getDb();
  const order = await findByNumber(number);
  if (!order) throw new OrderError("Commande introuvable.");
  if (!canTransition(order.status, to)) {
    throw new OrderError(`Impossible de passer de « ${statusLabels[order.status]} » à « ${statusLabels[to]} ».`);
  }
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({
        status: to,
        updatedAt: now,
        ...(to === "paid" && { paidAt: now }),
        ...(to === "shipped" && { shippedAt: now }),
        ...(to === "delivered" && { deliveredAt: now }),
      })
      .where(eq(orders.id, order.id));
    await tx.insert(orderEvents).values({
      orderId: order.id,
      type: "status",
      status: to,
      message: statusMessages[to],
      visibleToCustomer: true,
      createdAt: now,
    });
  });
}

/** Enregistre le numéro de suivi ; la commande passe « Expédiée » si elle était en préparation. */
export async function setTracking(number: string, carrier: string, trackingNumber: string): Promise<void> {
  const db = await getDb();
  const order = await findByNumber(number);
  if (!order) throw new OrderError("Commande introuvable.");
  if (!["paid", "processing", "shipped"].includes(order.status)) {
    throw new OrderError("Le suivi ne peut être ajouté qu'à une commande payée, en préparation ou expédiée.");
  }
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.update(orders).set({ carrier, trackingNumber, updatedAt: now }).where(eq(orders.id, order.id));
    await tx.insert(orderEvents).values({
      orderId: order.id,
      type: "tracking",
      message: `Numéro de suivi ${carrier} : ${trackingNumber}`,
      visibleToCustomer: true,
      createdAt: now,
    });
  });
  if (order.status !== "shipped") {
    if (order.status === "paid") await changeOrderStatus(number, "processing");
    await changeOrderStatus(number, "shipped");
  }
}

export async function addOrderNote(number: string, message: string): Promise<void> {
  const db = await getDb();
  const order = await findByNumber(number);
  if (!order) throw new OrderError("Commande introuvable.");
  await db.insert(orderEvents).values({
    orderId: order.id,
    type: "note",
    message,
    visibleToCustomer: false,
    createdAt: new Date(),
  });
}

/** E-mail envoyé (ou non) au client, consigné dans l'historique (administration seulement). */
export async function addEmailEvent(orderId: number, message: string): Promise<void> {
  const db = await getDb();
  await db.insert(orderEvents).values({
    orderId,
    type: "email",
    message,
    visibleToCustomer: false,
    createdAt: new Date(),
  });
}

/** Échange avec le fournisseur CJ, consigné dans l'historique (administration seulement). */
export async function addSupplierEvent(orderId: number, message: string): Promise<void> {
  const db = await getDb();
  await db.insert(orderEvents).values({
    orderId,
    type: "supplier",
    message,
    visibleToCustomer: false,
    createdAt: new Date(),
  });
}

async function withDetails(order: OrderRow, { customerView = false } = {}): Promise<OrderWithDetails> {
  const db = await getDb();
  const [items, events] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db
      .select()
      .from(orderEvents)
      .where(
        customerView
          ? and(eq(orderEvents.orderId, order.id), eq(orderEvents.visibleToCustomer, true))
          : eq(orderEvents.orderId, order.id),
      )
      .orderBy(orderEvents.createdAt, orderEvents.id),
  ]);
  return { ...order, items, events };
}

export async function getOrder(number: string): Promise<OrderWithDetails | null> {
  const order = await findByNumber(number);
  return order ? withDetails(order) : null;
}

/** Commande vue par le client : il faut le bon numéro ET la bonne adresse e-mail. */
export async function findOrderForCustomer(number: string, email: string): Promise<OrderWithDetails | null> {
  const order = await findByNumber(number.trim().toUpperCase());
  if (!order || order.email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return withDetails(order, { customerView: true });
}

export async function listOrders({ status, query }: { status?: OrderStatus; query?: string } = {}) {
  const db = await getDb();
  const conditions = [];
  if (status) conditions.push(eq(orders.status, status));
  const search = query?.trim();
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(like(orders.number, pattern), like(orders.email, pattern), like(orders.lastName, pattern)));
  }
  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);
  const items = rows.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, rows.map((row) => row.id)))
    : [];
  return rows.map((row) => ({ ...row, items: items.filter((item) => item.orderId === row.id) }));
}

/** Nombre de commandes et chiffre d'affaires TTC par statut. */
export async function orderStats() {
  const db = await getDb();
  const rows = await db
    .select({ status: orders.status, orders: count(), revenue: sum(orders.total) })
    .from(orders)
    .groupBy(orders.status);
  return rows.map((row) => ({ status: row.status, orders: row.orders, revenue: Number(row.revenue ?? 0) }));
}
