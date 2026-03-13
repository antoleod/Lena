const originRepo = 'generator-engine';

function createGeneratedDutchActivity({
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
    subject: 'dutch',
    subskill,
    gradeBand,
    language: 'nl',
    difficulty: 'progressive',
    estimatedDurationMin: 9,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['consigne simple', 'mots courts'],
    originRepo,
    engineType: 'multiple-choice',
    featured,
    generatorConfig: {
      grade: gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2',
      topic,
      language: 'nl',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Oefenen',
          kind: 'practice',
          description: '10 nieuwe oefeningen per sessie.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini toets',
          kind: 'exam',
          description: '4 extra vragen om te controleren.',
          count: 4
        }
      ]
    }
  };
}

export const generatedDutchActivities = [
  createGeneratedDutchActivity({
    id: 'generated-dutch-vocabulary',
    slug: 'woordenschat-dynamisch-nl',
    title: 'Woordenschat Nederlands',
    subskill: 'beginner-vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    instructions: 'Nieuwe woorden in het Nederlands bij elke beurt.',
    hints: ['Lees alle woorden rustig voor je kiest.'],
    featured: true
  }),
  createGeneratedDutchActivity({
    id: 'generated-dutch-reading',
    slug: 'leesbegrip-dynamisch-nl',
    title: 'Leesbegrip Nederlands',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'Korte teksten met nieuwe vragen elke keer.',
    hints: ['Lees de zinnen nog een keer voor je antwoordt.']
  })
];
