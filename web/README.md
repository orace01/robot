# Boutique de robots laveurs de vitres

Le site complet : pages, panier, tunnel de commande, paiement Mepaye, administration, liaison
CJ Dropshipping (prix, stock, délais, transmission automatique des commandes et suivi des colis).

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

Page **http://localhost:3000/admin/fournisseur** (administration, protégée par mot de passe) : prix d'achat, stock, transports et marge réelle de chaque robot au taux BCE du jour.

Les références CJ (produit, variante à prise européenne, entrepôt) sont dans `src/lib/products.ts`, champ `cj`.

## Paiement (Mepaye)

1. Le client clique sur « Payer » : la commande est enregistrée « En attente de paiement » et le client part sur la page de paiement sécurisée de Mepaye.
2. Mepaye prévient le site par un webhook signé (`/api/payments/notify`). Le site vérifie la signature, le montant et la devise, puis la commande passe « Payée ». Elle part alors toute seule chez CJ (voir plus bas). Mepaye n'a pas d'API pour lire l'état d'un paiement : seul le webhook fait foi.
3. De retour sur le site, le client voit sa confirmation dès que le paiement est reçu. S'il n'a pas payé, il peut reprendre le paiement. Le panier n'est vidé qu'une fois le paiement confirmé.

Réglages dans `web/.env.local` :

```
MEPAYE_API_KEY=mp_live_...       # mp_live_ : paiements réels ; mp_test_ : paiements de test
MEPAYE_WEBHOOK_SECRET=whsec_...  # secret du webhook, valeur complète (préfixe whsec_ compris)
```

Sans `MEPAYE_API_KEY`, le paiement reste simulé : la commande est marquée payée d'office.

Dans l'espace Mepaye :
- La boutique doit être réglée en **euros**. Sinon, Mepaye refuse le paiement et le client voit « Paiement momentanément indisponible ».
- **Clé** : page https://mepaye.com/app/developpeur (absente du menu), environnement Live. Créer une clé propre à ce site, car le lien de retour est réglé par clé :
  - nom affiché = la marque ;
  - « Lien de ton site » = `https://<adresse du site>/commande/confirmation`. Ce lien doit avoir exactement la même adresse (même origine) que le site, sinon le client ne retrouve pas sa commande au retour (elle est gardée dans son navigateur).
- **Webhook** : Développeur › Webhooks. Adresse : `https://<projet>.vercel.app/api/payments/notify`. Événements : « Paiement réussi (API) » et « Paiement échoué (API) ». Le secret affiché va dans `MEPAYE_WEBHOOK_SECRET` (Vercel).
- **Attention :** un webhook Mepaye ne se modifie pas, et le recréer change son secret. On garde donc l'adresse `vercel.app`, même après l'ajout d'un nom de domaine. Il ne faut **jamais rediriger** le domaine `vercel.app` dans Vercel : Mepaye ne suit pas les redirections.

Sécurité :
- Une clé de test n'ouvre jamais la vente réelle : un paiement de test ne déclenche jamais de vraie commande CJ.
- Un événement de test est ignoré avec une clé réelle, et inversement.
- Un webhook rejoué n'a aucun effet.
- Un montant différent de la commande, ou un deuxième paiement pour une commande déjà payée, est signalé dans l'historique de la commande, sans la valider.
- Les remboursements se font depuis l'espace Mepaye : l'API ne permet pas de rembourser.

### Vérification sans risque, une fois en ligne

```bash
MEPAYE_WEBHOOK_SECRET=whsec_... node scripts/verifier-webhook.mjs https://<projet>.vercel.app
```

- Une notification non signée doit recevoir **400**.
- Une notification signée, pour un paiement inexistant, doit recevoir **200 `{"received":true}`**, sans toucher aucune commande.

## Mise en ligne (Vercel)

1. Projet Vercel relié au dépôt GitHub, avec **Root Directory = `web`**.
2. Base de données : onglet Storage › Turso, reliée au projet avec le préfixe `DATABASE`. Ses variables (`DATABASE_TURSO_DATABASE_URL`, `DATABASE_TURSO_AUTH_TOKEN`) sont reconnues telles quelles. Les migrations s'appliquent toutes seules au premier accès.
3. Variables d'environnement (Settings › Environment Variables) : celles de `.env.local`, avec `CJ_ORDER_MODE=live`, la clé `MEPAYE_API_KEY=mp_live_…` et `MEPAYE_WEBHOOK_SECRET`. Ajouter `NEXT_PUBLIC_SITE_URL=https://<projet>.vercel.app`.
4. `vercel.json` lance `/api/cj/sync` une fois par jour : c'est le maximum du plan gratuit. Pour un suivi toutes les 15 minutes, il faut un service de tâches planifiées externe ou le plan Pro.

## Transmission automatique des commandes à CJ

Aucune intervention manuelle : chaque commande payée part toute seule chez CJ.

