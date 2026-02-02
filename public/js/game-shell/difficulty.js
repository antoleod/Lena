const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;

export function adjustDifficulty(current, streak, wrongStreak) {
  let next = Number(current) || MIN_DIFFICULTY;
  if (streak >= 3) {
    next = Math.min(MAX_DIFFICULTY, next + 1);
  }
  if (wrongStreak >= 2) {
    next = Math.max(MIN_DIFFICULTY, next - 1);
  }
  return next;
}

export function describeDifficulty(level) {
  const labels = ["🌱", "🌿", "🌳", "⛰️", "🚀"];
  const idx = Math.min(labels.length - 1, Math.max(0, level - 1));
  return labels[idx];
}
