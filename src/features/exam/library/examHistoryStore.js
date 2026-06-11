import { recordPlayedExercise } from '../../../services/learning/recordPlayedExercise.js';

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

  // Track 1: a completed exam is a real played event (session-summary flavor).
  recordPlayedExercise({
    flavor:       'session',
    exerciseId:   entry.examId ?? null,
    sourceModule: 'exam',
    subject:      'exam',
    questionType: entry.levelKey ?? null,
    isCorrect:    typeof entry.pct === 'number' ? entry.pct >= 50 : null,
    attempts:     Number.isFinite(entry.total) ? entry.total : null,
    difficultyAfter: entry.levelKey ?? null,
    generatedBy:  'exam',
  });
}

export function getHistory() { return read(); }
export function clearHistory() { write([]); }
