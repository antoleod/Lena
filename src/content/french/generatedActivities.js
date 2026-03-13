const originRepo = 'generator-engine';

function createGeneratedFrenchActivity({
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
    subject: 'french',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 9,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['texte court', 'choix limites'],
    originRepo,
    engineType: 'multiple-choice',
    featured,
    generatorConfig: {
      grade: gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2',
      topic,
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Lecture ou langage',
          kind: 'practice',
          description: '10 exercices generes selon le niveau.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen',
          kind: 'exam',
          description: '4 nouvelles questions pour verifier la notion.',
          count: 4
        }
      ]
    }
  };
}

export const generatedFrenchActivities = [
  createGeneratedFrenchActivity({
    id: 'generated-french-reading',
    slug: 'lecture-comprehension-dynamique-fr',
    title: 'Lecture et comprehension',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'De petits textes et de nouvelles questions a chaque partie.',
    hints: ['Relis les phrases avant de repondre.'],
    featured: true
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-sentences',
    slug: 'phrases-dynamiques-fr',
    title: 'Phrases a completer',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P2', 'P3'],
    instructions: 'Le systeme cree de nouvelles phrases a completer.',
    hints: ['Cherche le mot qui donne du sens a la phrase.']
  })
];
