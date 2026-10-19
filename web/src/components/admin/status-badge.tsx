import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";
import { statusLabels, statusTones, type OrderStatus } from "@/lib/orders/status";

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", statusTones[status], className)}>
      {statusLabels[status]}
    </span>
  );
}

/** « jeu. 22 oct. à 14 h 05 » */
export function formatDateTime(date: Date): string {
  return `${formatShortDate(date)} à ${String(date.getHours()).padStart(2, "0")} h ${String(date.getMinutes()).padStart(2, "0")}`;
}
