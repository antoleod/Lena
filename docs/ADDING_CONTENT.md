# Adding Content

## 1. Add or update an activity

Manual activity:

- edit `src/content/<subject>/activities.js`
- add a new activity object
- keep `id` unique
- choose the correct `engineType`

Generated activity:

- edit `src/content/<subject>/generatedActivities.js`
- add a new descriptor with `generatorConfig`

## 2. Attach the activity to a module

- edit `src/content/<subject>/grade-<grade>/modules.js`
- add the new activity id to:
  - `guidedActivityIds`
  - `independentActivityIds`
  - `challengeActivityId`
  - `examActivityId`
  - `suggestedReviewIds`

## 3. Validate IDs

Every referenced activity id must exist in:

- manual activities
- or generated activities

## 4. Visual language content

For language modules with images:

- use assets under `public/assets/learning/`
- prefer the visual vocabulary helpers in `src/content/language-packs/visualVocabulary.js`

## 5. Build check

Always run:

```bash
npm run build
```

Do not merge content if:

- an activity id is missing
- a module points to a dead activity
- a new exercise has no correct answer
