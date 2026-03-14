import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── RICH LOGIC TASKS ────────────────────────────────────────────────────────
// 40+ tasks covering: intrus (odd-one-out), sequence, classification, analogy, deduction

const LOGIC_P2 = [
  // Intrus — odd one out
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'triangle', wrong: ['rouge', 'bleu', 'vert'], explanation: 'Triangle est une forme, les autres sont des couleurs.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'guitare', wrong: ['chat', 'chien', 'lapin'], explanation: 'Guitare est un instrument, les autres sont des animaux.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'cuillère', wrong: ['pomme', 'banane', 'raisin'], explanation: 'Cuillère est un ustensile, les autres sont des fruits.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'voiture', wrong: ['crayon', 'stylo', 'cahier'], explanation: 'Voiture ne fait pas partie du matériel d école.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'médecin', wrong: ['lundi', 'mardi', 'jeudi'], explanation: 'Médecin est un métier, les autres sont des jours.' },
  { prompt: 'Quel élément ne va pas avec les autres ?', answer: 'nuit', wrong: ['matin', 'midi', 'après-midi'], explanation: 'Nuit est la période sombre, les autres sont dans la journée.' },

  // Patterns / sequences (with descriptions)
  { prompt: 'Complète la série : 🔵 🔴 🔵 🔴 … quel vient ensuite ?', answer: '🔵', wrong: ['🔴', '🟡', '🟢'], explanation: 'Le motif alterne bleu et rouge → bleu est le suivant.' },
  { prompt: 'Complète la série : ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 … quel vient ensuite ?', answer: '⭐', wrong: ['🌙', '☀️', '🌟'], explanation: 'Le motif est 2 étoiles puis 1 lune → étoile est la suivante.' },
  { prompt: 'Complète la série : 1 3 5 7 … quel nombre vient ensuite ?', answer: '9', wrong: ['8', '10', '6'], explanation: 'On ajoute 2 à chaque fois → après 7, on obtient 9.' },
  { prompt: 'Complète la série : 2 4 6 8 … quel nombre vient ensuite ?', answer: '10', wrong: ['9', '12', '7'], explanation: 'On ajoute 2 à chaque fois → après 8, on obtient 10.' },
  { prompt: 'Complète la série : 10 20 30 40 … quel nombre vient ensuite ?', answer: '50', wrong: ['45', '35', '60'], explanation: 'On ajoute 10 à chaque fois → après 40, on obtient 50.' },

  // Classification
  { prompt: 'Quel objet peut aller dans la catégorie « école » ?', answer: 'crayon', wrong: ['banane', 'oreiller', 'savon'], explanation: 'Crayon appartient à la catégorie école.' },
  { prompt: 'Quel animal vit dans la mer ?', answer: 'dauphin', wrong: ['lion', 'vache', 'lapin'], explanation: 'Le dauphin vit dans la mer.' },
  { prompt: 'Quel aliment est un légume ?', answer: 'carotte', wrong: ['banane', 'pomme', 'poire'], explanation: 'La carotte est un légume.' },
  { prompt: 'Lequel de ces mots est un moyen de transport ?', answer: 'train', wrong: ['chaise', 'manteau', 'maison'], explanation: 'Le train est un moyen de transport.' },

  // Simple deduction P2
  { prompt: 'Tom a 5 bonbons. Il en donne 2. Lui en reste-t-il plus ou moins de 4 ?', answer: 'Moins de 4', wrong: ['Plus de 4', 'Exactement 4', 'Autant'], explanation: '5 - 2 = 3, qui est moins que 4.' },
  { prompt: 'Mia est plus grande que Luc. Luc est plus grand que Sam. Qui est le plus petit ?', answer: 'Sam', wrong: ['Luc', 'Mia', 'C est pareil'], explanation: 'Sam est le plus petit car Luc est plus grand que lui et Mia encore plus grande.' },
];

