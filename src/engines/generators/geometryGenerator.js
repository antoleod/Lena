import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── EASY: Shape recognition & basic properties ───────────────────────────────
const EASY_TEMPLATES = [
  () => ({
    prompt: 'Quelle figure a 3 côtés ?',
    correct: 'triangle',
    wrong: ['carré', 'rectangle', 'cercle'],
    explanation: 'Un triangle a exactement 3 côtés.'
  }),
  () => ({
    prompt: 'Quelle figure a 4 côtés égaux ?',
    correct: 'carré',
    wrong: ['rectangle', 'triangle', 'pentagone'],
    explanation: 'Le carré a 4 côtés tous de la même longueur.'
  }),
  () => ({
    prompt: 'Quelle figure n\'a pas de côté ?',
    correct: 'cercle',
    wrong: ['triangle', 'losange', 'carré'],
    explanation: 'Le cercle est une courbe fermée, sans côté.'
  }),
  () => ({
    prompt: 'Quel polygone a 5 côtés ?',
    correct: 'pentagone',
    wrong: ['hexagone', 'carré', 'triangle'],
    explanation: 'Penta = 5, donc le pentagone a 5 côtés.'
  }),
  () => ({
    prompt: 'Quelle figure a des angles droits et 2 paires de côtés égaux ?',
    correct: 'rectangle',
    wrong: ['triangle', 'cercle', 'pentagone'],
    explanation: 'Le rectangle a 4 angles droits et 2 paires de côtés égaux.'
  }),
  () => ({
    prompt: 'Quelle figure a 6 côtés ?',
    correct: 'hexagone',
    wrong: ['pentagone', 'carré', 'triangle'],
    explanation: 'Hexa = 6, donc l\'hexagone a 6 côtés.'
  }),
  () => ({
    prompt: 'Un losange a combien de côtés ?',
    correct: '4 côtés',
    wrong: ['3 côtés', '5 côtés', '6 côtés'],
    explanation: 'Le losange est un quadrilatère : il a 4 côtés égaux.'
  }),
  () => ({
    prompt: 'Quelle figure ressemble à une balle vue de face ?',
    correct: 'cercle',
    wrong: ['carré', 'triangle', 'rectangle'],
    explanation: 'La balle est ronde, comme le cercle.'
  })
];

// ─── MEDIUM: Properties, perimeter, symmetry ─────────────────────────────────
const MEDIUM_TEMPLATES = [
  () => {
    const s = randomInt(3, 9);
    return {
      prompt: `Un carré a un côté de ${s} cm. Quel est son périmètre ?`,
      correct: `${4 * s} cm`,
      wrong: [`${4 * s + 4} cm`, `${s * s} cm`, `${4 * s - 4} cm`],
      explanation: `Périmètre du carré = 4 × ${s} = ${4 * s} cm.`
    };
  },
  () => {
    const l = randomInt(5, 12);
    const w = randomInt(3, 7);
    return {
      prompt: `Un rectangle mesure ${l} cm × ${w} cm. Quel est son périmètre ?`,
      correct: `${2 * (l + w)} cm`,
      wrong: [`${l + w} cm`, `${l * w} cm`, `${2 * l + w} cm`],
      explanation: `P = 2 × (${l} + ${w}) = ${2 * (l + w)} cm.`
    };
  },
  () => {
    const sides = randomInt(3, 6);
    const len = randomInt(4, 10);
    return {
      prompt: `Un polygone régulier à ${sides} côtés a chaque côté de ${len} cm. Quel est son périmètre ?`,
      correct: `${sides * len} cm`,
      wrong: [`${sides * len + len} cm`, `${sides * len - len} cm`, `${sides + len} cm`],
      explanation: `P = ${sides} × ${len} = ${sides * len} cm.`
    };
  },
  () => ({
    prompt: 'Quelle figure est symétrique par rapport à un axe vertical ?',
    correct: 'carré',
    wrong: ['triangle scalène', 'trapèze', 'parallélogramme'],
    explanation: 'Le carré a 4 axes de symétrie, dont un axe vertical.'
  }),
  () => ({
    prompt: 'Un triangle équilatéral a tous ses côtés ...',
    correct: 'égaux',
    wrong: ['différents', '2 égaux 1 différent', 'perpendiculaires'],
    explanation: 'Équilatéral = equi (égaux) + latéral (côtés).'
  }),
  () => ({
    prompt: 'Quelle est la forme qui a exactement 4 axes de symétrie ?',
    correct: 'carré',
    wrong: ['rectangle', 'triangle isocèle', 'losange'],
    explanation: 'Le carré a 4 axes de symétrie (2 diagonales + 2 médianes).'
  }),
  () => {
    const n = randomInt(3, 6);
    const names = { 3: 'triangle', 4: 'carré', 5: 'pentagone', 6: 'hexagone' };
    const correct = names[n];
    return {
      prompt: `Un polygone régulier a ${n} côtés. Comment s'appelle-t-il ?`,
      correct,
      wrong: Object.values(names).filter(v => v !== correct),
      explanation: `${n} côtés → ${correct}.`
    };
  }
];

