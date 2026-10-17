import "server-only";

import { cacheLife } from "next/cache";

/** Valeur de secours si la Banque centrale européenne ne répond pas. */
const FALLBACK_USD_PER_EUR = 1.12;

/** Dollars pour 1 euro, d'après le taux de référence quotidien de la BCE (cache d'une journée). */
export async function getUsdPerEur(): Promise<{ rate: number; date: string | null }> {
  "use cache";
  cacheLife("days");

  try {
    const response = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
    const xml = await response.text();
    const rate = Number(xml.match(/currency='USD' rate='([\d.]+)'/)?.[1]);
    if (rate > 0) return { rate, date: xml.match(/time='([\d-]+)'/)?.[1] ?? null };
  } catch (error) {
    console.error("[BCE] taux de change indisponible :", error instanceof Error ? error.message : error);
  }
  return { rate: FALLBACK_USD_PER_EUR, date: null };
}
