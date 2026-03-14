# Project Documentation

## 1. Product overview

Lena is a React educational game for primary school children.

The current product direction is:

- game-first experience, not admin dashboard
- clear separation between `P2` and `P3`
- map as the main adventure flow
- subjects as a secondary library
- real progress, rewards and persistence
- extensible base for richer microgames

The app currently focuses on:

- mathematics
- French
- Dutch
- English
- Spanish
- reasoning
- stories

The strongest current paths are mathematics, French, reasoning and stories.

## 2. Tech stack

- React 18
- React Router 6
- Vite 5
- localStorage persistence

Main commands:

```bash
npm run dev
npm run build
npm run preview
```

## 3. Folder structure

```text
src/
  app/                 app root, routing, shell, providers
  content/             all subjects, grades, modules, world map data
  engines/             runtime engines, generation, validation, descriptors
  features/            pages and screen-level flows
  services/            profile, progress, rewards, session
  shared/              i18n, theme, contracts, gameplay helpers
public/
  service-worker.js    offline/pwa logic
docs/
  *.md                 project documentation
```

## 4. Architecture by layer

### App

Owns route composition and app shell.

Important files:

- `src/app/App.jsx`
- `src/app/routing/AppRouter.jsx`
- `src/app/layout/AppShell.jsx`
- `src/app/providers/*`

### Content

Owns curriculum, modules, generated activity descriptors and world data.

Important files:

- `src/content/<subject>/activities.js`
- `src/content/<subject>/generatedActivities.js`
- `src/content/<subject>/grade-2/modules.js`
- `src/content/<subject>/grade-3/modules.js`
- `src/content/worlds/worldMapData.js`

### Engines

Owns activity runtime, generator output, validation and engine lookup.

Important files:

- `src/engines/multiple-choice/MultipleChoiceActivity.jsx`
- `src/engines/base-ten/BaseTenActivity.jsx`
- `src/engines/story/StoryActivity.jsx`
- `src/engines/engineRegistry.js`
- `src/engines/activity-engine/activityDescriptor.js`
- `src/engines/generators/activityFactory.js`
- `src/engines/generators/exerciseGenerators.js`

### Features

Owns pages.

Important folders:

- `src/features/onboarding`
- `src/features/home`
- `src/features/map`
- `src/features/subject`
- `src/features/grade`
- `src/features/module`
- `src/features/activity`
- `src/features/shop`
- `src/features/history`
- `src/features/settings`

### Services

Owns persistence and session snapshots.

Important files:

- `src/services/storage/profileStore.js`
- `src/services/storage/progressStore.js`
- `src/services/storage/rewardStore.js`
- `src/services/session/sessionStore.js`

### Shared

Owns contracts, theme, i18n and gameplay helpers.

Important files:

- `src/shared/types/contentModels.js`
- `src/shared/types/exerciseModels.js`
- `src/shared/types/progressModels.js`
- `src/shared/gameplay/worldMap.js`
- `src/shared/gameplay/moduleJourney.js`
- `src/shared/i18n/LocaleContext.jsx`
- `src/shared/theme/app.css`

## 5. Runtime flow

Main player flow:

```text
Onboarding
-> Home
-> Map
-> World
-> Mission
-> Activity
-> Reward / Continue
```

Secondary flow:

```text
Subjects
-> Subject
-> Grade
-> Module
-> Activity
```

## 6. Main routes

- `/onboarding`
- `/`
- `/map`
- `/map/:worldId`
- `/map/:worldId/missions/:missionId`
- `/subjects`
- `/subjects/:subjectId`
- `/subjects/:subjectId/grades/:gradeId`
- `/subjects/:subjectId/grades/:gradeId/modules/:moduleId`
- `/subjects/:subjectId/grades/:gradeId/modules/:moduleId/:activityId`
- `/activities/:activityId`
- `/shop`
- `/history`
- `/settings`

Notes:

