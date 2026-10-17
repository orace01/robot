/**
 * Économie d'une vente (estimation). Hors publicité, retours, droits de douane et
 * frais de change.
 */

/** Frais de paiement estimés (ordre de grandeur des cartes européennes). */
export const paymentFees = { rate: 0.015, fixedCents: 25 };

/** Marge visée pour le prix conseillé, en part du prix hors taxes. */
export const targetMarginRate = 0.35;

export interface UnitEconomics {
  /** Achat + transport, convertis en euros (centimes). */
  supplierCents: number;
  /** Prix de vente hors TVA (centimes). */
  netCents: number;
  vatCents: number;
  feesCents: number;
  marginCents: number;
  /** Marge en part du prix hors TVA. */
  marginRate: number;
  /** Prix TTC à partir duquel la vente ne perd plus d'argent. */
  breakEvenCents: number;
  /** Prix TTC donnant la marge visée. */
  targetPriceCents: number;
}

export function unitEconomics({
  priceCents,
  costUsd,
  shippingUsd,
  usdPerEur,
  vatRate,
}: {
  priceCents: number;
  costUsd: number;
  shippingUsd: number;
  usdPerEur: number;
  vatRate: number;
}): UnitEconomics {
  const supplierCents = Math.round(((costUsd + shippingUsd) / usdPerEur) * 100);
  const netCents = Math.round(priceCents / (1 + vatRate));
  const feesCents = Math.round(priceCents * paymentFees.rate + paymentFees.fixedCents);
  const marginCents = netCents - supplierCents - feesCents;
  // Prix TTC p tel que : p / (1 + TVA) × (1 − marge visée) − frais(p) = coût fournisseur.
  const priceFor = (margin: number) =>
    Math.ceil((supplierCents + paymentFees.fixedCents) / ((1 - margin) / (1 + vatRate) - paymentFees.rate));

  return {
    supplierCents,
    netCents,
    vatCents: priceCents - netCents,
    feesCents,
    marginCents,
    marginRate: marginCents / netCents,
    breakEvenCents: priceFor(0),
    targetPriceCents: priceFor(targetMarginRate),
  };
}
