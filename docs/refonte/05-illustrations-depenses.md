# Registre des dépenses Replicate (Cantona)

Budget projet : **7 $ maximum**. Objectif : 2 à 3 $. Arrêt obligatoire à **3 $** pendant la phase d'exploration.
Prix relevés le 30/10/2026 sur les pages modèles de replicate.com (champ `price`) :

| Modèle | Prix unitaire | Usage prévu |
|---|---|---|
| black-forest-labs/flux-schnell | 0,003 $ / image (3 $ les 1 000) | Exploration |
| black-forest-labs/flux-dev | 0,025 $ / image | Finales (candidat principal) |
| black-forest-labs/flux-1.1-pro | 0,04 $ / image | Finales (repli si flux-dev insuffisant) |
| recraft-ai/recraft-v3-svg | 0,08 $ / image | Testé une fois, écarté (voir 05-illustrations-cantona.md §3.4) |

## Lignes

| # | Date | Modèle | Prompt (résumé) | Images | Coût estimé | Cumul Cantona |
|---|---|---|---|---|---|---|
| 1 | 30/10 | flux-schnell | Appel de diagnostic, prompt « test » (vérification de l'API après une erreur de script) | 1 | 0,003 $ | 0,003 $ |
| 2 | 30/10 | flux-schnell | Piste A « trait d'architecte » × 4 sujets (rue brique + meulière, balcon, porte cochère, clés sur parquet), seed 1909 | 4 | 0,012 $ | 0,015 $ |
| 3 | 30/10 | flux-schnell | Piste B « eau-forte » × 4 mêmes sujets | 4 | 0,012 $ | 0,027 $ |
| 4 | 30/10 | flux-schnell | Piste C « sérigraphie deux tons » × 4 mêmes sujets | 4 | 0,012 $ | 0,039 $ |
| 5 | 30/10 | flux-schnell | Piste A resserrée (« strictly monochrome ») : ILL-01, ILL-04, ILL-06, ILL-07 | 4 | 0,012 $ | 0,051 $ |
| 6 | 30/10 | recraft-v3-svg, style `line_art` | ILL-01 en vectoriel natif (test de chaîne de production) | 1 | 0,080 $ | 0,131 $ |
| **Phase 2** | | | **Enveloppe 0,80 $ (Zidane, brief §8). Repli flux-1.1-pro interdit.** | | | Phase 2 cumulée |
| 7 | 30/10 | flux-dev, 28 étapes | Lot 1 : ILL-01, 02, 04, 05, 06, 08 × seeds 1909 et 2009 (prompt verrouillé + typologie meulière pour 01 et 04) | 12 | 0,300 $ | 0,300 $ |
| 8 | 30/10 | flux-dev img2img | ILL-03 d'après la photo de la devanture masquée (bandeau, téléphone, horaires, vitrines vidés), forces 0,72 / 0,78 / 0,85 | 3 | 0,075 $ | 0,375 $ |
| 9 | 30/10 | flux-dev, 28 étapes | Reprises : ILL-01 pignon sur rue, toit à deux pans non à croupe (3 seeds) ; ILL-06 étages seuls (2 seeds) ; ILL-04 sans pots ni massifs (1 seed) | 6 | 0,150 $ | 0,525 $ |
| 10 | 30/10 | flux-dev img2img | ILL-03 guidé par une carte de contours tirée localement de la photo masquée, forces 0,70 / 0,80 | 2 | 0,050 $ | 0,575 $ |
| 11 | 30/10 | flux-dev (+ img2img pour ILL-03) | Dernière reprise : ILL-01 meulière en opus incertum, pignon sur rue (3 seeds) ; ILL-04 même typologie sans pots ni volets (2 seeds) ; ILL-03 contours, force 0,75, « aucune plaque » (2 seeds) | 7 | 0,175 $ | 0,750 $ |
| 12 | 30/10 | flux-dev img2img | ILL-01 : unification d'un montage (pavillon ILL04c-s1909 + immeuble ILL05-s1909, encrés) en un seul dessin, force 0,50 | 1 | 0,025 $ | **0,775 $** |

Post-traitement (`scripts/illustrations/ink.py`, Pillow en local) : 0 $.

**Total Cantona à ce jour : 0,906 $** (49 images) = phase 1 0,131 $ + **phase 2 0,775 $** (31 images flux-dev à 0,025 $).
**Phase 2 : 0,775 $ sur une enveloppe de 0,80 $ (reste 0,025 $). Aucun appel flux-1.1-pro.**
Contrôle croisé le 30/10 à 19 h 40 UTC (`GET /v1/predictions`) : 31 prédictions `black-forest-labs/flux-dev` réussies entre 19 h 10 et 19 h 29 UTC, soit exactement les lignes 7 à 12.
Signalé à Zidane : la même liste montre **3 prédictions flux-2-pro à 19 h 0x UTC qui ne viennent pas de Cantona** (≈ 0,09 à 0,24 $). Quelqu'un d'autre utilise le compte.

## Alerte pour Zidane : dépenses antérieures sur le même compte

La liste des prédictions du compte Replicate (`GET /v1/predictions`) montre, **le 30/10 entre 18 h 08 et 18 h 36 UTC, avant le démarrage de Cantona**, 82 prédictions qui ne viennent pas de cette phase :

- 67 × black-forest-labs/flux-2-pro (0,015 $ par run + 0,015 $ par mégapixel en entrée et en sortie, soit environ 0,03 à 0,08 $ chacune) ;
- 15 × black-forest-labs/flux-fill-pro (0,05 $ chacune, soit 0,75 $).

Estimation : **2,8 à 6 $**. Si elles relèvent de ce projet, elles entament le plafond de 7 $ et il ne resterait que 1 à 4 $. À confirmer avec l'utilisateur avant de lancer les finales.

## Prévision des finales (phase 1, pour mémoire : remplacée par l'enveloppe de 0,80 $ de Zidane)

| Poste | Calcul | Coût |
|---|---|---|
| 7 illustrations générées (ILL-01 à 06, 08) | 3 seeds × flux-dev | 0,53 $ |
| ILL-03 devanture (guidée par la photo, flux-canny-dev ou flux-dev img2img) | 4 essais × 0,025 $ | 0,10 $ |
| Reprises ciblées | 8 × 0,025 $ | 0,20 $ |
| Repli flux-1.1-pro sur 2 visuels si nécessaire | 6 × 0,04 $ | 0,24 $ |
| ILL-07 carte et logotype | Dessinés en SVG à la main | 0 $ |
| **Total prévu** | | **environ 1,10 $** (cumul Cantona attendu : environ 1,25 $) |

## Revue n° 2 appliquée (30/10/2026) : 0 appel, 0 $

Aucun appel Replicate (brief §8bis, décision « aucune génération sans accord explicite de l'utilisateur »). ILL-01 retouchée dans `finals.py`, ILL-03 redessinée en SVG à la main, Open Graph, logotype, monogramme et icônes : tout est local (Pillow, numpy, scipy, fontTools, rsvg-convert). **Cumul Cantona inchangé : 0,906 $.**

## Implémentation, lot C : enveloppe supplémentaire de 0,40 $ (30/10/2026)

Ouverte par l'utilisateur principal (via le chef d'orchestre), qui a **vérifié** que les 85 prédictions « non attribuées » (82 entre 18 h 08 et 18 h 36 UTC, 3 flux-2-pro vers 19 h 0x UTC) appartiennent à un autre projet : **elles ne comptent pas** dans le plafond de 7 $. Dépense de l'équipe avant cette enveloppe : 0,906 $. Objet : (a) un pavillon en meulière **différent** d'ILL-01 pour l'en-tête de Vendre, à retenir à la place d'ILL-02 seulement s'il est meilleur et de la même main ; (b) si le reste le permet, une seconde passe d'ILL-01 qui retrouve l'appareillage de meulière, à retenir seulement si elle est meilleure. flux-dev uniquement (0,025 $ l'image). Arrêt dès 0,40 $. Une ligne par appel, écrite juste après l'appel.

