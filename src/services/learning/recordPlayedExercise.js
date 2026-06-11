/**
 * recordPlayedExercise — the single entry point every play surface calls when the
 * child actually answers/finishes an exercise.
 *
 * Track 1.3 of the Mission Impossible contract. Builds a normalized `playedExercise`
 * event (contract / `docs/new categori` Phase 4), tags it with childId + sessionId,
 * and hands it to the local-first queue. Firebase sync drains the queue separately.
 *
 * Two flavors (see contract §4):
 *   - rich per-question events  → activities / exams (most fields present)
 *   - session-summary events    → games (no per-question data available)
 * Both go through here; callers just pass what they have. Missing fields stay null.
 */

import { getProfile } from '../storage/profileStore.js';
import { enqueuePlayedEvent, currentSessionId } from './playedEventsStore.js';

function makeEventId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @param {object} input — whatever the call site has. Unknown fields are ignored,
 *   missing ones default to null. Shape mirrors `playedExercise` in the spec:
 *   { exerciseId, sourceModule, gameMode, subject, skill, subSkill, questionType,
 *     question, expectedAnswer, childAnswer, isCorrect, responseTimeMs, attempts,
 *     hintsUsed, difficultyBefore, difficultyAfter, generatedBy, flavor }
 * @returns {object} the queued event (with eventId, childId, sessionId, createdAt)
 */
export function recordPlayedExercise(input = {}) {
  // childId: multi-child data-model tagging. Today the single profile's id ('default');
  // when multi-profile lands this already carries the right key. (contract §4)
  const childId = getProfile().id || 'default';

  const event = {
    eventId:   makeEventId(),
    childId,
    sessionId: currentSessionId(),

    exerciseId:    input.exerciseId ?? null,
    sourceModule:  input.sourceModule ?? null,
    gameMode:      input.gameMode ?? null,
    subject:       input.subject ?? null,
    skill:         input.skill ?? null,
    subSkill:      input.subSkill ?? null,
    questionType:  input.questionType ?? null,

    question:       input.question ?? null,
    expectedAnswer: input.expectedAnswer ?? null,
    childAnswer:    input.childAnswer ?? null,
    isCorrect:      typeof input.isCorrect === 'boolean' ? input.isCorrect : null,

    responseTimeMs:   Number.isFinite(input.responseTimeMs) ? input.responseTimeMs : null,
    attempts:         Number.isFinite(input.attempts) ? input.attempts : null,
    hintsUsed:        Number.isFinite(input.hintsUsed) ? input.hintsUsed : null,
    difficultyBefore: input.difficultyBefore ?? null,
    difficultyAfter:  input.difficultyAfter ?? null,

    generatedBy: input.generatedBy ?? null,
    flavor:      input.flavor === 'session' ? 'session' : 'question', // default: per-question
    createdAt:   Date.now(),
  };

  return enqueuePlayedEvent(event);
}
