# Boutique de robots laveurs de vitres (front-end)

Maquette fonctionnelle du site : toutes les pages, le panier et le tunnel de commande.
Le paiement et la liaison CJ Dropshipping ne sont pas encore branchés (étapes suivantes).

## Lancer le site

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

Next.js 16 · React 19 · Tailwind CSS 4 · Motion (animations) · Lucide (icônes).

## Connexion à CJ Dropshipping

Le site lit chez CJ, côté serveur uniquement :
- le prix d'achat de chaque robot ;
- son stock ;
- les transports possibles vers la France.

Il en déduit les délais affichés aux clients (préparation + transport) et l'option express. Les données sont gardées en cache une heure. Si CJ ne répond pas, le site affiche des délais par défaut et réessaie quelques minutes plus tard.

Fichier `web/.env.local`, jamais versionné :

```
CJ_API_KEY=...        # clé API de l'espace CJ
CJ_ACCESS_TOKEN=...   # jeton d'accès (180 jours), évite de le redemander à chaque démarrage
```

CJ limite fortement la demande de jeton, et le jeton dure 180 jours. En production, renseigner `CJ_ACCESS_TOKEN` et le renouveler avant son expiration.

Page interne **http://localhost:3000/admin/fournisseur** (en développement seulement) : prix d'achat, stock, transports et marge réelle de chaque robot au taux BCE du jour.

Les références CJ (produit, variante à prise européenne, entrepôt) sont dans `src/lib/products.ts`, champ `cj`.

## Où modifier quoi

| Pour changer…                                 | Fichier                  |
| --------------------------------------------- | ------------------------ |
| Le nom de la boutique, l'e-mail, les délais   | `src/lib/site.ts`        |
| Les tarifs de livraison                        | `src/lib/site.ts`        |
| Les robots : prix, textes, caractéristiques   | `src/lib/products.ts`    |
| La FAQ, les avis d'exemple                     | `src/lib/content.ts`     |
| Les couleurs et les polices                    | `src/app/globals.css`    |

Dans `src/lib/site.ts`, `mockup: true` affiche les repères de maquette (« prix provisoire »,
« avis d'exemple », référence CJ…). À passer à `false` avant la mise en ligne.

## Pages

- `/` accueil · `/robots` catalogue et comparatif · `/robots/o1`, `/robots/s2`, `/robots/q3` fiches produit
- `/panier` · `/commande` · `/commande/confirmation` (paiement simulé)
- `/suivi` suivi de commande (démonstration)
- `/faq` · `/contact` · `/livraison-retours`
- `/mentions-legales` · `/cgv` · `/confidentialite` (modèles à compléter)

## À confirmer avant la mise en ligne

- Les prix de vente (provisoires) et les délais de livraison réels proposés par CJ.
- Les caractéristiques marquées « À confirmer » (S2 et O1 surtout) et le type de prise (prise européenne).
- Le contenu des colis du S2 et du O1.
- Des photos de meilleure qualité pour le O1.
- Les informations légales de l'entreprise dans les pages légales.
- Les avis : ceux affichés sont des exemples, à remplacer par de vrais avis clients.
