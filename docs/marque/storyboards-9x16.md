# Storyboards des vidéos 9:16 — Klair (Google Flow)

Chaque vidéo part de la **vraie photo détourée** du robot, donnée à Flow comme image de départ (P-010 : aucune pièce inventée). Tout est tourné en 9:16 en premier, sans texte ni logo dans l'image : le texte est ajouté par le site ou au montage. Chaque prise dure 8 s.

| # | Vidéo | Usage | Image de départ |
|---|---|---|---|
| V1 | Hero du Q3 | Hero mobile, pub | `q3/face.webp` |
| V2 | Hero du S2 | Hero mobile, pub | `s2/face.webp` |
| V3 | Hero du O1 | Hero mobile, pub | `o1/face.webp` |
| V4 | Vue éclatée du Q3 | Section « Tout tient en 6,8 cm » (mobile) | `q3/face.webp` |
| V5 | Film multi-angles du Q3 (6 plans) | Fiche produit, pub, montage du hero | `q3/face.webp` |

---

## V1 — Hero du Q3 · « La baie au coucher du soleil »
| Temps | Image | Caméra | Lumière et son |
|---|---|---|---|
| 0–2 s | Le Q3, plaqué contre une grande baie vitrée en étage. Derrière la vitre, la ville au coucher du soleil, floue. Le robot est au centre, dans le tiers haut. | Fixe, frontale | Contre-jour doré, reflets doux sur le verre |
| 2–6 s | Le robot glisse lentement vers le bas et laisse une bande de verre parfaitement nette. Une fine brume sort de sa buse et accroche la lumière. | Fixe, très léger travelling avant | La brume scintille |
| 6–8 s | Il remonte à sa position de départ, pour que la vidéo boucle. | Fixe | — |

**Contraintes**
- Le tiers bas reste sombre et calme : c'est là que va le titre « KLAIR Q3 ».
- Le robot garde exactement la forme de la photo.

**Prompt Flow**
```
Vertical 9:16 ultra-realistic cinematic product shot. The exact square white window-cleaning robot from the
reference image is attached to a large floor-to-ceiling window of a high-rise apartment; behind the glass a
blurred city skyline at golden hour. The robot sits centered in the upper third and glides slowly down the
glass, leaving a perfectly clean streak-free path; a fine mist from its front nozzle catches the warm light,
then it returns to its starting position (seamless loop). Static camera, very subtle push-in, shallow depth
of field, soft reflections on the glass. Lower third of the frame stays dark and calm. Photorealistic,
premium product film, no text, no logo, no people.
```

## V2 — Hero du S2 · « La véranda au matin »
| Temps | Image | Caméra |
|---|---|---|
| 0–2 s | Le S2 sur la vitre d'une véranda lumineuse, avec des plantes vertes floues derrière. | Fixe, frontale |
| 2–6 s | Il avance en Z, ses deux disques en microfibre essuient la vitre, les gouttes disparaissent. | Fixe |
| 6–8 s | Retour à la position de départ, pour la boucle. | Fixe |

**Prompt Flow**
```
Vertical 9:16 ultra-realistic cinematic product shot. The exact white oval window-cleaning robot from the
reference image, with its two round microfiber pads, is attached to the glass of a bright conservatory with
blurred green plants behind; soft morning light. The robot moves slowly in a gentle Z path, wiping away water
droplets and leaving crystal-clear glass, then returns to its starting position (seamless loop). Robot centered
in the upper third, static camera, shallow depth of field, lower third calm and slightly darker.
Photorealistic, premium product film, no text, no logo, no people.
```

## V3 — Hero du O1 · « La fenêtre sur le jardin »
| Temps | Image | Caméra |
|---|---|---|
| 0–2 s | Le O1 sur la fenêtre d'une maison, avec un jardin flou derrière. | Fixe |
| 2–6 s | Il longe la vitre de bord en bord. Une lumière douce d'après-midi traverse le verre propre. | Fixe |
| 6–8 s | Retour, pour la boucle. | Fixe |

**Prompt Flow**
```
Vertical 9:16 ultra-realistic cinematic product shot. The exact white rounded window-cleaning robot from the
reference image is attached to a house window; behind the glass a softly blurred garden in warm afternoon
light. The robot glides slowly from edge to edge leaving perfectly clean glass, then returns to its starting
position (seamless loop). Robot centered in the upper third, static camera, shallow depth of field, lower third
calm and slightly darker. Photorealistic, premium product film, no text, no logo, no people.
```

## V4 — Vue éclatée du Q3
| Temps | Image |
|---|---|
| 0–2 s | Le Q3 entier, de face, qui flotte sur un fond noir bleuté uni (`#07090C`). Un liseré de lumière sur les bords. |
| 2–5 s | Il s'ouvre en trois couches : la coque blanche avec la buse et le réservoir en haut, le moteur et la turbine métallique au milieu, les chenilles et les patins en microfibre en bas. |
| 5–6 s | Pause, couches écartées. |
| 6–8 s | Les couches se referment parfaitement. |

**Prompt Flow**
```
Vertical 9:16 ultra-realistic product animation. The exact square white window-cleaning robot from the reference
image floats centered on a plain deep blue-black background (#07090C), studio lighting with a soft rim light.
It slowly separates vertically into three clean layers like a premium exploded view: top = white shell with the
spray nozzle and water tank; middle = brushless motor with a metal suction turbine; bottom = rubber tracks and
microfiber pads. The layers hold apart for a moment, then reassemble perfectly. Static camera, front view,
slight 15-degree high angle, no camera shake. No text, no logo, no background objects. Photorealistic, 4K detail.
```

## V5 — Film multi-angles du Q3 (façon présentation iPhone)
Ce sont six prises de 8 s, coupées au montage à 1,2–1,4 s chacune pour une pub (R-005), ou plus longues pour la fiche produit.

**Base commune de chaque prompt**
*« Vertical 9:16 ultra-realistic premium product film. The exact square white window-cleaning robot from the reference image, isolated on a seamless dark graphite background, controlled studio lighting with soft rim light and gradient reflections, very slow motion-control camera, shallow depth of field, photorealistic materials, no text, no logo. »*

| Plan | Mouvement de caméra (ajouté à la base) |
|---|---|
| 5a Silhouette | « Starts in near darkness; a thin rim light slowly sweeps across the edge and reveals the robot's outline. » |
| 5b Le long du bord | « Macro camera glides along the full length of the robot's thin side edge, very close, focus rolling along the surface. » |
| 5c Orbite | « Camera slowly orbits 90° around the robot at eye level. » |
| 5d Buse | « Extreme macro on the front spray nozzle; a fine mist bursts out and catches the light, rack focus from nozzle to mist. » |
| 5e Dessous | « Camera tilts from the top face down to the underside, revealing the rubber tracks and microfiber pads. » |
| 5f Sur la vitre | « Wide shot: the robot attached to a large window at night, city lights behind, glides across the glass leaving a perfectly clean path. » |

**Ordre de montage** : 5a, 5b, 5c, 5d, 5e, 5f. Aucun plan n'est réutilisé.

---

## Règles de sélection des prises
- **Fidélité** : la prise est rejetée si le robot ne ressemble plus à la photo (forme, boutons, couleur) ou si des pièces sont inventées.
- **Mouvement** : rejetée si le robot se déforme, saute ou change de taille.
- **Hero** : le tiers bas doit rester lisible pour le titre, et la boucle doit se faire sans à-coup.
- **Rangement** : les prises retenues vont dans `web/public/produits/<robot>/video/`, avec le nom de la vidéo (`v1-hero.mp4`, etc.).
