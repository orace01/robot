"use client";

import { useActionState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { login } from "@/app/(admin)/admin/actions";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Mot de passe" name="password" type="password" autoComplete="current-password" required error={error} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
        Se connecter
      </Button>
    </form>
  );
}
