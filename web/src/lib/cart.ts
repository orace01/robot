"use client";

import { useSyncExternalStore } from "react";
import { getProduct, type Product, type ProductSlug } from "./products";

/**
 * Panier de la maquette, conservé dans le navigateur (localStorage).
 * Il sera remplacé par un panier côté serveur lors de la création du back-end.
 */

export interface CartLine {
  slug: ProductSlug;
  qty: number;
}

export interface CartItem extends CartLine {
  product: Product;
  total: number;
}

const KEY = "panier:v1";
const MAX_QTY = 5;
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    getProduct(line.slug) !== undefined &&
    typeof line.qty === "number" &&
    line.qty >= 1
  );
}

function load() {
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    lines = Array.isArray(parsed) ? parsed.filter(isLine) : EMPTY;
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (navigation privée…) : le panier vit seulement en mémoire.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Synchronise les onglets ouverts.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    load();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  if (!loaded) load();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

export const cart = {
  add(slug: ProductSlug, qty = 1) {
    const current = getSnapshot();
    const existing = current.find((l) => l.slug === slug);
    commit(
      existing
        ? current.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l))
        : [...current, { slug, qty: Math.min(qty, MAX_QTY) }],
    );
  },
  setQty(slug: ProductSlug, qty: number) {
    if (qty < 1) return cart.remove(slug);
    commit(getSnapshot().map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)));
  },
  remove(slug: ProductSlug) {
    commit(getSnapshot().filter((l) => l.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
  maxQty: MAX_QTY,
};

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items: CartItem[] = current.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, product, total: product.price * line.qty }] : [];
  });
  return {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
  };
}
