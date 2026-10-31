"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { formatPrice } from "@/lib/format";
import type { ProductImage } from "@/lib/products";
import { cn } from "@/lib/cn";

export interface ExplodedLayer {
  eyebrow: string;
  title: string;
  text: string;
}

/** Les trois tranches du robot, en % de la hauteur de l'image (vue de face, carrée). */
const BANDS = [
  [0, 34],
  [34, 67],
  [67, 100],
] as const;
/** Écart de chaque tranche une fois le robot ouvert, en % de la hauteur. */
const SPREAD = [-14, 0, 14];
/** Côté de l'étiquette sur grand écran, pour alterner autour du robot. */
const SIDES = ["right", "left", "right"] as const;

/** Moments clés du défilement (0 = début de la section, 1 = fin). */
const OPEN = [0.16, 0.42] as const;
const CLOSE = [0.84, 0.95] as const;

function Band({ image, index, progress }: { image: ProductImage; index: number; progress: MotionValue<number> }) {
  const [top, bottom] = BANDS[index];
  const y = useTransform(
    progress,
    [OPEN[0], OPEN[1], CLOSE[0], CLOSE[1]],
    ["0%", `${SPREAD[index]}%`, `${SPREAD[index]}%`, "0%"],
  );
  return (
    <motion.div style={{ y }} className="absolute inset-0">
      <Image
        src={image.src}
        alt={index === 0 ? image.alt : ""}
        aria-hidden={index !== 0}
        fill
        sizes="(min-width: 768px) 520px, 80vw"
        className="object-contain"
        // Léger chevauchement des tranches : aucune ligne visible quand le robot est fermé.
        style={{ clipPath: `inset(${Math.max(0, top - 0.4)}% 0 ${Math.max(0, 100 - bottom - 0.4)}% 0)` }}
      />
    </motion.div>
  );
}

/** Fenêtre d'apparition de l'étiquette n°`index` : l'une après l'autre. */
function useLabelOpacity(progress: MotionValue<number>, index: number) {
  const start = 0.4 + index * 0.1;
  return useTransform(progress, [start, start + 0.07, CLOSE[0], CLOSE[0] + 0.05], [0, 1, 1, 0]);
}

function SideLabel({ layer, index, progress }: { layer: ExplodedLayer; index: number; progress: MotionValue<number> }) {
  const opacity = useLabelOpacity(progress, index);
  const x = useTransform(opacity, [0, 1], [SIDES[index] === "right" ? -12 : 12, 0]);
  const [top, bottom] = BANDS[index];
  // Rapprochée du centre, pour que la première étiquette reste sous le titre.
  const center = (top + bottom) / 2 + SPREAD[index] * 0.5;
  const right = SIDES[index] === "right";

  return (
    <motion.div
      style={{ opacity, x, top: `${center}%` }}
      className={cn(
        "absolute hidden w-[min(270px,24vw)] -translate-y-1/2 items-center gap-4 md:flex",
        right ? "left-[calc(100%+12px)]" : "right-[calc(100%+12px)] flex-row-reverse text-right",
      )}
    >
      <span aria-hidden className="h-px w-10 shrink-0 bg-white/35" />
      <div>
        <p className="font-mono text-[11px] tracking-[0.08em] text-white/50 uppercase">
          {String(index + 1).padStart(2, "0")} · {layer.eyebrow}
        </p>
        <p className="mt-1.5 text-base leading-snug font-medium text-white">{layer.title}</p>
        <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-white/60">{layer.text}</p>
      </div>
    </motion.div>
  );
}

function MobileCaption({ layer, index, progress }: { layer: ExplodedLayer; index: number; progress: MotionValue<number> }) {
  const opacity = useLabelOpacity(progress, index);
  return (
    <motion.div style={{ opacity }} className="absolute inset-x-0 top-0 text-center md:hidden">
      <p className="font-mono text-[11px] tracking-[0.08em] text-white/50 uppercase">
        {String(index + 1).padStart(2, "0")} · {layer.eyebrow}
      </p>
      <p className="mt-1.5 text-base font-medium text-white">{layer.title}</p>
    </motion.div>
  );
}

