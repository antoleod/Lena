# Lena (MPA + Vite)

Sitio multi-page (MPA) para GitHub Pages bajo base `/Lena/`.

## Rutas principales
- `/Lena/`
- `/Lena/juegos/`
- `/Lena/juegos/segundo/`
- `/Lena/juegos/tercero/`
- `/Lena/juegos/<slug>/` (una por juego)

## Como correr
```
npm run dev
```

## Build
```
npm run build
```

Para GitHub Pages:
```
npm run build:gh
```

## Data model (juegos y anos)
Fuente unica de verdad:
`src/data/games.js`

Cada juego incluye:
`id`, `slug`, `year`, `title`, `description`, `tags`, `mode`

## Como agregar un juego nuevo
1. Edita `src/data/games.js` y agrega un objeto en `GAMES`.
2. Asegura `slug` unico y `id` existente en el motor de juegos.
3. Ejecuta `npm run build` o `npm run build:gh`.

El build genera automaticamente:
- `/juegos/<slug>/index.html`
- Cards en `/juegos/` y en el ano correspondiente.

## Como agregar un nuevo ano
1. Agrega el ano en `YEARS` dentro de `src/data/games.js`.
2. Usa el `id` nuevo en los juegos que correspondan.
3. Ejecuta `npm run build`.

Se genera automaticamente:
- `/juegos/<slug-del-ano>/index.html`
- Links en el header y en el hub.

## Notas de arquitectura
- `scripts/generate-mpa.js` crea los HTML reales (MPA).
- `vite.config.js` usa entradas multiples por pagina.
- Los juegos cargan el motor compartido en `public/js/new-games/*`.
