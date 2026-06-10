export const informatiqueSubject = {
  id: 'informatique',
  label: 'Informatique',
  labelNl: 'Informatica',
  description: 'Parties de l\'ordinateur, clavier, souris, internet, sécurité numérique et premiers algorithmes.',
  descriptionNl: 'Onderdelen van de computer, toetsenbord, muis, internet, digitale veiligheid en eerste algoritmen.',
  color: '#0ea5e9',
  accent: '#e0f2fe',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Parties de l\'ordinateur',
    'Clavier et souris',
    'Internet et sécurité',
    'Logique et algorithmes'
  ],
  roadmapNl: [
    'Onderdelen van de computer',
    'Toetsenbord en muis',
    'Internet en veiligheid',
    'Logica en algoritmen'
  ]
};

const categories = [
  { slug: 'parties-de-lordinateur', icon: '🖥️', label: "Parties de l'ordinateur" },
  { slug: 'le-clavier',             icon: '⌨️', label: 'Le clavier' },
  { slug: 'la-souris',              icon: '🖱️', label: 'La souris' },
  { slug: 'internet',               icon: '🌐', label: 'Internet' },
  { slug: 'securite-numerique',     icon: '🔒', label: 'Sécurité numérique' },
  { slug: 'fichiers-et-dossiers',   icon: '📁', label: 'Fichiers et dossiers' },
  { slug: 'logique-informatique',   icon: '🤖', label: 'Logique informatique' },
  { slug: 'premiers-algorithmes',   icon: '📋', label: 'Premiers algorithmes' },
];

const grades = [
  { id: 'p2', label: 'CP',  difficulty: 'beginner',      band: 'P2' },
  { id: 'p3', label: 'CE1', difficulty: 'beginner',      band: 'P3' },
  { id: 'p4', label: 'CE2', difficulty: 'intermediate',  band: 'P4' },
  { id: 'p5', label: 'CM1', difficulty: 'intermediate',  band: 'P5' },
  { id: 'p6', label: 'CM2', difficulty: 'advanced',      band: 'P6' },
];

const instructions = {
  'parties-de-lordinateur': "Identifie les différentes parties d'un ordinateur.",
  'le-clavier':             'Apprends à utiliser le clavier et à trouver les touches.',
  'la-souris':              'Apprends à utiliser la souris correctement.',
  'internet':               'Découvre comment fonctionne internet.',
  'securite-numerique':     'Apprends à rester en sécurité sur internet.',
  'fichiers-et-dossiers':   'Organise tes fichiers et dossiers sur l\'ordinateur.',
  'logique-informatique':   'Comprends les bases de la logique utilisée en informatique.',
  'premiers-algorithmes':   'Apprends à écrire des instructions étape par étape.',
};

const hints = {
  'parties-de-lordinateur': ["Pense à ce que tu vois quand tu regardes un ordinateur.", "L'écran, le clavier et la souris sont des parties importantes."],
  'le-clavier':             ['Les lettres sont regroupées sur le clavier.', 'La touche Entrée valide ce que tu écris.'],
  'la-souris':              ['Le clic gauche sélectionne, le clic droit ouvre un menu.', 'Tu peux faire défiler avec la molette.'],
  'internet':               ["Internet connecte des millions d'ordinateurs.", 'Une adresse web commence souvent par www.'],
  'securite-numerique':     ['Ne partage jamais ton mot de passe.', 'Demande à un adulte si quelque chose te semble bizarre.'],
  'fichiers-et-dossiers':   ['Un dossier contient des fichiers.', 'Donne des noms clairs à tes fichiers.'],
  'logique-informatique':   ['Les ordinateurs suivent des instructions précises.', 'Vrai ou faux, 0 ou 1 : c\'est la base.'],
  'premiers-algorithmes':   ['Un algorithme est une liste d\'instructions dans l\'ordre.', 'Vérifie chaque étape avant de passer à la suivante.'],
};

export const informatiqueActivities = categories.flatMap((cat) =>
  grades.map((grade) => ({
    id: `generated-informatique-${cat.slug}-${grade.id}`,
    subjectId: 'informatique',
    subject: 'informatique',
    gradeId: grade.id,
    gradeBand: [grade.band],
    type: 'generated',
    engineType: 'multiple-choice',
    title: `${cat.label} - ${grade.label}`,
    description: `Exercices de ${cat.label.toLowerCase()} pour le niveau ${grade.label}.`,
    instructions: instructions[cat.slug],
    icon: cat.icon,
    color: '#0ea5e9',
    difficulty: grade.difficulty,
    estimatedTime: 15,
    estimatedDurationMin: 8,
    language: 'fr',
    topic: cat.slug,
    hints: hints[cat.slug],
    tags: ['generation', 'informatique', cat.slug],
    generatorConfig: {
      grade: grade.band,
      topic: cat.slug,
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Atelier informatique',
          kind: 'practice',
          description: 'Pratique 10 exercices sur l\'informatique.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen informatique',
          kind: 'exam',
          description: '4 exercices supplémentaires pour valider le module.',
          count: 4
        }
      ]
    }
  }))
);
