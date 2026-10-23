"use server";

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
import { createOrder, markOrderPaid } from "@/lib/orders/service";
import { getProduct, type Product } from "@/lib/products";
import { site } from "@/lib/site";

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; errors?: CheckoutErrors; message?: string };

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

  try {
    const order = await createOrder({
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

    // En attendant l'agrégateur de paiement, la commande est marquée payée d'office.
    if (site.paymentMode === "simulation") {
      await markOrderPaid(order.id, { provider: "simulation", reference: order.number });
      // Transmission à CJ une fois la réponse envoyée : le client n'attend pas.
      after(() => forwardOrderToSupplier(order.id));
    }

    return {
      ok: true,
      order: {
        number: order.number,
        placedAt: order.createdAt.toISOString(),
        email: order.email,
        firstName: order.firstName,
        address: {
          line1: order.address1,
          line2: order.address2,
          postalCode: order.postalCode,
          city: order.city,
        },
        items: lines.map(({ product, qty }) => ({ slug: product.slug, qty, total: product.price * qty })),
        shipping,
        total,
      },
    };
  } catch (error) {
    console.error("[commande] enregistrement impossible :", error);
    return { ok: false, message: "Votre commande n'a pas pu être enregistrée. Réessayez dans un instant." };
  }
}
