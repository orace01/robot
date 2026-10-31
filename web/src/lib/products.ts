/**
 * Catalogue de la maquette.
 *
 * Les textes et caractéristiques viennent des visuels fournisseur CJ Dropshipping.
 * Une valeur `null` signifie « à confirmer » (fiche CJ ou échantillon) : elle s'affiche
 * comme telle sur le site. Les prix sont provisoires.
 *
 * Le prix d'achat, le stock et les délais de livraison viennent de l'API CJ
 * (voir lib/cj, via `cj.pid` et `cj.vid`) ; les textes en français et le prix
 * de vente restent gérés ici, côté boutique.
 */

export type ProductSlug = "o1" | "s2" | "q3";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Produit détouré sur fond transparent : affiché en entier, jamais recadré. */
  cutout?: boolean;
}

export interface Stat {
  value: string;
  unit?: string;
  label: string;
}

export interface Feature {
  eyebrow: string;
  title: string;
  text: string;
  image: ProductImage;
}

/** Annotation technique : point sur le produit (en % de l'image) relié à une étiquette. */
export interface Callout {
  x: number;
  y: number;
  title: string;
  text: string;
  side: "left" | "right";
  /** Hauteur de l'étiquette, en % du cadre. */
  labelY: number;
}

export type CleaningPath = "n" | "z" | "nz";

export interface CleaningMode {
  name: string;
  path: CleaningPath;
  text: string;
}

export interface Spec {
  label: string;
  value: string | null;
}

export type CompareKey =
  | "format"
  | "dimensions"
  | "weight"
  | "suction"
  | "spray"
  | "edges"
  | "modes"
  | "remote"
  | "backup"
  | "rope"
  | "speed";

/** Référence chez CJ Dropshipping : produit, variante commandée et pays d'expédition. */
export interface CjReference {
  sku: string;
  pid: string;
  /** Variante commandée (prise européenne quand il y a le choix). */
  vid: string;
  /** Pays de l'entrepôt d'où part le colis (code ISO). */
  shipFrom: string;
}

export interface Product {
  slug: ProductSlug;
  model: string;
  tier: string;
  badge: string;
  tagline: string;
  description: string;
  /** Prix de vente TTC en centimes (provisoire). */
  price: number;
  hero: ProductImage;
  /** Scène plein écran du hero de l'accueil (photo de situation). */
  scene: ProductImage;
  gallery: ProductImage[];
  cardSpecs: string[];
  stats: Stat[];
  highlights: string[];
  features: Feature[];
  anatomy?: { image: ProductImage; callouts: Callout[] };
  modes?: CleaningMode[];
  specs: Spec[];
  /** Contenu du colis ; `null` tant qu'il n'est pas confirmé. */
  inBox: string[] | null;
  faq: { q: string; a: string }[];
  compare: Record<CompareKey, string | boolean | null>;
  cj: CjReference;
}

function img(src: string, width: number, height: number, alt: string, cutout = false): ProductImage {
  return { src, width, height, alt, cutout };
}

/* ------------------------------------------------------------------ Q3 */

const q3Hero = img("/produits/q3/face.webp", 1400, 1400, "Robot laveur de vitres Q3 vu de face", true);

