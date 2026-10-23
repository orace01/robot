import "server-only";

import type { SupplierState } from "@/db/schema";
import { regionFromPostalCode } from "@/lib/orders/regions";
import { site } from "@/lib/site";
import { CjError, type CjRequest } from "./api";
import { europeanWarehouses } from "./supplier";

/**
 * Commandes passées chez CJ par l'API.
 *
 * CJ_ORDER_MODE (web/.env.local) :
 * - « sandbox » (par défaut) : commandes de test CJ, sans envoi ni débit réels ;
 * - « live » : vraies commandes, payées automatiquement sur le solde CJ ;
 * - « off » : aucune transmission.
 * Tant que le paiement client est simulé, le mode « live » est ramené à « sandbox »,
 * pour ne jamais créer de vraie commande CJ à partir d'une commande de test.
 */
export type SupplierMode = "off" | "sandbox" | "live";

export function supplierMode(): SupplierMode {
  const mode = process.env.CJ_ORDER_MODE ?? "sandbox";
  if (mode === "off") return "off";
  if (mode === "live" && site.paymentMode !== "simulation") return "live";
  return "sandbox";
}

/**
 * TVA à l'import pour les envois hors UE : 1 = pas d'IOSS, 2 = ton numéro IOSS,
 * 3 = IOSS de CJ (par défaut, pour que le client n'ait rien à payer à la livraison).
 * À valider avec un comptable avant les vraies commandes.
 */
const IOSS_TYPE = Number(process.env.CJ_IOSS_TYPE ?? 3);
const IOSS_NUMBER = process.env.CJ_IOSS_NUMBER;

/** Codes d'erreur CJ. */
const ORDER_EXISTS = 1603003;
export const ORDER_NOT_FOUND = 1600300;

export interface CjOrderRecipient {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
}

export interface CjOrderRequest {
  /** Numéro transmis à CJ, unique pour tout le compte CJ. */
  reference: string;
  createdAt: Date;
  recipient: CjOrderRecipient;
  fromCountry: string;
  logisticName: string;
  products: { vid: string; quantity: number }[];
  sandbox: boolean;
}

/** Commande vue par CJ (getOrderDetail). Montants en dollars. */
export interface CjOrderDetail {
  orderId: string;
  /** Numéro affiché dans l'espace CJ (« CJ2610… »), attribué une fois la commande payée. */
  cjOrderId: string | null;
  orderNum: string;
  orderStatus: string;
  subStatus: string | null;
  orderAmount: number | null;
  logisticName: string | null;
  trackNumber: string | null;
  trackingUrl: string | null;
  trackingProvider: string | null;
  isSandbox: number;
}

interface CjCreatedOrder {
  orderId: string;
  logisticsMiss?: boolean;
  interceptOrderReasons?: { code: string; message: string }[] | null;
}

/**
 * Crée et paie (sur le solde CJ) la commande, puis renvoie son état chez CJ.
 * Si une commande porte déjà ce numéro (essai précédent interrompu), elle est reprise
 * telle quelle : CJ refuse les doublons, il n'y a donc jamais deux commandes.
 */
export async function placeCjOrder(
  request: CjRequest,
  order: CjOrderRequest,
): Promise<{ detail: CjOrderDetail; warning?: string }> {
  const { recipient } = order;
  const houseNumber = recipient.address1.match(/^\s*(\d+\s*(?:bis|ter|quater)?)\b/i)?.[1];
  const outsideEu = !europeanWarehouses.has(order.fromCountry);
  let warning: string | undefined;

  try {
    const created = await request<CjCreatedOrder>("POST", "/shopping/order/createOrderV2", {
      orderNumber: order.reference,
      storeOrderTime: Math.floor(order.createdAt.getTime() / 1000),
      shippingCountryCode: "FR",
      shippingCountry: "France",
      shippingProvince: regionFromPostalCode(recipient.postalCode) ?? recipient.city,
      shippingCity: recipient.city.slice(0, 50),
      shippingZip: recipient.postalCode,
      shippingCustomerName: `${recipient.firstName} ${recipient.lastName}`.slice(0, 50),
      shippingAddress: recipient.address1.slice(0, 200),
      ...(recipient.address2 && { shippingAddress2: recipient.address2.slice(0, 200) }),
      ...(houseNumber && { houseNumber }),
      shippingPhone: recipient.phone.replace(/[\s.-]/g, "").slice(0, 20),
      logisticName: order.logisticName,
      fromCountryCode: order.fromCountry,
      // Création et paiement en une fois, sur le solde CJ (simulé en mode sandbox).
      payType: 2,
      isSandbox: order.sandbox ? 1 : 0,
      iossType: outsideEu ? IOSS_TYPE : 1,
      ...(outsideEu && IOSS_TYPE === 2 && IOSS_NUMBER && { iossNumber: IOSS_NUMBER }),
      products: order.products,
    });
    if (created.logisticsMiss) warning = `transporteur « ${order.logisticName} » refusé par CJ`;
    else if (created.interceptOrderReasons?.length) {
      warning = `bloquée par CJ : ${created.interceptOrderReasons.map((reason) => reason.message).join(" ; ")}`;
    }
  } catch (error) {
    if (!(error instanceof CjError && error.code === ORDER_EXISTS)) throw error;
  }

  const detail = await getCjOrder(request, order.reference);
  if (Boolean(detail.isSandbox) !== order.sandbox) {
    throw new Error(`Le numéro ${order.reference} est déjà pris chez CJ par une commande ${detail.isSandbox ? "de test" : "réelle"}.`);
  }
  return { detail, warning };
}

/** Commande CJ, par notre numéro ou par l'identifiant CJ. */
export function getCjOrder(request: CjRequest, reference: string): Promise<CjOrderDetail> {
  return request<CjOrderDetail>("GET", "/shopping/order/getOrderDetail", { orderId: reference });
}

/** Solde du compte CJ, en dollars. */
export async function getCjBalance(request: CjRequest): Promise<number> {
  const data = await request<{ amount: number }>("GET", "/shopping/pay/getBalance");
  return data.amount;
}

/**
 * État de notre suivi d'après le statut CJ. Les commandes non payées restent « CREATED » :
 * c'est le cas si le solde CJ ne suffit pas.
 */
export function supplierStateFromCj(detail: CjOrderDetail): SupplierState | null {
  switch (detail.orderStatus) {
    case "CREATED":
    case "IN_CART":
    case "UNPAID":
      return "unpaid";
    case "PENDING":
    case "PROCESSING":
    case "UNSHIPPED":
      return "sent";
    case "SHIPPED":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    // Commande close : terminée si elle a été expédiée, annulée sinon.
    case "CLOSED":
      return detail.trackNumber ? "delivered" : "cancelled";
    default:
      return null;
  }
}
