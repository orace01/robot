import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Repère visible uniquement dans la maquette (prix provisoire, avis d'exemple…). */
export function MockupBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!site.mockup) return null;
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-full border border-dashed border-amber-500/70 bg-amber-50 px-2.5 py-1 text-[10px]! text-amber-800",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Valeur pas encore confirmée par le fournisseur. */
export function ToConfirm({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-full border border-dashed border-line px-2 py-0.5 text-[10px]! text-faint",
        className,
      )}
    >
      À confirmer
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-ink/15 bg-white/60 px-3 py-1 text-xs text-ink-soft", className)}>
      {children}
    </span>
  );
}
