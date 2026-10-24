import type { Metadata } from "next";
import { Suspense } from "react";
import { ExternalLink, TriangleAlert, Wallet, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin";
import { openCjSession } from "@/lib/cj/api";
import { getUsdPerEur } from "@/lib/cj/exchange";
import { getCjBalance, supplierMode } from "@/lib/cj/orders";
import {
  fastestOption,
  getSupplierCatalog,
  importVatUsd,
  orderableOptions,
  shippedFromPhrases,
  type SupplierInfo,
} from "@/lib/cj/supplier";
import { cn } from "@/lib/cn";
import { formatPrice, formatUsd } from "@/lib/format";
import { paymentFees, targetMarginRate, unitEconomics } from "@/lib/margin";
import { products, type Product } from "@/lib/products";
import { shippingConfig, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fournisseur CJ",
};

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
  const orderable = orderableOptions(info);
  if (!info || orderable.length === 0) {
    return (
      <article className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
        <h2 className="text-2xl font-semibold tracking-tight">
          {site.name} {product.model}
        </h2>
        <p className="mt-4 flex gap-2 text-sm text-red-700">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {info
            ? "Aucun transporteur accepté par CJ pour les commandes automatiques vers la France."
            : "Données CJ indisponibles (clé API absente ou CJ injoignable). Voir le terminal du serveur."}
        </p>
      </article>
    );
  }

  const standard = orderable[0];
  const fastest = fastestOption(orderable)!;
  const importVat = importVatUsd(info);
  const economics = unitEconomics({
    priceCents: product.price,
    costUsd: info.costUsd,
    shippingUsd: standard.totalUsd,
    importVatUsd: importVat,
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
        <Row label="Achat CJ" value={`− ${formatUsd(info.costUsd)}`} />
        <Row label={`Transport : ${standard.name} (${standard.minDays}-${standard.maxDays} j)`} value={`− ${formatUsd(standard.totalUsd)}`} />
        {importVat > 0 && <Row label="TVA d'import (IOSS de CJ, 20 % de l'achat)" value={`− ${formatUsd(importVat)}`} />}
        <Row label="Coût fournisseur en euros" value={`= ${formatPrice(economics.supplierCents)}`} />
        <Row
          label={`Frais de paiement (${percent(paymentFees.rate)}${paymentFees.fixedCents ? ` + ${formatPrice(paymentFees.fixedCents)}` : ""})`}
          value={`− ${formatPrice(economics.feesCents)}`}
        />
        <Row label="Marge brute" value={formatPrice(economics.marginCents)} strong />
        <Row label="Prix d'équilibre TTC" value={formatPrice(economics.breakEvenCents)} />
        <Row label={`Prix TTC pour ${percent(targetMarginRate)} de marge`} value={formatPrice(economics.targetPriceCents)} strong />
      </dl>

      <h3 className="mt-6 text-sm font-semibold">Transports CJ vers la France</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {info.options.map((option) => (
          <li key={option.name} className={cn("flex justify-between gap-3", !option.orderable && "text-faint")}>
            <span className={option === standard ? "font-medium" : option.orderable ? "text-muted" : undefined}>
              {option.name} · {option.minDays}-{option.maxDays} j{option === standard && " (standard)"}
              {option === fastest && expressExtraCents !== null && " (express)"}
              {!option.orderable && " · refusé par l'API"}
            </span>
            <span className="tabular-nums">{formatUsd(option.totalUsd)}</span>
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

const modeDescriptions = {
  off: "Désactivée : les commandes restent dans l'administration (CJ_ORDER_MODE=off).",
  sandbox: "Mode test : chaque commande payée crée une commande de test chez CJ, sans envoi ni débit réels.",
  live: "Mode réel : chaque commande payée est passée chez CJ et payée aussitôt sur ce solde.",
};

/** Solde CJ : chaque commande y est prélevée automatiquement. */
async function CjAccount() {
  const mode = supplierMode();
  let balance: number | null = null;
  try {
    balance = await getCjBalance(await openCjSession());
  } catch (error) {
    console.error("[CJ] solde illisible :", error instanceof Error ? error.message : error);
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-white p-6 ring-1 ring-black/5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <Wallet className="size-6 text-ink-soft" aria-hidden />
        <div>
          <p className="text-sm text-muted">Solde CJ</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {balance === null ? "Indisponible" : formatUsd(balance)}
          </p>
        </div>
      </div>
      <div className="text-sm text-ink-soft sm:ml-6 sm:border-l sm:border-line sm:pl-6">
        <p>
          <span className="font-semibold text-ink">Transmission des commandes :</span> {modeDescriptions[mode]}
        </p>
        {balance !== null && balance < 150 && (
          <p className="mt-1 text-red-700">
            Solde trop bas pour une commande (environ 115 à 135 $ par robot) : recharge-le dans ton espace CJ (Wallet)
            avant de passer en mode réel.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SupplierPage() {
  return (
    <Suspense fallback={<Container className="pt-10"><div className="h-96 animate-pulse rounded-[24px] bg-white/60" aria-busy="true" /></Container>}>
      <SupplierContent />
    </Suspense>
  );
}

async function SupplierContent() {
  // Prix d'achat confidentiels : réservé à l'administration.
  await requireAdmin();

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

      <Suspense fallback={<div className="mt-6 h-[104px] animate-pulse rounded-[24px] bg-white/60" aria-busy="true" />}>
        <CjAccount />
      </Suspense>

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
            les droits de douane ; la TVA d&apos;import prélevée par CJ (IOSS) sur les envois de Chine est comptée, mais
            son articulation avec la TVA que tu reverses sur tes ventes est à valider avec un comptable ;
          </li>
          <li>les frais de conversion euro → dollar de ta banque ou de CJ.</li>
        </ul>
      </div>
    </Container>
  );
}
