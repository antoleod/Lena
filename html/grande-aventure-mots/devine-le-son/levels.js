
window.DEVINE_LE_SON_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'Les animaux de la ferme',
    description: 'Écoute le son et devine quel animal le produit.',
    exercises: [
      {
        sound: '../../../../assets/sounds/animals/cow.mp3',
        correct: 'vache',
        options: [
          { word: 'vache', emoji: '🐮' },
          { word: 'mouton', emoji: '🐑' },
          { word: 'cheval', emoji: '🐴' }
        ]
      },
      {
        sound: '../../../../assets/sounds/animals/pig.mp3',
        correct: 'cochon',
        options: [
          { word: 'cochon', emoji: '🐷' },
          { word: 'poule', emoji: '🐔' },
          { word: 'canard', emoji: '🦆' }
        ]
      }
    ]
  }
];

window.DEVINE_LE_SON_SETTINGS = {
  storageKey: 'gam_devine_le_son',
  introText: 'Écoute attentivement le son, puis choisis l’image qui correspond. Chaque son est un indice pour trouver la bonne réponse !'
};
