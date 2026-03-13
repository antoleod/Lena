function buildSections(practice, exam, practiceTitle = 'Pratique guidée', examTitle = 'Mini examen') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'On s’entraîne doucement avant le petit défi final.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Dernière étape pour vérifier la compréhension.',
      lessons: exam
    }
  ];
}

export const frenchSubject = {
  id: 'french',
  label: 'Français',
  description: 'Lecture, vocabulaire, orthographe, grammaire et compréhension, centrés sur le français du primaire.',
  color: '#4f8df7',
  accent: '#dce8ff',
  grades: ['P2', 'P3'],
  roadmap: [
    'Vocabulaire et association image-mot',
    'Phrases à compléter',
    'Déterminants possessifs',
    'Jeux de lecture et compréhension'
  ]
};

export const frenchActivities = [
  {
    id: 'associe-image-mot',
    slug: 'associer-image-et-mot',
    title: 'Associer image et mot',
    subject: 'french',
    subskill: 'vocabulary',
    gradeBand: ['P2'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Observe l’image, choisis le bon mot, puis réussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Lis tous les mots avant de choisir.'],
    tags: ['vocabulaire', 'image-mot'],
    accessibility: ['emoji visuels', 'consigne simple'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    featured: true,
    sections: buildSections(
      [
        { prompt: 'Quel mot correspond à 🍎 ?', choices: ['pomme', 'banane', 'école'], answer: 'pomme', explanation: 'La pomme est le bon mot.' },
        { prompt: 'Quel mot correspond à 🐟 ?', choices: ['poisson', 'voiture', 'tiroir'], answer: 'poisson', explanation: 'Le poisson nage dans l’eau.' },
        { prompt: 'Quel mot correspond à 🏠 ?', choices: ['maison', 'hôpital', 'forêt'], answer: 'maison', explanation: 'Une maison est un lieu où on habite.' },
        { prompt: 'Quel mot correspond à 🐱 ?', choices: ['chat', 'cheval', 'camion'], answer: 'chat', explanation: 'Le chat est un animal.' },
        { prompt: 'Quel mot correspond à 📚 ?', choices: ['livre', 'chaussure', 'banane'], answer: 'livre', explanation: 'On lit dans un livre.' },
        { prompt: 'Quel mot correspond à 🌳 ?', choices: ['arbre', 'voiture', 'table'], answer: 'arbre', explanation: 'Un arbre pousse dans la nature.' }
      ],
      [
        { prompt: 'Quel mot correspond à 🐶 ?', choices: ['chien', 'poisson', 'soleil'], answer: 'chien', explanation: 'Le chien est le bon mot.' },
        { prompt: 'Quel mot correspond à 🎈 ?', choices: ['ballon', 'livre', 'maison'], answer: 'ballon', explanation: 'Le ballon flotte dans l’air.' },
        { prompt: 'Quel mot correspond à 🌸 ?', choices: ['fleur', 'route', 'pain'], answer: 'fleur', explanation: 'La fleur est le bon mot.' }
      ],
      'Atelier image-mot',
      'Mini examen image-mot'
    )
  },
  {
    id: 'phrase-a-trous',
    slug: 'completer-la-phrase',
    title: 'Compléter la phrase',
    subject: 'french',
    subskill: 'sentence-building',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Choisis le mot qui complète la phrase puis termine avec une petite évaluation.',
    correctionType: 'multiple-choice',
    hints: ['Relis toute la phrase avant de répondre.'],
    tags: ['phrases', 'lecture', 'sens'],
    accessibility: ['texte court'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Papa utilise un ... pour arroser ses plantes.', choices: ['arrosoir', 'marteau', 'livre'], answer: 'arrosoir', explanation: 'On arrose avec un arrosoir.' },
        { prompt: 'Le soleil brille dans le ... bleu.', choices: ['ciel', 'mer', 'cartable'], answer: 'ciel', explanation: 'Le soleil brille dans le ciel.' },
        { prompt: 'L’oiseau construit son ... dans l’arbre.', choices: ['nid', 'lit', 'camion'], answer: 'nid', explanation: 'L’oiseau vit dans son nid.' },
        { prompt: 'Nous allons à l’... pour apprendre.', choices: ['école', 'pont', 'forêt'], answer: 'école', explanation: 'On apprend à l’école.' },
        { prompt: 'Le bébé boit du ... dans son biberon.', choices: ['lait', 'papier', 'sable'], answer: 'lait', explanation: 'Le bébé boit du lait.' },
        { prompt: 'Je mets mes chaussures à mes ...', choices: ['pieds', 'mains', 'cheveux'], answer: 'pieds', explanation: 'Les chaussures vont aux pieds.' }
      ],
      [
        { prompt: 'Le chat dort sur le ... douillet.', choices: ['tapis', 'mur', 'nuage'], answer: 'tapis', explanation: 'Le chat aime dormir sur le tapis.' },
        { prompt: 'Maman met le pain dans le ... pour le cuire.', choices: ['four', 'cartable', 'jardin'], answer: 'four', explanation: 'Le four sert à cuire.' },
        { prompt: 'Le clown fait rire les enfants avec ses ...', choices: ['blagues', 'pommes', 'fenêtres'], answer: 'blagues', explanation: 'Les blagues font rire.' }
      ],
      'Atelier de phrases',
      'Mini examen de phrases'
    )
  },
  {
    id: 'possessives',
    slug: 'determinants-possessifs',
    title: 'Déterminants possessifs',
    subject: 'french',
    subskill: 'grammar',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Choisis le déterminant possessif correct, puis passe au mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Regarde le nom qui suit: singulier, pluriel, masculin ou féminin.'],
    tags: ['grammaire', 'déterminants'],
    accessibility: ['feedback ciblé'],
    originRepo: 'Lena+mobile',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Complète: ___ chat est petit.', choices: ['mon', 'ma', 'mes'], answer: 'mon', explanation: 'On dit mon chat.' },
        { prompt: 'Complète: ___ sœur est gentille.', choices: ['mon', 'ma', 'mes'], answer: 'ma', explanation: 'On dit ma sœur.' },
        { prompt: 'Complète: ___ amis arrivent.', choices: ['mon', 'ma', 'mes'], answer: 'mes', explanation: 'Le nom est pluriel.' },
        { prompt: 'Complète: ___ chien court vite.', choices: ['son', 'sa', 'ses'], answer: 'son', explanation: 'On dit son chien.' },
        { prompt: 'Complète: ___ maison est grande.', choices: ['son', 'sa', 'ses'], answer: 'sa', explanation: 'On dit sa maison.' },
        { prompt: 'Complète: Les enfants rangent ___ sacs.', choices: ['leur', 'leurs', 'son'], answer: 'leurs', explanation: 'Plusieurs enfants, plusieurs sacs.' }
      ],
      [
        { prompt: 'Complète: Nous aimons ___ école.', choices: ['notre', 'nos', 'votre'], answer: 'notre', explanation: 'Le nom est singulier.' },
        { prompt: 'Complète: Vous ouvrez ___ livres.', choices: ['votre', 'vos', 'leur'], answer: 'vos', explanation: 'Le nom est pluriel.' },
        { prompt: 'Complète: Paul montre ___ dessin.', choices: ['son', 'sa', 'ses'], answer: 'son', explanation: 'On dit son dessin.' }
      ],
      'Atelier de grammaire',
      'Mini examen des possessifs'
    )
  },
  {
    id: 'intrus-lecture',
    slug: 'trouver-l-intrus',
    title: 'Trouver l’intrus',
    subject: 'french',
    subskill: 'logic-in-language',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 7,
    instructions: 'Repère l’intrus dans les séries puis réussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Cherche ce que les mots ont en commun.'],
    tags: ['intrus', 'catégories', 'observation'],
    accessibility: ['temps court'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel mot est l’intrus ?', choices: ['chat', 'chien', 'banane'], answer: 'banane', explanation: 'Deux animaux et un fruit.' },
        { prompt: 'Quel mot est l’intrus ?', choices: ['rouge', 'bleu', 'table'], answer: 'table', explanation: 'Deux couleurs et un objet.' },
        { prompt: 'Quel mot est l’intrus ?', choices: ['lundi', 'mardi', 'pomme'], answer: 'pomme', explanation: 'Deux jours et un fruit.' },
        { prompt: 'Quel mot est l’intrus ?', choices: ['triangle', 'cercle', 'chaussure'], answer: 'chaussure', explanation: 'Deux formes et un objet.' },
        { prompt: 'Quel mot est l’intrus ?', choices: ['hiver', 'été', 'crayon'], answer: 'crayon', explanation: 'Deux saisons et un objet.' }
      ],
      [
        { prompt: 'Quel mot est l’intrus ?', choices: ['poire', 'pomme', 'vélo'], answer: 'vélo', explanation: 'Deux fruits et un véhicule.' },
        { prompt: 'Quel mot est l’intrus ?', choices: ['livre', 'cahier', 'nuage'], answer: 'nuage', explanation: 'Deux objets d’école et un élément du ciel.' }
      ],
      'Atelier intrus',
      'Mini examen des intrus'
    )
  }
];
