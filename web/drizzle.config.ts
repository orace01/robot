import { defineConfig } from "drizzle-kit";

// Base locale par défaut (fichier data/boutique.db) ; en production, une base libSQL
// hébergée (Turso) via DATABASE_URL et DATABASE_AUTH_TOKEN.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:data/boutique.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
