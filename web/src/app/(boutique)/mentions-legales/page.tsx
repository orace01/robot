import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Todo } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalNoticePage() {
  return (
    <ContentPage eyebrow="Informations" title="Mentions légales" draft>
      <h2>Éditeur du site</h2>
      <p>
        Le site {site.name} est édité par <Todo>raison sociale</Todo>, <Todo>forme juridique</Todo> au capital de{" "}
        <Todo>montant</Todo> €, dont le siège social est situé <Todo>adresse</Todo>, immatriculée au registre du
        commerce et des sociétés de <Todo>ville</Todo> sous le numéro <Todo>SIREN / SIRET</Todo>.
      </p>
      <ul>
        <li>
          Numéro de TVA intracommunautaire : <Todo>numéro</Todo>
        </li>
        <li>
          Directeur ou directrice de la publication : <Todo>nom</Todo>
        </li>
        <li>Contact : {site.email}</li>
        <li>
          Téléphone : <Todo>numéro</Todo>
        </li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <Todo>nom de l&apos;hébergeur</Todo>, <Todo>adresse</Todo>,{" "}
        <Todo>téléphone</Todo>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la charte graphique et le logo du site sont la propriété de l&apos;éditeur. Les visuels des
        produits sont fournis par nos fournisseurs et utilisés avec leur autorisation. Toute reproduction sans
        accord préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </ContentPage>
  );
}
