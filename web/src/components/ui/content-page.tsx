import { Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/lib/site";

/** Gabarit des pages de texte (livraison, pages légales). */
export function ContentPage({
  eyebrow,
  title,
  intro,
  draft = false,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Modèle à compléter et à faire valider avant la mise en ligne. */
  draft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader size="md" eyebrow={eyebrow} title={title} text={intro} />
      <Container className="mt-3">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-12">
          {draft && site.mockup && (
            <p className="mb-8 flex gap-3 rounded-[16px] bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              Modèle à compléter (champs surlignés) et à faire relire par un professionnel avant la mise en ligne.
            </p>
          )}
          <div className="prose-page">{children}</div>
        </div>
      </Container>
    </>
  );
}

/** Information à compléter dans un modèle de page. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <span className="a-completer">[{children}]</span>;
}
