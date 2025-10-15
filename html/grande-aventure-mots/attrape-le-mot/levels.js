
window.ATTRAPE_LE_MOT_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'Mots courants',
    description: 'Écoute le mot et clique dessus le plus vite possible.',
    exercises: [
      { correct: 'chat', options: ['chat', 'chien', 'maison', 'soleil'] },
      { correct: 'voiture', options: ['voiture', 'arbre', 'fleur', 'lune'] },
      { correct: 'pomme', options: ['pomme', 'banane', 'orange', 'fraise'] }
    ]
  }
];

window.ATTRAPE_LE_MOT_SETTINGS = {
  storageKey: 'gam_attrape_le_mot',
  introText: 'Écoute le mot et clique sur le bon mot qui s’affiche à l’écran. Sois rapide, les mots peuvent disparaître !'
};
