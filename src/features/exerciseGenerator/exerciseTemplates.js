// ─────────────────────────────────────────────────────────────────────────────
// Exercise generators, one per `${subject}:${type}` key.
//
// Each generator is a function (level, index) => exercise object:
// {
//   id, subject, type, level,
//   question,            // shown in the NOTEBOOK (what she copies/solves by hand)
//   notebookInstruction, // small hint under the question in the notebook
//   testQuestion,        // shown in the TEST phase (may equal `question`)
//   answer,              // the correct answer (string)
//   acceptedAnswers,     // optional array of equivalent answers
//   explanation,         // simple correction shown after answering
//   inputType,           // 'number' | 'text' | 'choice'
//   options,             // for inputType 'choice'
// }
//
// Generators use plain Math.random — generation is live, not reproducible.
// ─────────────────────────────────────────────────────────────────────────────

import { buildDotsVisual as dotsVisual, buildArrayVisual, placeValueVisual } from './mathVisualUtils.js';

// Active locale for generated statements (set by the engine before generating).
let _locale = 'fr';
export function setGenLocale(l) { _locale = ['fr', 'nl', 'en', 'es'].includes(l) ? l : 'fr'; }

const MATHQ = {
  fr: (op, a, b) => `Combien font ${a} ${op} ${b} ?`,
  nl: (op, a, b) => `Hoeveel is ${a} ${op} ${b}?`,
  en: (op, a, b) => `How much is ${a} ${op} ${b}?`,
  es: (op, a, b) => `¿Cuánto es ${a} ${op} ${b}?`,
};
const mq = (op, a, b) => (MATHQ[_locale] || MATHQ.fr)(op, a, b);
// Multi-operand localized wrapper: mqx('2 + 2 + 2') → "Combien font 2 + 2 + 2 ?"
const MATHQX = {
  fr: (e) => `Combien font ${e} ?`, nl: (e) => `Hoeveel is ${e}?`,
  en: (e) => `How much is ${e}?`, es: (e) => `¿Cuánto es ${e}?`,
};
const mqx = (e) => (MATHQX[_locale] || MATHQX.fr)(e);
const NOTEBOOK_INSTR = {
  fr: 'Écris la réponse dans ton cahier.', nl: 'Schrijf het antwoord in je schrift.',
  en: 'Write the answer in your notebook.', es: 'Escribe la respuesta en tu cuaderno.',
};
const CONVERT = {
  fr: (n, from, to) => `Convertis ${n} ${from} en ${to}.`,
  nl: (n, from, to) => `Zet ${n} ${from} om naar ${to}.`,
  en: (n, from, to) => `Convert ${n} ${from} to ${to}.`,
  es: (n, from, to) => `Convierte ${n} ${from} a ${to}.`,
};

const rint = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build 3 plausible numeric distractors around `answer`.
function numChoices(answer, spread) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < 4 && guard++ < 40) {
    const d = rint(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    if (answer + d >= 0) set.add(answer + d);
  }
  return shuffle([...set]).map(String);
}

// ── MATH ────────────────────────────────────────────────────────────────────

// Optional `digits` (1,2,3,4) forces exactly N-digit numbers: [min, max].
function digitRange(digits) {
  if (digits === 1) return [1, 9];
  if (digits === 2) return [10, 99];
  if (digits === 3) return [100, 999];
  if (digits === 4) return [1000, 9999];
  return null;
}
// "Taille des nombres" and "Nombre d\'opérations" are INDEPENDENT now.
// Auto (no value) → progression adapted to the level.
function autoTerms(level) {
  if (level === 'easy')   return 2;
  if (level === 'medium') return 2;
  // hard: 3 or 4 operands — chain arithmetic (8+8+8+9)
  return Math.random() < 0.5 ? 3 : 4;
}
function operandRange(level, digits) {
  const dr = digitRange(digits);
  if (dr) return dr;
  if (level === 'easy')   return [1, 10];   // 🟢 single-digit: 3 + 7
  if (level === 'medium') return [10, 99];  // 🟠 two-digit: 23 + 34
  return [1, 20]; // 🔴 hard: small range but 3-4 operands: 8 + 8 + 8 + 9
}

// ── Primary-level explanation: decompose into dizaines (tens) + unités (units) ─
const DU = {
  fr: { d: 'dizaines', u: 'unités', D: 'Dizaines', U: 'Unités', R: 'Résultat', take: 'On prend une dizaine' },
  nl: { d: 'tientallen', u: 'eenheden', D: 'Tientallen', U: 'Eenheden', R: 'Resultaat', take: 'We nemen een tiental' },
  en: { d: 'tens', u: 'units', D: 'Tens', U: 'Units', R: 'Result', take: 'We take one ten' },
  es: { d: 'decenas', u: 'unidades', D: 'Decenas', U: 'Unidades', R: 'Resultado', take: 'Tomamos una decena' },
};
const tens = (n) => Math.floor(n / 10);
const units = (n) => n % 10;

// Step-by-step tens/units method for an addition of N numbers.
function decompAdd(nums) {
  const L = DU[_locale] || DU.fr;
  const lines = nums.map((n) => `${n} = ${tens(n)} ${L.d} + ${units(n)} ${L.u}`);
  const t = nums.reduce((s, n) => s + tens(n), 0);
  const u = nums.reduce((s, n) => s + units(n), 0);
  const total = nums.reduce((s, n) => s + n, 0);
  lines.push(`${L.D} : ${nums.map(tens).join(' + ')} = ${t} ${L.d} = ${t * 10}`);
  lines.push(`${L.U} : ${nums.map(units).join(' + ')} = ${u} ${L.u} = ${u}`);
  lines.push(`${L.R} : ${t * 10} + ${u} = ${total}`);
  return lines.join('\n');
}

