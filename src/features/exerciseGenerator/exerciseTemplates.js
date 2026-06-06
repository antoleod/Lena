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

import { buildDotsVisual as dotsVisual, buildArrayVisual } from './mathVisualUtils.js';

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
// "Taille des nombres" and "Nombre d'opérations" are INDEPENDENT now.
// Auto (no value) → progression adapted to the level.
function autoTerms(level) { return level === 'easy' ? 2 : level === 'medium' ? 3 : 4; }
function operandRange(level, digits) {
  const dr = digitRange(digits);
  if (dr) return dr;
  return [1, level === 'easy' ? 10 : level === 'medium' ? 50 : 100];
}

function mathAdd(level, i, opts = {}) {
  const terms = Math.max(2, Number(opts.terms) || autoTerms(level));
  const [lo, hi] = operandRange(level, opts.digits);
  const nums = Array.from({ length: terms }, () => rint(Math.max(1, lo), hi));
  const answer = nums.reduce((s, n) => s + n, 0);
  // progressive method: running sum, step by step
  const steps = [];
  let run = nums[0];
  for (let k = 1; k < terms; k++) { steps.push(`${run} + ${nums[k]} = ${run + nums[k]}`); run += nums[k]; }
  const expr = nums.join(' + ');
  return base('math', 'additions', level, i, {
    question: `${expr} = ……`,
    testQuestion: mqx(expr),
    answer: String(answer),
    explanation: `${expr} = ${answer}.`,
    method: steps.join('\n') || `${expr} = ${answer}`,
    improvementTip: 'Additionne deux nombres à la fois, de gauche à droite.',
    hints: [
      'Additionne les deux premiers nombres d’abord.',
      `Commence par ${nums[0]} + ${nums[1]} = ${nums[0] + nums[1]}.`,
      'Continue en ajoutant un nombre à la fois.',
    ],
    inputType: 'number',
    visual: dotsVisual(nums, Array(terms - 1).fill('+')),
  });
}

function mathSub(level, i, opts = {}) {
  const terms = Math.max(2, Number(opts.terms) || autoTerms(level));
  const [lo, hi] = operandRange(level, opts.digits);
  // First number big enough; subtract the rest keeping the running total >= 0.
  let a = rint(Math.max(lo, Math.ceil(hi / 2)), hi);
  const subs = [];
  let run = a;
  for (let k = 1; k < terms; k++) {
    const s = rint(1, Math.max(1, Math.min(hi, run)));
    subs.push(s); run -= s;
  }
  const answer = run;
  const steps = [];
  let acc = a;
  for (const s of subs) { steps.push(`${acc} − ${s} = ${acc - s}`); acc -= s; }
  const expr = `${a}` + subs.map((s) => ` − ${s}`).join('');
  return base('math', 'soustractions', level, i, {
    question: `${expr} = ……`,
    testQuestion: mqx(expr),
    answer: String(answer),
    explanation: `${expr} = ${answer}.`,
    method: steps.join('\n') || `${expr} = ${answer}`,
    improvementTip: 'Enlève un nombre à la fois, de gauche à droite.',
    hints: [
      'Commence par enlever le premier nombre.',
      `${a} − ${subs[0]} = ${a - subs[0]}.`,
      'Continue à enlever un nombre à la fois.',
    ],
    inputType: 'number',
    visual: dotsVisual([a, ...subs], Array(terms - 1).fill('−')),
  });
}

function mathMul(level, i) {
  const t = level === 'easy' ? rint(2, 5) : level === 'medium' ? rint(2, 9) : rint(6, 12);
  const b = level === 'hard' ? rint(2, 12) : rint(1, 10);
  const answer = t * b;
  return base('math', 'multiplications', level, i, {
    question: `${t} × ${b} = ……`,
    testQuestion: mq('×', t, b),
    answer: String(answer),
    explanation: `${t} × ${b} = ${answer}. (${t} rangées de ${b})`,
    method: `${t} × ${b} = ${b}${t > 1 ? ` + ${b}`.repeat(t - 1) : ''} = ${answer}`,
    improvementTip: 'Apprends tes tables par cœur, c’est très utile !',
    hints: [
      `C’est ${t} fois le nombre ${b}.`,
      `Additionne ${b} ${t} fois.`,
      `${t} × ${b}, pense à ta table de ${b}.`,
    ],
    inputType: 'number',
    visual: buildArrayVisual(t, b),
  });
}

