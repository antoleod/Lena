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
      { id: 'additions',      label: 'Additions',         emoji: '➕', color: '#22c55e', desc: 'Additionner des nombres' },
      { id: 'soustractions',  label: 'Soustractions',     emoji: '➖', color: '#ef4444', desc: 'Soustraire des nombres' },
      { id: 'multiplications',label: 'Multiplications',   emoji: '✖️', color: '#6366f1', desc: 'Tables et calculs' },
      { id: 'divisions',      label: 'Divisions simples', emoji: '➗', color: '#06b6d4', desc: 'Partager en parts égales' },
      { id: 'measurements',   label: 'Mesures',           emoji: '📏', color: '#8b5cf6', desc: 'cm, kg, € et conversions' },
      { id: 'problemes',      label: 'Problèmes écrits',  emoji: '📖', color: '#f97316', desc: 'Situations de la vie réelle' },
      { id: 'mixte',          label: 'Mixte',             emoji: '🎲', color: '#f59e0b', desc: '➕ ➖ ✖️ mélangés' },
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

// "Comment réfléchir ?" — thinking strategies shown with the explanations.
export const THINKING_TIPS = {
  math: [
    'Commence par les unités.',
    'Regarde les dizaines ensuite.',
    'Découpe le calcul en petites étapes.',
  ],
  french: [
    'Lis toute la phrase d’abord.',
    'Cherche le mot qui sonne juste.',
    'Relis une deuxième fois pour vérifier.',
  ],
  dictee: [
    'Écoute bien le mot en entier.',
    'Découpe le mot en syllabes.',
    'Relis ce que tu as écrit.',
  ],
};

export function getSubject(subjectId) {
  return SUBJECTS.find((s) => s.id === subjectId) || null;
}

export function getType(subjectId, typeId) {
  return getSubject(subjectId)?.types.find((t) => t.id === typeId) || null;
}
