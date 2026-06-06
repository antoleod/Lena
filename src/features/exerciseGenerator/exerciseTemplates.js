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

function mathAdd(level, i) {
  const max = level === 'easy' ? 10 : level === 'medium' ? 50 : 100;
  let a = rint(1, max), b = rint(1, max);
  if (level === 'easy') b = rint(0, Math.max(0, max - a)); // no carry-friendly small sums
  const answer = a + b;
  return base('math', 'additions', level, i, {
    question: `${a} + ${b} = ……`,
    testQuestion: `Combien font ${a} + ${b} ?`,
    answer: String(answer),
    explanation: `${a} + ${b} = ${answer}.`,
    inputType: 'number',
    visual: dotsVisual([a, b], ['+']),
  });
}

function mathSub(level, i) {
  const max = level === 'easy' ? 10 : level === 'medium' ? 50 : 100;
  const a = rint(2, max), b = rint(1, a);
  const answer = a - b;
  return base('math', 'soustractions', level, i, {
    question: `${a} − ${b} = ……`,
    testQuestion: `Combien font ${a} − ${b} ?`,
    answer: String(answer),
    explanation: `${a} − ${b} = ${answer}.`,
    inputType: 'number',
    visual: dotsVisual([a, b], ['−']),
  });
}

function mathMul(level, i) {
  const t = level === 'easy' ? rint(2, 5) : level === 'medium' ? rint(2, 9) : rint(6, 12);
  const b = level === 'hard' ? rint(2, 12) : rint(1, 10);
  const answer = t * b;
  return base('math', 'multiplications', level, i, {
    question: `${t} × ${b} = ……`,
    testQuestion: `Combien font ${t} × ${b} ?`,
    answer: String(answer),
    explanation: `${t} × ${b} = ${answer}. (${t} rangées de ${b})`,
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
    testQuestion: `Combien font ${a} ÷ ${b} ?`,
    answer: String(q),
    explanation: `${a} ÷ ${b} = ${q}, car ${b} × ${q} = ${a}.`,
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
  if (kind === 'cm-mm') {
    const n = rint(1, level === 'hard' ? 25 : 9);
    answer = String(n * 10); accepted = [answer, `${answer} mm`];
    q = `Convertis ${n} cm en millimètres.`;
    explanation = `1 cm = 10 mm, donc ${n} cm = ${n * 10} mm.`;
  } else if (kind === 'm-cm') {
    const n = rint(1, 9);
    answer = String(n * 100); accepted = [answer, `${answer} cm`];
    q = `Convertis ${n} m en centimètres.`;
    explanation = `1 m = 100 cm, donc ${n} m = ${n * 100} cm.`;
  } else if (kind === 'kg-g') {
    const n = rint(1, 9);
    answer = String(n * 1000); accepted = [answer, `${answer} g`];
    q = `Convertis ${n} kg en grammes.`;
    explanation = `1 kg = 1000 g, donc ${n} kg = ${n * 1000} g.`;
  } else {
    const n = rint(1, 9);
    answer = String(n * 100); accepted = [answer, `${answer} c`, `${answer} centimes`];
    q = `Convertis ${n} € en centimes.`;
    explanation = `1 € = 100 centimes, donc ${n} € = ${n * 100} centimes.`;
  }
  return base('math', 'measurements', level, i, {
    question: `${q} ……`,
    testQuestion: q,
    answer, acceptedAnswers: accepted, explanation,
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
    inputType: 'number',
  });
}

// ── FRANÇAIS ──────────────────────────────────────────────────────────────────

const FR_COMPLETE = [
  { s: 'Le chat boit du ……', a: 'lait', opts: ['lait', 'pain', 'sel'] },
  { s: 'Je mange une …… rouge.', a: 'pomme', opts: ['pomme', 'porte', 'lune'] },
  { s: 'Le soleil est dans le ……', a: 'ciel', opts: ['ciel', 'lit', 'bus'] },
  { s: "L'oiseau vole dans le ……", a: 'ciel', opts: ['ciel', 'verre', 'pré'] },
  { s: 'La nuit, je vais me ……', a: 'coucher', opts: ['coucher', 'laver', 'lever'] },
  { s: 'En hiver, il fait …….', a: 'froid', opts: ['froid', 'chaud', 'beau'] },
  { s: 'Le poisson nage dans l’……', a: 'eau', opts: ['eau', 'air', 'arbre'] },
  { s: 'Je lis un …… à la bibliothèque.', a: 'livre', opts: ['livre', 'lit', 'bol'] },
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
    notebookInstruction: 'Écris la réponse dans ton cahier.',
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
