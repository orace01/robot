"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { addOrderNote, changeOrderStatus, OrderError, setTracking } from "@/lib/orders/service";
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
  return run(() => setTracking(orderNumber, carrierName, tracking));
}

export async function saveOrderNote(number: string, message: string): Promise<AdminActionResult> {
  await requireAdmin();
  const orderNumber = text(number, 20);
  const note = text(message, 1000);
  if (!orderNumber || !note) return { error: "La note est vide." };
  return run(() => addOrderNote(orderNumber, note));
}