// Step-by-step tens/units method for a − b (borrow-aware, primary style).
function decompSubPair(a, b) {
  const L = DU[_locale] || DU.fr;
  let at = tens(a), au = units(a);
  const bt = tens(b), bu = units(b);
  const out = [
    `${a} = ${at} ${L.d} + ${au} ${L.u}`,
    `${b} = ${bt} ${L.d} + ${bu} ${L.u}`,
  ];
  if (au < bu) { out.push(`${L.take} : ${at} ${L.d} → ${at - 1}, ${au} ${L.u} → ${au + 10}`); at -= 1; au += 10; }
  out.push(`${L.U} : ${au} − ${bu} = ${au - bu}`);
  out.push(`${L.D} : ${at} − ${bt} = ${at - bt} = ${(at - bt) * 10}`);
  out.push(`${L.R} : ${(at - bt) * 10} + ${au - bu} = ${a - b}`);
  return out;
}
function decompSub(a, subs) {
  const lines = [];
  let cur = a;
  for (const b of subs) { lines.push(...decompSubPair(cur, b)); cur -= b; }
  return lines.join('\n');
}

function mathAdd(level, i, opts = {}) {
  const terms = Math.max(2, Number(opts.terms) || autoTerms(level));
  const [baseLo, baseHi] = operandRange(level, opts.digits);
  const lo = opts.minVal != null ? Math.max(baseLo, Number(opts.minVal)) : baseLo;
  const hi = opts.maxVal != null ? Math.min(baseHi, Number(opts.maxVal)) : baseHi;
  const safeHi = Math.max(lo, hi);
  const nums = Array.from({ length: terms }, () => rint(Math.max(1, lo), safeHi));
  const answer = nums.reduce((s, n) => s + n, 0);
  const expr = nums.join(' + ');
  return base('math', 'additions', level, i, {
    question: `${expr} = ……`,
    testQuestion: mqx(expr),
    answer: String(answer),
    explanation: `${expr} = ${answer}.`,
    method: decompAdd(nums), // dizaines + unités, étape par étape
    improvementTip: 'Sépare les dizaines et les unités, puis regroupe.',
    hints: [
      'Sépare chaque nombre en dizaines et unités.',
      'Additionne d\'abord les dizaines, puis les unités.',
      'Regroupe : les dizaines plus les unités.',
    ],
    inputType: 'number',
    visual: dotsVisual(nums, Array(terms - 1).fill('+')) || placeValueVisual(answer),
  });
}

function mathSub(level, i, opts = {}) {
  const terms = Math.max(2, Number(opts.terms) || autoTerms(level));
  const [baseLo, baseHi] = operandRange(level, opts.digits);
  const lo = opts.minVal != null ? Math.max(baseLo, Number(opts.minVal)) : baseLo;
  const hi = opts.maxVal != null ? Math.min(baseHi, Number(opts.maxVal)) : baseHi;
  const safeHi = Math.max(lo, hi);
  // First number big enough; subtract the rest keeping the running total >= 0.
  let a = rint(Math.max(lo, Math.ceil(safeHi / 2)), safeHi);
  const subs = [];
  let run = a;
  for (let k = 1; k < terms; k++) {
    if (run <= 1) break;            // nothing left to take → keep result >= 0
    const s = rint(1, run);          // s <= run, so the running total never goes negative
    subs.push(s); run -= s;
  }
  const answer = run;
  const expr = `${a}` + subs.map((s) => ` − ${s}`).join('');
  return base('math', 'soustractions', level, i, {
    question: `${expr} = ……`,
    testQuestion: mqx(expr),
    answer: String(answer),
    explanation: `${expr} = ${answer}.`,
    method: decompSub(a, subs), // dizaines + unités (avec retenue si besoin)
    improvementTip: 'Sépare les dizaines et les unités ; si besoin, prends une dizaine.',
    hints: [
      'Sépare chaque nombre en dizaines et unités.',
      'Regarde les unités : peux-tu enlever directement ?',
      'Sinon, prends une dizaine, puis enlève les unités et les dizaines.',
    ],
    inputType: 'number',
    visual: dotsVisual([a, ...subs], Array(terms - 1).fill('−')) || placeValueVisual(answer),
  });
}

function mathMul(level, i) {
  if (level === 'hard') {
    // Hard: multi-digit × single-digit  OR  2-digit × 2-digit
    const useDouble = Math.random() < 0.4;
    if (useDouble) {
      const a = rint(12, 49), b = rint(12, 29);
      const answer = a * b;
      const MUL2 = { fr: `Combien font ${a} × ${b} ?`, nl: `Hoeveel is ${a} × ${b}?`, en: `How much is ${a} × ${b}?`, es: `¿Cuánto es ${a} × ${b}?` };
      return base('math', 'multiplications', level, i, {
        question: `${a} × ${b} = ……`,
        testQuestion: (MUL2[_locale] || MUL2.fr),
        answer: String(answer),
        explanation: `${a} × ${b} = ${answer}.`,
        method: `${a} × ${b} : ${a} × ${Math.floor(b/10)*10} + ${a} × ${b%10} = ${a*Math.floor(b/10)*10} + ${a*(b%10)} = ${answer}`,
        improvementTip: 'Décompose : ${a} × ${b} = ${a} × (${Math.floor(b/10)*10} + ${b%10}).',
        hints: [`Décompose ${b} en ${Math.floor(b/10)*10} + ${b%10}.`, `${a} × ${Math.floor(b/10)*10} = ?`, `Puis ajoute ${a} × ${b%10}.`],
        inputType: 'number',
      });
    }
    const a = rint(12, 99), b = rint(6, 12);
    const answer = a * b;
    return base('math', 'multiplications', level, i, {
      question: `${a} × ${b} = ……`,
      testQuestion: mq('×', a, b),
      answer: String(answer),
      explanation: `${a} × ${b} = ${answer}.`,
      method: `${a} × ${b} : ${a} × ${Math.floor(b/2)*2} + ${a} × ${b - Math.floor(b/2)*2} = ${a*Math.floor(b/2)*2} + ${a*(b-Math.floor(b/2)*2)} = ${answer}`,
      improvementTip: 'Décompose le multiplicateur pour simplifier.',
      hints: [`Décompose ${b}.`, `${a} × ${Math.floor(b/2)} = ${a*Math.floor(b/2)}, puis double.`, `Additionne les deux parties.`],
      inputType: 'number',
    });
  }
  const t = level === 'easy' ? rint(2, 5) : rint(2, 9);
  const b = rint(1, 10);
  const answer = t * b;
  return base('math', 'multiplications', level, i, {
    question: `${t} × ${b} = ……`,
    testQuestion: mq('×', t, b),
    answer: String(answer),
    explanation: `${t} × ${b} = ${answer}. (${t} rangées de ${b})`,
    method: `${t} × ${b} = ${b}${t > 1 ? ` + ${b}`.repeat(t - 1) : ''} = ${answer}`,
    improvementTip: 'Apprends tes tables par cœur, c\'est très utile !',
    hints: [`C\'est ${t} fois le nombre ${b}.`, `Additionne ${b} ${t} fois.`, `${t} × ${b}, pense à ta table de ${b}.`],
    inputType: 'number',
    visual: buildArrayVisual(t, b),
  });
}

