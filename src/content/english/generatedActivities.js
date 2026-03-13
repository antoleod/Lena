const originRepo = 'generator-engine';

function createGeneratedEnglishActivity({
  id,
  slug,
  title,
  subskill,
  topic,
  gradeBand,
  instructions,
  hints,
  featured = false
}) {
  return {
    id,
    slug,
    title,
    subject: 'english',
    subskill,
    gradeBand,
    language: 'en',
    difficulty: 'progressive',
    estimatedDurationMin: 8,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['short prompts', 'clear options'],
    originRepo,
    engineType: 'multiple-choice',
    featured,
    generatorConfig: {
      grade: gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2',
      topic,
      language: 'en',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Practice',
          kind: 'practice',
          description: '10 new exercises in each session.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini check',
          kind: 'exam',
          description: '4 extra questions to check progress.',
          count: 4
        }
      ]
    }
  };
}

export const englishSubject = {
  id: 'english',
  label: 'Anglais',
  labelNl: 'Engels',
  description: 'Premiers mots et petites lectures en anglais.',
  descriptionNl: 'Eerste woorden en korte leesteksten in het Engels.',
  color: '#ffb347',
  accent: '#fff0d6',
  grades: ['P2', 'P3'],
  roadmap: [
    'Vocabulaire du quotidien',
    'Petites phrases',
    'Mini lecture'
  ],
  roadmapNl: [
    'Dagelijkse woordenschat',
    'Kleine zinnen',
    'Mini lezen'
  ]
};

export const generatedEnglishActivities = [
  createGeneratedEnglishActivity({
    id: 'generated-english-vocabulary',
    slug: 'anglais-vocabulaire-dynamique',
    title: 'English words',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    instructions: 'New English vocabulary in every play session.',
    hints: ['Read all the choices before you answer.'],
    featured: true
  }),
  createGeneratedEnglishActivity({
    id: 'generated-english-reading',
    slug: 'anglais-reading-dynamique',
    title: 'English reading',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'Short reading texts with fresh questions every time.',
    hints: ['Read the text one more time before choosing.']
  })
];
