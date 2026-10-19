import type { ShippingMethodId } from "@/lib/delivery";

/** Données du formulaire de commande, contrôlées à l'identique dans le navigateur et sur le serveur. */

export const CUSTOMER_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "address1",
  "address2",
  "postalCode",
  "city",
  "phone",
] as const;

export type CustomerField = (typeof CUSTOMER_FIELDS)[number];
export type CustomerFields = Record<CustomerField, string>;
export type CheckoutErrors = Partial<Record<CustomerField | "terms", string>>;

export const EMPTY_CUSTOMER: CustomerFields = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  postalCode: "",
  city: "",
  phone: "",
};

export const MAX_FIELD_LENGTH = 200;
/** Quantité maximale d'un même robot par commande. */
export const MAX_QUANTITY = 5;

export interface CheckoutRequest {
  customer: CustomerFields;
  items: { slug: string; qty: number }[];
  shippingMethod: ShippingMethodId;
  terms: boolean;
  newsletter: boolean;
}

export function validateCustomer(fields: CustomerFields, terms: boolean): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const name of CUSTOMER_FIELDS) {
    if (fields[name].length > MAX_FIELD_LENGTH) errors[name] = "Ce champ est trop long.";
  }
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
