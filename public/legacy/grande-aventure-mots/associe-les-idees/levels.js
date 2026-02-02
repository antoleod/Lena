
window.ASSOCIE_LES_IDEES_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'Les paires logiques',
    description: 'Trouve le mot qui va avec le mot proposé.',
    exercises: [
      {
        prompt: 'chat',
        correct: 'souris',
        options: ['souris', 'poisson', 'os']
      },
      {
        prompt: 'chaussette',
        correct: 'chaussure',
        options: ['chaussure', 'gant', 'chapeau']
      },
      {
        prompt: 'marteau',
        correct: 'clou',
        options: ['clou', 'vis', 'planche']
      }
    ]
  },
  {
    id: 'niveau2',
    title: 'Niveau 2',
    badge: '🧩',
    subtitle: 'Paires du quotidien',
    description: 'Associe l’objet à ce qui va naturellement avec.',
    exercises: [
      { prompt: 'crayon', correct: 'papier', options: ['papier', 'ciseaux', 'colle'] },
      { prompt: 'clé', correct: 'porte', options: ['porte', 'fenêtre', 'chaise'] },
      { prompt: 'brosse', correct: 'cheveux', options: ['cheveux', 'chaussettes', 'vélo'] }
    ]
  }
];

window.ASSOCIE_LES_IDEES_SETTINGS = {
  storageKey: 'gam_associe_les_idees',
  introText: 'Fais travailler tes méninges ! Pour chaque mot affiché, trouve celui qui lui est le mieux associé parmi les choix proposés.'
};
