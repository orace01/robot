import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { NoteEditor, StatusActions, SupplierActions, TrackingEditor } from "@/components/admin/order-actions";
import { formatDateTime, StatusBadge } from "@/components/admin/status-badge";
import { Container } from "@/components/ui/container";
import type { SupplierOrderRow, SupplierState } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { getUsdPerEur } from "@/lib/cj/exchange";
import { supplierMode } from "@/lib/cj/orders";
import { fastestOption, getSupplierCatalog, importVatUsd, orderableOptions, shippedFromPhrases } from "@/lib/cj/supplier";
import { cn } from "@/lib/cn";
import { addDays, formatPrice, formatShortDate, formatUsd } from "@/lib/format";
import { paymentFees } from "@/lib/margin";
import { getSupplierOrders, supplierStateLabels } from "@/lib/orders/fulfillment";
import { getOrder, type OrderWithDetails } from "@/lib/orders/service";

export const metadata: Metadata = {
  title: "Commande",
};

type Params = PageProps<"/admin/commandes/[numero]">["params"];

export default function OrderPage({ params }: PageProps<"/admin/commandes/[numero]">) {
  return (
    <Container className="pt-8">
      <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Toutes les commandes
      </Link>
      <Suspense fallback={<div className="mt-6 h-[600px] animate-pulse rounded-[24px] bg-white/60" aria-busy="true" />}>
        <OrderContent params={params} />
      </Suspense>
    </Container>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[22px] bg-white p-6 ring-1 ring-black/5", className)}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Coût fournisseur en centimes d'euro : montant réellement facturé par CJ quand toutes les
 * commandes CJ sont passées, sinon estimation au prix CJ du jour (achat, transport, TVA d'import).
 */
async function supplierCost(
  order: OrderWithDetails,
  shipments: SupplierOrderRow[],
): Promise<{ cents: number; billed: boolean } | null> {
  const exchange = await getUsdPerEur();
  const toCents = (usd: number) => Math.round((usd / exchange.rate) * 100);
  if (shipments.length > 0 && shipments.every((row) => row.amountUsdCents !== null && row.state !== "cancelled")) {
    return { cents: toCents(shipments.reduce((sum, row) => sum + row.amountUsdCents! / 100, 0)), billed: true };
  }

  const catalog = await getSupplierCatalog();
  let usd = 0;
  for (const item of order.items) {
    const info = catalog[item.cjSku];
    const options = orderableOptions(info);
    const option = order.shippingMethod === "express" ? fastestOption(options) : options[0];
    if (!info || !option) return null;
    usd += (info.costUsd + option.totalUsd + importVatUsd(info)) * item.quantity;
  }
  return { cents: toCents(usd), billed: false };
}

const supplierTones: Record<SupplierState, string> = {
  sending: "bg-mist text-ink-soft",
  sent: "bg-accent-soft text-accent-strong",
  unpaid: "bg-red-50 text-red-800",
  shipped: "bg-indigo-50 text-indigo-800",
  delivered: "bg-green-50 text-green-800",
  cancelled: "bg-red-50 text-red-800",
  error: "bg-red-50 text-red-800",
};

const modeLabels = {
  off: "Transmission automatique désactivée (CJ_ORDER_MODE=off).",
  sandbox: "Mode test CJ : commandes de test, sans envoi ni débit réels.",
  live: "Mode réel : commandes payées automatiquement sur le solde CJ.",
};

function SupplierShipment({ row }: { row: SupplierOrderRow }) {
  const trackingUrl = row.trackingUrl ?? (row.trackNumber && `https://t.17track.net/fr#nums=${encodeURIComponent(row.trackNumber)}`);
  return (
    <li className="rounded-[14px] bg-canvas p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", supplierTones[row.state])}>
          {supplierStateLabels[row.state]}
        </span>
        {row.sandbox && <span className="eyebrow rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">Test</span>}
      </div>
      <dl className="mt-3 space-y-1 text-xs">
        {[
          ["Numéro envoyé", <span key="ref" className="font-mono">{row.reference}</span>],
          ["Commande CJ", row.cjOrderId ? <span key="cj" className="font-mono">{row.cjOrderId}</span> : "—"],
          ["Statut CJ", row.cjStatus || "—"],
          ["Entrepôt", `Expédié ${shippedFromPhrases[row.fromCountry] ?? row.fromCountry}`],
          ["Transporteur", row.logisticName ?? "—"],
          ["Facturé par CJ", row.amountUsdCents === null ? "—" : formatUsd(row.amountUsdCents / 100)],
          [
            "Suivi",
            trackingUrl ? (
              <a key="track" href={trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-accent-strong hover:underline">
                {row.trackNumber} <ExternalLink className="size-3" aria-hidden />
              </a>
            ) : (
              "—"
            ),
          ],
          ["Essais", String(row.attempts)],
          ["Dernière lecture", row.syncedAt ? formatDateTime(row.syncedAt) : "—"],
        ].map(([label, value]) => (
          <div key={label as string} className="flex justify-between gap-3">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right">{value}</dd>
          </div>
        ))}
      </dl>
      {row.error && <p className="mt-3 rounded-[10px] bg-red-50 p-2.5 text-xs text-red-800">{row.error}</p>}
    </li>
  );
}

async function OrderContent({ params }: { params: Params }) {
  await requireAdmin();
  const { numero } = await params;
  const order = await getOrder(decodeURIComponent(numero));
  if (!order) notFound();

  const shipments = await getSupplierOrders(order.id);
  const cost = await supplierCost(order, shipments);
  const fees = Math.round(order.total * paymentFees.rate + paymentFees.fixedCents);
  const margin = cost === null ? null : order.total - order.vat - cost.cents - fees;
  const mode = supplierMode();
  const start = order.paidAt ?? order.createdAt;
  const canTrack = ["paid", "processing", "shipped"].includes(order.status);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-semibold tracking-tight">{order.number}</h1>
        <StatusBadge status={order.status} className="text-sm" />
        <p className="text-sm text-muted">passée le {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card title="Articles">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5">
                      <span className="block font-medium">{item.productName}</span>
                      <span className="eyebrow text-faint">
                        CJ {item.cjSku} · variante {item.cjVid}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-muted tabular-nums">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Sous-total</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{order.shippingLabel}</dt>
                <dd className="tabular-nums">{order.shippingPrice === 0 ? "Offerte" : formatPrice(order.shippingPrice)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total TTC</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <dt>dont TVA</dt>
                <dd className="tabular-nums">{formatPrice(order.vat)}</dd>
              </div>
            </dl>
          </Card>

          <Card title={cost?.billed ? "Marge" : "Marge estimée"}>
            {margin === null || cost === null ? (
              <p className="text-sm text-muted">Données CJ indisponibles pour l&apos;estimer.</p>
            ) : (
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Total hors TVA</dt>
                  <dd className="tabular-nums">{formatPrice(order.total - order.vat)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">
                    {cost.billed
                      ? "Coût CJ facturé (achat, transport, TVA d'import)"
                      : "Coût CJ estimé (achat, transport, TVA d'import, au prix du jour)"}
                  </dt>
                  <dd className="tabular-nums">− {formatPrice(cost.cents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Frais de paiement ({Math.round(paymentFees.rate * 100)} %)</dt>
                  <dd className="tabular-nums">− {formatPrice(fees)}</dd>
                </div>
                <div className={cn("flex justify-between text-base font-semibold", margin < 0 && "text-red-700")}>
                  <dt>Marge brute</dt>
                  <dd className="tabular-nums">{formatPrice(margin)}</dd>
                </div>
              </dl>
            )}
          </Card>

          <Card title="Historique">
            <ol className="space-y-3 text-sm">
              {[...order.events].reverse().map((event) => (
                <li
                  key={event.id}
                  className={cn(
                    "flex flex-wrap justify-between gap-x-4 rounded-[12px] px-3 py-2",
                    event.type === "note"
                      ? "bg-amber-50"
                      : event.type === "supplier"
                        ? "bg-accent-soft/50"
                        : event.type === "email"
                          ? "bg-green-50"
                          : "bg-canvas",
                  )}
                >
                  <span>
                    {event.type === "note" && <span className="eyebrow mr-2 text-amber-800">Note</span>}
                    {event.type === "supplier" && <span className="eyebrow mr-2 text-accent-strong">CJ</span>}
                    {event.type === "email" && <span className="eyebrow mr-2 text-green-800">E-mail</span>}
                    {event.message}
                    {!event.visibleToCustomer && event.type === "status" && (
                      <span className="ml-2 text-xs text-muted">(interne)</span>
                    )}
                  </span>
                  <span className="text-muted">{formatDateTime(event.createdAt)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-line pt-5">
              <NoteEditor number={order.number} />
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Card title="Actions">
            <StatusActions number={order.number} status={order.status} />
          </Card>

          <Card title="Fournisseur CJ">
            {shipments.length === 0 ? (
              <p className="text-sm text-muted">
                {order.status === "paid" && mode !== "off"
                  ? "Transmission en attente : elle part toute seule après le paiement."
                  : "Pas transmise à CJ."}
              </p>
            ) : (
              <ul className="space-y-3">
                {shipments.map((row) => (
                  <SupplierShipment key={row.id} row={row} />
                ))}
              </ul>
            )}
            <div className="mt-4">
              <SupplierActions
                number={order.number}
                canSend={
                  mode !== "off" &&
                  order.status === "paid" &&
                  (shipments.length === 0 || shipments.some((row) => row.state === "error"))
                }
                canRefresh={shipments.length > 0}
              />
            </div>
            <p className="mt-3 text-xs text-muted">{modeLabels[mode]}</p>
          </Card>

          {canTrack && (
            <Card title="Suivi du colis">
              <TrackingEditor number={order.number} carrier={order.carrier} trackingNumber={order.trackingNumber} />
              <p className="mt-3 text-xs text-muted">
                Rempli automatiquement quand CJ expédie. À saisir ici seulement en cas de besoin : visible par le
                client, la commande passe en « Expédiée ».
              </p>
            </Card>
          )}

          <Card title="Client">
            <p className="font-medium">
              {order.firstName} {order.lastName}
            </p>
            <p className="mt-1 text-sm">
              <a href={`mailto:${order.email}`} className="text-accent-strong hover:underline">
                {order.email}
              </a>
            </p>
            <p className="text-sm">
              <a href={`tel:${order.phone.replace(/\s/g, "")}`} className="hover:underline">
                {order.phone}
              </a>
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              {order.address1}
              {order.address2 && (
                <>
                  <br />
                  {order.address2}
                </>
              )}
              <br />
              {order.postalCode} {order.city}, France
            </p>
            {order.newsletter && <p className="mt-3 text-xs text-muted">Inscrit à la newsletter</p>}
          </Card>

          <Card title="Livraison et paiement">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Mode</dt>
                <dd className="text-right">{order.shippingLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Livraison promise</dt>
                <dd className="text-right">
                  {formatShortDate(addDays(start, order.deliveryMinDays))} – {formatShortDate(addDays(start, order.deliveryMaxDays))}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Paiement</dt>
                <dd className="text-right">
                  {order.paidAt
                    ? `${order.paymentProvider} · ${order.paymentReference}`
                    : order.paymentProvider
                      ? `En attente (${order.paymentProvider} · ${order.paymentReference})`
                      : "Non payé"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
