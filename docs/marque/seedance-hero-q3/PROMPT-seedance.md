# Seedance 2.0 Mini (CapCut) — hero Klair Q3 : 9:16 → 16:9 identique (outpainting)

Méthode Lumikréa : la vidéo 9:16 validée sert de **référence de mouvement** ; Seedance la reproduit en 16:9 en inventant les côtés (la vidéo verticale = le tiers central du cadre). Première et dernière images imposées en 16:9.

## Fichiers du pack
| Fichier | Rôle |
|---|---|
| `ref_1_9x16.mp4` … `ref_4_9x16.mp4` | Références de mouvement, un par plan (large, rapproché, gros plan, détail brume) |
| `planN_premiere_9x16.png`, `planN_derniere_9x16.png` | Première / dernière image de chaque plan, en 9:16 |
| À créer : `planN_premiere_16x9.png`, `planN_derniere_16x9.png` | **Les mêmes images élargies en 16:9** : dans Google Flow, ouvrir l'image → modifier → format **16:9** (élargissement génératif de l'image, l'original reste au centre), prompt : « Extend this exact image to 16:9, keep the original unchanged in the center, only add the natural continuation on the left and right. » |

## Prompt (un clip par plan ; durée = celle du plan, ou 4 s puis coupe au montage)
Remplacer `{PLAN}`, `{DURÉE}` et `{TIMELINE}` par les valeurs du tableau plus bas.

```text
BEFORE GENERATING: tell me which slot you put each attached file in (first frame, last frame, motion reference) and whether anything is missing. Do not start until I confirm.

TASK: one continuous shot, landscape 16:9, 1280x720 or higher in the same ratio, {DURÉE} seconds, 24 fps, no cut, no cross-dissolve, no fade, no jump. The MOTION REFERENCE is the approved vertical take: reproduce its camera path, speed, timing and the robot's motion exactly, widened to 16:9 (the vertical image corresponds to the central third of the frame). Start exactly on the FIRST FRAME and end exactly on the LAST FRAME.

START LOCK: frame 1 is the FIRST FRAME itself, unchanged.

TIMELINE (follow the motion reference): {TIMELINE}

RULES: the white square window-cleaning robot stays exactly identical to the reference (same shape, buttons, LEDs, white shell, size), no deformation, no morphing. Same golden-hour light, same colors, same reflections and film look. Only the left and right areas are new: the natural continuation of the same high-rise window, frames and city skyline, moving coherently with the camera. No people, no text, no logo, no new objects or light sources.
```

| Plan | Durée | TIMELINE |
|---|---|---|
| 1 · large | 2,2 s | the robot glides slowly down the huge high-rise window at golden hour, fine subtle mist, soft lens flare, slow push-in. |
| 2 · rapproché | 2 s | medium close-up, the robot slides slowly upward, the camera tracks with it and drifts closer, warm flare across its front face. |
| 3 · gros plan | 2 s | tight close-up on the robot's front face, very slow push-in and lateral slide, a golden highlight glides across the shell, LEDs glow. |
| 4 · détail | 2,5 s | macro on the nozzle, a fine ultrasonic mist drifts in slow motion, droplets sparkling in the golden backlight, city tower in soft bokeh. |

## Après génération
1. Retirer le filigrane « Ai » : `delogo` x=14 y=12 w=38 h=36 (en 1280×720).
2. Vérifier image par image que le centre correspond au 9:16 (robot identique) ; sinon relancer.
3. Monter les 4 plans dans l'ordre, coupes franches, même minutage que la 9:16 (8,7 s) → `hero-q3-4-angles-16x9.mp4`.
