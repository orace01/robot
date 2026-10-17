"use client";

import type { ProductSlug } from "./products";
import type { ShippingMethodId } from "./site";

/** Commande simulée par la maquette (aucun paiement réel). */
export interface PlacedOrder {
  number: string;
  placedAt: string;
  email: string;
  firstName: string;
  address: { line1: string; line2: string; postalCode: string; city: string };
  items: { slug: ProductSlug; qty: number; total: number }[];
  shippingMethod: ShippingMethodId;
  shippingPrice: number;
  total: number;
}

const KEY = "commande:derniere";

export function saveOrder(order: PlacedOrder) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Stockage indisponible : la page de confirmation affichera un message générique.
  }
}

/** Commande brute (chaîne JSON), pour useSyncExternalStore. */
export function getOrderSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseOrder(raw: string | null): PlacedOrder | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlacedOrder;
  } catch {
    return null;
  }
}

export function newOrderNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `CL-${digits}`;
}
