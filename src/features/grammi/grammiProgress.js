const KEY = 'lena:grammi:v1';
function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
function write(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
const DEFAULT = { totalCorrect: 0, totalAttempts: 0, badges: [], lastPlayed: null };
export function loadProgress() { return { ...DEFAULT, ...read() }; }
export function recordAnswer(correct) {
  const p = loadProgress();
  p.totalAttempts += 1;
  if (correct) p.totalCorrect += 1;
  p.lastPlayed = Date.now();
  write(p); return p;
}
export function checkNewBadges(progress, BADGES) {
  const newBadges = [];
  for (const b of BADGES) {
    if (!progress.badges.includes(b.id) && progress.totalCorrect >= b.threshold) {
      newBadges.push(b); progress.badges.push(b.id);
    }
  }
  if (newBadges.length > 0) write(progress);
  return newBadges;
}
export function resetProgress() { write(DEFAULT); }
