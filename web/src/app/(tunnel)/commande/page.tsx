import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { paymentMode } from "@/lib/payments/mepaye";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const deliveries = await getDeliveryMap();
  return (
    <Container className="pt-10 lg:pt-14">
      <h1 className="condensed mb-8 text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.9] font-extrabold uppercase">
        Finaliser ma commande
      </h1>
      <CheckoutForm deliveries={deliveries} simulatedPayment={paymentMode() === "simulation"} />
    </Container>
  );
}
