import { saleStatus } from "@/lib/sale-status";

/** État de la boutique : vente ouverte ou non, et pourquoi (vérification après déploiement). */
export function GET() {
  const { open, reasons } = saleStatus();
  return Response.json({ saleOpen: open, closedReason: open ? null : reasons.join(" ; ") });
}
