# LÉNALAND — Adaptive Learning System Audit & Architecture

> Audit only. No code changed. All file paths verified against the current `main` branch.

---

## 1. Executive Summary

LénaLand is a content-rich educational app (12 subjects, grades **P2–P6**, 4 generative engines, ~80k LOC). The content layer is genuinely good: activities and modules already carry `gradeBand` arrays, exams ship three difficulty tiers (`facile/moyen/difficile`), and a per-question mastery store already tracks `unseen/shaky/failed/mastered` plus an error history with a `getWeakAreas()` helper. **The foundation for adaptivity exists but is disconnected.**

The core problem is that **almost nothing reads the child's age or grade to decide what to show.** Concretely:

- **The child profile has no `schoolGrade` and no skill level.** `age` exists but defaults to a hardcoded `8` and **is never collected** — onboarding only asks language, name, and visual theme.
- **The only age-aware engine is `mixedEngine.js`**, and even there the age is *child-selected* (range 6–9 only), defaulting to age 8 / level CE2 — which *enables multiplication and division by default*.
- **`PracticePage` hardcodes grade + difficulty per topic** (multiplication is always `P3/medium`), ignoring the child entirely.
- **The exam library exposes every exam to every child**, including `tables-multiplication`, regardless of age.
- **No P1 / maternelle / age-5 content exists at all** — the catalog floor is P2. A 5-year-old is not representable in the current model.

So the headline bug ("a 5-year-old gets 2×5") is real and structural: there is no profile field, no gate, and no content tier below P2 to protect young children, and the one engine that *could* adapt defaults to a multiplication-enabled level.

The fix is **not** a rewrite. It is: (1) add grade + skill fields to the profile, (2) collect them in onboarding, (3) introduce a single `adaptiveEngine` that turns `{age, grade, performance, parentSettings}` into an allowed-skill set + difficulty, and (4) route every exercise launcher through it. The existing `mixedEngine` CONFIGS, `gradeBand` metadata, `progressStore` mastery, and `getWeakAreas()` become the inputs to that engine rather than being replaced.

---

## 2. Current Codebase Findings

