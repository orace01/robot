"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PackageSearch, X } from "lucide-react";
import { useCartDrawer } from "@/components/providers";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { nav } from "@/lib/site";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

const mobileLinks = [...nav, { href: "/suivi", label: "Suivi de commande" }, { href: "/contact", label: "Contact" }];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { openCart } = useCartDrawer();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          scrolled || menuOpen
            ? "bg-canvas/80 shadow-[0_1px_0_rgba(13,15,18,0.07)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <Container className="flex h-18 items-center justify-between gap-6">
          <Logo className="relative z-10" />

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  isActive(link.href) ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/suivi"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-soft transition hover:bg-ink/5 hover:text-ink md:inline-flex"
            >
              <PackageSearch className="size-4" aria-hidden />
              Suivi de commande
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex h-10 items-center gap-2.5 rounded-full bg-ink pr-1.5 pl-4 text-sm font-medium text-white transition hover:bg-ink-soft"
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
            >
              Panier
              <span className="grid size-7 place-items-center rounded-full bg-white text-xs text-ink tabular-nums">
                {count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-full bg-white/60 ring-1 ring-line lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>
        </Container>
      </header>

      {/* Hors du <header> : son flou d'arrière-plan piégerait un élément « fixed ». */}
      {menuOpen && (
        <div id="menu-mobile" className="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto bg-canvas lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-line py-4 text-3xl font-semibold tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </>
  );
}
