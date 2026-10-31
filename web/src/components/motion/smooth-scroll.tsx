"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/smooth-scroll";

/** Hauteur de l'en-tête fixe, retirée lors du défilement vers une ancre. */
const HEADER_OFFSET = -96;

/**
 * Défilement fluide Lenis (règle R-010) : molette et pavé tactile seulement,
 * désactivé quand l'utilisateur préfère réduire les animations.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (reduced.matches || lenis) return;
      lenis = new Lenis({ autoRaf: true, allowNestedScroll: true, anchors: { offset: HEADER_OFFSET } });
      setLenis(lenis);
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
    const onChange = () => (reduced.matches ? stop() : start());

    start();
    reduced.addEventListener("change", onChange);
    return () => {
      reduced.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // Changement de page : on repart du haut, sans animation (sauf lien vers une ancre).
  useEffect(() => {
    if (window.location.hash) return;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
