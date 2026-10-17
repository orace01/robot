import { Star } from "lucide-react";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${rating} sur 5`}>
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden
            className={i < rating ? "size-4 fill-ink text-ink" : "size-4 fill-transparent text-faint"}
          />
        ))}
      </span>
    </span>
  );
}
