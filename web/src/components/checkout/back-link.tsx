"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Lien de retour du tunnel : vers le panier pendant la commande, vers la boutique ensuite. */
export function CheckoutBackLink() {
  const confirmed = usePathname().startsWith("/commande/confirmation");
  return (
    <Link
      href={confirmed ? "/" : "/panier"}
      className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden />
      <span className="hidden sm:inline">{confirmed ? "Retour à la boutique" : "Retour au panier"}</span>
    </Link>
  );
}
