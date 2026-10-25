import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Paiement par Mepaye (https://mepaye.com/developpeur/docs) :
 * 1. le serveur crée un paiement et reçoit l'adresse de la page de paiement ;
 * 2. le client y est redirigé et paie ;
 * 3. Mepaye prévient le site par un webhook signé (/api/payments/notify).
 * Mepaye n'a pas d'API de lecture d'état : seul le webhook fait foi.
 *
 * Variables d'environnement :
 * - MEPAYE_API_KEY : clé « mp_test_… » (paiements de test) ou « mp_live_… » (réels) ;
 * - MEPAYE_WEBHOOK_SECRET : secret du webhook (« whsec_… », valeur complète), affiché à sa
 *   création dans l'espace Mepaye (Développeur › Webhooks).
 * Sans clé, le paiement est simulé en local ; sur le site en ligne, les commandes sont refusées.
 */

const API_URL = process.env.MEPAYE_API_URL ?? "https://mepaye.com/api/v1";
/** Devise de la boutique Mepaye : elle doit être réglée en euros. */
export const MEPAYE_CURRENCY = "EUR";

export type PaymentMode = "simulation" | "mepaye" | "unavailable";

export function paymentMode(): PaymentMode {
  if (process.env.MEPAYE_API_KEY) return "mepaye";
  // Jamais de paiement simulé sur le site en ligne : de vrais visiteurs commanderaient sans payer.
  return process.env.VERCEL_ENV === "production" ? "unavailable" : "simulation";
}

/** Paiements réels encaissés (clé « mp_live_ ») : seule condition pour passer de vraies commandes CJ. */
export function livePayments(): boolean {
  return process.env.MEPAYE_API_KEY?.startsWith("mp_live_") ?? false;
}

/**
 * Un événement de test n'est accepté qu'avec une clé de test, un événement réel qu'avec une
 * clé réelle : une clé de test n'ouvre jamais la vente réelle, et inversement.
 */
export function acceptsEvent(test: boolean): boolean {
  const key = process.env.MEPAYE_API_KEY;
  if (!key) return false;
  return key.startsWith("mp_live_") ? !test : test;
}

/** « 06 12 34 56 78 » ou « +33 6 12 34 56 78 » → « +33612345678 » (format attendu par Mepaye). */
export function internationalPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0033")) return `+${digits.slice(2)}`;
  return `+33${digits.replace(/^0/, "")}`;
}

/** Fournisseurs de paiement dont les commandes ne déclenchent jamais de vraie commande CJ. */
export const TEST_PAYMENT_PROVIDERS = ["simulation", "mepaye_test"];

export class MepayeError extends Error {
  name = "MepayeError";
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export interface MepayePayment {
  id: string;
  status: string;
  test: boolean;
  paymentUrl: string;
}

export async function createMepayePayment(input: {
  /** Notre numéro de commande, renvoyé tel quel dans le webhook. */
  reference: string;
  /** Même clé = même paiement : un double clic ne crée pas deux paiements. */
  idempotencyKey: string;
  amountCents: number;
  buyer: { name: string; email: string; phone: string };
}): Promise<MepayePayment> {
  const apiKey = process.env.MEPAYE_API_KEY;
  if (!apiKey) throw new MepayeError("MEPAYE_API_KEY n'est pas définie.");

  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      // Montant en centimes (devise à deux décimales).
      amount: input.amountCents,
      currency: MEPAYE_CURRENCY,
      externalReference: input.reference,
      buyer: { ...input.buyer, phone: internationalPhone(input.buyer.phone), country: "FR" },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.payment_url) {
    const error = json?.error;
    throw new MepayeError(
      `Mepaye HTTP ${response.status} : ${error?.code ?? "réponse inattendue"} ${error?.message ?? ""}`.trim(),
      error?.code,
    );
  }
  return { id: json.id, status: json.status, test: Boolean(json.test), paymentUrl: json.payment_url };
}

/** Événement reçu par webhook, une fois la signature vérifiée. */
export interface MepayeEvent {
  event: string;
  data: {
    id: string;
    externalReference: string;
    status: string;
    amount: number;
    currency: string;
    test: boolean;
  };
}

/**
 * Vérifie la signature d'un webhook : « sha256=<hex> », HMAC-SHA256 du corps brut
 * (tel que reçu, sans le re-sérialiser) avec le secret du webhook.
 */
export function verifyMepayeSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.MEPAYE_WEBHOOK_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const received = Buffer.from(header.slice("sha256=".length));
  return received.length === expected.length && timingSafeEqual(received, expected);
}
