import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Container className="pt-10 lg:pt-14">
      <h1 className="condensed mb-8 text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.9] font-extrabold uppercase">
        Finaliser ma commande
      </h1>
      <CheckoutForm />
    </Container>
  );
}
