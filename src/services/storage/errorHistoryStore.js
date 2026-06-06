const KEY = 'lena:errors:v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr.slice(-500))); } catch {}
}

export function recordError({ topic, question, correctAnswer, userAnswer, source }) {
  const arr = read();
  arr.push({ id: Date.now() + Math.random(), topic, question, correctAnswer, userAnswer, source, ts: Date.now() });
  write(arr);
}

export function getErrors() { return read(); }

export function getErrorsByTopic(topic) { return read().filter(e => e.topic === topic); }

export function clearErrors() { write([]); }

export function getErrorCount() { return read().length; }
