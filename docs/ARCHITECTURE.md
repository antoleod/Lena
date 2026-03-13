# Architecture

## Runtime layers

### App

- `src/app/routing/AppRouter.jsx`
- `src/app/layout/AppShell.jsx`
- `src/app/providers/*`

App owns route composition and the top-level shell.

### Content

- `src/content/<subject>/activities.js`
- `src/content/<subject>/generatedActivities.js`
- `src/content/<subject>/grade-*/modules.js`
- `src/content/worlds/worldMapData.js`
- `src/content/adapters/legacyContentAdapters.js`

Content owns curriculum data, not UI logic.

### Engines

- `src/engines/multiple-choice/*`
- `src/engines/base-ten/*`
- `src/engines/story/*`
- `src/engines/generators/*`
- `src/engines/activity-engine/*`

Engines own exercise rendering, generation and validation.

### Features

- `src/features/onboarding`
- `src/features/home`
- `src/features/map`
- `src/features/activity`
- `src/features/history`
- `src/features/settings`
- `src/features/shop`

Features own screen-level flows.

### Services

- `src/services/storage/profileStore.js`
- `src/services/storage/progressStore.js`
- `src/services/storage/rewardStore.js`
- `src/services/session/sessionStore.js`

Services own persistence and session snapshots.

### Shared

- `src/shared/i18n/*`
- `src/shared/theme/*`
- `src/shared/gameplay/worldMap.js`
- `src/shared/types/*`

Shared owns reusable contracts, theme, i18n and gameplay helpers.

## Domain contracts

Contracts introduced in `src/shared/types/`:

- content models
- exercise models
- progress models

These contracts are the stable layer between content and runtime code.

## Navigation

Main routes:

- `/onboarding`
- `/`
- `/map`
- `/map/:worldId`
- `/map/:worldId/missions/:missionId`
- `/subjects`
- `/subjects/:subjectId`
- `/subjects/:subjectId/grades/:gradeId`
- `/subjects/:subjectId/grades/:gradeId/modules/:moduleId`
- `/activities/:activityId`
- `/shop`
- `/history`
- `/settings`

## Progress model

Progress is persisted locally at three levels:

- profile
- rewards
- progress

Progress itself tracks:

- activity progress
- level progress
- question states
- streak and last played metadata

Question status values:

- `unseen`
- `failed`
- `shaky`
- `mastered`
