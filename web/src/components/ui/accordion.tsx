import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Accordéon natif (details/summary) : accessible et sans JavaScript. */
export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex items-start justify-between gap-6 text-left text-lg font-medium tracking-tight">
            <span>{item.q}</span>
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-mist transition duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="mt-3 max-w-2xl pr-12 leading-relaxed text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
