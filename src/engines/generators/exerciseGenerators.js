const GRADE_LABELS = {
  P2: '2nd_grade',
  P3: '3rd_grade'
};

const FRENCH_NAMES = ['Lina', 'Nora', 'Milo', 'Adam', 'Sara', 'Yanis'];
const DUTCH_NAMES = ['Lotte', 'Milan', 'Noor', 'Sem', 'Emma', 'Finn'];

const FRENCH_NOUNS = [
  { singular: 'pomme', plural: 'pommes' },
  { singular: 'etoile', plural: 'etoiles' },
  { singular: 'crayon', plural: 'crayons' },
  { singular: 'livre', plural: 'livres' }
];

const DUTCH_NOUNS = [
  { singular: 'appel', plural: 'appels' },
  { singular: 'ster', plural: 'sterren' },
  { singular: 'potlood', plural: 'potloden' },
  { singular: 'boek', plural: 'boeken' }
];

const FRENCH_PASSAGES = [
  {
    title: 'Le chat Luna',
    lines: [
      'Marie a un chat qui s appelle Luna.',
      'Luna dort beaucoup pendant la journee.',
      'Le soir, Luna joue avec une pelote rose.'
    ],
    questions: [
      {
        prompt: 'Comment s appelle le chat ?',
        answer: 'Luna',
        distractors: ['Max', 'Soleil', 'Toby'],
        explanation: 'Le texte dit que le chat s appelle Luna.'
      },
      {
        prompt: 'Avec quoi Luna joue le soir ?',
        answer: 'Une pelote rose',
        distractors: ['Une voiture rouge', 'Un livre bleu', 'Une pomme'],
        explanation: 'La derniere phrase parle d une pelote rose.'
      }
    ]
  },
  {
    title: 'Le jardin de Sami',
    lines: [
      'Sami arrose les fleurs dans le jardin de sa mamie.',
      'Il voit trois papillons jaunes pres des roses.',
      'Puis il range son arrosoir sous le banc.'
    ],
    questions: [
      {
        prompt: 'Que voit Sami pres des roses ?',
        answer: 'Trois papillons jaunes',
        distractors: ['Deux chats noirs', 'Une grande voiture', 'Un cerf volant'],
        explanation: 'Le texte parle de trois papillons jaunes.'
      },
      {
        prompt: 'Ou range t il son arrosoir ?',
        answer: 'Sous le banc',
        distractors: ['Dans la cuisine', 'Sur le toit', 'Dans son lit'],
        explanation: 'Il le range sous le banc.'
      }
    ]
  }
];

const DUTCH_PASSAGES = [
  {
    title: 'De kat Maan',
    lines: [
      'Lisa heeft een kat die Maan heet.',
      'Maan slaapt veel in de namiddag.',
      's Avonds speelt de kat met een blauw lint.'
    ],
    questions: [
      {
        prompt: 'Hoe heet de kat?',
        answer: 'Maan',
        distractors: ['Max', 'Ster', 'Toby'],
        explanation: 'In de eerste zin staat dat de kat Maan heet.'
      },
      {
        prompt: 'Waarmee speelt de kat s avonds?',
        answer: 'Met een blauw lint',
        distractors: ['Met een rode bal', 'Met een boek', 'Met een appel'],
        explanation: 'De derde zin noemt een blauw lint.'
      }
    ]
  },
  {
    title: 'Op school',
    lines: [
      'Noor gaat vroeg naar school.',
      'In haar tas zitten een boek en twee potloden.',
      'Na de les leest ze rustig in de leeshoek.'
    ],
    questions: [
      {
        prompt: 'Wat zit er in haar tas?',
        answer: 'Een boek en twee potloden',
        distractors: ['Een jas en een appel', 'Een bal en een stoel', 'Een hond en een fiets'],
        explanation: 'De tweede zin zegt wat in de tas zit.'
      },
      {
        prompt: 'Waar leest Noor na de les?',
        answer: 'In de leeshoek',
        distractors: ['In de tuin', 'In de keuken', 'In de auto'],
        explanation: 'Ze leest in de leeshoek.'
      }
    ]
  }
];

