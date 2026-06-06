// ─────────────────────────────────────────────────────────────────────────────
// Catalogue of subjects / exercise types shown on the selection screen.
//
// To add a new exercise type later:
//   1. add an entry here (id must match a generator key in exerciseTemplates.js)
//   2. register the generator in exerciseTemplates.js
// No other file needs to change.
// ─────────────────────────────────────────────────────────────────────────────

export const LEVELS = [
  { id: 'easy', label: 'Facile', emoji: '🟢' },
  { id: 'medium', label: 'Moyen', emoji: '🟠' },
  { id: 'hard', label: 'Difficile', emoji: '🔴' },
];

export const COUNTS = [5, 10, 15];

export const SUBJECTS = [
  {
    id: 'math',
    label: 'Mathématiques',
    emoji: '🔢',
    types: [
      { id: 'additions', label: 'Additions', emoji: '➕' },
      { id: 'soustractions', label: 'Soustractions', emoji: '➖' },
      { id: 'multiplications', label: 'Multiplications', emoji: '✖️' },
      { id: 'divisions', label: 'Divisions simples', emoji: '➗' },
      { id: 'measurements', label: 'Mesures (cm, kg, €)', emoji: '📏' },
      { id: 'problemes', label: 'Problèmes écrits', emoji: '📖' },
    ],
  },
  {
    id: 'french',
    label: 'Français',
    emoji: '📝',
    types: [
      { id: 'completer', label: 'Compléter la phrase', emoji: '✏️' },
      { id: 'bon-mot', label: 'Choisir le bon mot', emoji: '🔤' },
      { id: 'comprehension', label: 'Compréhension courte', emoji: '📚' },
      { id: 'vocabulaire', label: 'Vocabulaire', emoji: '💬' },
      { id: 'grammaire', label: 'Grammaire simple', emoji: '🧩' },
    ],
  },
  {
    id: 'dictee',
    label: 'Dictée',
    emoji: '🎧',
    types: [
      { id: 'mots', label: 'Mots simples', emoji: '🔡' },
      { id: 'phrases', label: 'Petites phrases', emoji: '📜' },
    ],
  },
];

export function getSubject(subjectId) {
  return SUBJECTS.find((s) => s.id === subjectId) || null;
}

export function getType(subjectId, typeId) {
  return getSubject(subjectId)?.types.find((t) => t.id === typeId) || null;
}
