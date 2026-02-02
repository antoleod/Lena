
window.ENQUETE_GRAMMATICALE_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'Sujet, Verbe, Complément',
    description: 'Lis la phrase et identifie le rôle du mot en surbrillance.',
    exercises: [
      {
        sentence: 'Le chat mange la souris.',
        target: 'chat',
        question: 'Quel est le rôle de “chat” dans la phrase ?',
        correct: 'sujet',
        options: ['sujet', 'verbe', 'complément']
      },
      {
        sentence: 'La fille dessine une maison.',
        target: 'dessine',
        question: 'Quel est le rôle de “dessine” dans la phrase ?',
        correct: 'verbe',
        options: ['sujet', 'verbe', 'complément']
      },
      {
        sentence: 'Le garçon lit un livre.',
        target: 'livre',
        question: 'Quel est le rôle de “livre” dans la phrase ?',
        correct: 'complément',
        options: ['sujet', 'verbe', 'complément']
      }
    ]
  },
  {
    id: 'niveau2',
    title: 'Niveau 2',
    badge: '🕵️‍♀️',
    subtitle: 'Enquête 2',
    description: 'Identifie sujet, verbe et complément dans de nouvelles phrases.',
    exercises: [
      { sentence: 'La maîtresse lit une histoire.', target: 'lit', question: 'Quel est le rôle de "lit" ?', correct: 'verbe', options: ['sujet', 'verbe', 'complément'] },
      { sentence: 'Le chien regarde la balle.', target: 'chien', question: 'Quel est le rôle de "chien" ?', correct: 'sujet', options: ['sujet', 'verbe', 'complément'] },
      { sentence: 'Léa mange une pomme.', target: 'pomme', question: 'Quel est le rôle de "pomme" ?', correct: 'complément', options: ['sujet', 'verbe', 'complément'] }
    ]
  }
];

window.ENQUETE_GRAMMATICALE_SETTINGS = {
  storageKey: 'gam_enquete_grammaticale',
  introText: 'Mène l’enquête grammaticale ! Lis la phrase, regarde le mot en surbrillance et choisis sa fonction. Es-tu prêt, détective ?'
};
