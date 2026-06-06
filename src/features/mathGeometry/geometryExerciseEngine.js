// ─────────────────────────────────────────────────────────────────────────────
// Geometry exercise engine.
//   generateGeometryExercise({ type, difficulty }) → exercise
//   generateGeometrySet({ type, difficulty, count }) → exercise[]
//
// Exercise shape (matches the brief):
// {
//   id, subject:'math', module:'geometry', type, difficulty,
//   question, spec (SVG figure descriptor),
//   correctAnswer, acceptedAnswers, hint, explanation, inputType,
//   target?  (for colour exercises: { shapeType, count, colorLabel, colorValue })
// }
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection, square, rect, triangle, disc, grid, referenceShape,
  triangleDivided, triangleTriforce, nestedSquares,
} from './geometrySpecs.js';

const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const SHAPE_LABELS = { square: 'carré', rect: 'rectangle', triangle: 'triangle', disc: 'disque' };
export const SHAPE_PLURAL = { square: 'carrés', rect: 'rectangles', triangle: 'triangles', disc: 'disques' };
export const COLORS = [
  { label: 'rouge', value: '#e74c3c' },
  { label: 'bleu', value: '#3498db' },
  { label: 'vert', value: '#2ecc71' },
  { label: 'jaune', value: '#f1c40f' },
];

export const GEOMETRY_TYPES = [
  { id: 'count_shapes', label: 'Compter les figures', emoji: '🔺' },
  { id: 'properties_table', label: 'Le tableau des figures', emoji: '📋' },
  { id: 'grid_complete', label: 'Compléter sur quadrillage', emoji: '🔳' },
  { id: 'color_shapes', label: 'Colorier les figures', emoji: '🎨' },
];

let _eid = 0;
const eid = (t) => `geo_${t}_${Date.now().toString(36)}_${++_eid}`;

// Centre a shape of given type at (cx, cy) with size s.
function shapeAt(type, cx, cy, s) {
  if (type === 'square') return square(cx - s / 2, cy - s / 2, s, pick([0, 0, 0, 12]));
  if (type === 'rect') return rect(cx - s * 0.6, cy - s * 0.35, s * 1.2, s * 0.7, pick([0, 0, 8]));
  if (type === 'triangle') return triangle([[cx, cy - s / 2], [cx - s / 2, cy + s / 2], [cx + s / 2, cy + s / 2]]);
  return disc(cx, cy, s / 2);
}

// Grid of cell centres for laying out a collection without overlaps.
function cellCentres(cols, rows) {
  const cells = [];
  const mw = 90 / cols, mh = 80 / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    cells.push([10 + mw * c + mw / 2, 12 + mh * r + mh / 2]);
  }
  return cells;
}

// ── A. COUNT ─────────────────────────────────────────────────────────────────
function buildCount(difficulty) {
  if (difficulty === 'hard') {
    const comp = pick([triangleDivided, triangleTriforce, nestedSquares])();
    if (comp.triangles) {
      return finalize('count_shapes', difficulty, {
        question: 'Combien de triangles vois-tu ?',
        spec: comp.spec, correctAnswer: comp.triangles,
        hint: 'Compte d’abord les petits triangles, puis cherche le grand triangle caché.',
        explanation: `Il y a des petits triangles et un grand triangle caché : ${comp.triangles} triangles en tout.`,
      });
    }
    return finalize('count_shapes', difficulty, {
      question: 'Combien de carrés vois-tu ?',
      spec: comp.spec, correctAnswer: comp.squares,
      hint: 'Regarde bien : il y a des carrés cachés les uns dans les autres.',
      explanation: `Il y a ${comp.squares} carrés, l’un dans l’autre.`,
    });
  }

  // easy / medium: independent shapes, count one type
  const target = pick(['triangle', 'square', 'rect', 'disc']);
  const cols = difficulty === 'easy' ? 3 : 4;
  const rows = difficulty === 'easy' ? 2 : 3;
  const cells = shuffle(cellCentres(cols, rows));
  const targetCount = difficulty === 'easy' ? rint(2, 4) : rint(3, 5);
  const distract = difficulty === 'easy' ? rint(1, 2) : rint(2, 4);
  const others = ['triangle', 'square', 'rect', 'disc'].filter((t) => t !== target);
  const shapes = [];
  const total = Math.min(cells.length, targetCount + distract);
  for (let i = 0; i < total; i++) {
    const type = i < targetCount ? target : pick(others);
    const [cx, cy] = cells[i];
    shapes.push(shapeAt(type, cx, cy, difficulty === 'easy' ? 18 : 15));
  }
  return finalize('count_shapes', difficulty, {
    question: `Combien de ${SHAPE_PLURAL[target]} vois-tu ?`,
    spec: collection(shuffle(shapes)), correctAnswer: targetCount,
    hint: `Compte seulement les ${SHAPE_PLURAL[target]}, doucement, un par un.`,
    explanation: `Il y a ${targetCount} ${SHAPE_PLURAL[target]} sur l’image.`,
  });
}

