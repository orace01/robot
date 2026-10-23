import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { ORDER_STATUSES } from "../lib/orders/status";

/** Montants en centimes d'euro TTC ; dates en millisecondes. */

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Numéro communiqué au client (CL-123456). */
    number: text("number").notNull().unique(),
    status: text("status", { enum: ORDER_STATUSES }).notNull(),

    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
    address1: text("address1").notNull(),
    address2: text("address2").notNull().default(""),
    postalCode: text("postal_code").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull().default("FR"),
    newsletter: integer("newsletter", { mode: "boolean" }).notNull().default(false),

    shippingMethod: text("shipping_method", { enum: ["standard", "express"] }).notNull(),
    shippingLabel: text("shipping_label").notNull(),
    shippingPrice: integer("shipping_price").notNull(),
    deliveryMinDays: integer("delivery_min_days").notNull(),
    deliveryMaxDays: integer("delivery_max_days").notNull(),

    subtotal: integer("subtotal").notNull(),
    vat: integer("vat").notNull(),
    total: integer("total").notNull(),

    /** Paiement (étape suivante : agrégateur de paiement). */
    paymentProvider: text("payment_provider"),
    paymentReference: text("payment_reference"),
    carrier: text("carrier"),
    trackingNumber: text("tracking_number"),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    shippedAt: integer("shipped_at", { mode: "timestamp_ms" }),
    deliveredAt: integer("delivered_at", { mode: "timestamp_ms" }),
  },
  (table) => [index("orders_status_idx").on(table.status), index("orders_email_idx").on(table.email)],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productSlug: text("product_slug").notNull(),
    /** Nom affiché au moment de la commande. */
    productName: text("product_name").notNull(),
    cjSku: text("cj_sku").notNull(),
    cjVid: text("cj_vid").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    total: integer("total").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

/**
 * Historique d'une commande : changements de statut, suivi colis, notes internes et
 * échanges avec le fournisseur (« supplier », visibles dans l'administration seulement).
 */
export const orderEvents = sqliteTable(
  "order_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["status", "tracking", "note", "supplier"] }).notNull(),
    status: text("status", { enum: ORDER_STATUSES }),
    message: text("message").notNull(),
    /** Affiché au client sur la page de suivi. */
    visibleToCustomer: integer("visible_to_customer", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("order_events_order_idx").on(table.orderId)],
);

/** États d'une commande transmise à CJ (voir lib/orders/fulfillment.ts). */
export const SUPPLIER_STATES = ["sending", "sent", "unpaid", "shipped", "delivered", "cancelled", "error"] as const;

/**
 * Commandes passées chez CJ Dropshipping : une par entrepôt d'expédition
 * (un panier S2 + Q3 part d'Allemagne et de Chine, donc deux commandes CJ).
 */
export const supplierOrders = sqliteTable(
  "supplier_orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromCountry: text("from_country").notNull(),
    /** Numéro de commande transmis à CJ (CL-123456, préfixé TEST- en mode sandbox). */
    reference: text("reference").notNull(),
    /** Transporteur CJ, choisi au moment de la transmission. */
    logisticName: text("logistic_name"),
    /** Commande de test CJ (aucun envoi ni débit réels). */
    sandbox: integer("sandbox", { mode: "boolean" }).notNull(),
    state: text("state", { enum: SUPPLIER_STATES }).notNull(),
    /** Nombre d'essais de transmission. */
    attempts: integer("attempts").notNull().default(0),
    cjOrderId: text("cj_order_id"),
    cjStatus: text("cj_status"),
    /** Montant réellement facturé par CJ, en centimes de dollar. */
    amountUsdCents: integer("amount_usd_cents"),
    trackNumber: text("track_number"),
    trackingUrl: text("tracking_url"),
    error: text("error"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    syncedAt: integer("synced_at", { mode: "timestamp_ms" }),
  },
  (table) => [uniqueIndex("supplier_orders_order_origin_idx").on(table.orderId, table.fromCountry)],
);

export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type OrderEventRow = typeof orderEvents.$inferSelect;
export type SupplierOrderRow = typeof supplierOrders.$inferSelect;
export type SupplierState = (typeof SUPPLIER_STATES)[number];
