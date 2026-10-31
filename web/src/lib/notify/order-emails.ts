import "server-only";

import { addDays, formatPrice, formatShortDate } from "@/lib/format";
import { addEmailEvent, getOrder, type OrderWithDetails } from "@/lib/orders/service";
import { site } from "@/lib/site";
import { escapeHtml, sendEmail, supportAddress, type Email } from "./mailer";

/**
 * E-mails envoyés aux clients : confirmation de commande (une fois le paiement reçu)
 * et avis d'expédition (numéro de suivi). Chaque envoi est noté dans l'historique.
 */

const link = (path: string) => new URL(path, site.url).toString();

/** Gabarit HTML commun, sobre et lisible dans toutes les messageries. */
function layout(title: string, body: string): string {
  const support = supportAddress();
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f2f3f5;font-family:Arial,Helvetica,sans-serif;color:#0d0f12">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px">
<tr><td style="padding:28px 28px 0;font-size:22px;font-weight:bold;letter-spacing:-0.5px">${escapeHtml(site.name.toLowerCase())}</td></tr>
<tr><td style="padding:20px 28px 28px;font-size:15px;line-height:1.6">${body}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#6b7280">
${support ? `Une question ? Répondez simplement à cet e-mail ou écrivez à ${escapeHtml(support)}.<br>` : ""}
<a href="${link("/livraison-retours")}" style="color:#6b7280">Livraison et retours</a> · <a href="${link("/cgv")}" style="color:#6b7280">Conditions générales de vente</a>
</p>
</td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#0d0f12;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold">${escapeHtml(label)}</a></p>`;

function recipient(order: OrderWithDetails) {
  return { name: `${order.firstName} ${order.lastName}`, address: order.email };
}

function deliveryWindow(order: OrderWithDetails): string {
  const start = order.paidAt ?? order.createdAt;
  return `entre le ${formatShortDate(addDays(start, order.deliveryMinDays))} et le ${formatShortDate(addDays(start, order.deliveryMaxDays))}`;
}

export function orderConfirmationEmail(order: OrderWithDetails): Email {
  const subject = `Votre commande ${order.number} est confirmée`;
  const items = order.items.map((item) => ({
    label: `${item.quantity} × ${item.productName}`,
    price: formatPrice(item.total),
  }));
  const shipping = order.shippingPrice === 0 ? "offerte" : formatPrice(order.shippingPrice);
  const address = [order.address1, order.address2, `${order.postalCode} ${order.city}`, "France"].filter(Boolean);
  const delivery = deliveryWindow(order);

  const text = [
    `Bonjour ${order.firstName},`,
    "",
    `Merci pour votre commande ! Votre paiement est bien reçu et la commande ${order.number} est confirmée.`,
    "",
    ...items.map((item) => `- ${item.label} : ${item.price}`),
    `- ${order.shippingLabel} : ${shipping}`,
    `Total payé : ${formatPrice(order.total)}`,
    "",
    "Livraison à :",
    `${order.firstName} ${order.lastName}`,
    ...address,
    "",
    `Livraison prévue : ${delivery}`,
    "Vous recevrez un e-mail avec le numéro de suivi dès l'expédition.",
    `Suivre votre commande : ${link("/suivi")} (numéro ${order.number} et cette adresse e-mail).`,
    "",
    `Vous disposez de ${site.returnDays} jours à compter de la réception pour changer d'avis : ${link("/livraison-retours")}`,
    `Conditions générales de vente : ${link("/cgv")}`,
    "",
    `À bientôt,`,
    `L'équipe ${site.name}`,
  ].join("\n");

  const rows = [...items, { label: order.shippingLabel, price: shipping }]
    .map(
      (row) =>
        `<tr><td style="padding:6px 0">${escapeHtml(row.label)}</td><td align="right" style="padding:6px 0;white-space:nowrap">${escapeHtml(row.price)}</td></tr>`,
    )
    .join("");
  const html = layout(
    subject,
    `<p style="margin:0 0 12px">Bonjour ${escapeHtml(order.firstName)},</p>
<p style="margin:0 0 16px">Merci pour votre commande ! Votre paiement est bien reçu et la commande <strong>${escapeHtml(order.number)}</strong> est confirmée.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #d8dbe1;border-bottom:1px solid #d8dbe1;margin:8px 0 4px">${rows}
<tr><td style="padding:10px 0;font-weight:bold;border-top:1px solid #d8dbe1">Total payé</td><td align="right" style="padding:10px 0;font-weight:bold;border-top:1px solid #d8dbe1;white-space:nowrap">${escapeHtml(formatPrice(order.total))}</td></tr></table>
<p style="margin:20px 0 4px;font-weight:bold">Livraison à</p>
<p style="margin:0">${[`${order.firstName} ${order.lastName}`, ...address].map(escapeHtml).join("<br>")}</p>
<p style="margin:20px 0 0">Livraison prévue : <strong>${escapeHtml(delivery)}</strong><br>Vous recevrez un e-mail avec le numéro de suivi dès l'expédition.</p>
${button(link("/suivi"), "Suivre ma commande")}
<p style="margin:0;font-size:13px;color:#6b7280">Vous disposez de ${site.returnDays} jours à compter de la réception pour changer d'avis : voir <a href="${link("/livraison-retours")}" style="color:#6b7280">livraison et retours</a>.</p>`,
  );

  return { to: recipient(order), subject, text, html };
}

export function shippingNoticeEmail(order: OrderWithDetails): Email {
  const subject = `Votre commande ${order.number} est expédiée`;
  const numbers = (order.trackingNumber ?? "").split(",").map((n) => n.trim()).filter(Boolean);
  const trackingUrl = `https://t.17track.net/fr#nums=${encodeURIComponent(numbers.join(","))}`;
  const several = numbers.length > 1;

  const text = [
    `Bonjour ${order.firstName},`,
    "",
    `Bonne nouvelle : votre commande ${order.number} est en route !`,
    "",
    `${several ? "Numéros de suivi" : "Numéro de suivi"} (${order.carrier ?? "transporteur"}) : ${numbers.join(", ")}`,
    `Suivre le colis : ${trackingUrl}`,
    several ? "Vos robots partent d'entrepôts différents : ils arrivent en plusieurs colis." : "",
    "",
    `Livraison prévue : ${deliveryWindow(order)}`,
    `Vous pouvez aussi suivre votre commande sur ${link("/suivi")}.`,
    "",
    `À bientôt,`,
    `L'équipe ${site.name}`,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  const html = layout(
    subject,
    `<p style="margin:0 0 12px">Bonjour ${escapeHtml(order.firstName)},</p>
<p style="margin:0 0 16px">Bonne nouvelle : votre commande <strong>${escapeHtml(order.number)}</strong> est en route !</p>
<p style="margin:0">${several ? "Numéros de suivi" : "Numéro de suivi"} (${escapeHtml(order.carrier ?? "transporteur")}) :<br><strong style="font-family:monospace;font-size:16px">${numbers.map(escapeHtml).join("<br>")}</strong></p>
${several ? `<p style="margin:12px 0 0">Vos robots partent d'entrepôts différents : ils arrivent en plusieurs colis.</p>` : ""}
${button(trackingUrl, "Suivre le colis")}
<p style="margin:0">Livraison prévue : <strong>${escapeHtml(deliveryWindow(order))}</strong><br>Vous pouvez aussi suivre votre commande sur <a href="${link("/suivi")}" style="color:#1f45e0">notre page de suivi</a>.</p>`,
  );

  return { to: recipient(order), subject, text, html };
}

async function sendAndLog(order: OrderWithDetails, email: Email, label: string): Promise<void> {
  const sent = await sendEmail(email);
  await addEmailEvent(order.id, sent ? `${label} envoyé à ${order.email}.` : `${label} non envoyé (SMTP non configuré ou en erreur).`);
}

/** Confirmation de commande : à appeler une seule fois, quand le paiement vient d'être reçu. */
export async function sendOrderConfirmation(number: string): Promise<void> {
  const order = await getOrder(number);
  if (order) await sendAndLog(order, orderConfirmationEmail(order), "E-mail de confirmation");
}

/** Avis d'expédition, avec le ou les numéros de suivi. */
export async function sendShippingNotice(number: string): Promise<void> {
  const order = await getOrder(number);
  if (order?.trackingNumber) await sendAndLog(order, shippingNoticeEmail(order), "E-mail d'expédition");
}
