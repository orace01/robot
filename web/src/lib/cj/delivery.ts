import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { DeliveryMap, ProductDelivery } from "@/lib/delivery";
import { products } from "@/lib/products";
import { shippingConfig } from "@/lib/site";
import {
  europeanWarehouses,
  fastestOption,
  getSupplierCatalog,
  orderableOptions,
  shippedFromPhrases,
  type CjShippingOption,
  type SupplierInfo,
} from "./supplier";

function toDelivery(info: SupplierInfo | null, shipFrom: string): ProductDelivery {
  const base = {
    shippedFrom: shippedFromPhrases[shipFrom] ?? `de ${shipFrom}`,
    fromEurope: europeanWarehouses.has(shipFrom),
  };
  // Seuls les transporteurs acceptés par CJ pour les commandes API comptent.
  const options = orderableOptions(info);
  if (!info || options.length === 0) {
    return { ...base, standard: shippingConfig.fallback, express: null, inStock: true, live: false };
  }

  const { min, max } = shippingConfig.processingDays;
  const withProcessing = (option: CjShippingOption) => ({
    minDays: option.minDays + min,
    maxDays: option.maxDays + max,
  });
  // Standard : l'option la moins chère. Express : la plus rapide, si elle l'est vraiment.
  const cheapest = options[0];
  const fastest = fastestOption(options)!;

  return {
    ...base,
    standard: withProcessing(cheapest),
    express: fastest.maxDays < cheapest.maxDays ? withProcessing(fastest) : null,
    inStock: info.stock > 0,
    live: true,
  };
}

/** Délais et disponibilité de chaque robot, d'après CJ (mis en cache une heure). */
export async function getDeliveryMap(): Promise<DeliveryMap> {
  "use cache";
  cacheTag("cj");

  const catalog = await getSupplierCatalog();
  // Une heure si tout a répondu ; sinon on réessaie au bout de quelques minutes.
  if (Object.values(catalog).every(Boolean)) cacheLife("hours");
  else cacheLife("minutes");
  return Object.fromEntries(
    products.map((product) => [product.slug, toDelivery(catalog[product.cj.sku], product.cj.shipFrom)]),
  ) as DeliveryMap;
}
