"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/** Inscription à la newsletter (maquette : rien n'est envoyé). */
export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm">
        <Check className="size-4" aria-hidden /> Merci ! Vous recevrez nos conseils et nos offres.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
      className="flex max-w-md items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-white/50"
    >
      <label htmlFor="newsletter" className="sr-only">
        Adresse e-mail
      </label>
      <input
        id="newsletter"
        type="email"
        required
        autoComplete="email"
        placeholder="Votre adresse e-mail"
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
      />
      <button
        type="submit"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition hover:bg-white/85"
        aria-label="S'inscrire à la newsletter"
      >
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </form>
  );
}
