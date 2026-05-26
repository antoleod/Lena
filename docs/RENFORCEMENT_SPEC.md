# Monde « Renforcement » — Spécification produit

> Renforcement scolaire **doux** pour l'enfant : un jeu calme, pas un examen.
> Inspiré des fiches scolaires belges P2/P3 (formes, géométrie simple, coloriage,
> logique visuelle, tracer à la latte, tableaux, observation, comptage).
>
> **Statut :** spécification validée après audit du projet Lena (2026-05-26).
> Document compagnon : [`RENFORCEMENT_CONTRACT.md`](./RENFORCEMENT_CONTRACT.md) (contrat technique + workflow).

---

## 1. Intention

Créer un univers éducatif intégré, **entièrement en français**, qui aide un enfant
(2e–3e primaire, profils attention fragile / manque de confiance) à **reprendre
confiance**. L'expérience doit sembler humaine, calme, intelligente et rassurante :
plus proche d'un Duolingo Kids × Apple Education que d'une fiche d'évaluation.

Inspirations pédagogiques (à **moderniser, pas copier**) : GeoGebra, Mathenpoche,
TracenPoche, fiches scolaires belges/françaises P2/P3.

## 2. Principes non négociables

| # | Principe | Conséquence concrète |
|---|----------|----------------------|
| P1 | **Audit avant code** | Réutiliser les briques existantes ; ne créer que ce qui manque (voir §6). |
| P2 | **Zéro duplication** | Pas de nouveau store de profil/progrès/récompense — réutiliser ceux de Lena. |
| P3 | **Mobile-first** | Grosses zones tactiles, une consigne par écran, scroll minimal. |
| P4 | **Calme & minimaliste** | Couleurs douces (pastel), animations lentes, beaucoup d'espace blanc. |
| P5 | **Sécurité émotionnelle** | Interdits : messages agressifs, rouge stressant, le mot « incorrect ». |
| P6 | **Adaptation automatique** | La difficulté et le type d'exercice s'ajustent aux progrès de l'enfant. |
| P7 | **Tout en français** | Interface, consignes, encouragements, voix. |

## 3. Le prénom de l'enfant

