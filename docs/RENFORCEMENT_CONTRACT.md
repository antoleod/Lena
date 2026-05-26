# Monde « Renforcement » — Contrat technique & Workflow

> Contrat d'implémentation aligné sur le code **réel** de Lena (React 18 + Vite,
> **JavaScript**, **local-first** via `localStorage`, **sans** TypeScript ni Firebase).
> Spec produit : [`RENFORCEMENT_SPEC.md`](./RENFORCEMENT_SPEC.md).
> Conventions repo : [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`ADDING_CONTENT.md`](./ADDING_CONTENT.md).

---

## 0. Règles du contrat

1. **Réutiliser avant de créer.** Tout ajout doit justifier qu'aucune brique existante
   ne couvre le besoin (voir la carte de réutilisation, §6 de la spec).
2. **Ne pas dupliquer** les stores : `profileStore`, `progressStore`, `rewardStore`
   sont les sources de vérité uniques.
3. **Local-first.** Aucune dépendance réseau ; tout passe par `localStorage` via les
   stores existants.
4. **Émotionnel par construction.** Aucun chemin de code ne produit « incorrect / faux /
   erreur » ni de feedback rouge. Vérifié par test.
5. **`npm run build` et `npm test` doivent passer** à la fin de chaque phase.

---

## 1. Arborescence cible (alignée sur le repo)

> ❌ Pas de `src/modules/renforcement/` · ❌ pas de `.ts`. Le monde s'étale sur les
> couches existantes de Lena.

```
src/
  features/
    renforcement/
      RenforcementHubPage.jsx        # /renforcement — accueil calme + prénom
      RenforcementSectionPage.jsx    # /renforcement/:sectionId — liste d'exercices
      components/
        GreetingHeader.jsx           # « Bonjour {prénom} 🌟 »
        SectionCard.jsx              # grosse carte tactile par section
        SoftFeedback.jsx             # feedback positif (jamais rouge/“incorrect”)
        StarReward.jsx               # animation étoile lente
      renforcement.css               # palette pastel, zones tactiles ≥48px
  engines/
    renforcement/
      coloring/ColoringActivity.jsx  # NOUVEAU moteur SVG tactile
      trace/TraceActivity.jsx        # NOUVEAU moteur tracé guidé
      grid/GridActivity.jsx          # NOUVEAU moteur grille / tableau
      observe/SpotDifferenceActivity.jsx # NOUVEAU moteur différences
    generators/
      shapeGenerator.js              # étend geometryGenerator (formes/côtés/angles)
      coloringGenerator.js           # NOUVEAU
      observationGenerator.js        # NOUVEAU
      tableGenerator.js              # NOUVEAU (grille / tableau à compléter)
    learning/
      confidenceEngine.js            # NOUVEAU (ton + maîtrise → encouragement)
      renforcementAdaptive.js        # NOUVEAU (lit progressStore → biais section/difficulté)
  content/
    renforcement/
      activities.js                  # activités manuelles (8 sections)
      generatedActivities.js         # descripteurs avec generatorConfig
      sections.js                    # définition des 8 sections + mapping activités
      authoring.js                   # normalizeRenforcementExercise() (JSON auteur → runtime)
```

Fichiers **modifiés** (existants) :

| Fichier | Modification |
|---------|--------------|
| `src/app/routing/AppRouter.jsx` | Ajouter `/renforcement` et `/renforcement/:sectionId` dans `<AppShell>` |
| `src/engines/engineRegistry.js` | Enregistrer `coloring`, `trace`, `grid`, `spot-difference` |
| `src/engines/content-generation/generatorCatalog.js` | Ajouter topics/skills `shapes`, `colors`, `observation`, `tracing`, `tables` |
| `src/content/registry/activityRegistry.js` | Inclure les activités `content/renforcement/*` dans la résolution |
| `src/content/worlds/worldMapData.js` | *(optionnel, phase 5)* entrée monde « Renforcement » |
| navigation d'accueil (`HomePage`/`SubjectsHubPage`) | Lien vers `/renforcement` |

---

## 2. Contrat de données — exercice

### 2.1 JSON d'auteur (format simple, fichiers `content/renforcement/`)

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

| Champ | Type | Obligatoire | Notes |
|-------|------|:----:|-------|
| `id` | string | ✅ | unique dans le repo |
| `type` | enum | ✅ | un des types §3 |
| `level` | `"P2"`\|`"P3"` | ✅ | mappé vers `gradeId`/`gradeBand` |
| `instruction` | string (fr) | ✅ | consigne enfant |
| `difficulty` | int 1..3 | ✅ | mappé `1→easy, 2→medium, 3→hard` |
| `reward` | string | ➖ | emoji affiché (défaut `⭐`) |
| `skills` | string[] | ➖ | → `skillTags` / biais adaptatif |
| `payload` | object | ➖ | données spécifiques au moteur (formes, lignes, grille…) |

### 2.2 Normalisation → modèle runtime

