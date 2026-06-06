// ─────────────────────────────────────────────────────────────────────────────
// Mixed-mode exercise engine — "Mode mixte intelligent"
// Generates multi-operation arithmetic exercises adapted to the child's level.
// ─────────────────────────────────────────────────────────────────────────────

// ── Level config ──────────────────────────────────────────────────────────────

const CONFIGS = {
  CP:  { maxNum: 20,  ops: ['+', '-'],           multiTable: [2, 3, 5, 10], allowDiv: false, allowParen: false },
  CE1: { maxNum: 50,  ops: ['+', '-', '×'],  multiTable: [2, 3, 5, 10], allowDiv: true,  allowParen: false },
  CE2: { maxNum: 100, ops: ['+', '-', '×', '÷'], multiTable: null, allowDiv: true,  allowParen: false },
  CM1: { maxNum: 500, ops: ['+', '-', '×', '÷'], multiTable: null, allowDiv: true,  allowParen: true  },
};

const AGE_TO_LEVEL = { 6: 'CP', 7: 'CE1', 8: 'CE2', 9: 'CM1' };

function resolveLevel(age, schoolLevel) {
  if (schoolLevel && CONFIGS[schoolLevel]) return schoolLevel;
  return AGE_TO_LEVEL[age] || 'CE2';
}

// ── Difficulty range helpers ──────────────────────────────────────────────────

function numRange(level, difficulty) {
  const max = CONFIGS[level].maxNum;
  if (difficulty === 'facile') return [1, Math.floor(max / 3)];
  if (difficulty === 'moyen')  return [1, Math.floor(max * 2 / 3)];
  return [1, max];
}

function maxOperands(difficulty) {
  if (difficulty === 'facile') return 2;
  return 3;
}

// ── Random helpers ────────────────────────────────────────────────────────────

const rint = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Emoji visuals ─────────────────────────────────────────────────────────────

const DOTS = ['🟣', '🔵', '🟡']; // purple, blue, yellow

function dotsFor(n, emoji) {
  return emoji.repeat(n);
}

function buildVisual(operands, ops) {
  // Only render if all operands and result fit within 15 dots
  const result = evalExpr(operands, ops);
  if (result === null || result > 15) return null;
  for (const o of operands) { if (o > 15) return null; }

  const parts = [];
  for (let i = 0; i < operands.length; i++) {
    const emoji = DOTS[i % DOTS.length];
    const op = ops[i - 1];

    if (i === 0) {
      parts.push(dotsFor(operands[i], emoji));
    } else if (op === '+') {
      parts.push('+ ' + dotsFor(operands[i], emoji));
    } else if (op === '-') {
      // show crossed dots
      const crossed = '❌'.repeat(operands[i]);
      parts.push('- ' + crossed);
    } else if (op === '×') {
      // show groups
      const group = dotsFor(operands[i], emoji);
      const groups = Array(operands[0]).fill(group).join(' × ');
      return groups + ' = ?';
    } else if (op === '÷') {
      parts.push('÷ ' + operands[i]);
    }
  }
  parts.push('= ?');
  return parts.join(' ');
}

// ── Expression evaluator (respects op precedence for CE2/CM1) ─────────────────

function evalExpr(operands, ops) {
  if (operands.length === 1) return operands[0];

  // Build token list: [n, op, n, op, n, ...]
  const tokens = [];
  for (let i = 0; i < operands.length; i++) {
    tokens.push(operands[i]);
    if (i < ops.length) tokens.push(ops[i]);
  }

  // First pass: resolve × and ÷
  let i = 1;
  const t = [...tokens];
  while (i < t.length) {
    if (t[i] === '×' || t[i] === '÷') {
      const left = t[i - 1];
      const right = t[i + 1];
      let val;
      if (t[i] === '×') {
        val = left * right;
      } else {
        if (right === 0 || left % right !== 0) return null; // invalid
        val = left / right;
      }
      t.splice(i - 1, 3, val);
      // i stays at i-1 for next check
    } else {
      i += 2;
    }
  }

  // Second pass: resolve + and -
  let acc = t[0];
  for (let j = 1; j < t.length; j += 2) {
    if (t[j] === '+') acc += t[j + 1];
    else if (t[j] === '-') acc -= t[j + 1];
    else return null;
  }
  return acc;
}

// ── Parenthesized expression for CM1 ─────────────────────────────────────────

function buildParenExpr(operands, ops) {
  // Format: (a op b) op c
  if (operands.length < 3) return buildFlatExpr(operands, ops);
  return `(${operands[0]} ${ops[0]} ${operands[1]}) ${ops[1]} ${operands[2]}`;
}

