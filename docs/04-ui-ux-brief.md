---
document: "Brief UI/UX"
statut: finalisé        # brouillon | finalisé — seul l'utilisateur valide le passage à « finalisé » (R-001)
version: 1.0
date: 2026-10-31
valide_par: "shadowmartin281 (« Oui, tout validé », 2026-10-31)"
---

# 04 — Brief UI/UX

## Public et ton
- **Pour qui** : propriétaires de maisons et d'appartements, 30-65 ans, sensibles au design et au gain de temps ; acheteurs venant des publicités vidéo (TikTok, Instagram).
- **Trois adjectifs** : net, premium, rassurant.

## Produits de référence
| Lien ou capture | À reprendre | À éviter |
|---|---|---|
| Vidéo Instagram DfCYVufB3Xl (site « Flux Theory », état « avant ») | **Hero** : scène plein écran propre à chaque produit, produit centré qui flotte, **nom géant en bas à gauche**, liens courts sous le titre, CTA d'achat au centre bas, description courte en bas à droite, menu minimal en haut à droite ; passage d'un produit à l'autre par fondu de la scène | Couleurs saturées du savon ; cartes « basiques » de la section suivante |
| Même vidéo, état « après » | Cartes produit sur fond clair, produit détouré ; la scène du produit n'apparaît qu'au survol de la carte | Aucun |
| Inspirations Ondera (`docs/maquettes/wireframes/ondera/`, A-133/135/137) | Mobile : en-tête compact, marque pleine largeur, barre d'achat fixe | Formes de boutons jugées « AI slop » |
| Deck « Point marque » (artefact PyipTgJny6axQwYACYFBU4) | Duo typographique, images situationnelles réalistes | — |
| Boutons : sites de référence (Godly, Refero, Commerce Cream…) | Formes de boutons et CTA choisis par l'utilisateur (captures à fournir) | Pilules à double icône, dégradés, ombres molles génériques |

## Couleurs
| Rôle | Valeur |
|---|---|
| Principale (encre) | `#0D0F12` |
| Accent | `#2D5BFF` (survol `#1F45E0`, fond doux `#E4EAFF`) |
| Fond | `#FFFFFF` ; fond secondaire `#F2F3F5` ; voile `#EEF0F0` |
| Texte | `#0D0F12` ; secondaire `#3A3F48` ; discret `#6B727D` |
| Succès / avertissement / erreur | `#12A26A` / `#C77700` / `#D93025` |
| Hero | Texte blanc sur la scène, avec un dégradé sombre en bas (lisibilité du titre, contraste ≥ 4,5:1) |

## Typographie
- **Polices** : After Display (titres, repli Cabinet Grotesk 800), Satoshi 400/500/700 (texte), JetBrains Mono (étiquettes techniques).
- **Tailles** :
  - nom du robot dans le hero : `clamp(4.5rem, 14vw, 13rem)`, capitales, interlignage 0,85 ;
  - H1 de page : `clamp(2.5rem, 6vw, 5rem)` ;
  - H2 : `clamp(2rem, 4vw, 3.5rem)` ;
  - texte : 16-18 px, interlignage 1,5 ;
  - étiquettes : 11-12 px, capitales, approche +0,08 em.

## Composants
- **Hero fluide** (`HeroStage`) :
  - scène plein écran (image `object-cover`) ;
  - robot détouré centré, qui flotte légèrement ;
  - nom géant en bas à gauche, liens courts dessous (Fenêtres · Baies vitrées · Vérandas) ;
  - CTA « Ajouter au panier — prix » au centre bas ;
  - accroche et description en bas à droite ;
  - indicateur 01/02/03 avec barre de progression ;
  - flèches clavier.
