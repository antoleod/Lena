const KEY = 'lena:dico:v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{"favorites":[],"recentIds":[]}'); }
  catch { return { favorites: [], recentIds: [] }; }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}
export function loadDicoProgress() { return load(); }
export function toggleFavorite(wordId) {
  const d = load();
  const idx = d.favorites.indexOf(wordId);
  if (idx >= 0) d.favorites.splice(idx, 1);
  else d.favorites.unshift(wordId);
  save(d); return d;
}
export function addRecent(wordId) {
  const d = load();
  d.recentIds = [wordId, ...d.recentIds.filter(id => id !== wordId)].slice(0, 8);
  save(d); return d;
}
