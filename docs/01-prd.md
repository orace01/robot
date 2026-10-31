---
document: "PRD — exigences produit"
statut: finalisé        # brouillon | finalisé — seul l'utilisateur valide le passage à « finalisé » (R-001)
version: 1.0
date: 2026-10-31
valide_par: "shadowmartin281 (« Oui, tout validé », 2026-10-31)"
---

# 01 — PRD : exigences produit

> Rétro-documentation : la boutique existe déjà dans `web/` (catalogue, panier, paiement Mepaye, transmission CJ, administration). Ce PRD fixe ce qui est en place **et** la refonte en cours : nouveau hero fluide, défilement Lenis, marque Clair (duo typographique After + Satoshi).

## Le produit en une phrase
- **Nom** : Clair — boutique en ligne de robots laveurs de vitres (Q3, S2, O1).
- **Problème résolu** : laver les vitres hautes, les baies vitrées et l'extérieur des fenêtres est pénible et parfois dangereux ; Clair vend un robot qui le fait seul, livré en France sans stock à gérer (dropshipping CJ).

## Utilisateurs cibles
| Profil | Besoin principal | Contexte d'usage |
|---|---|---|
| Propriétaire de maison avec baies vitrées ou véranda | Des vitres nettes sans escabeau ni corvée | Week-end, grandes surfaces vitrées |
| Habitant d'appartement en étage | Nettoyer l'extérieur des fenêtres sans se pencher | Fenêtres inaccessibles de l'extérieur |
| Personne âgée ou à mobilité réduite (et ses proches qui offrent) | Éviter les gestes risqués | Achat cadeau, autonomie |
| Administrateur de la boutique (le fondateur) | Suivre les commandes, les marges et le fournisseur sans intervention manuelle | Back-office, quelques minutes par jour |

## Problème et solution actuelle
- **Ce qui fait mal aujourd'hui** : escabeau, raclette, traces, vitres extérieures inaccessibles, risque de chute ; les robots vendus en ligne sont présentés sur des fiches marketplace peu crédibles.
- **Ce que les utilisateurs font à la place** : lavage à la main, perche télescopique, laveur de vitres professionnel (coûteux et récurrent), robots génériques sur Amazon/AliExpress sans service en français.

