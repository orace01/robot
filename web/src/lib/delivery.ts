import type { ProductSlug } from "./products";
import { shippingConfig } from "./site";

/** Délai de livraison client (préparation + transport), en jours calendaires. */
export interface DeliveryRange {
  minDays: number;
  maxDays: number;
}

/** Ce que le site sait de la livraison d'un produit (données CJ ou valeurs de secours). */
export interface ProductDelivery {
  standard: DeliveryRange;
  /** Option plus rapide, si CJ en propose une. */
  express: DeliveryRange | null;
  /** Pays d'expédition, à lire après « Expédié » : « d'Allemagne », « de Chine »… */
  shippedFrom: string;
  fromEurope: boolean;
  inStock: boolean;
  /** true si les données viennent de CJ, false si ce sont les valeurs de secours. */
  live: boolean;
}

export type DeliveryMap = Record<ProductSlug, ProductDelivery>;

export type ShippingMethodId = "standard" | "express";

export interface ShippingOffer {
  id: ShippingMethodId;
  label: string;
  /** Prix en centimes TTC. */
  price: number;
  range: DeliveryRange;
}

function widest(ranges: DeliveryRange[]): DeliveryRange {
  return {
    minDays: Math.max(...ranges.map((r) => r.minDays)),
    maxDays: Math.max(...ranges.map((r) => r.maxDays)),
  };
}

/**
 * Offres de livraison d'un panier : le délai suit le produit le plus long à arriver,
 * et l'express n'est proposé que si tous les produits en disposent.
 */
export function shippingOffers(deliveries: ProductDelivery[]): ShippingOffer[] {
  if (deliveries.length === 0) return [];
  const offers: ShippingOffer[] = [
    {
      id: "standard",
      label: shippingConfig.standardLabel,
      price: 0,
      range: widest(deliveries.map((d) => d.standard)),
    },
  ];
  const express = deliveries.map((d) => d.express);
  if (express.every((range): range is DeliveryRange => range !== null)) {
    offers.push({
      id: "express",
      label: shippingConfig.expressLabel,
      price: shippingConfig.expressPrice,
      range: widest(express),
    });
  }
  return offers;
}

export function formatRange({ minDays, maxDays }: DeliveryRange): string {
  return minDays === maxDays ? `${minDays} jours` : `${minDays} à ${maxDays} jours`;
}
