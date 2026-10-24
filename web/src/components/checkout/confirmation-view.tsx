"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import Link from "next/link";
import { Check, CircleCheck, Clock, LoaderCircle, Lock, Mail, PackageCheck, Truck } from "lucide-react";
import { checkPayment, resumePayment } from "@/app/(tunnel)/commande/actions";
import { MockupBadge } from "@/components/ui/badges";
import { Button, ButtonLink } from "@/components/ui/button";
import { cart } from "@/lib/cart";
import { addDays, formatPrice, formatShortDate } from "@/lib/format";
import { getOrderSnapshot, parseOrder, type PlacedOrder } from "@/lib/order";
import type { OrderStatus } from "@/lib/orders/status";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";

const noop = () => () => {};

/** Vérification du paiement : toutes les 3 secondes pendant une minute environ. */
const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 20;
const PAID: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];

/** Statut de la commande côté serveur ; undefined tant que la première réponse n'est pas arrivée. */
function useOrderStatus(order: PlacedOrder) {
  const [state, setState] = useState<{ status?: OrderStatus | null; polling: boolean }>({ polling: true });
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    async function poll() {
      const status = await checkPayment(order.number, order.email).catch(() => undefined);
      if (stopped) return;
      attempts += 1;
      const again = (status === "pending_payment" || status === undefined) && attempts < POLL_ATTEMPTS;
      setState({ status, polling: again });
      if (again) timer = setTimeout(poll, POLL_INTERVAL_MS);
    }
    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [order.number, order.email]);
  return state;
}

export function ConfirmationView() {
  // undefined côté serveur (chargement), null si aucune commande en mémoire.
  const raw = useSyncExternalStore(noop, getOrderSnapshot, () => undefined);
  const order = useMemo(() => (raw === undefined ? undefined : parseOrder(raw)), [raw]);

  if (order === undefined) {
    return <div className="h-96 animate-pulse rounded-[28px] bg-white/60" aria-busy="true" />;
  }

  if (order === null) {
    return <NoOrder />;
  }
  if (order.payment === "online") return <OnlinePayment order={order} />;
  return <ConfirmedOrder order={order} />;
}

function NoOrder() {
  return (
    <div className="mx-auto max-w-lg rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-black/5">
      <p className="text-2xl font-semibold tracking-tight">Aucune commande récente</p>
      <p className="mt-2 text-ink-soft">
        Retrouvez l&apos;état de vos commandes avec votre numéro de commande et votre adresse e-mail.
      </p>
      <ButtonLink href="/suivi" size="lg" className="mt-8">
        Suivre une commande
      </ButtonLink>
    </div>
  );
}

/** Retour de la page de paiement Mepaye : on attend la confirmation envoyée par Mepaye au serveur. */
function OnlinePayment({ order }: { order: PlacedOrder }) {
  const { status, polling } = useOrderStatus(order);
  const paid = status ? PAID.includes(status) : false;

  useEffect(() => {
    if (paid) cart.clear();
  }, [paid]);

  if (paid) return <ConfirmedOrder order={order} />;
  if (status === "cancelled" || status === "refunded") {
    return (
      <Message title="Commande annulée">
        La commande <span className="font-semibold text-ink">{order.number}</span> a été annulée. Vous pouvez repasser
        commande depuis votre panier.
      </Message>
    );
  }
  return <PaymentPending order={order} checking={polling} />;
}

function Message({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-[28px] bg-white px-6 py-14 text-center ring-1 ring-black/5 sm:px-12">
      <p className="text-2xl font-semibold tracking-tight">{title}</p>
      <p className="mt-3 text-ink-soft">{children}</p>
      {action}
    </div>
  );
}

