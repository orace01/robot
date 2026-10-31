"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartDrawer } from "@/components/providers";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { ProductImage, ProductSlug } from "@/lib/products";

export interface LineupItem {
  slug: ProductSlug;
  name: string;
  model: string;
  badge: string;
  tagline: string;
  specs: string[];
  price: number;
  inStock: boolean;
  /** « Livré en 5 à 8 jours », ou `null` si le délai est inconnu. */
  delivery: string | null;
  /** Pays d'expédition quand le colis part d'Europe. */
  shippedFrom: string | null;
  cutout: ProductImage;
  scene: ProductImage;
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Carte de la gamme : le robot seul sur fond clair ; au survol (ou au focus),
 * sa scène apparaît derrière lui et il s'avance. Sans survol possible (écran
 * tactile), la scène est affichée d'office.
 */
export function LineupCard({ item, index }: { item: LineupItem; index: number }) {
  const { openCart } = useCartDrawer();
  const href = `/robots/${item.slug}`;

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        aria-label={`Découvrir le ${item.name}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-[#f3f4f6] focus-visible:outline-offset-4"
      >
        <Image
          src={item.scene.src}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 768px) 32vw, 80vw"
          className={cn(
            "scale-[1.08] object-cover opacity-0 brightness-[0.82] transition-[opacity,scale] duration-700",
            EASE,
            "group-hover:scale-100 group-hover:opacity-100 group-has-[:focus-visible]:scale-100 group-has-[:focus-visible]:opacity-100",
            "[@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(8,10,14,0.45)_100%)] opacity-0 transition-opacity duration-700",
            "group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 [@media(hover:none)]:opacity-100",
          )}
        />

        <Image
          src={item.cutout.src}
          alt={item.cutout.alt}
          fill
          sizes="(min-width: 768px) 28vw, 70vw"
          className={cn(
            "object-contain p-[15%] drop-shadow-[0_22px_26px_rgba(13,15,18,0.16)] transition-[scale,translate,filter] duration-700",
            EASE,
            "group-hover:-translate-y-1.5 group-hover:scale-[1.06] group-hover:drop-shadow-[0_40px_44px_rgba(0,0,0,0.5)]",
            "group-has-[:focus-visible]:scale-[1.06]",
          )}
        />

        {/* Repères : numéro et positionnement, lisibles sur fond clair comme sur la scène. */}
        <span
          className={cn(
            "absolute top-4 left-4 font-mono text-[11px] tracking-[0.08em] text-ink/55 uppercase transition-colors duration-500",
            "group-hover:text-white/85 [@media(hover:none)]:text-white/85",
          )}
        >
          {String(index + 1).padStart(2, "0")} — {item.badge}
        </span>
        {item.shippedFrom && (
          <span className="absolute top-3.5 right-3.5 rounded-[6px] bg-white px-2 py-1 text-[11px] font-medium text-ink shadow-sm">
            Expédié {item.shippedFrom}
          </span>
        )}

        {/* La caractéristique phare se pose sur le robot au survol. */}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-2 rounded-[6px] bg-white/92 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-ink opacity-0 shadow-sm backdrop-blur transition duration-500",
            EASE,
            "group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
          )}
        >
          {item.specs[0]}
        </span>
      </Link>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-[17px] font-medium tracking-tight">
          <Link href={href} className="underline-offset-4 hover:underline">
            {item.name}
          </Link>
        </h3>
        <p className="text-[17px] font-medium tabular-nums">{formatPrice(item.price)}</p>
      </div>
      <p className="mt-1 text-sm text-muted">{item.tagline}</p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-ink/55 uppercase">{item.specs.join(" · ")}</p>

      {/* Pousse la ligne d'achat en bas : les trois cartes s'alignent. */}
      <div aria-hidden className="mt-auto pt-5" />
      <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
        <button
          type="button"
          disabled={!item.inStock}
          onClick={() => {
            cart.add(item.slug);
            openCart();
          }}
          aria-label={item.inStock ? `Ajouter le ${item.name} au panier` : `${item.name} indisponible`}
          className="h-10 rounded-[10px] bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {item.inStock ? "Ajouter au panier" : "Indisponible"}
        </button>
        {item.delivery && <span className="text-right text-xs text-muted">{item.delivery}</span>}
      </div>
    </article>
  );
}
