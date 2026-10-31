import type { Metadata } from "next";
import Link from "next/link";
import { SellerDetails, UpdatedAt } from "@/components/legal/legal-info";
import { ContentPage } from "@/components/ui/content-page";
import { hostingProvider, siteHost } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalNoticePage() {
  return (
    <ContentPage eyebrow="Informations" title="Mentions légales">
      <UpdatedAt />

      <h2>Éditeur du site</h2>
      <p>
        Le site {siteHost} présente et vend les robots laveurs de vitres de la marque {site.name}.
      </p>
      <SellerDetails withPublisher />

      <h2>Hébergement</h2>
      <p>Le site est hébergé par {hostingProvider}.</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, visuels, logos et éléments graphiques du site sont protégés par le droit de la propriété
        intellectuelle. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>. Le site n&apos;utilise aucun cookie
        publicitaire ni outil de mesure d&apos;audience.
      </p>
    </ContentPage>
  );
}
