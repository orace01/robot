import "server-only";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

/**
 * Envoi des e-mails par le SMTP de la boîte LWS (contact@<domaine>).
 *
 * Variables d'environnement :
 * - SMTP_HOST : le vrai serveur LWS (par exemple mailNN.lwspanel.com), pas mail.<domaine> ;
 * - SMTP_PORT : 465 (par défaut) ;
 * - SMTP_USER, SMTP_PASSWORD : l'adresse de la boîte et son mot de passe.
 * En local seulement, EMAIL_OUTBOX_DIR écrit les e-mails dans ce dossier (fichiers .eml)
 * au lieu de les envoyer. Sans réglage, rien n'est envoyé.
 */

interface Address {
  name: string;
  address: string;
}

export interface Email {
  /** Objet { name, address } : l'adresse n'est pas analysée, rien ne peut s'y glisser. */
  to: Address;
  subject: string;
  text: string;
  html: string;
  replyTo?: Address;
}

export type EmailMode = "smtp" | "outbox" | "off";

export function emailMode(): EmailMode {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) return "smtp";
  if (process.env.EMAIL_OUTBOX_DIR && process.env.VERCEL_ENV !== "production") return "outbox";
  return "off";
}

/** Adresse du service client : celle affichée sur le site, sinon la boîte d'envoi. */
export function supportAddress(): string | null {
  return site.email ?? process.env.SMTP_USER ?? null;
}

type Transport = ReturnType<typeof nodemailer.createTransport>;
let transporter: Transport | undefined;

function smtpTransport(): Transport {
  const port = Number(process.env.SMTP_PORT ?? 465);
  // Délais courts : un serveur lent ne doit pas bloquer la confirmation d'un paiement.
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

/** Envoie l'e-mail. Renvoie false s'il n'est pas parti (jamais d'exception). */
export async function sendEmail(email: Email): Promise<boolean> {
  const mode = emailMode();
  if (mode === "off") {
    console.warn(`[e-mail] non envoyé, SMTP non configuré : « ${email.subject} »`);
    return false;
  }

  const support = supportAddress();
  const message = {
    from: { name: site.name, address: process.env.SMTP_USER ?? "boutique@localhost" },
    to: email.to,
    replyTo: email.replyTo ?? (support ? { name: site.name, address: support } : undefined),
    subject: email.subject,
    text: email.text,
    html: email.html,
  };

  try {
    if (mode === "outbox") {
      const info = await nodemailer.createTransport({ streamTransport: true, buffer: true }).sendMail(message);
      const dir = path.resolve(process.env.EMAIL_OUTBOX_DIR!);
      mkdirSync(dir, { recursive: true });
      const name = `${Date.now()}-${email.subject.normalize("NFD").replace(/[^\w]+/g, "-").slice(0, 60)}.eml`;
      writeFileSync(path.join(dir, name), info.message as Buffer);
      return true;
    }
    await smtpTransport().sendMail(message);
    return true;
  } catch (error) {
    console.error(`[e-mail] « ${email.subject} » non envoyé :`, error instanceof Error ? error.message : error);
    return false;
  }
}

/** Texte saisi par un client, à insérer dans du HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
