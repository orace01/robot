import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(admin)/admin/actions";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/fournisseur", label: "Fournisseur" },
];

/** Pages internes de gestion (jamais indexées, protégées par mot de passe). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-ink text-white">
        <Container className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Logo tone="light" />
            <nav aria-label="Administration" className="flex gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={logout}>
            <button type="submit" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </Container>
      </header>
      <main className="pb-24">{children}</main>
    </>
  );
}
