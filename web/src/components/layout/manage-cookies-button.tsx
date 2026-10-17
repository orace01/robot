"use client";

import { reopenCookieBanner } from "@/components/layout/cookie-banner";

export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={reopenCookieBanner} className={className}>
      Gérer les cookies
    </button>
  );
}
