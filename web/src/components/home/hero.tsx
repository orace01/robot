import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { HeroLog } from "@/components/home/hero-log";
import { HeroVisual } from "@/components/home/hero-visual";
import { Pill } from "@/components/ui/badges";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/lib/format";
import { getProduct, products } from "@/lib/products";

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="w-full rounded-[20px] bg-white/85 p-5 ring-1 ring-black/5 backdrop-blur lg:max-w-[230px]">
      <p className="text-xs text-muted">{label}</p>
      <p className="condensed mt-1 text-[44px] leading-none font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

export function Hero() {
  const fromPrice = Math.min(...products.map((p) => p.price));
  const hero = getProduct("s2")!.hero;

  return (
    <section className="-mt-18 px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-panel ring-1 ring-black/[0.04]">
        <div
          aria-hidden
          className="plus-grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]"
        />

        <Container className="relative grid min-h-[min(100svh,960px)] grid-cols-1 gap-y-6 pt-28 pb-8 lg:grid-cols-12 lg:pt-32 lg:pb-10">
          <div className="relative z-20 flex flex-col lg:col-span-6">
            <div className="flex flex-wrap gap-2">
              <Pill>Fenêtres</Pill>
              <Pill>Baies vitrées</Pill>
              <Pill>Vérandas</Pill>
            </div>
            <h1 className="condensed mt-6 text-[clamp(4.25rem,8.6vw,8.75rem)] leading-[0.84] font-extrabold tracking-[-0.01em] uppercase">
              <span className="block">Le robot</span>
              <span className="block pl-[0.55em]">qui fait</span>
              <span className="block text-[#a3a9b2]">vos vitres.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/robots" className="group inline-flex items-center gap-2">
                <span className="grid size-13 place-items-center rounded-full bg-accent text-white transition group-hover:bg-accent-strong">
                  <ShoppingBag className="size-5" aria-hidden />
                </span>
                <span className="inline-flex h-13 items-center rounded-full bg-white px-7 font-medium ring-1 ring-black/5 transition group-hover:ring-ink/30">
                  Choisir mon robot
                </span>
              </Link>
              <Link
                href="/#fonctionnement"
                className="inline-flex h-13 items-center gap-1.5 rounded-full px-4 text-ink-soft transition hover:text-ink"
              >
                Comment ça marche
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <HeroLog className="mt-12 hidden sm:block lg:mt-auto" />
          </div>

          <HeroVisual image={hero} />

          <div className="relative z-20 flex flex-col gap-5 lg:col-span-3 lg:col-start-10 lg:pt-12">
            <Pill className="self-start">Pulvérisation intelligente</Pill>
            <p className="text-2xl leading-[1.15] font-medium tracking-tight text-balance sm:text-[28px]">
              Il humidifie, aspire et essuie. Vous, vous profitez de la vue.
            </p>
            <p className="eyebrow flex items-center gap-2 text-ink-soft">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-ok" />
              </span>
              En stock · livraison offerte
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 lg:mt-auto lg:grid-cols-1 lg:justify-items-end">
              <StatCard label="Pulvérisation" value="×2" note="Buses avant et arrière" />
              <StatCard
                label="À partir de"
                value={formatPrice(fromPrice, { compact: true })}
                note="TTC, livraison offerte"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
