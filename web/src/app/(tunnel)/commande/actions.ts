"use server";

import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { shippingOffers } from "@/lib/delivery";
import { vatIncluded } from "@/lib/format";
import type { PlacedOrder } from "@/lib/order";
import {
  CUSTOMER_FIELDS,
  MAX_QUANTITY,
  validateCustomer,
  type CheckoutErrors,
  type CheckoutRequest,
  type CustomerFields,
} from "@/lib/orders/checkout";
import { forwardOrderToSupplier } from "@/lib/orders/fulfillment";
import { addOrderNote, changeOrderStatus, createOrder, findOrderForCustomer, markOrderPaid } from "@/lib/orders/service";
import type { OrderStatus } from "@/lib/orders/status";
import { paymentMode } from "@/lib/payments/mepaye";
import { startMepayePayment } from "@/lib/payments/orders";
import { getProduct, type Product } from "@/lib/products";
import { site } from "@/lib/site";

export type PlaceOrderResult =
  /** paymentUrl : page de paiement où rediriger le client (absente en simulation). */
  | { ok: true; order: PlacedOrder; paymentUrl?: string }
  | { ok: false; errors?: CheckoutErrors; message?: string };

const PAYMENT_UNAVAILABLE =
  "Le paiement est momentanément indisponible. Votre commande n'a pas été validée : réessayez dans un instant.";

/**
 * Enregistre une commande. Tout ce qui vient du navigateur est revérifié :
 * champs, articles, prix (relus dans le catalogue), stock et mode de livraison.
 */
export async function placeOrder(request: CheckoutRequest): Promise<PlaceOrderResult> {
  const customer = Object.fromEntries(
    CUSTOMER_FIELDS.map((name) => {
      const value = request?.customer?.[name];
      return [name, typeof value === "string" ? value.trim() : ""];
    }),
  ) as CustomerFields;
  const errors = validateCustomer(customer, request?.terms === true);
  if (Object.keys(errors).length > 0) return { ok: false, errors, message: "Vérifiez les champs signalés." };

  if (!Array.isArray(request.items) || request.items.length === 0 || request.items.length > 10) {
    return { ok: false, message: "Votre panier est vide." };
  }
  const quantities = new Map<Product, number>();
  for (const item of request.items) {
    const product = typeof item?.slug === "string" ? getProduct(item.slug) : undefined;
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY) {
      return { ok: false, message: "Votre panier contient un article invalide. Rechargez la page." };
    }
    quantities.set(product, Math.min((quantities.get(product) ?? 0) + qty, MAX_QUANTITY));
  }
  const lines = [...quantities].map(([product, qty]) => ({ product, qty }));

  const deliveries = await getDeliveryMap();
  const unavailable = lines.find((line) => !deliveries[line.product.slug].inStock);
  if (unavailable) {
    return { ok: false, message: `Le ${site.name} ${unavailable.product.model} n'est plus en stock.` };
  }
  const shipping = shippingOffers(lines.map((line) => deliveries[line.product.slug])).find(
    (offer) => offer.id === request.shippingMethod,
  );
  if (!shipping) {
    return { ok: false, message: "Ce mode de livraison n'est plus disponible. Choisissez-en un autre." };
  }

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const total = subtotal + shipping.price;

  let order;
  try {
    order = await createOrder({
      customer,
      newsletter: request.newsletter === true,
      items: lines.map(({ product, qty }) => ({
        slug: product.slug,
        name: `${site.name} ${product.model}`,
        sku: product.cj.sku,
        vid: product.cj.vid,
        unitPrice: product.price,
        quantity: qty,
      })),
      shipping,
      subtotal,
      vat: vatIncluded(total, site.vatRate),
      total,
    });
  } catch (error) {
    console.error("[commande] enregistrement impossible :", error);
    return { ok: false, message: "Votre commande n'a pas pu être enregistrée. Réessayez dans un instant." };
  }

  const placed: PlacedOrder = {
    number: order.number,
    placedAt: order.createdAt.toISOString(),
    email: order.email,
    firstName: order.firstName,
    address: { line1: order.address1, line2: order.address2, postalCode: order.postalCode, city: order.city },
    items: lines.map(({ product, qty }) => ({ slug: product.slug, qty, total: product.price * qty })),
    shipping,
    total,
    payment: paymentMode() === "simulation" ? "simulated" : "online",
  };

  // Sans agrégateur configuré, la commande est marquée payée d'office.
  if (paymentMode() === "simulation") {
    await markOrderPaid(order.id, { provider: "simulation", reference: order.number });
    // Transmission à CJ une fois la réponse envoyée : le client n'attend pas.
    after(() => forwardOrderToSupplier(order.id));
    return { ok: true, order: placed };
  }

  // Paiement Mepaye : la commande attend le webhook de paiement pour partir chez CJ.
  try {
    return { ok: true, order: placed, paymentUrl: await startMepayePayment(order) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Mepaye] paiement de ${order.number} impossible à ouvrir :`, message);
    await addOrderNote(order.number, `Paiement impossible à ouvrir chez Mepaye : ${message}`).catch(() => {});
    await changeOrderStatus(order.number, "cancelled").catch(() => {});
    return { ok: false, message: PAYMENT_UNAVAILABLE };
  }
}

const validLookup = (number: unknown, email: unknown): number is string =>
  typeof number === "string" && typeof email === "string" && number.length <= 20 && email.length <= 200;

/** Statut d'une commande pour la page de confirmation (numéro + e-mail du client). */
export async function checkPayment(number: string, email: string): Promise<OrderStatus | null> {
  if (!validLookup(number, email)) return null;
  const order = await findOrderForCustomer(number, email);
  return order?.status ?? null;
}

/** Nouvelle tentative de paiement pour une commande restée en attente. */
export async function resumePayment(
  number: string,
  email: string,
): Promise<{ ok: true; paymentUrl: string } | { ok: false; message: string }> {
  if (!validLookup(number, email)) return { ok: false, message: "Commande introuvable." };
  const order = await findOrderForCustomer(number, email);
  if (!order) return { ok: false, message: "Commande introuvable." };
  if (order.status !== "pending_payment") return { ok: false, message: "Cette commande n'attend plus de paiement." };
  if (paymentMode() === "simulation") return { ok: false, message: PAYMENT_UNAVAILABLE };
  try {
    // Nouvelle clé : le paiement précédent a pu échouer définitivement.
    return { ok: true, paymentUrl: await startMepayePayment(order, `${order.number}-${randomUUID()}`) };
  } catch (error) {
    console.error(`[Mepaye] nouvelle tentative pour ${order.number} impossible :`, error);
    return { ok: false, message: PAYMENT_UNAVAILABLE };
  }
}
