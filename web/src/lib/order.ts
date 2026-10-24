"use client";

import type { ProductSlug } from "./products";
import type { ShippingOffer } from "./delivery";

/** Commande qui vient d'être passée, gardée le temps d'afficher la confirmation. */
export interface PlacedOrder {
  number: string;
  placedAt: string;
  email: string;
  firstName: string;
  address: { line1: string; line2: string; postalCode: string; city: string };
  items: { slug: ProductSlug; qty: number; total: number }[];
  shipping: ShippingOffer;
  total: number;
  /** « online » : le client paie sur la page Mepaye, la confirmation attend le paiement. */
  payment: "simulated" | "online";
}

const KEY = "commande:derniere";
/** Au-delà, la commande gardée dans le navigateur est oubliée (elle contient l'adresse du client). */
const MAX_AGE_MS = 2 * 24 * 3600_000;

export function saveOrder(order: PlacedOrder) {
  try {
    // localStorage plutôt que sessionStorage : la commande est retrouvée au retour de la page
    // de paiement, même si le client revient dans un autre onglet.
    window.localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Stockage indisponible : la page de confirmation affichera un message générique.
  }
}

/** Commande brute (chaîne JSON), pour useSyncExternalStore. */
export function getOrderSnapshot(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseOrder(raw: string | null): PlacedOrder | null {
  if (!raw) return null;
  try {
    const order = JSON.parse(raw) as PlacedOrder;
    // Commande enregistrée dans un ancien format : on l'ignore.
    if (!order.shipping?.range || !order.payment) return null;
    return Date.now() - new Date(order.placedAt).getTime() < MAX_AGE_MS ? order : null;
  } catch {
    return null;
  }
}
