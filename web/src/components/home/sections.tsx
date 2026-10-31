import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BatteryCharging, BellRing, Link2, ScanLine } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { AnnotatedProduct } from "@/components/product/annotated-product";
import { LineupCard, type LineupItem } from "@/components/home/lineup-card";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { faqGroups } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { formatRange } from "@/lib/delivery";
import { getProduct, type ProductSlug } from "@/lib/products";
import { site } from "@/lib/site";

/* ------------------------------------------------ Anatomie du S2 */

export function Anatomy() {
  const s2 = getProduct("s2")!;
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="grid gap-10 rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:grid-cols-12 lg:p-14">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Conçu pour la vitre"
              title="Pensé dans les moindres détails."
              text={`Le ${site.name} S2 réunit pulvérisation, aspiration et essuyage en 8 cm d'épaisseur. Chaque pièce a une mission : vous rendre une vitre nette.`}
            />
            <Link
              href="/robots/s2"
              className="mt-8 inline-flex items-center gap-2 font-medium text-accent-strong hover:underline hover:underline-offset-4"
            >
              Découvrir le S2 <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
          <div className="lg:col-span-8">
            <AnnotatedProduct image={s2.anatomy!.image} callouts={s2.anatomy!.callouts} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ La gamme */

/** Même ordre que le hero : du plus complet au plus accessible. */
const LINEUP: ProductSlug[] = ["q3", "s2", "o1"];

export async function Lineup() {
  const deliveries = await getDeliveryMap();
  const items: LineupItem[] = LINEUP.map((slug) => {
    const product = getProduct(slug)!;
    const delivery = deliveries[slug];
    return {
      slug,
      name: `${site.name} ${product.model}`,
      model: product.model,
      badge: product.badge,
      tagline: product.tagline,
      specs: product.cardSpecs,
      price: product.price,
      inStock: delivery.inStock,
      delivery: `Livré en ${formatRange(delivery.standard)}`,
      shippedFrom: delivery.fromEurope ? delivery.shippedFrom : null,
      cutout: product.hero,
      scene: product.scene,
    };
  });

  return (
    <section aria-labelledby="gamme-titre" className="bg-white py-20 lg:py-28">
      <Container>
        <div className="grid gap-8 border-b border-line pb-10 md:grid-cols-[1fr_minmax(0,340px)] md:items-end lg:pb-12">
          <div>
            <Eyebrow>La gamme · {items.length} robots</Eyebrow>
            <h2
              id="gamme-titre"
              className="condensed mt-5 text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.03em]"
            >
              <span className="block">Trois robots.</span>
              <span className="block text-faint sm:whitespace-nowrap">Une seule promesse.</span>
            </h2>
          </div>
          <div>
            <p className="text-ink-soft">
              Des vitres nettes, sans escabeau ni traces. Choisissez selon vos surfaces : du plus complet au plus
              simple.
            </p>
            <Link
              href="/robots#comparer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline decoration-ink/25 underline-offset-4 transition hover:decoration-ink"
            >
              Comparer les trois modèles <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Mobile : cartes à faire glisser. Dès la tablette : trois colonnes séparées d'un filet. */}
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-0 md:overflow-visible md:px-0 md:pb-0 lg:mt-12">
          {items.map((item, i) => (
            <li
              key={item.slug}
              className="w-[80%] shrink-0 snap-start sm:w-[55%] md:w-auto md:border-l md:border-line md:px-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-8"
            >
              <Reveal delay={i * 0.08} className="h-full">
                <LineupCard item={item} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ Zoom sur le Q3 */

const safety = [
  { icon: Link2, title: "Corde de sécurité", text: "4,5 m, résistance de 150 kg, à attacher à un point solide." },
  { icon: BatteryCharging, title: "Batterie de secours", text: "En cas de coupure de courant, il reste plaqué contre la vitre." },
  { icon: ScanLine, title: "Capteurs anti-chute", text: "Ils repèrent le bord du verre, même sans cadre." },
  { icon: BellRing, title: "Alarme sonore", text: "Elle vous prévient dès qu'il faut intervenir." },
];

export function Q3Spotlight() {
  const q3 = getProduct("q3")!;
  return (
    <section className="px-2 sm:px-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#0b0e14] text-white">
        <div aria-hidden className="plus-grid-light absolute inset-0 -z-10 opacity-60" />
        <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
          <Reveal className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-[22px] ring-1 ring-white/10">
              <Image
                src="/produits/q3/capteurs.webp"
                alt="Les capteurs optiques du Q3 repèrent le bord de la vitre"
                width={790}
                height={440}
                sizes="(min-width: 1024px) 45vw, 95vw"
                className="h-auto w-full"
              />
              <p className="eyebrow absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-white/80 backdrop-blur">
                Capteur optique · bord détecté
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-[22px] ring-1 ring-white/10">
                <Image
                  src="/produits/q3/moteur.webp"
                  alt="Le moteur sans balais du Q3"
                  width={790}
                  height={366}
                  sizes="(min-width: 1024px) 22vw, 47vw"
                  className="h-full w-full object-cover"
                />
                <p className="eyebrow absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-white/80 backdrop-blur">Moteur brushless</p>
              </div>
              <div className="flex flex-col justify-between rounded-[22px] bg-white/[0.06] p-5 ring-1 ring-white/10">
                <p className="eyebrow text-white/55">Aspiration</p>
                <p className="condensed text-[56px] leading-none font-bold">
                  3000<span className="ml-1 text-2xl text-white/50">Pa</span>
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading
              tone="light"
              eyebrow={`Zoom sur le ${site.name} Q3`}
              title="Quatre sécurités. Zéro sueur froide."
              text="Nettoyer une vitre en étage ne doit jamais être un pari. Le Q3 multiplie les protections pour que vous puissiez le lancer l'esprit tranquille."
            />
            <ul className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {safety.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <Icon className="size-6 stroke-[1.4] text-white/80" aria-hidden />
                  <p className="mt-3 font-medium">{title}</p>
                  <p className="mt-1 text-sm text-white/60">{text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/robots/q3" variant="accent" size="lg">
                Découvrir le Q3
              </ButtonLink>
              <p className="text-white/60">
                <span className="text-white">{formatPrice(q3.price, { compact: true })}</span> TTC, livraison offerte
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Usages */

const useCases = [
  {
    title: "Fenêtres",
    text: "Intérieur comme extérieur, du rez-de-chaussée à l'étage.",
    image: "/produits/q3/situation-ville.webp",
  },
  {
    title: "Baies vitrées",
    text: "Les grandes surfaces, sans escabeau et sans traces.",
    image: "/produits/q3/situation-baie.webp",
  },
  {
    title: "Vérandas et verrières",
    text: "Les vitres hautes ou difficiles d'accès.",
    image: "/produits/q3/situation-facade.webp",
  },
  {
    title: "Douches et miroirs",
    text: "Parois de douche, miroirs et carrelage mural.",
    image: "/produits/q3/salle-de-bain.webp",
  },
];

export function UseCases() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Usages" title="Partout où il y a du verre." />
          <p className="max-w-sm text-ink-soft">
            Une surface lisse, un point d&apos;attache pour la corde : votre robot s&apos;occupe du reste.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 0.06}>
              <Link
                href="/robots"
                className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-black/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={useCase.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 95vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-semibold tracking-wide uppercase">{useCase.title}</p>
                    <p className="mt-1.5 text-sm text-muted">{useCase.text}</p>
                  </div>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 transition group-hover:translate-x-1" aria-hidden />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ FAQ */

export function FaqTeaser() {
  const questions = [faqGroups[0].items[1], faqGroups[0].items[2], faqGroups[1].items[1], faqGroups[2].items[0], faqGroups[2].items[1]];
  return (
    <section className="py-24 lg:py-32">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Questions fréquentes" title="Vos questions, nos réponses." />
          <Link
            href="/faq"
            className="mt-8 inline-flex items-center gap-2 font-medium text-accent-strong hover:underline hover:underline-offset-4"
          >
            Toutes les questions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Accordion items={questions} className="lg:col-span-7 lg:col-start-6" />
      </Container>
    </section>
  );
}

/* ------------------------------------------------ Appel final */

export function FinalCta() {
  return (
    <section className="pb-8">
      <Container>
        <div className="relative isolate grid overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 lg:grid-cols-12">
          <div aria-hidden className="plus-grid-dark absolute inset-0 -z-10" />
          <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
            <Eyebrow>Prêt quand vous l&apos;êtes</Eyebrow>
            <h2 className="condensed mt-5 text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.86] font-extrabold uppercase">
              Rangez
              <br />
              l&apos;escabeau.
            </h2>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Livraison offerte, {site.returnDays} jours pour changer d&apos;avis et garantie de {site.warrantyYears}{" "}
              ans : vous n&apos;avez rien à perdre, à part les traces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/robots" size="lg">
                Choisir mon robot
              </ButtonLink>
              <ButtonLink href="/robots#comparer" variant="secondary" size="lg">
                Comparer les modèles
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:col-span-5">
            <div
              aria-hidden
              className="absolute -right-24 -bottom-40 aspect-square w-[520px] rounded-full bg-disc"
            />
            <div className="animate-float absolute inset-x-10 top-10 bottom-0 lg:inset-x-6">
              <Image
                src="/produits/s2/trois-quarts-droit.webp"
                alt="Le robot S2 vu de trois quarts"
                fill
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(8,24,69,0.3)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
