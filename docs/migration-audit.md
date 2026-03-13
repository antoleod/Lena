# Migration Audit and Consolidation Map

## Scope

Audited repositories:

- `Lena` as the current base
- `Maths` as a legacy math source
- `poeme` as a language and story source
- `Val` as an advanced math, logic, and progression source

This document defines:

- what to keep
- what to refactor
- what to partially reuse
- what to rewrite
- what to delete
- the target React-first architecture for the consolidated platform

## Executive Decision

The new platform should **not** preserve any existing repository architecture wholesale.

Reason:

- `Lena` contains the best starting point for current React integration and the best structured small math registry, but it is still dominated by legacy static pages and global scripts.
- `Maths` is a single-file legacy application. It is useful only as a source of exercise ideas and isolated mechanics.
- `poeme` contains valuable language-game and story content, but its implementation is also global-script based and partially incomplete.
- `Val` contains the strongest reusable generator logic and the best ideas for progression, dashboards, and contextual exercises, but it is also a monolithic DOM application.

The correct strategy is:

- keep `Lena` only as the migration host
- extract the best engines, content, and generators from all repos
- move them into a professional modular React architecture
- delete legacy wrappers after equivalent React modules exist

## Repository Findings

### 1. Lena

Primary findings:

- `src/App.jsx` is a React router, but it mainly routes into legacy static content and injected shell scripts.
- `public/js/juego.js` is a very large monolith at about 6,414 lines and about 313 KB.
- `public/games/gameData.js` is a very large global content dump with mixed responsibilities.
- `public/js/storage.js`, `public/js/core/storage.js`, and `public/js/appData.js` show overlapping persistence responsibilities.
- `public/js/new-games/registry.js` is the cleanest current example of structured, portable exercise data.
- `public/js/new-games/engine.js` shows a workable direction for a reusable exercise runner, but it is still DOM-coupled and limited.
- `mobile/src/data/games/*` contains a simplified portable data layer that is useful as a migration bridge.

Strengths to reuse:

- portable level registries in `public/js/new-games/registry.js`
- per-level progress model in `public/js/core/storage.js`
- simple React shell and routing bootstrapping in `src/`
- multilingual story dataset in `public/games/storySets.js`
- math mini-game ideas in `public/games/*.js`
- mobile content simplifications in `mobile/src/data/games/*`

Weaknesses to remove:

- static legacy page wrappers in `public/legacy/*`
- injected shell assets in `src/App.jsx`
- giant monolithic `public/js/juego.js`
- duplicated progress and profile storage layers
- mixed Spanish/French naming and mixed legacy conventions

### 2. Maths

Primary findings:

- the repository is effectively a single large `index.html`
- there is no maintainable module structure
- it contains legacy game ideas, visual treatments, and activity flows

Strengths to reuse:

- isolated exercise ideas
- simple child-facing game loops
- some low-friction reward and feedback patterns

Weaknesses to remove:

- entire architecture
- inline CSS and JS monolith
- hard coupling between content, DOM, and state

Decision:

- use as content and mechanic reference only
- do not preserve any structural code as architecture

### 3. poeme

Primary findings:

- best raw source for French language exercise coverage
- `gameData.js` contains compact datasets for image-word matching, dictation, copy-writing, hidden words, matching columns, mini stories, phrase completion, intruder detection, revision, and seasonal content
- there is an unused or incomplete attempt at modularization in `games/BaseGame.js`
- there are separate feature scripts such as `associeImageMot.js`, `dicteeAudio.js`, `miniHistoire.js`, `phraseATrous.js`, `relierColonnes.js`, `memory.js`, `meteoNature.js`, `saisonMystere.js`

Strengths to reuse:

- language-game catalog
- compact French exercise content
- mini-story concepts
- dictation and copy-writing exercise intent
- weather, season, and revision themes

Weaknesses to remove:

- global window-based architecture
- DOM-specific implementations
- incomplete framework abstraction in `games/BaseGame.js`
- some content is too thin and needs expansion for production use

Decision:

