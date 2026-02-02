
window.HISTOIRE_INTERACTIVE_LEVELS = [
  {
    id: 'niveau1',
    title: 'Niveau 1',
    badge: '⭐',
    subtitle: 'La forêt enchantée',
    description: 'Choisis les actions du héros pour créer ta propre histoire.',
    story: {
      start: 'debut',
      nodes: {
        debut: {
          text: 'Tu arrives devant une forêt enchantée. Un petit sentier part sur la gauche et une rivière coule sur la droite.',
          choices: [
            { text: 'Explorer le sentier', target: 'sentier' },
            { text: 'Suivre la rivière', target: 'riviere' }
          ]
        },
        sentier: {
          text: 'Au bout du sentier, tu découvres une cabane en bonbons. La porte est ouverte.',
          choices: [
            { text: 'Entrer dans la cabane', target: 'cabane' },
            { text: 'Continuer le chemin', target: 'continuer' }
          ]
        },
        riviere: {
          text: 'Un bateau magique t’attend. Il semble prêt à t’emmener quelque part.',
          choices: [
            { text: 'Monter dans le bateau', target: 'bateau' },
            { text: 'Marcher le long de la rive', target: 'marcher' }
          ]
        },
        cabane: { text: 'À l’intérieur, une gentille sorcière te prépare un délicieux goûter. FIN.', choices: [] },
        continuer: { text: 'Tu trouves un champ de fleurs qui chantent. C’est un endroit merveilleux pour se reposer. FIN.', choices: [] },
        bateau: { text: 'Le bateau t’emmène sur une île flottante où les animaux parlent. FIN.', choices: [] },
        marcher: { text: 'Tu découvres une cascade secrète derrière laquelle se cache un trésor. FIN.', choices: [] }
      }
    }
  },
  {
    id: 'niveau2',
    title: 'Niveau 2',
    badge: '📖',
    subtitle: 'Le château mystérieux',
    description: 'Une aventure avec passages secrets et petits dragons.',
    story: {
      start: 'portail',
      nodes: {
        portail: {
          text: 'Tu arrives devant un grand château. Un portail et une petite porte sont ouverts.',
          choices: [
            { text: 'Entrer par le portail', target: 'cour' },
            { text: 'Passer par la petite porte', target: 'cuisine' }
          ]
        },
        cour: {
          text: 'Dans la cour, un petit dragon dort près d’une fontaine.',
          choices: [
            { text: 'Réveiller doucement le dragon', target: 'dragon' },
            { text: 'Chercher une porte secrète', target: 'secret' }
          ]
        },
        cuisine: {
          text: 'La cuisine sent bon le gâteau. Une trappe mène à la cave.',
          choices: [
            { text: 'Goûter le gâteau', target: 'gateau' },
            { text: 'Descendre à la cave', target: 'cave' }
          ]
        },
        dragon: { text: 'Le dragon t’offre une plume magique. FIN.', choices: [] },
        secret: { text: 'Tu trouves un passage vers une salle aux trésors. FIN.', choices: [] },
        gateau: { text: 'Délicieux ! Le cuisinier te donne une boîte de biscuits. FIN.', choices: [] },
        cave: { text: 'Une lanterne te guide vers une carte mystérieuse. FIN.', choices: [] }
      }
    }
  }
];

window.HISTOIRE_INTERACTIVE_SETTINGS = {
  storageKey: 'gam_histoire_interactive',
  introText: 'C’est toi le héros ! Lis chaque partie de l’histoire, puis choisis ce que tu veux faire. Chaque choix crée une nouvelle aventure.'
};
