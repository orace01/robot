"use client";

import { useState } from "react";
import { CircleCheck, MapPin, PackageCheck, Search, Truck } from "lucide-react";
import { Field } from "@/components/forms/field";
import { MockupBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";

interface Result {
  number: string;
  steps: { title: string; date: string; done: boolean }[];
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatShortDate(date);
}

/** Suivi de commande (démonstration : le vrai statut viendra de CJ Dropshipping). */
export function TrackingForm() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<Result | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^CL-\d{6}$/i.test(number.trim())) {
      setError("Le numéro de commande ressemble à CL-123456 (voir l'e-mail de confirmation).");
      return;
    }
    setError(undefined);
    setResult({
      number: number.trim().toUpperCase(),
      steps: [
        { title: "Commande confirmée", date: daysAgo(6), done: true },
        { title: "Commande préparée", date: daysAgo(4), done: true },
        { title: "Colis expédié", date: daysAgo(3), done: true },
        { title: "En transit vers la France", date: "En cours", done: false },
        { title: "Livré", date: "À venir", done: false },
      ],
    });
  }

  const icons = [CircleCheck, PackageCheck, Truck, MapPin, CircleCheck];

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:col-span-5">
        <h2 className="text-2xl font-semibold tracking-tight">Retrouver ma commande</h2>
        <Field
          label="Numéro de commande"
          name="numero"
          placeholder="CL-123456"
          required
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          error={error}
          hint="Il figure dans l'e-mail de confirmation."
        />
        <Field
          label="Adresse e-mail"
          name="email-suivi"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" size="lg" className="w-full">
          <Search className="size-4" aria-hidden /> Suivre ma commande
        </Button>
      </form>

      <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 sm:p-10 lg:col-span-7" aria-live="polite">
        {result ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-2xl font-semibold tracking-tight">Commande {result.number}</p>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-strong">
                En transit
              </span>
            </div>
            <MockupBadge className="mt-3">Démonstration : le suivi réel sera relié à CJ Dropshipping</MockupBadge>
            <ol className="mt-8">
              {result.steps.map((step, i) => {
                const Icon = icons[i];
                return (
                  <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < result.steps.length - 1 && (
                      <span
                        aria-hidden
                        className={cn("absolute top-10 bottom-0 left-5 w-px", step.done ? "bg-ink" : "bg-line")}
                      />
                    )}
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full",
                        step.done ? "bg-ink text-white" : "bg-mist text-faint",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="pt-1.5">
                      <p className={cn("font-medium", !step.done && "text-muted")}>{step.title}</p>
                      <p className="text-sm text-muted">{step.date}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
            <Truck className="size-10 stroke-[1.2] text-faint" aria-hidden />
            <p className="mt-4 max-w-xs text-ink-soft">
              Saisissez votre numéro de commande pour voir où en est votre colis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
