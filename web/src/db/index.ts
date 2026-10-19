import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

const DEFAULT_URL = "file:data/boutique.db";

function createDatabase() {
  const url = process.env.DATABASE_URL ?? DEFAULT_URL;
  if (url.startsWith("file:")) {
    // Le dossier de la base locale doit exister avant la première connexion.
    mkdirSync(path.dirname(path.resolve(url.slice("file:".length))), { recursive: true });
  }
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema });
}

type Database = ReturnType<typeof createDatabase>;

// Une seule connexion par processus (et par rechargement à chaud en développement).
const globalForDb = globalThis as unknown as { boutiqueDb?: Promise<Database> };

/** Base de données, à jour des migrations (appliquées automatiquement au premier accès). */
export function getDb(): Promise<Database> {
  globalForDb.boutiqueDb ??= (async () => {
    const db = createDatabase();
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    return db;
  })().catch((error) => {
    globalForDb.boutiqueDb = undefined;
    throw error;
  });
  return globalForDb.boutiqueDb;
}
