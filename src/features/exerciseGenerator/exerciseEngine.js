// ─────────────────────────────────────────────────────────────────────────────
// Exercise engine: generate a batch and check answers (flexible validation).
// ─────────────────────────────────────────────────────────────────────────────

import { GENERATORS, setGenLocale } from './exerciseTemplates.js';

/**
 * generateExercises({ subject, type, level, count }) → Exercise[]
 * Extensible: any `${subject}:${type}` registered in GENERATORS works.
 */
export function generateExercises({ subject, type, level = 'easy', count = 10, digits = null, locale = 'fr' }) {
  const gen = GENERATORS[`${subject}:${type}`];
  if (!gen) {
    console.warn(`No generator for ${subject}:${type}`);
    return [];
  }
  setGenLocale(locale);
  const n = Math.max(1, Number(count) || 10);
  // Generate WITHOUT duplicate questions on the same sheet (regenerate clashes).
  const list = [];
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    let ex = gen(level, i, { digits });
    let tries = 0;
    while (ex && seen.has(ex.question) && tries++ < 25) ex = gen(level, i, { digits });
    if (ex) { seen.add(ex.question); list.push(ex); }
  }
  return list;
}

/** Flexible normalization for answer comparison. */
export function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/\s+/g, ' ')            // collapse spaces
    .replace(/[.;!?]+$/, '');        // drop trailing punctuation
}

/**
 * Returns true if `userValue` matches the exercise answer.
 * Accepts `answer`, every entry of `acceptedAnswers`, and unit-less variants
 * (e.g. "20", "20mm", "20 mm" all match).
 */
export function checkAnswer(exercise, userValue) {
  const candidates = [exercise.answer, ...(exercise.acceptedAnswers || [])];
  const user = normalizeAnswer(userValue);
  const userNoSpace = user.replace(/\s+/g, '');
  return candidates.some((c) => {
    const norm = normalizeAnswer(c);
    return norm === user || norm.replace(/\s+/g, '') === userNoSpace;
  });
}

/** Build a corrected result list from exercises + the child's answers map. */
export function gradeExercises(exercises, answers) {
  return exercises.map((ex) => {
    const userAnswer = answers[ex.id] ?? '';
    const correct = checkAnswer(ex, userAnswer);
    return { exercise: ex, userAnswer, correct };
  });
}
