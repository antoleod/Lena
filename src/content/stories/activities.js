function createStoryActivity({
  id,
  slug,
  title,
  gradeBand,
  instructions,
  stories
}) {
  return {
    id,
    slug,
    title,
    subject: 'stories',
    subskill: 'reading-comprehension',
    gradeBand,
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 12,
    instructions,
    correctionType: 'story-quiz',
    hints: ['Tu peux relire avant de repondre.'],
    tags: ['histoires', 'comprehension', 'lecture'],
    accessibility: ['paragraphes courts', 'quiz simple'],
    originRepo: 'Lena+poeme',
    engineType: 'story'
  , stories };
}

export const storiesSubject = {
  id: 'stories',
  label: 'Histoires',
  description: 'Mini-recits, comprehension, lecture guidee et quiz de suivi.',
  color: '#8457e8',
  accent: '#e6ddff',
  grades: ['P2', 'P3'],
  roadmap: [
    'Ecoute ou lecture guidee',
    'Questions de comprehension',
    'Reperage des elements importants'
  ]
};

export const storyActivities = [
  createStoryActivity({
    id: 'magic-library',
    slug: 'bibliotheque-magique',
    title: 'Bibliotheque magique',
    gradeBand: ['P2', 'P3'],
    instructions: 'Lis l histoire puis reponds aux questions.',
    stories: [
      {
        id: 'foret-etoilee',
        title: 'La Foret Etoilee',
        theme: 'Aventure',
        duration: 2,
        text: [
          'Lena marche dans une foret douce et lumineuse.',
          'Des lucioles dessinent des etoiles tout autour d elle.',
          'Au loin, une chouette lui murmure de suivre la lumiere la plus brillante.'
        ],
        quiz: [
          {
            prompt: 'Que voit Lena autour d elle ?',
            choices: ['Des lucioles', 'Des dinosaures', 'Des voitures'],
            answer: 'Des lucioles',
            explanation: 'Ce sont les lucioles qui dessinent des etoiles.'
          },
          {
            prompt: 'Qui lui parle dans la foret ?',
            choices: ['Une chouette', 'Un renard', 'Une fee'],
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
          'Lena et Yaya preparent une potion magique dans la cuisine.',
          'Ils melangent du jus de pomme, de l eau petillante et un petale de rose.',
          'La potion est delicieuse et tout le monde rit.'
        ],
        quiz: [
          {
            prompt: 'Quels ingredients utilisent-ils ?',
            choices: ['Jus de pomme, eau petillante et rose', 'Lait et chocolat', 'Carottes et fromage'],
            answer: 'Jus de pomme, eau petillante et rose',
            explanation: 'La recette de la potion est donnee dans le deuxieme paragraphe.'
          }
        ]
      },
      {
        id: 'renard-peintre',
        title: 'Le Renard Peintre',
        theme: 'Creativite',
        duration: 1,
        text: [
          'Un petit renard trouve des pots de peinture dans la foret.',
          'Avec sa queue, il peint un arc-en-ciel sur une grande pierre.',
          'Tous les animaux viennent admirer son oeuvre.'
        ],
        quiz: [
          {
            prompt: 'Que peint le renard ?',
            choices: ['Un arc-en-ciel', 'Un bateau', 'Une ecole'],
            answer: 'Un arc-en-ciel',
            explanation: 'Le renard peint un arc-en-ciel.'
          }
        ]
      }
    ]
  }),
  createStoryActivity({
    id: 'forest-friends',
    slug: 'amis-de-la-foret',
    title: 'Amis de la foret',
    gradeBand: ['P2'],
    instructions: 'Lis un recit court et retrouve les details importants.',
    stories: [
      {
        id: 'lapin-courrier',
        title: 'Le Lapin Courrier',
        theme: 'Amitie',
        duration: 2,
        text: [
          'Un petit lapin distribue des lettres dans la foret.',
          'Il apporte un message joyeux a l ecureuil et une carte bleue au herisson.',
          'Le soir, tous les amis se retrouvent pres du grand chene.'
        ],
        quiz: [
          {
            prompt: 'A qui le lapin apporte-t-il un message joyeux ?',
            choices: ['A l ecureuil', 'Au renard', 'Au hibou'],
            answer: 'A l ecureuil',
            explanation: 'Le message joyeux est pour l ecureuil.'
          },
          {
            prompt: 'Ou les amis se retrouvent-ils le soir ?',
            choices: ['Pres du grand chene', 'Dans une grotte', 'Sur la riviere'],
            answer: 'Pres du grand chene',
            explanation: 'Ils se retrouvent pres du grand chene.'
          }
        ]
      }
    ]
  }),
  createStoryActivity({
    id: 'campfire-tales',
    slug: 'histoires-autour-du-feu',
    title: 'Histoires autour du feu',
    gradeBand: ['P3'],
    instructions: 'Lis un recit plus riche et reponds a des questions de comprehension.',
    stories: [
      {
        id: 'nuit-au-camp',
        title: 'La Nuit au Camp',
        theme: 'Aventure',
        duration: 3,
        text: [
          'Lena, Yaya et Milo installent leur camp pres d un lac tranquille.',
          'Quand la nuit tombe, ils allument un petit feu et racontent des histoires de voyage.',
          'Milo entend un bruit dans les buissons, mais ce n est qu un herisson curieux.',
          'Tout le monde rit, puis les amis regardent les etoiles avant de dormir.'
        ],
        quiz: [
          {
            prompt: 'Ou les amis installent-ils leur camp ?',
            choices: ['Pres d un lac', 'Dans une ville', 'Sous la mer'],
            answer: 'Pres d un lac',
            explanation: 'Le camp est installe pres d un lac tranquille.'
          },
          {
            prompt: 'Quel animal fait du bruit dans les buissons ?',
            choices: ['Un herisson', 'Un loup', 'Un poisson'],
            answer: 'Un herisson',
            explanation: 'Le bruit vient d un herisson curieux.'
          }
        ]
      }
    ]
  }),
  createStoryActivity({
    id: 'castle-chronicles',
    slug: 'chroniques-du-chateau',
    title: 'Chroniques du chateau',
    gradeBand: ['P3'],
    instructions: 'Lis une histoire et cherche ce qui est dit clairement ou laisse deviner.',
    stories: [
      {
        id: 'clef-doree',
        title: 'La Clef Doree',
        theme: 'Mystere',
        duration: 3,
        text: [
          'Dans un vieux chateau pastel, Lena trouve une petite clef doree sous un coussin.',
          'Avec Yaya, elle suit un couloir silencieux jusqu a une porte ronde.',
          'La porte s ouvre sur une salle remplie de livres, de cartes et d instruments anciens.',
          'Les enfants comprennent que cette salle servait autrefois a preparer de grands voyages.'
        ],
        quiz: [
          {
            prompt: 'Ou Lena trouve-t-elle la clef doree ?',
            choices: ['Sous un coussin', 'Sous la table', 'Dans le jardin'],
            answer: 'Sous un coussin',
            explanation: 'La clef est cachee sous un coussin.'
          },
          {
            prompt: 'A quoi servait la salle secrete ?',
            choices: ['A preparer de grands voyages', 'A faire la cuisine', 'A ranger des animaux'],
            answer: 'A preparer de grands voyages',
            explanation: 'Les indices montrent qu elle servait a preparer des voyages.'
          }
        ]
      }
    ]
  })
];
