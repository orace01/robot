import "server-only";

import { cacheLife } from "next/cache";

/**
 * Client de l'API CJ Dropshipping (côté serveur uniquement : la clé ne doit jamais
 * atteindre le navigateur). Documentation : https://developers.cjdropshipping.com
 */

const BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";
/** CJ limite à un appel par seconde et par compte. */
const MIN_INTERVAL_MS = 1100;

export class CjError extends Error {
  name = "CjError";
}

interface CjEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export type CjRequest = <T>(method: "GET" | "POST", path: string, params?: Record<string, unknown>) => Promise<T>;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function send<T>(path: string, init: { method: string; token?: string; body?: unknown }): Promise<CjEnvelope<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: init.method,
    headers: {
      "Content-Type": "application/json",
      ...(init.token ? { "CJ-Access-Token": init.token } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (response.status === 429) throw new CjError(`CJ limite les appels (HTTP 429) sur ${path} : réessayer plus tard.`);
  if (!response.ok) throw new CjError(`HTTP ${response.status} sur ${path}`);
  return response.json();
}

/**
 * Jeton d'accès, valable 180 jours. CJ limite fortement sa demande : on le garde en
 * cache plusieurs jours. En production, le fournir via CJ_ACCESS_TOKEN évite de le
 * redemander à chaque démarrage du serveur.
 */
async function requestAccessToken(): Promise<string> {
  "use cache";
  cacheLife("days");

  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new CjError("CJ_API_KEY n'est pas définie (fichier web/.env.local).");
  const json = await send<{ accessToken?: string }>("/authentication/getAccessToken", {
    method: "POST",
    body: { apiKey },
  });
  if (!json.data?.accessToken) throw new CjError(`Authentification CJ refusée : ${json.message}`);
  return json.data.accessToken;
}

/**
 * Ouvre une série d'appels à CJ, espacés d'au moins une seconde. À utiliser à
 * l'intérieur d'une seule fonction mise en cache : les appels y sont faits l'un
 * après l'autre (Next.js interdit de partager une file d'attente entre fonctions en cache).
 */
export async function openCjSession(): Promise<CjRequest> {
  const token = process.env.CJ_ACCESS_TOKEN || (await requestAccessToken());
  let lastCallAt = Date.now();

  return async function request<T>(method: "GET" | "POST", path: string, params: Record<string, unknown> = {}) {
    const wait = lastCallAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await pause(wait);
    lastCallAt = Date.now();

    const url = method === "GET" ? `${path}?${new URLSearchParams(params as Record<string, string>).toString()}` : path;
    const json = await send<T>(url, { method, token, body: method === "POST" ? params : undefined });
    if (json.code !== 200) throw new CjError(`CJ ${path} : ${json.code} ${json.message}`);
    return json.data;
  };
}
