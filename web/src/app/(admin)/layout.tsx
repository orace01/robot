import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Pages internes de gestion (jamais indexées). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-ink text-white">
        <Container className="flex h-16 items-center justify-between">
          <Logo tone="light" />
          <p className="eyebrow text-white/60">Administration</p>
        </Container>
      </header>
      <main className="pb-24">{children}</main>
    </>
  );
}
