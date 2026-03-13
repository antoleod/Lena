const originRepo = 'generator-engine';

function createGeneratedReasoningActivity({
  id,
  slug,
  title,
  gradeBand,
  instructions,
  hints
}) {
  return {
    id,
    slug,
    title,
    subject: 'reasoning',
    subskill: 'logic',
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 8,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', 'logic', 'patterns'],
    accessibility: ['one task at a time', 'clear options'],
    originRepo,
    engineType: 'multiple-choice',
    generatorConfig: {
      grade: gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2',
      topic: 'logic-sequence',
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Atelier logique',
          kind: 'practice',
          description: 'Observe, compare et complete 10 suites ou correspondances.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen logique',
          kind: 'exam',
          description: '4 exercices supplementaires pour valider le module.',
          count: 4
        }
      ]
    }
  };
}

export const reasoningSubject = {
  id: 'reasoning',
  label: 'Raisonnement',
  labelNl: 'Redeneren',
  description: 'Series, logique visuelle, intrus, classifications et deduction.',
  descriptionNl: 'Reeksen, visuele logica, vreemde eend, classificaties en deductie.',
  color: '#7a8cff',
  accent: '#e2e8ff',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Series visuelles',
    'Patrons et correspondances',
    'Intrus et classification',
    'Deduction simple'
  ],
  roadmapNl: [
    'Visuele reeksen',
    'Patronen en koppelingen',
    'Vreemde eend en sorteren',
    'Eenvoudige deductie'
  ]
};

export const generatedReasoningActivities = [
  createGeneratedReasoningActivity({
    id: 'generated-reasoning-p2',
    slug: 'raisonnement-dynamique-p2',
    title: 'Series et intrus',
    gradeBand: ['P2'],
    instructions: 'Des suites et des petites logiques qui changent a chaque partie.',
    hints: ['Cherche ce qui se repete ou ce qui change.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-reasoning-p3',
    slug: 'raisonnement-dynamique-p3',
    title: 'Logique et deduction',
    gradeBand: ['P3'],
    instructions: 'Suites plus riches, deduction simple et mini examen final.',
    hints: ['Observe la regle avant de choisir.']
  })
];
