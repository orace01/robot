import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { NoteEditor, StatusActions, TrackingEditor } from "@/components/admin/order-actions";
import { formatDateTime, StatusBadge } from "@/components/admin/status-badge";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/auth/admin";
import { getUsdPerEur } from "@/lib/cj/exchange";
import { getSupplierCatalog } from "@/lib/cj/supplier";
import { cn } from "@/lib/cn";
import { addDays, formatPrice, formatShortDate } from "@/lib/format";
import { paymentFees } from "@/lib/margin";
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

/** Coût fournisseur estimé d'après les prix CJ du moment (achat + transport). */
async function estimateSupplierCost(order: OrderWithDetails): Promise<number | null> {
  const [catalog, exchange] = await Promise.all([getSupplierCatalog(), getUsdPerEur()]);
  let usd = 0;
  for (const item of order.items) {
    const info = catalog[item.cjSku];
    if (!info || info.options.length === 0) return null;
    const option =
      order.shippingMethod === "express"
        ? [...info.options].sort((a, b) => a.maxDays - b.maxDays || a.totalUsd - b.totalUsd)[0]
        : info.options[0];
    usd += (info.costUsd + option.totalUsd) * item.quantity;
  }
  return Math.round((usd / exchange.rate) * 100);
}

async function OrderContent({ params }: { params: Params }) {
  await requireAdmin();
  const { numero } = await params;
  const order = await getOrder(decodeURIComponent(numero));
  if (!order) notFound();

  const supplierCost = await estimateSupplierCost(order);
  const fees = Math.round(order.total * paymentFees.rate + paymentFees.fixedCents);
  const margin = supplierCost === null ? null : order.total - order.vat - supplierCost - fees;
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

          <Card title="Marge estimée">
            {margin === null || supplierCost === null ? (
              <p className="text-sm text-muted">Données CJ indisponibles pour l&apos;estimer.</p>
            ) : (
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Total hors TVA</dt>
                  <dd className="tabular-nums">{formatPrice(order.total - order.vat)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Coût CJ (achat + transport, au prix du jour)</dt>
                  <dd className="tabular-nums">− {formatPrice(supplierCost)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Frais de paiement estimés</dt>
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
                    event.type === "note" ? "bg-amber-50" : "bg-canvas",
                  )}
                >
                  <span>
                    {event.type === "note" && <span className="eyebrow mr-2 text-amber-800">Note</span>}
                    {event.message}
                    {!event.visibleToCustomer && event.type !== "note" && (
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

          {canTrack && (
            <Card title="Suivi du colis">
              <TrackingEditor number={order.number} carrier={order.carrier} trackingNumber={order.trackingNumber} />
              <p className="mt-3 text-xs text-muted">
                Visible par le client sur la page « Suivre ma commande ». La commande passe en « Expédiée ».
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
                  {order.paymentProvider ? `${order.paymentProvider} · ${order.paymentReference}` : "Non payé"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Commande CJ</dt>
                <dd className="text-right">{order.supplierOrderId ?? "Pas encore transmise"}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
