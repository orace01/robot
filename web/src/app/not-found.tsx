import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
      <Logo />
      <p className="condensed mt-12 text-[clamp(7rem,22vw,16rem)] leading-[0.8] font-extrabold text-[#c9cdd3]">404</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Cette page a glissé de la vitre.</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Elle n&apos;existe pas ou plus. Nos robots, eux, sont bien accrochés.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          Retour à l&apos;accueil
        </ButtonLink>
        <ButtonLink href="/robots" variant="secondary" size="lg">
          Voir les robots
        </ButtonLink>
      </div>
    </main>
  );
}
