import { site } from "./site";

/**
 * Identité légale du vendeur, reprise dans les pages légales.
 *
 * Choix du 25 octobre 2026 : pas d'entreprise enregistrée pour l'instant. Chaque valeur
 * à null retire la ligne correspondante des pages légales ; elle apparaît dès qu'elle est
 * renseignée. Seule l'adresse e-mail du service client est indispensable (site.email).
 */
export interface Seller {
  /** Raison sociale, ou prénom et nom suivis de « EI » pour un entrepreneur individuel. */
  name: string | null;
  /** « Entrepreneur individuel (micro-entreprise) », « SAS au capital de 1 000 € »… */
  legalForm: string | null;
  /** Adresse postale complète. */
  address: string | null;
  /** « SIREN 123 456 789, RNE » ou « SIREN 123 456 789, RCS Paris ». */
  registration: string | null;
  /** Numéro de TVA intracommunautaire, ou « TVA non applicable, article 293 B du CGI ». */
  vat: string | null;
  phone: string | null;
  /** Directeur ou directrice de la publication, le plus souvent le dirigeant. */
  publisher: string | null;
  /** Médiateur de la consommation auquel le vendeur adhère : nom et adresse de son site. */
  mediator: string | null;
}

export const seller: Seller = {
  name: null,
  legalForm: null,
  address: null,
  registration: null,
  vat: null,
  phone: null,
  publisher: null,
  mediator: null,
};

/** Adresse du site sans « https:// » (robot-vitre.vercel.app, puis le domaine). */
export const siteHost = new URL(site.url).host;

/** Hébergeur du site (adresse tirée de sa politique de confidentialité). */
export const hostingProvider = "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis";

/** Prestataire de paiement : le client paie sur sa page sécurisée. */
export const paymentProvider = "Mepaye";

/** Date de la dernière mise à jour des pages légales. */
export const legalUpdatedAt = "25 octobre 2026";

/** Informations indispensables à la vente encore manquantes, en clair. */
export function missingLegalInfo(): string[] {
  return site.email ? [] : ["adresse e-mail du service client"];
}
