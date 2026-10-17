"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, LoaderCircle, Lock, ShoppingBag } from "lucide-react";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Field } from "@/components/forms/field";
import { MockupBadge } from "@/components/ui/badges";
import { Button, ButtonLink } from "@/components/ui/button";
import { cart, useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { newOrderNumber, saveOrder } from "@/lib/order";
import { formatRange, shippingOffers, type DeliveryMap, type ShippingMethodId } from "@/lib/delivery";
import { site } from "@/lib/site";

type FieldName = "email" | "firstName" | "lastName" | "address1" | "address2" | "postalCode" | "city" | "phone";
type Errors = Partial<Record<FieldName | "terms", string>>;

const EMPTY: Record<FieldName, string> = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  postalCode: "",
  city: "",
  phone: "",
};

function validate(fields: Record<FieldName, string>, terms: boolean): Errors {
  const errors: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Saisissez une adresse e-mail valide.";
  if (!fields.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!fields.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!fields.address1.trim()) errors.address1 = "Indiquez votre adresse.";
  const postalCode = fields.postalCode.trim();
  if (!/^\d{5}$/.test(postalCode)) errors.postalCode = "Le code postal comporte 5 chiffres.";
  else if (/^9[78]/.test(postalCode)) errors.postalCode = "Nous livrons uniquement en France métropolitaine.";
  if (!fields.city.trim()) errors.city = "Indiquez votre ville.";
  if (!/^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(fields.phone.trim()))
    errors.phone = "Saisissez un numéro français, par exemple 06 12 34 56 78.";
  if (!terms) errors.terms = "Vous devez accepter les conditions générales de vente.";
  return errors;
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 sm:p-8">
      <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-full bg-ink text-xs text-white">{number}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CheckoutForm({ deliveries }: { deliveries: DeliveryMap }) {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [shippingId, setShippingId] = useState<ShippingMethodId>("standard");
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [paying, setPaying] = useState(false);

  // Next.js garde la page montée (masquée) après la navigation : on la remet à zéro
  // quand elle disparaît, pour qu'un retour arrière n'affiche pas l'ancien formulaire.
  useLayoutEffect(
    () => () => {
      setFields(EMPTY);
      setErrors({});
      setTerms(false);
      setPaying(false);
    },
    [],
  );

  // Les modes et délais de livraison dépendent des robots du panier (données CJ).
  const offers = shippingOffers(items.map((item) => deliveries[item.slug]));
  const shipping = offers.find((offer) => offer.id === shippingId) ?? offers[0];
  const total = subtotal + (shipping?.price ?? 0);

  if (paying && !shipping) {
    // Le panier vient d'être vidé : la redirection vers la confirmation est en cours.
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-black/5">
        <LoaderCircle className="size-8 animate-spin text-muted" aria-hidden />
        <p className="mt-5 text-xl font-semibold tracking-tight">Validation de votre commande…</p>
      </div>
    );
  }

  if (!shipping) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-black/5">
        <ShoppingBag className="size-8 text-muted" aria-hidden />
        <p className="mt-5 text-2xl font-semibold tracking-tight">Votre panier est vide</p>
        <p className="mt-2 text-ink-soft">Ajoutez un robot pour passer commande.</p>
        <ButtonLink href="/robots" size="lg" className="mt-8">
          Voir les robots
        </ButtonLink>
      </div>
    );
  }

  const bind = (name: FieldName) => ({
    name,
    value: fields[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setFields((current) => ({ ...current, [name]: event.target.value }));
      if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields, terms);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first === "terms" ? "champ-cgv" : `champ-${first}`)?.focus();
      return;
    }

    // Maquette : le paiement est simulé. L'agrégateur de paiement prendra le relais ici.
    setPaying(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    saveOrder({
      number: newOrderNumber(),
      placedAt: new Date().toISOString(),
      email: fields.email.trim(),
      firstName: fields.firstName.trim(),
      address: {
        line1: fields.address1.trim(),
        line2: fields.address2.trim(),
        postalCode: fields.postalCode.trim(),
        city: fields.city.trim(),
      },
      items: items.map((item) => ({ slug: item.slug, qty: item.qty, total: item.total })),
      shipping,
      total,
    });
    cart.clear();
    router.push("/commande/confirmation");
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <Step number={1} title="Vos coordonnées">
          <div className="grid gap-4">
            <Field label="Adresse e-mail" type="email" autoComplete="email" required {...bind("email")} hint="Pour la confirmation et le suivi de votre commande." />
            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(event) => setNewsletter(event.target.checked)}
                className="mt-0.5 size-4 accent-ink"
              />
              Je souhaite recevoir les conseils et offres de {site.name} (désinscription en un clic).
            </label>
          </div>
        </Step>

        <Step number={2} title="Adresse de livraison">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" autoComplete="given-name" required {...bind("firstName")} />
            <Field label="Nom" autoComplete="family-name" required {...bind("lastName")} />
            <Field label="Adresse" autoComplete="address-line1" required className="sm:col-span-2" {...bind("address1")} />
            <Field
              label="Complément d'adresse"
              autoComplete="address-line2"
              className="sm:col-span-2"
              placeholder="Bâtiment, étage, code d'accès…"
              {...bind("address2")}
            />
            <Field label="Code postal" autoComplete="postal-code" inputMode="numeric" maxLength={5} required {...bind("postalCode")} />
            <Field label="Ville" autoComplete="address-level2" required {...bind("city")} />
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-sm font-medium">Pays</p>
              <p className="flex h-12 items-center rounded-[14px] bg-canvas px-4 text-[15px] text-ink-soft">
                France métropolitaine
              </p>
            </div>
            <Field
              label="Téléphone"
              type="tel"
              autoComplete="tel"
              required
              className="sm:col-span-2"
              hint="Utilisé uniquement par le transporteur en cas de besoin."
              {...bind("phone")}
            />
          </div>
        </Step>

        <Step number={3} title="Mode de livraison">
          <fieldset>
            <legend className="sr-only">Mode de livraison</legend>
            <div className="grid gap-3">
              {offers.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-[16px] p-4 ring-1 transition",
                    shippingId === method.id ? "bg-canvas ring-2 ring-ink" : "ring-line hover:ring-ink/40",
                  )}
                >
                  <input
                    type="radio"
                    name="livraison"
                    value={method.id}
                    checked={shippingId === method.id}
                    onChange={() => setShippingId(method.id)}
                    className="size-4 accent-ink"
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{method.label}</span>
                    <span className="text-sm text-muted">
                      {formatRange(method.range)}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">
                    {method.price === 0 ? "Offerte" : formatPrice(method.price)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Step>

        <Step number={4} title="Paiement">
          <div className="rounded-[16px] border border-dashed border-line bg-canvas p-6 text-center">
            <CreditCard className="mx-auto size-7 stroke-[1.4] text-ink-soft" aria-hidden />
            <p className="mt-3 font-medium">Le module de paiement sécurisé s&apos;affichera ici.</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Il sera fourni par l&apos;agrégateur de paiement : vos données bancaires ne transitent jamais par nos
              serveurs.
            </p>
            <MockupBadge className="mt-4">Paiement simulé : aucun débit</MockupBadge>
          </div>
        </Step>
      </div>

      <aside className="lg:col-span-5">
        <div className="space-y-4 lg:sticky lg:top-6">
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} />

          <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/5">
            <label className="flex items-start gap-3 text-sm">
              <input
                id="champ-cgv"
                type="checkbox"
                checked={terms}
                onChange={(event) => {
                  setTerms(event.target.checked);
                  if (errors.terms) setErrors((current) => ({ ...current, terms: undefined }));
                }}
                aria-invalid={Boolean(errors.terms)}
                aria-describedby={errors.terms ? "erreur-cgv" : undefined}
                className="mt-0.5 size-4 accent-ink"
              />
              <span className="text-ink-soft">
                J&apos;ai lu et j&apos;accepte les{" "}
                <Link href="/cgv" className="underline underline-offset-2" target="_blank">
                  conditions générales de vente
                </Link>
                . Je dispose de {site.returnDays} jours pour changer d&apos;avis à réception.
              </span>
            </label>
            {errors.terms && (
              <p id="erreur-cgv" className="mt-2 text-sm text-red-600">
                {errors.terms}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={paying}>
              {paying ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden /> Paiement en cours…
                </>
              ) : (
                <>
                  <Lock className="size-4" aria-hidden /> Payer {formatPrice(total)}
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              En cliquant sur « Payer », vous passez une commande avec obligation de paiement.
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}
