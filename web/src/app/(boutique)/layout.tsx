import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="pb-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
