export const logiqueSubject = {
  id: 'logique',
  label: 'Logique & Réflexion',
  labelNl: 'Logica & Denken',
  description: 'Suites logiques, intrus, formes, labyrinthes et déduction pour développer la pensée critique.',
  descriptionNl: 'Logische reeksen, vreemde eend, vormen, labyrinten en deductie om kritisch denken te ontwikkelen.',
  color: '#6366f1',
  accent: '#c7d2fe',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Suites logiques',
    'Trouver l\'intrus',
    'Formes et motifs',
    'Déduction et résolution'
  ],
  roadmapNl: [
    'Logische reeksen',
    'Vreemde eend zoeken',
    'Vormen en patronen',
    'Deductie en oplossing'
  ]
};

const categories = [
  { slug: 'suites-logiques',         icon: '🔢', label: 'Suites logiques' },
  { slug: 'trouve-lintrus',          icon: '🔍', label: "Trouver l'intrus" },
  { slug: 'formes-et-motifs',        icon: '🔷', label: 'Formes et motifs' },
  { slug: 'labyrinthes',             icon: '🌀', label: 'Labyrinthes' },
  { slug: 'logique-visuelle',        icon: '👁️', label: 'Logique visuelle' },
  { slug: 'comparaison',             icon: '⚖️', label: 'Comparaison' },
  { slug: 'deduction',               icon: '🧩', label: 'Déduction' },
  { slug: 'resolution-de-problemes', icon: '💡', label: 'Résolution de problèmes' },
];

const grades = [
  { id: 'p2', label: 'CP',  difficulty: 'beginner',      band: 'P2' },
  { id: 'p3', label: 'CE1', difficulty: 'beginner',      band: 'P3' },
  { id: 'p4', label: 'CE2', difficulty: 'intermediate',  band: 'P4' },
  { id: 'p5', label: 'CM1', difficulty: 'intermediate',  band: 'P5' },
  { id: 'p6', label: 'CM2', difficulty: 'advanced',      band: 'P6' },
];

const instructions = {
  'suites-logiques':         'Observe la suite et trouve le prochain élément qui respecte la règle.',
  'trouve-lintrus':          "Trouve l'élément qui n'appartient pas au groupe.",
  'formes-et-motifs':        'Analyse les formes et complète le motif.',
  'labyrinthes':             'Trouve le chemin logique pour traverser le labyrinthe.',
  'logique-visuelle':        'Observe les images et déduis la règle cachée.',
  'comparaison':             'Compare les éléments et choisis la bonne réponse.',
  'deduction':               'Utilise les indices pour déduire la bonne réponse.',
  'resolution-de-problemes': 'Résous le problème logique étape par étape.',
};

const hints = {
  'suites-logiques':         ['Cherche ce qui change d\'un élément à l\'autre.', 'Compte les éléments ou observe les couleurs.'],
  'trouve-lintrus':          ['Cherche le point commun entre tous les éléments sauf un.', 'Pense à la catégorie ou à la forme.'],
  'formes-et-motifs':        ['Observe les lignes et les colonnes.', 'Cherche ce qui se répète ou ce qui change.'],
  'labyrinthes':             ['Essaie de trouver la sortie avant de choisir.', 'Élimine les chemins qui mènent à des impasses.'],
  'logique-visuelle':        ['Regarde attentivement chaque détail.', 'Compare les images deux à deux.'],
  'comparaison':             ['Compare chaque élément avec les autres.', 'Pense à la taille, la couleur ou la forme.'],
  'deduction':               ['Lis tous les indices avant de répondre.', 'Élimine les réponses impossibles.'],
  'resolution-de-problemes': ['Décompose le problème en petites étapes.', 'Vérifie ta réponse avec les données du problème.'],
};

export const logiqueActivities = categories.flatMap((cat) =>
  grades.map((grade) => ({
    id: `generated-logique-${cat.slug}-${grade.id}`,
    subjectId: 'logique',
    subject: 'logique',
    gradeId: grade.id,
    gradeBand: [grade.band],
    type: 'generated',
    engineType: 'multiple-choice',
    title: `${cat.label} - ${grade.label}`,
    description: `Exercices de ${cat.label.toLowerCase()} pour le niveau ${grade.label}.`,
    instructions: instructions[cat.slug],
    icon: cat.icon,
    color: '#6366f1',
    difficulty: grade.difficulty,
    estimatedTime: 15,
    estimatedDurationMin: 8,
    language: 'fr',
    topic: cat.slug,
    hints: hints[cat.slug],
    tags: ['generation', 'logique', cat.slug],
    generatorConfig: {
      grade: grade.band,
      topic: cat.slug,
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Atelier logique',
          kind: 'practice',
          description: 'Observe, analyse et réponds à 10 exercices de logique.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen logique',
          kind: 'exam',
          description: '4 exercices supplémentaires pour valider le module.',
          count: 4
        }
      ]
    }
  }))
);
