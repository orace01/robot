"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { useCartDrawer } from "@/components/providers";
import { AddToCart } from "@/components/cart/add-to-cart";
import { DeliveryEstimate } from "@/components/product/delivery-estimate";
import { MockupBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Bloc d'achat de la fiche produit, avec une barre d'achat collante sur mobile. */
export function BuyPanel({ product }: { product: Product }) {
  const { openCart } = useCartDrawer();
  const anchor = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const element = anchor.current;
    if (!element) return;
    // La barre apparaît quand le bouton principal est sorti de l'écran par le haut.
    const observer = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">{product.badge}</span>
          <span className="eyebrow text-muted">
            {product.model} / {product.tier}
          </span>
        </div>
        <h1 className="condensed mt-4 text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.88] font-extrabold uppercase">
          {site.name} {product.model}
        </h1>
        <p className="mt-3 text-xl tracking-tight text-ink-soft">{product.tagline}</p>
      </div>

      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">{formatPrice(product.price, { compact: true })}</p>
        <p className="pb-1 text-sm text-muted">TTC, livraison offerte</p>
        <MockupBadge className="mb-1.5">Prix provisoire</MockupBadge>
      </div>

      <ul className="space-y-2.5">
        {product.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            {highlight}
          </li>
        ))}
      </ul>

      <p className="eyebrow flex items-center gap-2 text-ink-soft">
        <span className="size-2 rounded-full bg-ok" /> En stock
      </p>

      <div ref={anchor}>
        <AddToCart product={product} />
      </div>

      <DeliveryEstimate />

      <ul className="grid grid-cols-3 gap-2 text-center text-xs text-ink-soft">
        <li className="rounded-[14px] bg-white p-3 ring-1 ring-black/5">
          <RotateCcw className="mx-auto mb-1.5 size-4" aria-hidden />
          {site.returnDays} jours pour changer d&apos;avis
        </li>
        <li className="rounded-[14px] bg-white p-3 ring-1 ring-black/5">
          <ShieldCheck className="mx-auto mb-1.5 size-4" aria-hidden />
          Garantie légale {site.warrantyYears} ans
        </li>
        <li className="rounded-[14px] bg-white p-3 ring-1 ring-black/5">
          <Lock className="mx-auto mb-1.5 size-4" aria-hidden />
          Paiement sécurisé
        </li>
      </ul>

      {/* Barre d'achat collante (mobile et tablette). */}
      <div
        aria-hidden={!showBar}
        className={cn(
          "fixed inset-x-2 bottom-2 z-30 flex items-center gap-3 rounded-[20px] bg-white p-2.5 shadow-[0_20px_50px_-15px_rgba(13,15,18,0.4)] ring-1 ring-black/5 transition duration-300 lg:hidden",
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
        )}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[12px] bg-mist">
          <Image src={product.hero.src} alt="" fill sizes="48px" className="object-contain p-1" />
        </div>
        <p className="min-w-0 flex-1 text-sm">
          <span className="block truncate font-medium">
            {site.name} {product.model}
          </span>
          <span className="text-muted tabular-nums">{formatPrice(product.price, { compact: true })}</span>
        </p>
        <Button
          size="md"
          tabIndex={showBar ? 0 : -1}
          onClick={() => {
            cart.add(product.slug);
            openCart();
          }}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
}
