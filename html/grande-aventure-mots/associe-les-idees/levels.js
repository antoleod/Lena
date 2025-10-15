
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
  }
];

window.ASSOCIE_LES_IDEES_SETTINGS = {
  storageKey: 'gam_associe_les_idees',
  introText: 'Fais travailler tes méninges ! Pour chaque mot affiché, trouve celui qui lui est le mieux associé parmi les choix proposés.'
};
