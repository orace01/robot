CREATE TABLE `order_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`type` text NOT NULL,
	`status` text,
	`message` text NOT NULL,
	`visible_to_customer` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_events_order_idx` ON `order_events` (`order_id`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_slug` text NOT NULL,
	`product_name` text NOT NULL,
	`cj_sku` text NOT NULL,
	`cj_vid` text NOT NULL,
	`unit_price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`total` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`status` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text NOT NULL,
	`address1` text NOT NULL,
	`address2` text DEFAULT '' NOT NULL,
	`postal_code` text NOT NULL,
	`city` text NOT NULL,
	`country` text DEFAULT 'FR' NOT NULL,
	`newsletter` integer DEFAULT false NOT NULL,
	`shipping_method` text NOT NULL,
	`shipping_label` text NOT NULL,
	`shipping_price` integer NOT NULL,
	`delivery_min_days` integer NOT NULL,
	`delivery_max_days` integer NOT NULL,
	`subtotal` integer NOT NULL,
	`vat` integer NOT NULL,
	`total` integer NOT NULL,
	`payment_provider` text,
	`payment_reference` text,
	`supplier_order_id` text,
	`carrier` text,
	`tracking_number` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`paid_at` integer,
	`shipped_at` integer,
	`delivered_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_number_unique` ON `orders` (`number`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_email_idx` ON `orders` (`email`);