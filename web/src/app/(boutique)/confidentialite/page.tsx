import type { Metadata } from "next";
import { ContactEmail, UpdatedAt } from "@/components/legal/legal-info";
import { ContentPage } from "@/components/ui/content-page";
import { paymentProvider, seller, siteHost } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <ContentPage eyebrow="Informations" title="Politique de confidentialité">
      <UpdatedAt />
      <p>
        Cette politique explique quelles données personnelles nous recueillons sur le site {siteHost}, pourquoi, avec
        qui nous les partageons, combien de temps nous les gardons et comment exercer vos droits, conformément au
        Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est l&apos;éditeur du site {site.name}.
        {seller.name && (
          <>
            <br />
            {seller.name}
          </>
        )}
        {seller.address && (
          <>
            <br />
            Adresse : {seller.address}
          </>
        )}
        <br />
        Contact : <ContactEmail />
      </p>

      <h2>Données recueillies</h2>
      <p>Lors d&apos;une commande :</p>
      <ul>
        <li>identité et coordonnées : prénom, nom, adresse e-mail, numéro de téléphone ;</li>
        <li>adresse de livraison ;</li>
        <li>contenu et montant de la commande, référence du paiement et suivi du colis.</li>
      </ul>
      <p>
        Nous ne recevons jamais vos coordonnées bancaires : elles sont saisies directement chez {paymentProvider}.
      </p>
      <p>Lors de vos échanges avec le service client : le contenu de vos messages.</p>
      <p>Nous ne recueillons aucune donnée à des fins publicitaires et ne faisons aucun profilage.</p>

      <h2>Pourquoi nous les utilisons</h2>
      <ul>
        <li>
          Traiter, livrer et suivre votre commande, gérer les retours, remboursements et garanties : exécution du
          contrat de vente (article 6.1.b du RGPD).
        </li>
        <li>
          Répondre à vos demandes : exécution du contrat ou, hors commande, notre intérêt légitime à vous répondre
          (article 6.1.f).
        </li>
        <li>
          Vous envoyer nos conseils et offres par e-mail, seulement si vous l&apos;avez demandé en cochant la case
          prévue lors de la commande : votre consentement (article 6.1.a), que vous pouvez retirer à tout moment en
          nous écrivant.
        </li>
        <li>Tenir notre comptabilité et répondre à nos obligations fiscales : obligation légale (article 6.1.c).</li>
        <li>Prévenir la fraude et sécuriser le site : notre intérêt légitime (article 6.1.f).</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Seules les personnes chargées des commandes et du service client ont accès à vos données, ainsi que nos
        prestataires, pour ce qui est strictement nécessaire à leur mission :
      </p>
      <ul>
        <li>
          notre fournisseur et partenaire logistique, situé en Chine, qui prépare et expédie votre commande depuis
          ses entrepôts en Chine ou en Allemagne, et les transporteurs qui la livrent : nom, adresse de livraison et
          téléphone ;
        </li>
        <li>
          {paymentProvider}, pour le paiement : nom, adresse e-mail, téléphone, pays et montant de la commande ;
        </li>
        <li>
          l&apos;hébergeur du site, Vercel, et le prestataire de sa base de données, Turso, qui stockent les données
          de commande.
        </li>
      </ul>
      <p>Nous ne vendons ni ne louons vos données.</p>

      <h2>Transferts hors de l&apos;Union européenne</h2>
      <p>
        Notre partenaire logistique étant établi en Chine, les données nécessaires à la livraison lui sont
        transmises, ainsi qu&apos;aux transporteurs, hors de l&apos;Union européenne. Le paiement est traité par{" "}
        {paymentProvider}, édité par une société établie aux États-Unis, à qui sont transmises les données
        nécessaires au paiement. Ces transferts sont nécessaires à l&apos;exécution de votre commande (article 49.1.b
        du RGPD) et limités aux seules données utiles à la livraison et au paiement.
      </p>
      <p>
        Le site est hébergé par Vercel Inc., société établie aux États-Unis et certifiée au cadre de protection des
        données UE–États-Unis (Data Privacy Framework).
      </p>

      <h2>Durées de conservation</h2>
      <ul>
        <li>
          Données de commande : 10 ans à compter de la commande, durée de conservation des pièces comptables
          (article L. 123-22 du Code de commerce).
        </li>
        <li>Échanges avec le service client : 3 ans après le dernier échange.</li>
        <li>Conseils et offres : jusqu&apos;au retrait de votre consentement, ou 3 ans sans nouvelle commande.</li>
        <li>Journaux techniques de connexion : 1 an au plus.</li>
      </ul>

      <h2>Stockage dans votre navigateur</h2>
      <p>
        Le site n&apos;utilise ni cookie publicitaire, ni outil de mesure d&apos;audience, ni réseau social intégré.
        Il enregistre seulement dans votre navigateur :
      </p>
      <ul>
        <li>votre panier, pour le retrouver lors de votre prochaine visite ;</li>
        <li>
          le récapitulatif de votre dernière commande, pendant 2 jours au plus, pour afficher sa confirmation à votre
          retour de la page de paiement.
        </li>
      </ul>
      <p>
        Ces données restent sur votre appareil. Elles sont strictement nécessaires au service que vous demandez et
        ne requièrent donc pas votre consentement. Vous pouvez les effacer à tout moment depuis les réglages de votre
        navigateur.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
        d&apos;opposition et de portabilité de vos données, ainsi que du droit de définir des directives relatives à
        leur sort après votre décès. Certaines données doivent toutefois être conservées pour nos obligations
        légales, notamment comptables.
      </p>
      <p>
        Pour exercer ces droits, écrivez à <ContactEmail />. Nous vous répondons dans un délai d&apos;un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la
        CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux commandes est réservé aux personnes qui les
        traitent. Votre commande ne peut être consultée en ligne qu&apos;avec son numéro et l&apos;adresse e-mail
        utilisée pour la passer.
      </p>
    </ContentPage>
  );
}
