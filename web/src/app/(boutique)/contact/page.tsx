import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, PackageSearch } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nous contacter",
  description: "Une question sur un robot, une commande ou un retour ? Écrivez-nous.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        size="md"
        eyebrow="Contact"
        title="Parlons vitres."
        text="Une question sur un robot, une commande ou un retour ? Nous vous répondons rapidement, par des humains."
      />
      <Container className="mt-3 grid gap-4 lg:grid-cols-12">
        <aside className="space-y-3 lg:col-span-4">
          <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
            <Mail className="size-5 text-ink-soft" aria-hidden />
            <p className="mt-4 font-medium">Par e-mail</p>
            {site.email ? (
              <a href={`mailto:${site.email}`} className="text-accent-strong underline-offset-2 hover:underline">
                {site.email}
              </a>
            ) : (
              <p className="text-sm text-muted">Adresse bientôt disponible : utilisez le formulaire ci-contre.</p>
            )}
          </div>
          <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
            <Clock className="size-5 text-ink-soft" aria-hidden />
            <p className="mt-4 font-medium">Réponse par e-mail</p>
            <p className="text-sm text-muted">Nous vous répondons dans les meilleurs délais.</p>
          </div>
          <Link
            href="/suivi"
            className="block rounded-[24px] bg-white p-6 ring-1 ring-black/5 transition hover:ring-ink/20"
          >
            <PackageSearch className="size-5 text-ink-soft" aria-hidden />
            <p className="mt-4 font-medium">Où est ma commande ?</p>
            <p className="text-sm text-muted">Suivez votre colis en direct avec votre numéro de commande.</p>
          </Link>
        </aside>
        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
