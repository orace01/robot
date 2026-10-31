---
document: "Plan d'implémentation"
statut: finalisé        # brouillon | finalisé — seul l'utilisateur valide le passage à « finalisé » (R-001)
version: 1.0
date: 2026-10-31
valide_par: "shadowmartin281 (« Oui, tout validé », 2026-10-31)"
---

# 06 — Plan d'implémentation

> Les étapes 1 à 3 du socle sont **déjà faites** (commits jusqu'à `42d6bad`) : elles sont reportées pour mémoire. Le travail restant commence à l'étape 3-bis (hero fluide). L'avancement se note dans `PROJECT_STATE.md` (P-005).

## Étapes
| Étape | Contenu | Critère de fin |
|---|---|---|
| 1. Mise en place ✅ | Next.js 16, Tailwind 4, Motion, `.gitignore`, `.env.local` non versionné, Vercel | `npm run build` passe ; déploiement Vercel OK |
| 2. Données et authentification ✅ | Schéma Drizzle (doc 05), migrations, session admin | Admin protégé ; appel sans session refusé |
| 3. Parcours principal ✅ | Catalogue, fiches, panier, commande, Mepaye, CJ, suivi | Commande test de bout en bout en sandbox |
| **3-bis. Hero fluide + Lenis** | T1 à T6 ci-dessous | US1, US2, US8, US9 vérifiées au navigateur, de 375 px à 3840 px |
| 4. Fonctionnalités secondaires | Cartes produit à scène au survol, CTA sous plusieurs formes, boutons redessinés, polices After + Satoshi partout | Critères d'acceptation P2 du PRD |
| 5. Qualité | Accessibilité, erreurs, performance (LCP), R-009 grands écrans, audit SEC-9 en contexte neuf | Rapport `docs/audit-<date>.md` sans point bloquant |
| 6. Mise en ligne | SEO de base R-008, 20 vérifications, `mockup: false`, `CJ_ORDER_MODE=live`, Search Console | Checklist R-008 notée dans le VIBE-CHECK DEPLOY |

## Tâches
| ID | Étape | Tâche | Responsable / agent | Entrées | Livrable | Critère de fin | Dépend de |
|---|---|---|---|---|---|---|---|
| T1 | 3-bis | Installer **Lenis** (paquet `lenis` vérifié, version exacte) ; composant client `SmoothScroll` dans le layout boutique ; `html.lenis` CSS ; arrêt en `prefers-reduced-motion` ; `lenis.stop()` pendant le tiroir panier et le menu mobile ; ancres et changement de page via Lenis | Claude (session principale) | doc 02 (Défilement), R-010 | `src/components/motion/smooth-scroll.tsx`, `globals.css` | Molette simulée : défilement progressif ; page immobile sous le tiroir ; ancre `/#fonctionnement` sous l'en-tête ; téléphone inchangé | — |
| T2 | 3-bis | Polices : Satoshi + Cabinet Grotesk (repli d'After) via `next/font/local`, tokens `--font-sans`, `--font-display` | Claude | `docs/maquettes/fonts/` | `src/app/fonts/`, `layout.tsx`, `globals.css` | Titres et texte dans les bonnes polices, aucune requête Google Fonts sauf JetBrains Mono | — |
| T3 | 3-bis | Données du hero : `heroScene` (image de scène, mise au point) et `cutout` par produit dans `lib/products.ts` ; scènes Q3 réutilisées pour S2 et O1 en attendant Flow | Claude | `public/produits/*` | `lib/products.ts` | Chaque produit a une scène et un détourage | — |
| T4 | 3-bis | Composant serveur `Hero` (lit produits + disponibilité CJ) et composant client `HeroStage` : scène plein écran, robot flottant, nom géant en bas à gauche, liens courts, CTA « Ajouter au panier — prix », accroche à droite, indicateur 01/02/03, minuterie 6 s, fondu 0,9 s, pause au survol/focus/interaction, flèches clavier, `prefers-reduced-motion` | Claude | docs 03 et 04 | `components/home/hero.tsx`, `components/home/hero-stage.tsx` ; suppression de `hero-visual.tsx` et `hero-log.tsx` s'ils ne servent plus | US1, US2 vérifiées ; rupture → « Indisponible » | T2, T3 |
| T5 | 3-bis | Barre d'achat fixe mobile (robot choisi dans le hero, prix, « Acheter »), visible après le hero | Claude | doc 04 | `components/home/sticky-buy.tsx` | US9 vérifiée à 375 px | T4 |
| T6 | 3-bis | Vérification : `npm run lint`, `npm run build`, navigateur à 375, 768, 1440 × 900, 1728 × 1117, 3840 × 2160 ; commit | Claude | — | Captures, commit | Aucune erreur, pas de défilement horizontal, hero à la hauteur de l'écran | T1-T5 |
| T7 | 4 | Boutons redessinés d'après les captures de l'utilisateur | Claude | Captures | `components/ui/button.tsx` | Validation visuelle de l'utilisateur | Captures |
| T8 | 4 | Cartes produit « scène au survol » (section gamme et `/robots`) | Claude | Vidéo de référence, état « après » | `product-card.tsx` | Survol desktop OK ; mobile : scène fixe | T3 |
| T9 | 6 | SEO de base R-008 : `app/sitemap.ts`, `app/robots.ts`, metadata uniques par page, canonique, Open Graph absolue, 404 `noindex` | Claude | R-008 | Fichiers `app/` | Sitemap valide, title/description uniques | — |

## Point de contrôle à chaque fin d'étape
1. Lancer l'application.
2. Vérifier les critères d'acceptation du PRD concernés.
3. Noter les problèmes non résolus dans `PROJECT_STATE.md`.
4. Faire un commit (P-029).

## Questions tranchées
> Toutes tranchées par l’utilisateur le 2026-10-31.
- Ordre des étapes après le hero : SEO (T9) avant les boutons (T7) ? → **tranché** : T7 dès réception des captures, sinon T9 d'abord.

## Historique
| Version | Date | Changement | Validé par |
|---|---|---|---|
| 0.1 | 2026-10-31 | Création | — |
| 1.0 | 2026-10-31 | Questions tranchées, passage en finalisé | shadowmartin281 |
