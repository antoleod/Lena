import { useRef, useEffect } from 'react';
import { getGameProgress, saveGameSession } from '../../services/storage/gameProgressStore.js';

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

  function saveSession({ score, level, stars }) {
    const timeSecs = elapsedSecs();
    return saveGameSession(gameId, { score, level, stars, timeSecs });
  }

  return { progress, saveSession, resetTimer, elapsedSecs };
}
