# Migration Plan

This file tracks the approved execution order used in the current migration.

## Completed tasks

- TASK-001 `Contratos de dominio`
- TASK-002 `Adaptadores de contenido legado`
- TASK-003 `worldMap data-driven`
- TASK-004 `LevelProgress separado de ActivityProgress`
- TASK-005 `Sesion unificada`
- TASK-006 `Contrato formal de ejercicio renderizable`
- TASK-007 `Validador de ejercicios`
- TASK-008 `Renderer multiple choice con media`
- TASK-009 `Packs visuales de idiomas`
- TASK-010 `Onboarding final`
- TASK-011 `Home dashboard`
- TASK-012 `Flujo mision -> nivel -> actividad -> reto -> mini evaluacion -> recompensa`
- TASK-013 `Curricula matematica P2/P3`
- TASK-014 `Curricula idiomas P2/P3`
- TASK-015 `Documentacion tecnica`
- TASK-016 `QA final`

## Notes

- legacy content remains available through adapters while the new contracts are in use
- world data is explicit and no longer inferred from a flat activity pool
- level progress is persisted independently from activity progress
- the app already compiles after each migration block