// ── B. PROPERTIES TABLE (one cell per question) ──────────────────────────────
const TABLE = {
  carre: { sides: 4, sommets: 4, droits: 4, equal: 'oui', latte: 'oui', type: 'square' },
  rectangle: { sides: 4, sommets: 4, droits: 4, equal: 'non', latte: 'oui', type: 'rect' },
  triangle: { sides: 3, sommets: 3, droits: 'parfois', equal: 'parfois', latte: 'oui', type: 'triangle' },
  disque: { sides: 0, sommets: 0, droits: 0, equal: 'non', latte: 'non', type: 'disc' },
};
function buildTable(difficulty) {
  const figs = difficulty === 'easy' ? ['carre', 'rectangle', 'triangle'] : Object.keys(TABLE);
  const fig = pick(figs);
  const data = TABLE[fig];
  const label = fig === 'carre' ? 'carré' : fig;
  const questions = [
    { q: `Combien de côtés a le ${label} ?`, a: data.sides, type: 'number', exp: `Le ${label} a ${data.sides} côté(s).`, hint: 'Compte les bords droits de la figure.' },
    { q: `Combien de sommets a le ${label} ?`, a: data.sommets, type: 'number', exp: `Le ${label} a ${data.sommets} sommet(s) (les coins).`, hint: 'Les sommets sont les coins (les pointes).' },
    { q: `Le ${label} : tous les côtés ont-ils la même longueur ?`, a: data.equal, type: 'choice', options: ['oui', 'non', 'parfois'], exp: `Réponse : ${data.equal}.`, hint: 'Regarde si les côtés sont aussi longs les uns que les autres.' },
    { q: `Peut-on tracer le ${label} à la latte ?`, a: data.latte, type: 'choice', options: ['oui', 'non'], exp: `Réponse : ${data.latte}. La latte trace des traits droits.`, hint: 'La latte sert à tracer des traits droits, pas des courbes.' },
    { q: `Combien d’angles droits a le ${label} ?`, a: String(data.droits), type: 'choice', options: ['0', '4', 'parfois'], exp: `Réponse : ${data.droits}. Un angle droit est un coin « carré ».`, hint: 'Un angle droit est un coin bien carré, comme le coin d’une feuille.' },
  ];
  const chosen = pick(difficulty === 'easy' ? questions.slice(0, 3) : questions);
  return finalize('properties_table', difficulty, {
    question: chosen.q, spec: referenceShape(fig),
    correctAnswer: chosen.a, inputType: chosen.type, options: chosen.options,
    hint: chosen.hint, explanation: chosen.exp,
  });
}

