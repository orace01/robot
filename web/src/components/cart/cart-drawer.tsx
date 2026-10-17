"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCartDrawer } from "@/components/providers";
import { QuantityStepper } from "@/components/cart/quantity";
import { buttonClass } from "@/components/ui/button";
import { cart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export function CartDrawer() {
  const { open, closeCart } = useCartDrawer();
  const { items, count, subtotal } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeCart();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeCart]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="voile"
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            key="tiroir"
            role="dialog"
            aria-modal="true"
            aria-label="Votre panier"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-canvas shadow-2xl sm:inset-y-2 sm:right-2 sm:rounded-[24px]"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <p className="text-lg font-semibold">
                Votre panier <span className="text-muted tabular-nums">({count})</span>
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line transition hover:ring-ink/40"
                aria-label="Fermer le panier"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-white ring-1 ring-line">
                  <ShoppingBag className="size-6 text-muted" aria-hidden />
                </span>
                <p className="text-lg font-medium">Votre panier est vide</p>
                <p className="text-sm text-muted">Trois robots vous attendent pour des vitres impeccables.</p>
                <Link href="/robots" onClick={closeCart} className={buttonClass({ size: "md" }, "mt-2")}>
                  Voir les robots
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-2">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4 rounded-[18px] bg-white p-3 ring-1 ring-black/5">
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-[12px] bg-stage">
                        <Image
                          src={item.product.hero.src}
                          alt={item.product.hero.alt}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/robots/${item.slug}`}
                              onClick={closeCart}
                              className="font-medium hover:underline"
                            >
                              {site.name} {item.product.model}
                            </Link>
                            <p className="text-xs text-muted">{item.product.tier}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => cart.remove(item.slug)}
                            className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-ink/5 hover:text-ink"
                            aria-label={`Retirer le ${item.product.model} du panier`}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <QuantityStepper
                            size="sm"
                            value={item.qty}
                            max={cart.maxQty}
                            label={item.product.model}
                            onChange={(qty) => cart.setQty(item.slug, qty)}
                          />
                          <p className="font-medium tabular-nums">{formatPrice(item.total)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 border-t border-line px-6 pt-5 pb-6">
                  <p className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm text-accent-strong">
                    <Truck className="size-4 shrink-0" aria-hidden />
                    La livraison standard est offerte.
                  </p>
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Sous-total</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Livraison standard</dt>
                      <dd>Offerte</dd>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-semibold">
                      <dt>Total TTC</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                  </dl>
                  <div className="grid gap-2">
                    <Link href="/commande" onClick={closeCart} className={buttonClass({ size: "lg" }, "w-full")}>
                      Commander
                    </Link>
                    <Link href="/panier" onClick={closeCart} className={buttonClass({ variant: "ghost", size: "md" }, "w-full")}>
                      Voir le panier
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
