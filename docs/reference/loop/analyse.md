# Référence de structure : loopearplugs.com

> Relevé du 2026-10-28, sur ordinateur (1440 px) et sur mobile. Toutes les captures sont dans ce dossier.
> **Usage** : on reprend la **structure** et la **mécanique des CTA** à la lettre. Les textes, les photos et la direction artistique de Loop ne sont jamais copiés : chaque section est remodelée avec tes inspirations et ton approche artistique.
> **Destination** : cette analyse alimente `docs/03-app-flow.md` et `docs/04-ui-ux-brief.md` (R-001).

## Le principe à retenir

Chez Lumikréa, on vendait le rêve. Loop, lui, fait **acheter vite**. Trois mécaniques le permettent :

1. **Chaque section mène à un achat.** Aucun bloc n'est purement décoratif : toutes les sections ont un CTA, sauf les chiffres de réassurance. Ces chiffres, eux, sont placés juste avant une campagne qui en a un.
2. **Le bouton d'achat est visible sans défiler.** Sur la fiche produit, « Add to cart » est dans le premier écran sur ordinateur. Sur mobile, une barre d'achat collante apparaît dès qu'on fait défiler la page.
3. **Les CTA changent de forme d'une section à l'autre** : bouton plein, bouton contour, lien souligné, carte entière cliquable, flèche ronde, lien sous une vidéo, champ email. L'œil ne s'habitue jamais. Le bouton **plein et noir est réservé à l'achat** ; les formes plus légères servent à explorer.

## Les formes de CTA (catalogue)

| # | Forme | Où chez Loop | Rôle |
|---|---|---|---|
| C1 | Pilule pleine sombre, grande | « Add to cart » (cartes, fiche, accessoires), « Continue to Checkout » | **Acheter.** Réservée à l'achat. |
| C2 | Pilule contour | « Add to bundle », « Discover all earplugs », « Explore Eclipse » | Explorer, ajouter à un lot |
| C3 | Pilule blanche sur visuel sombre | Hero : « Find my match (1 min quiz) » | Entrée principale du hero : le quiz |
| C4 | Pilule à la couleur de la campagne | Hero : jaune (Eclipse), rose (Paris Hilton) | CTA propre à chaque diapositive |
| C5 | Lien souligné à côté du bouton | Hero : « Discover all earplugs » | Sortie secondaire, sans concurrencer C3 |
| C6 | Carte image entière + flèche ronde | « Un produit par usage » | Choisir par situation |
| C7 | Lien texte + flèche sous une vidéo | UGC : « Shop Loop Dream™ → » | Acheter le produit vu dans la vidéo |
| C8 | Ligne image + libellé + flèche | « Explore more Loop moments » | Pages par usage (SEO) |
| C9 | Pastilles de couleur | Cartes produits, fiche | Micro-engagement avant l'achat |
| C10 | Bouton « Click to try » | Fiche produit | Essayer : écouter l'effet du produit |
| C11 | Interrupteur d'option payante | « Personalize your Case (+€6) » | Augmenter le panier |
| C12 | Barre d'annonce cliquable, qui alterne | Haut de page : « Free shipping », « Save up to 20 % on Bundles » | Offre permanente |
| C13 | Champ email + bouton | Newsletter, footer (champ + flèche ronde) | Capter les indécis (réduction 1re commande) |
| C14 | Barre d'achat collante | Mobile, fiche produit | Acheter sans remonter la page |
| C15 | Fenêtre d'upsell après ajout | « Add to order – €19.95 » / « Skip & view cart » | Panier moyen |
| C16 | Tiroir panier : barre livraison offerte, suggestions « Add », « Continue to Checkout » | Après l'upsell | Conclure, vente croisée |
| C17 | Chat flottant | Toutes les pages | Lever un doute sans quitter la page |

## Accueil (ordre exact des sections)