const q3: Product = {
  slug: "q3",
  model: "Q3",
  tier: "Premium",
  badge: "Le plus complet",
  tagline: "Le plus complet, le plus fin, le plus sûr.",
  description:
    "Double réservoir et pulvérisation ultrasonique, trois modes de nettoyage, capteurs anti-chute, batterie de secours et télécommande : le Q3 réunit tout ce qu'on attend d'un robot laveur de vitres. Avec 6,8 cm d'épaisseur, il passe même entre une vitre et une grille de défense.",
  price: 26900,
  hero: q3Hero,
  scene: img("/produits/q3/situation-ville.webp", 800, 800, ""),
  gallery: [
    q3Hero,
    img("/produits/q3/situation-ville.webp", 800, 800, "Le Q3 sur une baie vitrée face à la ville"),
    img("/produits/q3/telecommande.webp", 660, 660, "Le Q3 piloté avec sa télécommande"),
    img("/produits/q3/situation-facade.webp", 800, 800, "Le Q3 sur une verrière"),
    img("/produits/q3/situation-baie.webp", 660, 660, "Le Q3 sur une grande baie vitrée"),
    img("/produits/q3/pulverisation.webp", 790, 610, "Le Q3 pulvérise de l'eau sur la vitre"),
    img("/produits/q3/profil-fin.webp", 790, 466, "Le profil fin du Q3 sur une vitre"),
  ],
  cardSpecs: ["3000 Pa", "3 modes", "Batterie de secours"],
  stats: [
    { value: "3000", unit: "Pa", label: "Aspiration" },
    { value: "2", unit: "min/m²", label: "Vitesse de nettoyage" },
    { value: "6,8", unit: "cm", label: "Épaisseur" },
    { value: "650", unit: "mAh", label: "Batterie de secours" },
  ],
  highlights: [
    "Pulvérisation ultrasonique, double réservoir",
    "3 modes : express, humide, profondeur ×2",
    "Capteurs anti-chute, avec ou sans cadre",
    "Batterie de secours et corde de 4,5 m",
    "Télécommande sans fil incluse",
  ],
  features: [
    {
      eyebrow: "Pulvérisation ultrasonique",
      title: "Une brume de 18 microns.",
      text: "Sa buse ultrasonique transforme l'eau en brume très fine, qui ramollit les taches juste avant le passage des lingettes. La pulvérisation alterne entre l'avant et l'arrière, selon le sens de déplacement.",
      image: img("/produits/q3/pulverisation.webp", 790, 610, "Pulvérisation ultrasonique du Q3 sur une vitre"),
    },
    {
      eyebrow: "Double réservoir",
      title: "Un plein pour toute la maison.",
      text: "D'après le fabricant, un seul remplissage permet de nettoyer jusqu'à 50 m² de vitres. Moins d'interruptions, plus de fenêtres propres.",
      image: img("/produits/q3/reservoir.webp", 380, 290, "Le double réservoir d'eau du Q3"),
    },
    {
      eyebrow: "Capteurs anti-chute",
      title: "Il repère le vide avant vous.",
      text: "Ses capteurs optiques détectent le bord de la vitre, même quand elle n'a pas de cadre. Le Q3 repart alors dans l'autre sens.",
      image: img("/produits/q3/capteurs.webp", 790, 440, "Les capteurs optiques du Q3 détectent le bord de la vitre"),
    },
    {
      eyebrow: "Moteur sans balais",
      title: "Plus de puissance, moins de bruit.",
      text: "Son moteur brushless entraîne une turbine métallique : une aspiration puissante et régulière, un bruit réduit et une durée de vie prolongée.",
      image: img("/produits/q3/moteur.webp", 790, 366, "Le moteur sans balais et sa turbine métallique"),
    },
    {
      eyebrow: "Chenilles multicouches",
      title: "Il adhère, même sur vitre mouillée.",
      text: "Surface en caoutchouc, âme en nylon, engrenages renforcés : ses chenilles résistent à l'eau et ne patinent pas, pour une trajectoire stable du premier au dernier passage.",
      image: img("/produits/q3/chenilles.webp", 790, 536, "Les chenilles multicouches du Q3"),
    },
    {
      eyebrow: "Télécommande",
      title: "Pilotez-le depuis le canapé.",
      text: "Démarrage, choix du mode, direction : tout se commande à distance, sans fil.",
      image: img("/produits/q3/telecommande.webp", 660, 660, "La télécommande du Q3"),
    },
  ],
  modes: [
    { name: "Express", path: "n", text: "Un passage vertical en N, à sec. Idéal pour l'entretien régulier." },
    { name: "Humide", path: "z", text: "Un passage horizontal en Z, avec pulvérisation à l'avant et à l'arrière." },
    {
      name: "Profondeur ×2",
      path: "nz",
      text: "Un passage à sec en N, puis un passage humide en Z. Pour les vitres très sales.",
    },
  ],
  specs: [
    { label: "Dimensions", value: "24,8 × 24,8 × 6,8 cm" },
    { label: "Poids", value: "1,39 kg" },
    { label: "Aspiration", value: "3000 Pa" },
    { label: "Puissance", value: "80 W" },
    { label: "Alimentation", value: "100–240 V, 50/60 Hz" },
    { label: "Batterie de secours", value: "650 mAh, lithium-polymère" },
    { label: "Vitesse de nettoyage", value: "Environ 2 min par m²" },
    { label: "Pulvérisation", value: "Ultrasonique, double réservoir" },
    { label: "Modes", value: "Express, humide, profondeur ×2" },
    { label: "Gestion des bords", value: "Capteurs optiques anti-chute" },
    { label: "Commande", value: "Bouton unique et télécommande 2,4 GHz" },
    { label: "Corde de sécurité", value: "4,5 m, résistance 150 kg" },
    { label: "Épaisseur de vitre", value: "Toutes épaisseurs" },
    { label: "Type de prise", value: "Européenne" },
  ],
  inBox: [
    "Robot Q3",
    "Télécommande",
    "4 lingettes microfibre",
    "Flacon pulvérisateur",
    "Corde de sécurité (4,5 m)",
    "Adaptateur secteur (câble de 4 m)",
    "Cordon d'alimentation (1 m)",
    "Notice d'utilisation",
  ],
  faq: [
    {
      q: "Fonctionne-t-il sur une vitre sans cadre ?",
      a: "Oui. Ses capteurs optiques détectent le bord de la vitre et le font repartir dans l'autre sens, avec ou sans cadre.",
    },
    {
      q: "Que se passe-t-il en cas de coupure de courant ?",
      a: "Sa batterie de secours prend le relais : le Q3 reste plaqué contre la vitre et déclenche une alarme. Il ne reste plus qu'à le décrocher. La corde de sécurité reste votre seconde protection.",
    },
    {
      q: "Peut-il nettoyer derrière une grille de défense ?",
      a: "Avec 6,8 cm d'épaisseur, il se glisse entre une vitre et une grille de défense si l'espace atteint environ 9 cm.",
    },
    {
      q: "Que mettre dans le réservoir ?",
      a: "De l'eau claire suffit pour l'entretien courant. Pour les taches tenaces, ajoutez un liquide nettoyant pour vitres.",
    },
  ],
  compare: {
    format: "Carré",
    dimensions: "24,8 × 24,8 × 6,8 cm",
    weight: "1,39 kg",
    suction: "3000 Pa",
    spray: "Ultrasonique, double réservoir",
    edges: "Capteurs anti-chute, avec ou sans cadre",
    modes: "3",
    remote: true,
    backup: "650 mAh",
    rope: "4,5 m, 150 kg",
    speed: "Environ 2 min/m²",
  },
  // Variante « White-European Standard », stock usine en Chine.
  cj: { sku: "CJYD2056958", pid: "2406100310411606101", vid: "2406100310411606301", shipFrom: "CN" },
};

