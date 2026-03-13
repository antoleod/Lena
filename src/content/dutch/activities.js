function buildSections(practice, exam, practiceTitle = 'Oefenen', examTitle = 'Mini toets') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'Eerst rustig oefenen.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Daarna een korte controle.',
      lessons: exam
    }
  ];
}

export const dutchSubject = {
  id: 'dutch',
  label: 'Nederlands',
  description: 'Découverte du néerlandais: vocabulaire débutant, école et phrases simples.',
  color: '#2fa57d',
  accent: '#d6f4e9',
  grades: ['P2', 'P3'],
  roadmap: [
    'Vocabulaire de l’école',
    'Association mot-image',
    'Compréhension très simple'
  ]
};

export const dutchActivities = [
  {
    id: 'dutch-school-words',
    slug: 'mots-de-l-ecole',
    title: 'Mots de l’école',
    subject: 'dutch',
    subskill: 'beginner-vocabulary',
    gradeBand: ['P2'],
    language: 'nl',
    difficulty: 'starter',
    estimatedDurationMin: 6,
    instructions: 'Découvre les mots de l’école en néerlandais puis passe le mini test.',
    correctionType: 'multiple-choice',
    hints: ['Écoute ou répète le mot à voix haute.'],
    tags: ['débutant', 'école', 'vocabulaire'],
    accessibility: ['mots courts'],
    originRepo: 'new',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Comment dit-on “livre” en néerlandais ?', choices: ['boek', 'stoel', 'jas'], answer: 'boek', explanation: 'Boek = livre.' },
        { prompt: 'Comment dit-on “chaise” en néerlandais ?', choices: ['stoel', 'boek', 'water'], answer: 'stoel', explanation: 'Stoel = chaise.' },
        { prompt: 'Comment dit-on “école” en néerlandais ?', choices: ['school', 'brood', 'kat'], answer: 'school', explanation: 'School ressemble au mot français.' },
        { prompt: 'Comment dit-on “eau” en néerlandais ?', choices: ['water', 'boek', 'appel'], answer: 'water', explanation: 'Water = eau.' }
      ],
      [
        { prompt: 'Comment dit-on “veste” en néerlandais ?', choices: ['jas', 'school', 'vis'], answer: 'jas', explanation: 'Jas = veste.' },
        { prompt: 'Comment dit-on “pain” en néerlandais ?', choices: ['brood', 'stoel', 'huis'], answer: 'brood', explanation: 'Brood = pain.' }
      ],
      'Mots de classe',
      'Mini test de vocabulaire'
    )
  },
  {
    id: 'dutch-picture-words',
    slug: 'images-et-mots-neerlandais',
    title: 'Images et mots néerlandais',
    subject: 'dutch',
    subskill: 'word-image-association',
    gradeBand: ['P2', 'P3'],
    language: 'nl',
    difficulty: 'starter',
    estimatedDurationMin: 6,
    instructions: 'Associe l’image au mot néerlandais puis termine par une mini vérification.',
    correctionType: 'multiple-choice',
    hints: ['Observe bien l’image.'],
    tags: ['image', 'vocabulaire'],
    accessibility: ['support visuel'],
    originRepo: 'new',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel mot correspond à 🍎 ?', choices: ['appel', 'peer', 'vis'], answer: 'appel', explanation: 'Appel = pomme.' },
        { prompt: 'Quel mot correspond à 🐟 ?', choices: ['vis', 'boek', 'huis'], answer: 'vis', explanation: 'Vis = poisson.' },
        { prompt: 'Quel mot correspond à 🏡 ?', choices: ['huis', 'school', 'stoel'], answer: 'huis', explanation: 'Huis = maison.' },
        { prompt: 'Quel mot correspond à 🍐 ?', choices: ['peer', 'appel', 'water'], answer: 'peer', explanation: 'Peer = poire.' }
      ],
      [
        { prompt: 'Quel mot correspond à 🐱 ?', choices: ['kat', 'brood', 'stoel'], answer: 'kat', explanation: 'Kat = chat.' },
        { prompt: 'Quel mot correspond à 📘 ?', choices: ['boek', 'jas', 'huis'], answer: 'boek', explanation: 'Boek = livre.' }
      ],
      'Images et mots',
      'Mini test image-mot'
    )
  }
];
