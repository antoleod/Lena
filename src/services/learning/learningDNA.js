// ─────────────────────────────────────────────────────────────────────────────
// learningDNA — the child's living learning profile (contract Phase 2 / Track 2.4).
//
// Updated PER SESSION (not per event) to keep Firestore writes small (contract
// decision 2026-06-11). The DNA is derived from real played events via the pure
// adaptiveEngine, then persisted locally and tagged with childId. The existing
// blob-sync picks it up (key added to syncService STORE_KEYS).
// ─────────────────────────────────────────────────────────────────────────────

import { getProfile } from '../storage/profileStore.js';
import { getLearningControls } from '../storage/parentalStore.js';
import { analyzePerformance, classifySkills, decideNext } from './adaptiveEngine.js';

const DNA_KEY = 'lena:learningDNA:v1'; // { [childId]: dna }

function defaultDNA(childId, profile) {
  return {
    childId,
    age: profile?.age ?? null,
    schoolGrade: profile?.schoolGrade ?? null,
    countrySystem: profile?.countrySystem ?? null,
    preferredLanguage: profile?.language ?? null,
    masteredSkills: [],
    learningSkills: [],
    weakSkills: [],
    recommendedNextSkills: [],
    behaviorProfile: {
      averageResponseTime: null,
      accuracyTrend: null,
      sessionsPlayed: 0,
      totalAnswered: 0,
    },
    seenSessionIds: [],   // last N session ids, to count distinct sessions accurately
    updatedAt: null,
  };
}

const MAX_SEEN_SESSIONS = 50;

function readAll() {
  try {
    const raw = window.localStorage.getItem(DNA_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    window.localStorage.setItem(DNA_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('lena-learning-dna-change'));
  } catch {
    // ignore — local-first must never throw
  }
}

function currentChildId(profile) {
  return profile?.id || 'default';
}

/** Read the DNA for the current (or given) child. */
export function getLearningDNA(childId) {
  const profile = getProfile();
  const id = childId || currentChildId(profile);
  return readAll()[id] || defaultDNA(id, profile);
}

/**
 * Recompute the DNA from a session's played events and merge it into the stored
 * profile. Idempotent-ish: skills accumulate (union), behaviour is rolling-averaged.
 *
 * @param {object[]} events — the played events for the session just finished.
 * @returns {object} the updated DNA.
 */
export function updateDNAFromSession(events = []) {
  const profile = getProfile();
  const id = currentChildId(profile);
  const all = readAll();
  const prev = all[id] || defaultDNA(id, profile);

  const perf = analyzePerformance(events);
  const { mastered, struggling, learning } = classifySkills(perf);
  const recommendation = decideNext({ profile, events, parentControls: safeControls() });

  // Rolling average of response time across sessions.
  const prevAvg = prev.behaviorProfile.averageResponseTime;
  const sessionAvg = avgResponseTime(perf);
  const averageResponseTime = blendAvg(prevAvg, sessionAvg);

  // Count distinct sessions, not flushes: only bump when a new sessionId appears.
  const prevSeen = prev.seenSessionIds || [];
  const newSessionIds = [...new Set(events.map((e) => e.sessionId).filter(Boolean))]
    .filter((sid) => !prevSeen.includes(sid));
  const seenSessionIds = [...prevSeen, ...newSessionIds].slice(-MAX_SEEN_SESSIONS);

  const next = {
    ...prev,
    age: profile.age ?? prev.age,
    schoolGrade: profile.schoolGrade ?? prev.schoolGrade,
    countrySystem: profile.countrySystem ?? prev.countrySystem,
    preferredLanguage: profile.language ?? prev.preferredLanguage,
    masteredSkills: union(prev.masteredSkills, mastered),
    // a skill that became mastered should leave the weak list
    weakSkills: subtract(union(prev.weakSkills, struggling), mastered),
    learningSkills: learning,
    recommendedNextSkills: recommendation.challengeTopics,
    behaviorProfile: {
      averageResponseTime,
      accuracyTrend: recommendation.overallAccuracy,
      sessionsPlayed: (prev.behaviorProfile.sessionsPlayed || 0) + newSessionIds.length,
      totalAnswered: (prev.behaviorProfile.totalAnswered || 0) + perf.totalAnswered,
    },
    seenSessionIds,
    updatedAt: Date.now(),
  };

  all[id] = next;
  writeAll(all);
  return next;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function safeControls() {
  try { return getLearningControls(); } catch { return {}; }
}

function union(a = [], b = []) { return [...new Set([...a, ...b])]; }
function subtract(a = [], b = []) { const rm = new Set(b); return a.filter((x) => !rm.has(x)); }

function avgResponseTime(perf) {
  const skills = Object.values(perf.bySkill).filter((p) => p.avgTimeMs != null);
  if (!skills.length) return null;
  return Math.round(skills.reduce((s, p) => s + p.avgTimeMs, 0) / skills.length);
}

function blendAvg(prev, next) {
  if (next == null) return prev;
  if (prev == null) return next;
  return Math.round(prev * 0.7 + next * 0.3); // weight history, adapt slowly
}
