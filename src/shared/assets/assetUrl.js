// ─────────────────────────────────────────────────────────────────────────────
// assetUrl — resolve a public asset path against the app's deploy base.
//
// In production the app is served from a sub-path (Vite `base`, e.g. '/Lena/'
// on GitHub Pages). Hardcoded absolute paths like "/assets/x.svg" resolve to
// the DOMAIN ROOT and 404 there, while working locally where base is '/'.
//
// Always build public-asset URLs with this helper:
//   assetUrl('assets/icons/icon-star.svg')   // relative (preferred)
//   assetUrl('/assets/icons/icon-star.svg')  // leading slash also tolerated
//
// Files imported via `import x from './x.svg'` or `new URL('./x', import.meta.url)`
// are handled by the bundler and do NOT need this helper.
// ─────────────────────────────────────────────────────────────────────────────

export function assetUrl(path) {
  // import.meta.env is undefined outside Vite (e.g. Node test runner) — guard it.
  const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
  const clean = String(path ?? '').replace(/^\/+/, '');
  return `${base}${clean}`;
}