- `/subjects/.../modules/:moduleId/:activityId` is a compatibility redirect to handle broken relative activity links from old navigation states.
- `AppRouter` is reactive to profile changes, so finishing onboarding immediately unlocks `/`.

## 7. Current screen responsibilities

### Onboarding

File:

- `src/features/onboarding/OnboardingFlow.jsx`

Responsibility:

- choose UI language
- enter child name and age
- choose visual theme
- save complete profile

Important behavior:

- `Enter` submits the main CTA
- finishing onboarding writes profile and redirects to home

### Home

File:

- `src/features/home/HomePage.jsx`

Responsibility:

- profile summary
- streak
- rewards balance
- global progress
- primary CTA to continue adventure

### Map

Files:

- `src/features/map/MapPage.jsx`
- `src/features/map/WorldDetailPage.jsx`
- `src/features/map/MissionPage.jsx`

Responsibility:

- show world progression
- show world state: locked, active, in-progress, completed
- launch real missions and activities

### Subjects / Grade / Module

Files:

- `src/features/subject/SubjectsHubPage.jsx`
- `src/features/subject/SubjectPage.jsx`
- `src/features/grade/GradePage.jsx`
- `src/features/module/ModulePage.jsx`

Responsibility:

- browse subjects as library
- separate `P2` and `P3`
- show real modules and real activity plans
- avoid fake level buttons

### Activity

File:

- `src/features/activity/ActivityPage.jsx`

Responsibility:

- resolve activity
- materialize generated or static content
- choose engine
- save activity progress
- save level progress when relevant
- award crystals

### Shop / History / Settings

Files:

- `src/features/shop/ShopPage.jsx`
- `src/features/history/HistoryPage.jsx`
- `src/features/settings/SettingsPage.jsx`

Responsibility:

- cosmetics and rewards
- recent activity history
- profile, language, theme and logout

## 8. Content model

The intended product hierarchy is:

```text
Subject
-> Grade
-> Module
-> Mission
-> Level
-> Activity
```

In the current repo:

- `Subject`, `Grade` and `Module` are explicit in content
- `Mission` and `Level` are explicit in world map data
- `Activity` is the stable runtime unit

### Subject-level files

Per subject:

- manual activities: `activities.js`
- generated descriptors: `generatedActivities.js`
- `grade-2/modules.js`
- `grade-3/modules.js`

### Example

Mathematics:

- `src/content/mathematics/activities.js`
- `src/content/mathematics/generatedActivities.js`
- `src/content/mathematics/grade-2/modules.js`
- `src/content/mathematics/grade-3/modules.js`

French:

- `src/content/french/activities.js`
- `src/content/french/generatedActivities.js`
- `src/content/french/grade-2/modules.js`
- `src/content/french/grade-3/modules.js`

## 9. Current content by focus

### Mathematics

Current real themes include:

- place value
- addition
- subtraction
- comparison
- mental math
- patterns
- classification
- word problems
- multiplication
- division

Recent additions:

- `generated-multiplication-p2`
- `generated-division-p2`
- `math-g2-groups-sharing`
- `math-g3-division`

### French

Current real themes include:

- basic vocabulary
- sentence completion
- sentence structure
- word order
- reading comprehension
- stories
- conjugation

Recent additions:

- `generated-french-conjugation-p2`
- `generated-french-conjugation-p3`
- `generated-french-stories-p2`
- `generated-french-stories-p3`
- `french-g2-stories`
- `french-g3-conjugation`
- `french-g3-stories`

French conjugation is now prepared around 20 very common verbs:

- `etre`
- `avoir`
- `aller`
- `faire`
- `dire`
- `pouvoir`
- `voir`
- `vouloir`
- `venir`
- `prendre`
- `parler`
- `aimer`
- `manger`
- `jouer`
- `lire`
- `ecrire`
- `donner`
- `trouver`
- `regarder`
- `finir`

## 10. Activity contract and engine contract

Core activity metadata lives in:

- `src/shared/types/contentModels.js`

Important fields:

