import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Accès à l'administration : un mot de passe (ADMIN_PASSWORD) et un cookie de session
 * signé (ADMIN_SESSION_SECRET), valable 7 jours.
 */

const COOKIE_NAME = "admin_session";
const SESSION_DAYS = 7;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET manquante ou trop courte (32 caractères minimum).");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Comparaison à temps constant sur des empreintes de même longueur.
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(candidate, expected!);
}

export async function openAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${expiresAt}`;
  (await cookies()).set(COOKIE_NAME, `${expiresAt}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function closeAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  // L'heure courante n'est lue qu'à la requête, jamais pendant le précalcul des pages.
  await connection();
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  return safeEqual(signature, sign(`admin.${expiresAt}`));
}

/** À appeler en tête de chaque page et action d'administration. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/connexion");
}