const FRENCH_SENTENCES = [
  {
    prompt: 'Le soleil brille dans le ...',
    answer: 'ciel',
    distractors: ['cartable', 'velo', 'gouter'],
    explanation: 'Le soleil brille dans le ciel.'
  },
  {
    prompt: 'Je range mes livres dans mon ...',
    answer: 'cartable',
    distractors: ['nuage', 'jardin', 'oreiller'],
    explanation: 'Un cartable sert a ranger les livres.'
  },
  {
    prompt: 'La maitresse ecrit au ...',
    answer: 'tableau',
    distractors: ['ballon', 'velo', 'gateau'],
    explanation: 'On ecrit au tableau.'
  }
];

const DUTCH_VOCAB = [
  { fr: 'livre', nl: 'boek', wrong: ['stoel', 'jas', 'brood'] },
  { fr: 'chaise', nl: 'stoel', wrong: ['boek', 'vis', 'huis'] },
  { fr: 'chat', nl: 'kat', wrong: ['jas', 'brood', 'school'] },
  { fr: 'maison', nl: 'huis', wrong: ['peer', 'kat', 'water'] },
  { fr: 'pain', nl: 'brood', wrong: ['boek', 'stoel', 'vis'] },
  { fr: 'poire', nl: 'peer', wrong: ['appel', 'school', 'jas'] }
];

const ENGLISH_VOCAB = [
  { prompt: 'Choose the English word for "chat".', answer: 'cat', wrong: ['dog', 'book', 'chair'] },
  { prompt: 'Choose the English word for "maison".', answer: 'house', wrong: ['book', 'school', 'apple'] },
  { prompt: 'Choose the English word for "livre".', answer: 'book', wrong: ['chair', 'window', 'bread'] },
  { prompt: 'Choose the English word for "eau".', answer: 'water', wrong: ['milk', 'shoe', 'sun'] }
];

const SPANISH_VOCAB = [
  { prompt: 'Elige la palabra en espanol para "chat".', answer: 'gato', wrong: ['perro', 'libro', 'mesa'] },
  { prompt: 'Elige la palabra en espanol para "maison".', answer: 'casa', wrong: ['silla', 'agua', 'pan'] },
  { prompt: 'Elige la palabra en espanol para "livre".', answer: 'libro', wrong: ['flor', 'puerta', 'cielo'] },
  { prompt: 'Elige la palabra en espanol para "eau".', answer: 'agua', wrong: ['leche', 'tren', 'sol'] }
];

const ENGLISH_PASSAGES = [
  {
    lines: [
      'Mila has a small dog named Coco.',
      'Coco sleeps near the window in the afternoon.',
      'In the evening, Coco runs after a yellow ball.'
    ],
    questions: [
      {
        prompt: 'What is the dog called?',
        answer: 'Coco',
        distractors: ['Luna', 'Max', 'Sunny'],
        explanation: 'The first sentence says the dog is named Coco.'
      },
      {
        prompt: 'What color is the ball?',
        answer: 'Yellow',
        distractors: ['Blue', 'Green', 'Red'],
        explanation: 'The last sentence mentions a yellow ball.'
      }
    ]
  }
];

const SPANISH_PASSAGES = [
  {
    lines: [
      'Lia tiene un pez que se llama Sol.',
      'Sol nada en un acuario pequeno y brillante.',
      'Por la tarde, Lia le da comida azul.'
    ],
    questions: [
      {
        prompt: 'Como se llama el pez?',
        answer: 'Sol',
        distractors: ['Luna', 'Coco', 'Max'],
        explanation: 'La primera frase dice que el pez se llama Sol.'
      },
      {
        prompt: 'Donde nada el pez?',
        answer: 'En un acuario pequeno y brillante',
        distractors: ['En el jardin', 'En una caja', 'En la cocina'],
        explanation: 'La segunda frase habla del acuario.'
      }
    ]
  }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function uniqueOptions(correct, wrongOptions) {
  const seen = new Set([String(correct)]);
  const result = [correct];

  wrongOptions.forEach((option) => {
    const key = String(option);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(option);
    }
  });

  return shuffle(result).slice(0, 4);
}

