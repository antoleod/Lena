const KEY = 'lena:exam-history:v1';
const MAX = 50;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function saveHistoryEntry(entry) {
  // entry: { examId, examTitle, examEmoji, levelKey, score, total, pct, questions, ts }
  const all = read();
  all.unshift({ ...entry, id: `h_${Date.now()}` });
  write(all.slice(0, MAX));
}

export function getHistory() { return read(); }
export function clearHistory() { write([]); }
