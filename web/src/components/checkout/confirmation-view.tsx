"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, CircleCheck, Mail, PackageCheck, Truck } from "lucide-react";
import { MockupBadge } from "@/components/ui/badges";
import { ButtonLink } from "@/components/ui/button";
import { addDays, formatPrice, formatShortDate } from "@/lib/format";
import { getOrderSnapshot, parseOrder } from "@/lib/order";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";

const noop = () => () => {};

export function ConfirmationView() {
  // undefined côté serveur (chargement), null si aucune commande en mémoire.
  const raw = useSyncExternalStore(noop, getOrderSnapshot, () => undefined);
  const order = useMemo(() => (raw === undefined ? undefined : parseOrder(raw)), [raw]);

  if (order === undefined) {
    return <div className="h-96 animate-pulse rounded-[28px] bg-white/60" aria-busy="true" />;
  }

  if (order === null) {
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
        <MockupBadge className="mt-4">Simulation : aucun paiement ni e-mail réel</MockupBadge>

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
