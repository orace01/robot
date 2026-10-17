import type { Metadata } from "next";
import { ContentPage, Todo } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité et cookies",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Informations"
      title="Confidentialité et cookies"
      intro="Quelles données nous collectons, pourquoi, combien de temps, et comment exercer vos droits."
      draft
    >
      <h2>Responsable du traitement</h2>
      <p>
        <Todo>Raison sociale et adresse</Todo>, joignable à {site.email}.
      </p>

      <h2>Données collectées et finalités</h2>
      <ul>
        <li>
          <strong>Commande et livraison</strong> (nom, adresse, e-mail, téléphone, contenu de la commande) :
          nécessaires à l&apos;exécution du contrat.
        </li>
        <li>
          <strong>Facturation et comptabilité</strong> : obligations légales.
        </li>
        <li>
          <strong>Service client</strong> (vos messages) : traitement de vos demandes.
        </li>
        <li>
          <strong>Newsletter</strong> (e-mail) : uniquement avec votre consentement, retirable à tout moment.
        </li>
      </ul>
      <p>Vos données bancaires sont traitées directement par notre prestataire de paiement : nous n&apos;y avons jamais accès.</p>

      <h2>Destinataires</h2>
      <p>
        Vos données sont transmises uniquement aux prestataires nécessaires à votre commande : prestataire de
        paiement <Todo>nom</Todo>, transporteur, et notre fournisseur logistique CJ Dropshipping, qui prépare et
        expédie les colis. Ce fournisseur étant situé hors de l&apos;Union européenne, ce transfert est encadré par{" "}
        <Todo>garanties appropriées, par exemple les clauses contractuelles types de la Commission européenne</Todo>.
      </p>

      <h2>Durées de conservation</h2>
      <ul>
        <li>Données de commande : le temps de la relation commerciale, puis archivage selon les délais légaux.</li>
        <li>Pièces comptables : 10 ans.</li>
        <li>Prospection : 3 ans après votre dernier contact ou achat.</li>
        <li>
          Cookies de mesure d&apos;audience : 13 mois au maximum ; votre choix de consentement est conservé{" "}
          <Todo>durée</Todo>.
        </li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
        d&apos;opposition et de portabilité de vos données. Pour les exercer, écrivez à {site.email}. Vous pouvez
        aussi introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise des cookies et un stockage local indispensables à son fonctionnement (panier, choix de
        consentement), qui ne nécessitent pas votre accord. Les cookies de mesure d&apos;audience ou publicitaires
        ne sont déposés qu&apos;avec votre accord, que vous pouvez donner, refuser ou retirer à tout moment via le
        lien « Gérer les cookies » en bas de page.
      </p>
    </ContentPage>
  );
}
