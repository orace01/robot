import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Anatomy, ExplodedQ3, FaqTeaser, FinalCta, Lineup, Q3Spotlight, UseCases } from "@/components/home/sections";
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
      <div className="mt-24 lg:mt-32">
        <ExplodedQ3 />
      </div>
      <Anatomy />
      <HowItWorks />
      {/* Les cas d'usage, sur fond clair, séparent les deux grands blocs sombres. */}
      <UseCases />
      <Q3Spotlight />
      <Reviews />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
