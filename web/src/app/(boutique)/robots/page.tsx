import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrustBar } from "@/components/home/trust-bar";
import { Reveal } from "@/components/motion/reveal";
import { CompareTable } from "@/components/product/compare-table";
import { ProductCard } from "@/components/product/product-card";
import { MockupBadge } from "@/components/ui/badges";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/typography";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos robots laveurs de vitres",
  description: "Comparez nos trois robots laveurs de vitres : O1, S2 et Q3. Livraison offerte en France.",
};

const guide = [
  {
    need: "Pour aller à l'essentiel",
    text: "Fenêtres avec cadre, miroirs, douche : le O1 fait le travail, au meilleur prix.",
    slug: "o1",
  },
  {
    need: "Pour un nettoyage humide automatique",
    text: "Le S2 humidifie la vitre tout seul et coupe la pulvérisation près des cadres.",
    slug: "s2",
  },
  {
    need: "Pour tout faire, même sans cadre",
    text: "Capteurs anti-chute, 3 modes, batterie de secours : le Q3 est le plus complet.",
    slug: "q3",
  },
];

export default function RobotsPage() {
  return (
    <>
      <PageHeader
        eyebrow="La gamme"
        title={
          <>
            Trois robots,
            <br />
            <span className="text-[#a3a9b2]">zéro corvée.</span>
          </>
        }
        text="Du modèle essentiel au plus complet, chaque robot se plaque à la vitre, la parcourt seul et la laisse nette. Lequel est fait pour vous ?"
      />

      <Container className="mt-3">
        <ul className="grid gap-3 md:grid-cols-3">
          {guide.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/robots/${item.slug}`}
                className="group flex h-full flex-col rounded-[22px] bg-white p-6 ring-1 ring-black/5 transition hover:ring-ink/20"
              >
                <span className="eyebrow text-muted">Lequel choisir ?</span>
                <span className="mt-3 text-lg font-semibold tracking-tight">{item.need}</span>
                <span className="mt-1.5 flex-1 text-ink-soft">{item.text}</span>
                <span className="mt-5 inline-flex items-center gap-2 font-medium text-accent-strong">
                  Voir le {site.name} {item.slug.toUpperCase()}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.08}>
                <ProductCard product={product} priority={i === 0} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="comparer" className="py-16 lg:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Comparatif"
              title="Comparez en un coup d'œil."
              text="Toutes les caractéristiques, côte à côte."
            />
            <MockupBadge>Valeurs « à confirmer » : à compléter avec les fiches CJ</MockupBadge>
          </div>
          <div className="mt-10">
            <CompareTable />
          </div>
        </Container>
      </section>

      <Container>
        <TrustBar />
      </Container>
    </>
  );
}
