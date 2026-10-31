import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, SellerDetails, UpdatedAt } from "@/components/legal/legal-info";
import { ContentPage } from "@/components/ui/content-page";
import { formatPrice } from "@/lib/format";
import { paymentProvider, seller, siteHost } from "@/lib/legal";
import { shippingConfig, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Informations"
      title="Conditions générales de vente"
      intro={`Applicables à toute commande passée sur le site ${site.name} par un consommateur.`}
    >
      <UpdatedAt />

      <h2>Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent à toute commande passée sur le site{" "}
        {siteHost} par un consommateur, c&apos;est-à-dire une personne physique agissant à des fins qui
        n&apos;entrent pas dans le cadre de son activité professionnelle. Elles sont acceptées en cochant la case
        prévue avant le paiement. Les CGV applicables sont celles en vigueur à la date de la commande.
      </p>
      <p>Pour commander, vous devez être majeur et capable de contracter.</p>

      <h2>Vendeur</h2>
      <p>Les produits sont vendus sous la marque {site.name}.</p>
      <SellerDetails />

      <h2>Produits</h2>
      <p>
        Le site propose des robots laveurs de vitres. Les caractéristiques essentielles de chaque robot
        (fonctionnement, caractéristiques techniques, contenu du colis, alimentation) sont présentées sur sa fiche,
        avant la commande.
      </p>
      <p>
        Les commandes sont acceptées dans la limite des stocks disponibles. Si un produit commandé n&apos;est plus
        disponible, nous vous en informons sans délai et vous remboursons intégralement, au plus tard 14 jours
        après vous en avoir informé.
      </p>

      <h2>Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. La livraison standard est offerte. La livraison
        express, quand elle est proposée pour les robots du panier, est facturée{" "}
        {formatPrice(shippingConfig.expressPrice)}. Le prix facturé est celui affiché au moment de la validation de
        la commande.
      </p>
      <p>
        Les éventuels droits de douane et taxes d&apos;importation sont à notre charge : vous n&apos;avez rien à
        payer à la réception du colis.
      </p>

      <h2>Commande</h2>
      <p>Pour commander :</p>
      <ul>
        <li>choisissez un ou plusieurs robots et ajoutez-les au panier ;</li>
        <li>vérifiez le contenu du panier ;</li>
        <li>indiquez vos coordonnées, votre adresse et votre mode de livraison ;</li>
        <li>acceptez les présentes CGV, puis validez la commande et payez.</li>
      </ul>
      <p>
        Avant le paiement, un récapitulatif vous permet de vérifier votre commande et son prix total, et de
        corriger d&apos;éventuelles erreurs. La vente est conclue lorsque le paiement est confirmé. Nous vous
        adressons alors une confirmation de commande par e-mail, avec son numéro.
      </p>
      <p>
        Nous pouvons refuser une commande anormale, passée de mauvaise foi, ou émanant d&apos;un client avec lequel
        existe un litige de paiement.
      </p>
      <p>
        Pour toute commande d&apos;au moins 120 €, nous conservons le contrat pendant 10 ans et vous y donnons accès
        sur simple demande (articles L. 213-1 et D. 213-1 du Code de la consommation).
      </p>

      <h2>Paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne par carte bancaire, au moment de la commande, sur la page de paiement
        sécurisée de {paymentProvider}. Vos coordonnées bancaires sont saisies uniquement chez ce prestataire :
        elles ne transitent jamais par notre site et nous n&apos;y avons pas accès.
      </p>
      <p>
        La commande n&apos;est préparée qu&apos;une fois le paiement confirmé par le prestataire. En cas de refus
        du paiement, la commande n&apos;est pas conclue.
      </p>

      <h2>Livraison</h2>
      <p>
        Nous livrons uniquement en France métropolitaine (Corse comprise), à l&apos;adresse indiquée lors de la
        commande. Selon le robot, la commande est expédiée depuis l&apos;entrepôt de notre partenaire logistique en
        Chine ou en Allemagne : une commande de plusieurs robots peut donc arriver en plusieurs colis.
      </p>
      <p>
        Le délai de livraison de chaque robot est indiqué sur sa fiche, rappelé avant le paiement et détaillé sur
        la page <Link href="/livraison-retours">Livraison et retours</Link>. Sauf autre date convenue, la livraison
        intervient au plus tard 30 jours après la conclusion de la vente (article L. 216-1 du Code de la
        consommation).
      </p>
      <p>
        Dès l&apos;expédition, un numéro de suivi vous est communiqué. Vous pouvez aussi suivre votre commande sur
        la <Link href="/suivi">page de suivi</Link>, avec votre numéro de commande et votre adresse e-mail.
      </p>
      <p>
        Si la livraison n&apos;intervient pas dans le délai prévu, vous pouvez nous demander, par écrit, de livrer
        dans un délai supplémentaire raisonnable. À défaut de livraison dans ce nouveau délai, vous pouvez résoudre
        le contrat par écrit et vous êtes alors remboursé de toutes les sommes versées au plus tard dans les 14
        jours (articles L. 216-6 et L. 216-7 du Code de la consommation).
      </p>
      <p>
        Le risque de perte ou d&apos;endommagement du produit vous est transféré au moment où vous, ou un tiers
        désigné par vous, en prenez physiquement possession (article L. 216-4 du Code de la consommation). Un colis
        abîmé ou un produit endommagé à l&apos;arrivée nous est signalé à <ContactEmail />, si possible avec une
        photo : nous le remplaçons ou vous remboursons, sans frais pour vous.
      </p>

      <h2>Droit de rétractation</h2>
      <p>
        Vous disposez de <strong>{site.returnDays} jours</strong> à compter de la réception du produit pour vous
        rétracter, sans avoir à motiver votre décision (article L. 221-18 du Code de la consommation). Si une
        commande est livrée en plusieurs colis, le délai court à partir de la réception du dernier.
      </p>
      <p>
        Pour exercer ce droit, informez-nous de votre décision avant l&apos;expiration du délai, par e-mail à{" "}
        <ContactEmail />, au moyen du <Link href="/livraison-retours#formulaire">formulaire de rétractation</Link>{" "}
        ou de toute autre déclaration dénuée d&apos;ambiguïté. Nous en accusons réception par e-mail.
      </p>
      <p>
        Vous renvoyez ensuite le produit, sans retard excessif et au plus tard {site.returnDays} jours après nous
        avoir communiqué votre décision, à l&apos;adresse de retour que nous vous indiquons par e-mail.{" "}
        <strong>Les frais de retour sont à votre charge.</strong>
      </p>
      <p>
        Nous vous remboursons la totalité des sommes versées, frais de livraison compris, au plus tard{" "}
        {site.returnDays} jours après avoir été informés de votre décision. Si vous avez choisi la livraison
        express, son supplément n&apos;est pas remboursé : seul le coût de la livraison standard l&apos;est. Le
        remboursement se fait avec le même moyen de paiement que celui utilisé pour la commande, sauf accord exprès
        de votre part pour un autre moyen. Nous pouvons différer le remboursement jusqu&apos;à la récupération du
        produit ou jusqu&apos;à ce que vous ayez fourni une preuve de son expédition, la date retenue étant celle du
        premier de ces faits (article L. 221-24 du Code de la consommation).
      </p>
      <p>
        Votre responsabilité ne peut être engagée qu&apos;en cas de dépréciation du produit résultant de
        manipulations autres que celles nécessaires pour établir sa nature, ses caractéristiques et son bon
        fonctionnement (article L. 221-23 du Code de la consommation).
      </p>

      <h2>Garanties légales</h2>
      <p>
        Les produits bénéficient de la garantie légale de conformité et de la garantie légale des vices cachés, dans
        les conditions rappelées ci-dessous. Pour les mettre en œuvre, écrivez-nous à <ContactEmail /> en précisant
        votre numéro de commande et le défaut constaté, si possible avec une photo ou une vidéo. Les frais de retour
        d&apos;un produit défectueux sont à notre charge. Nous ne proposons pas de garantie commerciale en plus des
        garanties légales.
      </p>
      <blockquote>
        <p>
          Le consommateur dispose d&apos;un délai de deux ans à compter de la délivrance du bien pour obtenir la mise
          en œuvre de la garantie légale de conformité en cas d&apos;apparition d&apos;un défaut de conformité.
          Durant ce délai, le consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut de
          conformité et non la date d&apos;apparition de celui-ci.
        </p>
        <p>
          Lorsque le contrat de vente du bien prévoit la fourniture d&apos;un contenu numérique ou d&apos;un service
          numérique de manière continue pendant une durée supérieure à deux ans, la garantie légale est applicable à
          ce contenu numérique ou ce service numérique tout au long de la période de fourniture prévue. Durant ce
          délai, le consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut de conformité
          affectant le contenu numérique ou le service numérique et non la date d&apos;apparition de celui-ci.
        </p>
        <p>
          La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir
          toutes les mises à jour nécessaires au maintien de la conformité du bien.
        </p>
        <p>
          La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien
          dans un délai de trente jours suivant sa demande, sans frais et sans inconvénient majeur pour lui.
        </p>
        <p>
          Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur bénéficie
          d&apos;une extension de six mois de la garantie initiale.
        </p>
        <p>
          Si le consommateur demande la réparation du bien, mais que le vendeur impose le remplacement, la garantie
          légale de conformité est renouvelée pour une période de deux ans à compter de la date de remplacement du
          bien.
        </p>
        <p>
          Le consommateur peut obtenir une réduction du prix d&apos;achat en conservant le bien ou mettre fin au
          contrat en se faisant rembourser intégralement contre restitution du bien, si :
        </p>
        <p>
          1° Le professionnel refuse de réparer ou de remplacer le bien ;
          <br />
          2° La réparation ou le remplacement du bien intervient après un délai de trente jours ;
          <br />
          3° La réparation ou le remplacement du bien occasionne un inconvénient majeur pour le consommateur,
          notamment lorsque le consommateur supporte définitivement les frais de reprise ou d&apos;enlèvement du bien
          non conforme, ou s&apos;il supporte les frais d&apos;installation du bien réparé ou de remplacement ;
          <br />
          4° La non-conformité du bien persiste en dépit de la tentative de mise en conformité du vendeur restée
          infructueuse.
        </p>
        <p>
          Le consommateur a également droit à une réduction du prix du bien ou à la résolution du contrat lorsque le
          défaut de conformité est si grave qu&apos;il justifie que la réduction du prix ou la résolution du contrat
          soit immédiate. Le consommateur n&apos;est alors pas tenu de demander la réparation ou le remplacement du
          bien au préalable.
        </p>
        <p>Le consommateur n&apos;a pas droit à la résolution de la vente si le défaut de conformité est mineur.</p>
        <p>
          Toute période d&apos;immobilisation du bien en vue de sa réparation ou de son remplacement suspend la
          garantie qui restait à courir jusqu&apos;à la délivrance du bien remis en état.
        </p>
        <p>
          Les droits mentionnés ci-dessus résultent de l&apos;application des articles L. 217-1 à L. 217-32 du code
          de la consommation.
        </p>
        <p>
          Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt
          une amende civile d&apos;un montant maximal de 300 000 euros, qui peut être porté jusqu&apos;à 10 % du
          chiffre d&apos;affaires moyen annuel (article L. 241-5 du code de la consommation).
        </p>
        <p>
          Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles
          1641 à 1649 du code civil, pour une durée de deux ans à compter de la découverte du défaut. Cette garantie
          donne droit à une réduction de prix si le bien est conservé ou à un remboursement intégral contre
          restitution du bien.
        </p>
      </blockquote>

      <h2>Données personnelles</h2>
      <p>
        Les données recueillies lors de la commande servent à son traitement, à sa livraison et au service client.
        Leur utilisation et vos droits sont détaillés dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Service client et réclamations</h2>
      <p>
        Pour toute question ou réclamation, écrivez-nous à <ContactEmail />. Nous vous répondons dans les meilleurs
        délais.
        {seller.phone && (
          <>
            <br />
            Téléphone : {seller.phone}
          </>
        )}
      </p>

      {seller.mediator && (
        <>
          <h2>Médiation</h2>
          <p>
            Conformément aux articles L. 612-1 et suivants du Code de la consommation, vous pouvez recourir
            gratuitement au médiateur de la consommation dont nous relevons : {seller.mediator}. Il ne peut être
            saisi qu&apos;après une réclamation écrite adressée au préalable à notre service client, et au plus tard
            un an après cette réclamation.
          </p>
        </>
      )}

      <h2>Droit applicable et litiges</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en
        priorité. À défaut, vous pouvez saisir, à votre choix, la juridiction du lieu où vous demeuriez au moment de
        la conclusion du contrat ou de la survenance du fait dommageable, ou toute autre juridiction compétente
        (article R. 631-3 du Code de la consommation).
      </p>
    </ContentPage>
  );
}
