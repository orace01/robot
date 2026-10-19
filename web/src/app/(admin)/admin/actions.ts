"use server";

import { redirect } from "next/navigation";
import { adminConfigured, checkAdminPassword, closeAdminSession, openAdminSession } from "@/lib/auth/admin";

export async function login(_previous: string | undefined, formData: FormData): Promise<string | undefined> {
  if (!adminConfigured()) {
    return "Administration non configurée : ajoute ADMIN_PASSWORD et ADMIN_SESSION_SECRET dans web/.env.local.";
  }
  const password = formData.get("password");
  if (typeof password !== "string" || !checkAdminPassword(password)) {
    // Ralentit les tentatives répétées.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return "Mot de passe incorrect.";
  }
  await openAdminSession();
  redirect("/admin/commandes");
}

export async function logout(): Promise<void> {
  await closeAdminSession();
  redirect("/admin/connexion");
}
