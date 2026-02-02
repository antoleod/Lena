export const sequencesGame = {
  id: 'sequences',
  title: 'Jeu des séquences',
  subtitle: 'Trouver le prochain élément.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'Rouge, Bleu, Rouge, Bleu, __', options: ['Rouge','Vert','Jaune'], answer: 'Rouge' },
      { prompt: 'Cercle, Carré, Cercle, Carré, __', options: ['Cercle','Triangle','Rectangle'], answer: 'Cercle' },
      { prompt: 'Petit, Grand, Petit, Grand, __', options: ['Petit','Grand','Moyen'], answer: 'Petit' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: '2, 5, 8, 11, __', options: ['14','13','15'], answer: '14' },
      { prompt: '10, 8, 6, 4, __', options: ['2','3','5'], answer: '2' },
      { prompt: 'A, C, E, __', options: ['G','F','H'], answer: 'G' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '3, 6, 12, 24, __', options: ['48','36','30'], answer: '48' },
      { prompt: '20, 25, 35, 50, __', options: ['70','65','60'], answer: '70' },
      { prompt: 'B, D, G, K, __', options: ['P','N','M'], answer: 'P' }
    ]}
  ]
};
