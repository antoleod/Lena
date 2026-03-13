const STORAGE_KEY = 'lena:migration:progress:v3';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultQuestionState() {
  return {
    attempts: 0,
    failures: 0,
    successStreak: 0,
    status: 'unseen',
    lastSeenAt: null
  };
}

function defaultStore() {
  return {
    activities: {},
    levels: {},
    questions: {},
    meta: {
      lastActivityId: null,
      lastLevelId: null,
      lastPlayedAt: null,
      streakCurrent: 0,
      streakBest: 0,
      totalCorrect: 0,
      totalWrong: 0
    }
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      ...defaultStore(),
      ...parsed,
      activities: parsed.activities || {},
      levels: parsed.levels || {},
      questions: parsed.questions || {},
      meta: {
        ...defaultStore().meta,
        ...(parsed.meta || {})
      }
    };
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

function getQuestionKey(activityId, questionId) {
  return `${activityId}::${questionId}`;
}

function computeQuestionStatus(questionState) {
  if (!questionState.attempts) {
    return 'unseen';
  }
  if (questionState.successStreak >= 2 && questionState.failures <= 1) {
    return 'mastered';
  }
  if (questionState.failures >= 2 || (questionState.failures >= 1 && questionState.successStreak === 0)) {
    return 'failed';
  }
  return 'shaky';
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

export function getLevelProgress(levelId) {
  const store = readStore();
  return store.levels[levelId] || {
    attempts: 0,
    completed: false,
    bestScore: 0,
    lastScore: 0,
    updatedAt: null,
    activityId: null
  };
}

export function getQuestionProgress(activityId, questionId) {
  const store = readStore();
  const key = getQuestionKey(activityId, questionId);
  return store.questions[key] || defaultQuestionState();
}

export function recordQuestionOutcome(activityId, questionId, isCorrect) {
  const store = readStore();
  const key = getQuestionKey(activityId, questionId);
  const previous = store.questions[key] || defaultQuestionState();
  const next = {
    ...previous,
    attempts: previous.attempts + 1,
    failures: isCorrect ? previous.failures : previous.failures + 1,
    successStreak: isCorrect ? previous.successStreak + 1 : 0,
    lastSeenAt: Date.now()
  };
  next.status = computeQuestionStatus(next);

  store.questions[key] = next;
  store.meta = {
    ...store.meta,
    totalCorrect: (store.meta.totalCorrect || 0) + (isCorrect ? 1 : 0),
    totalWrong: (store.meta.totalWrong || 0) + (isCorrect ? 0 : 1)
  };
  writeStore(store);
  return next;
}

export function getActivityQuestionStates(activityId) {
  const store = readStore();
  return Object.entries(store.questions).reduce((accumulator, [key, value]) => {
    if (!key.startsWith(`${activityId}::`)) {
      return accumulator;
    }
    accumulator[key.replace(`${activityId}::`, '')] = value;
    return accumulator;
  }, {});
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

export function saveLevelProgress(levelId, patch) {
  const store = readStore();
  const previous = store.levels[levelId] || getLevelProgress(levelId);
  const score = patch.bestScore ?? patch.lastScore ?? 0;
  const next = {
    ...previous,
    ...patch,
    levelId,
    attempts: previous.attempts + 1,
    bestScore: Math.max(previous.bestScore || 0, score),
    lastScore: patch.lastScore ?? previous.lastScore,
    updatedAt: Date.now()
  };

  const meta = updateStreak(store.meta);

  store.levels[levelId] = next;
  store.meta = {
    ...meta,
    lastLevelId: levelId,
    lastActivityId: patch.activityId || store.meta.lastActivityId,
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

  const mastery = Object.values(store.questions).reduce((accumulator, question) => {
    const current = accumulator[question.status] || 0;
    accumulator[question.status] = current + 1;
    return accumulator;
  }, { unseen: 0, failed: 0, shaky: 0, mastered: 0 });

  return {
    completedActivities: completedCount,
    totalActivities,
    totalModules,
    streakCurrent: store.meta.streakCurrent || 0,
    streakBest: store.meta.streakBest || 0,
    lastActivityId: store.meta.lastActivityId,
    totalCorrect: store.meta.totalCorrect || 0,
    totalWrong: store.meta.totalWrong || 0,
    subjectProgress,
    mastery
  };
}
