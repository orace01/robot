import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { faqGroups } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Fonctionnement des robots laveurs de vitres, livraison, retours, garanties et paiement.",
};

const anchor = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");

export default function FaqPage() {
  return (
    <>
      <PageHeader
        size="md"
        eyebrow="Aide"
        title="Questions fréquentes"
        text="Tout ce qu'il faut savoir avant et après votre achat. Vous ne trouvez pas votre réponse ? Écrivez-nous."
      />
      <Container className="mt-12 grid gap-12 lg:grid-cols-12">
        <nav aria-label="Rubriques" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col lg:gap-1">
            {faqGroups.map((group) => (
              <li key={group.title}>
                <Link
                  href={`#${anchor(group.title)}`}
                  className="block rounded-full px-4 py-2 text-ink-soft ring-1 ring-line transition hover:text-ink lg:ring-0 lg:hover:bg-ink/5"
                >
                  {group.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-16 lg:col-span-8 lg:col-start-5">
          {faqGroups.map((group) => (
            <section key={group.title} id={anchor(group.title)}>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">{group.title}</h2>
              <Accordion items={group.items} />
            </section>
          ))}
          <div className="flex flex-col items-start gap-5 rounded-[28px] bg-white p-8 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight">Une autre question ?</p>
              <p className="mt-1 text-ink-soft">
                Notre équipe vous répond {site.supportDelay}, {site.supportHours}.
              </p>
            </div>
            <ButtonLink href="/contact" size="lg">
              <Mail className="size-4" aria-hidden /> Nous écrire
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
