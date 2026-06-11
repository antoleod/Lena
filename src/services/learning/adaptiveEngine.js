// ─────────────────────────────────────────────────────────────────────────────
// adaptiveEngine — the first version of LénaLand's "Learning Brain" decision core.
//
// Track 2 of the Mission Impossible contract (docs/MISSION-IMPOSSIBLE-CONTRACT.md).
//
// PURE & STATELESS by design: it takes data in, returns a recommendation out. No
// localStorage, no Firebase, no React. That keeps it unit-testable and lets every
// launcher call it the same way. It consumes data that already exists:
//   - childProfile           (age, schoolGrade, adaptiveModeEnabled, parent overrides)
//   - recent played events   (playedEventsStore / Firebase history)
//   - weakAreas              (errorHistoryStore.getWeakAreas)
//
// Rule from the contract: age & grade are CONTEXT; performance is the deciding signal.
// ─────────────────────────────────────────────────────────────────────────────

import { GRADE_KEYS, gradeFromAge, gradeIndex } from './gradeModel.js';

// Tunable thresholds — named so the behaviour is legible and testable.
export const THRESHOLDS = {
  MASTERY_ACCURACY: 0.85,   // ≥ this (with enough attempts) → mastered
  STRUGGLE_ACCURACY: 0.5,   // < this → struggling
  MIN_ATTEMPTS: 4,          // need this many before judging a skill
  FAST_MS: 6000,            // a "fast" correct answer is under this
  SLOW_MS: 15000,           // a "slow" answer is over this
  DIFFICULTY_MIN: 1,
  DIFFICULTY_MAX: 5,
};

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Aggregate per-question played events into per-skill performance.
 * Session-summary events (flavor==='session', e.g. games) are ignored here — they
 * carry no per-question truth — but counted in `sessionsPlayed`.
 *
 * @returns {{ bySkill: Record<string, SkillPerf>, sessionsPlayed: number, totalAnswered: number }}
 */
export function analyzePerformance(events = []) {
  const bySkill = {};
  let sessionsPlayed = 0;
  let totalAnswered = 0;

  for (const e of events) {
    if (e.flavor === 'session') { sessionsPlayed += 1; continue; }
    if (typeof e.isCorrect !== 'boolean') continue;

    const key = e.skill || e.subject || e.sourceModule || 'unknown';
    const p = bySkill[key] || { skill: key, attempts: 0, correct: 0, timeSum: 0, timed: 0, slow: 0, fast: 0 };
    p.attempts += 1;
    totalAnswered += 1;
    if (e.isCorrect) p.correct += 1;
    if (Number.isFinite(e.responseTimeMs)) {
      p.timeSum += e.responseTimeMs;
      p.timed += 1;
      if (e.responseTimeMs > THRESHOLDS.SLOW_MS) p.slow += 1;
      if (e.isCorrect && e.responseTimeMs < THRESHOLDS.FAST_MS) p.fast += 1;
    }
    bySkill[key] = p;
  }

  for (const p of Object.values(bySkill)) {
    p.accuracy = p.attempts ? p.correct / p.attempts : 0;
    p.avgTimeMs = p.timed ? Math.round(p.timeSum / p.timed) : null;
  }

  return { bySkill, sessionsPlayed, totalAnswered };
}

/**
 * Mastery model (contract Phase 7): a skill is mastered with high accuracy, enough
 * attempts and a fast/consistent profile. Struggle model (Phase 8): low accuracy or
 * heavy slowness. Skills without enough attempts are "learning" (undecided).
 *
 * @returns {{ mastered: string[], struggling: string[], learning: string[] }}
 */
export function classifySkills(perf) {
  const mastered = [];
  const struggling = [];
  const learning = [];

  for (const p of Object.values(perf.bySkill)) {
    if (p.attempts < THRESHOLDS.MIN_ATTEMPTS) { learning.push(p.skill); continue; }
    const mostlySlow = p.timed > 0 && p.slow / p.timed > 0.5;
    if (p.accuracy >= THRESHOLDS.MASTERY_ACCURACY && !mostlySlow) {
      mastered.push(p.skill);
    } else if (p.accuracy < THRESHOLDS.STRUGGLE_ACCURACY || mostlySlow) {
      struggling.push(p.skill);
    } else {
      learning.push(p.skill);
    }
  }

  return { mastered, struggling, learning };
}

