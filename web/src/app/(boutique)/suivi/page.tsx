import type { Metadata } from "next";
import { TrackingForm } from "@/components/forms/tracking-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Suivre ma commande",
  description: "Suivez la livraison de votre robot laveur de vitres avec votre numéro de commande.",
};

export default function TrackingPage() {
  return (
    <>
      <PageHeader
        size="md"
        eyebrow="Suivi de commande"
        title="Où est mon robot ?"
        text="Votre numéro de commande et votre adresse e-mail suffisent pour suivre votre colis, étape par étape."
      />
      <Container className="mt-3">
        <TrackingForm />
      </Container>
    </>
  );
}