| # | Date | Modèle | Prompt (résumé) | Images | Coût | Enveloppe 0,40 $ cumulée | Cumul équipe |
|---|---|---|---|---|---|---|---|
| 13 | 30/10 | flux-dev | ILL09-s1909 : pavillon en meulière différent pour Vendre (un étage et comble, faîtage parallèle à la rue, façade symétrique, lucarne centrale, marquise), 4:5, prompt verrouillé + typologie | 1 | 0,025 $ | 0,025 $ | 0,931 $ |
| 14 | 30/10 | flux-dev | ILL09-s2009 : pavillon en meulière différent pour Vendre (un étage et comble, faîtage parallèle à la rue, façade symétrique, lucarne centrale, marquise), 4:5, prompt verrouillé + typologie | 1 | 0,025 $ | 0,05 $ | 0,956 $ |
| 15 | 30/10 | flux-dev | ILL09-s3009 : pavillon en meulière différent pour Vendre (un étage et comble, faîtage parallèle à la rue, façade symétrique, lucarne centrale, marquise), 4:5, prompt verrouillé + typologie | 1 | 0,025 $ | 0,075 $ | 0,981 $ |
| 16 | 30/10 | flux-dev | ILL09-s4009 : pavillon en meulière différent pour Vendre (un étage et comble, faîtage parallèle à la rue, façade symétrique, lucarne centrale, marquise), 4:5, prompt verrouillé + typologie | 1 | 0,025 $ | 0,1 $ | 1,006 $ |
| 17 | 31/10 | flux-dev img2img | ILL09e-s1909-p55 : ILL09-s4009 (arbre gommé par symétrie, buisson gommé) redessiné en meulière opus incertum, force 0,55 | 1 | 0,025 $ | 0,125 $ | 1,031 $ |
| 18 | 31/10 | flux-dev img2img | ILL09e-s1909-p68 : même guide et même prompt, force 0,68 | 1 | 0,025 $ | 0,15 $ | 1,056 $ |
| 19 | 31/10 | flux-dev img2img | ILL01e-s1909-p35 : seconde passe d'ILL-01 sur le montage brut retouché (`ill01-guide-v2.png`, moellons visibles, une ligne de sol), meulière opus incertum, force 0,35 | 1 | 0,025 $ | 0,175 $ | 1,081 $ |
| 20 | 31/10 | flux-dev img2img | ILL01e-s1909-p60 : même guide, même prompt (+ « no bushes, no pots, no lamps, no plaques »), force 0,60 (la force 0,42 prévue est abandonnée : 0,35 lisse les moellons) | 1 | 0,025 $ | 0,20 $ | 1,106 $ |