function mathDiv(level, i) {
  let b, q;
  if (level === 'easy')        { b = rint(2, 5);  q = rint(1, 5); }
  else if (level === 'medium') { b = rint(2, 9);  q = rint(2, 12); }
  else                         { b = rint(2, 12); q = rint(10, 99); } // hard: 3-digit ÷ 1-digit
  const a = b * q;
  return base('math', 'divisions', level, i, {
    question: `${a} ÷ ${b} = ……`,
    testQuestion: mq('÷', a, b),
    answer: String(q),
    explanation: `${a} ÷ ${b} = ${q}, car ${b} × ${q} = ${a}.`,
    method: `Combien de fois ${b} dans ${a} ? ${b} × ${q} = ${a}, donc ${a} ÷ ${b} = ${q}.`,
    improvementTip: 'La division, c\'est l\'inverse de la multiplication.',
    hints: [`Combien de fois ${b} entre dans ${a} ?`, `Cherche dans la table de ${b}.`, `${b} × ? = ${a}.`],
    inputType: 'number',
  });
}

function mathMeasure(level, i) {
  const kinds = level === 'easy'
    ? ['cm-mm']
    : level === 'medium'
      ? ['cm-mm', 'm-cm', 'euro-cent', 'kg-g']
      : ['m-cm', 'euro-cent', 'kg-g', 'km-m', 'L-mL', 'cm-m', 'g-kg'];
  const kind = choice(kinds);
  let q, answer, explanation, accepted;
  const cv = CONVERT[_locale] || CONVERT.fr;
  const centWord = { fr: 'centimes', nl: 'cent', en: 'cents', es: 'céntimos' }[_locale] || 'centimes';
  if (kind === 'cm-mm') {
    const n = rint(1, level === 'hard' ? 25 : 9);
    answer = String(n * 10); accepted = [answer, `${answer} mm`];
    q = cv(n, 'cm', 'mm');
    explanation = `1 cm = 10 mm → ${n} cm = ${n * 10} mm.`;
  } else if (kind === 'm-cm') {
    const n = rint(1, 9);
    answer = String(n * 100); accepted = [answer, `${answer} cm`];
    q = cv(n, 'm', 'cm');
    explanation = `1 m = 100 cm → ${n} m = ${n * 100} cm.`;
  } else if (kind === 'kg-g') {
    const n = rint(1, 9);
    answer = String(n * 1000); accepted = [answer, `${answer} g`];
    q = cv(n, 'kg', 'g');
    explanation = `1 kg = 1000 g → ${n} kg = ${n * 1000} g.`;
  } else if (kind === 'km-m') {
    const n = rint(1, 15);
    answer = String(n * 1000); accepted = [answer, `${answer} m`];
    q = cv(n, 'km', 'm');
    explanation = `1 km = 1000 m → ${n} km = ${n * 1000} m.`;
  } else if (kind === 'L-mL') {
    const n = rint(1, 9);
    answer = String(n * 1000); accepted = [answer, `${answer} mL`];
    q = cv(n, 'L', 'mL');
    explanation = `1 L = 1000 mL → ${n} L = ${n * 1000} mL.`;
  } else if (kind === 'cm-m') {
    const n = rint(1, 9) * 100;
    answer = String(n / 100); accepted = [answer, `${answer} m`];
    q = cv(n, 'cm', 'm');
    explanation = `100 cm = 1 m → ${n} cm = ${n / 100} m.`;
  } else if (kind === 'g-kg') {
    const n = rint(1, 9) * 1000;
    answer = String(n / 1000); accepted = [answer, `${answer} kg`];
    q = cv(n, 'g', 'kg');
    explanation = `1000 g = 1 kg → ${n} g = ${n / 1000} kg.`;
  } else {
    const n = rint(1, level === 'hard' ? 20 : 9);
    answer = String(n * 100); accepted = [answer, `${answer} c`, `${answer} ${centWord}`];
    q = cv(n, '€', centWord);
    explanation = `1 € = 100 ${centWord} → ${n} € = ${n * 100} ${centWord}.`;
  }
  return base('math', 'measurements', level, i, {
    question: `${q} ……`,
    testQuestion: q,
    answer, acceptedAnswers: accepted, explanation,
    method: explanation,
    improvementTip: 'Retiens les conversions : 1 cm=10mm, 1 m=100cm, 1 km=1000m, 1 kg=1000g, 1 L=1000mL, 1€=100c.',
    hints: ['Rappelle-toi la règle de conversion.', 'Multiplie ou divise par 10, 100 ou 1000.', explanation],
    inputType: 'text',
  });
}

