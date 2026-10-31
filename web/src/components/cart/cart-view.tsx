"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, RotateCcw, ShoppingBag, Trash2, Truck } from "lucide-react";
import { QuantityStepper } from "@/components/cart/quantity";
import { ButtonLink } from "@/components/ui/button";
import { cart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export function CartView() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-20 text-center ring-1 ring-black/5">
        <span className="grid size-16 place-items-center rounded-full bg-mist">
          <ShoppingBag className="size-6 text-muted" aria-hidden />
        </span>
        <p className="mt-6 text-2xl font-semibold tracking-tight">Votre panier est vide</p>
        <p className="mt-2 max-w-sm text-ink-soft">
          Trois robots vous attendent pour des vitres impeccables, sans escabeau.
        </p>
        <ButtonLink href="/robots" size="lg" className="mt-8">
          Découvrir les robots
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <ul className="space-y-3 lg:col-span-8">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 rounded-[24px] bg-white p-4 ring-1 ring-black/5 sm:gap-6 sm:p-5">
            <Link
              href={`/robots/${item.slug}`}
              className="relative size-28 shrink-0 overflow-hidden rounded-[16px] bg-stage sm:size-36"
            >
              <Image src={item.product.hero.src} alt={item.product.hero.alt} fill sizes="144px" className="object-contain p-3" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/robots/${item.slug}`} className="text-lg font-semibold tracking-tight hover:underline">
                    {site.name} {item.product.model}
                  </Link>
                  <p className="text-sm text-muted">{item.product.tagline}</p>
                </div>
                <p className="text-lg font-semibold tabular-nums">{formatPrice(item.total)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <QuantityStepper
                  size="sm"
                  value={item.qty}
                  max={cart.maxQty}
                  label={item.product.model}
                  onChange={(qty) => cart.setQty(item.slug, qty)}
                />
                <button
                  type="button"
                  onClick={() => cart.remove(item.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition hover:bg-ink/5 hover:text-ink"
                >
                  <Trash2 className="size-4" aria-hidden />
                  Retirer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:col-span-4">
        <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold tracking-tight">Récapitulatif</h2>
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Sous-total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Livraison standard</dt>
              <dd>Offerte</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
              <dt>Total TTC</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <ButtonLink href="/commande" size="lg" className="mt-6 w-full">
            Passer commande
          </ButtonLink>
          <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
            <li className="flex items-center gap-2.5">
              <Truck className="size-4 shrink-0" aria-hidden /> Livraison suivie offerte
            </li>
            <li className="flex items-center gap-2.5">
              <RotateCcw className="size-4 shrink-0" aria-hidden /> {site.returnDays} jours pour changer d&apos;avis
            </li>
            <li className="flex items-center gap-2.5">
              <Lock className="size-4 shrink-0" aria-hidden /> Paiement sécurisé
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
