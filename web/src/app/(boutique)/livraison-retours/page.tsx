import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Todo } from "@/components/ui/content-page";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { formatRange } from "@/lib/delivery";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/products";
import { shippingConfig, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Livraison et retours",
  description: "Délais et frais de livraison, droit de rétractation, garanties légales et retours.",
};

export default async function ShippingReturnsPage() {
  const deliveries = await getDeliveryMap();
  return (
    <ContentPage
      eyebrow="Aide"
      title="Livraison et retours"
      intro="Délais, frais, suivi, retours et garanties : tout est expliqué ici, simplement."
      draft
    >
      <h2>Livraison</h2>
      <p>
        Nous livrons en France métropolitaine (Corse comprise), à l&apos;adresse indiquée lors de la commande. La
        livraison standard suivie est offerte. Le délai dépend du robot et de son entrepôt d&apos;expédition :
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
              {delivery.express &&
                `, ou en ${formatRange(delivery.express)} en express (${formatPrice(shippingConfig.expressPrice)})`}
              .
            </li>
          );
        })}
      </ul>
      <p>
        Les délais courent à partir de la confirmation de votre commande et comprennent sa préparation. Dès
        l&apos;expédition, vous recevez un e-mail avec votre numéro de suivi, également consultable sur la page{" "}
        <Link href="/suivi">Suivre ma commande</Link>.
      </p>

      <h2>À la réception</h2>
      <p>
        Vérifiez l&apos;état du colis en présence du livreur. En cas de dommage, notez des réserves précises,
        prenez des photos et <Link href="/contact">contactez-nous</Link> rapidement avec votre numéro de commande :
        nous vous proposons un remplacement ou un remboursement.
      </p>

      <h2>Changer d&apos;avis : {site.returnDays} jours</h2>
      <p>
        Vous disposez de {site.returnDays} jours à compter de la réception de votre robot pour exercer votre droit
        de rétractation, sans avoir à vous justifier.
      </p>
      <ol>
        <li>
          Informez-nous de votre décision via le <Link href="/contact">formulaire de contact</Link> ou par e-mail
          ({site.email}), en précisant votre numéro de commande.
        </li>
        <li>
          Renvoyez le produit complet, dans son emballage d&apos;origine si possible, à l&apos;adresse que nous vous
          communiquons, au plus tard {site.returnDays} jours après nous avoir informés.
        </li>
        <li>
          Nous vous remboursons la totalité des sommes versées, frais de livraison initiaux inclus (sur la base du
          tarif standard), au plus tard {site.returnDays} jours après votre demande. Nous pouvons différer le
          remboursement jusqu&apos;à la réception du produit ou d&apos;une preuve d&apos;expédition.
        </li>
      </ol>
      <p>
        Les frais de retour sont <Todo>à votre charge ou pris en charge par la boutique : à décider</Todo>.
      </p>

      <h2>Garanties</h2>
      <p>
        Tous nos robots bénéficient de la <strong>garantie légale de conformité</strong> pendant{" "}
        {site.warrantyYears} ans à compter de la livraison, et de la <strong>garantie des vices cachés</strong>{" "}
        (articles 1641 et suivants du Code civil). En cas de panne ou de défaut, contactez-nous : nous organisons la
        réparation, le remplacement ou, à défaut, le remboursement.
      </p>
      <p>
        Le détail des garanties figure dans nos <Link href="/cgv">conditions générales de vente</Link>.
      </p>
    </ContentPage>
  );
}