const LOGIC_P3 = [
  // More complex patterns
  { prompt: 'Complète la série : 5 10 15 20 … quel nombre vient ensuite ?', answer: '25', wrong: ['22', '30', '24'], explanation: 'On ajoute 5 à chaque fois → après 20, on obtient 25.' },
  { prompt: 'Complète la série : 3 6 9 12 … quel nombre vient ensuite ?', answer: '15', wrong: ['14', '13', '16'], explanation: 'On ajoute 3 à chaque fois → après 12, on obtient 15.' },
  { prompt: 'Complète la série : 100 90 80 70 … quel nombre vient ensuite ?', answer: '60', wrong: ['65', '55', '50'], explanation: 'On enlève 10 à chaque fois → après 70, on obtient 60.' },
  { prompt: 'Complète la série : 1 2 4 8 16 … quel nombre vient ensuite ?', answer: '32', wrong: ['18', '24', '20'], explanation: 'On multiplie par 2 à chaque fois → après 16, on obtient 32.' },

  // Analogy
  { prompt: 'Chaud est à Froid ce que Grand est à … ?', answer: 'Petit', wrong: ['Rapide', 'Bleu', 'Lourd'], explanation: 'Chaud/Froid et Grand/Petit sont des paires de contraires.' },
  { prompt: 'Un stylo sert à écrire. Une fourchette sert à … ?', answer: 'Manger', wrong: ['Dessiner', 'Couper', 'Coller'], explanation: 'Une fourchette est un ustensile pour manger.' },
  { prompt: 'La pluie tombe du ciel. Le poisson nage dans … ?', answer: 'L eau', wrong: ['L air', 'La forêt', 'Le sable'], explanation: 'Le poisson nage dans l eau.' },

  // Deduction P3
  { prompt: 'Alice, Bob et Clara ont 3 couleurs : rouge, bleu, vert. Alice a le rouge. Bob n a pas le vert. Quelle couleur a Clara ?', answer: 'Le vert', wrong: ['Le rouge', 'Le bleu', 'L orange'], explanation: 'Alice a rouge, Bob a bleu (pas vert), donc Clara a le vert.' },
  { prompt: 'Un nombre est supérieur à 20 et inférieur à 25. Il est pair. Lequel ?', answer: '22 ou 24', wrong: ['21', '23', '20'], explanation: '22 et 24 sont les seuls nombres pairs entre 20 et 25 (exclus).' },
  { prompt: 'Si j ai 4 groupes de 3 objets, combien d objets en tout ?', answer: '12', wrong: ['7', '14', '10'], explanation: '4 × 3 = 12.' },

  // Category / intrus P3
  { prompt: 'Lequel n est pas un type d énergie ?', answer: 'Chaise', wrong: ['Soleil', 'Vent', 'Eau'], explanation: 'Une chaise n est pas une source d énergie.' },
  { prompt: 'Quel continent n est pas en Europe ?', answer: 'Amazonie', wrong: ['France', 'Espagne', 'Belgique'], explanation: 'L Amazonie est en Amérique du Sud, pas en Europe.' },
];

function generateNumberSequence(params) {
  const { difficulty, grade } = params;
  const isP3 = grade === 'P3' || difficulty === 'hard';

  if (isP3) {
    // Decreasing by a random step or ×2
    const step = [3, 4, 5, 10][randomInt(0, 3)];
    const start = randomInt(30, 80);
    const seq = [start, start - step, start - step * 2, start - step * 3];
    const next = start - step * 4;
    return {
      prompt: `Complète la suite : ${seq.join(' – ')} – ?`,
      answer: String(next),
      wrong: [String(next + 1), String(next - 1), String(next + step)],
      explanation: `On enlève ${step} à chaque étape → ${seq[3]} − ${step} = ${next}.`
    };
  } else {
    // Simple increasing sequence
    const step = [2, 5, 10][randomInt(0, 2)];
    const start = randomInt(1, 20);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    const next = start + step * 4;
    return {
      prompt: `Complète la suite : ${seq.join(' – ')} – ?`,
      answer: String(next),
      wrong: [String(next + 1), String(next - 1), String(next + step)],
      explanation: `On ajoute ${step} à chaque étape → ${seq[3]} + ${step} = ${next}.`
    };
  }
}

export function generateLogicExercise({ grade, difficulty }) {
  // 50% chance of a pre-written task, 50% of a generated sequence
  const useGenerated = Math.random() < 0.4;

  if (useGenerated) {
    const seq = generateNumberSequence({ difficulty, grade });
    return createExercise({
      question: seq.prompt,
      options: uniqueOptions(seq.answer, seq.wrong),
      correct: seq.answer,
      type: 'logic_reasoning',
      level: gradeToLabel(grade),
      explanation: seq.explanation
    });
  }

  const pool = grade === 'P3' || difficulty === 'hard'
    ? [...LOGIC_P2.slice(5), ...LOGIC_P3]
    : LOGIC_P2;
  const item = sample(pool);

  return createExercise({
    question: item.prompt,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'logic_reasoning',
    level: gradeToLabel(grade),
    explanation: item.explanation
  });
}
