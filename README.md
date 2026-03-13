# Lena

Lena is a React educational platform for primary school children with:

- onboarding and child profile
- a world map with missions and levels
- adaptive exercises
- local progress and rewards
- multilingual UI
- curriculum content for mathematics, French, Dutch, English, Spanish, reasoning and stories

## Tech stack

- React
- React Router
- Vite
- localStorage for profile, progress and rewards

## Run locally

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Main folders

```text
src/
  app/                 app shell, routing, providers
  content/             curriculum content and world data
  engines/             renderers, generators, validation
  features/            onboarding, home, map, activity, shop, history, settings
  services/            storage and session services
  shared/              theme, i18n, gameplay helpers, shared types
docs/                  architecture and contribution guides
public/assets/         visual assets used by activities and cosmetics
```

## Product flow

```text
Onboarding
-> Home dashboard
-> World map
-> World
-> Mission
-> Level
-> Activity
-> Mission reward
-> Next mission
```

## Current content model

- subjects live in `src/content/*`
- grade modules live in `src/content/<subject>/grade-*/modules.js`
- manual activities live in `src/content/<subject>/activities.js`
- generated activity descriptors live in `src/content/<subject>/generatedActivities.js`
- world and mission routing data lives in `src/content/worlds/`

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Content model](docs/CONTENT_MODEL.md)
- [Adding content](docs/ADDING_CONTENT.md)
- [I18n guide](docs/I18N_GUIDE.md)
- [QA checklist](docs/QA_CHECKLIST.md)
- [Migration plan](docs/MIGRATION_PLAN.md)
- [Migration audit](docs/migration-audit.md)
