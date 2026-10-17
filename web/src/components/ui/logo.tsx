import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Vitre stylisée : un carré arrondi traversé de deux reflets. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className={cn("size-7", className)}>
      <rect x="1" y="1" width="26" height="26" rx="8" fill="currentColor" />
      <path d="M8.5 19.5 19.5 8.5M8.5 13.5l5-5" stroke="var(--logo-glare, #fff)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, accueil`}
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "light" ? "text-white [--logo-glare:var(--color-deep)]" : "text-ink",
        className,
      )}
    >
      <LogoMark />
      <span className="semi-condensed text-[22px] leading-none font-bold tracking-[-0.03em] lowercase">{site.name}</span>
    </Link>
  );
}