| N° | Capture | Section | Structure | CTA | Pour Clair |
|---|---|---|---|---|---|
| 00 | `accueil-00-entete.png` | Barre d'annonce + en-tête | Bandeau noir fin (offre qui défile, pause) ; logo à gauche, 5 entrées au centre, pays, compte, panier avec pastille de quantité | C12, panier | Livraison offerte / garantie 2 ans ; nav : Nos robots · Comparer · M'aider à choisir · FAQ |
| 01 | `accueil-01-hero-diapo-1…4.png` | Hero carrousel (4 diapositives) | Grande carte arrondie plein cadre, texte à gauche, produit à droite, flèches rondes, compteur 01–04 avec pause. La diapo principale : étoiles + « aimé par N clients », promesse en 2 lignes, sous-titre, CTA quiz + lien « tout voir ». Les autres : une campagne = une couleur = un CTA. | C3, C5, C4 | Diapo 1 : promesse + quiz « Trouver mon robot (1 min) » ; diapos 2–4 : Q3, S2, O1, chacun avec son CTA d'achat |
| 02 | `accueil-02-exclusivites.png` | Grille de produits achetables | Titre ; 4 cartes : étiquette d'usage, visuel détouré, pastilles de couleur, nom, étoiles + nombre d'avis, prix, phrase courte, **2 boutons empilés** | C9, C1, C2 | Les 3 robots + 1 accessoire ou un lot ; « Ajouter au panier » direct depuis l'accueil |
| 03 | `accueil-03-science-produit.png` | Preuve technique | Fond gris ; titre + sous-titre ; 4 coches « chiffre + explication » ; produit animé à droite (vidéo) | C2 | Chiffres réels uniquement (aspiration, pulvérisation, capteurs), robot animé |
| 04 | `accueil-04-un-produit-par-usage.png` | Un produit par usage (carrousel) | Cartes photo verticales : étiquette « Best for… » ; titre usage + produit ; flèche ronde ; points de pagination | C6 | Fenêtres, baies vitrées, vérandas, douche, miroir → le robot conseillé |
| 05 | `accueil-05-chiffres.png` | Chiffres de réassurance | Bandeau gris, 3 colonnes séparées par des filets : chiffre + libellé | — | Livraison offerte · garantie 2 ans · 14 jours pour changer d'avis (vrais chiffres, pas d'avis inventés) |
| 06 | `accueil-06-campagne.png` | Campagne produit (carrousel de 3) | Moitié texte (sur-titre produit, titre en 2 phrases, paragraphe, bouton contour) / moitié vidéo | C2 | Le Q3 en vedette, puis S2, O1 |
| 07 | `accueil-07-fondateurs.png` | Histoire | Sur-titre à gauche ; titre ; photo ; sous-titre + paragraphe ; bouton plein « lire l'histoire » | C1 (sombre, petit) | Pourquoi Clair existe (facultatif ; à remplacer si pas d'histoire réelle) |
| 08 | `accueil-08-ugc-video.png` | Vidéos clients | Titre ; carrousel de vidéos verticales avec lecture, texte incrusté, lien « Acheter X → » dessous | C7 | Démos réelles des robots sur vitre ; chaque vidéo renvoie à sa fiche |
| 09 | `accueil-09-moments-seo.png` | Explorer par situation | Titre ; grille 3 × 2 de photos + libellé « Earplugs for … » + flèche | C8 | Pages SEO (R-008) : « Robot laveur de vitres pour baie vitrée », « … pour véranda », etc. |
| 10 | `accueil-10-recompense.png` | Récompense / presse | Moitié visuel du prix / moitié texte + bouton plein | C1 (petit) | Seulement avec une vraie récompense ou un vrai article ; sinon, retirer |
| 11 | `accueil-11-newsletter.png` | Newsletter avec avantage | Carte grise : titre, promesse (réduction 1re commande), champ email, bouton, mention légale ; visuel produit à droite | C13 | Réduction de bienvenue ou conseils d'entretien des vitres |
| 12 | `accueil-12-bandeau-marque.png` | Bandeau de marque géant | Slogan en capitales condensées, pleine largeur, fond sombre ; ligne newsletter dessous | C13 | Slogan Clair dans le style « Smart Spray » (déjà dans le moodboard) |
| 13 | `accueil-13-footer.png` | Pied de page | Logo ; 4 colonnes (boutique, service client, entreprise, mentions) ; choix du pays ; moyens de paiement ; réseaux | Liens | Boutique · Aide · Clair · Mentions ; logos de paiement Mepaye |

Version mobile : `mobile-accueil-complet.jpg`. Même ordre ; les grilles deviennent des carrousels à une carte et demie, le menu passe en tiroir.

## Fiche produit (Loop Switch 2)

