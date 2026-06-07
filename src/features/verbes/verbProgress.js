const KEY = 'lena:verbes:v1';

function defaultProgress() {
  return {
    totalXP: 0,
    badges: [],
    niveaux: {},
    verbsMastered: [],
    totalCorrect: 0,
    totalAnswered: 0,
    tempsStats: { present: { correct: 0, total: 0 }, futur: { correct: 0, total: 0 }, imparfait: { correct: 0, total: 0 } },
    lastPlayed: null,
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress();
  } catch { return defaultProgress(); }
}

export function saveProgress(prog) {
  try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch {}
}

export function recordVerbAnswer(isCorrect, temps) {
  const prog = loadProgress();
  prog.totalAnswered++;
  if (isCorrect) prog.totalCorrect++;
  if (temps && prog.tempsStats[temps]) {
    prog.tempsStats[temps].total++;
    if (isCorrect) prog.tempsStats[temps].correct++;
  }
  prog.lastPlayed = Date.now();
  saveProgress(prog);
  return prog;
}

export function addXP(niveauId, amount) {
  const prog = loadProgress();
  prog.totalXP = (prog.totalXP || 0) + amount;
  if (!prog.niveaux[niveauId]) prog.niveaux[niveauId] = { xp: 0, stars: 0, completed: false, miniJeuxDone: [] };
  prog.niveaux[niveauId].xp = (prog.niveaux[niveauId].xp || 0) + amount;
  saveProgress(prog);
  return prog;
}

export function completeNiveau(niveauId, stars) {
  const prog = loadProgress();
  if (!prog.niveaux[niveauId]) prog.niveaux[niveauId] = { xp: 0, stars: 0, completed: false, miniJeuxDone: [] };
  prog.niveaux[niveauId].completed = true;
  prog.niveaux[niveauId].stars = Math.max(prog.niveaux[niveauId].stars || 0, stars);
  saveProgress(prog);
  return prog;
}

export function checkNewBadges(prog, badges) {
  const earned = badges.filter(b => !prog.badges.includes(b.id) && prog.totalXP >= b.threshold);
  if (earned.length > 0) {
    prog.badges = [...(prog.badges || []), ...earned.map(b => b.id)];
    saveProgress(prog);
  }
  return earned;
}
