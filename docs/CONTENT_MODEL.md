# Content Model

## Subject

A subject exposes:

- `id`
- `label`
- `description`
- `grades`
- `roadmap`

## Module

Modules are declared with `createModule(...)`.

Each module contains:

- `id`
- `subjectId`
- `gradeId`
- `domainId`
- `domainLabel`
- `title`
- `summary`
- `phases.guidedPractice`
- `phases.independentPractice`
- `phases.miniChallenge`
- `phases.miniExam`
- `phases.suggestedReview`

The UI builds 10 playable levels from these activity references.

## Activity

Manual activity fields:

- `id`
- `title`
- `subject`
- `subskill`
- `gradeBand`
- `language`
- `engineType`
- `instructions`
- `hints`
- `sections`

Generated activity fields:

- all metadata above
- `generatorConfig`

## Exercise

Renderable exercises are normalized by the activity engine.

Important fields:

- `id`
- `subjectId`
- `gradeId`
- `renderType`
- `prompt`
- `options`
- `correctOptionIds`
- `contextSlots`
- `hint`
- `feedback`

## World map

The world map is declared in `src/content/worlds/worldMapData.js`.

Hierarchy:

- world
- mission
- level
- activity

Each mission resolves 10 levels.
Levels are linked to activities by `worldMap.js`.