/* ------------------------------------------------------------------ S2 */

const s2Hero = img("/produits/s2/face.webp", 759, 1567, "Robot laveur de vitres S2 vu de face", true);
const s2ThreeQuarter = img(
  "/produits/s2/trois-quarts.webp",
  1046,
  1568,
  "Robot laveur de vitres S2 vu de trois quarts",
  true,
);

const s2: Product = {
  slug: "s2",
  model: "S2",
  tier: "Confort",
  badge: "Le plus compact",
  tagline: "Il pulvérise, il essuie, il s'arrête pile au bord.",
  description:
    "Deux buses humidifient la vitre pendant que deux disques en microfibre l'essuient. Le S2 repère les cadres pour couper la pulvérisation au bon moment et ajuste sa force d'aspiration selon l'état de la vitre.",
  price: 22900,
  hero: s2Hero,
  // Scène provisoire (celle du Q3), à remplacer par une image Google Flow.
  scene: img("/produits/q3/situation-facade.webp", 800, 800, ""),
  gallery: [
    s2Hero,
    s2ThreeQuarter,
    img("/produits/s2/pulverisation.webp", 1400, 1400, "Le S2 pulvérise de l'eau des deux côtés"),
    img("/produits/s2/trois-quarts-droit.webp", 798, 1577, "Le S2 vu de trois quarts, côté droit", true),
    img("/produits/s2/profil.webp", 498, 1566, "Le profil du S2", true),
    img("/produits/s2/profil-bas.webp", 1200, 501, "Le S2 posé à plat", true),
    img("/produits/s2/incline.webp", 1200, 1440, "Le S2 incliné", true),
    img("/produits/s2/patins.webp", 794, 1594, "Les deux disques microfibre sous le S2", true),
    img("/produits/s2/coupe.webp", 800, 800, "Vue en coupe de la turbine d'aspiration du S2"),
  ],
  cardSpecs: ["Pulvérisation double", "Détection des cadres", "27,5 × 13,8 cm"],
  stats: [
    { value: "2", label: "Buses de pulvérisation" },
    { value: "2", label: "Disques microfibre" },
    { value: "27,5", unit: "cm", label: "Longueur" },
    { value: "8", unit: "cm", label: "Épaisseur" },
  ],
  highlights: [
    "Pulvérisation automatique à l'avant et à l'arrière",
    "Coupe la pulvérisation à l'approche des cadres",
    "Aspiration ajustée selon la saleté",
    "Trajet en zigzag, sans zone oubliée",
  ],
  features: [
    {
      eyebrow: "Pulvérisation double",
      title: "Un voile d'eau, pas une averse.",
      text: "Deux buses vaporisent de fines gouttelettes devant et derrière le robot. La vitre est humidifiée juste avant le passage des disques microfibre, pour un essuyage sans traces.",
      image: img("/produits/s2/pulverisation.webp", 1400, 1400, "Le S2 pulvérise de l'eau des deux côtés"),
    },
    {
      eyebrow: "Détection des cadres",
      title: "Il sait où s'arrêter.",
      text: "À l'approche d'un cadre, le S2 coupe la pulvérisation pour ne pas détremper les joints, puis repart dans l'autre sens.",
      image: img("/produits/s2/profil-bas.webp", 1200, 501, "Le S2 posé à plat", true),
    },
    {
      eyebrow: "Aspiration régulée",
      title: "La juste force, au bon endroit.",
      text: "Sa turbine ajuste la puissance d'aspiration selon l'encrassement de la vitre : il reste bien plaqué, sans forcer inutilement.",
      image: img("/produits/s2/coupe.webp", 800, 800, "Vue en coupe de la turbine d'aspiration du S2"),
    },
    {
      eyebrow: "Microfibre",
      title: "Deux disques, zéro trace.",
      text: "Ses deux disques en microfibre essuient la vitre en continu pendant qu'il avance en zigzag, sans laisser de zone oubliée.",
      image: img("/produits/s2/patins.webp", 794, 1594, "Les deux disques microfibre sous le S2", true),
    },
  ],
  anatomy: {
    image: s2ThreeQuarter,
    callouts: [
      {
        x: 52,
        y: 5,
        side: "left",
        labelY: 13,
        title: "Buses de pulvérisation",
        text: "Elles humidifient la vitre devant et derrière le robot.",
      },
      {
        x: 44,
        y: 19,
        side: "left",
        labelY: 44,
        title: "Commandes intégrées",
        text: "Un appui pour démarrer : il calcule seul son trajet.",
      },
      {
        x: 88,
        y: 28,
        side: "right",
        labelY: 14,
        title: "Disques microfibre",
        text: "Ils essuient la vitre en continu, sans laisser de traces.",
      },
      {
        x: 62,
        y: 50,
        side: "right",
        labelY: 56,
        title: "Turbine d'aspiration",
        text: "Elle plaque le robot contre la vitre et ajuste sa force selon la saleté.",
      },
    ],
  },
  specs: [
    { label: "Dimensions", value: "27,5 × 13,8 × 8 cm" },
    { label: "Pulvérisation", value: "Double, automatique" },
    { label: "Gestion des bords", value: "Détection des cadres" },
    { label: "Aspiration", value: "Régulée automatiquement" },
    { label: "Trajet", value: "Zigzag automatique" },
    { label: "Puissance d'aspiration", value: null },
    { label: "Poids", value: "650 g (donnée fournisseur)" },
    { label: "Batterie de secours", value: null },
    { label: "Télécommande", value: null },
    { label: "Corde de sécurité", value: null },
    { label: "Type de prise", value: null },
  ],
  inBox: null,
  faq: [
    {
      q: "Fonctionne-t-il sur une vitre sans cadre ?",
      a: "Le S2 s'appuie sur la détection des cadres. Pour les vitres sans cadre, nous vous conseillons le Q3, équipé de capteurs anti-chute.",
    },
    {
      q: "Quelle eau utiliser ?",
      a: "De l'eau claire suffit pour l'entretien courant. Pour les taches tenaces, ajoutez un liquide nettoyant pour vitres.",
    },
  ],
  compare: {
    format: "Allongé",
    dimensions: "27,5 × 13,8 × 8 cm",
    weight: "650 g",
    suction: "Régulée automatiquement",
    spray: "Double, automatique",
    edges: "Détection des cadres",
    modes: null,
    remote: null,
    backup: null,
    rope: null,
    speed: null,
  },
  // Variante unique « White », stock dans l'entrepôt CJ d'Allemagne.
  cj: { sku: "CJQX2533882", pid: "1968575516469805057", vid: "1968575516612411393", shipFrom: "DE" },
};

