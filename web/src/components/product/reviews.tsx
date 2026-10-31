import { MockupBadge } from "@/components/ui/badges";
import { Container } from "@/components/ui/container";
import { Stars } from "@/components/ui/stars";
import { SectionHeading } from "@/components/ui/typography";
import { exampleReviews } from "@/lib/content";
import { site } from "@/lib/site";

export function Reviews({ title = "Ils ont rangé l'escabeau." }: { title?: string }) {
  // Avis d'exemple : jamais sur le site en ligne. À remplacer par de vrais avis clients.
  if (!site.mockup) return null;
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Avis clients" title={title} />
          <MockupBadge>Avis d&apos;exemple : à remplacer par de vrais avis</MockupBadge>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {exampleReviews.map((review) => (
            <li key={review.name} className="flex flex-col rounded-[22px] bg-white p-7 ring-1 ring-black/5">
              <Stars rating={review.rating} />
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed tracking-tight">
                « {review.text} »
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid size-10 place-items-center rounded-full bg-mist text-sm font-semibold">
                  {review.name.charAt(0)}
                </span>
                <p className="text-sm">
                  <span className="block font-medium">
                    {review.name}, {review.city}
                  </span>
                  <span className="text-muted">
                    A choisi le {site.name} {review.product.toUpperCase()}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
