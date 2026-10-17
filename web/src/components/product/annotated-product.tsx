"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Callout, ProductImage } from "@/lib/products";

const LABEL_LEFT = 25;
const LABEL_RIGHT = 75;

/**
 * Produit annoté (inspiration ORBIT / Sevensense) : des traits se dessinent
 * de chaque étiquette vers la pièce concernée quand la section entre à l'écran.
 */
export function AnnotatedProduct({
  image,
  callouts,
  aspect = 1.5,
}: {
  image: ProductImage;
  callouts: Callout[];
  /** Rapport largeur / hauteur du cadre (version ordinateur). */
  aspect?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  // Les traits sont tracés en pixels réels : une échelle non uniforme déformerait l'épaisseur.
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Largeur de l'image en % du cadre, quand elle occupe toute la hauteur.
  const imageWidth = ((image.width / image.height) / aspect) * 100;
  const imageLeft = (100 - imageWidth) / 2;
  const toFrame = (c: Callout) => ({ x: imageLeft + (c.x * imageWidth) / 100, y: c.y });

  return (
    <>
      {/* Ordinateur et tablette : étiquettes reliées par des traits. */}
      <div ref={frame} className="relative hidden md:block" style={{ aspectRatio: aspect }}>
        <div className="absolute inset-y-0" style={{ left: `${imageLeft}%`, width: `${imageWidth}%` }}>
          <Image src={image.src} alt={image.alt} fill sizes="40vw" className="object-contain" />
        </div>

        {size && (
          <svg aria-hidden className="absolute inset-0 size-full overflow-visible text-ink/40" viewBox={`0 0 ${size.w} ${size.h}`}>
            {callouts.map((c, i) => {
              const dot = toFrame(c);
              const start = c.side === "left" ? LABEL_LEFT : LABEL_RIGHT;
              const elbow = c.side === "left" ? Math.min(dot.x - 3, start + 5) : Math.max(dot.x + 3, start - 5);
              const px = (x: number) => (x / 100) * size.w;
              const py = (y: number) => (y / 100) * size.h;
              return (
                <motion.path
                  key={c.title}
                  d={`M ${px(start)} ${py(c.labelY)} L ${px(elbow)} ${py(c.labelY)} L ${px(dot.x)} ${py(dot.y)}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                  transition={{ duration: 1.1, delay: 0.25 + i * 0.18, ease: [0.65, 0, 0.35, 1] }}
                />
              );
            })}
          </svg>
        )}

        {callouts.map((c, i) => {
          const dot = toFrame(c);
          return (
            <span
              key={`point-${c.title}`}
              aria-hidden
              className="absolute grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <span
                className="absolute size-5 animate-ping rounded-full bg-accent/25 [animation-duration:2.4s]"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
              <span className="size-2.5 rounded-full bg-accent ring-4 ring-white" />
            </span>
          );
        })}

        {callouts.map((c, i) => (
          <motion.div
            key={`texte-${c.title}`}
            className="absolute w-[23%] -translate-y-1/2"
            style={
              c.side === "left"
                ? { right: `${100 - LABEL_LEFT + 1.5}%`, top: `${c.labelY}%`, textAlign: "right" }
                : { left: `${LABEL_RIGHT + 1.5}%`, top: `${c.labelY}%` }
            }
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.6, delay: 0.7 + i * 0.18 }}
          >
            <p className="font-medium tracking-tight">{c.title}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{c.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile : points numérotés et liste en dessous. */}
      <div className="md:hidden">
        <div className="relative mx-auto h-[420px] max-w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <Image src={image.src} alt={image.alt} fill sizes="80vw" className="object-contain" />
          {callouts.map((c, i) => (
            <span
              key={c.title}
              aria-hidden
              className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white ring-4 ring-white"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <ol className="mt-8 space-y-4">
          {callouts.map((c, i) => (
            <li key={c.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <p>
                <span className="font-medium">{c.title}.</span> <span className="text-muted">{c.text}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
