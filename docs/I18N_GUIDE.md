# I18n Guide

## UI translations

UI strings are centralized in:

- `src/shared/i18n/LocaleContext.jsx`

Supported UI locales:

- `fr`
- `nl`
- `en`
- `es`

## Content localization

Subject labels and roadmaps are localized through:

- `src/shared/i18n/contentLocalization.js`

## Rules

- do not hardcode UI text in feature components if a reusable key already exists
- keep subject labels and descriptions localizable
- visual vocabulary should expose localized labels per concept

## Content language vs UI language

They are different concerns:

- UI language controls navigation and interface labels
- activity `language` controls the exercise content language

## When adding strings

If a new UI message is needed:

1. add it to all supported locales
2. reuse the same key across features
3. avoid feature-local string dictionaries
