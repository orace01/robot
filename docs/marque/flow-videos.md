# Google Flow — vidéos du site Klair

Toutes les vidéos se font dans Google Flow (labs.google/flow), à partir des vraies photos détourées des robots, toujours données comme image de départ. On ne garde aucune pièce ni aucun détail inventé (P-010).

Réglages communs :
- 16:9 en 1920 × 1080 au minimum, plus une version 9:16 pour le mobile ;
- 6 à 8 s ;
- caméra lente ;
- aucun texte ni logo dans l'image.

---

## 1. Hero : une vidéo de scène par robot

Le hero affiche une scène plein écran par robot, le robot au centre, et le nom en bas à gauche. La vidéo remplace la photo floue actuelle (800 px). Le robot doit rester **centré et lisible**, avec de l'espace en bas pour le titre.

| Robot | Image de départ | Lieu |
|---|---|---|
| Q3 | `web/public/produits/q3/face.webp` | grande baie vitrée d'un appartement en étage, vue sur la ville au coucher du soleil |
| S2 | `web/public/produits/s2/face.webp` | véranda lumineuse avec des plantes, lumière du matin |
| O1 | `web/public/produits/o1/face.webp` | fenêtre de maison, jardin derrière, lumière douce d'après-midi |

**Prompt type** (en anglais pour Flow ; changer le lieu selon le robot) :
```
Ultra-realistic cinematic shot. The window-cleaning robot from the reference image is attached to a large
floor-to-ceiling window of a modern apartment, city skyline at golden hour behind the glass. The robot glides
slowly and smoothly across the glass, leaving a clean streak-free path; fine mist from its spray nozzle catches
the light. Camera static, centered on the robot, shallow depth of field, soft reflections on the glass.
Keep the lower third of the frame calm and darker (space for a title). Photorealistic, premium product film,
natural colors, no text, no logo, 8 seconds, seamless loop.
```

**Contraintes**
- La vidéo doit boucler sans à-coup : même position du robot au début et à la fin.
- Le tiers bas reste sombre et calme, pour que le titre « KLAIR Q3 » reste lisible.
- Le robot doit correspondre exactement au vrai : même forme, même couleur et mêmes boutons que la photo.

---

## 2. Vue éclatée du Q3 (section « Tout tient en 6,8 cm »)

Aujourd'hui, la section découpe la photo du Q3 en trois tranches. La vidéo la remplacera, lue image par image au rythme du défilement.

- **Fond** : noir bleuté uni `#07090C`.
- **Caméra** : fixe, de face, légèrement en plongée (15°).
- **Image de départ** : `web/public/produits/q3/face.webp`.

```
Ultra-realistic product animation of a square white window-cleaning robot (reference image), floating
centered on a plain deep blue-black background (#07090C). Studio lighting, soft rim light, subtle reflections.
The robot slowly separates vertically into three clean layers, like a premium exploded view:
top layer = white shell with the spray nozzles and water tank; middle layer = brushless motor and
metal suction turbine; bottom layer = rubber tracks and microfiber cleaning pads. Layers drift apart
smoothly and evenly, hold for a moment, then reassemble perfectly. Static camera, front view, slight
15-degree high angle. No text, no logo, no background objects, no camera shake. 8 seconds, cinematic,
photorealistic materials, 4K detail.
```
Variante, comme la vidéo de référence : ajouter *« Once reassembled, the robot slowly rotates 180° to reveal its back side with the tracks and pads. »*

---

## 3. Plans multi-angles, façon présentation de l'iPhone

C'est l'esprit des films produit d'Apple : la caméra glisse au ras du produit et découvre ses bords, ses matières et ses détails, un plan après l'autre, sur un fond sombre et uni. Chaque plan dure 3 à 5 s. Il sert à la fois au hero, aux fiches produit et aux publicités.

**Base commune à ajouter à chaque prompt** :
*« Ultra-realistic premium product film, the window-cleaning robot from the reference image, isolated on a seamless dark graphite background, controlled studio lighting with soft rim light and gradient reflections, very slow motion-control camera, shallow depth of field, photorealistic materials, no text, no logo. »*

| # | Plan | Mouvement de caméra (à mettre dans le prompt) | Ce qu'on montre |
|---|---|---|---|
| 1 | Silhouette | « Starts in near darkness; a thin rim light slowly sweeps across the edge and reveals the robot's outline. » | L'apparition, l'ouverture du film |
| 2 | Le long du bord | « Macro camera glides along the full length of the robot's side edge, very close, shallow focus rolling along the surface. » | La finesse (6,8 cm pour le Q3) et la qualité de la coque |
| 3 | Orbite lente | « Camera orbits 90° around the robot at eye level, slow and constant. » | Les volumes, de face puis de trois quarts |
| 4 | Dessus vers dessous | « Camera tilts from the top face down to the underside, revealing the tracks and microfiber pads. » | Les chenilles ou patins, la face cachée |
| 5 | Détail de la buse | « Extreme macro on the spray nozzle; a fine mist bursts out and catches the light, rack focus from nozzle to mist. » | La pulvérisation ultrasonique |
| 6 | Mise au point qui glisse | « Rack focus from the front buttons to the back edge, light gradient moving across the shell. » | Les commandes et la finition |
| 7 | Retour sur la vitre | « Wide shot: the robot attached to a large window, glides across the glass leaving a perfectly clean path, city lights behind. » | La preuve d'usage, le plan final |

**Montage conseillé (pub ou hero de 15 à 20 s)** : 1, 2, 3, 5, 4, puis 7.
- Les plans s'enchaînent en fondu au noir ou par raccord de mouvement.
- Aucun plan n'est répété.
- Pour une publicité, les règles R-005 s'appliquent : coupes de 1,2 à 1,4 s, et aucun plan réutilisé.

À faire pour chaque robot (Q3, S2, O1), en partant de sa vraie photo détourée. Les angles qu'on ne connaît pas encore, comme le dessous du O1, attendent une photo de référence : sans elle, Flow inventerait.

---

## Après la génération
1. Choisir les meilleures prises, fidèles aux vrais robots.
2. Les déposer dans `web/public/produits/<robot>/` :
   - `hero.mp4` et `hero-mobile.mp4` pour le hero ;
   - `eclate.mp4` pour la vue éclatée.
3. Ensuite, côté code :
   - réencodage en WebM et en MP4 légers ;
   - une image clé à chaque image pour la vue éclatée ;
   - image d'attente tirée de la première image ;
   - branchement dans le hero et dans la section.
