export const storiesSubject = {
  id: 'stories',
  label: 'Histoires',
  description: 'Mini-récits, compréhension, lecture guidée et quiz de suivi.',
  color: '#8457e8',
  accent: '#e6ddff',
  grades: ['P2', 'P3'],
  roadmap: [
    'Écoute ou lecture guidée',
    'Questions de compréhension',
    'Repérage des éléments importants'
  ]
};

export const storyActivities = [
  {
    id: 'magic-library',
    slug: 'bibliotheque-magique',
    title: 'Bibliothèque magique',
    subject: 'stories',
    subskill: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 12,
    instructions: 'Lis l’histoire puis réponds aux questions.',
    correctionType: 'story-quiz',
    hints: ['Tu peux relire avant de répondre.'],
    tags: ['histoires', 'compréhension', 'lecture'],
    accessibility: ['paragraphes courts', 'quiz simple'],
    originRepo: 'Lena+poeme',
    engineType: 'story',
    featured: true,
    stories: [
      {
        id: 'foret-etoilee',
        title: 'La Forêt Étoilée',
        theme: 'Aventure',
        duration: 2,
        text: [
          'Léna marche dans une forêt douce et lumineuse.',
          'Des lucioles dessinent des étoiles tout autour d’elle.',
          'Au loin, une chouette lui murmure de suivre la lumière la plus brillante.'
        ],
        quiz: [
          {
            prompt: 'Que voit Léna autour d’elle ?',
            choices: ['Des lucioles', 'Des dinosaures', 'Des voitures'],
            answer: 'Des lucioles',
            explanation: 'Ce sont les lucioles qui dessinent des étoiles.'
          },
          {
            prompt: 'Qui lui parle dans la forêt ?',
            choices: ['Une chouette', 'Un renard', 'Une fée'],
            answer: 'Une chouette',
            explanation: 'La chouette lui murmure un conseil.'
          }
        ]
      },
      {
        id: 'potion-de-rire',
        title: 'La Potion de Rire',
        theme: 'Humour',
        duration: 2,
        text: [
          'Léna et Yaya préparent une potion magique dans la cuisine.',
          'Ils mélangent du jus de pomme, de l’eau pétillante et un pétale de rose.',
          'La potion est délicieuse et tout le monde rit.'
        ],
        quiz: [
          {
            prompt: 'Quels ingrédients utilisent-ils ?',
            choices: ['Jus de pomme, eau pétillante et rose', 'Lait et chocolat', 'Carottes et fromage'],
            answer: 'Jus de pomme, eau pétillante et rose',
            explanation: 'La recette de la potion est donnée dans le deuxième paragraphe.'
          }
        ]
      },
      {
        id: 'renard-peintre',
        title: 'Le Renard Peintre',
        theme: 'Créativité',
        duration: 1,
        text: [
          'Un petit renard trouve des pots de peinture dans la forêt.',
          'Avec sa queue, il peint un arc-en-ciel sur une grande pierre.',
          'Tous les animaux viennent admirer son œuvre.'
        ],
        quiz: [
          {
            prompt: 'Que peint le renard ?',
            choices: ['Un arc-en-ciel', 'Un bateau', 'Une école'],
            answer: 'Un arc-en-ciel',
            explanation: 'Le renard peint un arc-en-ciel.'
          }
        ]
      }
    ]
  }
];