const PROB_ITEMS = {
  fr: ['billes', 'bonbons', 'images', 'pommes', 'crayons'],
  nl: ['knikkers', 'snoepjes', 'plaatjes', 'appels', 'potloden'],
  en: ['marbles', 'sweets', 'stickers', 'apples', 'pencils'],
  es: ['canicas', 'caramelos', 'cromos', 'manzanas', 'lápices'],
};
const PROB = {
  fr: {
    add: (n, a, it, b) => `${n} a ${a} ${it}. On lui en donne ${b}. Combien en a ${n} maintenant ?`,
    sub: (n, a, it, b) => `${n} a ${a} ${it}. ${n} en perd ${b}. Combien en reste-t-il ?`,
    mul: (n, g, e, it) => `${n} a ${g} boîtes de ${e} ${it}. Combien de ${it} en tout ?`,
    instr: 'Pose ton calcul, puis écris la phrase réponse.',
    tip: 'Souligne les nombres et cherche le mot qui dit quoi faire.',
    hints: ['Relis bien le problème, lentement.', 'Quels sont les nombres ? Que faut-il faire ?', 'Pose le calcul, puis écris la réponse.'],
  },
  nl: {
    add: (n, a, it, b) => `${n} heeft ${a} ${it}. ${n} krijgt er ${b} bij. Hoeveel heeft ${n} nu?`,
    sub: (n, a, it, b) => `${n} heeft ${a} ${it}. ${n} verliest er ${b}. Hoeveel blijven er over?`,
    mul: (n, g, e, it) => `${n} heeft ${g} dozen van ${e} ${it}. Hoeveel ${it} in totaal?`,
    instr: 'Schrijf je berekening en daarna de antwoordzin.',
    tip: 'Onderstreep de getallen en zoek wat je moet doen.',
    hints: ['Lees de opgave rustig opnieuw.', 'Wat zijn de getallen? Wat moet je doen?', 'Maak de berekening en schrijf het antwoord.'],
  },
  en: {
    add: (n, a, it, b) => `${n} has ${a} ${it}. ${n} is given ${b} more. How many does ${n} have now?`,
    sub: (n, a, it, b) => `${n} has ${a} ${it}. ${n} loses ${b}. How many are left?`,
    mul: (n, g, e, it) => `${n} has ${g} boxes of ${e} ${it}. How many ${it} in all?`,
    instr: 'Write your calculation, then the answer sentence.',
    tip: 'Underline the numbers and find the word that tells what to do.',
    hints: ['Read the problem again, slowly.', 'What are the numbers? What must you do?', 'Set up the calculation, then write the answer.'],
  },
  es: {
    add: (n, a, it, b) => `${n} tiene ${a} ${it}. Le dan ${b} más. ¿Cuántas tiene ${n} ahora?`,
    sub: (n, a, it, b) => `${n} tiene ${a} ${it}. ${n} pierde ${b}. ¿Cuántas quedan?`,
    mul: (n, g, e, it) => `${n} tiene ${g} cajas de ${e} ${it}. ¿Cuántas ${it} en total?`,
    instr: 'Escribe tu cálculo y luego la frase respuesta.',
    tip: 'Subraya los números y busca la palabra que dice qué hacer.',
    hints: ['Vuelve a leer el problema, despacio.', '¿Cuáles son los números? ¿Qué hay que hacer?', 'Plantea el cálculo y escribe la respuesta.'],
  },
};

function mathProbleme(level, i) {
  const names = ['Léa', 'Tom', 'Maya', 'Hugo', 'Nina', 'Sami'];
  const L = PROB[_locale] || PROB.fr;
  const items = PROB_ITEMS[_locale] || PROB_ITEMS.fr;
  const name = choice(names);
  const item = choice(items);
  let q, answer, op, x, y;
  if (level === 'easy') {
    const a = rint(2, 9), b = rint(1, 9);
    answer = a + b; q = L.add(name, a, item, b); op = '+'; x = a; y = b;
  } else if (level === 'medium') {
    const a = rint(20, 80), b = rint(5, 25);
    if (Math.random() < 0.5) {
      answer = a + b; q = L.add(name, a, item, b); op = '+'; x = a; y = b;
    } else {
      answer = a - b; q = L.sub(name, a, item, b); op = '−'; x = a; y = b;
    }
  } else {
    // Hard: two-step problems or large multiplication/division
    const kind = choice(['add-sub', 'mul-large', 'div', 'two-step']);
    if (kind === 'mul-large') {
      const groups = rint(4, 12), each = rint(8, 25);
      answer = groups * each; q = L.mul(name, groups, each, item); op = '×'; x = groups; y = each;
    } else if (kind === 'div') {
      const b2 = rint(3, 8), q2 = rint(8, 20);
      const a2 = b2 * q2;
      const DIVQ = {
        fr: `${name} répartit ${a2} ${item} en ${b2} parts égales. Combien de ${item} dans chaque part ?`,
        nl: `${name} verdeelt ${a2} ${item} in ${b2} gelijke delen. Hoeveel ${item} per deel?`,
        en: `${name} shares ${a2} ${item} equally into ${b2} groups. How many per group?`,
        es: `${name} reparte ${a2} ${item} en ${b2} partes iguales. ¿Cuántas por parte?`,
      };
      answer = q2; q = (DIVQ[_locale] || DIVQ.fr); op = '÷'; x = a2; y = b2;
    } else {
      // two-step: buy then give away
      const start = rint(30, 100), buy = rint(10, 40), give = rint(5, 20);
      const TWO = {
        fr: `${name} a ${start} ${item}. ${name} en achète ${buy} de plus, puis en donne ${give}. Combien reste-t-il ?`,
        nl: `${name} heeft ${start} ${item}, koopt er ${buy} bij en geeft er ${give} weg. Hoeveel blijven er?`,
        en: `${name} has ${start} ${item}, buys ${buy} more, then gives away ${give}. How many are left?`,
        es: `${name} tiene ${start} ${item}, compra ${buy} más y da ${give}. ¿Cuántos quedan?`,
      };
      answer = start + buy - give; q = (TWO[_locale] || TWO.fr); op = '+−'; x = start; y = buy;
    }
  }
  const explanation = `${x} ${op} ${y} = ${answer} ${item}.`;
  return base('math', 'problemes', level, i, {
    question: q,
    notebookInstruction: L.instr,
    testQuestion: q,
    answer: String(answer),
    explanation,
    method: explanation,
    improvementTip: L.tip,
    hints: L.hints,
    inputType: 'number',
  });
}

