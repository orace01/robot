import Image from "next/image";
import { Check, Minus, PackageOpen } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ToConfirm } from "@/components/ui/badges";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { serpentine } from "@/lib/paths";
import type { CleaningPath, Product } from "@/lib/products";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/* ------------------------------------------------ Chiffres clés */

export function ProductStats({ product }: { product: Product }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3",
        product.stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {product.stats.map((stat) => (
        <li key={stat.label} className="rounded-[22px] bg-white p-6 ring-1 ring-black/5">
          <p className="text-sm text-muted">{stat.label}</p>
          <p className="condensed mt-3 text-[clamp(3rem,5vw,4.5rem)] leading-none font-bold tracking-tight">
            {stat.value}
            {stat.unit && <span className="ml-1.5 text-[0.4em] font-semibold text-muted">{stat.unit}</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------ Fonctionnalités (blocs alternés) */

export function FeatureRows({ product }: { product: Product }) {
  return (
    <div className="space-y-4">
      {product.features.map((feature, i) => (
        <Reveal key={feature.title}>
          <article className="grid overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 lg:grid-cols-2">
            <div
              className={cn(
                "relative min-h-[320px] bg-stage lg:min-h-[460px]",
                i % 2 === 1 && "lg:order-2",
              )}
            >
              {feature.image.cutout && <div aria-hidden className="plus-grid-dark absolute inset-0" />}
              {!feature.image.cutout && feature.image.width < 500 ? (
                // Petite image : affichée à sa taille, en vignette, plutôt qu'agrandie et floue.
                <div className="absolute inset-0 grid place-items-center p-8">
                  <Image
                    src={feature.image.src}
                    alt={feature.image.alt}
                    width={feature.image.width}
                    height={feature.image.height}
                    className="h-auto max-h-full w-auto max-w-full rounded-[18px] shadow-[0_20px_40px_-20px_rgba(13,15,18,0.35)]"
                  />
                </div>
              ) : (
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 95vw"
                  className={feature.image.cutout ? "object-contain p-12" : "object-cover"}
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <Eyebrow>{feature.eyebrow}</Eyebrow>
              <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
                {feature.title}
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{feature.text}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------ Modes de nettoyage */

function PathDiagram({ path }: { path: CleaningPath }) {
  const box = { x: 22, y: 22, w: 156, h: 96 };
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full" aria-hidden>
      <rect x="6" y="6" width="188" height="128" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
      {(path === "n" || path === "nz") && (
        <path d={serpentine("n", box, 7)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      )}
      {(path === "z" || path === "nz") && (
        <path
          d={serpentine("z", box, 5)}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeDasharray={path === "nz" ? "4 4" : undefined}
        />
      )}
      <rect x="14" y="14" width="16" height="16" rx="4" fill="currentColor" />
    </svg>
  );
}

export function CleaningModes({ product }: { product: Product }) {
  if (!product.modes) return null;
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Modes de nettoyage"
          title={`${product.modes.length} modes, un seul bouton.`}
          text="Le mode automatique suffit au quotidien. Pour les vitres très sales, passez en mode profondeur."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {product.modes.map((mode) => (
            <li key={mode.name} className="rounded-[22px] bg-white p-6 ring-1 ring-black/5">
              <div className="rounded-[14px] bg-canvas p-4 text-ink">
                <PathDiagram path={mode.path} />
              </div>
              <p className="mt-6 text-xl font-semibold tracking-tight">{mode.name}</p>
              <p className="mt-2 text-ink-soft">{mode.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-ink" /> Passage à sec
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-accent" /> Passage avec pulvérisation
          </span>
        </p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ Fiche technique + contenu du colis */

export function SpecsAndBox({ product }: { product: Product }) {
  return (
    <section id="caracteristiques" className="py-20 lg:py-28">
      <Container className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:col-span-8">
          <Eyebrow>Fiche technique</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Caractéristiques</h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3.5 text-sm sm:text-base">
                <dt className="text-muted">{spec.label}</dt>
                <dd>{spec.value ?? <ToConfirm />}</dd>
              </div>
            ))}
          </dl>
          {site.mockup && <p className="eyebrow mt-6 text-faint">Référence CJ (maquette) : {product.cj.sku}</p>}
        </div>

        <div className="flex flex-col rounded-[28px] bg-ink p-6 text-white sm:p-10 lg:col-span-4">
          <PackageOpen className="size-7 stroke-[1.3] text-white/70" aria-hidden />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight">Dans la boîte</h2>
          {product.inBox ? (
            <ul className="mt-6 space-y-3">
              {product.inBox.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <Check className="mt-1 size-4 shrink-0 text-white/50" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-white/60">
              Le contenu détaillé du colis sera précisé prochainement.{" "}
              <ToConfirm className="ml-1 border-white/30 text-white/60" />
            </p>
          )}
          <div className="relative mt-10 min-h-56 flex-1">
            <Image
              src={product.hero.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 80vw"
              className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ Valeur du comparateur */

export function CompareValue({ value }: { value: string | boolean | null }) {
  if (value === null) return <ToConfirm />;
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1.5">
        <Check className="size-4 text-ok" aria-hidden /> Oui
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Minus className="size-4" aria-hidden /> Non
      </span>
    );
  return <>{value}</>;
}
