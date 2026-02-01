# QA Report

Date: 2026-02-01

## 1) Diagnóstico inicial

Archivos clave identificados:
- Login: `html/login.html`, `css/login.css`, `js/login.js`, `js/i18n.js`, `js/storage.js`, `js/appData.js`
- Home / Juego: `html/juego.html`, `js/juego.js`, `js/game-shell/*`, `css/juego.css`, `css/base-ten.css`
- Tienda: `html/boutique.html`, `js/boutique.js`, `js/shopManager.js`, `js/boutiqueData.js`
- Progreso / Logros: `html/logros.html`, `js/logros.js`, `js/storage.js`, `js/core/storage.js`
- PWA / Offline: `manifest.json`, `service-worker.js`, `offline.html`

Hallazgos principales:
- i18n estaba embebido en `js/i18n.js` y faltaban JSON de idiomas.
- Chips de “Nouveaux Jeux / New Games” no tenían routing real (dependían de buscar botones por texto).
- Juegos nuevos sin motor común ni QA de niveles/ejercicios.

## 2) Batería de tests manuales (plan)

| Test | Pasos | Resultado | Evidencia | BugID |
|---|---|---|---|---|
| i18n FR→ES→NL | Cambiar idioma en login y en game.html; verificar sin strings sueltas | Pendiente de ejecución | N/A | QA-001 |
| Routing New Games | Clic en cada chip nuevo; abre `game.html?game=ID&level=1` correcto | Pendiente de ejecución | N/A | QA-002 |
| Gameplay L1 | Build-number L1, Subtract-transform L1, Half-game L1 jugables | Pendiente de ejecución | N/A | QA-003 |
| Ayuda tras 2 fallos | Subtract-transform: fallar 2 veces -> aparece ayuda | Pendiente de ejecución | N/A | QA-004 |
| Auto | Activar Auto y verificar validación/avance | Pendiente de ejecución | N/A | QA-005 |
| Persistencia | Completar ejercicios, recargar y verificar nivel/avance | Pendiente de ejecución | N/A | QA-006 |
| Accesibilidad | Botones grandes, focus visible, aria-label traducido | Pendiente de ejecución | N/A | QA-007 |
| PWA cache | Offline fallback y cache versionado | Pendiente de ejecución | N/A | QA-008 |

Nota: pruebas manuales no ejecutadas en este entorno CLI; requieren ejecución en navegador/touch.

## 3) QA automatizado (nuevo)

Módulo de QA:
- `js/new-games/qa.js` valida:
  - juegos registrados
  - 10 niveles por juego
  - 12 o 10 ejercicios exactos por nivel (según juego)
  - ejercicios con prompt/type/answer
- Dev Panel: Ctrl+Shift+D en `html/game.html`.

Cómo ejecutar:
- Abrir `html/game.html?game=build-number&level=1`
- En consola: `runNewGamesQA()` o Ctrl+Shift+D para panel

Resultado esperado:
- `status: PASS` en todos los juegos.
