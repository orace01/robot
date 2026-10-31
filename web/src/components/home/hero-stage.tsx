"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useCartDrawer } from "@/components/providers";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { ProductImage, ProductSlug } from "@/lib/products";

export interface HeroSlide {
  slug: ProductSlug;
  name: string;
  model: string;
  tagline: string;
  summary: string;
  price: number;
  inStock: boolean;
  scene: ProductImage;
  cutout: ProductImage;
}

/** Durée d'affichage d'un robot avant le suivant. */
const SLIDE_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;
const USES = ["Fenêtres", "Baies vitrées", "Vérandas"];

/**
 * Hero de l'accueil : une scène plein écran par robot, le robot au centre,
 * son nom en très grand en bas à gauche. Les robots défilent seuls, en fondu ;
 * le défilement s'arrête au survol, au focus, au clic ou en mouvement réduit.
 */
export function HeroStage({ slides }: { slides: HeroSlide[] }) {
  const reduced = useReducedMotion();
  const { openCart } = useCartDrawer();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const slide = slides[index];
  const running = !reduced && !paused && !hovered;

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, go]);

  // La barre d'achat mobile n'apparaît qu'une fois le hero quitté.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const buy = () => {
    if (!slide.inStock) return;
    cart.add(slide.slug);
    setPaused(true);
    openCart();
  };

  return (
    <>
      <section
        ref={sectionRef}
        aria-roledescription="carrousel"
        aria-label="Nos robots laveurs de vitres"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(index + 1);
          if (event.key === "ArrowLeft") go(index - 1);
        }}
        className="relative isolate -mt-18 flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink text-white"
      >
        {/* Scène : photo de situation, légèrement floutée pour détacher le robot. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.slug}
            aria-hidden
            className="absolute inset-0 -z-20"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9, ease: EASE }, scale: { duration: 7, ease: "linear" } }}
          >
            <Image
              src={slide.scene.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover blur-[2px] brightness-[0.82]"
            />
          </motion.div>
        </AnimatePresence>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,10,14,0.55)_0%,rgba(8,10,14,0)_22%,rgba(8,10,14,0)_45%,rgba(8,10,14,0.82)_100%)]"
        />

        {/* Robot détouré, au centre, qui flotte. */}
        <div className="pointer-events-none absolute inset-x-0 top-[13%] bottom-[36%] sm:top-[12%] sm:bottom-[30%]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={slide.slug}
              className="relative mx-auto h-full max-w-[min(70vw,560px)]"
              initial={{ opacity: 0, y: 40, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -30, rotate: 3 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <motion.div
                className="relative h-full"
                animate={reduced ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={slide.cutout.src}
                  alt={slide.cutout.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 640px) 40vw, 70vw"
                  className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bas du hero : nom géant, achat, accroche. */}
        <div className="mt-auto w-full px-4 pb-6 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
          <div className="mb-4 flex items-center gap-4 sm:mb-5">
            <div role="tablist" aria-label="Choisir un robot" className="flex items-center gap-3">
              {slides.map((item, i) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={item.name}
                  onClick={() => {
                    go(i);
                    setPaused(true);
                  }}
                  className="flex items-center gap-2 py-2 font-mono text-[11px] tracking-[0.08em] text-white/60 aria-selected:text-white"
                >
                  {String(i + 1).padStart(2, "0")}
                  <span className="relative h-px w-8 overflow-hidden bg-white/25 sm:w-12">
                    {i === index && (
                      <motion.span
                        key={`${item.slug}-${running}`}
                        className="absolute inset-y-0 left-0 bg-white"
                        initial={{ width: running ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Reprendre le défilement" : "Mettre en pause"}
                className="grid size-8 place-items-center rounded-[8px] text-white/70 ring-1 ring-white/25 transition hover:text-white hover:ring-white/60"
              >
                {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
              </button>
            )}
          </div>

          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto_minmax(0,320px)] lg:gap-10">
            <div className="min-w-0">
              <h1 aria-live="polite" className="sr-only">
                {slide.name}, robot laveur de vitres
              </h1>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={slide.slug}
                  aria-hidden
                  className="condensed text-[clamp(3.25rem,10.5vw,11rem)] leading-[0.82] font-extrabold tracking-[-0.03em] whitespace-nowrap uppercase"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {slide.name}
                </motion.p>
              </AnimatePresence>
              <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-white/75 uppercase">
                {USES.map((use, i) => (
                  <li key={use} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="size-1 rounded-full bg-white/50" />}
                    {use}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
              <button
                type="button"
                onClick={buy}
                disabled={!slide.inStock}
                className="inline-flex h-13 items-center justify-between gap-6 rounded-[10px] bg-white px-5 text-[15px] font-medium text-ink transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {slide.inStock ? "Ajouter au panier" : "Indisponible"}
                <span className="tabular-nums">{formatPrice(slide.price)}</span>
              </button>
              <Link
                href={`/robots/${slide.slug}`}
                className="inline-flex h-11 items-center justify-center px-2 text-sm text-white/80 underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white"
              >
                Découvrir le {slide.model}
              </Link>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.slug}
                className="hidden lg:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-lg leading-snug font-medium text-balance">{slide.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{slide.summary}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Barre d'achat fixe sur mobile, une fois le hero quitté. */}
      <div
        aria-hidden={heroVisible}
        className={cn(
          "fixed inset-x-3 bottom-3 z-30 flex items-center gap-3 rounded-[14px] bg-ink p-2 pl-4 text-white shadow-[0_12px_32px_rgba(8,10,14,0.28)] transition duration-300 md:hidden",
          heroVisible ? "pointer-events-none translate-y-[140%] opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{slide.name}</p>
          <p className="text-xs text-white/65 tabular-nums">{formatPrice(slide.price)}</p>
        </div>
        <button
          type="button"
          onClick={buy}
          disabled={!slide.inStock}
          tabIndex={heroVisible ? -1 : 0}
          className="h-11 rounded-[10px] bg-white px-5 text-sm font-medium text-ink disabled:opacity-40"
        >
          {slide.inStock ? "Acheter" : "Indisponible"}
        </button>
      </div>
    </>
  );
}