/**
 * Reconcile grade ∪ age ∪ recent accuracy into a target grade + 1–5 difficulty.
 * Performance is the final nudge: mastering → up, struggling → down.
 */
export function recommendDifficulty({ profile = {}, perf, accuracy }) {
  const ageGrade = gradeFromAge(profile.age);
  const grade = profile.parentSelectedLevel || profile.schoolGrade || ageGrade;

  // Base difficulty 1–5 from grade position (P1→1 … P6→5, capped).
  let difficulty = clamp(gradeIndex(grade) || 3, THRESHOLDS.DIFFICULTY_MIN, THRESHOLDS.DIFFICULTY_MAX);
  const reasons = [`base grade ${grade}`];

  // Behind/ahead of age → ease/raise carefully (contract reconciliation rule).
  const gi = gradeIndex(grade);
  const ai = gradeIndex(ageGrade);
  if (gi != null && ai != null) {
    if (gi < ai) { difficulty = clamp(difficulty - 0.5, THRESHOLDS.DIFFICULTY_MIN, THRESHOLDS.DIFFICULTY_MAX); reasons.push('behind age → ease'); }
    if (gi > ai) { difficulty = clamp(difficulty + 0.5, THRESHOLDS.DIFFICULTY_MIN, THRESHOLDS.DIFFICULTY_MAX); reasons.push('ahead of age → raise carefully'); }
  }

  // Performance is the deciding signal.
  if (typeof accuracy === 'number') {
    if (accuracy < THRESHOLDS.STRUGGLE_ACCURACY) { difficulty = clamp(difficulty - 1, THRESHOLDS.DIFFICULTY_MIN, THRESHOLDS.DIFFICULTY_MAX); reasons.push('struggling → down'); }
    else if (accuracy > THRESHOLDS.MASTERY_ACCURACY) { difficulty = clamp(difficulty + 1, THRESHOLDS.DIFFICULTY_MIN, THRESHOLDS.DIFFICULTY_MAX); reasons.push('mastering → up'); }
  }

  return { grade, difficulty: Math.round(difficulty), reasons };
}

/**
 * Top-level decision. Pure: feed it everything, get a recommendation.
 *
 * @param {{ profile?: object, events?: object[], weakAreas?: object[] }} input
 * @returns {AdaptiveRecommendation}
 */
export function decideNext({ profile = {}, events = [], weakAreas = [] } = {}) {
  // Respect the parent/child opt-out.
  if (profile.adaptiveModeEnabled === false) {
    return {
      adaptive: false,
      grade: profile.schoolGrade || gradeFromAge(profile.age),
      difficulty: clamp(gradeIndex(profile.schoolGrade || gradeFromAge(profile.age)) || 3, 1, 5),
      masteredSkills: [], strugglingSkills: [], learningSkills: [],
      reviewTopics: [], challengeTopics: [], reasons: ['adaptive mode off'],
    };
  }

  const perf = analyzePerformance(events);
  const overallAccuracy = perf.totalAnswered
    ? Object.values(perf.bySkill).reduce((s, p) => s + p.correct, 0) / perf.totalAnswered
    : null;

  const { mastered, struggling, learning } = classifySkills(perf);
  const diff = recommendDifficulty({ profile, perf, accuracy: overallAccuracy });

  // Review = struggling skills ∪ top weak areas (errorHistoryStore). De-duplicated.
  const reviewTopics = [...new Set([
    ...struggling,
    ...weakAreas.slice(0, 3).map((w) => w.key || `${w.subject}:${w.type}`),
  ])];

  return {
    adaptive: true,
    grade: diff.grade,
    difficulty: diff.difficulty,
    masteredSkills: mastered,
    strugglingSkills: struggling,
    learningSkills: learning,
    reviewTopics,                 // ease difficulty / reinforce these
    challengeTopics: mastered,    // reduce frequency / introduce harder variations
    overallAccuracy,
    sessionsPlayed: perf.sessionsPlayed,
    totalAnswered: perf.totalAnswered,
    reasons: diff.reasons,
  };
}
