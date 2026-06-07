const KEY = 'lena:dudu:v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
}

const DEFAULT = {
  totalCorrect: 0,
  totalAttempts: 0,
  levelProgress: {}, // { [levelId]: { correct, attempts } }
  badges: [],        // array of badge ids earned
  lastPlayed: null,
};

export function loadProgress() {
  return { ...DEFAULT, ...read() };
}

export function recordAnswer(levelId, correct) {
  const p = loadProgress();
  p.totalAttempts += 1;
  if (correct) p.totalCorrect += 1;
  if (!p.levelProgress[levelId]) p.levelProgress[levelId] = { correct: 0, attempts: 0 };
  p.levelProgress[levelId].attempts += 1;
  if (correct) p.levelProgress[levelId].correct += 1;
  p.lastPlayed = Date.now();
  write(p);
  return p;
}

export function checkNewBadges(progress, BADGES) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (!progress.badges.includes(badge.id) && progress.totalCorrect >= badge.threshold) {
      newBadges.push(badge);
      progress.badges.push(badge.id);
    }
  }
  if (newBadges.length > 0) write(progress);
  return newBadges;
}

export function resetProgress() { write(DEFAULT); }
