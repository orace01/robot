"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCartDrawer } from "@/components/providers";
import { QuantityStepper } from "@/components/cart/quantity";
import { Button } from "@/components/ui/button";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product, ProductSlug } from "@/lib/products";
import { cn } from "@/lib/cn";

/** Bouton rond « + » des cartes produit. */
export function AddToCartIconButton({ slug, model, className }: { slug: ProductSlug; model: string; className?: string }) {
  const { openCart } = useCartDrawer();
  return (
    <button
      type="button"
      onClick={() => {
        cart.add(slug);
        openCart();
      }}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-ink-soft",
        className,
      )}
      aria-label={`Ajouter le ${model} au panier`}
    >
      <Plus className="size-4" aria-hidden />
    </button>
  );
}

/** Quantité + « Ajouter au panier » de la fiche produit. */
export function AddToCart({ product, available = true }: { product: Product; available?: boolean }) {
  const { openCart } = useCartDrawer();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex gap-3">
      <QuantityStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} max={cart.maxQty} label={product.model} />
      <Button
        size="lg"
        className="flex-1"
        disabled={!available}
        onClick={() => {
          cart.add(product.slug, qty);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
          openCart();
        }}
      >
        {!available ? (
          "Indisponible pour le moment"
        ) : added ? (
          <>
            <Check className="size-4" aria-hidden /> Ajouté
          </>
        ) : (
          <>Ajouter au panier · {formatPrice(product.price * qty, { compact: true })}</>
        )}
      </Button>
    </div>
  );
}
