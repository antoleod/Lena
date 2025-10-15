
window.REMETS_HISTOIRE_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'Actions du matin',
    description: 'Remets dans l’ordre les images pour raconter ce que fait Léna le matin.',
    exercises: [
      {
        title: 'Le réveil de Léna',
        steps: [
          { id: 'a', text: 'Léna dort encore profondément.' },
          { id: 'b', text: 'Le réveil sonne, il est l’heure de se lever.' },
          { id: 'c', text: 'Elle s’étire et ouvre les yeux.' },
          { id: 'd', text: 'Léna est prête à commencer la journée.' }
        ]
      },
      {
        title: 'Le petit-déjeuner',
        steps: [
          { id: 'a', text: 'Léna s’assoit à table.' },
          { id: 'b', text: 'Elle mange des céréales avec du lait.' },
          { id: 'c', text: 'Elle boit un grand verre de jus d’orange.' },
          { id: 'd', text: 'Léna a bien mangé, elle est pleine d’énergie.' }
        ]
      }
    ]
  }
];

window.REMETS_HISTOIRE_SETTINGS = {
  storageKey: 'gam_remets_histoire',
  introText: 'Remets les images dans le bon ordre pour reconstituer l’histoire. Fais glisser les images pour les déplacer.'
};
