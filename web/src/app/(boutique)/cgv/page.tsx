import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Todo } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Informations"
      title="Conditions générales de vente"
      intro={`Applicables à toute commande passée sur le site ${site.name} par un consommateur.`}
      draft
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent la vente en ligne des produits proposés sur le site {site.name}, édité
        par <Todo>raison sociale</Todo> (voir les <Link href="/mentions-legales">mentions légales</Link>). Toute
        commande implique leur acceptation.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les caractéristiques essentielles de chaque produit sont présentées sur sa fiche. Les produits sont
        proposés dans la limite des stocks disponibles.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en euros toutes taxes comprises (TVA française incluse). Les frais de livraison
        éventuels sont indiqués avant la validation de la commande. Le prix applicable est celui affiché au moment
        de la commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        Vous sélectionnez vos produits, renseignez vos coordonnées et votre mode de livraison, vérifiez le
        récapitulatif, acceptez les présentes conditions puis validez la commande avec obligation de paiement. Un
        e-mail de confirmation récapitulant la commande vous est ensuite adressé.
      </p>

      <h2>5. Paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne par <Todo>moyens de paiement proposés par l&apos;agrégateur</Todo>,
        via notre prestataire de paiement sécurisé <Todo>nom du prestataire</Todo>. Le montant est débité à la
        validation de la commande.
      </p>

      <h2>6. Livraison</h2>
      <p>
        Les produits sont livrés en France métropolitaine, dans les délais indiqués lors de la commande et sur la
        page <Link href="/livraison-retours">Livraison et retours</Link>. En cas de dépassement du délai, vous
        pouvez nous enjoindre de livrer dans un délai supplémentaire raisonnable puis, à défaut, résoudre le contrat
        et être remboursé. Le transfert des risques a lieu à la réception du produit.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Vous disposez de {site.returnDays} jours à compter de la réception du produit pour vous rétracter, sans
        motif. Vous pouvez utiliser le formulaire type ci-dessous ou toute déclaration dénuée d&apos;ambiguïté,
        adressée à {site.email}. Le produit doit être renvoyé au plus tard {site.returnDays} jours après votre
        décision. Nous remboursons l&apos;intégralité des sommes versées, frais de livraison initiaux compris (sur
        la base du tarif standard), au plus tard {site.returnDays} jours après réception de votre décision ; le
        remboursement peut être différé jusqu&apos;à la récupération du produit ou la preuve de son expédition.
        Les frais de retour sont <Todo>à la charge du client / pris en charge par la boutique</Todo>.
      </p>
      <p>
        <strong>Formulaire de rétractation :</strong> « À l&apos;attention de <Todo>raison sociale et adresse</Todo>{" "}
        : je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :
        commandé le … / reçu le … ; numéro de commande ; nom et adresse du consommateur ; date ; signature (en cas
        d&apos;envoi papier). »
      </p>

      <h2>8. Garanties légales</h2>
      <p>
        Les produits bénéficient de la garantie légale de conformité ({site.warrantyYears} ans à compter de la
        délivrance, articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés
        (articles 1641 et suivants du Code civil).
      </p>
      <p>
        <Todo>Reproduire ici l&apos;encadré d&apos;information sur la garantie légale de conformité imposé par la
        réglementation</Todo>
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Vos données sont traitées conformément à notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>10. Réclamations et médiation</h2>
      <p>
        Pour toute réclamation, contactez-nous à {site.email}. En cas de désaccord persistant, vous pouvez recourir
        gratuitement au médiateur de la consommation : <Todo>nom et coordonnées du médiateur</Todo>.
      </p>

      <h2>11. Droit applicable</h2>
      <p>Les présentes conditions sont soumises au droit français.</p>
    </ContentPage>
  );
}
