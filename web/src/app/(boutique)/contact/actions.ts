"use server";

import { CONTACT_SUBJECTS } from "@/lib/contact";
import { escapeHtml, sendEmail, supportAddress } from "@/lib/notify/mailer";
import { site } from "@/lib/site";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  order: string;
  message: string;
  /** Champ invisible : rempli seulement par les robots. */
  website: string;
}

export type ContactResult = { ok: true } | { ok: false; message: string };

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Envoie le message du formulaire de contact à la boîte du service client. */
export async function sendContactMessage(request: ContactRequest): Promise<ContactResult> {
  // Robot : on fait comme si le message était parti.
  if (clean(request?.website, 200)) return { ok: true };

  const name = clean(request?.name, 100);
  const email = clean(request?.email, 200);
  const subject = clean(request?.subject, 60);
  const order = clean(request?.order, 20);
  const message = clean(request?.message, 4000);
  if (!name || !message || !(CONTACT_SUBJECTS as readonly string[]).includes(subject)) {
    return { ok: false, message: "Indiquez votre nom, un sujet et votre message." };
  }
  if (!/^[^\s@"<>;,]+@[^\s@"<>;,]+\.[^\s@"<>;,]+$/.test(email)) {
    return { ok: false, message: "Saisissez une adresse e-mail valide." };
  }

  const support = supportAddress();
  if (!support) return { ok: false, message: "Le formulaire est momentanément indisponible. Réessayez bientôt." };

  const title = `[Contact] ${subject}${order ? ` · ${order}` : ""}`;
  const sent = await sendEmail({
    to: { name: site.name, address: support },
    replyTo: { name, address: email },
    subject: title,
    text: [`De : ${name} <${email}>`, `Sujet : ${subject}`, order ? `Commande : ${order}` : "", "", message]
      .filter((line, i) => line !== "" || i === 3)
      .join("\n"),
    html: `<p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br><strong>Sujet :</strong> ${escapeHtml(subject)}${
      order ? `<br><strong>Commande :</strong> ${escapeHtml(order)}` : ""
    }</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });
  return sent ? { ok: true } : { ok: false, message: "Votre message n'a pas pu partir. Réessayez dans un instant." };
}
