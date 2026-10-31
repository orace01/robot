---
document: "TRD — exigences techniques"
statut: finalisé        # brouillon | finalisé — seul l'utilisateur valide le passage à « finalisé » (R-001)
version: 1.0
date: 2026-10-31
valide_par: "shadowmartin281 (« Oui, tout validé », 2026-10-31)"
---

# 02 — TRD : exigences techniques

> Découle du PRD. Aucune valeur secrète ici : seulement les noms de variables (SEC-1).

## Plateformes
- Web uniquement, responsive de 375 px à 3840 × 2160 (R-009). Navigateurs récents (Chrome, Safari, Firefox, Edge).

## Frontend et hébergement
- **Framework** : Next.js 16.4 (App Router, Server Components), React 19.3, Tailwind CSS 4, Motion 14 (animations), Lucide (icônes).
- **Défilement** : **Lenis** (`darkroomengineering/lenis`, paquet `lenis`), version exacte, une instance par page via un module client dédié : `new Lenis({ autoRaf: true, allowNestedScroll: true })`, sans `syncTouch`, désactivé en `prefers-reduced-motion`, `html.lenis { scroll-behavior: auto; }`, `lenis.stop()` pendant le tiroir panier et les modales, ancres et changements de page via `lenis.scrollTo` (décalage de l'en-tête fixe, `immediate` au changement de route) — R-010.
- **Polices** : After Display (titres, fichier sous licence fourni par l'utilisateur), Satoshi (texte, Fontshare, licence ITF FFL), JetBrains Mono (étiquettes) ; repli titres : Cabinet Grotesk. Chargement via `next/font/local`.
- **Environnement d'exécution** : Node.js (fonctions serverless Vercel).
- **Hébergement / déploiement** : Vercel, Root Directory = `web`, déploiement à chaque push sur la branche de production.

## Backend et données
- **Services** : routes Next.js côté serveur (Server Actions et route handlers) : commande, webhook de paiement, synchronisation CJ, administration.
- **Base de données** : SQLite via libSQL + Drizzle ORM. Local : `web/data/boutique.db`. Production : Turso (Vercel Storage), migrations appliquées automatiquement au premier accès.
- **Catalogue** : statique dans `src/lib/products.ts` (textes, prix de vente, images, références CJ) ; prix d'achat, stock et délais lus chez CJ côté serveur, cache 1 h.
- **Région** : Vercel et Turso en Europe (proposition : `fra1` / Francfort).

## Authentification et rôles
- **Clients** : pas de compte. Suivi par numéro de commande + e-mail.
- **Administrateur** : un seul rôle, mot de passe `ADMIN_PASSWORD`, session signée (`ADMIN_SESSION_SECRET`) en cookie HttpOnly. Toutes les pages et actions `/admin` vérifient la session côté serveur (SEC-4).

## Services externes et API
| Service | Usage | Limites / quotas / coût | Détenteur des identifiants | Variable d'environnement |
|---|---|---|---|---|
| CJ Dropshipping | Prix d'achat, stock, transports, création et paiement des commandes, suivi | Demande de jeton très limitée ; jeton valable 180 jours | Utilisateur | `CJ_API_KEY`, `CJ_ACCESS_TOKEN`, `CJ_ORDER_MODE`, `CJ_IOSS_TYPE`, `CJ_IOSS_NUMBER` |
| Mepaye | Paiement par carte, webhook signé | Pas d'API de lecture ni de remboursement | Utilisateur | `MEPAYE_API_KEY`, `MEPAYE_WEBHOOK_SECRET`, `MEPAYE_API_URL` |
| Turso | Base de production | Plan gratuit | Utilisateur (via Vercel) | `DATABASE_TURSO_DATABASE_URL`, `DATABASE_TURSO_AUTH_TOKEN` (ou `DATABASE_URL`, `DATABASE_AUTH_TOKEN`) |
| Vercel Cron | Appel quotidien de `/api/cj/sync` | 1 par jour en plan gratuit | Utilisateur | `CRON_SECRET` |
| BCE (taux de change) | Conversion USD → EUR pour les marges | Public, sans clé | — | — |
| Google Search Console | Indexation (R-008) | Gratuit | Utilisateur | — |
| Site | URL absolue (Open Graph, retour paiement) | — | — | `NEXT_PUBLIC_SITE_URL` |

## Architecture
- **Composants** : boutique (`app/(boutique)`), tunnel (`app/(tunnel)`), administration (`app/(admin)`), API (`app/api/payments/notify`, `app/api/cj/sync`), bibliothèques (`lib/products`, `lib/cart`, `lib/cj`, `lib/payments`, `lib/orders`, `lib/auth`), base (`db/schema.ts`).
- **Hero fluide** : composant serveur `Hero` qui lit les produits (prix, disponibilité CJ) et passe les données à un composant client `HeroStage` (diaporama, fondu Motion, pause au survol et à l'interaction, `prefers-reduced-motion`). Le CTA réutilise `AddToCart` et le tiroir panier existants.
- **Circulation des données** : navigateur → panier localStorage → Server Action « commande » (le serveur recalcule prix, stock, livraison) → commande « En attente » → Mepaye → webhook signé → « Payée » → transmission CJ (une commande par entrepôt) → cron/suivi → « Expédiée » / « Livrée ».

## Sécurité et confidentialité
- **Données sensibles** : nom, adresse, e-mail, téléphone des clients ; aucune donnée de carte (gérée par Mepaye).
- **Contrôles d'accès** : session admin vérifiée côté serveur ; webhook vérifié par signature, montant et devise ; cron protégé par `CRON_SECRET` ; tout ce qui vient du navigateur est revalidé côté serveur (SEC-4, SEC-5, SEC-6). Base sans RLS (SQLite) : seul le serveur y accède (SEC-3 sans objet côté client).
- **Messages d'erreur** : génériques côté client, détail dans les journaux (SEC-8).
- **Durée de conservation** : commandes 10 ans (obligation comptable) ; pas de cookie non essentiel (pas de bandeau requis si la mesure d'audience est sans cookie).

## Performance et fiabilité
- **Temps de réponse visés** : LCP < 2,5 s sur mobile 4G ; image du hero en `priority`, formats WebP/AVIF, scènes suivantes chargées après la première.
- **Disponibilité** : celle de Vercel et Turso. Si CJ ne répond pas, délais par défaut et nouvel essai quelques minutes plus tard.
- **Sauvegardes** : sauvegardes automatiques Turso (à vérifier dans l'offre) + export manuel mensuel.
- **Tâches longues** : transmission CJ et synchronisation restent sous la durée maximale des fonctions Vercel (P-016, à vérifier) ; traitement par lots.

## Environnements et mise en production
- **Développement** : `npm run dev`, SQLite locale, `CJ_ORDER_MODE=sandbox`, Mepaye sans clé (paiement simulé) ou clé `mp_test_`.
- **Préproduction** : déploiements de prévisualisation Vercel par branche.
- **Production** : Vercel + Turso, `CJ_ORDER_MODE=live` seulement avec `mp_live_`.
- **CI/CD** : Vercel (build `next build`, lint ESLint).

## Décisions techniques clés
| Décision | Raison | Alternative écartée |
|---|---|---|
| Catalogue en code (`lib/products.ts`) | 3 produits, textes soignés, pas de CMS à maintenir | CMS headless |
| SQLite/libSQL + Turso | Simple, gratuit, même code en local et en production | Postgres/Supabase |
| Paiement Mepaye | Choix de l'utilisateur | Stripe |
| Pas de compte client | Moins de friction, moins de données personnelles | Comptes avec mot de passe |
| Lenis pour le défilement | Règle R-010, rendu premium | Défilement natif seul |
| Hero en diaporama Motion (fondu + léger mouvement), pas de vidéo en fond | Poids maîtrisé, images Flow remplaçables, accessible | Vidéo plein écran (lourde sur mobile) |

## Questions tranchées
> Toutes tranchées par l’utilisateur le 2026-10-31.
- Région Vercel/Turso → **tranché** : Francfort.
- Licence web d'After Display achetée ? → **tranché** : Cabinet Grotesk tant que le fichier n'est pas fourni.
- Mesure d'audience → **tranché** : Vercel Web Analytics, sans cookie.

## Historique
| Version | Date | Changement | Validé par |
|---|---|---|---|
| 0.1 | 2026-10-31 | Création | — |
| 1.0 | 2026-10-31 | Questions tranchées, passage en finalisé | shadowmartin281 |
