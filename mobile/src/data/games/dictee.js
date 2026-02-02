export const dicteeGame = {
  id: 'dictee',
  title: 'Dictée magique',
  subtitle: 'Écoute et écris correctement.',
  levels: [
    {
      level: 1,
      grade: 2,
      exercises: [
        { prompt: 'Écris : chat', answer: 'chat', type: 'input', hint: 'Écoute et écris le mot.' },
        { prompt: 'Écris : lune', answer: 'lune', type: 'input' },
        { prompt: 'Écris : sac', answer: 'sac', type: 'input' },
        { prompt: 'Écris : ami', answer: 'ami', type: 'input' },
        { prompt: 'Écris : jour', answer: 'jour', type: 'input' }
      ]
    },
    {
      level: 2,
      grade: 2,
      exercises: [
        { prompt: 'Écris : école', answer: 'école', type: 'input' },
        { prompt: 'Écris : soleil', answer: 'soleil', type: 'input' },
        { prompt: 'Écris : robot', answer: 'robot', type: 'input' },
        { prompt: 'Écris : piano', answer: 'piano', type: 'input' },
        { prompt: 'Écris : maman', answer: 'maman', type: 'input' }
      ]
    },
    {
      level: 3,
      grade: 3,
      exercises: [
        { prompt: 'Écris : La lune brille fort.', answer: 'la lune brille fort.', type: 'input' },
        { prompt: 'Écris : Le pirate trouve un trésor.', answer: 'le pirate trouve un trésor.', type: 'input' },
        { prompt: 'Écris : Le chien court très vite.', answer: 'le chien court très vite.', type: 'input' },
        { prompt: 'Écris : La fée est gentille.', answer: 'la fée est gentille.', type: 'input' },
        { prompt: 'Écris : Le train arrive en retard.', answer: 'le train arrive en retard.', type: 'input' }
      ]
    },
    {
      level: 4,
      grade: 4,
      exercises: [
        { prompt: 'Écris : La petite fée prépare une potion magique.', answer: 'la petite fée prépare une potion magique.', type: 'input' },
        { prompt: 'Écris : La licorne traverse la forêt silencieuse.', answer: 'la licorne traverse la forêt silencieuse.', type: 'input' },
        { prompt: 'Écris : Le robot danse très bien sur la musique.', answer: 'le robot danse très bien sur la musique.', type: 'input' },
        { prompt: 'Écris : Le soleil chauffe la plage en été.', answer: 'le soleil chauffe la plage en été.', type: 'input' },
        { prompt: 'Écris : Léna dessine un arc-en-ciel coloré.', answer: 'léna dessine un arc-en-ciel coloré.', type: 'input' }
      ]
    }
  ]
};
