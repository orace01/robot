import type Lenis from "lenis";

/**
 * Instance Lenis de la page (une seule, créée par <SmoothScroll />), et verrou du
 * défilement pour les panneaux qui bloquent la page (tiroir panier, menu mobile).
 * Sans Lenis (mouvement réduit), seuls les verrous `overflow` des panneaux agissent.
 */

let instance: Lenis | null = null;
let locks = 0;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locks > 0) lenis.stop();
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  locks += 1;
  instance?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) instance?.start();
}
