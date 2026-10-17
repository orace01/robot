import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { products, type CjReference } from "@/lib/products";
import { openCjSession, type CjRequest } from "./api";

export interface CjShippingOption {
  name: string;
  minDays: number;
  maxDays: number;
  /** Frais de port facturés par CJ, en dollars. */
  priceUsd: number;
  /** Frais de port, taxes et frais de dédouanement inclus, en dollars. */
  totalUsd: number;
}

export interface SupplierInfo {
  sku: string;
  title: string;
  variant: string;
  /** Prix d'achat de la variante, en dollars. */
  costUsd: number;
  weightGrams: number;
  shipFrom: string;
  /** Stock de la variante dans le pays d'expédition. */
  stock: number;
  /** Options de transport vers la France, de la moins chère à la plus chère. */
  options: CjShippingOption[];
  fetchedAt: string;
}

interface CjProduct {
  productNameEn: string;
  variants: {
    vid: string;
    variantKey: string;
    variantSellPrice: number;
    variantWeight: number;
  }[];
}

interface CjInventory {
  variantInventories?: { vid: string; inventory?: { countryCode: string; totalInventory: number }[] }[];
}

interface CjFreight {
  logisticName: string;
  logisticAging: string;
  logisticPrice: number;
  totalPostageFee?: number;
}

/** Complément de « Expédié … » selon le pays de l'entrepôt. */
export const shippedFromPhrases: Record<string, string> = {
  CN: "de Chine",
  DE: "d'Allemagne",
  FR: "de France",
  ES: "d'Espagne",
  IT: "d'Italie",
  PL: "de Pologne",
  CZ: "de Tchéquie",
  NL: "des Pays-Bas",
  BE: "de Belgique",
  GB: "du Royaume-Uni",
  US: "des États-Unis",
};

export const europeanWarehouses = new Set(["DE", "FR", "ES", "IT", "PL", "CZ", "NL", "BE"]);

/** « 7-12 » → { min: 7, max: 12 } ; « 5 » → { min: 5, max: 5 }. */
function parseAging(aging: string): { min: number; max: number } | null {
  const numbers = String(aging).match(/\d+/g)?.map(Number);
  if (!numbers?.length) return null;
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

async function fetchSupplierInfo(request: CjRequest, ref: CjReference): Promise<SupplierInfo> {
  const product = await request<CjProduct>("GET", "/product/query", { pid: ref.pid });
  const variant = product.variants.find((v) => v.vid === ref.vid);
  if (!variant) throw new Error(`variante ${ref.vid} introuvable`);

  const inventory = await request<CjInventory>("GET", "/product/stock/getInventoryByPid", { pid: ref.pid });
  const stock = (inventory.variantInventories?.find((v) => v.vid === ref.vid)?.inventory ?? [])
    .filter((entry) => entry.countryCode === ref.shipFrom)
    .reduce((sum, entry) => sum + entry.totalInventory, 0);

  const freight = await request<CjFreight[]>("POST", "/logistic/freightCalculate", {
    startCountryCode: ref.shipFrom,
    endCountryCode: "FR",
    products: [{ quantity: 1, vid: ref.vid }],
  });
  const options = freight
    .flatMap((option) => {
      const days = parseAging(option.logisticAging);
      if (!days) return [];
      return [
        {
          name: option.logisticName,
          minDays: days.min,
          maxDays: days.max,
          priceUsd: option.logisticPrice,
          totalUsd: option.totalPostageFee ?? option.logisticPrice,
        },
      ];
    })
    .sort((a, b) => a.totalUsd - b.totalUsd);

  return {
    sku: ref.sku,
    title: product.productNameEn,
    variant: variant.variantKey,
    costUsd: variant.variantSellPrice,
    weightGrams: variant.variantWeight,
    shipFrom: ref.shipFrom,
    stock,
    options,
    fetchedAt: new Date().toISOString(),
  };
}

export type SupplierCatalog = Record<string, SupplierInfo | null>;

/**
 * Prix, stock et options de livraison vers la France des produits CJ, indexés par SKU.
 * Un seul bloc en cache pour tous les produits : les appels à CJ s'y suivent au rythme
 * imposé (une par seconde). Un produit injoignable vaut null : le site affiche alors
 * des valeurs par défaut, et on réessaie au bout de quelques minutes.
 */
async function loadSupplierCatalog(refs: CjReference[]): Promise<SupplierCatalog> {
  "use cache";
  cacheTag("cj");

  const catalog: SupplierCatalog = Object.fromEntries(refs.map((ref) => [ref.sku, null]));
  try {
    const request = await openCjSession();
    for (const ref of refs) {
      try {
        catalog[ref.sku] = await fetchSupplierInfo(request, ref);
      } catch (error) {
        console.error(`[CJ] ${ref.sku} indisponible :`, error instanceof Error ? error.message : error);
      }
    }
  } catch (error) {
    console.error("[CJ] connexion impossible :", error instanceof Error ? error.message : error);
  }

  // Une heure si tout a répondu ; sinon on réessaie au bout de quelques minutes.
  if (Object.values(catalog).every(Boolean)) cacheLife("hours");
  else cacheLife("minutes");
  return catalog;
}

/** Données CJ de tous les robots du catalogue. */
export function getSupplierCatalog(): Promise<SupplierCatalog> {
  return loadSupplierCatalog(products.map((product) => product.cj));
}