// ── FRANÇAIS ──────────────────────────────────────────────────────────────────

const FR_COMPLETE_BY_LEVEL = {
  easy: [
    { s: 'Le chat boit du ……', a: 'lait', opts: ['lait', 'pain', 'sel'], h: ['Pense à ce que boit un chat.', "C\'est blanc.", 'Commence par L.'] },
    { s: 'Je mange une …… rouge.', a: 'pomme', opts: ['pomme', 'porte', 'lune'], h: ['Un fruit rouge.', 'On le croque.', 'Commence par P.'] },
    { s: 'Le soleil est dans le ……', a: 'ciel', opts: ['ciel', 'lit', 'bus'], h: ["Lève la tête.", "C\'est en haut.", 'Commence par C.'] },
    { s: 'En hiver, il fait ……', a: 'froid', opts: ['froid', 'chaud', 'beau'], h: ['On met un manteau.', 'Le contraire de chaud.', 'Commence par F.'] },
    { s: "Le poisson nage dans l'……", a: 'eau', opts: ['eau', 'air', 'arbre'], h: ['Où vit le poisson ?', "On en boit aussi.", 'Commence par E.'] },
    { s: 'Je lis un …… à la bibliothèque.', a: 'livre', opts: ['livre', 'lit', 'bol'], h: ['Il a des pages.', 'On le lit.', 'Commence par L.'] },
  ],
  medium: [
    { s: 'Le médecin soigne les ……', a: 'malades', opts: ['malades', 'voitures', 'nuages'], h: ['Qui consulte un médecin ?', 'Des personnes avec de la fièvre.', 'Commence par M.'] },
    { s: 'Les abeilles fabriquent du ……', a: 'miel', opts: ['miel', 'lait', 'jus'], h: ["C\'est sucré et doré.", 'Produit par les abeilles.', 'Commence par M.'] },
    { s: 'La bibliothécaire range les ……', a: 'livres', opts: ['livres', 'jouets', 'vêtements'], h: ["Dans une bibliothèque.", 'On les lit pour apprendre.', 'Commence par L.'] },
    { s: "L\'astronaute voyage dans l'……", a: 'espace', opts: ['espace', 'océan', 'forêt'], h: ['Où vont les fusées ?', "Là où se trouvent les étoiles.", 'Commence par E.'] },
    { s: 'Le boulanger prépare le …… chaque matin.', a: 'pain', opts: ['pain', 'lait', 'bois'], h: ['On le mange au petit-déjeuner.', 'Il est chaud et croustillant.', 'Commence par P.'] },
    { s: 'Les pompiers éteignent les ……', a: 'incendies', opts: ['incendies', 'nuages', 'rivières'], h: ['Que combattent les pompiers ?', 'C\'est très chaud et dangereux.', 'Commence par I.'] },
  ],
  hard: [
    { s: 'Malgré la pluie, les enfants jouèrent …… dans le jardin.', a: 'dehors', opts: ['dehors', 'dedans', 'ailleurs'], h: ["Ils n'étaient pas à l\'intérieur.", "À l\'extérieur.", 'Commence par D.'] },
    { s: 'Les scientifiques ont …… un nouveau vaccin contre la grippe.', a: 'découvert', opts: ['découvert', 'inventé', 'oublié'], h: ["Trouver quelque chose qui existait déjà.", "Différent d\'inventer.", 'Commence par D.'] },
    { s: 'Pour résoudre ce problème, il faut …… attentivement les données.', a: 'analyser', opts: ['analyser', 'ignorer', 'copier'], h: ["Étudier, examiner.", "Ce que fait un scientifique.", 'Commence par A.'] },
    { s: "La forêt …… abrite des centaines d\'espèces d\'animaux.", a: 'tropicale', opts: ['tropicale', 'désertique', 'polaire'], h: ['Chaude et humide.', "Près de l'équateur.", 'Commence par T.'] },
    { s: "Ce roman décrit avec …… la vie au Moyen Âge.", a: 'précision', opts: ['précision', 'rapidité', 'légèreté'], h: ["Très détaillé et exact.", "Synonyme d\'exactitude.", 'Commence par P.'] },
    { s: 'Le gouvernement a adopté une nouvelle loi pour …… l\'environnement.', a: 'protéger', opts: ['protéger', 'détruire', 'ignorer'], h: ['Défendre, préserver.', 'Le contraire de détruire.', 'Commence par P.'] },
  ],
};

