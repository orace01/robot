"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Field, SelectField, TextAreaField } from "@/components/forms/field";
import { MockupBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

/** Formulaire de contact (maquette : rien n'est envoyé). */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-black/5">
        <span className="grid size-14 place-items-center rounded-full bg-ok text-white">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <p className="mt-6 text-2xl font-semibold tracking-tight">Message envoyé</p>
        <p className="mt-2 max-w-sm text-ink-soft">Merci ! Nous vous répondons {site.supportDelay}.</p>
        <MockupBadge className="mt-4">Simulation : aucun message réel</MockupBadge>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="grid gap-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:grid-cols-2 sm:p-10"
    >
      <Field label="Nom" name="nom" autoComplete="name" required />
      <Field label="Adresse e-mail" name="email-contact" type="email" autoComplete="email" required />
      <SelectField label="Sujet" name="sujet" required defaultValue="">
        <option value="" disabled>
          Choisissez un sujet
        </option>
        <option>Question sur un robot</option>
        <option>Suivi de ma commande</option>
        <option>Retour ou rétractation</option>
        <option>Garantie ou panne</option>
        <option>Autre demande</option>
      </SelectField>
      <Field label="Numéro de commande" name="commande" placeholder="CL-123456" />
      <TextAreaField label="Message" name="message" required rows={6} className="sm:col-span-2" />
      <p className="text-xs text-muted sm:col-span-2">
        Vos données servent uniquement à traiter votre demande. Voir notre{" "}
        <Link href="/confidentialite" className="underline underline-offset-2">
          politique de confidentialité
        </Link>
        .
      </p>
      <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start">
        Envoyer le message
      </Button>
    </form>
  );
}
