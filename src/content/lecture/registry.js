// Registry for lecture stories — lazy-loaded via import.meta.glob.

const modules = import.meta.glob('./stories/**/*.json', { eager: false });

// Build a quick index: themeId -> level -> [storyId, ...]
const _index = {};
for (const path of Object.keys(modules)) {
  // path like: ./stories/anniversaires/anniversaires-facile-01.json
  const parts = path.split('/');
  const themeId = parts[2];
  const filename = parts[3].replace('.json', '');
  const segments = filename.split('-');
  // level is always the second-to-last segment group before the number
  // id format: <theme>-<level>-<nn>  but theme may contain hyphens
  // find level by matching known levels
  const LEVELS = ['facile', 'moyen', 'difficile'];
  let level = null;
  for (const l of LEVELS) {
    if (filename.includes('-' + l + '-')) { level = l; break; }
  }
  if (!level) continue;
  if (!_index[themeId]) _index[themeId] = { facile: [], moyen: [], difficile: [] };
  _index[themeId][level].push(filename);
}

// Theme metadata is derived from the story files at load time.
// We provide a lightweight static metadata list based on known themes.
const THEME_META = [
  { id: 'anniversaires', label: 'Les anniversaires',     emoji: '🎂' },
  { id: 'ecole',         label: "L'ecole",               emoji: '🏫' },
  { id: 'animaux',       label: 'Les animaux',           emoji: '🐶' },
  { id: 'saisons',       label: 'Les saisons',           emoji: '🌳' },
  { id: 'fruits',        label: 'Les fruits',            emoji: '🍎' },
  { id: 'famille',       label: 'La famille',            emoji: '👨‍👩‍👧‍👦' },
  { id: 'amis',          label: 'Les amis',              emoji: '🤝' },
  { id: 'transports',    label: 'Les transports',        emoji: '🚲' },
  { id: 'sport',         label: 'Le sport',              emoji: '⚽' },
  { id: 'vacances',      label: 'Les vacances',          emoji: '🌊' },
  { id: 'emotions',      label: 'Les emotions',          emoji: '🎭' },
  { id: 'fetes',         label: 'Les fetes',             emoji: '🎄' },
  { id: 'meteo',         label: 'La meteo',              emoji: '🌦' },
  { id: 'metiers',       label: 'Les metiers',           emoji: '🏥' },
  { id: 'cantine',       label: 'La cantine',            emoji: '🍽' },
  { id: 'maison',        label: 'La maison',             emoji: '🏡' },
  { id: 'bibliotheque',  label: 'La bibliotheque',       emoji: '📚' },
  { id: 'courses',       label: 'Les courses',           emoji: '🛒' },
  { id: 'services',      label: 'Les services',          emoji: '🚒' },
  { id: 'monde',         label: 'Le monde',              emoji: '🌎' },
];

export function getThemes() {
  return THEME_META.map((meta) => {
    const counts = _index[meta.id]
      ? {
          facile:    (_index[meta.id].facile    || []).length,
          moyen:     (_index[meta.id].moyen     || []).length,
          difficile: (_index[meta.id].difficile || []).length,
        }
      : { facile: 0, moyen: 0, difficile: 0 };
    return { ...meta, counts };
  });
}

export async function getStoriesByTheme(themeId, level) {
  const ids = (_index[themeId] && _index[themeId][level]) || [];
  return ids.map((id) => ({ id, themeId, level }));
}

export async function getStory(storyId) {
  // Reconstruct path from storyId: <theme>-<level>-<nn>
  const LEVELS = ['facile', 'moyen', 'difficile'];
  let level = null;
  let themeId = null;
  for (const l of LEVELS) {
    const idx = storyId.indexOf('-' + l + '-');
    if (idx !== -1) {
      level = l;
      themeId = storyId.slice(0, idx);
      break;
    }
  }
  if (!themeId) return null;
  const path = `./stories/${themeId}/${storyId}.json`;
  if (!modules[path]) return null;
  const mod = await modules[path]();
  return mod.default || mod;
}