/**
 * Vue éclatée au défilement : la section reste à l'écran pendant que le robot
 * s'ouvre en trois couches, chacune présentée à son tour, puis se referme sur
 * l'appel à l'achat. En mouvement réduit, le robot est montré ouvert, sans
 * animation.
 */
export function ExplodedRobot({
  name,
  slug,
  price,
  image,
  thickness,
  layers,
}: {
  name: string;
  slug: string;
  price: number;
  image: ProductImage;
  thickness: string;
  layers: ExplodedLayer[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const still = useMotionValue(0.7);
  const progress = reduced ? still : scrollYProgress;

  const tilt = useTransform(progress, [0.06, OPEN[1], CLOSE[0], CLOSE[1]], [0, 18, 18, 0]);
  const hint = useTransform(progress, [0, 0.08], [1, 0]);
  const outro = useTransform(progress, [CLOSE[0] + 0.02, CLOSE[1]], [0, 1]);
  const outroY = useTransform(outro, [0, 1], [16, 0]);
  // Le bouton invisible ne doit pas intercepter les clics.
  const outroEvents = useTransform(outro, (value) => (value > 0.5 ? "auto" : "none"));

  return (
    <section
      ref={ref}
      aria-labelledby="eclate-titre"
      className={cn("relative bg-[#07090c] text-white", reduced ? "" : "h-[340vh] md:h-[420vh]")}
    >
      <div
        className={cn(
          "flex h-[100svh] min-h-[620px] flex-col items-center overflow-hidden px-4 pt-20 pb-8 sm:pt-24",
          !reduced && "sticky top-0",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_58%,rgba(45,91,255,0.2),transparent_70%)]"
        />

        <div className="relative z-10 mb-4 max-w-xl text-center">
          <p className="font-mono text-[11px] tracking-[0.1em] text-white/55 uppercase">{name} · Vue éclatée</p>
          <h2
            id="eclate-titre"
            className="condensed mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95] font-extrabold tracking-[-0.03em]"
          >
            Tout tient en {thickness}.
          </h2>
          <p className="mt-3 text-sm text-white/60 sm:text-base">
            Pulvérisation, aspiration, adhérence : chaque couche a sa mission.
          </p>
        </div>

        {/* Le robot, découpé en trois tranches qui s'écartent. */}
        <div className="relative flex w-full flex-1 items-center justify-center [perspective:1600px]">
          <motion.div
            style={{ rotateX: tilt }}
            className="relative aspect-square w-[min(64vw,36svh,440px)] [transform-style:preserve-3d]"
          >
            {BANDS.map((_, i) => (
              <Band key={i} image={image} index={i} progress={progress} />
            ))}
            {layers.map((layer, i) => (
              <SideLabel key={layer.eyebrow} layer={layer} index={i} progress={progress} />
            ))}
          </motion.div>

          {!reduced && (
            <motion.p
              style={{ opacity: hint }}
              className="absolute bottom-2 font-mono text-[11px] tracking-[0.1em] text-white/45 uppercase"
            >
              Faites défiler pour l&apos;ouvrir
            </motion.p>
          )}
        </div>

        {/* Bas : la couche en cours sur mobile, puis l'appel à l'achat. */}
        <div className="relative z-10 h-28 w-full max-w-md">
          {layers.map((layer, i) => (
            <MobileCaption key={layer.eyebrow} layer={layer} index={i} progress={progress} />
          ))}
          <motion.div
            style={{ opacity: outro, y: outroY, pointerEvents: outroEvents }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3"
          >
            <Link
              href={`/robots/${slug}`}
              className="inline-flex h-12 items-center gap-6 rounded-[10px] bg-white px-5 text-[15px] font-medium text-ink transition hover:bg-white/90"
            >
              Découvrir le {name}
              <span className="tabular-nums text-ink/60">{formatPrice(price)}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
