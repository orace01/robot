// Formatage fait à la main plutôt qu'avec Intl : le rendu doit être identique
// côté serveur et navigateur, sinon React signale un écart à l'hydratation.

const NBSP = " ";
const NNBSP = " ";

/** 28900 → « 289 € » (compact) ou « 289,00 € ». */
export function formatPrice(cents: number, { compact = false } = {}): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.round(cents));
  const euros = Math.floor(abs / 100);
  const rest = abs % 100;
  const int = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  if (compact && rest === 0) return `${sign}${int}${NBSP}€`;
  return `${sign}${int},${String(rest).padStart(2, "0")}${NBSP}€`;
}

/** TVA contenue dans un prix TTC. */
export function vatIncluded(cents: number, rate: number): number {
  return Math.round(cents - cents / (1 + rate));
}

const DAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « jeu. 30 oct. » */
export function formatShortDate(date: Date): string {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function addDays(from: Date, days: number): Date {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count > 1 ? plural : singular}`;
}

/** 127.36 → « 127,36 $ » (montants CJ, en dollars). */
export function formatUsd(dollars: number): string {
  const [int, rest] = Math.abs(dollars).toFixed(2).split(".");
  return `${dollars < 0 ? "-" : ""}${int.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP)},${rest}${NBSP}$`;
}