function gradeToLabel(grade) {
  return GRADE_LABELS[grade] || grade;
}

function resolveDifficulty(grade, difficulty) {
  if (difficulty && difficulty !== 'adaptive') {
    return difficulty;
  }

  return grade === 'P3' ? 'medium' : 'easy';
}

function additionRange(grade, difficulty) {
  if (grade === 'P3') {
    if (difficulty === 'hard') return [20, 80];
    if (difficulty === 'medium') return [10, 60];
    return [5, 30];
  }

  if (difficulty === 'hard') return [8, 25];
  if (difficulty === 'medium') return [4, 20];
  return [1, 12];
}

function subtractionRange(grade, difficulty) {
  if (grade === 'P3') {
    if (difficulty === 'hard') return [30, 90];
    if (difficulty === 'medium') return [15, 70];
    return [8, 40];
  }

  if (difficulty === 'hard') return [12, 40];
  if (difficulty === 'medium') return [8, 25];
  return [4, 18];
}

function multiplicationRange(grade, difficulty) {
  if (grade === 'P2') {
    if (difficulty === 'hard') return [2, 5];
    return [2, 3];
  }

  if (difficulty === 'hard') return [4, 9];
  if (difficulty === 'medium') return [2, 8];
  return [2, 5];
}

function createExercise(base) {
  return {
    ...base,
    prompt: base.question,
    choices: base.options,
    answer: base.correct
  };
}

function generateAdditionExercise({ grade, difficulty }) {
  const [min, max] = additionRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max);
  const correct = left + right;
  const wrong = [correct - 1, correct + 1, correct + right, left + 1].filter((value) => value >= 0);

  return createExercise({
    question: `${left} + ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_addition',
    level: gradeToLabel(grade),
    explanation: `${left} + ${right} = ${correct}.`
  });
}

function generateSubtractionExercise({ grade, difficulty }) {
  const [min, max] = subtractionRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(1, Math.max(2, Math.floor(left * 0.6)));
  const correct = left - right;
  const wrong = [correct + 1, correct - 1, left + right, right].filter((value) => value >= 0);

  return createExercise({
    question: `${left} - ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_subtraction',
    level: gradeToLabel(grade),
    explanation: `${left} - ${right} = ${correct}.`
  });
}

function generateMultiplicationExercise({ grade, difficulty }) {
  const [min, max] = multiplicationRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max + 1);
  const correct = left * right;
  const wrong = [correct + left, correct - left, left + right, correct + 2].filter((value) => value >= 0);

  return createExercise({
    question: `${left} x ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_multiplication',
    level: gradeToLabel(grade),
    explanation: `${left} x ${right} = ${correct}.`
  });
}

function generateDivisionExercise({ grade, difficulty }) {
  const [min, max] = multiplicationRange(grade, difficulty);
  const divisor = randomInt(min, max);
  const quotient = randomInt(min, max + 1);
  const dividend = divisor * quotient;
  const correct = quotient;
  const wrong = [quotient + 1, quotient - 1, divisor, dividend].filter((value) => value >= 0);

  return createExercise({
    question: `${dividend} / ${divisor} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_division',
    level: gradeToLabel(grade),
    explanation: `${dividend} partage en groupes de ${divisor} donne ${quotient}.`
  });
}

function generateComparisonExercise({ grade, difficulty, language }) {
  const [min, max] = additionRange(grade, difficulty);
  const first = randomInt(min + 10, max + 20);
  const gap = randomInt(2, 9);
  const second = first - gap;
  const askGreater = Math.random() > 0.5;
  const correct = askGreater ? first : second;
  const question = language === 'nl'
    ? `Welk getal is ${askGreater ? 'groter' : 'kleiner'}?`
    : `Quel nombre est ${askGreater ? 'le plus grand' : 'le plus petit'} ?`;

  return createExercise({
    question,
    options: uniqueOptions(correct, [askGreater ? second : first]),
    correct,
    type: 'math_number_comparison',
    level: gradeToLabel(grade),
    context: [String(first), String(second)],
    explanation: language === 'nl'
      ? `${correct} is hier het juiste antwoord.`
      : `${correct} est ici la bonne reponse.`
  });
}

