---
document: "Revue de cohérence des six documents"
date: 2026-10-31
statut: finalisé
---

# Revue de cohérence — docs 01 à 06 (v0.1)

> Revue faite par l'agent rédacteur, le 31 octobre 2026. P-035 recommande une seconde revue **dans une session neuve** avant la finalisation : à faire si l'utilisateur le souhaite.

## Contrôles
| Contrôle | Résultat |
|---|---|
| Chaque fonctionnalité P1 du PRD a au moins une user story et un critère d'acceptation | OK. F1 → US1, US2 ; F4 → US2 ; F5 → US5 ; F6 → US6 ; F7 → US7 ; F8 → US8. F2, F3 → US3, US4. F10 (SEO) et F12 (pages d'information) n'ont pas de user story : ils sont couverts par T9 et par les pages existantes. |
| Chaque user story a un écran dans l'App Flow | OK (US1 à US9) |
| Chaque écran a des notes dans le brief UI/UX | OK (accueil, catalogue, fiche, tunnel, suivi, admin) |
| Les services du TRD ont leurs variables d'environnement, sans valeur | OK (SEC-1) |
| Le schéma backend couvre les données des parcours | OK. Hero et Lenis : aucune donnée nouvelle. Disponibilité lue chez CJ, non stockée. |
| Les droits d'accès du doc 05 correspondent au TRD (admin seul, client par numéro + e-mail) | OK |
| Le plan 06 couvre F1, F8, F9 (T1 à T5), F10 (T9), F11 (étape 5) | OK |
| Lenis (R-010) est décrit de façon identique dans le PRD (F8, US8), le TRD, l'App Flow (navigation, tiroir) et le plan (T1) | OK |
| Hero : même description dans le PRD, l'App Flow, le brief et le plan (scène, robot centré, nom en bas à gauche, fondu ~6 s / 0,9 s) | OK |
| Contradictions | Aucune. Point d'attention : le brief propose des boutons provisoires (rectangle 10 px) en attendant les captures de l'utilisateur. Ce n'est pas une contradiction, mais une décision à confirmer. |

## Questions ouvertes regroupées, à trancher par l'utilisateur
1. Prix (PRD) : 269 / 229 / 170 € conservés ?
2. Ordre du hero (PRD) : Q3, S2, O1 ?
3. Scènes provisoires pour S2 et O1 (PRD) : réutiliser celles de Q3 ?
4. Seuils de succès (PRD) : 1,5 % de conversion et 8 % de clics sur un CTA du hero ?
5. Région (TRD) : Francfort ?
6. After Display (TRD) : Cabinet Grotesk en attendant le fichier sous licence ?
7. Mesure d'audience (TRD) : Vercel Web Analytics, sans cookie ?
8. CTA principal du hero (App Flow) : « Ajouter au panier », plus le lien « Découvrir » ?
9. Boutons (brief) : rectangle 10 px provisoire ?
10. Hero mobile (brief) : recadrage de la scène 16:9 ?
11. Conservation des données (doc 05) : 10 ans pour les commandes payées, 90 jours pour celles qui ne l'ont jamais été ?
12. Session admin (doc 05) : 7 jours ?
13. Ordre après le hero (plan) : boutons (T7) dès réception des captures, sinon SEO (T9) d'abord ?

Une fois ces points tranchés, les six documents passent en `statut: finalisé`, avec ton nom dans `valide_par`, et le code peut commencer (R-001).