`content/renforcement/authoring.js` exporte :

```js
// JSON auteur → ExerciseDefinition (src/shared/types/exerciseModels.js)
export function normalizeRenforcementExercise(authored) { /* … */ }
```

Mapping **contractuel** (auteur → `defineExercise`) :

| Auteur | Runtime (`exerciseModels`) |
|--------|----------------------------|
| `id` | `id` |
| `type` | `type` (+ `engineType` via table §3) |
| `level` | `gradeId` (`"P2"`/`"P3"`) ; `gradeBand: [level]` |
| `instruction` | `instruction` **et** `prompt` |
| `difficulty` (1/2/3) | `difficulty` (`easy`/`medium`/`hard`) |
| `reward` | `rewardValue` (numérique cristaux) ; emoji conservé pour l'UI |
| `skills` | `skillTags` + `tags` |
| `payload` | `media` / options spécifiques du moteur |

> Les générateurs (`generatedActivities.js` + `generatorCatalog`) produisent le **même**
> modèle runtime, via `createExercise()` / `defineExercise()`. Un seul modèle runtime,
> deux sources (manuel + généré).

---

## 3. Contrat des moteurs (engine registry)

`engineRegistry.js` mappe `engineType → composant`. Types et rendu :

| `type` (exercice) | `engineType` | Composant | Statut |
|-------------------|--------------|-----------|:------:|
| `shape-recognition` | `multiple-choice` | `MultipleChoiceActivity` | ♻️ réutilisé |
| `count-elements` / `count` | `multiple-choice` | `MultipleChoiceActivity` | ♻️ |
| `matching` | `matching` | `MultipleChoiceActivity` | ♻️ |
| `comparison` | `comparison` | `MultipleChoiceActivity` | ♻️ |
| `visual-logic` | `visual-logic` | `MultipleChoiceActivity` | ♻️ (déjà enregistré) |
| `coloring` / `complete-drawing` | `coloring` | `ColoringActivity` | 🆕 |
| `trace` | `trace` | `TraceActivity` | 🆕 |
| `grid-complete` / `reproduce` | `grid` | `GridActivity` | 🆕 |
| `spot-difference` | `spot-difference` | `SpotDifferenceActivity` | 🆕 |

**Contrat de props d'un moteur** (cohérent avec `MultipleChoiceActivity` /
`ActivityPage`) — chaque nouveau moteur reçoit :

```js
{
  exercise,                       // ExerciseDefinition normalisé
  onResult: (isCorrect) => void,  // remonte le résultat (jamais bloquant)
  feedbackPreferences,            // profile.feedbackPreferences (mais override doux)
  locale,                         // 'fr'
}
```

Règle : `onResult(false)` **n'affiche jamais** de rouge ni « incorrect » → la page
montre `SoftFeedback` (« Très bien essayé ») et propose de réessayer en douceur.

---

## 4. Contrat adaptatif & confiance

### 4.1 `renforcementAdaptive.js`

```js
// Lit la maîtrise existante et oriente la prochaine séance.
// Entrée : progressStore.getProgressOverview(activities, modules).mastery
//          + skills observées par section
// Sortie :
export function planNextSession({ sectionId, snapshot }) {
  return {
    exerciseCount,        // raccourci si fatigue d'attention détectée
    difficultyBias,       // 'down' | 'steady' | 'up'
    skillBias,            // ex. 'formes' si géométrie faible
    slots,                // réutilise les patterns de lessonComposer
  };
}
```

- **Réutilise** `lessonComposer.adjustDifficulty` et ses patterns de slots
  (`opener/practice/challenge/variation`). Ne pas réécrire la logique de slots.
- **Concentration faible** (échecs rapprochés, sessions courtes via `progressStore.meta`)
  → `exerciseCount` réduit, slots `['opener','practice']`.
- **Maîtrise élevée** (`mastered` dominant) → `difficultyBias: 'up'`.
- Biais par matière selon §7 de la spec (géométrie→formes, mots→lecture, logique→observer).

### 4.2 `confidenceEngine.js`

```js
// Choisit le message d'encouragement — JAMAIS négatif.
export function encourage({ outcome, prenom, streak }) {
  // outcome: 'success' | 'retry' | 'transition'
  // renvoie une chaîne de la banque autorisée (spec §8)
}
export const FORBIDDEN_WORDS = ['incorrect', 'faux', 'erreur', 'raté'];
```

Cet engine est la **source unique** des textes de feedback du monde Renforcement.

---

## 5. Contrat de navigation & intégration

- Routes ajoutées **dans** `<AppShell>` (comme les autres) :
  - `/renforcement` → `RenforcementHubPage`
  - `/renforcement/:sectionId` → `RenforcementSectionPage`
- Les exercices se lancent via la page d'activité existante
  `/activities/:activityId` (réutilise `ActivityPage` + `engineRegistry`).