function buildFlatExpr(operands, ops) {
  let s = String(operands[0]);
  for (let i = 0; i < ops.length; i++) {
    s += ` ${ops[i]} ${operands[i + 1]}`;
  }
  return s;
}

// ── Step-by-step correction builder ──────────────────────────────────────────

const STEP_LABELS = {
  fr: { result: 'Réponse', first: 'On commence par', then: 'Puis', paren: "D'abord les parenthèses" },
  nl: { result: 'Antwoord', first: 'We beginnen met', then: 'Dan', paren: 'Eerst de haakjes' },
  en: { result: 'Answer', first: 'We start with', then: 'Then', paren: 'First the brackets' },
  es: { result: 'Respuesta', first: 'Empezamos por', then: 'Luego', paren: 'Primero los paréntesis' },
};

function buildSteps(operands, ops, locale, useParen) {
  const SL = STEP_LABELS[locale] || STEP_LABELS.fr;
  const steps = [];

  if (useParen && operands.length >= 3) {
    // (a op b) op c
    const inner = operands[0];
    const innerOp = ops[0];
    const innerRight = operands[1];
    let innerVal;
    if (innerOp === '+') innerVal = inner + innerRight;
    else if (innerOp === '-') innerVal = inner - innerRight;
    else if (innerOp === '×') innerVal = inner * innerRight;
    else if (innerOp === '÷') innerVal = Math.round(inner / innerRight);
    else innerVal = inner;

    steps.push(`${SL.paren} : ${inner} ${innerOp} ${innerRight} = ${innerVal}`);
    const finalVal = evalExpr([innerVal, operands[2]], [ops[1]]);
    steps.push(`${SL.then} : ${innerVal} ${ops[1]} ${operands[2]} = ${finalVal}`);
    steps.push(`${SL.result} : ${finalVal}`);
    return steps;
  }

  // Standard: apply × ÷ first, then + -
  const hasMulDiv = ops.some((o) => o === '×' || o === '÷');

  if (hasMulDiv && operands.length >= 3) {
    // Find high-priority ops first
    const tokens = [];
    for (let i = 0; i < operands.length; i++) {
      tokens.push(operands[i]);
      if (i < ops.length) tokens.push(ops[i]);
    }
    const t = [...tokens];
    let step = SL.first;
    let i = 1;
    while (i < t.length) {
      if (t[i] === '×' || t[i] === '÷') {
        const left = t[i - 1];
        const right = t[i + 1];
        const val = t[i] === '×' ? left * right : left / right;
        steps.push(`${step} : ${left} ${t[i]} ${right} = ${val}`);
        step = SL.then;
        t.splice(i - 1, 3, val);
      } else {
        i += 2;
      }
    }
    // Remaining + -
    let acc = t[0];
    for (let j = 1; j < t.length; j += 2) {
      const right = t[j + 1];
      const op = t[j];
      const val = op === '+' ? acc + right : acc - right;
      steps.push(`${step} : ${acc} ${op} ${right} = ${val}`);
      step = SL.then;
      acc = val;
    }
    steps.push(`${SL.result} : ${acc}`);
  } else {
    // Simple left-to-right
    let acc = operands[0];
    for (let i = 0; i < ops.length; i++) {
      const right = operands[i + 1];
      const op = ops[i];
      const val = op === '+' ? acc + right
        : op === '-' ? acc - right
        : op === '×' ? acc * right
        : acc / right;
      const label = i === 0 ? SL.first : SL.then;
      steps.push(`${label} : ${acc} ${op} ${right} = ${val}`);
      acc = val;
    }
    steps.push(`${SL.result} : ${acc}`);
  }
  return steps;
}

// ── I18n question templates ───────────────────────────────────────────────────

const Q_TEMPLATES = {
  fr: (expr) => `Combien font ${expr} ?`,
  nl: (expr) => `Hoeveel is ${expr}?`,
  en: (expr) => `How much is ${expr}?`,
  es: (expr) => `¿Cuánto es ${expr}?`,
};

const NOTEBOOK_INSTR = {
  fr: 'Écris la réponse dans ton cahier.',
  nl: 'Schrijf het antwoord in je schrift.',
  en: 'Write the answer in your notebook.',
  es: 'Escribe la respuesta en tu cuaderno.',
};

// ── Operand generators per exercise type ─────────────────────────────────────

function safeDiv(max, multiTable) {
  // Generate a ÷ b with exact result
  let tries = 0;
  while (tries++ < 50) {
    const b = rint(2, Math.min(10, max));
    const quotient = rint(1, Math.floor(max / b));
    const a = b * quotient;
    if (a <= max && a > 0) return { a, b, result: quotient };
  }
  return { a: 6, b: 2, result: 3 };
}

