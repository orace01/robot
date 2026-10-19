import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
    /** Commande correspondante chez CJ Dropshipping. */
    supplierOrderId: text("supplier_order_id"),
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

/** Historique d'une commande : changements de statut, suivi colis, notes internes. */
export const orderEvents = sqliteTable(
  "order_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["status", "tracking", "note"] }).notNull(),
    status: text("status", { enum: ORDER_STATUSES }),
    message: text("message").notNull(),
    /** Affiché au client sur la page de suivi. */
    visibleToCustomer: integer("visible_to_customer", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("order_events_order_idx").on(table.orderId)],
);

export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type OrderEventRow = typeof orderEvents.$inferSelect;
