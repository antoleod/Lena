export const motsOutilsGame = {
  id: 'mots-outils',
  title: 'Mots-outils',
  subtitle: 'Choisir le bon mot.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'Choisis : "Je ___ un livre."', options: ['lis','lit','lire'], answer: 'lis' },
      { prompt: 'Choisis : "Tu ___ à l\'école."', options: ['vas','va','vont'], answer: 'vas' },
      { prompt: 'Choisis : "Nous ___ contents."', options: ['sommes','es','est'], answer: 'sommes' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: 'Choisis : "Elle ___ une pomme."', options: ['mange','manges','mangent'], answer: 'mange' },
      { prompt: 'Choisis : "Ils ___ au parc."', options: ['vont','va','vas'], answer: 'vont' },
      { prompt: 'Choisis : "Vous ___ un jeu."', options: ['jouez','joue','jouent'], answer: 'jouez' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: 'Choisis : "Le chat ___ petit."', options: ['est','sont','êtes'], answer: 'est' },
      { prompt: 'Choisis : "Les filles ___ contentes."', options: ['sont','est','sommes'], answer: 'sont' },
      { prompt: 'Choisis : "Tu ___ rapide."', options: ['es','est','sont'], answer: 'es' }
    ]}
  ]
};
