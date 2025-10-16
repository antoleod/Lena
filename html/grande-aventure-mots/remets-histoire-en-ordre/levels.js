
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
      },
      {
        title: 'Léna se prépare',
        steps: [
          { id: 'a', text: 'Léna se brosse les dents.' },
          { id: 'b', text: 'Elle se lave le visage.' },
          { id: 'c', text: 'Elle choisit ses vêtements.' },
          { id: 'd', text: 'Elle s'habille pour l'école.' }
        ]
      },
      {
        title: 'Départ pour l'école',
        steps: [
          { id: 'a', text: 'Léna met son manteau.' },
          { id: 'b', text: 'Elle prend son sac à dos.' },
          { id: 'c', text: 'Elle dit au revoir à ses parents.' },
          { id: 'd', text: 'Elle sort de la maison.' }
        ]
      }
    ]
  },
  {
    id: 'niveau2',
    title: 'Niveau 2',
    badge: '🚀',
    subtitle: 'L'après-midi à l'école',
    description: 'Remets dans l’ordre les images pour raconter ce que fait Léna à l’école.',
    exercises: [
      {
        title: 'La cantine',
        steps: [
          { id: 'a', text: 'Léna fait la queue à la cantine.' },
          { id: 'b', text: 'Elle prend un plateau.' },
          { id: 'c', text: 'Elle déjeune avec ses amis.' },
          { id: 'd', text: 'Elle débarrasse son plateau.' }
        ]
      },
      {
        title: 'La récréation',
        steps: [
          { id: 'a', text: 'La cloche sonne la fin des cours.' },
          { id: 'b', text: 'Léna sort dans la cour de récréation.' },
          { id: 'c', text: 'Elle joue à la marelle.' },
          { id: 'd', text: 'La récréation est terminée.' }
        ]
      },
      {
        title: 'En classe',
        steps: [
          { id: 'a', text: 'Léna écoute la maîtresse.' },
          { id: 'b', text: 'Elle lève la main pour poser une question.' },
          { id: 'c', text: 'Elle écrit dans son cahier.' },
          { id: 'd', text: 'Elle apprend une nouvelle poésie.' }
        ]
      }
    ]
  }
];

window.REMETS_HISTOIRE_SETTINGS = {
  storageKey: 'gam_remets_histoire',
  introText: 'Remets les images dans le bon ordre pour reconstituer l’histoire. Fais glisser les images pour les déplacer.'
};