- `id`
- `subject`
- `gradeBand`
- `activityType`
- `engineType`
- `skillTags`
- `difficulty`
- `generatorConfig`

Exercise-level types live in:

- `src/shared/types/exerciseModels.js`

Supported direction today:

- multiple choice
- ordering
- matching
- fill-word
- fill-sentence
- drag-drop
- visual logic
- story

Real dedicated renderers today:

- multiple choice
- base ten
- story

Other future activity types already have a normalized path through:

- `src/engines/activity-engine/activityDescriptor.js`
- `src/engines/engineRegistry.js`

## 11. How generated activities work

Generated activities are descriptors, not fully materialized lessons.

Runtime flow:

1. content declares `generatorConfig`
2. `materializeActivity()` generates the actual lesson set
3. `ActivityPage` resolves the engine
4. the engine renders the activity and reports completion

Main files:

- `src/engines/generators/activityFactory.js`
- `src/engines/generators/exerciseGenerators.js`

## 12. Progress and persistence

### Profile

File:

- `src/services/storage/profileStore.js`

Stores:

- name
- age
- language
- theme
- avatar
- session active state
- study totals
- unlocked worlds and missions

### Progress

File:

- `src/services/storage/progressStore.js`

Stores:

- activity progress
- level progress
- question states
- last activity metadata

### Rewards

File:

- `src/services/storage/rewardStore.js`

Stores:

- balance
- inventory
- equipped theme
- equipped wallpaper
- equipped effect

### Session snapshot

File:

- `src/services/session/sessionStore.js`

Aggregates:

- profile
- rewards
- progress
- overview

## 13. World map system

Main files:

- `src/content/worlds/worldMapData.js`
- `src/shared/gameplay/worldMap.js`

What it does:

- declares worlds
- declares missions
- builds playable mission levels
- resolves progress by world and mission
- computes next playable target

Important limitation:

- the world map still expands missions into fixed 10-level structures in legacy parts of the content layer
- UI is now more honest than before, but this part is still technical debt

## 14. Styling and UI

Main file:

- `src/shared/theme/app.css`

Current UI direction:

- minimal
- mobile and tablet friendly
- one clear CTA per main page
- icons on primary buttons
- reduced noise and less fake affordance

## 15. Service worker and PWA behavior

Files:

- `src/main.jsx`
- `public/service-worker.js`
- `public/manifest.json`

Current behavior:

- service worker only registers in production
- development unregisters old service workers
- navigation requests fall back to `index.html`
- cache copies are cloned correctly to avoid `Response body is already used`

## 16. Known issues and technical debt

### A. Relative activity URL 404s

Example:

```text
generated-addition-p2?module=math-g2-addition
```

Interpretation:

- this usually comes from an old relative navigation state or a cached/broken link
- a compatibility redirect exists for module-relative activity URLs
- if it still appears in the browser console, inspect the exact `href` that produced it and clear stale browser cache/service worker state

### B. Legacy mission inflation

- world missions still rely on old 10-level expansion patterns
- needs content cleanup in `worldMapData.js` and `worldMap.js`

### C. Encoding cleanup

- some older files still contain broken encoded characters like `Â`
- build is stable, but a dedicated text cleanup pass is still recommended

### D. Engine coverage

Only these have dedicated visual engines today:

- multiple-choice
- base-ten
- story

Other content types are normalized, but still fall back to existing engines until dedicated renderers are added.

## 17. QA checklist

Core QA checks:

- onboarding completes and lands on home
- `Enter` acts as continue in onboarding
- home loads and primary CTA works
- map opens worlds and missions correctly
- subjects, grades and modules always show a real CTA
- activity completion saves progress
- rewards update correctly
- settings save profile changes
- logout returns to onboarding
- `npm run build` passes

## 18. Suggested next work

Recommended priority order:

1. clean remaining relative activity 404 sources in runtime navigation
2. refactor world map mission/level inflation
3. clean text encoding issues
4. add dedicated engines for ordering, matching, fill and drag-drop
5. continue expanding real P2/P3 content before extending more grades

