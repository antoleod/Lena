// ─────────────────────────────────────────────────────────────────────────────
// LocalStorage persistence for "Mon cahier d'exercices".
// Stores recent sessions (generated exercises + test results) and the list of
// wrong answers for the "Mes erreurs" review screen. Offline-safe.
// ─────────────────────────────────────────────────────────────────────────────

const SESSIONS_KEY = 'lena:cahier:sessions:v1';
const ERRORS_KEY = 'lena:cahier:errors:v1';
const MAX_SESSIONS = 20;
const MAX_ERRORS = 100;

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/**
 * Save a finished test session.
 * @param {object} meta { subject, type, level, count }
 * @param {Array} graded result of gradeExercises()
 */
export function saveSession(meta, graded) {
  const correct = graded.filter((g) => g.correct).length;
  const session = {
    id: `sess_${Date.now()}`,
    date: Date.now(),
    subject: meta.subject,
    type: meta.type,
    level: meta.level,
    total: graded.length,
    correct,
    wrong: graded.length - correct,
    exercises: graded.map((g) => ({
      id: g.exercise.id,
      question: g.exercise.question || g.exercise.testQuestion,
      answer: String(g.exercise.answer ?? g.exercise.correctAnswer ?? ''),
      userAnswer: String(g.userAnswer ?? ''),
      correct: g.correct,
      type: g.exercise.type,
      subject: g.exercise.subject,
    })),
  };
  const sessions = read(SESSIONS_KEY, []);
  sessions.unshift(session);
  write(SESSIONS_KEY, sessions.slice(0, MAX_SESSIONS));

  // Persist wrong items for the error-review screen
  const errors = read(ERRORS_KEY, []);
  for (const g of graded) {
    if (g.correct) continue;
    errors.unshift({
      id: g.exercise.id,
      ts: Date.now(),
      subject: g.exercise.subject,
      type: g.exercise.type,
      level: g.exercise.level,
      question: g.exercise.testQuestion || g.exercise.question,
      userAnswer: String(g.userAnswer ?? ''),
      answer: g.exercise.answer,
      explanation: g.exercise.explanation,
      inputType: g.exercise.inputType,
      options: g.exercise.options,
      acceptedAnswers: g.exercise.acceptedAnswers,
    });
  }
  write(ERRORS_KEY, errors.slice(0, MAX_ERRORS));

  return session;
}

export function getSessions() {
  return read(SESSIONS_KEY, []);
}

export function getErrors() {
  return read(ERRORS_KEY, []);
}

export function getErrorCount() {
  return read(ERRORS_KEY, []).length;
}

/** Remove an error (e.g. once retried successfully). */
export function clearError(id) {
  write(ERRORS_KEY, read(ERRORS_KEY, []).filter((e) => e.id !== id));
}

export function clearAllErrors() {
  write(ERRORS_KEY, []);
}
