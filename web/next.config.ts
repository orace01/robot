import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Le cache disque de Turbopack bloquait le serveur de développement plusieurs
    // minutes sur cette machine (écriture et compactage) : désactivé en dev.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    // Racine explicite : un package-lock.json traîne dans le dossier personnel.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
