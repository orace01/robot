"use client";

import { useSyncExternalStore } from "react";
import { Truck } from "lucide-react";
import { formatRange, type ProductDelivery } from "@/lib/delivery";
import { addDays, formatShortDate } from "@/lib/format";

const noop = () => () => {};

/**
 * Date de livraison estimée. Elle dépend du jour de la visite : elle est donc
 * calculée dans le navigateur uniquement (le serveur affiche le délai brut).
 */
export function DeliveryEstimate({ delivery }: { delivery: ProductDelivery }) {
  const { minDays, maxDays } = delivery.standard;
  const dates = useSyncExternalStore(
    noop,
    () => {
      const today = new Date();
      return `${formatShortDate(addDays(today, minDays))} et le ${formatShortDate(addDays(today, maxDays))}`;
    },
    () => null,
  );

  return (
    <p className="flex items-start gap-3 rounded-[16px] bg-white p-4 text-sm ring-1 ring-black/5">
      <Truck className="mt-0.5 size-5 shrink-0 text-ink-soft" aria-hidden />
      <span>
        <span className="font-medium">Livraison offerte</span>
        {dates ? (
          <>
            , estimée entre le <span className="font-medium">{dates}</span>
          </>
        ) : (
          <>, sous {formatRange(delivery.standard)}</>
        )}
        <span className="mt-0.5 block text-muted">
          Expédié {delivery.shippedFrom}, colis suivi. Numéro de suivi envoyé par e-mail dès l&apos;expédition.
        </span>
      </span>
    </p>
  );
}
