// Vérification sans risque du webhook Mepaye, une fois le site en ligne :
// 1. une notification non signée doit recevoir 400 ;
// 2. une notification signée, pour un paiement inexistant, doit recevoir 200 {"received":true}
//    sans toucher aucune commande.
//
// Usage : MEPAYE_WEBHOOK_SECRET=whsec_... node scripts/verifier-webhook.mjs https://<projet>.vercel.app
import { createHmac, randomUUID } from "node:crypto";

const site = process.argv[2]?.replace(/\/$/, "");
const secret = process.env.MEPAYE_WEBHOOK_SECRET;
if (!site || !secret) {
  console.error("Usage : MEPAYE_WEBHOOK_SECRET=whsec_... node scripts/verifier-webhook.mjs https://<projet>.vercel.app");
  process.exit(1);
}

const url = `${site}/api/payments/notify`;
const reference = `VERIFICATION-${Date.now()}`;
const body = JSON.stringify({
  event: "payment.succeeded",
  data: { id: `pay_verification_${randomUUID().slice(0, 8)}`, externalReference: reference, status: "succeeded", amount: 100, currency: "EUR", test: false, created_at: new Date().toISOString() },
  deliveredAt: new Date().toISOString(),
});
const headers = { "Content-Type": "application/json", "X-Mepaye-Event": "payment.succeeded", "X-Mepaye-Delivery": `dlv_verification_${Date.now()}` };

const unsigned = await fetch(url, { method: "POST", headers, body, redirect: "manual" });
const unsignedOk = unsigned.status === 400;
console.log(`${unsignedOk ? "OK   " : "ÉCHEC"} non signée → ${unsigned.status} (attendu 400)`);

const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
const signed = await fetch(url, { method: "POST", headers: { ...headers, "X-Mepaye-Signature": signature }, body, redirect: "manual" });
const text = await signed.text();
const signedOk = signed.status === 200 && text.replace(/\s/g, "") === '{"received":true}';
console.log(`${signedOk ? "OK   " : "ÉCHEC"} signée, commande ${reference} inexistante → ${signed.status} ${text} (attendu 200 {"received":true})`);

if ([unsigned, signed].some((res) => res.status >= 300 && res.status < 400)) {
  console.log("Le site redirige la notification : ne jamais rediriger le domaine vercel.app dans Vercel.");
}
process.exit(unsignedOk && signedOk ? 0 : 1);
