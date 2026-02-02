const DEFAULT_STATE = {
  level: 1,
  difficulty: 1,
  streak: 0,
  wrongStreak: 0,
  coins: 0,
  stars: 0,
  progress: 0,
  calmMode: false,
  lastOutcome: null
};

export function createState({ gameId, storage }) {
  let state = Object.assign({}, DEFAULT_STATE, loadPersisted(storage, gameId));
  const listeners = new Set();

  function emit() {
    listeners.forEach((fn) => fn({ ...state }));
  }

  function persist() {
    if (storage && typeof storage.saveGameState === "function") {
      storage.saveGameState(gameId, state);
    }
  }

  function update(patch) {
    state = Object.assign({}, state, patch, { updatedAt: Date.now() });
    persist();
    emit();
    return state;
  }

  function applyOutcome(outcome) {
    const correct = Boolean(outcome?.correct);
    const next = {
      lastOutcome: outcome || null,
      streak: correct ? state.streak + 1 : 0,
      wrongStreak: correct ? 0 : state.wrongStreak + 1
    };
    return update(next);
  }

  function resetRound() {
    return update({ lastOutcome: null });
  }

  return {
    getState: () => ({ ...state }),
    update,
    applyOutcome,
    resetRound,
    subscribe: (fn) => {
      if (typeof fn === "function") {
        listeners.add(fn);
      }
      return () => listeners.delete(fn);
    }
  };
}

function loadPersisted(storage, gameId) {
  if (!storage || typeof storage.loadGameState !== "function") return {};
  return storage.loadGameState(gameId) || {};
}
