/**
 * Réglages généraux de la boutique.
 * Le nom est provisoire : le changer ici suffit à le mettre à jour partout.
 */
export const site = {
  name: "Clair",
  /** Adresse publique du site (à définir avec le nom de domaine). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Robots laveurs de vitres : pulvérisation automatique, aspiration régulée, détection des bords. Livraison offerte en France.",
  email: "contact@exemple.fr",
  supportHours: "du lundi au vendredi, de 9 h à 18 h",
  supportDelay: "sous 24 h ouvrées",
  /** Délai légal de rétractation (jours). Peut être allongé, jamais réduit. */
  returnDays: 14,
  /** Garantie légale de conformité (années). */
  warrantyYears: 2,
  vatRate: 0.2,
  /**
   * Affiche les repères de maquette (« prix provisoire », « avis d'exemple »…).
   * À passer à false avant la mise en ligne.
   */
  mockup: true,
  /**
   * « simulation » : la commande est marquée payée sans paiement réel, en attendant
   * le branchement de l'agrégateur de paiement.
   */
  paymentMode: "simulation",
} as const;

/**
 * Livraison. Les délais de transport viennent de CJ Dropshipping (voir lib/cj) ;
 * on y ajoute le temps de préparation de la commande.
 */
export const shippingConfig = {
  standardLabel: "Livraison standard suivie",
  expressLabel: "Livraison express suivie",
  /** Supplément express payé par le client, en centimes TTC (provisoire : CJ facture environ 9 à 11 $ de plus). */
  expressPrice: 990,
  /** Préparation de la commande avant expédition, en jours (provisoire). */
  processingDays: { min: 1, max: 3 },
  /** Délai affiché si CJ ne répond pas. */
  fallback: { minDays: 8, maxDays: 15 },
} as const;

export const nav = [
  { href: "/robots", label: "Nos robots" },
  { href: "/#fonctionnement", label: "Comment ça marche" },
  { href: "/robots#comparer", label: "Comparer" },
  { href: "/faq", label: "FAQ" },
];

export const footerNav = [
  {
    title: "Boutique",
    links: [
      { href: "/robots", label: "Tous les robots" },
      { href: "/robots/q3", label: `${site.name} Q3` },
      { href: "/robots/s2", label: `${site.name} S2` },
      { href: "/robots/o1", label: `${site.name} O1` },
      { href: "/robots#comparer", label: "Comparer les modèles" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/suivi", label: "Suivre ma commande" },
      { href: "/faq", label: "Questions fréquentes" },
      { href: "/livraison-retours", label: "Livraison et retours" },
      { href: "/contact", label: "Nous contacter" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgv", label: "Conditions générales de vente" },
      { href: "/confidentialite", label: "Confidentialité et cookies" },
    ],
  },
];