**Bilan de l'enveloppe (31/10)** : 8 images flux-dev, **0,20 $ sur 0,40 $**, arrêt volontaire. Recoupé avec `GET /v1/predictions` : 8 prédictions `black-forest-labs/flux-dev` depuis le 30/10 à 20 h 33 UTC, soit exactement les lignes 13 à 20 (les flux-2-pro et flux-fill-pro de 19 h 58 à 20 h 08 UTC appartiennent à l'autre projet). **Cumul équipe : 1,106 $.**
- (a) Vendre : ILL09-s1909 (pseudo-lettres sur une plaque, palissade), s2009 (toit à croupe de lotissement, portail en bois, herbes), s3009 (pots, arbre en nuage, volets) **rejetés** ; s4009 retenu comme guide (arbre gommé par symétrie). **ILL09e-s1909-p68 retenu** : vraie meulière en opus incertum, chaînes d'angle et arcs de brique, bandeau, grille sur muret entre deux piliers ; p55 rejeté (moellons encore réguliers). Livré en `public/illustrations/ill-09.png`, remplace ILL-02 sur Vendre.
- (b) ILL-01 : p35 et p60 **rejetés** (murs lisses de nouveau, jardinières, antenne sur la cheminée). L'img2img lisse les moellons à toute force testée : ILL-01 reste inchangée. La passe à 0,42 prévue n'a pas été lancée.