function frCompleter(level, i) {
  const pool = FR_COMPLETE_BY_LEVEL[level] || FR_COMPLETE_BY_LEVEL.easy;
  const item = choice(pool);
  return base('french', 'completer', level, i, {
    question: item.s,
    notebookInstruction: 'Recopie la phrase complète dans ton cahier.',
    testQuestion: `Complète : ${item.s}`,
    answer: item.a,
    options: shuffle(item.opts),
    explanation: `La bonne phrase : ${item.s.replace('……', item.a)}`,
    method: `La phrase complète : ${item.s.replace('……', item.a)}`,
    improvementTip: 'Relis la phrase entière avec chaque mot pour entendre celui qui va bien.',
    hints: item.h,
    inputType: 'choice',
  });
}

const FR_BONMOT_BY_LEVEL = {
  easy: [
    { q: 'On écrit :', a: 'maman', opts: ['maman', 'mamen', 'momen'] },
    { q: 'On écrit :', a: 'école', opts: ['école', 'ékole', 'écolle'] },
    { q: 'On écrit :', a: 'oiseau', opts: ['oiseau', 'oizeau', 'oisau'] },
    { q: 'On écrit :', a: 'bateau', opts: ['bateau', 'batau', 'bato'] },
    { q: 'On écrit :', a: 'maison', opts: ['maison', 'mayson', 'mèson'] },
  ],
  medium: [
    { q: 'On écrit :', a: 'château', opts: ['château', 'chateau', 'chato'] },
    { q: 'On écrit :', a: 'aujourd\'hui', opts: ["aujourd\'hui", 'ogourdhui', "aujord\'hui"] },
    { q: 'On écrit :', a: 'bicyclette', opts: ['bicyclette', 'biciclete', 'bysyclette'] },
    { q: 'On écrit :', a: 'hôpital', opts: ['hôpital', 'hopital', 'hôpitale'] },
    { q: 'On écrit :', a: 'gymnase', opts: ['gymnase', 'jimnase', 'gymnaze'] },
    { q: 'On écrit :', a: 'réveil', opts: ['réveil', 'réveille', 'reveil'] },
  ],
  hard: [
    { q: 'On écrit :', a: 'chrysanthème', opts: ['chrysanthème', 'crisantème', 'chrysantème'] },
    { q: 'On écrit :', a: 'onomatopée', opts: ['onomatopée', 'onomatopé', 'onomathopée'] },
    { q: 'On écrit :', a: 'parachute', opts: ['parachute', 'parashute', 'parachûte'] },
    { q: 'On écrit :', a: 'rhinocéros', opts: ['rhinocéros', 'rhinoceros', 'rinocéros'] },
    { q: 'On écrit :', a: 'cauchemar', opts: ['cauchemar', 'cauchemare', 'côchmar'] },
    { q: 'On écrit :', a: 'envahisseur', opts: ['envahisseur', 'envahiseur', 'envaisseur'] },
  ],
};

function frBonMot(level, i) {
  const pool = FR_BONMOT_BY_LEVEL[level] || FR_BONMOT_BY_LEVEL.easy;
  const item = choice(pool);
  return base('french', 'bon-mot', level, i, {
    question: `Quel mot est bien écrit ? (${item.opts.join(' / ')})`,
    notebookInstruction: 'Écris le mot correct dans ton cahier.',
    testQuestion: 'Choisis le mot bien écrit.',
    answer: item.a,
    options: shuffle(item.opts),
    explanation: `On écrit « ${item.a} ».`,
    improvementTip: 'Lis le mot dans ta tête : la bonne orthographe « sonne » juste.',
    hints: ['Prononce chaque mot doucement.', 'Lequel ressemble à ce que tu connais ?', `Le bon mot commence par « ${item.a[0]} ».`],
    inputType: 'choice',
  });
}

const FR_TEXTS_BY_LEVEL = {
  easy: [
    { text: "Léa a un petit chien noir. Il s\'appelle Filou. Filou aime courir dans le jardin.", q: "Comment s\'appelle le chien ?", a: 'Filou', opts: ['Filou', 'Léa', 'Rex'] },
    { text: 'Tom va à la mer avec sa maman. Il construit un château de sable.', q: 'Où va Tom ?', a: 'à la mer', opts: ['à la mer', 'à la montagne', "à l'école"] },
    { text: 'Maya plante une fleur jaune dans un pot. Chaque jour, elle l\'arrose.', q: 'De quelle couleur est la fleur ?', a: 'jaune', opts: ['jaune', 'rouge', 'bleue'] },
  ],
  medium: [
    { text: "Hugo adore les sciences. Chaque soir, il observe les étoiles avec sa lunette. Son étoile préférée est Sirius, la plus brillante du ciel.", q: "Quelle est l'étoile préférée de Hugo ?", a: 'Sirius', opts: ['Sirius', 'Venus', 'Bételgeuse'] },
    { text: "Nina a trouvé un chaton abandonné sous un banc du parc. Elle l\'a emmené chez elle et l\'a soigné pendant trois jours. Aujourd\'hui, il est en bonne santé.", q: 'Où Nina a-t-elle trouvé le chaton ?', a: 'sous un banc du parc', opts: ['sous un banc du parc', 'dans une boîte', 'près de son école'] },
    { text: "Sami participe à un concours de dessin. Il a représenté sa ville natale avec beaucoup de détails. Le jury a été très impressionné par son travail.", q: "Qu\'a représenté Sami dans son dessin ?", a: 'sa ville natale', opts: ['sa ville natale', 'sa maison', 'son école'] },
  ],
  hard: [
    { text: "En 1969, Neil Armstrong est devenu le premier être humain à marcher sur la Lune. Cette mission, appelée Apollo 11, a duré huit jours. Les astronautes ont rapporté des échantillons de roche lunaire pour les scientifiques.", q: "Combien de jours a duré la mission Apollo 11 ?", a: 'huit jours', opts: ['huit jours', 'trois jours', 'vingt jours'] },
    { text: "La photosynthèse est le processus par lequel les plantes fabriquent leur nourriture. Elles utilisent la lumière du soleil, le dioxyde de carbone et l\'eau pour produire du glucose et de l\'oxygène. Ce processus est essentiel à la vie sur Terre.", q: "Que produisent les plantes grâce à la photosynthèse ?", a: 'du glucose et de l\'oxygène', opts: ["du glucose et de l\'oxygène", "de l\'eau et du sel", 'de la lumière et du carbone'] },
    { text: "Le cycle de l\'eau comprend plusieurs étapes : l'évaporation transforme l\'eau des océans en vapeur, la condensation forme les nuages, et les précipitations ramènent l\'eau sous forme de pluie ou de neige.", q: "Quelle étape transforme l\'eau en vapeur ?", a: "l'évaporation", opts: ["l'évaporation", 'la condensation', 'les précipitations'] },
  ],
};

