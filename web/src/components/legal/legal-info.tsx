import { Todo } from "@/components/ui/content-page";
import { legalUpdatedAt, seller } from "@/lib/legal";
import { site } from "@/lib/site";

/** Adresse du service client, ou « à compléter » tant qu'elle manque. */
export function ContactEmail() {
  if (!site.email) return <Todo>adresse e-mail du service client</Todo>;
  return <a href={`mailto:${site.email}`}>{site.email}</a>;
}

export function UpdatedAt() {
  return <p className="text-sm text-muted">Dernière mise à jour : {legalUpdatedAt}.</p>;
}

/**
 * Coordonnées du vendeur : seules les informations renseignées dans lib/legal.ts sont
 * affichées (pas d'entreprise enregistrée pour l'instant).
 */
export function SellerDetails({ withPublisher = false, withPhone = true }: { withPublisher?: boolean; withPhone?: boolean }) {
  const lines: [string, string | null][] = [
    ["Vendeur", seller.name],
    ["Forme juridique", seller.legalForm],
    ["Adresse", seller.address],
    ["Immatriculation", seller.registration],
    ["TVA", seller.vat],
    ...(withPhone ? ([["Téléphone", seller.phone]] as [string, string | null][]) : []),
    ...(withPublisher ? ([["Directeur ou directrice de la publication", seller.publisher]] as [string, string | null][]) : []),
  ];
  return (
    <ul>
      {lines
        .filter((line): line is [string, string] => line[1] !== null)
        .map(([label, value]) => (
          <li key={label}>
            {label} : {value}
          </li>
        ))}
      <li>
        E-mail : <ContactEmail />
      </li>
    </ul>
  );
}
