import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lena_mobile_progress_v1';
let cache = null;

export async function loadProgress() {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : {};
  } catch {
    cache = {};
  }
  return cache;
}

export async function saveProgress(next) {
  cache = next;
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore write errors
  }
}

export async function markLevelCompleted(gameId, level) {
  const data = await loadProgress();
  const game = data[gameId] || { completed: {} };
  game.completed[level] = true;
  data[gameId] = game;
  await saveProgress(data);
}

export async function isLevelCompleted(gameId, level) {
  const data = await loadProgress();
  return Boolean(data?.[gameId]?.completed?.[level]);
}