function safeMul(level, cfg) {
  const max = cfg.maxNum;
  if (cfg.multiTable) {
    const table = pick(cfg.multiTable);
    const n = rint(1, Math.min(10, Math.floor(max / table)));
    return { a: n, b: table, result: n * table };
  }
  // General multiplication within range
  let tries = 0;
  while (tries++ < 50) {
    const a = rint(2, Math.min(20, Math.floor(Math.sqrt(max))));
    const b = rint(2, Math.min(20, Math.floor(max / a)));
    if (a * b <= max) return { a, b, result: a * b };
  }
  return { a: 3, b: 4, result: 12 };
}

// ── Single exercise builder ───────────────────────────────────────────────────

let _idCounter = 0;

function buildExercise({ level, exerciseType, difficulty, showVisual, locale }) {
  const cfg = CONFIGS[level];
  const [lo, hi] = numRange(level, difficulty);
  const nOps = difficulty === 'facile' ? 1 : (Math.random() < 0.5 ? 1 : 2);
  const useParen = cfg.allowParen && difficulty === 'difficile' && nOps >= 2;

  let operands = [];
  let ops = [];

  // Build based on type
  switch (exerciseType) {
    case 1: { // addition only
      const a = rint(lo, hi);
      const b = rint(lo, hi - (nOps >= 2 ? Math.floor(hi / 3) : 0));
      operands = [a, b];
      ops = ['+'];
      if (nOps >= 2 && difficulty !== 'facile') {
        const c = rint(lo, Math.floor(hi / 3));
        operands.push(c); ops.push('+');
      }
      break;
    }
    case 2: { // soustraction only
      const b = rint(lo, Math.floor(hi * 0.7));
      const a = rint(b, hi);
      operands = [a, b]; ops = ['-'];
      if (nOps >= 2 && difficulty !== 'facile') {
        const c = rint(lo, Math.floor((a - b) * 0.8));
        operands.push(c); ops.push('-');
      }
      break;
    }
    case 3: { // multiplication only
      const m = safeMul(level, cfg);
      operands = [m.a, m.b]; ops = ['×'];
      break;
    }
    case 4: { // division only
      if (!cfg.allowDiv) return buildExercise({ level, exerciseType: 1, difficulty, showVisual, locale });
      const d = safeDiv(hi, cfg.multiTable);
      operands = [d.a, d.b]; ops = ['÷'];
      break;
    }
    case 5: { // addition + soustraction
      const a = rint(Math.floor(hi / 2), hi);
      const b = rint(lo, Math.floor(hi / 3));
      const c = rint(lo, Math.min(b, a - b));
      if (Math.random() < 0.5) {
        operands = [a, b, c]; ops = ['+', '-'];
      } else {
        const a2 = rint(Math.floor(hi / 2), hi);
        const b2 = rint(lo, Math.floor(a2 / 2));
        const c2 = rint(lo, Math.floor(hi / 3));
        operands = [a2, b2, c2]; ops = ['-', '+'];
      }
      break;
    }
    case 6: { // multiplication + addition
      if (!cfg.ops.includes('×')) return buildExercise({ level, exerciseType: 1, difficulty, showVisual, locale });
      const m = safeMul(level, cfg);
      const c = rint(lo, Math.min(hi - m.result, Math.floor(hi / 3)));
      operands = [m.a, m.b, c]; ops = ['×', '+'];
      break;
    }
    case 7: { // multiplication + soustraction
      if (!cfg.ops.includes('×')) return buildExercise({ level, exerciseType: 1, difficulty, showVisual, locale });
      const m = safeMul(level, cfg);
      const c = rint(lo, Math.max(1, m.result - 1));
      operands = [m.a, m.b, c]; ops = ['×', '-'];
      break;
    }
    case 8: { // division + addition
      if (!cfg.allowDiv) return buildExercise({ level, exerciseType: 1, difficulty, showVisual, locale });
      const d = safeDiv(hi, cfg.multiTable);
      const c = rint(lo, Math.floor(hi / 3));
      operands = [d.a, d.b, c]; ops = ['÷', '+'];
      break;
    }
    case 9: { // division + soustraction
      if (!cfg.allowDiv) return buildExercise({ level, exerciseType: 1, difficulty, showVisual, locale });
      const d = safeDiv(hi, cfg.multiTable);
      const c = rint(lo, Math.max(1, d.result - 1));
      operands = [d.a, d.b, c]; ops = ['÷', '-'];
      break;
    }
    case 10: { // full mix
      const availOps = cfg.ops;
      const numOps = Math.min(nOps, 2);
      for (let i = 0; i < numOps; i++) ops.push(pick(availOps));

      // Build operands to satisfy the chosen ops safely
      let built = false;
      for (let attempt = 0; attempt < 30 && !built; attempt++) {
        operands = [];
        let valid = true;
        for (let i = 0; i <= numOps; i++) {
          if (ops[i - 1] === '×') {
            const m = safeMul(level, cfg);
            if (i === 0) { operands.push(m.a); operands.push(m.b); }
            else operands.push(rint(2, Math.min(10, Math.floor(hi / 5))));
          } else if (ops[i - 1] === '÷') {
            const d = safeDiv(hi, cfg.multiTable);
            if (i === 0) { operands.push(d.a); operands.push(d.b); }
            else operands.push(rint(2, Math.min(10, 9)));
          } else {
            operands.push(rint(lo, hi));
          }
        }
        if (operands.length !== numOps + 1) {
          // fallback: just fill remaining
          while (operands.length < numOps + 1) operands.push(rint(lo, hi));
        }
        const res = evalExpr(operands, ops);
        if (res !== null && res >= 0 && res <= cfg.maxNum * 2) built = true;
        else valid = false;
        if (!valid) continue;
      }

      if (!built) {
        operands = [rint(lo, hi), rint(lo, hi)];
        ops = ['+'];
      }
      break;
    }
    default:
      operands = [rint(lo, hi), rint(lo, hi)];
      ops = ['+'];
  }

  // Validate result
  let result = evalExpr(operands, ops);
  if (result === null || result < 0) {
    // fallback to safe addition
    const a = rint(lo, hi);
    const b = rint(lo, hi - a + lo);
    operands = [a, b]; ops = ['+'];
    result = a + b;
  }

  const exprFlat = buildFlatExpr(operands, ops);
  const expr = useParen ? buildParenExpr(operands, ops) : exprFlat;
  const qTemplate = Q_TEMPLATES[locale] || Q_TEMPLATES.fr;
  const question = `${expr} = ……`;
  const testQuestion = qTemplate(expr);
  const steps = buildSteps(operands, ops, locale, useParen);
  const explanation = steps.join('\n');
  const visual = showVisual ? buildVisual(operands, ops) : null;

  return {
    id: `mixed-${Date.now()}-${_idCounter++}`,
    subject: 'math',
    type: 'mixed',
    level,
    question,
    testQuestion,
    notebookInstruction: NOTEBOOK_INSTR[locale] || NOTEBOOK_INSTR.fr,
    answer: String(result),
    acceptedAnswers: [String(result)],
    explanation,
    inputType: 'number',
    visual,
    steps,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a batch of mixed exercises.
 */
export function generateMixedExercises({
  age = 8,
  schoolLevel,
  difficulty = 'moyen',
  exerciseType = 10,
  count = 10,
  showVisual = true,
  locale = 'fr',
}) {
  const level = resolveLevel(age, schoolLevel);
  const n = Math.max(1, Number(count) || 10);
  const list = [];
  const seen = new Set();
  let attempts = 0;
  while (list.length < n && attempts++ < n * 8) {
    const ex = buildExercise({ level, exerciseType: Number(exerciseType), difficulty, showVisual, locale });
    if (ex && !seen.has(ex.question)) {
      seen.add(ex.question);
      list.push(ex);
    }
  }
  return list;
}

/**
 * Generate a random mix — picks exerciseType randomly within what the level allows.
 */
export function generateRandomMixed({
  age = 8,
  schoolLevel,
  difficulty = 'moyen',
  count = 10,
  showVisual = true,
  locale = 'fr',
}) {
  const level = resolveLevel(age, schoolLevel);
  const cfg = CONFIGS[level];

  // Determine which types are valid for this level
  const validTypes = [1, 2]; // addition, subtraction always valid
  if (cfg.ops.includes('×')) { validTypes.push(3, 6, 7); }
  if (cfg.allowDiv) { validTypes.push(4, 8, 9); }
  if (cfg.ops.includes('×') || cfg.allowDiv) validTypes.push(5);
  validTypes.push(10);

  const n = Math.max(1, Number(count) || 10);
  const list = [];
  const seen = new Set();
  let attempts = 0;
  while (list.length < n && attempts++ < n * 8) {
    const exerciseType = pick(validTypes);
    const ex = buildExercise({ level, exerciseType, difficulty, showVisual, locale });
    if (ex && !seen.has(ex.question)) {
      seen.add(ex.question);
      list.push(ex);
    }
  }
  return list;
}

/** Expose configs for UI (info badge, chip disabling). */
export { CONFIGS, AGE_TO_LEVEL };
