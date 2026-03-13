import { createVisualWordQuestion } from '../language-packs/visualVocabulary.js';

function buildSections(practice, exam, practiceTitle = 'Visual practice', examTitle = 'Mini check') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'See the picture and choose the correct English word.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'A short visual check at the end.',
      lessons: exam
    }
  ];
}

export const englishActivities = [
  {
    id: 'english-visual-words',
    slug: 'english-visual-words',
    title: 'English picture words',
    subject: 'english',
    subskill: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    language: 'en',
    difficulty: 'guided',
    estimatedDurationMin: 7,
    instructions: 'Look at the picture and choose the matching English word.',
    correctionType: 'multiple-choice',
    hints: ['Look carefully at the picture before you answer.'],
    tags: ['visual-vocabulary', 'image-word'],
    accessibility: ['image support', 'short prompt'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the apple?', answerConceptId: 'apple', distractorConceptIds: ['book', 'house'], explanation: 'Apple is the correct English word.' }),
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the house?', answerConceptId: 'house', distractorConceptIds: ['cat', 'water'], explanation: 'House is the correct English word.' }),
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the cat?', answerConceptId: 'cat', distractorConceptIds: ['school', 'book'], explanation: 'Cat is the correct English word.' }),
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the book?', answerConceptId: 'book', distractorConceptIds: ['apple', 'water'], explanation: 'Book is the correct English word.' })
      ],
      [
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the school?', answerConceptId: 'school', distractorConceptIds: ['house', 'cat'], explanation: 'School is the correct English word.' }),
        createVisualWordQuestion({ locale: 'en', prompt: 'Which word matches the water?', answerConceptId: 'water', distractorConceptIds: ['apple', 'book'], explanation: 'Water is the correct English word.' })
      ]
    )
  },
  {
    id: 'english-sentence-choices',
    slug: 'english-sentence-choices',
    title: 'Choose the correct sentence',
    subject: 'english',
    subskill: 'sentence-building',
    gradeBand: ['P2', 'P3'],
    language: 'en',
    difficulty: 'progressive',
    estimatedDurationMin: 8,
    instructions: 'Read the sentence and choose the word that fits best.',
    correctionType: 'multiple-choice',
    hints: ['Read the whole sentence before you answer.'],
    tags: ['sentence-building', 'reading'],
    accessibility: ['short sentence', 'clear options'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'I read a ... at school.', choices: ['book', 'cat', 'water'], answer: 'book', explanation: 'We read a book.' },
        { prompt: 'The ... drinks milk.', choices: ['cat', 'house', 'school'], answer: 'cat', explanation: 'A cat can drink milk.' },
        { prompt: 'We go to ... every morning.', choices: ['school', 'apple', 'water'], answer: 'school', explanation: 'Children go to school.' },
        { prompt: 'I live in a ...', choices: ['house', 'book', 'cat'], answer: 'house', explanation: 'You live in a house.' }
      ],
      [
        { prompt: 'I eat an ... at break time.', choices: ['apple', 'school', 'cat'], answer: 'apple', explanation: 'An apple is food.' },
        { prompt: 'I drink ... after sport.', choices: ['water', 'book', 'house'], answer: 'water', explanation: 'Water is the correct choice.' }
      ],
      'Sentence practice',
      'Mini sentence check'
    )
  }
];
