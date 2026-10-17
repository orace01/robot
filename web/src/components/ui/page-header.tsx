import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/** En-tête des pages intérieures : même panneau gris que l'accueil, en plus compact. */
export function PageHeader({
  eyebrow,
  title,
  text,
  children,
  size = "lg",
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
  size?: "lg" | "md";
}) {
  return (
    <section className="-mt-18 px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-panel-soft ring-1 ring-black/[0.04]">
        <div
          aria-hidden
          className="plus-grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)]"
        />
        <Container className="pt-32 pb-14 lg:pt-40 lg:pb-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            className={cn(
              "condensed mt-5 leading-[0.86] font-extrabold uppercase",
              size === "lg" ? "text-[clamp(3.5rem,8vw,8rem)]" : "text-[clamp(3rem,6vw,5.5rem)]",
            )}
          >
            {title}
          </h1>
          {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{text}</p>}
          {children}
        </Container>
      </div>
    </section>
  );
}