## Objectif et mesure du succès
- **Résultat visé** : une marque e-commerce premium et crédible qui convertit, avec une chaîne commande → paiement → fournisseur → suivi entièrement automatique.
- **Indicateurs mesurables** :
  - taux de conversion visite → commande payée ≥ 1,5 % sur les 3 premiers mois (hypothèse à valider avec la mesure d'audience) ;
  - 100 % des commandes payées transmises à CJ sans action manuelle ;
  - clic sur un CTA d'achat depuis le hero ≥ 8 % des visites de l'accueil (hypothèse).

## Fonctionnalités principales
| ID | Fonctionnalité | Bénéfice pour l'utilisateur | Priorité |
|---|---|---|---|
| F1 | **Hero fluide de l'accueil** : une scène plein écran par robot, robot au centre, nom géant en bas à gauche, défilement automatique avec fondu, CTA d'achat direct (référence : vidéo Instagram DfCYVufB3Xl, « Flux Theory ») | Comprendre en 3 secondes ce qu'est chaque robot et l'acheter sans chercher | P1 |
| F2 | Catalogue `/robots` et comparatif des 3 robots | Choisir le bon modèle | P1 |
| F3 | Fiches produit `/robots/[slug]` (galerie, caractéristiques, avis, délai de livraison) | Être rassuré avant d'acheter | P1 |
| F4 | Panier (tiroir + page) | Ajuster sa commande | P1 |
| F5 | Tunnel de commande + paiement Mepaye (webhook signé) | Payer en confiance | P1 |
| F6 | Transmission automatique à CJ, suivi colis `/suivi` | Recevoir et suivre son colis | P1 |
| F7 | Administration `/admin` : commandes, statuts, fournisseur, marges | Gérer la boutique en quelques minutes | P1 |
| F8 | Défilement fluide **Lenis** sur toutes les pages (R-010) | Sensation premium, cohérente avec la marque | P1 |
| F9 | CTA d'achat sous plusieurs formes (hero, cartes, barre fixe mobile, fin de page) | Pouvoir acheter à tout moment | P2 |
| F10 | SEO de base (R-008) : sitemap, robots.txt, title/description uniques, Open Graph | Être trouvé sur Google | P1 avant mise en ligne |
| F11 | Grands écrans 4K et Mac (R-009) | Rendu soigné sur tous les écrans | P2 |
| F12 | Pages d'information : FAQ, contact, livraison-retours, pages légales | Confiance et conformité | P1 |
| F13 | Visuels et vidéos produit ultra-réalistes (Google Flow), multi-angles | Image de marque forte | P2 (contenu, hors code) |

## Hors périmètre de la version 1
- Comptes clients (connexion, historique) : le suivi se fait par numéro de commande + e-mail.
- Multi-langue et multi-devise (français et euros uniquement).
- Livraison hors France métropolitaine.
- Abonnements, accessoires et consommables vendus à part.
- Avis clients déposés en ligne (les avis affichés sont des exemples à remplacer).
- Remboursements depuis le site (faits dans l'espace Mepaye).

## User stories
| ID | En tant que… | je veux… | pour… | Fonctionnalité |
|---|---|---|---|---|
| US1 | visiteur | voir chaque robot dans une scène réaliste dès l'arrivée | comprendre le produit sans lire | F1 |
| US2 | visiteur | choisir un robot dans le hero et l'ajouter au panier | acheter sans détour | F1, F4 |
| US3 | visiteur | comparer les trois robots | choisir celui qui convient à mes vitres | F2 |
| US4 | visiteur | consulter une fiche produit complète avec délai de livraison | être rassuré | F3 |
| US5 | client | payer par carte sur une page sécurisée et voir ma confirmation | finaliser mon achat | F5 |
| US6 | client | suivre mon colis avec mon numéro de commande et mon e-mail | savoir quand il arrive | F6 |
| US7 | administrateur | voir chaque commande, son état chez CJ et ma marge | piloter sans saisie manuelle | F7 |
| US8 | visiteur | faire défiler la page en douceur à la molette | une navigation agréable | F8 |
| US9 | visiteur sur mobile | garder un bouton d'achat à portée de pouce | acheter quand je suis convaincu | F9 |

## Critères d'acceptation
| User story | Étant donné… | Quand… | Alors (résultat visible)… |
|---|---|---|---|
| US1 | l'accueil chargé | j'attends sans toucher | les robots Q3, S2, O1 se succèdent toutes les ~6 s avec un fondu, chacun dans sa scène, son nom géant en bas à gauche ; l'animation s'arrête si `prefers-reduced-motion` |
| US1 | un écran de 375 px à 3840 px | j'ouvre l'accueil | le hero occupe la hauteur de l'écran, sans défilement horizontal, robot et titre lisibles |
| US2 | le hero affiche le S2 | je clique « Ajouter au panier » | le tiroir panier s'ouvre avec 1 × S2 au prix de `lib/products.ts` ; le défilement automatique s'arrête |
| US2 | un robot en rupture chez CJ | le hero l'affiche | le CTA indique « Indisponible » et n'ajoute rien |
| US3 | la page `/robots` | je la consulte | les 3 robots et le tableau comparatif s'affichent avec leurs prix |
| US4 | une fiche produit | elle se charge | galerie, caractéristiques (« À confirmer » si inconnues) et délai estimé s'affichent ; si CJ ne répond pas, un délai par défaut s'affiche |
| US5 | un panier valide | je paie | la commande passe « Payée » à réception du webhook signé et la page de confirmation l'affiche ; sinon je peux reprendre le paiement |
| US6 | une commande expédiée | je saisis numéro + e-mail sur `/suivi` | je vois le statut, le transporteur et le lien de suivi ; un couple faux renvoie un message générique |
| US7 | une commande payée | j'ouvre sa fiche admin | je vois la carte « Fournisseur CJ » (état, numéro, montant facturé, marge) |
| US8 | un ordinateur avec molette | je fais défiler | le défilement est progressif ; aucune animation n'est faite avec `prefers-reduced-motion` ; le tiroir panier ouvert bloque le défilement de la page |
| US9 | un téléphone | je fais défiler l'accueil après le hero | une barre fixe avec le robot choisi, son prix et « Acheter » reste visible |

## Questions tranchées
> Toutes tranchées par l’utilisateur le 2026-10-31.
- Prix définitifs des robots → **tranché** : garder 269 / 229 / 170 € jusqu'aux premiers retours.
- Ordre des robots dans le hero → **tranché** : Q3, S2, O1, du plus premium au plus accessible.
- Scènes du hero pour S2 et O1 en attendant les images Google Flow → **tranché** : réutiliser les scènes existantes de Q3, puis remplacer.
- Indicateurs de succès : seuils à confirmer → **tranché** : ceux ci-dessus, revus après un mois.

## Historique
| Version | Date | Changement | Validé par |
|---|---|---|---|
| 0.1 | 2026-10-31 | Création (rétro-documentation + hero fluide + Lenis) | — |
| 1.0 | 2026-10-31 | Questions tranchées, passage en finalisé | shadowmartin281 |