1. Juste après le paiement, la commande est passée chez CJ et **payée aussitôt sur le solde CJ**. Les articles sont regroupés par entrepôt : un panier S2 (Allemagne) + Q3 (Chine) donne deux commandes CJ. Le transporteur est le moins cher accepté par CJ (ou le plus rapide en express). La commande du client passe « En préparation ».
2. Une tâche planifiée relit l'état des commandes chez CJ. Elle reporte le numéro de suivi, puis « Expédiée » et « Livrée ». Le client voit tout sur `/suivi`, avec un lien de suivi du colis.
3. Si l'envoi échoue (CJ injoignable…), il est retenté automatiquement. CJ refuse deux commandes du même numéro : un nouvel essai reprend la commande déjà créée, sans doublon.

À chaque commande, l'administration montre une carte « Fournisseur CJ » : état, numéro CJ, transporteur, montant facturé, suivi et erreurs éventuelles. Elle propose aussi les boutons « Transmettre à CJ » et « Actualiser depuis CJ ». La marge est calculée sur le montant réellement facturé par CJ.

Réglages dans `web/.env.local` :

```
CJ_ORDER_MODE=sandbox   # sandbox (commandes de test CJ), live (vraies commandes) ou off
CRON_SECRET=...         # secret de la tâche planifiée
CJ_IOSS_TYPE=3          # facultatif : TVA à l'import hors UE, 3 = IOSS de CJ (par défaut)
```

- **sandbox** (par défaut) : commandes de test chez CJ, sans envoi ni débit. Les numéros sont préfixés `TEST-`.
- **live** : vraies commandes. Ce mode reste bloqué tant que les paiements ne sont pas réels (clé Mepaye `mp_live_`). Une commande au paiement simulé ou de test ne devient jamais une vraie commande CJ.
- Avant de passer en **live** : recharger le solde CJ (Wallet), qui est affiché sur la page Fournisseur. Une commande que CJ n'a pas pu payer est signalée en rouge. Une fois payée dans l'espace CJ, la suite reprend toute seule.

Tâche planifiée, à appeler toutes les 15 à 30 minutes :

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<domaine>/api/cj/sync
```

Sur Vercel, une tâche « cron » envoie cet en-tête toute seule. La consultation du suivi par un client déclenche aussi une mise à jour, si la dernière date de plus de 30 minutes.

## Commandes et administration

Les commandes sont enregistrées dans une base SQLite locale (`web/data/boutique.db`, créée automatiquement au premier lancement, jamais versionnée). Le serveur revérifie tout ce qui vient du navigateur : prix, stock, mode de livraison et champs du formulaire.

Administration : **http://localhost:3000/admin**. Le mot de passe se trouve dans `web/.env.local`, variable `ADMIN_PASSWORD`, et tu peux le changer quand tu veux. Elle comprend :
- la liste des commandes, avec filtres par statut et recherche ;
- la fiche de chaque commande : client, articles, commandes CJ, marge, changement de statut, numéro de suivi et notes internes ;
- la page fournisseur CJ : solde, mode de transmission, coûts et marges par robot.

Statuts possibles, dans l'ordre :
- En attente de paiement
- Payée
- En préparation
- Expédiée
- Livrée

Les statuts avancent tout seuls avec CJ, et restent modifiables à la main. Une commande peut aussi être annulée ou remboursée : dans ce cas, annuler aussi la commande dans l'espace CJ. Le client suit sa commande sur `/suivi`, avec son numéro de commande et son e-mail.

Base de données :
- `npm run db:studio` : explorer la base dans le navigateur ;
- `npm run db:generate` : créer une migration après une modification de `src/db/schema.ts`. Les migrations s'appliquent toutes seules au démarrage.
- En production : base libSQL hébergée (Turso), via `DATABASE_URL` et `DATABASE_AUTH_TOKEN`.

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
- `/panier` · `/commande` · `/commande/confirmation` (attend la confirmation du paiement)
- `/suivi` suivi de commande
- `/admin` administration (commandes, fournisseur) · `/api/cj/sync` tâche planifiée CJ · `/api/payments/notify` webhook de paiement
- `/faq` · `/contact` · `/livraison-retours`
- `/mentions-legales` · `/cgv` · `/confidentialite` (modèles à compléter)

## À confirmer avant la mise en ligne

- Les prix de vente (provisoires) et les délais de livraison réels proposés par CJ.
- Le solde CJ à recharger, puis `CJ_ORDER_MODE=live` une fois la clé Mepaye `mp_live_` en place.
- Auprès de Mepaye : la vente d'objets physiques, les cartes françaises en euros, et le retour du client sur le site après paiement.
- La TVA : CJ prélève une TVA d'import (IOSS) sur les envois de Chine, à articuler avec la TVA des ventes (comptable).
- Les caractéristiques marquées « À confirmer » (S2 et O1 surtout) et le type de prise (prise européenne).
- Le contenu des colis du S2 et du O1.
- Des photos de meilleure qualité pour le O1.
- Les informations légales de l'entreprise dans les pages légales.
- Les avis : ceux affichés sont des exemples, à remplacer par de vrais avis clients.
