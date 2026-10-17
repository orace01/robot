import type { Metadata } from "next";
import { ConfirmationView } from "@/components/checkout/confirmation-view";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <Container className="pt-10 lg:pt-14">
      <ConfirmationView />
    </Container>
  );
}