| N° | Capture | Section | Structure | CTA | Pour Clair |
|---|---|---|---|---|---|
| 00 | `produit-00-premier-ecran.png` | Premier écran | Fil d'Ariane ; grand visuel à gauche ; à droite : nom, étoiles + nb d'avis, « Click to try », prix, couleurs, option payante, **quantité + Add to cart visibles sans défiler** | C10, C9, C11, C1 | Nom + note + « Voir en action » (vidéo 10 s) + prix + achat dans le 1er écran |
| 01 | `produit-01-achat-galerie.png` | Bloc d'achat complet | Galerie en grille 2 colonnes (photos, vidéos, porté, coffret) ; colonne droite collante : sous le bouton, 2 réassurances à icône (retours, livraison) ; pitch ; 3 coches + « Show more » ; mini UGC ; accordéons « Ce que vous recevez », « Livraison et retours » | C1 | Réassurances sous le bouton ; contenu du colis en accordéon (à confirmer, cf. README) |
| 02 | `produit-02-trois-modes.png` | Les modes du produit | Titre ; 3 photos même personne, 3 situations ; nom du mode + mesure + phrase | — | Modes du Q3 (N, Z, profondeur ×2) avec le tracé |
| 03 | `produit-03-accessoires.png` | Accessoires | Étoiles + preuve ; titre ; 3 cartes avec « Add to cart » | C1 | Lingettes microfibre, câble de sécurité, flacon |
| 04 | `produit-04-pourquoi.png` | Pourquoi ce produit | 3 photos d'usage + titre + phrase | — | 3 bénéfices |
| 05 | `produit-05-preuve-chiffre.png` | Réassurance | Titre chiffré ; 3 icônes : avis, garantie, retours | — | Même bandeau que l'accueil |
| 06 | `produit-06-ugc-fans.png` | Communauté | Titre + compte social ; 3 photos | — | Photos clients quand elles existeront |
| 07 | `produit-07-comparateur.png` | Comparateur | 2 menus déroulants, 2 cartes produit, lignes « Idéal pour », « Réutilisable »… | Choix | Comparer Q3 / S2 / O1 (tableau déjà présent sur `/robots`) |
| 08 | `produit-08-avis.png` | Avis | Note moyenne + histogramme ; recherche, filtres, sujets ; avis avec photo, date, « utile ? » ; pagination | — | Vrais avis seulement (les avis d'exemple sont à retirer) |
| 09 | `produit-09-faq.png` | FAQ produit | Accordéons ; « Show more » | — | FAQ par robot (déjà dans `products.ts`) |
| 10 | `produit-10-cta-final.png` | Relance finale | Bouton plein « Discover all earplugs → » | C1 | « Voir les 3 robots » |

## Après le clic sur « Ajouter au panier »

1. `produit-11-panier-apres-ajout.png` : un **tiroir à droite propose d'abord un accessoire** (« Keep your earplugs safe »). Le bouton plein ajoute l'accessoire avec son prix, un bouton contour permet de passer et de voir le panier.
2. `produit-12-tiroir-panier.png` : le **tiroir panier** affiche une barre « livraison offerte débloquée », la ligne produit avec quantité et corbeille, un carrousel « Vous aimerez aussi » avec des boutons « Add », la livraison, le sous-total et un grand bouton plein pour passer commande.
3. On ne change jamais de page avant le paiement.

## Mobile

- `mobile-produit-01-premier-ecran.png` : galerie en carrousel, « Tap to try » pleine largeur, nom, note, prix.
- `mobile-produit-02-defilement.png` : **barre « Add to cart » collante en bas de l'écran** dès qu'on a dépassé le bouton d'origine.

## Quiz « Help me choose »

`quiz-01-premier-ecran.png` : une question par écran, une barre de progression, des cartes photo cliquables (usage + phrase). Le quiz se termine sur un produit à acheter. Pour Clair : 3 à 4 questions (type de vitres, hauteur et accès, fréquence, budget) qui mènent au Q3, au S2 ou au O1.

## Écarts à décider avec toi

- **Histoire et récompense** (accueil 07 et 10) : à garder seulement si le contenu est vrai.
- **UGC et avis** : Loop s'appuie sur 14 millions de clients. Clair démarre : on remplace par des démos produit filmées et une garantie forte, sans chiffres inventés.
- **Lots (« Add to bundle »)** : utile seulement avec des accessoires ou plusieurs robots à combiner.
- **Pays et langue** : inutile tant qu'on ne vend qu'en France.

## Fichiers

- `_brut/` : captures pleine page d'origine (accueil et fiche produit, ordinateur), avant découpage.
- Les sections sont découpées à leurs vraies limites dans la page (positions relevées dans le DOM), à l'échelle 1,25.
