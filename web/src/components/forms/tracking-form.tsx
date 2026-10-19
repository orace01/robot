"use client";

import { useState } from "react";
import { CircleCheck, LoaderCircle, MapPin, PackageCheck, Search, Truck, XCircle } from "lucide-react";
import { trackOrder, type TrackedOrder } from "@/app/(boutique)/suivi/actions";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { addDays, formatShortDate } from "@/lib/format";
import { statusTones, type OrderStatus } from "@/lib/orders/status";

/** Étapes affichées au client, dans l'ordre. */
const steps: { status: OrderStatus; title: string; icon: typeof CircleCheck }[] = [
  { status: "paid", title: "Commande confirmée", icon: CircleCheck },
  { status: "processing", title: "En préparation", icon: PackageCheck },
  { status: "shipped", title: "Expédiée", icon: Truck },
  { status: "delivered", title: "Livrée", icon: MapPin },
];

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${formatShortDate(date)} à ${String(date.getHours()).padStart(2, "0")} h ${String(date.getMinutes()).padStart(2, "0")}`;
}

function OrderTimeline({ order }: { order: TrackedOrder }) {
  const placedAt = new Date(order.placedAt);
  const stopped = order.status === "cancelled" || order.status === "refunded";
  const reached = steps.findIndex((step) => step.status === order.status);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">Commande {order.number}</p>
        <span className={cn("rounded-full px-3 py-1 text-sm font-medium", statusTones[order.status])}>
          {order.statusLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")} · passée le{" "}
        {formatShortDate(placedAt)}
      </p>

      {stopped ? (
        <p className="mt-8 flex items-center gap-3 rounded-[16px] bg-red-50 p-4 text-red-800">
          <XCircle className="size-5 shrink-0" aria-hidden /> Cette commande a été {order.status === "cancelled" ? "annulée" : "remboursée"}.
        </p>
      ) : (
        <>
          {order.status !== "delivered" && order.status !== "pending_payment" && (
            <p className="mt-6 rounded-[16px] bg-canvas p-4 text-sm">
              Livraison estimée entre le{" "}
              <span className="font-medium">{formatShortDate(addDays(placedAt, order.deliveryMinDays))}</span> et le{" "}
              <span className="font-medium">{formatShortDate(addDays(placedAt, order.deliveryMaxDays))}</span>.
            </p>
          )}
          <ol className="mt-8">
            {steps.map((step, i) => {
              const done = i <= reached;
              const Icon = step.icon;
              return (
                <li key={step.status} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < steps.length - 1 && (
                    <span aria-hidden className={cn("absolute top-10 bottom-0 left-5 w-px", i < reached ? "bg-ink" : "bg-line")} />
                  )}
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full",
                      done ? "bg-ink text-white" : "bg-mist text-faint",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <p className={cn("pt-2 font-medium", !done && "text-muted")}>{step.title}</p>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {order.trackingNumber && (
        <p className="mt-8 rounded-[16px] bg-accent-soft p-4 text-sm text-accent-strong">
          Numéro de suivi {order.carrier} : <span className="font-mono font-medium">{order.trackingNumber}</span>
        </p>
      )}

      <h3 className="mt-8 text-sm font-semibold">Historique</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {[...order.events].reverse().map((event) => (
          <li key={`${event.date}-${event.message}`} className="flex flex-wrap justify-between gap-x-4 border-b border-line pb-2">
            <span>{event.message}</span>
            <span className="text-muted">{formatDateTime(event.date)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function TrackingForm() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^CL-\d{6}$/i.test(number.trim())) {
      setError("Le numéro de commande ressemble à CL-123456 (voir l'e-mail de confirmation).");
      return;
    }
    setError(undefined);
    setSearching(true);
    const result = await trackOrder(number, email);
    setSearching(false);
    if (result.ok) setOrder(result.order);
    else {
      setOrder(null);
      setError(result.message);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:col-span-5">
        <h2 className="text-2xl font-semibold tracking-tight">Retrouver ma commande</h2>
        <Field
          label="Numéro de commande"
          name="numero"
          placeholder="CL-123456"
          required
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          error={error}
          hint="Il figure dans l'e-mail de confirmation."
        />
        <Field
          label="Adresse e-mail"
          name="email-suivi"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" disabled={searching}>
          {searching ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
          ) : (
            <Search className="size-4" aria-hidden />
          )}
          Suivre ma commande
        </Button>
      </form>

      <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:col-span-7" aria-live="polite">
        {order ? (
          <OrderTimeline order={order} />
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
            <Truck className="size-10 stroke-[1.2] text-faint" aria-hidden />
            <p className="mt-4 max-w-xs text-ink-soft">
              Saisissez votre numéro de commande et votre adresse e-mail pour voir où en est votre colis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
