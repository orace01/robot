import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Container className="pt-10 lg:pt-16">
      <Eyebrow>Panier</Eyebrow>
      <h1 className="condensed mt-4 mb-10 text-[clamp(3rem,6vw,5.5rem)] leading-[0.88] font-extrabold uppercase">
        Votre panier
      </h1>
      <CartView />
    </Container>
  );
}