Le prénom **existe déjà** dans le profil Lena (`profileStore.getProfile().name`,
saisi à l'onboarding). Le monde Renforcement le lit et l'affiche partout — il ne
le redemande pas.

- Accueil : « Bonjour {prénom} 🌟 »
- Intro de séance : « Aujourd'hui on travaille les figures. »
- Encouragements : « Bravo {prénom} 🌟 »
- Repli si le prénom est vide : « Bonjour 🌟 » (jamais d'erreur, jamais de blocage).

## 4. Le monde et ses 8 sections

Route racine : **`/renforcement`** (hub calme). Chaque section a sa propre page
`/renforcement/:sectionId`.

| Section | id | Domaine | Exemples d'exercices |
|---------|----|---------|----------------------|
| Formes | `formes` | géométrie | reconnaître figures, compter côtés, compter angles, relier figure↔nom |
| Couleurs | `couleurs` | observation | colorier les triangles, colorier selon consigne, associer couleur↔objet |
| Tracer | `tracer` | motricité | suivre une ligne, tracer à la latte, reproduire un modèle |
| Logique | `logique` | raisonnement | suites visuelles, intrus, compléter un tableau/grille |
| Calcul | `calcul` | maths | compter, comparer, petites additions/soustractions douces |
| Lecture | `lecture` | langage | associer image↔mot, compléter un dessin/mot, observer une consigne |
| Observer | `observer` | attention | différences entre deux images, compléter un dessin, retrouver un détail |
| Écoute | `ecoute` | écoute | consigne audio → choisir/colorier (réutilise la synthèse vocale existante) |

## 5. Types d'exercices (catalogue cible)

Reprend les gestes des fiches de la photo. Chaque type est rattaché à un **moteur de
rendu** (voir le contrat pour le détail technique) :

| Geste de la fiche | Type d'exercice | Moteur de rendu |
|-------------------|-----------------|-----------------|
| Reconnaître une forme | `shape-recognition` | choix multiple (réutilisé) |
| Compter côtés / angles | `count-elements` | choix multiple (réutilisé) |
| Relier objets / figure↔nom | `matching` | existant |
| Colorier des formes | `coloring` | **nouveau** (SVG tactile) |
| Tracer / suivre une ligne | `trace` | **nouveau** (canvas/SVG guidé) |
| Reproduire un modèle | `reproduce` | **nouveau** (grille) |
| Compléter un tableau / grille | `grid-complete` | **nouveau** (grille) |
| Observer des différences | `spot-difference` | **nouveau** (deux images) |
| Compléter un dessin | `complete-drawing` | coloriage/grille |
| Suites visuelles / intrus | `visual-logic` | existant (déjà enregistré) |
| Compter / comparer | `count` / `comparison` | existant |

## 6. Carte de réutilisation (résultat de l'audit)

> ⚠️ La proposition initiale parlait de fichiers `.ts` dans `src/modules/renforcement/`.
> **Lena n'utilise pas TypeScript et n'a pas de dossier `src/modules/`.** L'architecture
> réelle est `src/features/ · src/engines/ · src/content/ · src/services/ · src/shared/`.
> La spec ci-dessous est alignée sur le code existant.

| Brique demandée | Déjà présent dans Lena ? | Fichier réel | Décision |
|-----------------|--------------------------|--------------|----------|
| Profil + prénom enfant | ✅ Oui | `src/services/storage/profileStore.js` | **Réutiliser** (`getProfile().name`) |
| `StudentProgressEngine` | ✅ Équivalent | `src/services/storage/progressStore.js` (états `unseen/shaky/failed/mastered`, streaks) | **Réutiliser**, ne pas recréer |
| `AdaptiveDifficulty` | ✅ Partiel | `src/engines/learning/lessonComposer.js` (`adjustDifficulty`, slots opener/practice/challenge) | **Étendre** |
| `ConfidenceEngine` | ❌ Manque | — | **Créer** (`src/engines/learning/confidenceEngine.js`) |
| `ShapeExerciseGenerator` | ⚠️ Basique | `src/engines/generators/geometryGenerator.js` (4 formes, QCM texte) | **Étendre** |
| `ExerciseEngine` | ✅ Équivalent | `src/engines/engineRegistry.js` + `activity-engine/*` | **Réutiliser**, enregistrer les nouveaux types |
| Système de récompenses ⭐ | ✅ Oui | `src/services/storage/rewardStore.js` (cristaux, stickers, étoiles) | **Réutiliser** |
| Mondes / routes | ✅ Oui | `src/content/worlds/worldMapData.js`, `src/app/routing/AppRouter.jsx` | **Étendre** (nouvelle route + entrée) |
| Rendu d'activité | ✅ Oui | `src/features/activity/ActivityPage.jsx` | **Réutiliser** |
| Thème / i18n | ✅ Oui | `src/shared/theme/ThemeContext.jsx`, `src/shared/i18n/LocaleContext.jsx` | **Réutiliser** |
| Synthèse vocale (Écoute) | ✅ Oui | `src/shared/hooks/useSpeechPlayer.js` | **Réutiliser** |

**À créer réellement** (le reste est de la réutilisation) :
1. Moteurs interactifs : **coloriage SVG**, **tracé guidé**, **grille**, **différences**.
2. Générateurs étendus : formes/côtés/angles, couleurs, observation, tableaux.
3. `confidenceEngine.js` + extension de l'adaptatif.
4. Feature `src/features/renforcement/` (hub + page de section) au ton doux.
5. Contenu français P2/P3 dans `src/content/renforcement/`.
6. Route `/renforcement` + entrée de navigation.

## 7. Système intelligent & adaptation

L'adaptation lit la **maîtrise par question** déjà calculée par `progressStore`
(`getProgressOverview().mastery` → `{ unseen, shaky, failed, mastered }`) et oriente
la séance suivante :

| Signal observé | Réaction |
|----------------|----------|
| Difficulté en **géométrie** | proposer **plus de figures** (biais section Formes) |
| Difficulté en **orthographe / mots** | proposer **plus de mots** (biais section Lecture) |
| Difficulté en **logique** | proposer **plus d'observation** (biais Logique/Observer) |
| Signes de **fatigue d'attention** (échecs rapprochés, sessions courtes) | **raccourcir** la séance (moins d'exercices, slots `opener`/`practice` seulement) |
| Réussites répétées (`mastered`) | augmenter progressivement la difficulté |

La progression est **toujours positive** : on ne « rétrograde » jamais brutalement ;
on revient en douceur sur ce qui n'est pas encore acquis.

## 8. Système émotionnel

**Interdits absolus :**
- Mots négatifs : « incorrect », « faux », « erreur », « raté ».
- Rouge stressant comme couleur de feedback / buzzer sonore d'échec.
- Animations brusques, comptes à rebours anxiogènes, scores qui baissent.

**Vocabulaire autorisé (banque de messages française) :**
- Réussite : « Bravo 🌟 », « Super {prénom} ! », « Tu progresses 🌱 ».
- Essai à revoir : « Très bien essayé », « On regarde encore ensemble », « Tu y es presque ».
- Transition : « On continue ensemble », « Encore une, en douceur ».

**Récompenses :** étoiles ⭐ et cristaux via `rewardStore` (déjà en place) ;
stickers doux. Jamais de pénalité.

## 9. Interface & ton visuel

- Palette **pastel** (réutiliser les `preview` de thèmes existants : `theme-candy`,
  `wallpaper-mint-meadow`, etc.). Aucun rouge vif pour le feedback.
- Une consigne visible à la fois, en gros, lisible (P2/P3).
- Zones tactiles larges (≥ 48 px), espacées.
- Animations **lentes et fluides** (apparitions en fondu, étoiles qui montent doucement).
- Bouton retour flottant déjà existant (`FloatingBackButton`).

## 10. Format JSON des exercices

Les exercices sont **générés / déclarés en JSON**. Le format d'auteur reste simple
(proche de l'exemple initial) et est **normalisé** vers le modèle runtime de Lena
(`src/shared/types/exerciseModels.js`). Détail du mapping dans le contrat.

```json
{
  "id": "formes-001",
  "type": "shape-recognition",
  "level": "P2",
  "instruction": "Colorie les triangles.",
  "difficulty": 1,
  "reward": "⭐",
  "skills": ["formes", "observation"]
}
```

## 11. Critères d'acceptation (Definition of Done produit)

- [ ] `/renforcement` accessible, affiche « Bonjour {prénom} 🌟 » avec le vrai prénom.
- [ ] Les 8 sections sont navigables et proposent au moins un exercice chacune.
- [ ] Au moins **4 types interactifs** fonctionnent (coloriage, tracer, grille, différences).
- [ ] La difficulté s'adapte selon la maîtrise lue dans `progressStore`.
- [ ] **Aucun** rouge de feedback, **aucun** mot interdit (vérifié par test).
- [ ] Progrès et étoiles persistent via `progressStore` / `rewardStore` existants.
- [ ] Tout est en français ; fonctionne au doigt sur mobile.
- [ ] `npm run build` passe ; aucun id d'activité mort.

## 12. Hors périmètre (pour cette itération)

- Backend / Firebase (Lena est local-first ; rien à ajouter).
- TypeScript (le projet est en JS — voir §6).
- Multi-enfants / multi-profils (le profil unique existant suffit).
- Édition de contenu par l'enseignant (auteur = fichiers JSON dans le repo).
