const originRepo = 'generator-engine';

function createGeneratedMathActivity({
  id,
  slug,
  title,
  subskill,
  gradeBand,
  topic,
  difficulty = 'adaptive',
  instructions,
  hints
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
    subject: 'mathematics',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['one step at a time', 'clear answers'],
    originRepo,
    engineType: 'multiple-choice',
    generatorConfig: {
      grade: generatorGrade,
      topic,
      language: 'fr',
      difficulty,
      sections: [
        {
          id: 'practice',
          title: 'Entrainement',
          kind: 'practice',
          description: 'On commence avec 10 exercices adaptes.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen',
          kind: 'exam',
          description: 'Puis on verifie la notion avec 4 nouvelles questions.',
          count: 4
        }
      ]
    }
  };
}

export const generatedMathematicsActivities = [
  createGeneratedMathActivity({
    id: 'generated-addition-p2',
    slug: 'additions-dynamiques-p2',
    title: 'Additions dynamiques P2',
    subskill: 'addition',
    gradeBand: ['P2'],
    topic: 'addition',
    instructions: 'Une serie automatique de 10 additions simples, puis un mini examen.',
    hints: ['Compte les unites puis les dizaines.']
  }),
  createGeneratedMathActivity({
    id: 'generated-subtraction-p2',
    slug: 'soustractions-dynamiques-p2',
    title: 'Soustractions dynamiques P2',
    subskill: 'subtraction',
    gradeBand: ['P2'],
    topic: 'subtraction',
    instructions: 'Des soustractions simples qui changent a chaque partie.',
    hints: ['Tu peux compter en arriere.']
  }),
  createGeneratedMathActivity({
    id: 'generated-comparison-p2',
    slug: 'comparaison-de-nombres-p2',
    title: 'Comparer des nombres P2',
    subskill: 'number-comparison',
    gradeBand: ['P2'],
    topic: 'comparison',
    instructions: 'Trouve le plus grand ou le plus petit nombre selon la consigne.',
    hints: ['Observe bien les dizaines puis les unites.']
  }),
  createGeneratedMathActivity({
    id: 'generated-addition-p3',
    slug: 'additions-dynamiques-p3',
    title: 'Additions dynamiques P3',
    subskill: 'addition',
    gradeBand: ['P3'],
    topic: 'addition',
    difficulty: 'medium',
    instructions: 'Des additions plus grandes avec mini examen final.',
    hints: ['Cherche les dizaines puis les unites.']
  }),
  createGeneratedMathActivity({
    id: 'generated-subtraction-p3',
    slug: 'soustractions-dynamiques-p3',
    title: 'Soustractions dynamiques P3',
    subskill: 'subtraction',
    gradeBand: ['P3'],
    topic: 'subtraction',
    difficulty: 'medium',
    instructions: 'Des soustractions plus complexes qui changent a chaque essai.',
    hints: ['Commence par les plus grandes quantites.']
  }),
  createGeneratedMathActivity({
    id: 'generated-comparison-p3',
    slug: 'comparaison-de-grands-nombres-p3',
    title: 'Comparer de grands nombres',
    subskill: 'large-number-comparison',
    gradeBand: ['P3'],
    topic: 'comparison',
    difficulty: 'medium',
    instructions: 'Compare des nombres plus grands et choisis le bon ordre.',
    hints: ['Observe centaines, dizaines et unites.']
  }),
  createGeneratedMathActivity({
    id: 'generated-multiplication-p3',
    slug: 'multiplications-dynamiques-p3',
    title: 'Multiplications dynamiques P3',
    subskill: 'multiplication',
    gradeBand: ['P3'],
    topic: 'multiplication',
    instructions: 'Nouvelles multiplications a chaque session, avec mini examen final.',
    hints: ['Cherche les groupes egaux.']
  }),
  createGeneratedMathActivity({
    id: 'generated-division-p3',
    slug: 'divisions-dynamiques-p3',
    title: 'Divisions simples P3',
    subskill: 'division',
    gradeBand: ['P3'],
    topic: 'division',
    instructions: 'Des divisions simples qui changent a chaque session.',
    hints: ['Cherche combien de groupes egaux on peut faire.']
  }),
  createGeneratedMathActivity({
    id: 'generated-word-problems',
    slug: 'problemes-dynamiques',
    title: 'Problemes du quotidien dynamiques',
    subskill: 'word-problems',
    gradeBand: ['P2', 'P3'],
    topic: 'word-problem',
    instructions: 'Le systeme cree de nouveaux problemes de vie quotidienne a chaque partie.',
    hints: ['Repere si on ajoute, enleve, groupe ou partage.']
  }),
  createGeneratedMathActivity({
    id: 'generated-logic-sequences',
    slug: 'suites-logiques-dynamiques',
    title: 'Suites logiques',
    subskill: 'logic',
    gradeBand: ['P2', 'P3'],
    topic: 'logic-sequence',
    instructions: 'Complete des suites qui changent a chaque essai.',
    hints: ['Cherche la regle qui se repete.']
  }),
  createGeneratedMathActivity({
    id: 'generated-division-p4',
    slug: 'divisions-dynamiques-p4',
    title: 'Divisions progressives',
    subskill: 'division',
    gradeBand: ['P4', 'P5'],
    topic: 'division',
    instructions: 'Des divisions simples qui changent a chaque session.',
    hints: ['Cherche combien de groupes egaux on peut former.']
  }),
  createGeneratedMathActivity({
    id: 'generated-fractions-p4',
    slug: 'fractions-dynamiques-p4',
    title: 'Fractions visuelles',
    subskill: 'fractions',
    gradeBand: ['P4', 'P5'],
    topic: 'fractions',
    instructions: 'Observe des parts et choisis la bonne fraction.',
    hints: ['Regarde le nombre total de parts, puis les parts choisies.']
  }),
  createGeneratedMathActivity({
    id: 'generated-decimals-p5',
    slug: 'decimaux-dynamiques-p5',
    title: 'Decimaux essentiels',
    subskill: 'decimals',
    gradeBand: ['P5', 'P6'],
    topic: 'decimals',
    instructions: 'Calcule avec des nombres decimaux simples.',
    hints: ['Aligne bien les dixiemes.']
  }),
  createGeneratedMathActivity({
    id: 'generated-mixed-operations-p6',
    slug: 'operations-mixtes-dynamiques-p6',
    title: 'Operations mixtes',
    subskill: 'mixed-operations',
    gradeBand: ['P6'],
    topic: 'mixed-operations',
    instructions: 'Combine multiplication et soustraction dans une meme question.',
    hints: ['Commence par la multiplication.']
  })
];
