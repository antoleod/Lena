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
  const generatorGrade = gradeBand.includes('P6') ? 'P6' : gradeBand.includes('P5') ? 'P5' : gradeBand.includes('P4') ? 'P4' : gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2';
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
    accessibility: ['une consigne a la fois', 'reponses lisibles'],
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
    title: 'Additions dynamiques',
    subskill: 'addition',
    gradeBand: ['P2'],
    topic: 'addition',
    instructions: 'Une serie automatique de 10 additions, puis un mini examen.',
    hints: ['Compte les unites puis les dizaines.']
  }),
  createGeneratedMathActivity({
    id: 'generated-subtraction-p2',
    slug: 'soustractions-dynamiques-p2',
    title: 'Soustractions dynamiques',
    subskill: 'subtraction',
    gradeBand: ['P2'],
    topic: 'subtraction',
    instructions: 'Des soustractions simples qui changent a chaque partie.',
    hints: ['Tu peux compter en arriere.']
  }),
  createGeneratedMathActivity({
    id: 'generated-multiplication-p3',
    slug: 'multiplications-dynamiques-p3',
    title: 'Multiplications dynamiques',
    subskill: 'multiplication',
    gradeBand: ['P3'],
    topic: 'multiplication',
    instructions: 'Nouvelles multiplications a chaque session, avec mini examen final.',
    hints: ['Cherche les paquets egaux.']
  }),
  createGeneratedMathActivity({
    id: 'generated-comparison-p2',
    slug: 'comparaison-de-nombres-dynamique',
    title: 'Comparer des nombres',
    subskill: 'number-comparison',
    gradeBand: ['P2', 'P3'],
    topic: 'comparison',
    instructions: 'Trouve le plus grand ou le plus petit nombre selon la consigne.',
    hints: ['Observe bien les dizaines puis les unites.']
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
    instructions: 'Combine multiplication et soustraction en une meme question.',
    hints: ['Commence par la multiplication.']
  })
];
