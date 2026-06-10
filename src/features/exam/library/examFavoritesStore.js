// LocalStorage store for exam favorites and recently-used exams. Offline-safe.

const FAV_KEY = 'lena:exam-favorites:v1';
const RECENT_KEY = 'lena:exam-recent:v1';
const RECENT_MAX = 10;

// ─── Favorites ────────────────────────────────────────────────────────────────

/** Returns array of favorited examIds. */
export function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}

function saveFavorites(list) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch {}
}

export function isFavorite(examId) {
  return loadFavorites().includes(examId);
}

export function toggleFavorite(examId) {
  const list = loadFavorites();
  const idx = list.indexOf(examId);
  if (idx === -1) {
    list.unshift(examId);
  } else {
    list.splice(idx, 1);
  }
  saveFavorites(list);
  return idx === -1; // returns true if now favorited
}

// ─── Recently used ────────────────────────────────────────────────────────────

/**
 * Returns array of recent entries (newest first), max RECENT_MAX.
 * Each entry: { examId, levelKey, ts, title, emoji, category, categoryEmoji }
 */
export function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function saveRecent(list) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch {}
}

/**
 * Records an exam session start. Deduplicates by examId+levelKey (keeps newest).
 */
export function recordRecentExam({ examId, levelKey, title, emoji, category, categoryEmoji }) {
  const list = loadRecent().filter(
    (e) => !(e.examId === examId && e.levelKey === levelKey)
  );
  list.unshift({ examId, levelKey, title, emoji, category, categoryEmoji, ts: Date.now() });
  saveRecent(list.slice(0, RECENT_MAX));
}
