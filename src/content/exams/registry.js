// ─────────────────────────────────────────────────────────────────────────────
// Exam content registry — AUTO-LOADED.
//
// Every `*.json` file placed under `src/content/exams/**` is automatically
// discovered and registered at build time via Vite's `import.meta.glob`.
// To add a new exam you ONLY drop a JSON file in the right category folder —
// no code change is required anywhere.
//
// The JSON files are bundled into the app, so the whole library works fully
// offline (no network fetch at runtime).
//
// Expected JSON shape (see `schema.js` for the full contract):
// {
//   "id": "calcul-mental-01",
//   "category": "calcul-mental",
//   "categoryLabel": "Calcul mental",
//   "categoryEmoji": "🔢",
//   "title": "Additions jusqu'à 10",
//   "emoji": "🔢",
//   "order": 1,
//   "levels": {
//     "facile":    { "passPercent": 60, "questions": [ ... ] },
//     "moyen":     { "passPercent": 60, "questions": [ ... ] },
//     "difficile": { "passPercent": 60, "questions": [ ... ] }
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

const modules = import.meta.glob('./**/*.json', { eager: true });

/** All exams, flat, sorted by category then `order`/title. */
export const ALL_EXAMS = Object.entries(modules)
  .map(([path, mod]) => {
    const exam = mod.default ?? mod;
    return { ...exam, __path: path };
  })
  .filter((e) => e && e.id && e.category && e.levels)
  .sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    const oa = a.order ?? 999;
    const ob = b.order ?? 999;
    if (oa !== ob) return oa - ob;
    return String(a.title).localeCompare(String(b.title));
  });

/** Difficulty levels in display order. */
export const DIFFICULTY_LEVELS = [
  { key: 'facile', label: 'Facile', emoji: '🟢' },
  { key: 'moyen', label: 'Moyen', emoji: '🟠' },
  { key: 'difficile', label: 'Difficile', emoji: '🔴' },
];

/** Categories, derived from the registered exams (label/emoji from first exam). */
export function getCategories() {
  const map = new Map();
  for (const exam of ALL_EXAMS) {
    if (!map.has(exam.category)) {
      map.set(exam.category, {
        id: exam.category,
        label: exam.categoryLabel || exam.category,
        emoji: exam.categoryEmoji || exam.emoji || '📚',
        order: exam.categoryOrder ?? 999,
        exams: [],
      });
    }
    map.get(exam.category).exams.push(exam);
  }
  return [...map.values()].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.label.localeCompare(b.label);
  });
}

export function getExamsByCategory(categoryId) {
  return ALL_EXAMS.filter((e) => e.category === categoryId);
}

export function getExamById(examId) {
  return ALL_EXAMS.find((e) => e.id === examId) || null;
}

export function getExamLevel(examId, levelKey) {
  const exam = getExamById(examId);
  if (!exam) return null;
  const level = exam.levels?.[levelKey];
  if (!level) return null;
  return { exam, level, levelKey };
}