function PaymentPending({ order, checking }: { order: PlacedOrder; checking: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const pay = () =>
    startTransition(async () => {
      setError(undefined);
      const result = await resumePayment(order.number, order.email);
      if (result.ok) window.location.assign(result.paymentUrl);
      else setError(result.message);
    });

  return (
    <Message
      title={checking ? "Confirmation du paiement…" : "Paiement en attente"}
      action={
        <div className="mt-8 flex flex-col items-center gap-3">
          {checking && <LoaderCircle className="size-6 animate-spin text-muted" aria-hidden />}
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={pay} disabled={pending}>
              {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
              Payer {formatPrice(order.total)}
            </Button>
            <ButtonLink href="/panier" variant="secondary" size="lg">
              Modifier mon panier
            </ButtonLink>
          </div>
          {error && (
            <p role="alert" className="rounded-[12px] bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
        </div>
      }
    >
      <Clock className="mx-auto mb-3 size-6 text-muted" aria-hidden />
      Votre commande <span className="font-semibold text-ink">{order.number}</span> est enregistrée.{" "}
      {checking
        ? "Si vous venez de payer, la confirmation arrive dans quelques secondes : cette page se met à jour toute seule."
        : "Nous n'avons pas encore reçu la confirmation de votre paiement. Si le paiement n'a pas abouti, vous pouvez le reprendre."}
    </Message>
  );
}

function ConfirmedOrder({ order }: { order: PlacedOrder }) {
  const placedAt = new Date(order.placedAt);
  const steps = [
    { icon: CircleCheck, title: "Commande confirmée", text: `Le ${formatShortDate(placedAt)}`, done: true },
    { icon: PackageCheck, title: "Préparation", text: "Votre colis est préparé puis remis au transporteur", done: false },
    { icon: Mail, title: "Expédition", text: "Numéro de suivi envoyé par e-mail", done: false },
    {
      icon: Truck,
      title: "Livraison",
      text: `Entre le ${formatShortDate(addDays(placedAt, order.shipping.range.minDays))} et le ${formatShortDate(addDays(placedAt, order.shipping.range.maxDays))}`,
      done: false,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="rounded-[28px] bg-white p-8 ring-1 ring-black/5 sm:p-12 lg:col-span-7">
        <span className="grid size-14 place-items-center rounded-full bg-ok text-white">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <h1 className="condensed mt-6 text-[clamp(3rem,6vw,5rem)] leading-[0.88] font-extrabold uppercase">
          Merci {order.firstName} !
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Votre commande <span className="font-semibold text-ink">{order.number}</span> est confirmée. Un e-mail
          récapitulatif vient d&apos;être envoyé à <span className="font-medium text-ink">{order.email}</span>.
        </p>
        {order.payment === "simulated" ? (
          <MockupBadge className="mt-4">Simulation : aucun paiement ni e-mail réel</MockupBadge>
        ) : (
          site.mockup && <MockupBadge className="mt-4">E-mails pas encore envoyés</MockupBadge>
        )}

        <ol className="mt-10 space-y-0">
          {steps.map(({ icon: Icon, title, text, done }, i) => (
            <li key={title} className="relative flex gap-4 pb-8 last:pb-0">
              {i < steps.length - 1 && (
                <span aria-hidden className="absolute top-10 bottom-0 left-5 w-px bg-line" />
              )}
              <span
                className={
                  done
                    ? "grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white"
                    : "grid size-10 shrink-0 place-items-center rounded-full bg-mist text-ink-soft"
                }
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="pt-1.5">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/suivi" size="lg">
            Suivre ma commande
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Retour à l&apos;accueil
          </ButtonLink>
        </div>
      </div>

      <aside className="space-y-4 lg:col-span-5">
        <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-xl font-semibold tracking-tight">Récapitulatif</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {order.items.map((item) => (
              <li key={item.slug} className="flex justify-between gap-4">
                <span>
                  {item.qty} × {site.name} {getProduct(item.slug)?.model}
                </span>
                <span className="tabular-nums">{formatPrice(item.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 text-muted">
              <span>{order.shipping.label}</span>
              <span>{order.shipping.price === 0 ? "Offerte" : formatPrice(order.shipping.price)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-line pt-3 text-base font-semibold">
              <span>Total TTC</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-xl font-semibold tracking-tight">Livraison à</h2>
          <p className="mt-3 text-ink-soft">
            {order.address.line1}
            {order.address.line2 && (
              <>
                <br />
                {order.address.line2}
              </>
            )}
            <br />
            {order.address.postalCode} {order.address.city}
          </p>
        </div>
        <p className="px-2 text-sm text-muted">
          Une question ?{" "}
          <Link href="/contact" className="underline underline-offset-2">
            Contactez-nous
          </Link>{" "}
          en indiquant votre numéro de commande.
        </p>
      </aside>
    </div>
  );
}
