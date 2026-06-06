export const histoireSubject = {
  id: 'histoire',
  label: 'Histoire & Geographie',
  description: 'La Belgique, l\'Europe, les grandes civilisations et la geographie mondiale.',
  color: '#f59e0b',
  accent: '#fde68a',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Ma ville, ma region, mon pays',
    'La Belgique et ses regions',
    'L\'Europe et ses voisins',
    'Les grandes civilisations',
    'Le monde contemporain',
  ],
};

function createHistoireActivity({ id, slug, title, gradeBand, topic, instructions, hints = [] }) {
  return {
    id, slug, title, subject: 'histoire', subskill: topic, gradeBand,
    language: 'fr', difficulty: 'progressive', estimatedDurationMin: 10,
    instructions, correctionType: 'multiple-choice', hints,
    tags: ['histoire', topic], accessibility: ['one step at a time', 'clear answers'],
    engineType: 'multiple-choice',
    generatorConfig: {
      grade: gradeBand[0], topic, language: 'fr', difficulty: 'normal',
      sections: [
        { id: 'practice', title: 'Exploration', kind: 'practice', description: 'Questions d\'exploration.', count: 8 },
        { id: 'exam', title: 'Mini quiz', kind: 'exam', description: 'Quiz rapide.', count: 4 },
      ],
    },
  };
}

export const histoireActivities = [
  createHistoireActivity({ id: 'hist-belgium-p2', slug: 'belgique-p2', title: 'Ma Belgique P2', gradeBand: ['P2'], topic: 'belgium', instructions: 'Les symboles de la Belgique: drapeau, capitale, langues.', hints: ['La capitale de la Belgique est Bruxelles.'] }),
  createHistoireActivity({ id: 'hist-regions-p2', slug: 'regions-p2', title: 'Regions de Belgique P2', gradeBand: ['P2'], topic: 'regions', instructions: 'Wallonie, Flandre et Bruxelles.', hints: ['3 regions en Belgique.'] }),
  createHistoireActivity({ id: 'hist-europe-p3', slug: 'europe-p3', title: 'L\'Europe P3', gradeBand: ['P3'], topic: 'europe', instructions: 'Les pays voisins de la Belgique et leurs capitales.', hints: ['France, Allemagne, Pays-Bas, Luxembourg.'] }),
  createHistoireActivity({ id: 'hist-timeline-p3', slug: 'frise-chronologique-p3', title: 'Frise chronologique P3', gradeBand: ['P3'], topic: 'timeline', instructions: 'Lire et placer des evenements sur une frise.', hints: ['Avant Jesus-Christ = av. J.-C., apres = apr. J.-C.'] }),
  createHistoireActivity({ id: 'hist-ancient-p4', slug: 'antiquite-p4', title: 'Antiquite P4', gradeBand: ['P4'], topic: 'ancient-history', instructions: 'Egypte ancienne, Grece et Rome antique.', hints: ['Les pyramides = Egypte, le Colisee = Rome.'] }),
  createHistoireActivity({ id: 'hist-medieval-p4', slug: 'moyen-age-p4', title: 'Moyen Age P4', gradeBand: ['P4'], topic: 'medieval', instructions: 'Chateaux, chevaliers et vie medievale.', hints: ['Le Moyen Age: de 476 a 1492.'] }),
  createHistoireActivity({ id: 'hist-world-geo-p5', slug: 'geographie-mondiale-p5', title: 'Geographie mondiale P5', gradeBand: ['P5'], topic: 'world-geography', instructions: 'Les continents, oceans et grandes villes du monde.', hints: ['7 continents, 5 oceans.'] }),
  createHistoireActivity({ id: 'hist-modern-p5', slug: 'epoque-moderne-p5', title: 'Epoque moderne P5', gradeBand: ['P5'], topic: 'modern-history', instructions: 'Grandes decouvertes, Renaissance et Revolution.', hints: ['Christophe Colomb en 1492.'] }),
  createHistoireActivity({ id: 'hist-contemporary-p6', slug: 'epoque-contemporaine-p6', title: 'Monde contemporain P6', gradeBand: ['P6'], topic: 'contemporary', instructions: 'La Premiere et Deuxieme Guerre mondiale, la construction de l\'Europe.', hints: ['L\'UE a ete fondee en 1957.'] }),
  createHistoireActivity({ id: 'hist-citizenship-p6', slug: 'citoyennete-p6', title: 'Citoyennete P6', gradeBand: ['P6'], topic: 'citizenship', instructions: 'Democratie, droits de l\'enfant et institutions belges.', hints: ['Les droits de l\'enfant: ONU 1989.'] }),
];
