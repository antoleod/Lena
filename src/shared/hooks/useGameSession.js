import { useRef } from 'react';
import { getGameProgress, saveGameSession, saveGameErrors } from '../../services/storage/gameProgressStore.js';
import { recordPlayedExercise } from '../../services/learning/recordPlayedExercise.js';

/**
 * Hook for tracking a single game session.
 *
 * Usage:
 *   const { progress, saveSession, elapsedSecs } = useGameSession('tetris');
 *   // At game end:
 *   const result = saveSession({ score: 420, level: 2, stars: 3 });
 *   // result.isNewBest, result.newUnlocked
 */
export function useGameSession(gameId) {
  const startRef    = useRef(Date.now());
  const progress    = getGameProgress(gameId);

  // Reset timer when game starts (call resetTimer() when entering play phase)
  function resetTimer() {
    startRef.current = Date.now();
  }

  function elapsedSecs() {
    return Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
  }

  const errorsRef = useRef([]);

  function logError(error) {
    errorsRef.current.push(error);
  }

  function saveSession({ score, level, stars }) {
    const timeSecs = elapsedSecs();
    const errorCount = errorsRef.current.length;
    if (errorCount > 0) {
      saveGameErrors(gameId, errorsRef.current);
      errorsRef.current = [];
    }

    // Track 1: games emit a session-summary played event (no per-question data).
    recordPlayedExercise({
      flavor:         'session',
      exerciseId:     gameId,
      sourceModule:   'jeux',
      gameMode:       gameId,
      subject:        'jeux',
      responseTimeMs: timeSecs * 1000,
      attempts:       errorCount, // wrong answers logged this session
      difficultyAfter: level ?? null,
      generatedBy:    'game',
    });

    return saveGameSession(gameId, { score, level, stars, timeSecs });
  }

  return { progress, saveSession, resetTimer, elapsedSecs, logError };
}
