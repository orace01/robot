import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Anatomy, FaqTeaser, FinalCta, Lineup, Q3Spotlight, UseCases } from "@/components/home/sections";
import { TrustBar } from "@/components/home/trust-bar";
import { Reviews } from "@/components/product/reviews";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Lineup />
      <Container className="mt-8">
        <TrustBar />
      </Container>
      <Anatomy />
      <HowItWorks />
      <Q3Spotlight />
      <UseCases />
      <Reviews />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