function pluralize(value, forms) {
  return value > 1 ? forms.plural : forms.singular;
}

function generateWordProblemExercise({ grade, difficulty, language }) {
  const nouns = language === 'nl' ? DUTCH_NOUNS : FRENCH_NOUNS;
  const names = language === 'nl' ? DUTCH_NAMES : FRENCH_NAMES;
  const noun = sample(nouns);
  const name = sample(names);
  const isAdvanced = grade === 'P3' && difficulty !== 'easy';

  if (isAdvanced && Math.random() > 0.5) {
    const groups = randomInt(2, 6);
    const each = randomInt(2, 8);
    const correct = groups * each;
    const wrong = [correct + each, correct - each, groups + each, correct + groups].filter((value) => value >= 0);
    const lines = language === 'nl'
      ? [
          `${name} maakt ${groups} zakjes.`,
          `In elk zakje zitten ${each} ${pluralize(each, noun)}.`,
          'Hoeveel zijn het samen?'
        ]
      : [
          `${name} prepare ${groups} sachets.`,
          `Dans chaque sachet, il y a ${each} ${pluralize(each, noun)}.`,
          'Combien y en a t il en tout ?'
        ];

    return createExercise({
      question: language === 'nl' ? 'Los het probleem op.' : 'Resous le probleme.',
      options: uniqueOptions(correct, wrong),
      correct,
      type: 'math_word_problem',
      level: gradeToLabel(grade),
      context: lines,
      explanation: language === 'nl'
        ? `${groups} groepen van ${each} geven ${correct}.`
        : `${groups} groupes de ${each} donnent ${correct}.`
    });
  }

  const start = randomInt(grade === 'P3' ? 10 : 3, grade === 'P3' ? 40 : 12);
  const gain = randomInt(2, grade === 'P3' ? 20 : 9);
  const correct = start + gain;
  const wrong = [correct - 1, correct + 1, start + gain + 2, gain].filter((value) => value >= 0);
  const lines = language === 'nl'
    ? [
        `${name} heeft ${start} ${pluralize(start, noun)}.`,
        `Een vriend geeft er nog ${gain}.`,
        'Hoeveel heeft hij nu?'
      ]
    : [
        `${name} a ${start} ${pluralize(start, noun)}.`,
        `Un ami lui en donne encore ${gain}.`,
        'Combien en a t il maintenant ?'
      ];

  return createExercise({
    question: language === 'nl' ? 'Los het probleem op.' : 'Resous le probleme.',
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_word_problem',
    level: gradeToLabel(grade),
    context: lines,
    explanation: language === 'nl'
      ? `${start} + ${gain} = ${correct}.`
      : `${start} + ${gain} = ${correct}.`
  });
}

function generateLogicSequenceExercise({ grade, difficulty, language }) {
  const start = randomInt(grade === 'P3' ? 3 : 1, grade === 'P3' ? 12 : 8);
  const useDouble = grade === 'P3' && difficulty === 'hard' && Math.random() > 0.5;

  if (useDouble) {
    const sequence = [start, start * 2, start * 4, start * 8];
    const correct = start * 16;
    const wrong = [correct - start, correct + start, sequence[3] + start];

    return createExercise({
      question: language === 'nl' ? 'Maak de reeks af.' : 'Complete la suite.',
      options: uniqueOptions(correct, wrong),
      correct,
      type: 'logic_sequence',
      level: gradeToLabel(grade),
      context: [sequence.join(', ') + ', ?'],
      explanation: language === 'nl'
        ? 'Elk getal wordt verdubbeld.'
        : 'Chaque nombre est double du precedent.'
    });
  }

  const step = randomInt(grade === 'P3' ? 3 : 2, difficulty === 'hard' ? 9 : 6);
  const sequence = [start, start + step, start + step * 2, start + step * 3];
  const correct = start + step * 4;
  const wrong = [correct - 1, correct + 1, sequence[3] + step + 2];

  return createExercise({
    question: language === 'nl' ? 'Maak de reeks af.' : 'Complete la suite.',
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'logic_sequence',
    level: gradeToLabel(grade),
    context: [sequence.join(', ') + ', ?'],
    explanation: language === 'nl'
      ? `We tellen telkens ${step} erbij.`
      : `On ajoute ${step} a chaque fois.`
  });
}

