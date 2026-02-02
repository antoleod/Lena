const VERSION = "1.0.0";
const KEY = "lena:gameShell";

export function loadGameState(gameId) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== VERSION) return null;
    return parsed.games?.[gameId] || null;
  } catch (err) {
    console.warn("[gameshell] load failed, resetting", err);
    localStorage.removeItem(KEY);
    return null;
  }
}

export function saveGameState(gameId, data) {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : { version: VERSION, games: {} };
    const safe = parsed && parsed.version === VERSION ? parsed : { version: VERSION, games: {} };
    safe.games[gameId] = Object.assign({}, data, { gameId });
    localStorage.setItem(KEY, JSON.stringify(safe));
  } catch (err) {
    console.warn("[gameshell] save failed", err);
  }
}

export function clearCorrupt() {
  localStorage.removeItem(KEY);
}
