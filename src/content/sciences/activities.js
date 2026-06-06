export const sciencesSubject = {
  id: 'sciences',
  label: 'Sciences',
  description: 'Le corps humain, les animaux, les plantes et les phenomenes naturels.',
  color: '#22c55e',
  accent: '#bbf7d0',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Le corps humain et les 5 sens',
    'Les animaux et leur milieu',
    'Les plantes et la photosynthese',
    'La matiere, l\'eau et l\'air',
    'Les forces et l\'energie',
  ],
};

function createScienceActivity({ id, slug, title, gradeBand, topic, instructions, hints = [] }) {
  return {
    id,
    slug,
    title,
    subject: 'sciences',
    subskill: topic,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['sciences', topic],
    accessibility: ['one step at a time', 'clear answers'],
    engineType: 'multiple-choice',
    generatorConfig: {
      grade: gradeBand[0],
      topic,
      language: 'fr',
      difficulty: 'normal',
      sections: [
        { id: 'practice', title: 'Decouverte', kind: 'practice', description: 'Questions de decouverte.', count: 8 },
        { id: 'exam', title: 'Mini quiz', kind: 'exam', description: 'Verifie ce que tu as retenu.', count: 4 },
      ],
    },
  };
}

export const sciencesActivities = [
  createScienceActivity({ id: 'sci-body-p2', slug: 'corps-humain-p2', title: 'Le corps humain P2', gradeBand: ['P2'], topic: 'body', instructions: 'Les parties du corps et les 5 sens.', hints: ['Toucher, vue, odorat, ouie, gout.'] }),
  createScienceActivity({ id: 'sci-animals-p2', slug: 'animaux-p2', title: 'Les animaux P2', gradeBand: ['P2'], topic: 'animals', instructions: 'Reconnaitre les animaux et leur nourriture.', hints: ['Herbivore, carnivore ou omnivore ?'] }),
  createScienceActivity({ id: 'sci-plants-p3', slug: 'plantes-p3', title: 'Les plantes P3', gradeBand: ['P3'], topic: 'plants', instructions: 'Les parties d\'une plante et la photosynthese.', hints: ['Racine, tige, feuille, fleur.'] }),
  createScienceActivity({ id: 'sci-water-p3', slug: 'eau-p3', title: 'L\'eau P3', gradeBand: ['P3'], topic: 'water', instructions: 'Le cycle de l\'eau et ses etats.', hints: ['Solide, liquide, gazeux.'] }),
  createScienceActivity({ id: 'sci-matter-p4', slug: 'matiere-p4', title: 'La matiere P4', gradeBand: ['P4'], topic: 'matter', instructions: 'Les etats de la matiere et les changements physiques.', hints: ['Fusion, evaporation, solidification.'] }),
  createScienceActivity({ id: 'sci-ecosystems-p4', slug: 'ecosystemes-p4', title: 'Les ecosystemes P4', gradeBand: ['P4'], topic: 'ecosystems', instructions: 'Chaines alimentaires et milieux de vie.', hints: ['Producteur -> consommateur -> decomposeur.'] }),
  createScienceActivity({ id: 'sci-forces-p5', slug: 'forces-p5', title: 'Forces et mouvements P5', gradeBand: ['P5'], topic: 'forces', instructions: 'Gravite, frottement et forces simples.', hints: ['La gravite attire les objets vers le bas.'] }),
  createScienceActivity({ id: 'sci-human-body-p5', slug: 'systemes-corps-p5', title: 'Systemes du corps P5', gradeBand: ['P5'], topic: 'body-systems', instructions: 'Appareil digestif, circulatoire et respiratoire.', hints: ['Le coeur pompe le sang.'] }),
  createScienceActivity({ id: 'sci-energy-p6', slug: 'energie-p6', title: 'L\'energie P6', gradeBand: ['P6'], topic: 'energy', instructions: 'Formes d\'energie: electrique, thermique, lumineuse.', hints: ['L\'energie peut se transformer mais pas disparaitre.'] }),
  createScienceActivity({ id: 'sci-environment-p6', slug: 'environnement-p6', title: 'Environnement et ecologie P6', gradeBand: ['P6'], topic: 'environment', instructions: 'Developpement durable, pollution et solutions.', hints: ['Reduire, reutiliser, recycler.'] }),
];
