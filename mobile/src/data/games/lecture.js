export const lectureGame = {
  id: 'lecture',
  title: 'Lecture magique',
  subtitle: 'Comprendre une courte histoire.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'Texte: "Léa a un chat." Qui a un chat ?', options: ['Léa','Paul','Mia'], answer: 'Léa' },
      { prompt: 'Texte: "Le chien dort." Que fait le chien ?', options: ['Il dort','Il court','Il saute'], answer: 'Il dort' },
      { prompt: 'Texte: "Le soleil brille." Que fait le soleil ?', options: ['Il brille','Il pleut','Il neige'], answer: 'Il brille' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: 'Texte: "Tom lit un livre rouge." De quelle couleur est le livre ?', options: ['Rouge','Bleu','Vert'], answer: 'Rouge' },
      { prompt: 'Texte: "Mia va à l\'école en bus." Comment va Mia ?', options: ['En bus','À pied','En vélo'], answer: 'En bus' },
      { prompt: 'Texte: "Le chat mange une souris." Que mange le chat ?', options: ['Une souris','Un os','Une pomme'], answer: 'Une souris' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: 'Texte: "La classe prépare un spectacle demain." Quand aura lieu le spectacle ?', options: ['Demain','Aujourd\'hui','Hier'], answer: 'Demain' },
      { prompt: 'Texte: "Le train arrive en retard à 8h." À quelle heure arrive le train ?', options: ['8h','7h','9h'], answer: '8h' },
      { prompt: 'Texte: "Léa range ses cahiers puis elle joue." Que fait-elle après ?', options: ['Elle joue','Elle dort','Elle mange'], answer: 'Elle joue' }
    ]}
  ]
};
