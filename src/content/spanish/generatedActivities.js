const originRepo = 'generator-engine';

function createGeneratedSpanishActivity({
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
    subject: 'spanish',
    subskill,
    gradeBand,
    language: 'es',
    difficulty: 'progressive',
    estimatedDurationMin: 8,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['textos cortos', 'opciones claras'],
    originRepo,
    engineType: 'multiple-choice',
    featured,
    generatorConfig: {
      grade: gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2',
      topic,
      language: 'es',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Practica',
          kind: 'practice',
          description: '10 ejercicios nuevos en cada partida.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini prueba',
          kind: 'exam',
          description: '4 preguntas extra para comprobar el progreso.',
          count: 4
        }
      ]
    }
  };
}

export const spanishSubject = {
  id: 'spanish',
  label: 'Espagnol',
  labelNl: 'Spaans',
  description: 'Premiers mots et petites lectures en espagnol.',
  descriptionNl: 'Eerste woorden en korte leesteksten in het Spaans.',
  color: '#ff8f70',
  accent: '#ffe2d8',
  grades: ['P2', 'P3'],
  roadmap: [
    'Mots du quotidien',
    'Petites phrases',
    'Mini lecture'
  ],
  roadmapNl: [
    'Dagelijkse woorden',
    'Kleine zinnen',
    'Mini lezen'
  ]
};

export const generatedSpanishActivities = [
  createGeneratedSpanishActivity({
    id: 'generated-spanish-vocabulary',
    slug: 'espagnol-vocabulaire-dynamique',
    title: 'Palabras en espanol',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    instructions: 'Nouvelles palabras en chaque session.',
    hints: ['Observe bien toutes les reponses.'],
    featured: true
  }),
  createGeneratedSpanishActivity({
    id: 'generated-spanish-reading',
    slug: 'espagnol-reading-dynamique',
    title: 'Lectura en espanol',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'Petits textes avec de nouvelles questions a chaque partie.',
    hints: ['Relis le texte avant de choisir.']
  })
];