// ─── HARD: Area, angles, angle sum, advanced ─────────────────────────────────
const HARD_TEMPLATES = [
  () => {
    const s = randomInt(3, 9);
    return {
      prompt: `Quelle est l'aire d'un carré de côté ${s} cm ?`,
      correct: `${s * s} cm²`,
      wrong: [`${4 * s} cm²`, `${s * s + s} cm²`, `${2 * s * s} cm²`],
      explanation: `Aire du carré = côté² = ${s}² = ${s * s} cm².`
    };
  },
  () => {
    const l = randomInt(4, 10);
    const w = randomInt(3, 7);
    return {
      prompt: `Un rectangle de ${l} cm × ${w} cm. Quelle est son aire ?`,
      correct: `${l * w} cm²`,
      wrong: [`${2 * (l + w)} cm²`, `${l * w + w} cm²`, `${l + w} cm²`],
      explanation: `Aire = longueur × largeur = ${l} × ${w} = ${l * w} cm².`
    };
  },
  () => ({
    prompt: 'Quelle est la somme des angles intérieurs d\'un triangle ?',
    correct: '180°',
    wrong: ['90°', '360°', '270°'],
    explanation: 'La somme des angles d\'un triangle est toujours 180°.'
  }),
  () => ({
    prompt: 'Quelle est la somme des angles intérieurs d\'un quadrilatère ?',
    correct: '360°',
    wrong: ['180°', '270°', '90°'],
    explanation: 'La somme des angles d\'un quadrilatère est 360°.'
  }),
  () => {
    const a1 = randomInt(30, 70);
    const a2 = randomInt(20, 60);
    const a3 = 180 - a1 - a2;
    return {
      prompt: `Un triangle a deux angles de ${a1}° et ${a2}°. Quel est le troisième angle ?`,
      correct: `${a3}°`,
      wrong: [`${a3 + 10}°`, `${a3 - 10}°`, `${180 - a1}°`],
      explanation: `${a1} + ${a2} + ? = 180°, donc ? = 180 - ${a1} - ${a2} = ${a3}°.`
    };
  },
  () => {
    const base = randomInt(4, 10);
    const height = randomInt(3, 8);
    return {
      prompt: `Un triangle a une base de ${base} cm et une hauteur de ${height} cm. Quelle est son aire ?`,
      correct: `${(base * height) / 2} cm²`,
      wrong: [`${base * height} cm²`, `${base + height} cm²`, `${base * height + 2} cm²`],
      explanation: `Aire triangle = (base × hauteur) / 2 = (${base} × ${height}) / 2 = ${(base * height) / 2} cm².`
    };
  },
  () => {
    const r = randomInt(2, 7);
    return {
      prompt: `Un cercle a un rayon de ${r} cm. Quel est son diamètre ?`,
      correct: `${2 * r} cm`,
      wrong: [`${r} cm`, `${3 * r} cm`, `${r * r} cm`],
      explanation: `Diamètre = 2 × rayon = 2 × ${r} = ${2 * r} cm.`
    };
  }
];

// ─── MAIN GENERATOR ───────────────────────────────────────────────────────────
export function generateGeometryExercise({ grade, difficulty }) {
  const level = difficulty === 'hard' ? 'hard' : difficulty === 'medium' ? 'medium' : 'easy';

  const pool =
    level === 'hard'
      ? [...MEDIUM_TEMPLATES, ...HARD_TEMPLATES]
      : level === 'medium'
        ? [...EASY_TEMPLATES, ...MEDIUM_TEMPLATES]
        : EASY_TEMPLATES;

  const template = sample(pool);
  const data = template();

  return createExercise({
    question: data.prompt,
    options: uniqueOptions(data.correct, data.wrong),
    correct: data.correct,
    type: 'math_geometry',
    level: gradeToLabel(grade),
    explanation: data.explanation
  });
}