// ── C. GRID COMPLETE ─────────────────────────────────────────────────────────
function buildGrid(difficulty) {
  const kind = pick(difficulty === 'easy' ? ['carre', 'rectangle'] : ['carre', 'rectangle', 'triangle']);
  let segments, correction, answer;
  if (kind === 'carre') {
    segments = [{ x1: 30, y1: 30, x2: 70, y2: 30 }, { x1: 30, y1: 30, x2: 30, y2: 70 }];
    correction = [{ x1: 70, y1: 30, x2: 70, y2: 70 }, { x1: 30, y1: 70, x2: 70, y2: 70 }];
    answer = 'carré';
  } else if (kind === 'rectangle') {
    segments = [{ x1: 22, y1: 36, x2: 78, y2: 36 }, { x1: 22, y1: 36, x2: 22, y2: 64 }];
    correction = [{ x1: 78, y1: 36, x2: 78, y2: 64 }, { x1: 22, y1: 64, x2: 78, y2: 64 }];
    answer = 'rectangle';
  } else {
    segments = [{ x1: 50, y1: 24, x2: 26, y2: 74 }, { x1: 26, y1: 74, x2: 74, y2: 74 }];
    correction = [{ x1: 50, y1: 24, x2: 74, y2: 74 }];
    answer = 'triangle';
  }
  return finalize('grid_complete', difficulty, {
    question: 'Quelle figure peux-tu tracer en complétant les traits rouges ?',
    spec: grid(segments, correction), correctAnswer: answer,
    inputType: 'choice', options: shuffle(['carré', 'rectangle', 'triangle']),
    hint: 'Regarde les deux traits rouges : forment-ils un coin égal ou un coin allongé ?',
    explanation: `En complétant, on obtient un ${answer}. Appuie sur « Voir la correction » pour le tracé complet.`,
    hasCorrectionDraw: true,
  });
}

// ── D. COLOUR ──────────────────────────────────────────────────────────────────
function buildColor(difficulty) {
  const target = pick(['triangle', 'square', 'rect', 'disc']);
  const color = pick(COLORS);
  const want = difficulty === 'hard' ? 2 : pick([1, 2]);
  const cols = 4, rows = difficulty === 'easy' ? 2 : 3;
  const cells = shuffle(cellCentres(cols, rows));
  const others = ['triangle', 'square', 'rect', 'disc'].filter((t) => t !== target);
  const shapes = [];
  const total = Math.min(cells.length, want + rint(3, 5));
  for (let i = 0; i < total; i++) {
    const type = i < want + 1 ? target : pick(others); // ensure at least `want`(+1) targets exist
    const [cx, cy] = cells[i];
    shapes.push(shapeAt(type, cx, cy, 18)); // larger = easier tap target on touch
  }
  return finalize('color_shapes', difficulty, {
    question: `Colorie ${want} ${want > 1 ? SHAPE_PLURAL[target] : SHAPE_LABELS[target]} en ${color.label}.`,
    spec: collection(shuffle(shapes)), inputType: 'color',
    target: { shapeType: target, count: want, colorLabel: color.label, colorValue: color.value },
    correctAnswer: `${want} ${SHAPE_PLURAL[target]}`,
    hint: `Touche d’abord ${want} ${want > 1 ? SHAPE_PLURAL[target] : SHAPE_LABELS[target]}, puis vérifie.`,
    explanation: `Il fallait colorier exactement ${want} ${SHAPE_PLURAL[target]} en ${color.label}.`,
  });
}

// ── finalize / public API ─────────────────────────────────────────────────────
function finalize(type, difficulty, fields) {
  const answer = fields.correctAnswer;
  return {
    id: eid(type), subject: 'math', module: 'geometry', type, difficulty,
    inputType: fields.inputType || 'number',
    acceptedAnswers: numberWords(answer),
    options: undefined,
    ...fields,
    correctAnswer: answer,
  };
}
function numberWords(a) {
  const words = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
  const out = [String(a)];
  if (typeof a === 'number' && a >= 0 && a <= 10) out.push(words[a]);
  return out;
}

const BUILDERS = {
  count_shapes: buildCount,
  properties_table: buildTable,
  grid_complete: buildGrid,
  color_shapes: buildColor,
};

export function generateGeometryExercise({ type, difficulty = 'easy' }) {
  const b = BUILDERS[type];
  return b ? b(difficulty) : null;
}

export function generateGeometrySet({ type, difficulty = 'easy', count = 6 }) {
  return Array.from({ length: Math.max(1, count) }, () => generateGeometryExercise({ type, difficulty })).filter(Boolean);
}
