const originRepo = 'generator-engine';

function createGeneratedReasoningActivity({
  id,
  slug,
  title,
  topic = 'logic-sequence',
  gradeBand,
  instructions,
  hints
}) {
  const generatorGrade = gradeBand.includes('P6') ? 'P6' : gradeBand.includes('P5') ? 'P5' : gradeBand.includes('P4') ? 'P4' : gradeBand.includes('P3') && !gradeBand.includes('P2') ? 'P3' : 'P2';
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
      grade: generatorGrade,
      topic,
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
    id: 'generated-sequences-p2',
    slug: 'suites-visuelles-p2',
    title: 'Suites visuelles P2',
    topic: 'logic-sequence',
    gradeBand: ['P2'],
    instructions: 'Repeter une regle simple dans des suites tres lisibles.',
    hints: ['Observe la transformation entre deux cases voisines.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-classification-reasoning-p2',
    slug: 'classer-et-trier-p2',
    title: 'Classer et trier P2',
    topic: 'comparison',
    gradeBand: ['P2'],
    instructions: 'Classer, comparer et trouver l intrus avec des criteres simples.',
    hints: ['Cherche ce qui va ensemble avant de choisir.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-reasoning-p3',
    slug: 'raisonnement-dynamique-p3',
    title: 'Logique et deduction',
    gradeBand: ['P3'],
    instructions: 'Suites plus riches, deduction simple et mini examen final.',
    hints: ['Observe la regle avant de choisir.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-patterns-reasoning-p3',
    slug: 'patrons-logiques-p3',
    title: 'Patrons et matrices P3',
    topic: 'logic-sequence',
    gradeBand: ['P3'],
    instructions: 'Suites, motifs et organisations visuelles plus riches.',
    hints: ['Compare chaque ligne ou chaque groupe avant de decider.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-memory-reasoning-p3',
    slug: 'memoire-et-attention-p3',
    title: 'Memoire et attention P3',
    topic: 'comparison',
    gradeBand: ['P3'],
    instructions: 'Retenir, comparer et retrouver la bonne relation.',
    hints: ['Observe tout, puis cherche ce qui manque ou ce qui change.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-reasoning-p4',
    slug: 'raisonnement-dynamique-p4',
    title: 'Matrices et suites',
    gradeBand: ['P4', 'P5'],
    instructions: 'Des suites plus longues et des choix plus proches.',
    hints: ['Compare chaque etape de la suite avant de decider.']
  }),
  createGeneratedReasoningActivity({
    id: 'generated-reasoning-p6',
    slug: 'raisonnement-dynamique-p6',
    title: 'Strategie logique',
    gradeBand: ['P6'],
    instructions: 'Entrainement logique plus dense avec repetition adaptative.',
    hints: ['Cherche la transformation ou la relation cachee.']
  })
];
