import "server-only";

import { after } from "next/server";
import type { OrderRow } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { forwardOrderToSupplier } from "@/lib/orders/fulfillment";
import { addOrderNote, attachPayment, getOrder, markOrderPaid } from "@/lib/orders/service";
import { statusLabels } from "@/lib/orders/status";
import { acceptsEvent, createMepayePayment, MEPAYE_CURRENCY, type MepayeEvent } from "./mepaye";

/**
 * Ouvre un paiement Mepaye pour la commande et renvoie l'adresse de la page de paiement.
 * Par défaut la clé d'idempotence est le numéro de commande : un double clic renvoie
 * le même paiement. Pour une nouvelle tentative après un échec, passer une autre clé.
 */
export async function startMepayePayment(order: OrderRow, idempotencyKey = order.number): Promise<string> {
  const payment = await createMepayePayment({
    reference: order.number,
    idempotencyKey,
    amountCents: order.total,
    buyer: { name: `${order.firstName} ${order.lastName}`, email: order.email, phone: order.phone },
  });
  await attachPayment(order.id, { provider: payment.test ? "mepaye_test" : "mepaye", reference: payment.id });
  return payment.paymentUrl;
}

/**
 * Webhook Mepaye (signature déjà vérifiée). Un même événement peut arriver plusieurs
 * fois : tout ce qui suit peut être rejoué sans effet de bord.
 */
export async function handleMepayeEvent({ event, data }: MepayeEvent): Promise<void> {
  if (event !== "payment.succeeded" && event !== "payment.failed") return;
  if (!acceptsEvent(data.test === true)) {
    console.warn(`[Mepaye] paiement ${data.id} ignoré : ${data.test ? "paiement de test reçu avec une clé réelle" : "paiement réel reçu avec une clé de test"}`);
    return;
  }

  const order = await getOrder(data.externalReference);
  if (!order) {
    console.warn(`[Mepaye] paiement ${data.id} : commande ${data.externalReference} inconnue`);
    return;
  }
  const label = `Mepaye ${data.id}${data.test ? ", paiement de test" : ""}`;

  if (event === "payment.failed") {
    if (order.status === "pending_payment") await addOrderNote(order.number, `Paiement refusé ou abandonné (${label}).`);
    return;
  }

  if (data.currency !== MEPAYE_CURRENCY || data.amount !== order.total) {
    await addOrderNote(
      order.number,
      `Paiement reçu (${label}) mais d'un montant inattendu : ${data.amount} ${data.currency} au lieu de ${formatPrice(order.total)}. Commande non validée : vérifie dans Mepaye.`,
    );
    return;
  }

  const paid = await markOrderPaid(order.id, { provider: data.test ? "mepaye_test" : "mepaye", reference: data.id });
  if (paid) {
    // Transmission à CJ une fois la réponse rendue à Mepaye.
    after(() => forwardOrderToSupplier(order.id));
  } else if (order.paymentReference !== data.id) {
    await addOrderNote(
      order.number,
      `Deuxième paiement reçu (${label}) pour une commande déjà « ${statusLabels[order.status]} » : à rembourser au client depuis Mepaye.`,
    );
  }
}