- **Boutons** : forme à redéfinir à partir des références de l'utilisateur. D'ici là : rectangle à rayon 10 px, plein encre (principal), contour (secondaire), lien souligné (tertiaire). Pas de double icône, pas d'ombre décorative.
- **Cartes produit** : fond clair, produit détouré ; la scène apparaît au survol (desktop), nom, accroche, prix et CTA.
- **Barre d'achat fixe (mobile)** : robot choisi, prix, bouton « Acheter ».
- **Tiroir panier**, formulaires (libellés visibles, erreurs sous le champ), badges (« Prix provisoire », « En stock »), accordéons FAQ, fil d'Ariane.

## Mise en page
- **Grille et espacements** : conteneur 1240 px (R-009 au-delà de 1441 px) ; marges latérales 16 px (mobile), 32 px (tablette), 48 px (desktop) ; échelle d'espacement 4/8/12/16/24/32/48/64/96/128.
- **Points de rupture** : 375, 640, 768, 1024, 1280, 1440 ; grands écrans selon R-009 (`--z` 1,15 → 2,35, zoom par conteneur, hero en `vw`/`svh` exclu du zoom).

## Notes par écran
| Écran (cf. App Flow) | Contenu clé | Hiérarchie |
|---|---|---|
| Accueil — hero | Scène, robot, nom géant, CTA | 1. robot dans sa scène, 2. nom, 3. CTA et prix, 4. accroche |
| Accueil — sections | Confiance, anatomie, fonctionnement, gamme (cartes avec scène au survol), cas d'usage, avis, FAQ, CTA final | Une idée par section, un seul CTA principal par section |
| Catalogue | 3 cartes + comparatif | Cartes puis tableau |
| Fiche produit | Galerie, panneau d'achat, caractéristiques, avis | Panneau d'achat toujours visible (fixe sur desktop, barre sur mobile) |
| Panier / commande / confirmation | Récapitulatif, formulaire, statut | Total et bouton de paiement en évidence |
| Suivi | Formulaire puis chronologie | Statut actuel en premier |
| Admin | Tableaux, cartes d'état | Lisibilité, aucune animation |

## Accessibilité
- Contraste WCAG AA (texte ≥ 4,5:1, grands titres ≥ 3:1), y compris le texte sur la scène du hero.
- Navigation au clavier complète, focus visible (anneau accent 2 px), ordre logique.
- Hero : `aria-roledescription="carrousel"`, bouton pause, `aria-live="polite"` sur le nom affiché, défilement automatique arrêté au focus et en `prefers-reduced-motion`.
- Textes alternatifs sur toutes les images produit ; scènes décoratives `alt=""`.
- Zones tactiles ≥ 44 × 44 px.

## États d'interaction
- **Survol** : bouton principal légèrement assombri ; carte produit → la scène apparaît (fondu 400 ms).
- **Focus** : anneau visible.
- **Désactivé** : opacité 40 %, curseur interdit, libellé explicite (« Indisponible »).
- **Chargement** : libellé changé + indicateur, bouton inactif.
- **Erreur** : message sous le champ, couleur erreur + icône.
- **Réussite** : tiroir panier ouvert, compteur animé.

## Éléments graphiques à prévoir
- Scènes plein écran par robot (Q3 : existantes ; S2 et O1 : à produire dans Google Flow), format 16:9 et 9:16, ≥ 2560 px de large.
- Robots détourés en PNG/WebP transparents, haute définition.
- Logo Clair, favicon et icône iPhone, image Open Graph 1200 × 630.
- Vidéos multi-angles (Google Flow) pour les fiches produit.

## Questions tranchées
> Toutes tranchées par l’utilisateur le 2026-10-31.
- Forme définitive des boutons → **tranché** : rectangle 10 px ci-dessus, remplacé dès réception des captures de référence.
- Fond du hero sur mobile : scène en 9:16 recadrée ou image dédiée ? → **tranché** : recadrage centré sur le robot jusqu'aux images Flow 9:16.

## Historique
| Version | Date | Changement | Validé par |
|---|---|---|---|
| 0.1 | 2026-10-31 | Création | — |
| 1.0 | 2026-10-31 | Questions tranchées, passage en finalisé | shadowmartin281 |
