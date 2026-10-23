"use server";

import { after } from "next/server";
import { syncSupplierOrders } from "@/lib/orders/fulfillment";
import { findOrderForCustomer } from "@/lib/orders/service";
import { statusLabels, type OrderStatus } from "@/lib/orders/status";

/** Ce que le client voit de sa commande (pas d'adresse ni de téléphone). */
export interface TrackedOrder {
  number: string;
  status: OrderStatus;
  statusLabel: string;
  placedAt: string;
  deliveryMinDays: number;
  deliveryMaxDays: number;
  carrier: string | null;
  /** Un ou plusieurs numéros, séparés par des virgules. */
  trackingNumber: string | null;
  items: { name: string; quantity: number }[];
  events: { message: string; date: string }[];
}

export type TrackOrderResult = { ok: true; order: TrackedOrder } | { ok: false; message: string };

export async function trackOrder(number: string, email: string): Promise<TrackOrderResult> {
  if (typeof number !== "string" || typeof email !== "string" || number.length > 20 || email.length > 200) {
    return { ok: false, message: "Numéro de commande ou adresse e-mail invalide." };
  }
  const order = await findOrderForCustomer(number, email);
  if (!order) {
    return { ok: false, message: "Aucune commande ne correspond à ce numéro et à cette adresse e-mail." };
  }
  // Nouvelles de CJ si les dernières datent de plus de 30 minutes : visibles à la consultation suivante.
  if (["paid", "processing", "shipped"].includes(order.status)) {
    after(() => syncSupplierOrders({ orderId: order.id, staleMinutes: 30 }));
  }
  return {
    ok: true,
    order: {
      number: order.number,
      status: order.status,
      statusLabel: statusLabels[order.status],
      placedAt: order.createdAt.toISOString(),
      deliveryMinDays: order.deliveryMinDays,
      deliveryMaxDays: order.deliveryMaxDays,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      items: order.items.map((item) => ({ name: item.productName, quantity: item.quantity })),
      events: order.events.map((event) => ({ message: event.message, date: event.createdAt.toISOString() })),
    },
  };
}
