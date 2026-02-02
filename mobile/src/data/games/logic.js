export const logicGame = {
  id: 'logic',
  title: 'Logique & Raisonnement',
  subtitle: 'Trouver l\'intrus et la règle.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'Quel mot est l\'intrus ?', options: ['chat','chien','pomme'], answer: 'pomme' },
      { prompt: 'Quel mot est l\'intrus ?', options: ['rouge','bleu','banane'], answer: 'banane' },
      { prompt: 'Quel mot est l\'intrus ?', options: ['carré','rond','table'], answer: 'table' },
      { prompt: 'Quel mot est l\'intrus ?', options: ['hiver','été','chaise'], answer: 'chaise' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: 'Quelle forme complète la suite ? ? ? ? ? ? __', options: ['?','?','?'], answer: '?' },
      { prompt: 'Quelle est la règle ? 2, 4, 6, 8', options: ['+2','+3','×2'], answer: '+2' },
      { prompt: 'Quel est l\'intrus ?', options: ['carotte','pomme','patate','chapeau'], answer: 'chapeau' },
      { prompt: 'Quel est l\'intrus ?', options: ['lundi','mardi','samedi','chaise'], answer: 'chaise' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: 'Règle : 3, 6, 12, 24. Prochaine ?', options: ['48','36','30'], answer: '48' },
      { prompt: 'Quel mot est l\'intrus ?', options: ['triangle','cercle','rectangle','banane'], answer: 'banane' },
      { prompt: 'Complète : A, C, E, G, __', options: ['I','H','J'], answer: 'I' },
      { prompt: 'Règle : 10, 7, 4, 1, __', options: ['-2','-3','0'], answer: '0' }
    ]}
  ]
};
