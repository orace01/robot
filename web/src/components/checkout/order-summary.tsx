import Image from "next/image";
import type { CartItem } from "@/lib/cart";
import { formatPrice, vatIncluded } from "@/lib/format";
import { site, type ShippingMethod } from "@/lib/site";

export function OrderSummary({
  items,
  subtotal,
  shipping,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: ShippingMethod;
}) {
  const total = subtotal + shipping.price;
  return (
    <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
      <h2 className="text-xl font-semibold tracking-tight">Votre commande</h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-[12px] bg-stage">
              <Image src={item.product.hero.src} alt="" fill sizes="64px" className="object-contain p-1.5" />
              <span className="absolute -top-0 -right-0 grid size-5 place-items-center rounded-bl-[8px] bg-ink text-[10px] font-semibold text-white">
                {item.qty}
              </span>
            </div>
            <p className="min-w-0 flex-1 text-sm">
              <span className="block font-medium">
                {site.name} {item.product.model}
              </span>
              <span className="text-muted">{item.product.tier}</span>
            </p>
            <p className="text-sm font-medium tabular-nums">{formatPrice(item.total)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Sous-total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">{shipping.label}</dt>
          <dd className="tabular-nums">{shipping.price === 0 ? "Offerte" : formatPrice(shipping.price)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
          <dt>Total TTC</dt>
          <dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <dt>Dont TVA (20 %)</dt>
          <dd className="tabular-nums">{formatPrice(vatIncluded(total, site.vatRate))}</dd>
        </div>
      </dl>
    </div>
  );
}
