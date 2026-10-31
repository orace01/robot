"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, LoaderCircle } from "lucide-react";
import { sendContactMessage } from "@/app/(boutique)/contact/actions";
import { Field, SelectField, TextAreaField } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { CONTACT_SUBJECTS } from "@/lib/contact";

/** Formulaire de contact : le message part par e-mail vers la boîte du service client. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-black/5">
        <span className="grid size-14 place-items-center rounded-full bg-ok text-white">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <p className="mt-6 text-2xl font-semibold tracking-tight">Message envoyé</p>
        <p className="mt-2 max-w-sm text-ink-soft">Merci ! Nous vous répondons par e-mail dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = (name: string) => String(data.get(name) ?? "");
        startTransition(async () => {
          setError(undefined);
          const result = await sendContactMessage({
            name: value("nom"),
            email: value("email-contact"),
            subject: value("sujet"),
            order: value("commande"),
            message: value("message"),
            website: value("site-web"),
          });
          if (result.ok) setSent(true);
          else setError(result.message);
        });
      }}
      className="relative grid gap-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:grid-cols-2 sm:p-10"
    >
      <Field label="Nom" name="nom" autoComplete="name" required maxLength={100} />
      <Field label="Adresse e-mail" name="email-contact" type="email" autoComplete="email" required maxLength={200} />
      <SelectField label="Sujet" name="sujet" required defaultValue="">
        <option value="" disabled>
          Choisissez un sujet
        </option>
        {CONTACT_SUBJECTS.map((subject) => (
          <option key={subject}>{subject}</option>
        ))}
      </SelectField>
      <Field label="Numéro de commande" name="commande" placeholder="CL-123456" maxLength={20} />
      <TextAreaField label="Message" name="message" required rows={6} maxLength={4000} className="sm:col-span-2" />
      {/* Piège à robots : invisible pour les visiteurs. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input type="text" name="site-web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-xs text-muted sm:col-span-2">
        Vos données servent uniquement à traiter votre demande. Voir notre{" "}
        <Link href="/confidentialite" className="underline underline-offset-2">
          politique de confidentialité
        </Link>
        .
      </p>
      {error && (
        <p role="alert" className="rounded-[12px] bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start" disabled={pending}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        Envoyer le message
      </Button>
    </form>
  );
}
