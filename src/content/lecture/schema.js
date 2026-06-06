// ─────────────────────────────────────────────────────────────────────────────
// Lecture story JSON schema validator.
// ─────────────────────────────────────────────────────────────────────────────

export const LEVEL_KEYS = ['facile', 'moyen', 'difficile'];
export const QUESTION_KINDS = ['mc', 'tf', 'fb', 'order'];

export function validateStory(story) {
  const errors = [];
  if (!story || typeof story !== 'object') return ['story is not an object'];

  if (!story.id) errors.push('missing id');
  if (!story.theme) errors.push('missing theme');
  if (!LEVEL_KEYS.includes(story.level)) errors.push(`bad level "${story.level}"`);
  if (!story.title) errors.push('missing title');
  if (!story.emoji) errors.push('missing emoji');

  if (!Array.isArray(story.pages)) {
    errors.push('missing pages array');
  } else if (story.pages.length < 4) {
    errors.push(`pages.length ${story.pages.length} < 4`);
  } else {
    story.pages.forEach((p, i) => {
      if (!p.text) errors.push(`pages[${i}]: missing text`);
      if (!p.illustration) errors.push(`pages[${i}]: missing illustration`);
    });
  }

  if (!Array.isArray(story.vocabulary)) {
    errors.push('missing vocabulary array');
  } else {
    story.vocabulary.forEach((v, i) => {
      if (!v.word) errors.push(`vocabulary[${i}]: missing word`);
      if (!v.definition) errors.push(`vocabulary[${i}]: missing definition`);
    });
  }

  if (!Array.isArray(story.questions)) {
    errors.push('missing questions array');
  } else if (story.questions.length < 5) {
    errors.push(`questions.length ${story.questions.length} < 5`);
  } else {
    story.questions.forEach((q, i) => {
      const ctx = `questions[${i}]`;
      if (!q.id) errors.push(`${ctx}: missing id`);
      if (!q.prompt) errors.push(`${ctx}: missing prompt`);
      if (q.answer === undefined || q.answer === null || q.answer === '')
        errors.push(`${ctx}: missing answer`);
      if (!QUESTION_KINDS.includes(q.kind))
        errors.push(`${ctx}: bad kind "${q.kind}"`);
      if (q.kind === 'mc' && (!Array.isArray(q.options) || q.options.length < 2))
        errors.push(`${ctx}: mc needs options array`);
      if (q.kind === 'order' && !Array.isArray(q.steps))
        errors.push(`${ctx}: order needs steps array`);
    });
  }

  if (!story.summary) errors.push('missing summary');

  return errors;
}
