CREATE TABLE `supplier_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`from_country` text NOT NULL,
	`reference` text NOT NULL,
	`logistic_name` text,
	`sandbox` integer NOT NULL,
	`state` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`cj_order_id` text,
	`cj_status` text,
	`amount_usd_cents` integer,
	`track_number` text,
	`tracking_url` text,
	`error` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`synced_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supplier_orders_order_origin_idx` ON `supplier_orders` (`order_id`,`from_country`);--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `supplier_order_id`;