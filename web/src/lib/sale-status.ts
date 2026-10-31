import "server-only";

import { missingLegalInfo } from "@/lib/legal";
import { livePayments, paymentMode } from "@/lib/payments/mepaye";

/**
 * Verrou de vente : sur le site en ligne, les commandes restent fermées tant qu'il manque
 * une pièce indispensable. Les raisons sont lisibles sur /api/shop et dans les journaux.
 * En local, la vente reste ouverte en paiement simulé.
 */
export function saleStatus(): { open: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const online = process.env.VERCEL_ENV === "production";

  if (paymentMode() === "unavailable") reasons.push("clé de paiement Mepaye absente");
  if (online && paymentMode() === "mepaye" && !livePayments()) reasons.push("clé Mepaye de test sur le site en ligne");
  if (online) {
    for (const info of missingLegalInfo()) reasons.push(`information légale manquante : ${info}`);
    const database = process.env.DATABASE_URL ?? process.env.DATABASE_TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
    if (!database) reasons.push("base de données non configurée");
    if (!process.env.CJ_ACCESS_TOKEN && !process.env.CJ_API_KEY) reasons.push("accès CJ non configuré");
  }
  return { open: reasons.length === 0, reasons };
}
