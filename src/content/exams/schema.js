// ─────────────────────────────────────────────────────────────────────────────
// Exam JSON schema contract + validator.
//
// Supported question types:
//
//  - "mcq"         { prompt, options[], answer, correction }
//  - "true_false"  { prompt, answer: boolean, correction }
//  - "fill_blank"  { prompt, answer (string|number), correction }
//                  (free input; accepts `accept[]` for alternative spellings)
//  - "association" { prompt, pairs: [{ left, right }], correction }
//                  (the runner shows it as ordered matching — answer derived)
//
// Reading-comprehension exams add a `story` object on each level:
//   story: { pages: [ { text, keywords?[] } ] }
//
// Every level also carries `passPercent` (score needed to "pass" / earn stars).
// ─────────────────────────────────────────────────────────────────────────────

export const QUESTION_TYPES = ['mcq', 'true_false', 'fill_blank', 'association'];
export const LEVEL_KEYS = ['facile', 'moyen', 'difficile'];

export function validateQuestion(q, ctx = '') {
  const errors = [];
  if (!q || typeof q !== 'object') return [`${ctx}: question is not an object`];
  if (!q.id) errors.push(`${ctx}: missing id`);
  if (!QUESTION_TYPES.includes(q.type)) errors.push(`${ctx}: bad type "${q.type}"`);
  if (!q.prompt) errors.push(`${ctx}: missing prompt`);
  if (!('correction' in q)) errors.push(`${ctx}: missing correction`);

  if (q.type === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${ctx}: mcq needs >= 2 options`);
    else if (!q.options.map(String).includes(String(q.answer))) errors.push(`${ctx}: answer not in options`);
  }
  if (q.type === 'true_false' && typeof q.answer !== 'boolean') {
    errors.push(`${ctx}: true_false answer must be boolean`);
  }
  if (q.type === 'fill_blank' && (q.answer === undefined || q.answer === null || q.answer === '')) {
    errors.push(`${ctx}: fill_blank needs an answer`);
  }
  if (q.type === 'association') {
    if (!Array.isArray(q.pairs) || q.pairs.length < 2) errors.push(`${ctx}: association needs >= 2 pairs`);
  }
  return errors;
}

export function validateExam(exam) {
  const errors = [];
  if (!exam || typeof exam !== 'object') return ['exam is not an object'];
  if (!exam.id) errors.push('missing id');
  if (!exam.category) errors.push('missing category');
  if (!exam.title) errors.push('missing title');
  if (!exam.levels || typeof exam.levels !== 'object') {
    errors.push('missing levels');
    return errors;
  }
  for (const key of LEVEL_KEYS) {
    const level = exam.levels[key];
    if (!level) { errors.push(`${exam.id}: missing level "${key}"`); continue; }
    if (!Array.isArray(level.questions) || level.questions.length === 0) {
      errors.push(`${exam.id}.${key}: no questions`);
      continue;
    }
    level.questions.forEach((q, i) =>
      errors.push(...validateQuestion(q, `${exam.id}.${key}.q${i + 1}`))
    );
    if (level.story) {
      if (!Array.isArray(level.story.pages) || level.story.pages.length === 0) {
        errors.push(`${exam.id}.${key}: story has no pages`);
      }
    }
  }
  return errors;
}