/* ------------------------------------------------------------------ O1 */

const o1Hero = img("/produits/o1/face.webp", 354, 690, "Robot laveur de vitres O1 vu de face", true);

const o1: Product = {
  slug: "o1",
  model: "O1",
  tier: "Essentiel",
  badge: "Le plus accessible",
  tagline: "L'essentiel, pour des vitres nettes sans se compliquer la vie.",
  description:
    "Le O1 va droit au but : il se plaque à la vitre grâce à sa puissante aspiration, la parcourt de bord en bord et l'essuie avec ses lingettes microfibre. Parfait pour les fenêtres avec cadre, les miroirs et les parois de douche.",
  price: 17000,
  hero: o1Hero,
  // Scène provisoire (celle du Q3), à remplacer par une image Google Flow.
  scene: img("/produits/q3/situation-baie.webp", 660, 660, ""),
  gallery: [o1Hero, img("/produits/o1/trois-quarts.webp", 466, 254, "Le O1 vu de trois quarts", true)],
  cardSpecs: ["5600 Pa", "Télécommande", "Vitres avec cadre"],
  stats: [
    { value: "5600", unit: "Pa", label: "Aspiration annoncée" },
    { value: "2,52", unit: "kg", label: "Maintien vertical" },
    { value: "3", unit: "mm", label: "Épaisseur de vitre min." },
  ],
  highlights: [
    "Aspiration puissante, adhérence stable",
    "Télécommande incluse",
    "Batterie de secours et corde de sécurité",
    "Vitres, miroirs, carrelage, parois de douche",
  ],
  features: [
    {
      eyebrow: "Adhérence",
      title: "Il tient, même à la verticale.",
      text: "Sa turbine crée un vide d'air qui plaque le robot contre la surface. D'après le fabricant, il supporte jusqu'à 2,52 kg de charge à la verticale.",
      image: img("/produits/o1/trois-quarts.webp", 466, 254, "Le O1 vu de trois quarts", true),
    },
    {
      eyebrow: "Signaux",
      title: "Il vous dit tout, d'un coup d'œil.",
      text: "Voyant bleu : il travaille. Orange : il charge. Rouge : il a besoin de vous. Une alarme sonore prend le relais en cas d'anomalie.",
      image: o1Hero,
    },
  ],
  anatomy: {
    image: o1Hero,
    callouts: [
      { x: 50, y: 8, side: "left", labelY: 10, title: "Alarme sonore", text: "Elle vous alerte en cas d'anomalie." },
      {
        x: 50,
        y: 21,
        side: "right",
        labelY: 22,
        title: "Voyants d'état",
        text: "Bleu en marche, orange en charge, rouge en cas d'alerte.",
      },
      {
        x: 50,
        y: 72,
        side: "left",
        labelY: 66,
        title: "Sortie d'air",
        text: "L'air aspiré par la turbine est évacué ici.",
      },
      {
        x: 50,
        y: 84,
        side: "right",
        labelY: 82,
        title: "Alimentation",
        text: "Prise du câble et interrupteur marche / arrêt.",
      },
    ],
  },
  specs: [
    { label: "Aspiration", value: "5600 Pa (donnée fabricant)" },
    { label: "Maintien", value: "2,52 kg à la verticale, 1,3 kg à l'horizontale" },
    { label: "Épaisseur de vitre", value: "3 mm minimum" },
    { label: "Surfaces", value: "Vitres avec cadre, miroirs, carrelage, parois de douche" },
    { label: "Commande", value: "Télécommande ou mode automatique" },
    { label: "Modes", value: "3 directions de nettoyage" },
    { label: "Voyants", value: "Marche (bleu), charge (orange), anomalie (rouge)" },
    { label: "Dimensions", value: "30 × 15 × 13 cm" },
    { label: "Poids", value: "0,95 kg" },
    { label: "Vitesse de nettoyage", value: "Environ 0,23 m² par minute" },
    { label: "Taille de vitre minimale", value: "35 × 35 cm" },
    { label: "Pulvérisation", value: "Non : lingette à humidifier avant usage" },
    { label: "Batterie de secours", value: "Oui" },
    { label: "Corde de sécurité", value: "Oui" },
    { label: "Type de prise", value: "Européenne" },
  ],
  inBox: null,
  faq: [
    {
      q: "Fonctionne-t-il sur une vitre sans cadre ?",
      a: "Non : le O1 a besoin d'un cadre ou d'un rebord pour se repérer. Pour les vitres sans cadre, choisissez le Q3.",
    },
    {
      q: "Sur quelles surfaces l'utiliser ?",
      a: "Fenêtres, baies vitrées avec cadre, miroirs, parois de douche et carrelage mural, à condition que la surface soit lisse, délimitée et d'au moins 35 × 35 cm.",
    },
    {
      q: "Faut-il mouiller la lingette ?",
      a: "Oui : le O1 n'a pas de réservoir. Vaporisez un peu d'eau ou de nettoyant pour vitres sur le bord de la lingette avant de le lancer.",
    },
    {
      q: "Pourquoi attend-il avant de démarrer ?",
      a: "Au démarrage, il analyse la vitre pendant une vingtaine de secondes. Il se met en route quand le voyant bleu cesse de clignoter.",
    },
  ],
  compare: {
    format: "Ovale",
    dimensions: "30 × 15 × 13 cm",
    weight: "0,95 kg",
    suction: "5600 Pa",
    spray: "Non (lingette à humidifier)",
    edges: "Cadre nécessaire",
    modes: "3 directions",
    remote: true,
    backup: true,
    rope: true,
    speed: "Environ 4,3 min/m²",
  },
  // Variante « EU », stock usine en Chine.
  cj: { sku: "CJJT1080244", pid: "1382262788063367168", vid: "1382262789426515968", shipFrom: "CN" },
};

/** Ordre d'affichage : du plus accessible au plus complet. */
export const products: Product[] = [o1, s2, q3];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const compareRows: { key: CompareKey; label: string }[] = [
  { key: "format", label: "Format" },
  { key: "dimensions", label: "Dimensions" },
  { key: "weight", label: "Poids" },
  { key: "suction", label: "Aspiration" },
  { key: "spray", label: "Pulvérisation d'eau" },
  { key: "edges", label: "Gestion des bords" },
  { key: "modes", label: "Modes de nettoyage" },
  { key: "remote", label: "Télécommande" },
  { key: "backup", label: "Batterie de secours" },
  { key: "rope", label: "Corde de sécurité" },
  { key: "speed", label: "Vitesse" },
];
