// LocalStorage progress for the JSON exam library. Offline-safe.
const KEY = 'lena:exam-library:v1';

export function loadAllProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

function save(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
}

/** key = `${examId}:${levelKey}` */
export function saveResult(examId, levelKey, score, total) {
  const all = loadAllProgress();
  const k = `${examId}:${levelKey}`;
  const prev = all[k];
  const best = prev ? Math.max(prev.bestScore ?? 0, score) : score;
  all[k] = { bestScore: best, lastScore: score, total, ts: Date.now() };
  save(all);
}

export function getResult(examId, levelKey) {
  return loadAllProgress()[`${examId}:${levelKey}`] || null;
}

export function starsFor(score, total, passPercent = 60) {
  if (!total) return 0;
  const pct = (score / total) * 100;
  if (pct >= 95) return 3;
  if (pct >= Math.max(passPercent, 70)) return 2;
  if (pct >= passPercent) return 1;
  return 0;
}