- migrate most content
- reimplement engines in React-first shared modules
- keep only data and pedagogical structure from existing scripts

### 4. Val

Primary findings:

- strongest generator logic for advanced math, fractions, geometry, measurement, data/statistics, and word problems in `vlaanderen.js`
- strongest progression and dashboard concepts in `script.js`
- useful ideas for streaks, badges, XP, shop, sessions, and contextual practice
- architecture is still monolithic and DOM-driven

Strengths to reuse:

- generator patterns from `vlaanderen.js`
- contextual problem generation from `script.js`
- progression concepts: XP, streaks, history, records, badge unlocks
- topic taxonomy for more advanced curriculum expansion

Weaknesses to remove:

- monolithic DOM rendering
- mixed UI, generation, storage, and translation concerns in one file
- non-target age coverage needs filtering because some items are beyond current phase scope

Decision:

- extract generator logic and progression ideas
- rewrite runtime architecture
- keep only age-appropriate generators for current product phase

## Classification Map

### A. Keep and migrate mostly as-is

- `public/js/new-games/registry.js`
  - best current structured exercise registry
  - should become typed content packs plus engine input schemas
- `public/games/storySets.js`
  - good reusable multilingual story content
  - should move to content modules with normalized metadata
- `mobile/src/storage/progress.js`
  - simple portable storage pattern worth preserving conceptually

### B. Keep but refactor

- `public/js/new-games/engine.js`
  - keep engine behavior ideas
  - refactor into framework-agnostic exercise engine plus React renderer components
- `public/js/core/storage.js`
  - keep normalized level progress ideas
  - refactor into a single platform-agnostic repository API
- `mobile/src/data/games/*`
  - keep as simplified source packs
  - normalize into shared curriculum data files
- `poeme/gameData.js`
  - keep most content
  - refactor into subject-specific content modules with metadata
- `Val/vlaanderen.js`
  - keep generators
  - refactor into pure generator functions per topic

### C. Partially reuse

- `public/games/*.js`
  - reuse selected math, logic, dictation, and reading content
  - discard embedded DOM logic
- `Maths/index.html`
  - reuse exercise flows and visual game concepts only
- `Val/script.js`
  - reuse XP, streak, history, and reward concepts
  - discard its rendering and state wiring
- `poeme/*.js`
  - reuse educational intent and some text pools
  - discard global runtime code

### D. Rewrite from scratch

- React application shell and feature architecture
- navigation and curriculum browsing
- exercise runtime components
- profile and progress services
- rewards and dashboard UX
- accessibility and child-focused interaction model
- content metadata and curriculum taxonomy

### E. Delete

- `public/legacy/*`
- `src/LegacyPage.jsx`
- `src/LegacyAutoPage.jsx`
- legacy shell asset injection once replacement exists
- `public/js/juego.js`
- obsolete duplicated storage layers after consolidation
- old generated MPA wrappers once feature routes are native React

## Key Technical Problems To Fix

### Architecture

- UI, business logic, content, and storage are mixed together
- global window state is used heavily
- content is trapped in browser-only scripts
- large files prevent safe extension
- multiple persistence systems create inconsistency risk

### Product consistency

- current taxonomy is not aligned to Belgian 2nd and 3rd primary structure
- subject boundaries are unclear
- some content is in Spanish while product direction is French-first with Dutch exposure
- quality varies heavily between games

### React Native readiness

- current engines are DOM-bound
- most exercise logic is not isolated from rendering
- progress rules are not defined as shared application services

### Content quality

- some content contains encoding issues or mojibake in legacy files
- some language content is too thin for a professional progression
- some advanced generators need age filtering for the first release scope

## Proposed Target Architecture

```text
src/
  app/
    providers/
    routing/
    layout/
    store/
  features/
    home/
    curriculum/
    mathematics/
    french/
    dutch/
    stories/
    language-games/
    progress/
    profile/
    rewards/
    settings/
  engines/
    core/
    multiple-choice/
    matching/
    sorting/
    dictation/
    story/
    base-ten/
    sequencing/
  content/
    curriculum/
      grades/
      subjects/
      skills/
    mathematics/
    french/
    dutch/
    stories/
    shared/
  shared/
    components/
    ui/
    hooks/
    utils/
    types/
    theme/
    accessibility/
  services/
    storage/
    progress/
    rewards/
    audio/
```

