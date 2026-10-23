import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { syncSupplierOrders } from "@/lib/orders/fulfillment";

/**
 * Tâche planifiée (toutes les 15 à 30 minutes) : retente les transmissions à CJ en échec
 * et reporte suivi, expédition et livraison sur les commandes.
 * Appel : GET /api/cj/sync avec l'en-tête « Authorization: Bearer <CRON_SECRET> »
 * (format des tâches planifiées Vercel).
 */
export const maxDuration = 300;

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const result = await syncSupplierOrders({ limit: 100 });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("[CJ] synchronisation impossible :", error);
    return Response.json({ ok: false, error: "Synchronisation impossible" }, { status: 500 });
  }
}
