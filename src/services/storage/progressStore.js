const STORAGE_KEY = 'lena:migration:progress:v2';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultStore() {
  return {
    activities: {},
    meta: {
      lastActivityId: null,
      lastPlayedAt: null,
      streakCurrent: 0,
      streakBest: 0
    }
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultStore(), ...JSON.parse(raw) } : defaultStore();
  } catch {
    return defaultStore();
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event('lena-progress-change'));
  } catch {
    // ignore persistence failures
  }
}

function updateStreak(meta) {
  const currentDay = todayKey();
  const lastDay = meta.lastPlayedAt ? new Date(meta.lastPlayedAt).toISOString().slice(0, 10) : null;

  if (lastDay === currentDay) {
    return meta;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const streakCurrent = lastDay === yesterdayKey ? meta.streakCurrent + 1 : 1;

  return {
    ...meta,
    streakCurrent,
    streakBest: Math.max(meta.streakBest || 0, streakCurrent)
  };
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

export function getProgressSnapshot() {
  return readStore();
}

export function getProgressMeta() {
  return readStore().meta;
}

export function saveActivityProgress(activityId, patch) {
  const store = readStore();
  const previous = store.activities[activityId] || getActivityProgress(activityId);
  const score = patch.bestScore ?? patch.lastScore ?? 0;
  const next = {
    ...previous,
    ...patch,
    attempts: previous.attempts + 1,
    bestScore: Math.max(previous.bestScore || 0, score),
    lastScore: patch.lastScore ?? previous.lastScore,
    updatedAt: Date.now()
  };

  const meta = updateStreak(store.meta);

  store.activities[activityId] = next;
  store.meta = {
    ...meta,
    lastActivityId: activityId,
    lastPlayedAt: Date.now()
  };
  writeStore(store);
  return next;
}

export function getProgressOverview(activityList, moduleList) {
  const store = readStore();
  const activityEntries = Object.entries(store.activities);
  const completedCount = activityEntries.filter(([, value]) => value.completed).length;
  const totalActivities = activityList.length;
  const totalModules = moduleList.length;

  const subjectProgress = activityList.reduce((accumulator, activity) => {
    const progress = store.activities[activity.id];
    const current = accumulator[activity.subject] || { total: 0, completed: 0 };
    current.total += 1;
    if (progress?.completed) {
      current.completed += 1;
    }
    accumulator[activity.subject] = current;
    return accumulator;
  }, {});

  return {
    completedActivities: completedCount,
    totalActivities,
    totalModules,
    streakCurrent: store.meta.streakCurrent || 0,
    streakBest: store.meta.streakBest || 0,
    lastActivityId: store.meta.lastActivityId,
    subjectProgress
  };
}
