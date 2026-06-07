const STORE_KEY   = 'lena:gameProgress';
const APPTIME_KEY = 'lena:appTime';

const DEFAULT_GAME = () => ({
  bestScore:      0,
  bestLevel:      1,
  unlockedLevel:  1,
  totalTimeSecs:  0,
  sessionsPlayed: 0,
  lastPlayed:     null,
  history:        [], // [{date, score, level, timeSecs, stars}]
});

// ── Per-game ──────────────────────────────────────────────────────────────

export function getGameProgress(gameId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return all[gameId] ? { ...DEFAULT_GAME(), ...all[gameId] } : DEFAULT_GAME();
  } catch {
    return DEFAULT_GAME();
  }
}

export function getAllGameProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Save a completed game session.
 * @param {string} gameId
 * @param {{ score: number, level: number, stars: number, timeSecs: number }} session
 * @returns {{ isNewBest: boolean, newUnlocked: boolean, saved: object }}
 */
export function saveGameSession(gameId, { score, level, stars, timeSecs }) {
  try {
    const all  = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    const prev = all[gameId] ? { ...DEFAULT_GAME(), ...all[gameId] } : DEFAULT_GAME();

    const isNewBest    = score > prev.bestScore;
    // Unlock next level when player gets ≥2 stars
    const newUnlocked  = stars >= 2 && level >= prev.unlockedLevel && level < 5;
    const nextUnlocked = newUnlocked ? level + 1 : prev.unlockedLevel;

    const entry = {
      date:     new Date().toISOString(),
      score,
      level,
      stars,
      timeSecs,
    };

    all[gameId] = {
      bestScore:      isNewBest ? score : prev.bestScore,
      bestLevel:      Math.max(prev.bestLevel, level),
      unlockedLevel:  Math.max(prev.unlockedLevel, nextUnlocked),
      totalTimeSecs:  prev.totalTimeSecs + timeSecs,
      sessionsPlayed: prev.sessionsPlayed + 1,
      lastPlayed:     entry.date,
      history:        [entry, ...prev.history].slice(0, 30),
    };

    localStorage.setItem(STORE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('lena-game-progress-change'));

    return { isNewBest, newUnlocked, saved: all[gameId] };
  } catch {
    return { isNewBest: false, newUnlocked: false, saved: null };
  }
}

// ── App-wide time tracking ─────────────────────────────────────────────────

export function addAppTime(secs) {
  if (secs <= 0) return;
  try {
    const raw  = localStorage.getItem(APPTIME_KEY);
    const data = raw ? JSON.parse(raw) : { totalSecs: 0, sessions: [] };
    data.totalSecs = (data.totalSecs || 0) + secs;
    data.sessions  = [
      { date: new Date().toISOString(), secs },
      ...(data.sessions || []),
    ].slice(0, 100);
    localStorage.setItem(APPTIME_KEY, JSON.stringify(data));
  } catch {}
}

export function getAppTime() {
  try {
    const raw = localStorage.getItem(APPTIME_KEY);
    return raw ? JSON.parse(raw) : { totalSecs: 0, sessions: [] };
  } catch {
    return { totalSecs: 0, sessions: [] };
  }
}

// ── Per-game error log ────────────────────────────────────────────────────

const ERRORS_KEY = 'lena:gameErrors';

/**
 * Save wrong answers for a game session.
 * @param {string} gameId
 * @param {Array<{label: string, correct: string|number, given: string|number}>} errors
 */
export function saveGameErrors(gameId, errors) {
  if (!errors || errors.length === 0) return;
  try {
    const all = JSON.parse(localStorage.getItem(ERRORS_KEY) || '{}');
    const prev = all[gameId] || [];
    all[gameId] = [
      ...errors.map(e => ({ ...e, date: new Date().toISOString() })),
      ...prev,
    ].slice(0, 100);
    localStorage.setItem(ERRORS_KEY, JSON.stringify(all));
  } catch {}
}

export function getGameErrors(gameId) {
  try {
    const all = JSON.parse(localStorage.getItem(ERRORS_KEY) || '{}');
    return all[gameId] || [];
  } catch { return []; }
}

export function getAllErrors() {
  try { return JSON.parse(localStorage.getItem(ERRORS_KEY) || '{}'); } catch { return {}; }
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function formatDuration(secs) {
  if (!secs || secs < 0) return '0 min';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${s}s`;
  return `${s}s`;
}

export function getTotalStats() {
  const allGames = getAllGameProgress();
  const appTime  = getAppTime();
  let totalGameSecs = 0;
  let totalSessions = 0;
  let gamesPlayed   = 0;
  for (const g of Object.values(allGames)) {
    totalGameSecs += g.totalTimeSecs || 0;
    totalSessions += g.sessionsPlayed || 0;
    if (g.sessionsPlayed > 0) gamesPlayed++;
  }
  return {
    totalAppSecs:  appTime.totalSecs || 0,
    totalGameSecs,
    totalSessions,
    gamesPlayed,
    gamesUnlocked: Object.keys(allGames).length,
  };
}
