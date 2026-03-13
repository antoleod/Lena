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
  const generatorGrade = gradeBand.includes('P6')
    ? 'P6'
    : gradeBand.includes('P5')
      ? 'P5'
      : gradeBand.includes('P4')
        ? 'P4'
        : gradeBand.includes('P3') && !gradeBand.includes('P2')
          ? 'P3'
          : 'P2';

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
      grade: generatorGrade,
      topic,
      language: 'es',
      difficulty: 'adaptive',
      sections: [
        { id: 'practice', title: 'Practica', kind: 'practice', description: '10 ejercicios nuevos en cada partida.', count: 10 },
        { id: 'exam', title: 'Mini prueba', kind: 'exam', description: '4 preguntas extra para comprobar el progreso.', count: 4 }
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
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: ['Mots du quotidien', 'Petites phrases', 'Mini lecture'],
  roadmapNl: ['Dagelijkse woorden', 'Kleine zinnen', 'Mini lezen']
};

export const generatedSpanishActivities = [
  createGeneratedSpanishActivity({
    id: 'generated-spanish-vocabulary',
    slug: 'espagnol-vocabulaire-dynamique',
    title: 'Palabras en espanol',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    instructions: 'Nuevas palabras en cada sesion.',
    hints: ['Observa bien todas las respuestas.'],
    featured: true
  }),
  createGeneratedSpanishActivity({
    id: 'generated-spanish-reading',
    slug: 'espagnol-reading-dynamique',
    title: 'Lectura en espanol',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'Textos cortos con nuevas preguntas en cada parte.',
    hints: ['Vuelve a leer el texto antes de elegir.']
  }),
  createGeneratedSpanishActivity({
    id: 'generated-spanish-sentences',
    slug: 'espagnol-phrases-dynamiques',
    title: 'Frases utiles',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P2', 'P3'],
    instructions: 'Completa frases utiles con nuevo vocabulario.',
    hints: ['Busca la palabra que da sentido a toda la frase.']
  }),
  createGeneratedSpanishActivity({
    id: 'generated-spanish-sentences-p4',
    slug: 'espagnol-phrases-dynamiques-p4',
    title: 'Frases utiles plus',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P4', 'P5'],
    instructions: 'Completa frases utiles con nuevo vocabulario.',
    hints: ['Busca la palabra que da sentido a toda la frase.']
  }),
  createGeneratedSpanishActivity({
    id: 'generated-spanish-reading-p6',
    slug: 'espagnol-reading-dynamique-p6',
    title: 'Lectura reto',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P6'],
    instructions: 'Lecturas cortas con comprension mas fina.',
    hints: ['Lee otra vez la informacion importante antes de elegir.']
  })
];