function mathDiv(level, i) {
  const b = level === 'easy' ? rint(2, 5) : level === 'medium' ? rint(2, 9) : rint(2, 12);
  const q = level === 'easy' ? rint(1, 5) : rint(2, 10);
  const a = b * q; // exact division
  return base('math', 'divisions', level, i, {
    question: `${a} ÷ ${b} = ……`,
    testQuestion: mq('÷', a, b),
    answer: String(q),
    explanation: `${a} ÷ ${b} = ${q}, car ${b} × ${q} = ${a}.`,
    method: `Combien de fois ${b} dans ${a} ? ${b} × ${q} = ${a}, donc ${a} ÷ ${b} = ${q}.`,
    improvementTip: 'La division, c’est l’inverse de la multiplication.',
    hints: [
      `Combien de fois ${b} entre dans ${a} ?`,
      `Cherche dans la table de ${b}.`,
      `${b} × ? = ${a}.`,
    ],
    inputType: 'number',
  });
}

function mathMeasure(level, i) {
  const kinds = level === 'easy'
    ? ['cm-mm']
    : level === 'medium'
      ? ['cm-mm', 'm-cm', 'euro-cent']
      : ['cm-mm', 'm-cm', 'euro-cent', 'kg-g'];
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
  } else {
    const n = rint(1, 9);
    answer = String(n * 100); accepted = [answer, `${answer} c`, `${answer} ${centWord}`];
    q = cv(n, '€', centWord);
    explanation = `1 € = 100 ${centWord} → ${n} € = ${n * 100} ${centWord}.`;
  }
  return base('math', 'measurements', level, i, {
    question: `${q} ……`,
    testQuestion: q,
    answer, acceptedAnswers: accepted, explanation,
    method: explanation,
    improvementTip: 'Retiens les conversions clés : 1 cm = 10 mm, 1 m = 100 cm, 1 € = 100 centimes.',
    hints: [
      'Rappelle-toi la règle de conversion.',
      'Multiplie par 10, 100 ou 1000 selon l’unité.',
      explanation,
    ],
    inputType: 'text',
  });
}

function mathProbleme(level, i) {
  const names = ['Léa', 'Tom', 'Maya', 'Hugo', 'Nina', 'Sami'];
  const items = [['billes', '🔵'], ['bonbons', '🍬'], ['images', '🖼️'], ['pommes', '🍎'], ['crayons', '✏️']];
  const name = choice(names);
  const [item] = choice(items);
  let q, answer, explanation;
  if (level === 'easy') {
    const a = rint(2, 9), b = rint(1, 9);
    answer = a + b;
    q = `${name} a ${a} ${item}. On lui en donne ${b}. Combien en a-t-${name === 'Léa' || name === 'Maya' || name === 'Nina' ? 'elle' : 'il'} maintenant ?`;
    explanation = `${a} + ${b} = ${answer} ${item}.`;
  } else if (level === 'medium') {
    const a = rint(10, 30), b = rint(2, 9);
    answer = a - b;
    q = `${name} a ${a} ${item}. ${name} en perd ${b}. Combien en reste-t-il ?`;
    explanation = `${a} − ${b} = ${answer} ${item}.`;
  } else {
    const groups = rint(2, 5), each = rint(2, 6);
    answer = groups * each;
    q = `${name} a ${groups} boîtes de ${each} ${item}. Combien de ${item} en tout ?`;
    explanation = `${groups} × ${each} = ${answer} ${item}.`;
  }
  return base('math', 'problemes', level, i, {
    question: q,
    notebookInstruction: 'Pose ton calcul, puis écris la phrase réponse.',
    testQuestion: q,
    answer: String(answer),
    explanation,
    method: explanation,
    improvementTip: 'Souligne les nombres et cherche le mot qui dit quoi faire (donne, perd, en tout).',
    hints: [
      'Relis bien le problème, lentement.',
      'Quels sont les nombres ? Que faut-il faire avec ?',
      `Pose le calcul : ${explanation}`,
    ],
    inputType: 'number',
  });
}

// ── FRANÇAIS ──────────────────────────────────────────────────────────────────

const FR_COMPLETE = [
  { s: 'Le chat boit du ……', a: 'lait', opts: ['lait', 'pain', 'sel'], h: ['Pense à ce que boit un chat.', 'C’est blanc et ça vient de la vache.', 'Le mot commence par L.'] },
  { s: 'Je mange une …… rouge.', a: 'pomme', opts: ['pomme', 'porte', 'lune'], h: ['Cherche un fruit rouge.', 'On le croque, il est rond.', 'Le mot commence par P.'] },
  { s: 'Le soleil est dans le ……', a: 'ciel', opts: ['ciel', 'lit', 'bus'], h: ['Lève la tête dehors.', 'C’est tout en haut, au-dessus de nous.', 'Le mot commence par C.'] },
  { s: "L'oiseau vole dans le ……", a: 'ciel', opts: ['ciel', 'verre', 'pré'], h: ['Où volent les oiseaux ?', 'Tout en haut, dans les airs.', 'Le mot commence par C.'] },
  { s: 'La nuit, je vais me ……', a: 'coucher', opts: ['coucher', 'laver', 'lever'], h: ['Que fait-on le soir pour dormir ?', 'On va dans son lit.', 'Le mot commence par C.'] },
  { s: 'En hiver, il fait …….', a: 'froid', opts: ['froid', 'chaud', 'beau'], h: ['Pense à la météo en hiver.', 'Est-ce qu’il fait chaud ou froid ?', 'Le mot commence par F.'] },
  { s: 'Le poisson nage dans l’……', a: 'eau', opts: ['eau', 'air', 'arbre'], h: ['Où vit le poisson ?', 'On en boit aussi, c’est liquide.', 'Le mot commence par E.'] },
  { s: 'Je lis un …… à la bibliothèque.', a: 'livre', opts: ['livre', 'lit', 'bol'], h: ['Que lit-on ?', 'Il a des pages avec des histoires.', 'Le mot commence par L.'] },
];

