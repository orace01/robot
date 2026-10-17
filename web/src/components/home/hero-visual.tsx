"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { ProductImage } from "@/lib/products";
import { cn } from "@/lib/cn";

/** Coins de cadrage + étiquette technique (inspiration Controlboard). */
function Bracket({
  className,
  label,
  labelPosition,
}: {
  className: string;
  label: string;
  labelPosition: "top" | "left";
}) {
  const corner = "absolute size-3 border-ink/45";
  return (
    <div aria-hidden className={cn("absolute hidden lg:block", className)}>
      <span className={cn(corner, "top-0 left-0 border-t border-l")} />
      <span className={cn(corner, "top-0 right-0 border-t border-r")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "right-0 bottom-0 border-r border-b")} />
      <span
        className={cn(
          "eyebrow absolute flex items-center gap-2 text-[10px] whitespace-nowrap text-ink-soft",
          labelPosition === "top" ? "bottom-full left-0 mb-3" : "top-1/2 right-full mr-3 -translate-y-1/2 flex-row-reverse",
        )}
      >
        <span className={cn("h-px bg-ink/35", labelPosition === "top" ? "w-4" : "w-8")} />
        {label}
      </span>
    </div>
  );
}

export function HeroVisual({ image }: { image: ProductImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[460px] w-full max-w-[420px] max-lg:overflow-hidden max-lg:rounded-b-[28px] sm:h-[560px] lg:absolute lg:inset-y-0 lg:left-[55%] lg:z-10 lg:mx-0 lg:h-auto lg:w-[30%] lg:max-w-none lg:-translate-x-1/2"
    >
      {/* Le disque bleu remplace le demi-cercle noir de l'inspiration Smart Spray. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 aspect-square w-[150%] max-w-[680px] -translate-x-1/2 translate-y-[48%] rounded-full bg-disc"
      />
      {/* Brume de pulvérisation. */}
      <div
        aria-hidden
        className="animate-mist absolute top-[14%] left-[-12%] h-[22%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(45,91,255,0.3),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="animate-mist absolute top-[50%] right-[-14%] h-[24%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(45,91,255,0.24),transparent)] blur-2xl [animation-delay:1.7s]"
      />

      <motion.div style={{ y }} className="absolute inset-x-0 top-[2%] bottom-[-8%] lg:top-[15%] lg:bottom-[-6%]">
        <div className="relative mx-auto h-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 26vw, 60vw"
            className="object-contain drop-shadow-[0_40px_45px_rgba(8,24,69,0.28)]"
          />
          <Bracket className="top-[1%] left-[30%] h-[22%] w-[42%]" label="Pulvérisation · on" labelPosition="top" />
          <Bracket className="top-[70%] left-[-2%] h-[24%] w-[104%]" label="Microfibre ×2" labelPosition="left" />
        </div>
      </motion.div>
    </div>
  );
}
