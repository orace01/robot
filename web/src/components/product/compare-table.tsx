import Image from "next/image";
import Link from "next/link";
import { AddToCartIconButton } from "@/components/cart/add-to-cart";
import { CompareValue } from "@/components/product/product-sections";
import { formatPrice } from "@/lib/format";
import { compareRows, products } from "@/lib/products";
import { site } from "@/lib/site";

export function CompareTable() {
  return (
    <div className="overflow-x-auto rounded-[28px] bg-white ring-1 ring-black/5">
      <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
        <caption className="sr-only">Comparatif des robots laveurs de vitres</caption>
        <colgroup>
          <col className="w-[22%]" />
          {products.map((product) => (
            <col key={product.slug} />
          ))}
        </colgroup>
        <thead>
          <tr className="align-bottom">
            <th scope="col" className="p-6">
              <span className="eyebrow text-muted">Modèle</span>
            </th>
            {products.map((product) => (
              <th key={product.slug} scope="col" className="p-6 font-normal">
                <Link href={`/robots/${product.slug}`} className="group block">
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[16px] bg-stage">
                    <Image
                      src={product.hero.src}
                      alt=""
                      fill
                      sizes="220px"
                      className="object-contain p-4 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="block text-lg font-semibold tracking-tight">
                    {site.name} {product.model}
                  </span>
                  <span className="text-muted">{product.tier}</span>
                </Link>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold tabular-nums">{formatPrice(product.price, { compact: true })}</span>
                  <AddToCartIconButton slug={product.slug} model={product.model} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.key} className="border-t border-line">
              <th scope="row" className="px-6 py-4 font-normal text-muted">
                {row.label}
              </th>
              {products.map((product) => (
                <td key={product.slug} className="px-6 py-4">
                  <CompareValue value={product.compare[row.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
