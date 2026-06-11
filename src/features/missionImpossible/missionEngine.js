// ─────────────────────────────────────────────────────────────────────────────
// missionEngine — the adaptive ladder behind "Mission Impossible" (contract Track 3).
//
// A learning laboratory disguised as an adventure: it starts at a comfortable band,
// steps UP after a streak of successes, steps DOWN after struggle, and detects the
// child's current LIMIT — the band they can no longer hold. Pure & testable; the
// React page owns the UI and persistence (recordPlayedExercise / DNA).
//
// Bands map onto the existing generator vocabulary ({grade, difficulty, topic}).
// There is no P1 generator content yet, so band 1 clamps to the easiest P2 range.
// ─────────────────────────────────────────────────────────────────────────────

/** 5 difficulty bands → generator params + topic pool. */
export const MISSION_BANDS = [
  { band: 1, grade: 'P2', difficulty: 'easy',   topics: ['addition', 'comparison'] },
  { band: 2, grade: 'P2', difficulty: 'easy',   topics: ['addition', 'subtraction', 'comparison'] },
  { band: 3, grade: 'P2', difficulty: 'medium', topics: ['addition', 'subtraction', 'logic-sequence'] },
  { band: 4, grade: 'P3', difficulty: 'medium', topics: ['multiplication', 'subtraction', 'word-problems', 'logic'] },
  { band: 5, grade: 'P4', difficulty: 'hard',   topics: ['multiplication', 'division', 'fractions', 'mixed-operations'] },
];

export const MIN_BAND = 1;
export const MAX_BAND = MISSION_BANDS.length; // 5

export const STEP_UP_STREAK = 2;   // this many correct in a row → harder
export const STEP_DOWN_STREAK = 2; // this many wrong in a row → easier
export const MAX_CHALLENGES = 12;  // a mission is short by design (avoid fatigue)

export function bandConfig(band) {
  return MISSION_BANDS[clampBand(band) - 1];
}

function clampBand(band) {
  return Math.max(MIN_BAND, Math.min(MAX_BAND, band));
}

/** Pick a comfortable starting band from the child's grade (1 below grade index). */
export function startingBand(gradeIndex) {
  if (!gradeIndex) return 2;
  return clampBand(gradeIndex - 1);
}

/**
 * Decide the next band from the running result history.
 * @param {number} currentBand
 * @param {boolean[]} results — chronological correct/incorrect for the CURRENT band run
 * @returns {{ band: number, direction: 'up'|'down'|'stay' }}
 */
export function nextBand(currentBand, results) {
  const tail = trailingStreak(results);
  if (tail.correct >= STEP_UP_STREAK && currentBand < MAX_BAND) {
    return { band: currentBand + 1, direction: 'up' };
  }
  if (tail.wrong >= STEP_DOWN_STREAK && currentBand > MIN_BAND) {
    return { band: currentBand - 1, direction: 'down' };
  }
  return { band: currentBand, direction: 'stay' };
}

/** Length of the current same-result streak at the end of the list. */
function trailingStreak(results = []) {
  let correct = 0;
  let wrong = 0;
  for (let i = results.length - 1; i >= 0; i -= 1) {
    if (results[i]) { if (wrong) break; correct += 1; }
    else { if (correct) break; wrong += 1; }
  }
  return { correct, wrong };
}

/**
 * The detected learning limit = the highest band the child answered correctly at
 * least once, OR (if they failed everywhere) the lowest band attempted.
 * @param {{band:number, isCorrect:boolean}[]} log — every answered challenge
 */
export function detectLimit(log = []) {
  const passed = log.filter((e) => e.isCorrect).map((e) => e.band);
  if (passed.length) return Math.max(...passed);
  if (log.length) return Math.min(...log.map((e) => e.band));
  return null;
}

/** Whether the mission should end. */
export function isMissionComplete(log) {
  return log.length >= MAX_CHALLENGES;
}
