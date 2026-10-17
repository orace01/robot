import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnnotatedProduct } from "@/components/product/annotated-product";
import { BuyPanel } from "@/components/product/buy-panel";
import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product/product-card";
import { CleaningModes, FeatureRows, ProductStats, SpecsAndBox } from "@/components/product/product-sections";
import { Reviews } from "@/components/product/reviews";
import { Accordion } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { getProduct, products } from "@/lib/products";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/robots/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${site.name} ${product.model}, robot laveur de vitres`,
    description: product.description,
    openGraph: { images: [product.hero.src] },
  };
}

export default function ProductPage({ params }: PageProps<"/robots/[slug]">) {
  // Le paramètre d'URL est lu sous <Suspense> : la coquille de la page reste commune à
  // toutes les fiches et s'affiche instantanément à la navigation.
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <Container className="pt-4" aria-busy="true">
      <div className="h-5 w-56 animate-pulse rounded-full bg-mist" />
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="aspect-square animate-pulse rounded-[26px] bg-mist lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="h-6 w-40 animate-pulse rounded-full bg-mist" />
          <div className="h-20 w-3/4 animate-pulse rounded-[16px] bg-mist" />
          <div className="h-10 w-1/3 animate-pulse rounded-full bg-mist" />
          <div className="h-36 animate-pulse rounded-[16px] bg-mist" />
          <div className="h-13 animate-pulse rounded-full bg-mist" />
        </div>
      </div>
    </Container>
  );
}

async function ProductContent({ params }: { params: PageProps<"/robots/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const deliveries = await getDeliveryMap();
  const others = products.filter((p) => p.slug !== product.slug);
  const name = `${site.name} ${product.model}`;

  // Données structurées pour les moteurs de recherche (pas de note : les avis sont des exemples).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: product.description,
    image: product.gallery.map((image) => image.src),
    sku: product.cj.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.price / 100).toFixed(2),
      availability: deliveries[product.slug].inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Container className="pt-4">
        <Breadcrumbs
          items={[{ href: "/", label: "Accueil" }, { href: "/robots", label: "Nos robots" }, { label: name }]}
        />
      </Container>

      <section className="pt-6 pb-16">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <Gallery images={product.gallery} model={product.model} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <BuyPanel product={product} delivery={deliveries[product.slug]} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            <Eyebrow className="self-start lg:col-span-3 lg:pt-3">Présentation</Eyebrow>
            <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.2] tracking-[-0.02em] text-balance lg:col-span-9">
              {product.description}
            </p>
          </div>
          <div className="mt-12">
            <ProductStats product={product} />
          </div>
        </Container>
      </section>

      {product.anatomy && (
        <section className="py-16">
          <Container>
            <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:p-14">
              <SectionHeading eyebrow="Anatomie" title={`Le ${product.model} en détail.`} />
              <div className="mx-auto mt-10 max-w-5xl">
                <AnnotatedProduct image={product.anatomy.image} callouts={product.anatomy.callouts} aspect={1.7} />
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Fonctionnalités" title="Ce qui fait la différence." />
          <div className="mt-10">
            <FeatureRows product={product} />
          </div>
        </Container>
      </section>

      <CleaningModes product={product} />
      <SpecsAndBox product={product} />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions" title={`Tout savoir sur le ${product.model}.`} />
            <Link
              href="/faq"
              className="mt-8 inline-flex items-center gap-2 font-medium text-accent-strong hover:underline hover:underline-offset-4"
            >
              Toutes les questions <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Accordion items={product.faq} className="lg:col-span-7 lg:col-start-6" />
        </Container>
      </section>

      <Reviews title="Ce qu'en disent nos clients." />

      <section className="py-16">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading eyebrow="Le reste de la gamme" title="Les autres modèles de la gamme." />
            <Link
              href="/robots#comparer"
              className="inline-flex items-center gap-2 font-medium text-accent-strong hover:underline hover:underline-offset-4"
            >
              Comparer les trois modèles <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {others.map((other) => (
              <ProductCard key={other.slug} product={other} delivery={deliveries[other.slug]} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