function frCompleter(level, i) {
  const item = choice(FR_COMPLETE);
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

const FR_BONMOT = [
  { q: 'On écrit :', a: 'maman', opts: ['maman', 'mamen', 'momen'] },
  { q: 'On écrit :', a: 'école', opts: ['école', 'ékole', 'écolle'] },
  { q: 'On écrit :', a: 'oiseau', opts: ['oiseau', 'oizeau', 'oisau'] },
  { q: 'On écrit :', a: 'bateau', opts: ['bateau', 'batau', 'bato'] },
  { q: 'On écrit :', a: 'maison', opts: ['maison', 'mayson', 'mèson'] },
];

function frBonMot(level, i) {
  const item = choice(FR_BONMOT);
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

const FR_TEXTS = [
  { text: 'Léa a un petit chien noir. Il s’appelle Filou. Filou aime courir dans le jardin.',
    q: 'Comment s’appelle le chien ?', a: 'Filou', opts: ['Filou', 'Léa', 'Rex'] },
  { text: 'Tom va à la mer avec sa maman. Il construit un château de sable.',
    q: 'Où va Tom ?', a: 'à la mer', opts: ['à la mer', 'à la montagne', 'à l’école'] },
  { text: 'Maya plante une fleur jaune dans un pot. Chaque jour, elle l’arrose.',
    q: 'De quelle couleur est la fleur ?', a: 'jaune', opts: ['jaune', 'rouge', 'bleue'] },
];

function frComprehension(level, i) {
  const item = choice(FR_TEXTS);
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

const FR_VOCAB = [
  { q: 'Le contraire de « grand » :', a: 'petit', opts: ['petit', 'gros', 'haut'] },
  { q: 'Le contraire de « chaud » :', a: 'froid', opts: ['froid', 'tiède', 'doux'] },
  { q: 'Un synonyme de « content » :', a: 'heureux', opts: ['heureux', 'triste', 'fâché'] },
  { q: 'Le contraire de « jour » :', a: 'nuit', opts: ['nuit', 'soir', 'matin'] },
  { q: 'Un fruit :', a: 'banane', opts: ['banane', 'carotte', 'pain'] },
];

function frVocab(level, i) {
  const item = choice(FR_VOCAB);
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
      hints: ['Le pluriel, c’est plusieurs.', 'Change « un/une » en « des ».', 'Ajoute un « s » à la fin du mot.'],
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

const DICTEE_MOTS = ['chat', 'maison', 'école', 'maman', 'soleil', 'fleur', 'oiseau', 'voiture', 'banane', 'jardin', 'cheval', 'bateau'];
const DICTEE_PHRASES = [
  'Le chat dort sur le lit.',
  'Maman prépare le repas.',
  'Léa joue dans le jardin.',
  'Le soleil brille aujourd’hui.',
  'Tom lit un beau livre.',
  'Les oiseaux chantent le matin.',
];

function dicteeMots(level, i) {
  const word = choice(DICTEE_MOTS);
  return base('dictee', 'mots', level, i, {
    question: '🎧 Mot à dicter (pour l’adulte).',
    notebookInstruction: 'Écoute le mot et écris-le dans ton cahier.',
    testQuestion: 'Écris le mot que tu as entendu :',
    answer: word,
    explanation: `Le mot était : « ${word} ».`,
    improvementTip: 'Découpe le mot en syllabes pour bien l’écrire.',
    hints: ['Écoute encore le mot.', 'Découpe-le en syllabes.', `Le mot commence par « ${word[0]} ».`],
    inputType: 'text',
    dictation: word,
  });
}

function dicteePhrases(level, i) {
  const phrase = choice(DICTEE_PHRASES);
  return base('dictee', 'phrases', level, i, {
    question: '🎧 Phrase à dicter (pour l’adulte).',
    notebookInstruction: 'Écoute la phrase et écris-la dans ton cahier.',
    testQuestion: 'Écris la phrase que tu as entendue :',
    answer: phrase,
    explanation: `La phrase était : « ${phrase} ».`,
    improvementTip: 'N’oublie pas la majuscule au début et le point à la fin.',
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
};
