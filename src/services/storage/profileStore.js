const STORAGE_KEY = 'lena:profile:v1';

function defaultProfile() {
  return {
    id: 'default',
    name: '',
    identity: 'child', // 'child' is neutral; can be 'boy' | 'girl' for cosmetics
    avatarId: 'avatar-unicorn',
    themeId: 'theme-candy',
    visualTheme: 'forest', // starting world-style theme
    language: 'fr',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    worldsUnlocked: ['world-1'],
    missionsUnlocked: [],
    lastVisitedRoute: '/',
    totalStudyMinutes: 0,
    totalActivitiesCompleted: 0,
    totalExamsCompleted: 0,
    streakCurrent: 0,
    streakBest: 0
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile(),
      ...parsed,
      worldsUnlocked: parsed.worldsUnlocked || ['world-1'],
      missionsUnlocked: parsed.missionsUnlocked || []
    };
  } catch {
    return defaultProfile();
  }
}

function writeStore(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('lena-profile-change'));
  } catch {
    // ignore persistence failures
  }
}

export function getProfile() {
  return readStore();
}

export function saveProfile(patch) {
  const current = readStore();
  const next = {
    ...current,
    ...patch,
    updatedAt: Date.now()
  };
  writeStore(next);
  return next;
}

export function isProfileComplete() {
  const profile = readStore();
  return Boolean(profile.name && profile.avatarId && profile.themeId && profile.language);
}

export function trackStudySession({ minutes = 0, activitiesCompleted = 0, examsCompleted = 0 }) {
  const profile = readStore();
  const next = {
    ...profile,
    totalStudyMinutes: (profile.totalStudyMinutes || 0) + minutes,
    totalActivitiesCompleted: (profile.totalActivitiesCompleted || 0) + activitiesCompleted,
    totalExamsCompleted: (profile.totalExamsCompleted || 0) + examsCompleted
  };
  writeStore(next);
  return next;
}

export function unlockWorld(worldId) {
  const profile = readStore();
  if (profile.worldsUnlocked.includes(worldId)) return profile;
  const next = {
    ...profile,
    worldsUnlocked: [...profile.worldsUnlocked, worldId]
  };
  writeStore(next);
  return next;
}

export function unlockMission(missionKey) {
  const profile = readStore();
  if (profile.missionsUnlocked.includes(missionKey)) return profile;
  const next = {
    ...profile,
    missionsUnlocked: [...profile.missionsUnlocked, missionKey]
  };
  writeStore(next);
  return next;
}