## Domain Model Direction

Every activity should be normalized around metadata such as:

- `id`
- `slug`
- `subject`
- `subskill`
- `gradeBand`
- `language`
- `difficulty`
- `estimatedDurationMin`
- `instructions`
- `correctionType`
- `hints`
- `tags`
- `accessibility`
- `originRepo`
- `engineType`

Recommended content split:

- `content/mathematics`
  - numbers
  - place-value
  - addition
  - subtraction
  - multiplication
  - division
  - fractions
  - mental-calculation
  - logic
  - text-problems
- `content/french`
  - reading
  - vocabulary
  - spelling
  - grammar
  - dictation
  - sentence-building
  - comprehension
- `content/dutch`
  - beginner-vocabulary
  - school-life
  - picture-word
  - simple-comprehension
- `content/stories`
  - guided-stories
  - comprehension
  - sequencing
- `content/shared`
  - seasonal content
  - nature
  - emotions
  - reward copy

## Engine Strategy

The platform should not create one custom renderer per game. It should consolidate into a small engine set:

- multiple-choice engine
  - reuse for possessives, logic, reading comprehension, word problems, dictation choices
- matching engine
  - image-word, columns, pair matching
- sequencing engine
  - number sequences, story order, pattern order
- sorting engine
  - category sorts, intruder detection variants, classification
- dictation engine
  - audio prompt, typed answer, tolerance rules
- story engine
  - read mode, listen mode, quiz mode, completion tracking
- base-ten engine
  - build/decompose and subtraction transformation

This converts many legacy "games" into data variations of a smaller engine family.

## Migration Map by Source

### From Lena

Migrate:

- structured math level generation concepts from `public/js/new-games/registry.js`
- story content from `public/games/storySets.js`
- selected math datasets from `public/games/*.js`
- progress entry shape from `public/js/core/storage.js`
- mobile simplified game packs for quick normalization reference

Delete after replacement:

- `public/js/juego.js`
- `public/legacy/*`
- legacy route wrappers
- redundant storage APIs

### From Maths

Migrate:

- only mechanic ideas and possibly some child-facing interaction flows

Delete or ignore:

- all architecture and inline implementation

### From poeme

Migrate:

- image-word association
- dictation concepts
- copy-writing exercises
- matching columns
- hidden words
- intruder detection
- mini stories
- phrase completion
- revision mode ideas
- nature/weather/season content

Rewrite:

- all runtime code into shared engines

### From Val

Migrate:

- advanced generator logic from `vlaanderen.js`
- contextual word-problem templates
- fractions, geometry, measurement, data/statistics generators
- dashboard and progression concepts

Rewrite:

- rendering, state management, and persistence

Filter:

- keep only age-appropriate subsets for 2nd and 3rd primary launch

## Delivery Plan

### Phase 1

- create the new folder structure under `src/`
- define shared types for activity metadata and engine contracts
- define one unified storage and progress service

### Phase 2

- migrate current structured math games first
- move stories into normalized content packs
- build curriculum landing pages by subject and level

### Phase 3

- migrate `poeme` language games into shared engines
- add French-first reading, dictation, matching, and sentence activities
- add Dutch beginner vocabulary packs

### Phase 4

- extract `Val` generators into pure modules
- add contextual problem solving, reasoning, and more advanced grade-3 math
- introduce dashboard, progress summaries, and rewards

### Phase 5

- remove all legacy wrappers and dead files
- tighten accessibility, testing, and visual consistency
- prepare shared logic boundaries for React Native reuse

## Immediate Next Build Recommendation

Build the first consolidated production slice around:

- subject home screen
- mathematics section
- French section
- stories section
- one shared progress service
- one shared metadata model
- engines:
  - multiple-choice
  - story
  - matching
  - base-ten

This gives the project a stable modular spine before migrating the rest of the legacy catalog.
