import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const items = [
  { icon: Truck, value: "0 €", label: "Livraison suivie", note: "en France métropolitaine" },
  { icon: RotateCcw, value: `${site.returnDays} j`, label: "Pour changer d'avis", note: "à réception du colis" },
  { icon: ShieldCheck, value: `${site.warrantyYears} ans`, label: "Garantie légale", note: "de conformité" },
  { icon: Lock, value: "3D Secure", label: "Paiement sécurisé", note: "données bancaires protégées" },
];

/** Bandeau de réassurance façon « ORBIT » : icône fine, gros chiffre, légende. */
export function TrustBar({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 divide-line rounded-[24px] bg-white ring-1 ring-black/5 lg:grid-cols-4 lg:divide-x",
        className,
      )}
    >
      {items.map(({ icon: Icon, value, label, note }) => (
        <li key={label} className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
          <Icon className="size-6 shrink-0 stroke-[1.25] text-ink-soft sm:size-7" aria-hidden />
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-0.5">
            <p className="condensed text-[28px] leading-none font-bold tracking-tight whitespace-nowrap sm:text-[36px]">{value}</p>
            <p className="text-sm leading-tight">
              <span className="block font-medium">{label}</span>
              <span className="block text-xs text-muted">{note}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
