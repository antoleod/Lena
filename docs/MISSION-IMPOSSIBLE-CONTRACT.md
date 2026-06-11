# MISSION IMPOSSIBLE — LIVING CONTRACT & WORKFLOW

> Status: **TRACKS 1·2·3·4.1 BUILT (build green, 20 tests pass, committed)** — remaining: rules deploy + e2e (1.8), launcher routing (2.5, high-risk/deferred). Mission Impossible playable at `/mission-impossible`. · Last updated: 2026-06-11
> Spec: [`new categori`](new%20categori) · Audits: [`../AUDIT-ADAPTIVE-LEARNING.md`](../AUDIT-ADAPTIVE-LEARNING.md), [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
>
> **This is the durable memory of the project.** Tick the boxes in §5 as work lands and
> append to the §7 Decisions log every session, so nothing is lost between sessions.
> When you finish a step: change `[ ]`→`[x]`, add the file(s) touched, and date it.

---

## 1. GOAL (one paragraph)

Add a pilot category **Mission Impossible** + the foundation of an adaptive "Learning Brain":
(1) Firebase persists **only exercises the child actually played** (answers, time, result) as
a real history, and (2) an adaptive engine raises difficulty on mastery and reinforces on
struggle. Age/grade are context; **performance decides.** Full schema in [`new categori`](new%20categori).

---

## 2. GROUND TRUTH FROM THE AUDIT — VERIFIED (do not re-derive)

> ⚠️ Corrects earlier assumptions. **Firebase already exists. Adaptive profile fields already exist.**

| Area | Reality today | File |
|------|---------------|------|
| **Firebase** | **EXISTS & live.** Auth + Firestore configured. | `src/services/firebase/{firebaseConfig,authService,syncService,audioService}.js` |
| **Cloud sync** | **Whole-store blobs** pushed to `users/{uid}` doc, debounced 8s + every 2min. **NOT per-exercise events.** ← the gap. | `src/services/firebase/syncService.js` (`pushToCloud`, `STORE_KEYS`) |
| **Child profile** | Single profile `lena:profile:v1`. **Already has** `schoolGrade`, `countrySystem`, `adaptiveModeEnabled`, `preferredDifficultyMode`, `detectedSkillLevel{math,reading,logic}`, `strengths`, `weaknesses`. **No `childId` for multi-child.** | `src/services/storage/profileStore.js` |
| **Mastery signal** | Per-question `unseen/shaky/failed/mastered` + streaks already computed. **Used only for display today.** | `src/services/storage/progressStore.js` (`recordQuestionOutcome`, `getProgressOverview`) |
| **Weak areas** | `getWeakAreas()` ranks weakest `subject:type`. Seed for adaptation. | `src/services/storage/errorHistoryStore.js` |
| **Generators** | 3 parallel paths, no shared difficulty source: templates, `mixedEngine`, static/exam tiers. | `exerciseTemplates.js`, `mixedEngine.js`, `content/exams/**` |
| **Adaptive engine** | **Does NOT exist yet** — proposed in audit §8. | (new) `src/services/learning/adaptiveEngine.js` |

### The THREE capture hooks (critical — there is NO single sink today)

Phase 4 `playedExercise` events must be emitted at **all three**, via one shared helper:

| Flow | Route | Current sink (where to tap) | File |
|------|-------|------------------------------|------|
| Activities/exercises | `/activities`, `/cahier` | `recordQuestionOutcome(activityId, questionId, isCorrect)` | `services/storage/progressStore.js:132` |
| Games | `/jeux/*` | `saveGameSession()` via `useGameSession` | `shared/hooks/useGameSession.js`, `services/storage/gameProgressStore.js:39` |
| Exams | `/exam/*` | `examHistoryStore` | `features/exam/library/examHistoryStore.js` |

---

## 3. NON-NEGOTIABLE RULES (carry forward every session)

1. Save **only what the child played** — never generated-but-unplayed questions.
2. **Local-first.** App keeps working offline; Firebase is a sync target, not a dependency.
3. **Performance is the main signal.** Age & grade are context / safety ceilings only.
4. No naïve `if score>80 then level++`. No Easy/Medium/Hard as the whole model.
5. Firestore only — keep documents small; prefer session summaries over per-event spam.
6. Reuse existing `unseen/shaky/failed/mastered` + `getWeakAreas()` — don't reinvent them.
7. **Additive only** to `profileStore`/sync — never wipe `lena:profile:v1` or break existing sync.

---

## 4. DATA SHAPES (locked — schema source of truth)

`playedExercise`, `learningDNA`, `exerciseMeta`, learning events and the Firestore
collections are defined in [`new categori`](new%20categori) Phases 2–5 & 10.

**Decisions (verified against call sites):**
- **Capture at the CALL SITE, not inside the stores.** Store fns only receive `isCorrect`;
  the rich data (`childAnswer`, `question`, `expectedAnswer`, `subject`, response time) lives
  in the components. Tap there. → confirmed in `MultipleChoiceActivity.handleAnswer` (all
  fields present; only a per-question timer must be added at `resetQuestion`).
- **Two flavors of "played":** activities/exams emit **rich per-question** events; games emit
  **session-summary** events only (no per-question event exists without per-game instrumentation).
  Don't wire all three hooks identically.
- **Firestore path:** `users/{uid}/children/{childId}/played_exercises` (multi-child). Separate
  subcollection — does NOT touch the existing whole-blob sync.
- **Multi-child = data-model tagging only for now.** Tag every event + DNA with `childId`.
  The multi-profile storage rewrite + profile switcher is a **later track**, not Track 1.
- **Session boundary:** none exists today (`sessionStore.js` is a snapshot aggregator). Define
  a lightweight `sessionId` (generated on app open / Mission start) to anchor per-session DNA.

---

## 5. WORKFLOW — tick as you go

Bottom-up: each layer testable before the next. Reconciled with audit plan A→H.

### Track 1 — Real-only Firebase history (pillar 1)
- [x] **1.1** `childId` decided: multi-child, tag events with childId (data-model only; no profile rewrite now). · 2026-06-11
- [x] **1.2** `playedEventsStore.js` — local-first queue + sessionId (30-min idle window). · 2026-06-11 → `services/learning/playedEventsStore.js`
- [x] **1.3** `recordPlayedExercise(event)` helper. · 2026-06-11 → `services/learning/recordPlayedExercise.js`
- [x] **1.4** Activities wired (rich, per-question): `MultipleChoiceActivity` (+ timer) and 4 renforcement activities (trace/observe/coloring/grid). · 2026-06-11
- [x] **1.5** Games wired: `useGameSession.saveSession` → session-summary event. · 2026-06-11 → `useGameSession.js`
- [x] **1.6** Exams wired: `saveHistoryEntry` → session-summary event. · 2026-06-11 → `examHistoryStore.js`
- [x] **1.7** `syncPlayedEvents(uid)` drains queue → `users/{uid}/children/{childId}/played_exercises` (batched, idempotent by eventId, retries offline). Hooked into `startAutoSync`. Build green. · 2026-06-11 → `syncService.js`
- [x] **1.7b** Firestore security rules written (owner-only, recursive under `users/{uid}`) + `firebase.json`. · 2026-06-11 → `firestore.rules`, `firebase.json`. **⚠ Must be DEPLOYED** (`firebase deploy --only firestore:rules` or paste in console) — not auto-applied.
- [ ] **1.8** Verify end-to-end: deploy rules → play 3 exercises offline → reconnect → exactly 3 docs in Firestore with answer+time+result, no unplayed ones. (Needs a live login + rules deployed.)

### Track 2 — Adaptive intelligence (pillar 2)
- [x] **2.1** `adaptiveEngine.js` — pure/stateless, 9 passing tests. Builds on `gradeModel.js`. · 2026-06-11 → `services/learning/adaptiveEngine.js`, `tests/adaptive-engine.test.js`
- [x] **2.2** Mastery model: `classifySkills` (accuracy≥0.85 + not-mostly-slow + ≥4 attempts). · 2026-06-11
- [x] **2.3** Struggle model: low accuracy / mostly-slow → `reviewTopics` ∪ `getWeakAreas()`. · 2026-06-11
- [x] **2.4** `learningDNA.js` — per-session summary (distinct sessionIds), synced via blob `learningDNA`. · 2026-06-11 → `services/learning/learningDNA.js`. DNA folds in on cloud flush (avoids double-count).
- [ ] **2.5** Route launchers through `decideNext()` (PracticePage/MixedMode/exam/games). ← behavioral, behind `adaptiveModeEnabled` (audit Phase G, highest risk).

### Track 3 — Mission Impossible pilot (the visible module)
- [x] **3.1** Route `/mission-impossible` + page + Pratiquer hub card. · 2026-06-11 → `features/missionImpossible/MissionImpossiblePage.jsx`, `AppRouter.jsx`, `PratiquerHubPage.jsx`
- [x] **3.2** `missionEngine.js` — 5-band ladder, step up/down on streaks, pure + 8 tests. · 2026-06-11 → `features/missionImpossible/missionEngine.js`, `tests/mission-engine.test.js`
- [x] **3.3** Every challenge emits `recordPlayedExercise` (rich); DNA folds in via flush. · 2026-06-11
- [x] **3.4** `detectLimit()` reports current band on the done screen. · 2026-06-11

### Track 4 — Settings & polish
- [x] **4.1** Parent controls honored by the engine: `applyParentControls` blocks ×/÷ and caps difficulty at `maxDifficultyGrade`. Wired into DNA's `decideNext`. Store (`learningControls`) + partial UI already existed (Phase B). · 2026-06-11 → `adaptiveEngine.js`, `learningDNA.js`. **TODO:** confirm ParentalPage UI exposes all toggles.
- [ ] **4.2** Privacy/cost pass: small docs, session summaries, no Storage. (Mostly satisfied — played events are lightweight, DNA is per-session.) → `syncService.js`

---

## 6. ACCEPTANCE = the MVP checklist in [`new categori`](new%20categori). Not done until every box there passes.

---

## 7. DECISIONS LOG (append-only — this is the memory)

| Date | Decision | Why |
|------|----------|-----|
| 2026-06-11 | Spec rewritten; Phase 1 reframed as "verify existing audit". | Audits already existed. |
| 2026-06-11 | **Corrected ground truth: Firebase + adaptive profile fields ALREADY exist.** | syncService.js + profileStore.js Phase-A fields verified. |
| 2026-06-11 | Played events go to subcollection `users/{uid}/played_exercises`, separate from blob sync. | Keep per-event writes small; don't disturb existing whole-store sync. |
| 2026-06-11 | 3 capture hooks identified (progress / game / exam). One shared `recordPlayedExercise()`. | No single sink exists today. |
| 2026-06-11 | **Multi-child** chosen. Each child has a `childId`; events/DNA tagged with it. | User decision. |
| 2026-06-11 | **DNA updates per-session summary** (accumulate local, upload summary at session end). | Minimize Firestore writes/cost. |
| 2026-06-11 | Track 1 implementation started. | User decision. |
| 2026-06-11 | Capture at CALL SITE (rich), not inside stores (boolean-only). Games = session-summary flavor. | Store fns only get `isCorrect`; rich data is in components. |
| 2026-06-11 | Vertical slice shipped: playedEventsStore + recordPlayedExercise + MC activity wired + syncPlayedEvents → subcollection. Build green. | — |
| _open_ | Firestore security rules for `children/{childId}/played_exercises` not yet written/deployed. | Needed before cloud writes succeed in prod. |

---

## 8. OPEN QUESTIONS (resolve before the track that needs them)

1. **Multi-child or single?** (blocks 1.1)
2. **DNA update cadence** — per event or batched per session? (blocks 2.4)
3. **Mission Impossible UI** — clone which existing game shell for fastest pilot? (blocks 3.1)
4. Does the existing whole-blob sync stay, or do played events eventually replace parts of it?