- Le prénom vient de `profileStore.getProfile().name` ; repli `''` → « Bonjour 🌟 ».
- Progrès : `recordQuestionOutcome` / `saveActivityProgress` (existants).
- Étoiles / cristaux : `rewardActivityCompletion` (existant).
- Thème pastel via `ThemeContext` ; voix (section Écoute) via `useSpeechPlayer`.

---

## 6. Workflow d'implémentation

Phases ordonnées par dépendances. Chaque phase a un **propriétaire** (agent),
des **livrables** et une **Definition of Done (DoD)**. On ne démarre une phase
que si la DoD de ses dépendances est verte.

```
P0 Audit ─▶ P1 Contrats de données ─▶ P2 Générateurs ─▶ P3 Moteurs UI
                                                  │
                          P4 Adaptatif/Confiance ◀┘
                                   │
                          P5 Feature + Navigation ─▶ P6 Émotionnel/QA ─▶ P7 Build/Release
```

| Phase | Propriétaire | Livrables | DoD |
|-------|--------------|-----------|-----|
| **P0 — Audit** ✅ | maestro | Carte de réutilisation, ce contrat | Validé (présent doc) |
| **P1 — Contrats de données** | backend-perf-engineer | `content/renforcement/authoring.js` (`normalizeRenforcementExercise`), `sections.js` | Test unitaire : JSON auteur → `defineExercise` valide pour chaque `type` |
| **P2 — Générateurs** | backend-perf-engineer | `shapeGenerator.js` (étend geometry), `coloringGenerator.js`, `observationGenerator.js`, `tableGenerator.js` + entrées `generatorCatalog` | Chaque générateur renvoie un exercice valide ; pas de réponse manquante |
| **P3 — Moteurs UI** | frontend-developer | `ColoringActivity`, `TraceActivity`, `GridActivity`, `SpotDifferenceActivity` + enregistrement `engineRegistry` | Rendu mobile au doigt ; `onResult` remonté ; aucun rouge |
| **P4 — Adaptatif & confiance** | backend-perf-engineer | `renforcementAdaptive.js`, `confidenceEngine.js` | Tests : biais correct selon `mastery` ; `FORBIDDEN_WORDS` jamais émis |
| **P5 — Feature & navigation** | frontend-developer | `RenforcementHubPage`, `RenforcementSectionPage`, composants, route, lien d'accueil | `/renforcement` affiche le vrai prénom ; 8 sections navigables |
| **P6 — Émotionnel & QA** | ux-tester | Audit UX mobile, vérif palette/messages, parcours enfant | Aucun mot interdit, aucun rouge, animations lentes, zones ≥48px |
| **P7 — Build & release** | devops-qa-engineer | Tests passants, build | `npm test` + `npm run build` verts ; aucun id mort |

### Affectation des agents (décision maestro)

- **PRIMARY — frontend-developer** : moteurs UI interactifs (P3), feature & navigation (P5),
  ton visuel pastel, et la mise au propre des deux documents MD.
- **SECONDARY — backend-perf-engineer** : contrats de données (P1), générateurs (P2),
  moteur adaptatif + confiance (P4).
- **SUPPORT — ux-tester** (P6) et **devops-qa-engineer** (P7).

### Jalons de validation (gates)

1. **Gate A (fin P2)** : un exercice de chaque type se génère et se normalise → modèle runtime valide.
2. **Gate B (fin P3)** : les 4 moteurs neufs rendent et remontent un résultat sur mobile.
3. **Gate C (fin P5)** : parcours complet `/renforcement` → section → exercice → étoile, avec prénom.
4. **Gate D (fin P6/P7)** : QA émotionnelle OK + build/test verts.

---

## 7. Definition of Done global

- [ ] Aucune création redondante (stores réutilisés ; voir §0).
- [ ] `/renforcement` + 8 sections + ≥4 moteurs interactifs fonctionnels.
- [ ] Prénom réel affiché partout ; repli sûr si vide.
- [ ] Adaptation pilotée par `progressStore` (difficulté + biais matière + raccourci attention).
- [ ] Zéro mot interdit / zéro rouge de feedback (test automatisé).
- [ ] Progrès & étoiles persistés via les stores existants.
- [ ] `npm test` & `npm run build` verts ; aucun id d'activité mort.

---

## 8. Risques & décisions ouvertes

| Sujet | Décision proposée | À confirmer |
|-------|-------------------|-------------|
| Le monde apparaît-il sur la carte (`worldMapData`) ou reste autonome ? | Autonome d'abord (feature dédiée, UX calme) ; entrée carte en phase 5 optionnelle | Produit |
| Assets coloriage/tracé (SVG) | Créer un petit jeu de SVG sous `public/assets/renforcement/` | Design |
| `trace` au doigt vs latte | Tracé guidé au doigt (mobile-first) ; « latte » = guide visuel droit | Produit |
| Section Écoute hors-ligne | Réutilise `useSpeechPlayer` (Web Speech API) ; repli texte si indispo | Tech |
