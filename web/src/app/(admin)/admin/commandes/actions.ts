"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { supplierMode } from "@/lib/cj/orders";
import { sendShippingNotice } from "@/lib/notify/order-emails";
import { forwardOrderToSupplier, syncSupplierOrders } from "@/lib/orders/fulfillment";
import { addOrderNote, changeOrderStatus, getOrder, OrderError, setTracking } from "@/lib/orders/service";
import { isOrderStatus } from "@/lib/orders/status";

export type AdminActionResult = { error?: string };

async function run(task: () => Promise<void>): Promise<AdminActionResult> {
  try {
    await task();
  } catch (error) {
    if (error instanceof OrderError) return { error: error.message };
    console.error("[admin] action impossible :", error);
    return { error: "Erreur inattendue, réessaie." };
  }
  refresh();
  return {};
}

const text = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;

export async function updateOrderStatus(number: string, status: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  if (!orderNumber || !isOrderStatus(status)) return { error: "Demande invalide." };
  return run(() => changeOrderStatus(orderNumber, status));
}

export async function saveOrderTracking(number: string, carrier: string, trackingNumber: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  const carrierName = text(carrier, 60);
  const tracking = text(trackingNumber, 60);
  if (!orderNumber || !carrierName || !tracking) return { error: "Indique le transporteur et le numéro de suivi." };
  return run(async () => {
    await setTracking(orderNumber, carrierName, tracking);
    await sendShippingNotice(orderNumber);
  });
}

export async function saveOrderNote(number: string, message: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  const note = text(message, 1000);
  if (!orderNumber || !note) return { error: "La note est vide." };
  return run(() => addOrderNote(orderNumber, note));
}

async function findOrder(number: string) {
  const order = await getOrder(number);
  if (!order) throw new OrderError("Commande introuvable.");
  return order;
}

/** Transmet (ou retransmet après un échec) une commande payée à CJ. */
export async function sendOrderToSupplier(number: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  if (!orderNumber) return { error: "Demande invalide." };
  if (supplierMode() === "off") return { error: "Transmission à CJ désactivée (CJ_ORDER_MODE=off dans .env.local)." };
  return run(async () => {
    const order = await findOrder(orderNumber);
    if (order.status !== "paid") throw new OrderError("Seules les commandes payées, pas encore en préparation, partent chez CJ.");
    await forwardOrderToSupplier(order.id);
  });
}

/** Relit tout de suite l'état de la commande chez CJ (sinon fait par la tâche planifiée). */
export async function refreshFromSupplier(number: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  if (!orderNumber) return { error: "Demande invalide." };
  return run(async () => {
    const order = await findOrder(orderNumber);
    await syncSupplierOrders({ orderId: order.id });
  });
}