function generateReadingComprehensionExercise({ grade, language }) {
  const passages = language === 'nl'
    ? DUTCH_PASSAGES
    : language === 'en'
      ? ENGLISH_PASSAGES
      : language === 'es'
        ? SPANISH_PASSAGES
        : FRENCH_PASSAGES;
  const passage = sample(passages);
  const question = sample(passage.questions);

  return createExercise({
    question: question.prompt,
    options: uniqueOptions(question.answer, question.distractors),
    correct: question.answer,
    type: 'reading_comprehension',
    level: gradeToLabel(grade),
    context: passage.lines,
    explanation: question.explanation
  });
}

function generateSentenceCompletionExercise({ grade, language }) {
  if (language === 'nl') {
    const vocab = sample(DUTCH_VOCAB);
    return createExercise({
      question: `Hoe zeg je "${vocab.fr}" in het Nederlands?`,
      options: uniqueOptions(vocab.nl, vocab.wrong),
      correct: vocab.nl,
      type: 'language_vocabulary',
      level: gradeToLabel(grade),
      explanation: `${vocab.nl} is het juiste woord.`
    });
  }

  if (language === 'en') {
    const vocab = sample(ENGLISH_VOCAB);
    return createExercise({
      question: vocab.prompt,
      options: uniqueOptions(vocab.answer, vocab.wrong),
      correct: vocab.answer,
      type: 'language_vocabulary',
      level: gradeToLabel(grade),
      explanation: `${vocab.answer} is the correct word.`
    });
  }

  if (language === 'es') {
    const vocab = sample(SPANISH_VOCAB);
    return createExercise({
      question: vocab.prompt,
      options: uniqueOptions(vocab.answer, vocab.wrong),
      correct: vocab.answer,
      type: 'language_vocabulary',
      level: gradeToLabel(grade),
      explanation: `${vocab.answer} es la palabra correcta.`
    });
  }

  const sentence = sample(FRENCH_SENTENCES);
  return createExercise({
    question: sentence.prompt,
    options: uniqueOptions(sentence.answer, sentence.distractors),
    correct: sentence.answer,
    type: 'language_sentence_completion',
    level: gradeToLabel(grade),
    explanation: sentence.explanation
  });
}

export function generateExercise(input) {
  const grade = input.grade || 'P2';
  const language = input.language || 'fr';
  const difficulty = resolveDifficulty(grade, input.difficulty);
  const params = { grade, difficulty, language };

  switch (input.topic) {
    case 'addition':
      return generateAdditionExercise(params);
    case 'subtraction':
      return generateSubtractionExercise(params);
    case 'multiplication':
      return generateMultiplicationExercise(params);
    case 'division':
      return generateDivisionExercise(params);
    case 'comparison':
      return generateComparisonExercise(params);
    case 'word-problem':
      return generateWordProblemExercise(params);
    case 'logic-sequence':
      return generateLogicSequenceExercise(params);
    case 'reading-comprehension':
      return generateReadingComprehensionExercise(params);
    case 'sentence-completion':
      return generateSentenceCompletionExercise(params);
    case 'vocabulary':
      return generateSentenceCompletionExercise(params);
    default:
      return generateAdditionExercise(params);
  }
}

export function generateExerciseSet(input) {
  const count = input.count || 1;
  return Array.from({ length: count }, () => generateExercise(input));
}
