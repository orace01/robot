import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Connexion administration",
};

export default function AdminLoginPage() {
  return (
    <Container className="pt-16">
      <div className="mx-auto max-w-sm rounded-[24px] bg-white p-8 ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="mt-2 mb-6 text-sm text-muted">Accès réservé à la gestion de la boutique.</p>
        <LoginForm />
      </div>
    </Container>
  );
}
