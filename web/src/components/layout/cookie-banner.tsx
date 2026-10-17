"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Bandeau de consentement (maquette). Refuser doit être aussi simple qu'accepter
 * (recommandations CNIL). Aucun traceur n'est encore installé sur le site.
 */
const KEY = "cookies:consentement";
const EVENT = "consentement-cookies";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readChoice() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return "indisponible";
  }
}

function saveChoice(value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    // Stockage indisponible : le bandeau réapparaîtra à la prochaine visite.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Rouvre le bandeau (lien « Gérer les cookies » du pied de page). */
export function reopenCookieBanner() {
  saveChoice(null);
}

export function CookieBanner() {
  // Côté serveur, on considère qu'un choix existe : le bandeau n'apparaît qu'au navigateur.
  const choice = useSyncExternalStore(subscribe, readChoice, () => "serveur");
  if (choice !== null) return null;

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-2 bottom-2 z-40 rounded-[22px] bg-white p-5 shadow-[0_24px_60px_-20px_rgba(13,15,18,0.35)] ring-1 ring-black/5 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist">
          <Cookie className="size-4" aria-hidden />
        </span>
        <div>
          <p className="font-semibold">Un petit cookie ?</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Nous utilisons des cookies indispensables au fonctionnement du site, comme le panier. Avec votre accord,
            nous mesurerions aussi l&apos;audience pour améliorer la boutique.{" "}
            <Link href="/confidentialite" className="underline underline-offset-2">
              En savoir plus
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={() => saveChoice("refuse")}>
          Tout refuser
        </Button>
        <Button variant="primary" size="sm" onClick={() => saveChoice("accepte")}>
          Tout accepter
        </Button>
      </div>
    </div>
  );
}
