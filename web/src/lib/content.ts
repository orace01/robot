import type { ProductSlug } from "./products";
import { site } from "./site";

/**
 * Avis D'EXEMPLE pour la maquette uniquement. Afficher de faux avis comme
 * authentiques est interdit (pratique commerciale trompeuse) : ils seront
 * remplacés par de vrais avis clients collectés après achat.
 */
export const exampleReviews: {
  name: string;
  city: string;
  rating: number;
  product: ProductSlug;
  text: string;
}[] = [
  {
    name: "Camille R.",
    city: "Lyon",
    rating: 5,
    product: "q3",
    text: "Ma baie vitrée de 3 mètres nettoyée pendant que je préparais le café. Le mode profondeur a fait disparaître les traces de pluie.",
  },
  {
    name: "Julien M.",
    city: "Nantes",
    rating: 5,
    product: "s2",
    text: "J'appréhendais pour les joints, mais il coupe bien la pulvérisation près du cadre. Résultat net, sans coulures.",
  },
  {
    name: "Sophie L.",
    city: "Bordeaux",
    rating: 4,
    product: "o1",
    text: "Simple et efficace sur les fenêtres et le miroir de la salle de bain. Un peu bruyant, mais on s'y fait vite.",
  },
];

export interface FaqGroup {
  title: string;
  items: { q: string; a: string }[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Les robots",
    items: [
      {
        q: "Comment un robot laveur de vitres tient-il sur la vitre ?",
        a: "Une turbine aspire l'air sous le robot et crée un vide qui le plaque contre le verre. Il se déplace ensuite grâce à ses disques ou à ses chenilles, sans jamais se décoller.",
      },
      {
        q: "Fonctionnent-ils sur les vitres sans cadre ?",
        a: "Le Q3 oui, grâce à ses capteurs anti-chute qui repèrent le bord du verre. Le O1 a besoin d'un cadre ou d'un rebord. Le S2 s'appuie sur la détection des cadres : pour les vitres sans cadre, préférez le Q3.",
      },
      {
        q: "Nettoie-t-il les deux faces de la vitre en même temps ?",
        a: "Non, il nettoie une face à la fois. Pour l'extérieur, passez-le simplement de l'autre côté, corde de sécurité toujours attachée.",
      },
      {
        q: "Est-ce bruyant ?",
        a: "Comme un aspirateur à main : la turbine produit un souffle continu. Le moteur sans balais du Q3 est conçu pour réduire ce bruit.",
      },
      {
        q: "Faut-il rester à côté pendant le nettoyage ?",
        a: "Il travaille seul, mais gardez-le en vue et attachez toujours la corde de sécurité à un point solide, surtout pour l'extérieur et en étage.",
      },
    ],
  },
  {
    title: "Livraison",
    items: [
      {
        q: "Combien coûte la livraison ?",
        a: "La livraison standard suivie est offerte en France métropolitaine. Pour certains modèles, une option express payante est proposée au moment de la commande.",
      },
      {
        q: "Quels sont les délais ?",
        a: "Cela dépend du robot et de son entrepôt d'expédition : environ une semaine depuis l'Europe, deux semaines depuis l'Asie. La date estimée s'affiche sur chaque fiche produit, et une option express est proposée à la commande quand elle existe.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Dès l'expédition, vous recevez un e-mail avec votre numéro de suivi. Vous pouvez aussi utiliser la page « Suivre ma commande » avec votre numéro de commande.",
      },
    ],
  },
  {
    title: "Retours et garanties",
    items: [
      {
        q: "Puis-je changer d'avis ?",
        a: `Oui : vous disposez de ${site.returnDays} jours à compter de la réception pour vous rétracter, sans avoir à vous justifier. Nous vous remboursons au plus tard ${site.returnDays} jours après votre demande, une fois le produit retourné.`,
      },
      {
        q: "Quelle est la garantie ?",
        a: `Tous nos robots bénéficient de la garantie légale de conformité de ${site.warrantyYears} ans et de la garantie contre les vices cachés. En cas de panne, contactez-nous : nous organisons la réparation, le remplacement ou le remboursement.`,
      },
      {
        q: "Mon colis est arrivé endommagé, que faire ?",
        a: "Prenez des photos du colis et du produit, puis contactez-nous dans les meilleurs délais avec votre numéro de commande. Nous vous proposons un remplacement ou un remboursement.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui. Le paiement est traité par un prestataire spécialisé, avec authentification 3D Secure. Nous n'avons jamais accès à vos données bancaires.",
      },
      {
        q: "Les prix sont-ils TTC ?",
        a: "Oui, tous les prix affichés sont en euros TTC (TVA française de 20 % incluse), et les frais de livraison sont indiqués avant le paiement.",
      },
    ],
  },
];
