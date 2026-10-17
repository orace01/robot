"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  max,
  label,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
  size?: "sm" | "md";
}) {
  const button = cn(
    "grid place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30",
    size === "sm" ? "size-8" : "size-11",
  );
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-white ring-1 ring-line",
        size === "sm" ? "h-9 px-0.5" : "h-13 px-1",
      )}
    >
      <button type="button" className={button} onClick={() => onChange(value - 1)} aria-label={`Retirer un ${label}`}>
        <Minus className="size-4" aria-hidden />
      </button>
      <output aria-live="polite" className={cn("text-center tabular-nums font-medium", size === "sm" ? "w-6 text-sm" : "w-8")}>
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Ajouter un ${label}`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
