import { verifyMepayeSignature, type MepayeEvent } from "@/lib/payments/mepaye";
import { handleMepayeEvent } from "@/lib/payments/orders";

/**
 * Webhook Mepaye : https://<projet>.vercel.app/api/payments/notify, à déclarer dans l'espace
 * Mepaye (Développeur › Webhooks) avec les événements « Paiement réussi (API) » et
 * « Paiement échoué (API) ».
 *
 * Un webhook Mepaye ne se modifie pas, et le recréer change son secret : garder cette
 * adresse vercel.app et ne jamais rediriger ce domaine dans Vercel.
 *
 * - Notification non signée ou mal signée : 400.
 * - Notification valide, même sans commande correspondante : 200 { received: true }.
 * - Erreur interne : 500, et Mepaye réessaie (5 fois au plus).
 */
export async function POST(request: Request) {
  // La signature porte sur le corps brut, tel que reçu.
  const rawBody = await request.text();
  if (!verifyMepayeSignature(rawBody, request.headers.get("x-mepaye-signature"))) {
    return Response.json({ error: "Signature absente ou invalide" }, { status: 400 });
  }

  let event: MepayeEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (typeof event?.data?.externalReference === "string") {
    try {
      await handleMepayeEvent(event);
    } catch (error) {
      console.error(`[Mepaye] notification ${request.headers.get("x-mepaye-delivery")} non traitée :`, error);
      return Response.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
  return Response.json({ received: true });
}
