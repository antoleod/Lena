import { createVisualWordQuestion } from '../language-packs/visualVocabulary.js';

function buildSections(practice, exam, practiceTitle = 'Oefenen', examTitle = 'Mini toets') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'Eerst rustig oefenen.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Daarna een korte controle.',
      lessons: exam
    }
  ];
}

export const dutchSubject = {
  id: 'dutch',
  label: 'Nederlands',
  description: 'Beginnen met Nederlands: woordenschat, schoolwoorden en eenvoudige zinnen.',
  color: '#2fa57d',
  accent: '#d6f4e9',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Schoolwoorden en beeld',
    'Woord en beeld koppelen',
    'Heel eenvoudige tekstjes'
  ]
};

export const dutchActivities = [
  {
    id: 'dutch-school-words',
    slug: 'schoolwoorden',
    title: 'Schoolwoorden',
    subject: 'dutch',
    subskill: 'beginner-vocabulary',
    gradeBand: ['P2'],
    language: 'nl',
    difficulty: 'starter',
    estimatedDurationMin: 6,
    instructions: 'Kijk naar de afbeelding en kies het juiste Nederlandse woord.',
    correctionType: 'multiple-choice',
    hints: ['Kijk goed naar beeld en woord.'],
    tags: ['beginner', 'school', 'woordenschat', 'visual-pack'],
    accessibility: ['korte woorden', 'beeldsteun'],
    originRepo: 'new',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        createVisualWordQuestion({ locale: 'nl', prompt: 'Kies het juiste woord bij de afbeelding.', answerConceptId: 'book', distractorConceptIds: ['house', 'water'], explanation: 'Boek is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Welk woord hoort bij het juiste beeld?', answerConceptId: 'school', distractorConceptIds: ['cat', 'apple'], explanation: 'School is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Lees en kies het goede woord.', answerConceptId: 'water', distractorConceptIds: ['book', 'house'], explanation: 'Water is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Kijk goed en kies.', answerConceptId: 'house', distractorConceptIds: ['school', 'cat'], explanation: 'Huis is het juiste woord.' })
      ],
      [
        createVisualWordQuestion({ locale: 'nl', prompt: 'Mini toets: kies het juiste woord.', answerConceptId: 'book', distractorConceptIds: ['apple', 'water'], explanation: 'Boek is correct.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Mini toets: welk woord klopt?', answerConceptId: 'school', distractorConceptIds: ['house', 'cat'], explanation: 'School is correct.' })
      ],
      'Schoolwoorden',
      'Mini toets woordenschat'
    )
  },
  {
    id: 'dutch-family-words',
    slug: 'familiewoorden',
    title: 'Familiewoorden',
    subject: 'dutch',
    subskill: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    language: 'nl',
    difficulty: 'starter',
    estimatedDurationMin: 8,
    instructions: 'Kies het juiste Nederlandse woord voor elk familielid.',
    correctionType: 'multiple-choice',
    hints: ['Denk aan wie je familie zijn.'],
    tags: ['familie', 'woordenschat', 'beginner'],
    accessibility: ['korte woorden', 'vertrouwd thema'],
    originRepo: 'new',
    engineType: 'multiple-choice',
    featured: true,
    sections: buildSections(
      [
        { prompt: 'Wie is de vader in het Nederlands?', choices: ['papa', 'mama', 'broer'], answer: 'papa', explanation: 'Papa = vader in het Nederlands.' },
        { prompt: 'Wie is de moeder in het Nederlands?', choices: ['mama', 'papa', 'oma'], answer: 'mama', explanation: 'Mama = moeder in het Nederlands.' },
        { prompt: 'Hoe noem je de broer van je vader?', choices: ['oom', 'neef', 'opa'], answer: 'oom', explanation: 'De broer van je vader is je oom.' },
        { prompt: 'Hoe noem je de zus van je moeder?', choices: ['tante', 'oma', 'nicht'], answer: 'tante', explanation: 'De zus van je moeder is je tante.' },
        { prompt: 'Wie is ouder dan je vader?', choices: ['opa', 'broer', 'neef'], answer: 'opa', explanation: 'Opa is de vader van je vader of moeder.' },
        { prompt: 'Wie is het kind van je oom?', choices: ['neef', 'broer', 'opa'], answer: 'neef', explanation: 'Het kind van je oom is je neef.' },
        { prompt: 'Hoe heet een jonger familielid dat bij je thuis woont?', choices: ['broer of zus', 'opa', 'oom'], answer: 'broer of zus', explanation: 'Je broer of zus woont samen met jou.' }
      ],
      [
        { prompt: 'Mini toets: wie is de moeder van je mama?', choices: ['oma', 'tante', 'nicht'], answer: 'oma', explanation: 'De moeder van je mama is je oma.' },
        { prompt: 'Mini toets: hoe heet de zus van je vader?', choices: ['tante', 'oma', 'neef'], answer: 'tante', explanation: 'De zus van je vader is je tante.' },
        { prompt: 'Mini toets: wie is een broer of zus?', choices: ['gezinslid', 'buur', 'vriend'], answer: 'gezinslid', explanation: 'Je broer of zus is een gezinslid.' }
      ],
      'Familiewoorden oefenen',
      'Mini toets familie'
    )
  },
  {
    id: 'dutch-picture-words',
    slug: 'beeld-en-woord',
    title: 'Beeld en woord',
    subject: 'dutch',
    subskill: 'word-image-association',
    gradeBand: ['P2', 'P3'],
    language: 'nl',
    difficulty: 'starter',
    estimatedDurationMin: 6,
    instructions: 'Koppel beeld en Nederlands woord en rond af met een mini controle.',
    correctionType: 'multiple-choice',
    hints: ['Observeer eerst alle keuzes.'],
    tags: ['beeld', 'woordenschat', 'visual-pack'],
    accessibility: ['beeldsteun'],
    originRepo: 'new',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        createVisualWordQuestion({ locale: 'nl', prompt: 'Welk woord past bij de afbeelding?', answerConceptId: 'apple', distractorConceptIds: ['book', 'house'], explanation: 'Appel is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Kies het goede woord bij het beeld.', answerConceptId: 'cat', distractorConceptIds: ['water', 'school'], explanation: 'Kat is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Zoek de goede combinatie.', answerConceptId: 'house', distractorConceptIds: ['apple', 'book'], explanation: 'Huis is het juiste woord.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Lees en kies de juiste optie.', answerConceptId: 'book', distractorConceptIds: ['cat', 'water'], explanation: 'Boek is het juiste woord.' })
      ],
      [
        createVisualWordQuestion({ locale: 'nl', prompt: 'Mini toets: kies het woord dat past.', answerConceptId: 'apple', distractorConceptIds: ['school', 'book'], explanation: 'Appel is correct.' }),
        createVisualWordQuestion({ locale: 'nl', prompt: 'Mini toets: wat hoort bij het beeld?', answerConceptId: 'cat', distractorConceptIds: ['house', 'water'], explanation: 'Kat is correct.' })
      ],
      'Beeld en woord',
      'Mini toets beeld en woord'
    )
  }
];
