// ─────────────────────────────────────────────────────────────────────────────
// Calculation-challenge engine — harder than a plain sum, always explained
// step by step, with a hint and an "improvement tip".
//
//   generateCalculationChallenge({ type, difficulty }) → exercise
//   generateChallengeSet({ type, difficulty, count }) → exercise[]
// ─────────────────────────────────────────────────────────────────────────────

import { explainSubtraction, needsBorrow, subtractionHint } from './subtractionStrategies.js';

const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const CHALLENGE_TYPES = [
  { id: 'chained', label: 'Calculs en chaîne', emoji: '🔗' },
  { id: 'hard_subtraction', label: 'Soustractions difficiles', emoji: '➖' },
  { id: 'subtraction_borrow', label: 'Soustractions avec retenue', emoji: '🔁' },
  { id: 'mental_strategy', label: 'Calcul mental malin', emoji: '🧠' },
];

let _id = 0;
const eid = (t) => `calc_${t}_${Date.now().toString(36)}_${++_id}`;

function base(type, difficulty, fields) {
  return {
    id: eid(type), subject: 'math', module: 'calculation_challenge', type, difficulty,
    inputType: 'number',
    acceptedAnswers: [String(fields.correctAnswer)],
    ...fields,
  };
}

// ── A. Chained additions / subtractions ──────────────────────────────────────
function buildChained(difficulty) {
  const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 30 : 50;
  const nbTerms = difficulty === 'hard' ? 4 : 3;
  let total, parts, steps, guard = 0;
  do {
    // Start with enough room so subtractions never reach 0 or below.
    total = difficulty === 'easy' ? rint(2, max) : rint(Math.ceil(max / 2), max);
    parts = [String(total)];
    steps = [`On part de ${total}.`];
    for (let i = 1; i < nbTerms; i++) {
      const add = difficulty === 'easy' ? true : Math.random() < 0.55;
      if (add) {
        const n = rint(1, max);
        total += n; parts.push(`+ ${n}`); steps.push(`${total - n} + ${n} = ${total}.`);
      } else {
        const n = rint(1, Math.max(1, total - 1)); // keep total >= 1
        total -= n; parts.push(`− ${n}`); steps.push(`${total + n} − ${n} = ${total}.`);
      }
    }
    guard++;
  } while (total < 1 && guard < 30);
  return base('chained', difficulty, {
    question: `Calcule : ${parts.join(' ')}`,
    correctAnswer: total,
    hint: 'Fais le calcul en deux petites étapes, de gauche à droite.',
    explanation: `${steps.join(' ')} La réponse est ${total}.`,
    improvementTip: 'Calcule pas à pas : d’abord les deux premiers nombres, puis ajoute le suivant.',
  });
}

// ── B. Hard subtraction (no borrow but two digits) ───────────────────────────
function buildHardSubtraction(difficulty) {
  let a, b;
  if (difficulty === 'easy') { a = rint(10, 20); b = rint(1, a); }
  else {
    // pick a, b with a >= b, two digits
    do { a = rint(40, 99); b = rint(20, a); } while (a < b);
  }
  return base('hard_subtraction', difficulty, {
    question: `Calcule : ${a} − ${b}`,
    correctAnswer: a - b,
    hint: subtractionHint(a, b),
    explanation: explainSubtraction(a, b),
    improvementTip: 'Sépare toujours les unités et les dizaines pour ne pas te tromper.',
  });
}

// ── C. Subtraction WITH borrow (guaranteed) ──────────────────────────────────
function buildBorrow(difficulty) {
  let a, b, guard = 0;
  do {
    a = rint(difficulty === 'hard' ? 50 : 20, 99);
    b = rint(11, a);
    guard++;
  } while (!needsBorrow(a, b) && guard < 100);
  if (!needsBorrow(a, b)) { a = 72; b = 45; }
  return base('subtraction_borrow', difficulty, {
    question: `Calcule : ${a} − ${b}`,
    correctAnswer: a - b,
    hint: 'Regarde les unités : peux-tu enlever directement ? Sinon, prends une dizaine.',
    explanation: explainSubtraction(a, b),
    improvementTip: 'Quand le chiffre du haut est plus petit, pense à prendre une dizaine.',
  });
}

// ── D. Mental strategy ───────────────────────────────────────────────────────
function buildMental(difficulty) {
  const kinds = ['near10-add', 'doubles', 'sub-round'];
  const kind = pick(difficulty === 'easy' ? ['doubles'] : kinds);
  if (kind === 'near10-add') {
    const a = rint(20, 60), b = pick([9, 19, 29]);
    const answer = a + b;
    return base('mental_strategy', difficulty, {
      question: `Calcule : ${a} + ${b}`,
      correctAnswer: answer,
      hint: `Ajoute ${b + 1} (un nombre rond), puis enlève 1.`,
      explanation: `Astuce : ${a} + ${b + 1} = ${a + b + 1}, puis on enlève 1 → ${answer}. Donc ${a} + ${b} = ${answer}.`,
      improvementTip: 'Arrondir au nombre rond, puis ajuster, rend le calcul plus facile.',
    });
  }
  if (kind === 'doubles') {
    const a = rint(5, 25), extra = pick([0, 10]);
    const answer = a + a + extra;
    return base('mental_strategy', difficulty, {
      question: extra ? `Calcule : ${a} + ${a} + ${extra}` : `Calcule : ${a} + ${a}`,
      correctAnswer: answer,
      hint: 'C’est un double ! Pense à 2 fois le même nombre.',
      explanation: `${a} + ${a} = ${a * 2}${extra ? `, puis + ${extra} = ${answer}` : ''}. La réponse est ${answer}.`,
      improvementTip: 'Apprends tes doubles par cœur : ils rendent le calcul mental rapide.',
    });
  }
  // sub-round
  const a = pick([60, 70, 80, 90, 100]), b = rint(21, 49);
  const answer = a - b;
  return base('mental_strategy', difficulty, {
    question: `Calcule : ${a} − ${b}`,
    correctAnswer: answer,
    hint: 'Pars du nombre rond et enlève les dizaines, puis les unités.',
    explanation: explainSubtraction(a, b),
    improvementTip: 'Avec un nombre rond, enlève d’abord les dizaines, c’est plus simple.',
  });
}

const BUILDERS = {
  chained: buildChained,
  hard_subtraction: buildHardSubtraction,
  subtraction_borrow: buildBorrow,
  mental_strategy: buildMental,
};

export function generateCalculationChallenge({ type, difficulty = 'easy' }) {
  const b = BUILDERS[type];
  return b ? b(difficulty) : null;
}

export function generateChallengeSet({ type, difficulty = 'easy', count = 8 }) {
  return Array.from({ length: Math.max(1, count) }, () => generateCalculationChallenge({ type, difficulty })).filter(Boolean);
}
