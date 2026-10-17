import { cn } from "@/lib/cn";

/** Petit libellé technique, précédé d'un carré d'accent (« ■ INTRODUCING »). */
export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", tone === "dark" ? "text-muted" : "text-white/65", className)}>
      <span aria-hidden className={cn("size-1.5 shrink-0", tone === "dark" ? "bg-accent" : "bg-white")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark",
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={tone} className={cn(align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "mt-4 text-balance text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.025em]",
          tone === "light" && "text-white",
        )}
      >
        {title}
      </h2>
      {text && (
        <p className={cn("mt-5 max-w-xl text-pretty text-lg leading-relaxed", tone === "dark" ? "text-ink-soft" : "text-white/70", align === "center" && "mx-auto")}>
          {text}
        </p>
      )}
      {children}
    </div>
  );
}
