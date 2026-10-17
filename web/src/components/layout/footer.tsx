import Link from "next/link";
import { CreditCard, Lock, RotateCcw, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ManageCookiesButton } from "@/components/layout/manage-cookies-button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { footerNav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-deep-gradient text-white">
        <div aria-hidden className="plus-grid-light absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="dot-grid absolute -right-10 bottom-24 -z-10 h-64 w-96 text-white/30 [mask-image:linear-gradient(225deg,black,transparent_70%)]"
        />

        <Container className="pt-16 pb-8 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo tone="light" />
              <p className="mt-5 max-w-sm text-white/70">
                Des robots laveurs de vitres sélectionnés pour leur efficacité, livrés chez vous en France.
              </p>
              <p className="eyebrow mt-10 text-white/60">Conseils et offres, une fois par mois</p>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              {footerNav.map((group) => (
                <div key={group.title}>
                  <p className="eyebrow text-white/50">{group.title}</p>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-white/85 transition hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {group.title === "Informations" && (
                      <li>
                        <ManageCookiesButton className="text-left text-white/85 transition hover:text-white" />
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <ul className="mt-16 grid gap-3 border-t border-white/15 pt-8 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-4">
            <li className="flex items-center gap-2">
              <Truck className="size-4" aria-hidden /> Livraison suivie offerte
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="size-4" aria-hidden /> {site.returnDays} jours pour changer d&apos;avis
            </li>
            <li className="flex items-center gap-2">
              <Lock className="size-4" aria-hidden /> Paiement sécurisé
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="size-4" aria-hidden /> Prix en euros TTC
            </li>
          </ul>

          <p
            aria-hidden
            className="condensed pointer-events-none mt-10 -mb-[0.2em] text-center text-[clamp(6rem,24vw,22rem)] leading-[0.8] font-extrabold tracking-[-0.03em] text-white/[0.07] lowercase select-none"
          >
            {site.name}
          </p>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:justify-between">
            <p>
              © 2026 {site.name}. Tous droits réservés.
            </p>
            <p>Les visuels produits sont fournis par nos fournisseurs.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
