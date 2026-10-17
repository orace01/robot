import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, TriangleAlert, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { getUsdPerEur } from "@/lib/cj/exchange";
import { getSupplierCatalog, shippedFromPhrases, type SupplierInfo } from "@/lib/cj/supplier";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { paymentFees, targetMarginRate, unitEconomics } from "@/lib/margin";
import { products, type Product } from "@/lib/products";
import { shippingConfig, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fournisseur CJ",
};

const usd = (value: number) => `${value.toFixed(2).replace(".", ",")} $`;
const percent = (value: number) => `${String(Math.round(value * 1000) / 10).replace(".", ",")}\u00a0%`;
const count = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Lien vers la fiche CJ (même forme que les liens du site CJ). */
function cjUrl(info: SupplierInfo, product: Product) {
  const slug = info.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://www.cjdropshipping.com/product/${slug}-p-${product.cj.pid}.html`;
}

function Row({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4 py-2", strong && "font-semibold")}>
      <dt className={strong ? "" : "text-muted"}>{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}

function ProductEconomics({ product, info, usdPerEur }: { product: Product; info: SupplierInfo | null; usdPerEur: number }) {
  if (!info || info.options.length === 0) {
    return (
      <article className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
        <h2 className="text-2xl font-semibold tracking-tight">
          {site.name} {product.model}
        </h2>
        <p className="mt-4 flex gap-2 text-sm text-red-700">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          Données CJ indisponibles (clé API absente ou CJ injoignable). Voir le terminal du serveur.
        </p>
      </article>
    );
  }

  const standard = info.options[0];
  const fastest = [...info.options].sort((a, b) => a.maxDays - b.maxDays || a.totalUsd - b.totalUsd)[0];
  const economics = unitEconomics({
    priceCents: product.price,
    costUsd: info.costUsd,
    shippingUsd: standard.totalUsd,
    usdPerEur,
    vatRate: site.vatRate,
  });
  const expressExtraCents =
    fastest.maxDays < standard.maxDays ? Math.round(((fastest.totalUsd - standard.totalUsd) / usdPerEur) * 100) : null;
  const tone =
    economics.marginRate < 0.15 ? "bg-red-50 text-red-800" : economics.marginRate < 0.3 ? "bg-amber-50 text-amber-900" : "bg-green-50 text-green-800";

  return (
    <article className="flex flex-col rounded-[24px] bg-white p-6 ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {site.name} {product.model}
          </h2>
          <p className="mt-1 text-sm text-muted">{info.title}</p>
        </div>
        <a
          href={cjUrl(info, product)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-accent-strong hover:underline"
        >
          Fiche CJ <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>

      <p className="eyebrow mt-4 text-muted">
        {info.sku} · variante {info.variant} · {count(info.weightGrams)} g
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm">
        <Warehouse className="size-4 text-ink-soft" aria-hidden />
        {count(info.stock)} en stock, expédié {shippedFromPhrases[info.shipFrom] ?? info.shipFrom}
      </p>

      <div className={cn("mt-5 rounded-[16px] p-4", tone)}>
        <p className="text-sm">Marge brute par vente</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
          {formatPrice(economics.marginCents)} <span className="text-lg">({percent(economics.marginRate)} du HT)</span>
        </p>
      </div>

      <dl className="mt-4 divide-y divide-line text-sm">
        <Row label="Prix de vente TTC (site)" value={formatPrice(product.price)} />
        <Row label="dont TVA 20 %" value={`− ${formatPrice(economics.vatCents)}`} />
        <Row label="Achat CJ" value={`− ${usd(info.costUsd)}`} />
        <Row label={`Transport : ${standard.name} (${standard.minDays}-${standard.maxDays} j)`} value={`− ${usd(standard.totalUsd)}`} />
        <Row label="Coût fournisseur en euros" value={`= ${formatPrice(economics.supplierCents)}`} />
        <Row
          label={`Frais de paiement (est. ${percent(paymentFees.rate)} + ${formatPrice(paymentFees.fixedCents)})`}
          value={`− ${formatPrice(economics.feesCents)}`}
        />
        <Row label="Marge brute" value={formatPrice(economics.marginCents)} strong />
        <Row label="Prix d'équilibre TTC" value={formatPrice(economics.breakEvenCents)} />
        <Row label={`Prix TTC pour ${percent(targetMarginRate)} de marge`} value={formatPrice(economics.targetPriceCents)} strong />
      </dl>

      <h3 className="mt-6 text-sm font-semibold">Transports CJ vers la France</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {info.options.map((option, i) => (
          <li key={option.name} className="flex justify-between gap-3">
            <span className={i === 0 ? "font-medium" : "text-muted"}>
              {option.name} · {option.minDays}-{option.maxDays} j{i === 0 && " (standard)"}
              {option === fastest && expressExtraCents !== null && " (express)"}
            </span>
            <span className="tabular-nums">{usd(option.totalUsd)}</span>
          </li>
        ))}
      </ul>
      {expressExtraCents !== null && (
        <p className="mt-3 rounded-[12px] bg-canvas p-3 text-sm text-ink-soft">
          Express : surcoût CJ de {formatPrice(expressExtraCents)}, facturé {formatPrice(shippingConfig.expressPrice)} au
          client.
        </p>
      )}
    </article>
  );
}

export default async function SupplierPage() {
  // Prix d'achat confidentiels : réservé au développement tant qu'il n'y a pas d'accès administrateur.
  if (process.env.NODE_ENV === "production") notFound();

  const [exchange, catalog] = await Promise.all([getUsdPerEur(), getSupplierCatalog()]);
  const infos = products.map((product) => catalog[product.cj.sku]);
  const fetchedAt = infos.find(Boolean)?.fetchedAt;

  return (
    <Container className="pt-10">
      <Eyebrow>Fournisseur</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">CJ Dropshipping : coûts et marges</h1>
      <p className="mt-3 max-w-3xl text-ink-soft">
        Taux BCE {exchange.date ? `du ${exchange.date}` : "(valeur de secours)"} : 1 € = {exchange.rate} $.
        {fetchedAt && ` Données CJ du ${fetchedAt.slice(0, 16).replace("T", " à ")} (UTC), actualisées toutes les heures.`}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductEconomics key={product.slug} product={product} info={infos[i]} usdPerEur={exchange.rate} />
        ))}
      </div>

      <div className="mt-8 rounded-[24px] bg-white p-6 text-sm text-ink-soft ring-1 ring-black/5">
        <p className="font-semibold text-ink">Ce que ces marges n&apos;incluent pas</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>la publicité et l&apos;acquisition de clients ;</li>
          <li>les retours, remboursements et produits défectueux ;</li>
          <li>
            les droits de douane et la gestion de la TVA à l&apos;import pour les envois depuis la Chine (guichet unique
            IOSS pour les colis de moins de 150 €) : à valider avec un comptable ;
          </li>
          <li>les frais de conversion euro → dollar de ta banque ou de CJ.</li>
        </ul>
      </div>
    </Container>
  );
}