function frComprehension(level, i) {
  const pool = FR_TEXTS_BY_LEVEL[level] || FR_TEXTS_BY_LEVEL.easy;
  const item = choice(pool);
  return base('french', 'comprehension', level, i, {
    question: `${item.text}\n\nQuestion : ${item.q}`,
    notebookInstruction: 'Lis le texte et écris ta réponse.',
    testQuestion: `${item.text}\n\n${item.q}`,
    answer: item.a,
    options: shuffle(item.opts),
    explanation: `Réponse : ${item.a}.`,
    improvementTip: 'La réponse est toujours cachée dans le texte : relis-le calmement.',
    hints: ['Relis le texte une deuxième fois.', 'Cherche la phrase qui parle de la question.', 'La réponse est écrite dans le texte.'],
    inputType: 'choice',
  });
}

const FR_VOCAB_BY_LEVEL = {
  easy: [
    { q: 'Le contraire de « grand » :', a: 'petit', opts: ['petit', 'gros', 'haut'] },
    { q: 'Le contraire de « chaud » :', a: 'froid', opts: ['froid', 'tiède', 'doux'] },
    { q: 'Un synonyme de « content » :', a: 'heureux', opts: ['heureux', 'triste', 'fâché'] },
    { q: 'Le contraire de « jour » :', a: 'nuit', opts: ['nuit', 'soir', 'matin'] },
    { q: 'Un fruit :', a: 'banane', opts: ['banane', 'carotte', 'pain'] },
  ],
  medium: [
    { q: 'Un synonyme de « rapide » :', a: 'vite', opts: ['vite', 'lent', 'calme'] },
    { q: 'Le contraire de « courageux » :', a: 'peureux', opts: ['peureux', 'fort', 'sage'] },
    { q: 'Un synonyme de « regarder » :', a: 'observer', opts: ['observer', 'écouter', 'parler'] },
    { q: 'Le contraire de « victoire » :', a: 'défaite', opts: ['défaite', 'succès', 'match'] },
    { q: 'Un synonyme de « construire » :', a: 'bâtir', opts: ['bâtir', 'détruire', 'vendre'] },
    { q: "Le contraire de « généreux » :", a: 'avare', opts: ['avare', 'gentil', 'grand'] },
  ],
  hard: [
    { q: 'Un synonyme de « périlleux » :', a: 'dangereux', opts: ['dangereux', 'simple', 'tranquille'] },
    { q: 'Le contraire de « prospère » :', a: 'déclin', opts: ['déclin', 'richesse', 'croissance'] },
    { q: 'Un synonyme d\'« élucider » :', a: 'éclaircir', opts: ['éclaircir', 'compliquer', 'ignorer'] },
    { q: 'Le contraire de « bénin » :', a: 'malin', opts: ['malin', 'doux', 'léger'] },
    { q: 'Un synonyme de « pragmatique » :', a: 'pratique', opts: ['pratique', 'théorique', 'abstrait'] },
    { q: 'Le contraire de « concis » :', a: 'prolixe', opts: ['prolixe', 'bref', 'précis'] },
  ],
};

function frVocab(level, i) {
  const pool = FR_VOCAB_BY_LEVEL[level] || FR_VOCAB_BY_LEVEL.easy;
  const item = choice(pool);
  return base('french', 'vocabulaire', level, i, {
    question: item.q,
    notebookInstruction: 'Écris le bon mot dans ton cahier.',
    testQuestion: item.q,
    answer: item.a,
    options: shuffle(item.opts),
    explanation: `Réponse : ${item.a}.`,
    improvementTip: 'Pense à des phrases où tu utilises ces mots.',
    hints: ['Relis bien la question.', 'Élimine les mots qui ne vont pas.', `La réponse commence par « ${item.a[0]} ».`],
    inputType: 'choice',
  });
}

const FR_NOUNS = [
  { sing: 'un chat', plur: 'des chats', m: true },
  { sing: 'une fleur', plur: 'des fleurs', m: false },
  { sing: 'un livre', plur: 'des livres', m: true },
  { sing: 'une maison', plur: 'des maisons', m: false },
  { sing: 'un chien', plur: 'des chiens', m: true },
];

function frGrammaire(level, i) {
  const item = choice(FR_NOUNS);
  if (Math.random() < 0.5) {
    return base('french', 'grammaire', level, i, {
      question: `Mets au pluriel : ${item.sing}`,
      notebookInstruction: 'Écris le groupe de mots au pluriel.',
      testQuestion: `Quel est le pluriel de « ${item.sing} » ?`,
      answer: item.plur,
      acceptedAnswers: [item.plur],
      explanation: `Au pluriel : ${item.plur} (on ajoute un « s »).`,
      improvementTip: 'Au pluriel, on ajoute souvent un « s » à la fin.',
      hints: ['Le pluriel, c\'est plusieurs.', 'Change « un/une » en « des ».', 'Ajoute un « s » à la fin du mot.'],
      inputType: 'text',
    });
  }
  return base('french', 'grammaire', level, i, {
    question: `« ${item.sing} » est-il masculin ou féminin ?`,
    notebookInstruction: 'Écris masculin ou féminin.',
    testQuestion: `« ${item.sing} » est :`,
    answer: item.m ? 'masculin' : 'féminin',
    options: shuffle(['masculin', 'féminin']),
    explanation: `« ${item.sing} » est ${item.m ? 'masculin (un)' : 'féminin (une)'}.`,
    improvementTip: '« un » → masculin, « une » → féminin.',
    hints: ['Regarde le petit mot devant.', 'Dit-on « un » ou « une » ?', `On dit « ${item.sing.split(' ')[0]} ».`],
    inputType: 'choice',
  });
}

