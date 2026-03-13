const STORAGE_KEY = 'lena:migration:progress:v1';

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { activities: {} };
  } catch {
    return { activities: {} };
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore persistence failures
  }
}

export function getActivityProgress(activityId) {
  const store = readStore();
  return store.activities[activityId] || {
    attempts: 0,
    completed: false,
    bestScore: 0,
    lastScore: 0,
    updatedAt: null
  };
}

export function saveActivityProgress(activityId, patch) {
  const store = readStore();
  const previous = getActivityProgress(activityId);
  const score = patch.bestScore ?? patch.lastScore ?? 0;
  const next = {
    ...previous,
    ...patch,
    attempts: previous.attempts + 1,
    bestScore: Math.max(previous.bestScore || 0, score),
    lastScore: patch.lastScore ?? previous.lastScore,
    updatedAt: Date.now()
  };
  store.activities[activityId] = next;
  writeStore(store);
  return next;
}
