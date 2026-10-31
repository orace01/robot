import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, UpdatedAt } from "@/components/legal/legal-info";
import { ContentPage } from "@/components/ui/content-page";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { formatRange } from "@/lib/delivery";
import { formatPrice } from "@/lib/format";
import { seller } from "@/lib/legal";
import { products } from "@/lib/products";
import { shippingConfig, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Livraison et retours",
  description: "Délais et frais de livraison, suivi du colis, droit de rétractation, garanties légales et retours.",
};

export default async function ShippingReturnsPage() {
  const deliveries = await getDeliveryMap();
  return (
    <ContentPage
      eyebrow="Aide"
      title="Livraison et retours"
      intro="Délais, frais, suivi, retours et garanties : tout est expliqué ici, simplement."
    >
      <UpdatedAt />

      <h2>Livraison</h2>
      <ul>
        <li>
          <strong>Offerte</strong> en livraison standard suivie, quel que soit le montant de la commande. Quand elle
          est proposée pour les robots du panier, la livraison express coûte{" "}
          {formatPrice(shippingConfig.expressPrice)}.
        </li>
        <li>
          <strong>Où :</strong> en France métropolitaine (Corse comprise), à l&apos;adresse de votre choix.
        </li>
        <li>
          <strong>Sans frais à la réception :</strong> les éventuels droits de douane et taxes d&apos;importation
          sont à notre charge.
        </li>
      </ul>
      <p>
        Chaque robot est expédié depuis l&apos;entrepôt de notre partenaire logistique où il est stocké. Délais,
        préparation comprise, à partir de la confirmation de votre commande :
      </p>
      <ul>
        {products.map((product) => {
          const delivery = deliveries[product.slug];
          return (
            <li key={product.slug}>
              <strong>
                {site.name} {product.model}
              </strong>{" "}
              : expédié {delivery.shippedFrom}, livré en {formatRange(delivery.standard)}
              {delivery.express && `, ou en ${formatRange(delivery.express)} en express`}.
            </li>
          );
        })}
      </ul>
      <p>
        Une commande de robots stockés dans des entrepôts différents arrive en plusieurs colis. Sauf autre date
        convenue, la livraison intervient au plus tard 30 jours après la commande.
      </p>

      <h2>Suivre votre colis</h2>
      <p>
        Dès l&apos;expédition, vous recevez un numéro de suivi. Vous pouvez aussi suivre votre commande à tout moment
        sur la <Link href="/suivi">page de suivi</Link>, avec votre numéro de commande et votre adresse e-mail.
      </p>

      <h2>Colis abîmé ou produit défectueux</h2>
      <p>
        Écrivez-nous à <ContactEmail /> avec votre numéro de commande et, si possible, une photo ou une vidéo du
        problème. Nous vous proposons un remplacement ou un remboursement, sans frais pour vous. Vos garanties
        légales sont détaillées dans les <Link href="/cgv">conditions générales de vente</Link>.
      </p>

      <h2>Vous changez d&apos;avis ?</h2>
      <p>
        Vous avez <strong>{site.returnDays} jours à compter de la réception</strong> de votre commande pour vous
        rétracter, sans avoir à vous justifier.
      </p>
      <ul>
        <li>
          Prévenez-nous par e-mail à <ContactEmail />, avec le formulaire ci-dessous ou un simple message indiquant
          clairement votre décision.
        </li>
        <li>Nous vous indiquons par e-mail l&apos;adresse de retour.</li>
        <li>
          Renvoyez le produit dans les {site.returnDays} jours suivant votre message, dans son emballage
          d&apos;origine si possible. Les frais de retour sont à votre charge.
        </li>
        <li>
          Nous vous remboursons la totalité de la commande, livraison standard comprise, sur le moyen de paiement
          utilisé, au plus tard {site.returnDays} jours après votre message. Nous pouvons attendre d&apos;avoir reçu
          le produit, ou la preuve de son expédition, pour vous rembourser.
        </li>
      </ul>

      <h2 id="formulaire">Formulaire de rétractation</h2>
      <p>
        À compléter et à renvoyer par e-mail à <ContactEmail />, uniquement si vous souhaitez vous rétracter de votre
        commande.
      </p>
      <blockquote>
        <p>
          À l&apos;attention de {site.name}
          {seller.name && (
            <>
              <br />
              {seller.name}
            </>
          )}
          {seller.address && (
            <>
              <br />
              {seller.address}
            </>
          )}
          <br />
          <ContactEmail />
        </p>
        <p>
          Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :
        </p>
        <p>
          Numéro de commande :
          <br />
          Commandé le : … / reçu le : …
          <br />
          Nom du consommateur :
          <br />
          Adresse du consommateur :
          <br />
          Signature du consommateur (uniquement en cas d&apos;envoi du formulaire sur papier) :
          <br />
          Date :
        </p>
      </blockquote>
    </ContentPage>
  );
}
