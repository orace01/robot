"use client";

import { useSyncExternalStore } from "react";
import { Truck } from "lucide-react";
import { addBusinessDays, formatShortDate } from "@/lib/format";
import { shippingMethods } from "@/lib/site";

const noop = () => () => {};

/**
 * Date de livraison estimée. Elle dépend du jour de la visite : elle est donc
 * calculée dans le navigateur uniquement (le serveur affiche le délai brut).
 */
export function DeliveryEstimate() {
  const standard = shippingMethods[0];
  const range = useSyncExternalStore(
    noop,
    () => {
      const today = new Date();
      return `${formatShortDate(addBusinessDays(today, standard.minDays))} et le ${formatShortDate(addBusinessDays(today, standard.maxDays))}`;
    },
    () => null,
  );

  return (
    <p className="flex items-start gap-3 rounded-[16px] bg-white p-4 text-sm ring-1 ring-black/5">
      <Truck className="mt-0.5 size-5 shrink-0 text-ink-soft" aria-hidden />
      <span>
        <span className="font-medium">Livraison offerte</span>
        {range ? (
          <>
            , estimée entre le <span className="font-medium">{range}</span>
          </>
        ) : (
          <>
            , sous {standard.minDays} à {standard.maxDays} jours ouvrés.
          </>
        )}
        <span className="mt-0.5 block text-muted">Colis suivi, numéro envoyé par e-mail dès l&apos;expédition.</span>
      </span>
    </p>
  );
}
