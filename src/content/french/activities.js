import { createVisualWordQuestion } from '../language-packs/visualVocabulary.js';

function buildSections(practice, exam, practiceTitle = 'Pratique guidee', examTitle = 'Mini examen') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'On s entraine doucement avant le petit defi final.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Derniere etape pour verifier la comprehension.',
      lessons: exam
    }
  ];
}

export const frenchSubject = {
  id: 'french',
  label: 'Francais',
  description: 'Lecture, vocabulaire, orthographe, grammaire et comprehension pour le primaire.',
  color: '#4f8df7',
  accent: '#dce8ff',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Vocabulaire et association image mot',
    'Phrases a completer',
    'Determinants possessifs',
    'Jeux de lecture et comprehension'
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
    instructions: 'Observe les images et choisis le bon mot, puis reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Lis tous les mots avant de choisir.'],
    tags: ['vocabulaire', 'image-mot', 'visual-pack'],
    accessibility: ['support visuel', 'consigne simple'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    featured: true,
    sections: buildSections(
      [
        createVisualWordQuestion({ locale: 'fr', prompt: 'Choisis le mot qui va avec la bonne image.', answerConceptId: 'apple', distractorConceptIds: ['book', 'house'], explanation: 'Pomme est le bon mot.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Observe bien puis choisis le bon mot.', answerConceptId: 'cat', distractorConceptIds: ['school', 'water'], explanation: 'Chat est le bon mot.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Trouve le mot qui correspond a l image.', answerConceptId: 'house', distractorConceptIds: ['apple', 'book'], explanation: 'Maison est le bon mot.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Lis les mots et choisis la bonne reponse.', answerConceptId: 'book', distractorConceptIds: ['cat', 'school'], explanation: 'Livre est le bon mot.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Quelle image et quel mot vont ensemble ?', answerConceptId: 'school', distractorConceptIds: ['house', 'water'], explanation: 'Ecole est le bon mot.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Observe les choix avant de repondre.', answerConceptId: 'water', distractorConceptIds: ['apple', 'cat'], explanation: 'Eau est le bon mot.' })
      ],
      [
        createVisualWordQuestion({ locale: 'fr', prompt: 'Mini examen: choisis le bon mot.', answerConceptId: 'apple', distractorConceptIds: ['school', 'book'], explanation: 'Pomme est la bonne reponse.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Mini examen: quelle reponse est correcte ?', answerConceptId: 'house', distractorConceptIds: ['water', 'cat'], explanation: 'Maison est la bonne reponse.' }),
        createVisualWordQuestion({ locale: 'fr', prompt: 'Mini examen: lis et choisis.', answerConceptId: 'book', distractorConceptIds: ['apple', 'school'], explanation: 'Livre est la bonne reponse.' })
      ],
      'Atelier image mot',
      'Mini examen image mot'
    )
  },
  {
    id: 'phrase-a-trous',
    slug: 'completer-la-phrase',
    title: 'Completer la phrase',
    subject: 'french',
    subskill: 'sentence-building',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Choisis le mot qui complete la phrase puis termine avec une petite evaluation.',
    correctionType: 'multiple-choice',
    hints: ['Relis toute la phrase avant de repondre.'],
    tags: ['phrases', 'lecture', 'sens'],
    accessibility: ['texte court'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Papa utilise un ... pour arroser ses plantes.', choices: ['arrosoir', 'marteau', 'livre'], answer: 'arrosoir', explanation: 'On arrose avec un arrosoir.' },
        { prompt: 'Le soleil brille dans le ... bleu.', choices: ['ciel', 'mer', 'cartable'], answer: 'ciel', explanation: 'Le soleil brille dans le ciel.' },
        { prompt: 'L oiseau construit son ... dans l arbre.', choices: ['nid', 'lit', 'camion'], answer: 'nid', explanation: 'L oiseau vit dans son nid.' },
        { prompt: 'Nous allons a l ... pour apprendre.', choices: ['ecole', 'pont', 'foret'], answer: 'ecole', explanation: 'On apprend a l ecole.' },
        { prompt: 'Le bebe boit du ... dans son biberon.', choices: ['lait', 'papier', 'sable'], answer: 'lait', explanation: 'Le bebe boit du lait.' },
        { prompt: 'Je mets mes chaussures a mes ...', choices: ['pieds', 'mains', 'cheveux'], answer: 'pieds', explanation: 'Les chaussures vont aux pieds.' }
      ],
      [
        { prompt: 'Le chat dort sur le ... douillet.', choices: ['tapis', 'mur', 'nuage'], answer: 'tapis', explanation: 'Le chat aime dormir sur le tapis.' },
        { prompt: 'Maman met le pain dans le ... pour le cuire.', choices: ['four', 'cartable', 'jardin'], answer: 'four', explanation: 'Le four sert a cuire.' },
        { prompt: 'Le clown fait rire les enfants avec ses ...', choices: ['blagues', 'pommes', 'fenetres'], answer: 'blagues', explanation: 'Les blagues font rire.' }
      ],
      'Atelier de phrases',
      'Mini examen de phrases'
    )
  },
  {
    id: 'possessives',
    slug: 'determinants-possessifs',
    title: 'Determinants possessifs',
    subject: 'french',
    subskill: 'grammar',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Choisis le determinant possessif correct, puis passe au mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Regarde le nom qui suit: singulier, pluriel, masculin ou feminin.'],
    tags: ['grammaire', 'determinants'],
    accessibility: ['feedback cible'],
    originRepo: 'Lena+mobile',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Complete: ___ chat est petit.', choices: ['mon', 'ma', 'mes'], answer: 'mon', explanation: 'On dit mon chat.' },
        { prompt: 'Complete: ___ soeur est gentille.', choices: ['mon', 'ma', 'mes'], answer: 'ma', explanation: 'On dit ma soeur.' },
        { prompt: 'Complete: ___ amis arrivent.', choices: ['mon', 'ma', 'mes'], answer: 'mes', explanation: 'Le nom est pluriel.' },
        { prompt: 'Complete: ___ chien court vite.', choices: ['son', 'sa', 'ses'], answer: 'son', explanation: 'On dit son chien.' },
        { prompt: 'Complete: ___ maison est grande.', choices: ['son', 'sa', 'ses'], answer: 'sa', explanation: 'On dit sa maison.' },
        { prompt: 'Complete: Les enfants rangent ___ sacs.', choices: ['leur', 'leurs', 'son'], answer: 'leurs', explanation: 'Plusieurs enfants, plusieurs sacs.' }
      ],
      [
        { prompt: 'Complete: Nous aimons ___ ecole.', choices: ['notre', 'nos', 'votre'], answer: 'notre', explanation: 'Le nom est singulier.' },
        { prompt: 'Complete: Vous ouvrez ___ livres.', choices: ['votre', 'vos', 'leur'], answer: 'vos', explanation: 'Le nom est pluriel.' },
        { prompt: 'Complete: Paul montre ___ dessin.', choices: ['son', 'sa', 'ses'], answer: 'son', explanation: 'On dit son dessin.' }
      ],
      'Atelier de grammaire',
      'Mini examen des possessifs'
    )
  },
  {
    id: 'intrus-lecture',
    slug: 'trouver-l-intrus',
    title: 'Trouver l intrus',
    subject: 'french',
    subskill: 'logic-in-language',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 7,
    instructions: 'Repere l intrus dans les series puis reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Cherche ce que les mots ont en commun.'],
    tags: ['intrus', 'categories', 'observation'],
    accessibility: ['temps court'],
    originRepo: 'poeme',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel mot est l intrus ?', choices: ['chat', 'chien', 'banane'], answer: 'banane', explanation: 'Deux animaux et un fruit.' },
        { prompt: 'Quel mot est l intrus ?', choices: ['rouge', 'bleu', 'table'], answer: 'table', explanation: 'Deux couleurs et un objet.' },
        { prompt: 'Quel mot est l intrus ?', choices: ['lundi', 'mardi', 'pomme'], answer: 'pomme', explanation: 'Deux jours et un fruit.' },
        { prompt: 'Quel mot est l intrus ?', choices: ['triangle', 'cercle', 'chaussure'], answer: 'chaussure', explanation: 'Deux formes et un objet.' },
        { prompt: 'Quel mot est l intrus ?', choices: ['hiver', 'ete', 'crayon'], answer: 'crayon', explanation: 'Deux saisons et un objet.' }
      ],
      [
        { prompt: 'Quel mot est l intrus ?', choices: ['poire', 'pomme', 'velo'], answer: 'velo', explanation: 'Deux fruits et un vehicule.' },
        { prompt: 'Quel mot est l intrus ?', choices: ['livre', 'cahier', 'nuage'], answer: 'nuage', explanation: 'Deux objets d ecole et un element du ciel.' }
      ],
      'Atelier intrus',
      'Mini examen des intrus'
    )
  }
];
