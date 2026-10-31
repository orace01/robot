# Prompt de reprise — session cloud (projet Klair)

À coller tel quel au début de la session cloud.

```text
Tu reprends le projet « Klair » (boutique en ligne de 3 robots laveurs de vitres : Q3 269 €, S2 229 €, O1 170 €) là où la session locale s'est arrêtée (limite hebdomadaire). Réponds en français, de façon concise.

CADRE : respecte la banque vibe-brain (dépôt GitHub privé github.com/Fabrice210/vibe-brain, à cloner si besoin) : templates/CLAUDE.md §0-§6, règles validées R-001 à R-011 dans regles-validees.md. Avant toute modification : un VIBE-CHECK enregistré dans .vibe/checks/. Sécurité SEC-1 à SEC-9 : aucun secret dans le code ni dans le chat.

DÉPÔTS
- Site : github.com/orace01/robot, branche `clair-with-branding` (à jour avec main). Next.js 16 dans web/ (lire node_modules/next/dist/docs/ avant de coder, cf. web/AGENTS.md). Les six documents de cadrage sont finalisés (docs/01-prd.md à 06-implementation-plan.md) : R-001 est levée.
- Point de reprise détaillé : docs/passation.html (journal 01 à 13) et docs/marque/storyboards-9x16.md.

ÉTAT
- Fait et commité : hero fluide React (web/src/components/home/hero-stage.tsx), Lenis (R-010), polices Satoshi + Cabinet Grotesk (After Display à acheter), section gamme « Trois robots » (scène au survol), vue éclatée du Q3 au scroll, brief Flow (docs/marque/flow-videos.md).
- Vidéos (Google Flow, compte Pro de l'utilisateur) : hero Q3 en 4 angles 9:16 VALIDÉ (« parfait ») : docs/marque/flow-rendus/hero-q3-4-angles-9x16.mp4 (plan large, rapproché, gros plan, détail brume ; 8,7 s).
- EN COURS : sa version 16:9 IDENTIQUE par outpainting avec Seedance 2.0 Mini dans CapCut (méthode Lumikréa). Pack prêt : docs/marque/seedance-hero-q3/ (4 références de mouvement 9:16, premières/dernières images, PROMPT-seedance.md). Il reste à créer les premières/dernières images en 16:9 (Flow → modifier l'image → format 16:9), lancer Seedance plan par plan, retirer le filigrane (delogo x=14 y=12 w=38 h=36 en 1280×720), vérifier que le robot est identique, monter les 4 plans (8,7 s).

RÈGLES DE L'UTILISATEUR À NE PAS OUBLIER
- « Étendre » une image ou une vidéo = OUTPAINTING (bords inventés cohérents), JAMAIS des bords flous.
- Vidéos : 9:16 d'abord, 16:9 identique ; aucun plan répété ; varier les angles (large → rapproché → gros plan → détail) ; aucune pièce du robot inventée (pas de flanc ni de dos sans photo).
- Boutons : tous issus de la bibliothèque Uiverse (R-011), notice MIT gardée.
- Flow : Veo 3.1 Quality = 100 crédits, Fast = 20, Omni Flash = 12, images Nano Banana gratuites. Flow ne fait pas d'outpainting vidéo (il régénère).

PROCHAINES ÉTAPES
1. Terminer la 16:9 identique du hero Q3 (Seedance), puis brancher les deux vidéos dans le hero (9:16 sur mobile, 16:9 sur ordinateur).
2. Même méthode pour S2 et O1 (images clés déjà faites dans Flow), puis vue éclatée et plans multi-angles.
3. Boutons du site → modèles Uiverse (R-011).
4. SEO R-008 (sitemap, robots, metadata), puis push de la branche et mise à jour de docs/passation.html.

Commence par lire docs/passation.html et docs/marque/seedance-hero-q3/PROMPT-seedance.md, puis dis-moi en 3 lignes où on en est avant d'agir.
```

## Avant de lancer la session cloud
- La branche `clair-with-branding` doit être poussée sur GitHub (elle ne l'est pas encore) : une session cloud part du code en ligne.
- Les vidéos et images de `docs/marque/` ne sont pas versionnées : les ajouter au commit (ou les déposer ailleurs) si la session cloud doit les voir.
