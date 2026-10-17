"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import { cn } from "@/lib/cn";

export function Gallery({ images, model }: { images: ProductImage[]; model: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[26px] bg-stage ring-1 ring-black/[0.04]">
        <div aria-hidden className="plus-grid-dark absolute inset-0" />
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          loading={index === 0 ? "eager" : undefined}
          sizes="(min-width: 1024px) 55vw, 95vw"
          className={cn(
            "animate-fade-in",
            current.cutout ? "object-contain p-10 sm:p-16" : "object-cover",
          )}
        />
        <p className="eyebrow absolute top-5 left-5 rounded-full bg-white/80 px-3 py-1 text-ink-soft backdrop-blur">
          {model} · {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
        {images.length > 1 && (
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center rounded-full bg-white/90 ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
              aria-label="Image précédente"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-11 place-items-center rounded-full bg-white/90 ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
              aria-label="Image suivante"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Afficher l'image ${i + 1} : ${image.alt}`}
                aria-current={i === index}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-[14px] bg-stage ring-2 transition",
                  i === index ? "ring-ink" : "ring-transparent hover:ring-line",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="80px"
                  className={image.cutout ? "object-contain p-2" : "object-cover"}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
