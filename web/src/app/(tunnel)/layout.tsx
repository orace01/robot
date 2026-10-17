import { Lock } from "lucide-react";
import { CheckoutBackLink } from "@/components/checkout/back-link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

/** Tunnel de commande : en-tête réduit, sans menu, pour ne pas distraire. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-canvas">
        <Container className="flex h-18 items-center justify-between gap-4">
          <CheckoutBackLink />
          <Logo />
          <p className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <Lock className="size-4" aria-hidden />
            <span className="hidden sm:inline">Paiement sécurisé</span>
          </p>
        </Container>
      </header>
      <main id="contenu" className="pb-24">
        {children}
      </main>
    </>
  );
}
