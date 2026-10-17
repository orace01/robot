"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// Journal façon « console » (inspiration Controlboard) : il se remplit puis recommence.
const LINES: [string, string, string][] = [
  ["00:00:03", "Adhérence", "OK"],
  ["00:00:08", "Pulvérisation avant", "ON"],
  ["00:00:41", "Cadre détecté", "Demi-tour"],
  ["00:01:12", "Pulvérisation arrière", "ON"],
  ["00:01:58", "Vitre terminée", "100 %"],
];
const CYCLE = LINES.length + 2;

export function HeroLog({ className }: { className?: string }) {
  // Toutes les lignes visibles au premier rendu (serveur, sans JavaScript, animations réduites).
  const [step, setStep] = useState(CYCLE - 1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % CYCLE), 1300);
    return () => window.clearInterval(id);
  }, []);

  const visible = Math.min(step + 1, LINES.length);

  return (
    <div
      aria-hidden
      className={cn("w-full max-w-[340px] rounded-[16px] bg-white/55 p-4 ring-1 ring-black/5 backdrop-blur", className)}
    >
      <p className="eyebrow mb-2 flex items-center justify-between text-muted">
        <span>Journal du robot</span>
        <span className="flex items-center gap-1.5 text-ok">
          <span className="size-1.5 rounded-full bg-ok" /> Actif
        </span>
      </p>
      <ul className="space-y-0.5 font-mono text-[11px] leading-5 text-ink-soft">
        {LINES.map(([time, label, status], i) => (
          <li
            key={time}
            className={cn("flex gap-3 transition-opacity duration-500", i < visible ? "opacity-100" : "opacity-0")}
          >
            <span className="text-faint">{time}</span>
            <span className="flex-1 truncate uppercase">{label}</span>
            <span className="text-ink uppercase">{status}</span>
          </li>
        ))}
        <li className="flex gap-3 text-faint">
          <span>{">"}</span>
          <span className="animate-blink">_</span>
        </li>
      </ul>
    </div>
  );
}
