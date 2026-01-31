# QA Report

Date: 2026-01-31

## 1) Diagnóstico inicial

Archivos clave identificados:
- Login: `html/login.html`, `css/login.css`, `js/login.js`, `js/i18n.js`, `js/storage.js`, `js/appData.js`
- Home / Juego: `html/juego.html`, `js/juego.js`, `js/game-shell/*`, `css/juego.css`, `css/base-ten.css`
- Tienda: `html/boutique.html`, `js/boutique.js`, `js/shopManager.js`, `js/boutiqueData.js`
- Progreso / Logros: `html/logros.html`, `js/logros.js`, `js/storage.js`, `js/core/storage.js`
- PWA / Offline: `manifest.json`, `service-worker.js`, `offline.html`

Hallazgos principales:
- Se detectaron caracteres corruptos (acentos, signos y emojis) en textos de redirección y en nuevos módulos (base ten + tests).
- Causa probable: archivos guardados en un encoding incorrecto (Latin1/Windows-1252) o conversiones parciales.
- Solución aplicada: forzar UTF-8 en HTML con `<meta charset="UTF-8">` (ya presente) y normalizar archivos críticos para UTF-8. Correcciones realizadas en `index.html`, `login.html`, `js/appData.js`, `games/baseTenBuild.js`, `games/baseTenSubtract.js`, `js/tests/smokeTests.js` y `html/tests.html`.

## 2) Batería de tests manuales

| Test | Pasos | Resultado | Evidencia | BugID |
|---|---|---|---|---|
| Doble click rápido en Start/Valider/Suite | Abrir juego, hacer doble click rápido en Start/Valider/Suite | Pendiente de ejecución | N/A | QA-001 |
| Valider sin selección | En juego MCQ, pulsar Valider sin elegir respuesta | Pendiente de ejecución | N/A | QA-002 |
| Hint no gasta doble | Presionar Hint varias veces seguidas | Pendiente de ejecución | N/A | QA-003 |
| Tienda: comprar con monedas | Abrir tienda, comprar ítem con monedas suficientes | Pendiente de ejecución | N/A | QA-004 |
| Tienda: comprar sin monedas | Intentar comprar sin monedas suficientes | Pendiente de ejecución | N/A | QA-005 |
| Tienda: refresh | Comprar ítem y recargar página | Pendiente de ejecución | N/A | QA-006 |
| Progreso persiste | Completar nivel, recargar y verificar estrellas/monedas | Pendiente de ejecución | N/A | QA-007 |
| Mobile: targets grandes / scroll / rotación | Abrir en tablet y rotar | Pendiente de ejecución | N/A | QA-008 |
| Offline/PWA | Activar modo offline y verificar fallback | Pendiente de ejecución | N/A | QA-009 |

Nota: pruebas manuales no ejecutadas en este entorno CLI; requieren ejecución en navegador/touch.

## 3) Checks automáticos simples

Smoke tests creados:
- `js/tests/smokeTests.js` con validaciones:
  - i18n carga
  - localStorage funciona
  - state machine no entra en estado inválido
  - funciones `loadAppData()`, `saveAppData()`, `resetAppData()` existen
- `html/tests.html` para ejecutar pruebas desde la consola.

## 4) Bug crítico: encoding/acentos

Descripción:
- Se observaron caracteres corruptos en textos (ej. "L'accent", "prénom", "trésors").

Causa:
- Archivos guardados en encoding no-UTF8 o conversiones parciales.

Solución:
- Confirmado `<meta charset="UTF-8">` en HTML.
- Normalización explícita de `index.html`, `login.html`, `js/appData.js`, `games/baseTenBuild.js`, `games/baseTenSubtract.js`, `js/tests/smokeTests.js` y `html/tests.html`.
- Mantener todo texto en UTF-8 al guardar.

BugID: ENC-001
