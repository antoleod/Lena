/**
 * Global level progression system (1-10)
 * Computes levels based on total activities completed
 */

export const LEVEL_THRESHOLDS = [
  0,   // Level 1
  5,   // Level 2
  12,  // Level 3
  22,  // Level 4
  35,  // Level 5
  52,  // Level 6
  72,  // Level 7
  97,  // Level 8
  127, // Level 9
  162, // Level 10
  202, // Level 11
  248, // Level 12
  300, // Level 13
  359, // Level 14
  425, // Level 15
  500, // Level 16
  585, // Level 17
  680, // Level 18
  786, // Level 19
  905  // Level 20
];

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