// ── DICTÉE ────────────────────────────────────────────────────────────────────

const DICTEE_MOTS_BY_LEVEL = {
  easy:   ['chat', 'maison', 'école', 'maman', 'soleil', 'fleur', 'oiseau', 'voiture', 'banane', 'jardin', 'cheval', 'bateau'],
  medium: ['château', 'papillon', 'bibliothèque', "aujourd\'hui", 'mercredi', 'septembre', 'hôpital', 'professeur', 'musique', 'gymnase', 'anniversaire', 'vocabulaire'],
  hard:   ['chrysanthème', 'parachute', 'rhinocéros', 'cauchemar', 'extraordinaire', 'bienveillance', 'orthographe', 'enthousiasme', 'authentique', 'bourgeoisie', 'exceptionnel', 'onomatopée'],
};
const DICTEE_PHRASES_BY_LEVEL = {
  easy: [
    'Le chat dort sur le lit.',
    'Maman prépare le repas.',
    'Léa joue dans le jardin.',
    "Le soleil brille aujourd\'hui.",
    'Tom lit un beau livre.',
    'Les oiseaux chantent le matin.',
  ],
  medium: [
    'Les enfants jouent dans la cour de récréation.',
    "L\'astronaute voyage dans l\'espace étoilé.",
    'Le boucher vend de la viande fraîche chaque matin.',
    "Aujourd\'hui, nous allons à la bibliothèque municipale.",
    "L\'hirondelle annonce toujours le retour du printemps.",
    'Le médecin examine attentivement ses patients.',
  ],
  hard: [
    "Les scientifiques étudient méticuleusement les phénomènes atmosphériques.",
    "L\'extraordinaire biodiversité de la forêt équatoriale fascine les biologistes.",
    "Le gouvernement a promulgué une loi exceptionnelle pour protéger l\'environnement.",
    "L\'enthousiasme et la persévérance sont indispensables à la réussite scolaire.",
    "La chrysanthème symbolise traditionnellement le souvenir et la commémoration.",
    "L\'hypocrisie est une qualité que les honnêtes gens réprouvent vivement.",
  ],
};

function dicteeMots(level, i) {
  const pool = DICTEE_MOTS_BY_LEVEL[level] || DICTEE_MOTS_BY_LEVEL.easy;
  const word = choice(pool);
  return base('dictee', 'mots', level, i, {
    question: '🎧 Mot à dicter (pour l\'adulte).',
    notebookInstruction: 'Écoute le mot et écris-le dans ton cahier.',
    testQuestion: 'Écris le mot que tu as entendu :',
    answer: word,
    explanation: `Le mot était : « ${word} ».`,
    improvementTip: 'Découpe le mot en syllabes pour bien l\'écrire.',
    hints: ['Écoute encore le mot.', 'Découpe-le en syllabes.', `Le mot commence par « ${word[0]} ».`],
    inputType: 'text',
    dictation: word,
  });
}

function dicteePhrases(level, i) {
  const pool = DICTEE_PHRASES_BY_LEVEL[level] || DICTEE_PHRASES_BY_LEVEL.easy;
  const phrase = choice(pool);
  return base('dictee', 'phrases', level, i, {
    question: '🎧 Phrase à dicter (pour l\'adulte).',
    notebookInstruction: 'Écoute la phrase et écris-la dans ton cahier.',
    testQuestion: 'Écris la phrase que tu as entendue :',
    answer: phrase,
    explanation: `La phrase était : « ${phrase} ».`,
    improvementTip: 'N\'oublie pas la majuscule au début et le point à la fin.',
    hints: ['Réécoute la phrase en entier.', 'Écris mot après mot.', 'Pense à la majuscule et au point.'],
    inputType: 'text',
    dictation: phrase,
  });
}

// ── helper to assemble an exercise with a stable id ───────────────────────────
let _seq = 0;
function base(subject, type, level, i, fields) {
  _seq += 1;
  return {
    id: `${subject}_${type}_${level}_${Date.now().toString(36)}_${i}_${_seq}`,
    subject, type, level,
    notebookInstruction: NOTEBOOK_INSTR[_locale] || NOTEBOOK_INSTR.fr,
    acceptedAnswers: undefined,
    options: undefined,
    ...fields,
  };
}

// ── Registry: `${subject}:${type}` → generator ────────────────────────────────
export const GENERATORS = {
  'math:additions': mathAdd,
  'math:soustractions': mathSub,
  'math:multiplications': mathMul,
  'math:divisions': mathDiv,
  'math:measurements': mathMeasure,
  'math:problemes': mathProbleme,
  'french:completer': frCompleter,
  'french:bon-mot': frBonMot,
  'french:comprehension': frComprehension,
  'french:vocabulaire': frVocab,
  'french:grammaire': frGrammaire,
  'dictee:mots': dicteeMots,
  'dictee:phrases': dicteePhrases,
  'math:mixte': (level, i, opts) => {
    const ops = [mathAdd, mathSub, mathMul];
    return ops[Math.floor(Math.random() * ops.length)](level, i, opts);
  },
};