| # | Concern | Location | State |
|---|---------|----------|-------|
| 1 | Child/user profile | [src/services/storage/profileStore.js](src/services/storage/profileStore.js) — key `lena:profile:v1` | Has `age` (default **8**), `language`, `identity`, cosmetics, study totals. **No `schoolGrade`, no skill level, no adaptive flags.** |
| 2 | Settings storage | profile (above) + [src/services/storage/parentalStore.js](src/services/storage/parentalStore.js) — key `lena:parental:v1` | Parental = PIN, `blockedWorldIds`, `dailyLimitMinutes`. **No subject/operation toggles, no level override.** |
| 3 | Subjects defined | [src/features/curriculum/catalog.js](src/features/curriculum/catalog.js) + `src/content/<subject>/activities.js` & `generatedActivities.js` | 12 subjects. Each `subject` has `grades: ['P2'..'P6']`. |
| 4 | Exercises generated | [src/features/exerciseGenerator/exerciseTemplates.js](src/features/exerciseGenerator/exerciseTemplates.js) (`GENERATORS['subject:type']`), [mixedEngine.js](src/features/exerciseGenerator/mixedEngine.js), [src/features/practice/PracticePage.jsx](src/features/practice/PracticePage.jsx) | Three independent generation paths, each with its own difficulty notion. |
| 5 | Quiz/exam difficulty | `src/content/exams/**/**.json` (`levels.facile/moyen/difficile`, each with `passPercent`) consumed by [src/features/exam/library/ExamRunnerPage.jsx](src/features/exam/library/ExamRunnerPage.jsx) | Difficulty read from **URL param** `?level=`, not from the child. |
| 6 | Levels defined | [src/services/learning/levelSystem.js](src/services/learning/levelSystem.js) | This is **gamification XP** (activity count → level 1–20), **not skill level.** `inferLevelNumFromGrade()` maps `gradeBand → number`. |
| 7 | Progress saved | [src/services/storage/progressStore.js](src/services/storage/progressStore.js) — key `lena:migration:progress:v3` | Per-activity / per-question mastery (`unseen/shaky/failed/mastered`), streaks, daily study seconds. **Strong adaptive input, currently used only for display.** |
| 8 | Wrong answers tracked | [src/services/storage/errorHistoryStore.js](src/services/storage/errorHistoryStore.js) — key `lena:errors:v1` | Records each error w/ `practiceKey`, `level`. `getWeakAreas()` already ranks weakest `subject:type`. **The seed of an adaptive engine already exists here.** |
| 9 | Games choose questions | `src/features/jeux/*` (Tetris, Snake, NinjaFruits, BatailleMonstres…), [src/features/tables/TablesPage.jsx](src/features/tables/TablesPage.jsx) | Self-contained random generators; no age/grade input. |
| 10 | Hardcoded difficulty | [PracticePage.jsx:48-55](src/features/practice/PracticePage.jsx#L48-L55) (`grade:'P3', difficulty:'medium'` per topic); [mixedEngine.js:15](src/features/exerciseGenerator/mixedEngine.js#L15) (`AGE_TO_LEVEL`, default CE2); [MixedModePage.jsx:68-69](src/features/exerciseGenerator/MixedModePage.jsx#L68-L69) (`age=8, level='CE2'`) | Difficulty is hardcoded or manually picked, never derived from the stored profile. |

---

## 3. Current Exercise System Findings

**Three parallel generation systems, none sharing a difficulty source of truth:**

1. **Template generators** — `exerciseTemplates.js` → `generateExercises({subject,type,level,count})`. `level ∈ {easy,medium,hard}` maps to number ranges (`operandRange`: easy `[1,10]`, medium `[10,99]`, hard 3–4 operands). Level is passed in by the caller; nothing infers it from the child.
2. **Mixed engine** — `mixedEngine.js`. The **only** system with an age model: `CONFIGS = {CP,CE1,CE2,CM1}` defining `maxNum`, allowed `ops`, `multiTable`, `allowDiv`, `allowParen`; `AGE_TO_LEVEL = {6:CP,7:CE1,8:CE2,9:CM1}`. **But:** range is 6–9 only, default is age 8 / CE2 (× and ÷ **on**), and the level is a child-facing picker in `MixedModePage`, easily overridden.
3. **Static content + exams** — `gradeBand`-tagged activities and JSON exams with `facile/moyen/difficile` tiers. Difficulty selected via UI/URL, not the profile.

**Subject inventory (12):** Mathématiques, Français, Nederlands, Anglais, Espagnol, Raisonnement, Histoires, Sciences, Histoire & Géo, Logique & Réflexion, Éducation Financière, Informatique. Each present across `grade-2…grade-6` module folders. Metadata present per activity: `id`, `subject`, `gradeBand[]`, `featured`. **Metadata absent:** `ageMin/Max`, `gradeMin/Max`, `skill`, `prerequisites`, `operationTypes`, `numberRange`, `cognitiveLoad`, `difficulty` (as a normalized scalar).

---

## 4. Problems Detected (exact)

1. **No age collected.** `OnboardingFlow.jsx` (steps: language → name → theme) never asks age or grade; profile `age` is permanently the default `8`. → [profileStore.js:7](src/services/storage/profileStore.js#L7), [OnboardingFlow.jsx](src/features/onboarding/OnboardingFlow.jsx).
2. **No grade field at all.** Nothing stores `schoolGrade`. `gradeBand` lives only on content, never on the child, so content cannot be filtered to the child's grade.
3. **Multiplication/division reachable by young children.** `mixedEngine` default level CE2 enables ×/÷; `PracticePage` serves `multiplication P3/medium` unconditionally; exam library lists `tables-multiplication` to everyone. A 5- or 6-year-old hits all three. → [mixedEngine.js:11-15](src/features/exerciseGenerator/mixedEngine.js#L11-L15), [PracticePage.jsx:48](src/features/practice/PracticePage.jsx#L48).
4. **No floor content for ages 5–6.** Catalog is strictly **P2–P6** (`gradeCatalog`), no P1/CP/maternelle. An 8-year-old who is behind, or any 5-year-old, has nothing appropriately easy. → [catalog.js:122](src/features/curriculum/catalog.js#L122).
5. **"Too easy for older kids" has no mechanism.** Mastery data (`progressStore`) and weak areas (`errorHistoryStore`) are computed but **never feed back** into what is generated next. A 9-year-old acing P3 content is never escalated.
6. **Difficulty source-of-truth is fragmented** across three systems with incompatible vocabularies (`easy/medium/hard` vs `facile/moyen/difficile` vs `CP/CE1/CE2/CM1` vs `P2…P6`).
7. **Grade ≠ age decoupling is impossible** — the contract's central requirement (a 9-year-old in 2nd grade) cannot be expressed because neither grade nor a grade/age reconciliation exists.
8. **No parent override surface.** Parental controls cannot allow/block multiplication, division, timed quizzes, or set a max difficulty. → [parentalStore.js:4-9](src/services/storage/parentalStore.js#L4-L9).
9. **No diagnostic.** Level is never measured, only (would be) assumed from an age that isn't even collected.
10. **Activities lack normalized difficulty metadata**, so an engine cannot rank or gate them programmatically.

---

## 5. Proposed Child Profile Model

Extend `profileStore.js` (additive, versioned migration — keep `lena:profile:v1` readable, default missing fields):

```js
childProfile = {
  // existing: id, name, identity, avatarId, themeId, language, settings, streak…
  age,                     // number — NOW COLLECTED in onboarding
  schoolGrade,             // 'P1'|'P2'|'P3'|'P4'|'P5'|'P6' (Belgium primaire)
  countrySystem,           // 'BE-fr' | 'BE-nl' | 'FR'  (drives grade label mapping)
  preferredLanguage,       // existing `language`
  adaptiveModeEnabled,     // bool — default true
  preferredDifficultyMode, // 'auto' | 'easy' | 'normal' | 'challenge'
  parentSelectedLevel,     // null | grade override set by parent
  detectedSkillLevel,      // { math, reading, logic } 0–100, set by diagnostic + updated by engine
  strengths,               // [skillKey]   (derived, cached)
  weaknesses,              // [skillKey]   (derived from getWeakAreas + mastery)
  createdAt, updatedAt
}
```

Grade label mapping (display only — store the canonical `P1…P6`):

| Canonical | BE primaire | FR équivalent | Typical age |
|-----------|-------------|---------------|-------------|
| P1 | 1ère primaire | CP | 6 |
| P2 | 2ème primaire | CE1 | 7 |
| P3 | 3ème primaire | CE2 | 8 |
| P4 | 4ème primaire | CM1 | 9 |
| P5 | 5ème primaire | CM2 | 10 |
| P6 | 6ème primaire | 6e | 11 |

> Note: the contract lists CP/CE1/CE2/CM1/CM2 **and** P1–P6. These are the same ladder in two countries — store one canonical key (`P1…P6`), render the localized label from `countrySystem`. Add **P1** content (does not exist yet) for the age-5/6 floor.

---

## 6. Proposed Difficulty Matrix

A single resolver — `resolveDifficulty({age, grade, performance, parent})` — producing an **allowed-skill set + number ranges**, replacing all three ad-hoc systems. Base table keyed by canonical grade (age used only to reconcile when grade is missing or contradicts mastery):

| Grade (age) | Number range | Allowed | Blocked (unless parent enables) |
|-------------|--------------|---------|-------------------|
| **P1 (5–6)** | 0–10 | counting, quantities, addition 0–5, shapes, colors | subtraction>10, ×, ÷ |
| **P2 (6–7)** | 0–20 | add/sub 0–20, comparison, basic word problems | ×, ÷ |
| **P3 (7–8)** | 0–100 | add/sub 0–100, tables ×2/×5/×10, simple geometry, reading basics | full ×, ÷, fractions |
| **P4 (8–9)** | 0–1000 | full tables, simple ÷, money, grammar basics | multi-step ÷, advanced fractions |
| **P5 (9–10)** | 0–10000 | multi-step, ×/÷, fractions intro, advanced vocab, comprehension | algebra |
| **P6 (10–11)** | large | multi-step, decimals, fractions ops, % intro | — |

**Reconciliation rules (the contract's core requirement):**

```
base = matrix[grade ?? gradeFromAge(age)]
if grade < gradeFromAge(age):  difficulty = down(base)        // behind → ease
if grade > gradeFromAge(age):  difficulty = up(base, capped)  // ahead → raise carefully
if rollingAccuracy < 0.5:      difficulty = down(difficulty)  // struggling
if rollingAccuracy > 0.85 && fast: difficulty = up(difficulty) // mastering
difficulty = clamp(difficulty, parent.minLevel, parent.maxLevel)
allowedSkills = base.allowed ∪ parent.explicitlyAllowed  −  base.blocked
```

This maps cleanly onto existing `mixedEngine.CONFIGS` (extend with a `P1` config + rename CP/CE1… to canonical keys) and onto exam `facile/moyen/difficile` tiers.

---

## 7. Proposed Exercise Metadata

Add to every activity (and emit from every generator) a normalized descriptor; **no exercise served without it** — enforce via a `validateExercise()` guard in `exerciseEngine.js`:

```js
exercise.meta = {
  id, subject, module, skill,           // skill = canonical taxonomy key e.g. 'math.multiplication.tables'
  ageMin, ageMax, gradeMin, gradeMax,   // gate window
  difficulty,                           // 1–5 normalized scalar
  prerequisites: [skillKey],            // gate: hide until prereqs mastered
  operationTypes: ['+','-','×','÷'],     // for parent allow/block matching
  numberRange: [min, max],
  cognitiveLoad: 1|2|3,
  estimatedTimeSec,
  supportModeAvailable, explanationAvailable
}
```

Backfill strategy: derive `ageMin/Max` + `gradeMin/Max` from existing `gradeBand[]` (cheap, programmatic), then hand-tune `skill`/`prerequisites`/`operationTypes` per generator. Generators already emit `subject`,`type`,`level` — extend the `base()` builder in `exerciseTemplates.js` to attach `meta`.

---

## 8. Proposed Adaptive Engine

New module: `src/services/learning/adaptiveEngine.js` — **pure, stateless, testable.**

```
Inputs:  childProfile, parentSettings,
         progressSnapshot (progressStore), weakAreas (errorHistoryStore),
         recentSession {accuracy, avgTimePerAnswer, attempts}
Outputs: {
  recommendedDifficulty,   // 1–5 + grade key
  allowedSkills:  [skillKey],
  blockedSkills:  [skillKey],   // hard gate — used to filter content & generators
  nextExerciseType,
  reviewTopics:   [skillKey],   // from weakAreas / 'failed' mastery
  challengeTopics:[skillKey],   // from 'mastered' + high accuracy
  requiresParentConfirmation: bool   // e.g. crossing into ×/÷ below recommended grade
}
```

Logic = §6 reconciliation + these loops, all using data that **already exists**:
- **Repeat-easier:** any `skill` with `status==='failed'` or in top `getWeakAreas()` → inject into `reviewTopics`, drop one difficulty band.
- **Unlock-harder:** `successStreak≥2 && accuracy>0.85` on a skill → add next skill in taxonomy to `challengeTopics`.
- **Block:** `skill.operationTypes ⊄ allowedSkills` → exclude from both generators and content lists (single choke point).
- **Parent confirm:** content above `recommendedDifficulty+1` or in a parent-gated operation → `requiresParentConfirmation`.

Every launcher (`PracticePage`, `MixedModePage`, exam library, games) calls the engine once and respects `allowed/blockedSkills` + `recommendedDifficulty` instead of hardcoding.

---

## 9. Proposed Settings UI

Extend [SettingsPage.jsx](src/features/settings/SettingsPage.jsx) (child-visible basics) + a PIN-gated **Parent** area extending [ParentalPage.jsx](src/features/parental/ParentalPage.jsx):

1. **Child Profile** — name, **age (new)**, **school grade (new)**, school system, language.
2. **Learning Level** — Auto Adaptive · Easy · Normal · Challenge (`preferredDifficultyMode`).
3. **Parent Controls** — allow multiplication / division / timed quizzes / advanced questions (toggles → `operationTypes` allow-list); max daily difficulty; daily study time (extend existing `dailyLimitMinutes`).
4. **Progress Insights** — strengths / weaknesses / recommended next steps (render `adaptiveEngine` output + existing `getProgressOverview` mastery).
5. **Safety** — child-friendly mode, no inappropriate difficulty jumps (cap step size in engine), no frustration loop (force review injection after N consecutive fails).

---

## 10. Proposed Diagnostic Test

New flow `src/features/onboarding/DiagnosticFlow.jsx`, run once after grade is collected (skippable → falls back to grade defaults). 10–15 adaptive items, **reusing existing generators** (`exerciseTemplates`, `mixedEngine`):

- counting & quantity (2) · addition (2) · subtraction (2) · multiplication-readiness (2) · reading comprehension (2) · logic/pattern (2) · attention/sequence (1–2).
- Start at grade-expected difficulty; step up on correct, down on wrong (binary-search the level → short by design).
- Output: `detectedSkillLevel{math,reading,logic}`, `recommendedModules`, `blockedModules`, `reviewModules` → written to profile; seeds the adaptive engine so day-1 content is right without waiting for history.

---

## 11. Step-by-Step Implementation Plan

| Phase | Deliverable | Touches | Risk |
|-------|-------------|---------|------|
| **A** | Profile model: add `schoolGrade`, adaptive fields + migration; collect age+grade in onboarding | `profileStore.js`, `OnboardingFlow.jsx` | Low — additive |
| **B** | Settings/Parent UI for the new fields + operation toggles | `SettingsPage.jsx`, `ParentalPage.jsx`, `parentalStore.js` | Low |
| **C** | Difficulty matrix module + add **P1** configs/labels; unify difficulty vocabulary | new `difficultyMatrix.js`, `mixedEngine.js` CONFIGS | Medium |
| **D** | Exercise metadata: `meta` on generators + backfill from `gradeBand`; `validateExercise()` guard | `exerciseTemplates.js`, `exerciseEngine.js`, content `activities.js` | Medium — broad but mechanical |
| **E** | `adaptiveEngine.js` (pure) + unit tests, wired to `progressStore`/`errorHistoryStore` | new `adaptiveEngine.js`, `tests/` | Medium |
| **F** | Diagnostic flow | new `DiagnosticFlow.jsx` | Low (isolated) |
| **G** | Route launchers through the engine (the actual behavior fix) | `PracticePage.jsx`, `MixedModePage.jsx`, exam library, games | **High — most behavioral risk** |
| **H** | Parent insights (strengths/weaknesses/next steps) | `SettingsPage.jsx`/`StatsPage.jsx` | Low |

Ship A→B→C→D→E behind `adaptiveModeEnabled` (default off in dev), validate with tests, then flip G last.

---

## 12. Files To Modify First

1. [src/services/storage/profileStore.js](src/services/storage/profileStore.js) — add `schoolGrade` + adaptive fields + migration. **Everything depends on this.**
2. [src/features/onboarding/OnboardingFlow.jsx](src/features/onboarding/OnboardingFlow.jsx) — add age + grade steps (currently the data gap).
3. New `src/services/learning/difficultyMatrix.js` — the §6 table + reconciliation.
4. [src/features/exerciseGenerator/mixedEngine.js](src/features/exerciseGenerator/mixedEngine.js) — add P1 config, canonical keys, stop defaulting to CE2.
5. New `src/services/learning/adaptiveEngine.js` — the decision core.

---

## 13. Files To Avoid Touching For Now

- **Content JSON exams** (`src/content/exams/**`) and generated activity files — large, generated; gate them via the engine instead of editing. Touch only in Phase D backfill, programmatically.
- **Game internals** (`src/features/jeux/*`) — wire to the engine in Phase G last; don't refactor their generators now.
- [src/services/learning/levelSystem.js](src/services/learning/levelSystem.js) — this is XP/gamification, **orthogonal** to skill difficulty; leave it. Do not overload it with skill logic.
- `firebase/syncService.js` and auth — out of scope; only ensure new profile fields sync (additive) once the model settles.
- `LocaleContext` / theming — unrelated.

---

## 14. Risks

- **Migration:** existing local profiles have `age:8`, no grade → engine must degrade gracefully (treat missing grade as `gradeFromAge(age)` and prompt for grade on next launch). Don't wipe `lena:profile:v1`.
- **Three difficulty vocabularies** must be unified carefully or content gets mis-gated. Build a single mapping table and test it.
- **Phase G is where behavior visibly changes** — a bug here can lock a child out of all content (over-blocking) or still leak ×/÷ (under-blocking). Gate behind a flag; add tests asserting "age 5 ⇒ no × / ÷ in any launcher."
- **No P1 content yet** — if grade P1 is selectable before P1 content exists, the child sees an empty catalog. Add minimal P1 content *or* clamp P1 to easiest P2 with reduced ranges as an interim.
- **Diagnostic frustration** — keep it ≤15 items and skippable, or onboarding abandonment rises.

---

## 15. Final Recommendation

Do **not** rewrite the content or engines. The adaptivity primitives already exist but are unconnected: `gradeBand` metadata, `mixedEngine.CONFIGS`, `progressStore` mastery, and `errorHistoryStore.getWeakAreas()`. The work is **plumbing, not invention.**

Highest-leverage, safest first move (Phases A–B): **collect grade + age and store them.** That single change unblocks everything and immediately lets you gate the three leak points (PracticePage, MixedMode default, exam library). Then introduce `difficultyMatrix` + `adaptiveEngine` as pure, tested modules (Phases C–E), backfill metadata from `gradeBand` (D), and only at the end route every launcher through the engine behind a feature flag (G), with a regression test that proves a 5-year-old can never receive multiplication or division anywhere in the app.

Acceptance answers — exercises generated in `exerciseTemplates.js` / `mixedEngine.js` / `PracticePage.jsx`; too-hard cases are mixedEngine's CE2 default + PracticePage's fixed P3 multiplication + the open exam library; too-easy is the absence of any escalation from mastery data; missing metadata is age/grade/skill/prereq/operationType on activities; age+grade belong in `profileStore`; difficulty = `difficultyMatrix` reconciliation of grade∪age∪performance; parent overrides via an operation allow-list clamped in the engine; modify `profileStore` + `OnboardingFlow` first; avoid content JSON and `levelSystem` for now; safest order is A→B→C→D→E→F→G→H behind a flag.
