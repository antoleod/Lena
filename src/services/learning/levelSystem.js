/**
 * Global level progression system (1-10)
 * Computes levels based on total activities completed
 */

export const LEVEL_THRESHOLDS = [0, 5, 12, 22, 35, 52, 72, 97, 127, 162];

export function computeGlobalLevel(totalActivitiesCompleted) {
  const n = totalActivitiesCompleted || 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (n >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getLevelProgress(totalActivitiesCompleted) {
  const n = totalActivitiesCompleted || 0;
  const level = computeGlobalLevel(n);
  const currentLevelAt = LEVEL_THRESHOLDS[level - 1];
  const nextLevelAt = LEVEL_THRESHOLDS[level] ?? null;
  const progress = nextLevelAt
    ? Math.min(1, (n - currentLevelAt) / (nextLevelAt - currentLevelAt))
    : 1;
  return { level, currentLevelAt, nextLevelAt, progress };
}

export function inferLevelNumFromGrade(activity) {
  const band = (activity.gradeBand || [])[0] || '';
  const map = { P2: 2, P3: 4, P4: 5, P5: 7, P6: 9 };
  return map[band] ?? 5;
}
