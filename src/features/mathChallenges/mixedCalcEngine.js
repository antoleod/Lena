// ─────────────────────────────────────────────────────────────────────────────
// Configurable mixed-expression generator.
//
//   generateMixedCalc({ terms, operations, digits, count }) → exercise[]
//
// The child (or parent) chooses:
//   - terms:      how many numbers   (2, 3, 4…)         e.g. 2+4+6  /  4+5+6+7
//   - operations: which signs        subset of '+','−','×'
//   - digits:     how big the numbers (1, 2, 3 chiffres)
//
// Examples it can produce: 2+4+6 · 4+5+6+7 · 2+3−5 · 4+23+4−1 · 2×3−4+6
//
// Multiplication uses standard precedence (× first). Results are kept ≥ 0 and
// reasonable so they stay solvable for a primary-school child.
// ─────────────────────────────────────────────────────────────────────────────

import { buildDotsVisual, buildArrayVisual } from '../exerciseGenerator/mathVisualUtils.js';

const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isHigh = (o) => o === '×' || o === 'x' || o === '÷';
function divisorsOf(n) {
  const d = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
  return d;
}

export const OPERATIONS = [
  { id: '+', label: 'Additions  +', emoji: '➕' },
  { id: '−', label: 'Soustractions  −', emoji: '➖' },
  { id: '×', label: 'Multiplications  ×', emoji: '✖️' },
  { id: '÷', label: 'Divisions  ÷', emoji: '➗' },
];
export const TERM_CHOICES = [2, 3, 4];
export const DIGIT_CHOICES = [
  { id: 1, label: '1 chiffre (1–9)' },
  { id: 2, label: '2 chiffres (jusqu’à 40)' },
  { id: 3, label: '3 chiffres (jusqu’à 300)' },
];

function termRange(digits, hasHighPrec) {
  if (hasHighPrec) return [1, 9]; // keep × / ÷ primary-safe
  if (digits <= 1) return [1, 9];
  if (digits === 2) return [1, 40];
  return [10, 300];
}

/**
 * Evaluate with × and ÷ precedence first (left to right), then + and − left to
 * right. Returns null if any division is not exact (non-integer).
 */
export function evaluateExpression(values, ops) {
  const n = [...values];
  const o = [...ops];
  for (let i = 0; i < o.length;) {
    if (o[i] === '×' || o[i] === 'x') {
      n[i] = n[i] * n[i + 1]; n.splice(i + 1, 1); o.splice(i, 1);
    } else if (o[i] === '÷') {
      if (n[i + 1] === 0 || n[i] % n[i + 1] !== 0) return null;
      n[i] = n[i] / n[i + 1]; n.splice(i + 1, 1); o.splice(i, 1);
    } else i++;
  }
  let res = n[0];
  for (let i = 0; i < o.length; i++) {
    res = o[i] === '+' ? res + n[i + 1] : res - n[i + 1];
  }
  return res;
}

/**
 * Make every ÷ in the sequence divide exactly. We ensure no high-precedence op
 * directly precedes a ÷ (so its left operand stays a raw value), then set the
 * right operand to a divisor of the left operand.
 */
function fixDivisions(values, ops) {
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] !== '÷') continue;
    if (i > 0 && isHigh(ops[i - 1])) ops[i - 1] = '+';
    const divisors = divisorsOf(values[i]);
    values[i + 1] = pick(divisors);
  }
}

function buildExplanation(values, ops, result) {
  const hasHigh = ops.some(isHigh);
  const steps = [];
  let n = [...values];
  let o = [...ops];
  if (hasHigh) {
    steps.push('On fait d’abord les multiplications et les divisions.');
    for (let i = 0; i < o.length;) {
      if (o[i] === '×' || o[i] === 'x') {
        const p = n[i] * n[i + 1];
        steps.push(`${n[i]} × ${n[i + 1]} = ${p}.`);
        n[i] = p; n.splice(i + 1, 1); o.splice(i, 1);
      } else if (o[i] === '÷') {
        const p = n[i] / n[i + 1];
        steps.push(`${n[i]} ÷ ${n[i + 1]} = ${p}.`);
        n[i] = p; n.splice(i + 1, 1); o.splice(i, 1);
      } else i++;
    }
    steps.push('Puis on calcule de gauche à droite.');
  } else {
    steps.push('On calcule de gauche à droite, étape par étape.');
  }
  let run = n[0];
  for (let i = 0; i < o.length; i++) {
    const next = n[i + 1];
    const r = o[i] === '+' ? run + next : run - next;
    steps.push(`${run} ${o[i]} ${next} = ${r}.`);
    run = r;
  }
  steps.push(`La réponse est ${result}.`);
  return steps.join(' ');
}

let _id = 0;
const eid = () => `mix_${Date.now().toString(36)}_${++_id}`;

export function generateMixedCalc({ terms = 3, operations = ['+'], digits = 1 }) {
  const ops = operations.length ? operations : ['+'];
  const hasHighPrec = ops.some(isHigh);
  const [lo, hi] = termRange(digits, hasHighPrec);

  let values, opSeq, result, guard = 0;
  do {
    values = Array.from({ length: terms }, () => rint(lo, hi));
    opSeq = Array.from({ length: terms - 1 }, () => pick(ops));
    fixDivisions(values, opSeq); // guarantee exact divisions
    result = evaluateExpression(values, opSeq);
    guard++;
  } while ((result === null || result < 0 || result > 999) && guard < 120);

  // last-resort: fall back to a safe addition we know works
  if (result === null || result < 0) {
    opSeq = opSeq.map(() => '+');
    result = evaluateExpression(values, opSeq);
  }

  const question = values.reduce(
    (acc, v, i) => (i === 0 ? `${v}` : `${acc} ${opSeq[i - 1]} ${v}`),
    ''
  );

  const hasMulDiv = opSeq.some(isHigh);
  // Visual: a×b array for a single multiplication; dots for small additions.
  let visual = buildDotsVisual(values, opSeq);
  if (!visual && terms === 2 && opSeq[0] === '×') visual = buildArrayVisual(values[0], values[1]);

  return {
    id: eid(), subject: 'math', module: 'mixed_calc',
    type: 'mixed', inputType: 'number',
    question: `Calcule : ${question}`,
    expression: question,
    correctAnswer: result,
    acceptedAnswers: [String(result)],
    hint: hasMulDiv
      ? 'Fais d’abord les multiplications et divisions, puis le reste de gauche à droite.'
      : 'Calcule de gauche à droite, une petite étape à la fois.',
    explanation: buildExplanation(values, opSeq, result),
    improvementTip: 'Découpe le grand calcul en plusieurs petits calculs faciles.',
    visual,
  };
}

export function generateMixedSet({ terms, operations, digits, count = 6 }) {
  return Array.from({ length: Math.max(1, count) }, () =>
    generateMixedCalc({ terms, operations, digits })
  );
}
