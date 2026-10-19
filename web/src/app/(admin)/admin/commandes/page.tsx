import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Inbox, Search } from "lucide-react";
import { formatDateTime, StatusBadge } from "@/components/admin/status-badge";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/auth/admin";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { listOrders, orderStats } from "@/lib/orders/service";
import { isOrderStatus, ORDER_STATUSES, statusLabels, type OrderStatus } from "@/lib/orders/status";

export const metadata: Metadata = {
  title: "Commandes",
};

type SearchParams = PageProps<"/admin/commandes">["searchParams"];

export default function OrdersPage({ searchParams }: PageProps<"/admin/commandes">) {
  return (
    <Container className="pt-10">
      <h1 className="text-4xl font-semibold tracking-tight">Commandes</h1>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-[24px] bg-white/60" aria-busy="true" />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white p-5 ring-1 ring-black/5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

async function OrdersContent({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = isOrderStatus(params.statut) ? params.statut : undefined;
  const query = typeof params.q === "string" ? params.q : "";

  const [rows, stats] = await Promise.all([listOrders({ status, query }), orderStats()]);
  const countOf = (s: OrderStatus) => stats.find((row) => row.status === s)?.orders ?? 0;
  const totalCount = stats.reduce((sum, row) => sum + row.orders, 0);
  const revenue = stats
    .filter((row) => !["pending_payment", "cancelled", "refunded"].includes(row.status))
    .reduce((sum, row) => sum + row.revenue, 0);

  const filterHref = (s?: OrderStatus) => {
    const search = new URLSearchParams();
    if (s) search.set("statut", s);
    if (query) search.set("q", query);
    const qs = search.toString();
    return qs ? `/admin/commandes?${qs}` : "/admin/commandes";
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="À traiter (payées)" value={String(countOf("paid"))} />
        <StatCard label="En préparation" value={String(countOf("processing"))} />
        <StatCard label="Expédiées" value={String(countOf("shipped"))} />
        <StatCard label="Chiffre d'affaires TTC" value={formatPrice(revenue)} />
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
          <Link
            href={filterHref()}
            className={cn("rounded-full px-3 py-1.5 text-sm", !status ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink/30")}
          >
            Toutes ({totalCount})
          </Link>
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s}
              href={filterHref(s)}
              className={cn("rounded-full px-3 py-1.5 text-sm", status === s ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink/30")}
            >
              {statusLabels[s]} ({countOf(s)})
            </Link>
          ))}
        </nav>
        <form action="/admin/commandes" className="flex items-center gap-2 rounded-full bg-white px-4 ring-1 ring-line focus-within:ring-ink">
          {status && <input type="hidden" name="statut" value={status} />}
          <Search className="size-4 text-muted" aria-hidden />
          <label htmlFor="recherche" className="sr-only">
            Rechercher une commande
          </label>
          <input
            id="recherche"
            name="q"
            defaultValue={query}
            placeholder="Numéro, e-mail ou nom"
            className="h-10 w-64 bg-transparent text-sm focus:outline-none"
          />
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-[24px] bg-white py-16 text-center ring-1 ring-black/5">
          <Inbox className="size-8 text-faint" aria-hidden />
          <p className="mt-4 font-medium">Aucune commande{status || query ? " pour ce filtre" : " pour l'instant"}.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[24px] bg-white ring-1 ring-black/5">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-5 py-3 font-normal">Commande</th>
                <th className="px-5 py-3 font-normal">Date</th>
                <th className="px-5 py-3 font-normal">Client</th>
                <th className="px-5 py-3 font-normal">Robots</th>
                <th className="px-5 py-3 text-right font-normal">Total</th>
                <th className="px-5 py-3 font-normal">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((order) => (
                <tr key={order.id} className="hover:bg-canvas">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/commandes/${order.number}`} className="font-mono font-medium hover:underline">
                      {order.number}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{formatDateTime(order.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <span className="block">
                      {order.firstName} {order.lastName}
                    </span>
                    <span className="text-muted">{order.email}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {order.items.map((item) => `${item.quantity} × ${item.productName}`).join(", ")}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
