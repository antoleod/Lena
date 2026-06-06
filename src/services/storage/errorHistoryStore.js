const KEY = 'lena:errors:v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr.slice(-500))); } catch {}
}

export function recordError({ topic, question, correctAnswer, userAnswer, source, practiceKey, level }) {
  const arr = read();
  arr.push({ id: Date.now() + Math.random(), topic, question, correctAnswer, userAnswer, source, practiceKey, level, ts: Date.now() });
  write(arr);
}

export function getErrors() { return read(); }

export function getErrorsByTopic(topic) { return read().filter(e => e.topic === topic); }

export function clearErrors() { write([]); }

export function getErrorCount() { return read().length; }

/**
 * Weak areas for the adaptive "À retravailler" system: groups recorded errors
 * that carry a practiceKey ("subject:type") and counts them, most-failed first.
 * Returns [{ key, subject, type, level, count }].
 */
export function getWeakAreas() {
  const map = new Map();
  for (const e of read()) {
    if (!e.practiceKey) continue;
    const cur = map.get(e.practiceKey) || { key: e.practiceKey, count: 0, level: e.level || 'easy' };
    cur.count += 1;
    cur.level = e.level || cur.level; // keep latest level seen
    map.set(e.practiceKey, cur);
  }
  return [...map.values()]
    .map((v) => { const [subject, type] = v.key.split(':'); return { ...v, subject, type }; })
    .sort((a, b) => b.count - a.count);
}
