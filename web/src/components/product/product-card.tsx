import Image from "next/image";
import Link from "next/link";
import { AddToCartIconButton } from "@/components/cart/add-to-cart";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { formatRange, type ProductDelivery } from "@/lib/delivery";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function ProductCard({
  product,
  delivery,
  priority = false,
  className,
}: {
  product: Product;
  delivery?: ProductDelivery;
  priority?: boolean;
  className?: string;
}) {
  const href = `/robots/${product.slug}`;
  return (
    <article
      className={cn(
        "group flex flex-col rounded-[26px] bg-white p-2.5 ring-1 ring-black/5 transition duration-500 hover:shadow-[0_30px_60px_-34px_rgba(13,15,18,0.45)]",
        className,
      )}
    >
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-stage"
        aria-label={`Découvrir le ${site.name} ${product.model}`}
      >
        <div aria-hidden className="plus-grid-dark absolute inset-0 opacity-70" />
        <Image
          src={product.hero.src}
          alt={product.hero.alt}
          fill
          loading={priority ? "eager" : undefined}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-12 transition duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute top-4 left-4 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">{product.badge}</span>
          {delivery?.fromEurope && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white shadow-sm">
              Expédié {delivery.shippedFrom}
            </span>
          )}
        </span>
        <span className="eyebrow absolute top-5 right-5 text-muted">
          {product.model} / {product.tier}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <h3 className="text-2xl font-semibold tracking-tight">
          <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {site.name} {product.model}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {product.cardSpecs.map((spec) => (
            <li key={spec} className="eyebrow rounded-full bg-mist px-2.5 py-1 text-ink-soft">
              {spec}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <p>
            <span className="block text-2xl font-semibold tracking-tight tabular-nums">
              {formatPrice(product.price, { compact: true })}
            </span>
            <span className="text-xs text-muted">
              {delivery ? `TTC, livré en ${formatRange(delivery.standard)}` : "TTC, livraison offerte"}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <ButtonLink href={href} variant="secondary" size="sm">
              Découvrir
            </ButtonLink>
            <AddToCartIconButton slug={product.slug} model={product.model} />
          </div>
        </div>
      </div>
    </article>
  );
}
