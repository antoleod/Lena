import { defineMission, defineWorld } from '../../shared/types/index.js';

function mission(order, title, activityIds, description = '') {
  return {
    order,
    title,
    activityIds,
    description
  };
}

function world({ id, order, title, icon, theme, description, gradeIds, subjectIds, missions }) {
  return {
    id,
    order,
    title,
    icon,
    theme,
    description,
    gradeIds,
    subjectIds,
    missions
  };
}

const WORLD_SPECS = [
  world({
    id: 'world-1',
    order: 1,
    title: 'Premiers pas',
    icon: '1',
    theme: 'forest',
    description: 'Premiers nombres, premiers mots et premiers succes.',
    gradeIds: ['P2'],
    subjectIds: ['mathematics', 'french'],
    missions: [
      mission(1, 'Compter et construire', ['build-number', 'place-value', 'generated-comparison-p2']),
      mission(2, 'Comparer et lire', ['place-value', 'generated-comparison-p2', 'build-number']),
      mission(3, 'Premieres additions', ['generated-addition-p2', 'number-line']),
      mission(4, 'Premieres soustractions', ['generated-subtraction-p2', 'number-line']),
      mission(5, 'Images et mots', ['associe-image-mot', 'phrase-a-trous']),
      mission(6, 'Lire la bonne phrase', ['phrase-a-trous', 'intrus-lecture']),
      mission(7, 'Petits problemes', ['generated-word-problems', 'number-line']),
      mission(8, 'Suites douces', ['generated-logic-sequences', 'generated-comparison-p2']),
      mission(9, 'Revision nombres', ['build-number', 'place-value', 'generated-addition-p2']),
      mission(10, 'Defi de depart', ['generated-addition-p2', 'associe-image-mot', 'generated-word-problems'])
    ]
  }),
  world({
    id: 'world-2',
    order: 2,
    title: 'Nombres et mots',
    icon: '2',
    theme: 'village',
    description: 'On assemble des nombres et du vocabulaire.',
    gradeIds: ['P2'],
    subjectIds: ['mathematics', 'french', 'dutch'],
    missions: [
      mission(1, 'Valeur de position', ['place-value', 'build-number']),
      mission(2, 'Bonds numeriques', ['number-line', 'generated-addition-p2', 'generated-subtraction-p2']),
      mission(3, 'Mots de l ecole', ['associe-image-mot', 'dutch-school-words']),
      mission(4, 'Associer image et mot', ['associe-image-mot', 'dutch-picture-words']),
      mission(5, 'Phrases simples', ['phrase-a-trous', 'generated-french-sentences']),
      mission(6, 'Premiers mots neerlandais', ['dutch-school-words', 'generated-dutch-vocabulary']),
      mission(7, 'Observer et choisir', ['intrus-lecture', 'generated-comparison-p2']),
      mission(8, 'Calcul et lecture', ['generated-addition-p2', 'associe-image-mot']),
      mission(9, 'Petites histoires de mots', ['generated-french-reading', 'generated-dutch-reading']),
      mission(10, 'Mission melangee', ['place-value', 'generated-dutch-vocabulary', 'generated-french-sentences'])
    ]
  }),
  world({
    id: 'world-3',
    order: 3,
    title: 'Vie quotidienne',
    icon: '3',
    theme: 'city',
    description: 'Vocabulaire, situations du quotidien et calcul utile.',
    gradeIds: ['P2'],
    subjectIds: ['mathematics', 'english', 'spanish'],
    missions: [
      mission(1, 'Courses et quantites', ['generated-word-problems', 'generated-addition-p2']),
      mission(2, 'Maison et objets', ['generated-english-vocabulary', 'generated-spanish-vocabulary']),
      mission(3, 'Compter dans la vie', ['generated-comparison-p2', 'generated-subtraction-p2']),
      mission(4, 'Premieres lectures', ['generated-english-reading', 'generated-spanish-reading']),
      mission(5, 'Questions du quotidien', ['generated-word-problems', 'generated-english-reading']),
      mission(6, 'Lire une consigne', ['generated-english-vocabulary', 'generated-spanish-vocabulary']),
      mission(7, 'Choisir la bonne reponse', ['generated-comparison-p2', 'generated-english-reading']),
      mission(8, 'Petits dialogues', ['generated-english-reading', 'generated-spanish-reading']),
      mission(9, 'Calcul rapide du jour', ['generated-addition-p2', 'generated-subtraction-p2']),
      mission(10, 'Ville complete', ['generated-word-problems', 'generated-english-vocabulary', 'generated-spanish-vocabulary'])
    ]
  }),
  world({
    id: 'world-4',
    order: 4,
    title: 'Lire et comprendre',
    icon: '4',
    theme: 'explorer',
    description: 'Recits courts, lecture attentive et comprehension.',
    gradeIds: ['P2', 'P3'],
    subjectIds: ['french', 'stories'],
    missions: [
      mission(1, 'Mots et images', ['associe-image-mot', 'generated-french-reading']),
      mission(2, 'Completer une phrase', ['phrase-a-trous', 'generated-french-sentences']),
      mission(3, 'Lire un recit', ['magic-library', 'generated-french-reading']),
      mission(4, 'Trouver les indices', ['generated-french-reading', 'intrus-lecture']),
      mission(5, 'Histoires magiques', ['magic-library']),
      mission(6, 'Comprendre le texte', ['generated-french-reading', 'magic-library']),
      mission(7, 'Lire entre les lignes', ['generated-french-reading', 'possessives']),
      mission(8, 'Choisir le bon mot', ['phrase-a-trous', 'intrus-lecture']),
      mission(9, 'Recit et questions', ['magic-library', 'generated-french-reading']),
      mission(10, 'Grande lecture', ['magic-library', 'generated-french-reading', 'generated-french-sentences'])
    ]
  }),
  world({
    id: 'world-5',
    order: 5,
    title: 'Logique douce',
    icon: '5',
    theme: 'laboratory',
    description: 'Suites, intrus, raisonnement et petits defis.',
    gradeIds: ['P2', 'P3'],
    subjectIds: ['reasoning', 'mathematics'],
    missions: [
      mission(1, 'Suites simples', ['generated-logic-sequences', 'generated-reasoning-p2']),
      mission(2, 'Chercher la regle', ['generated-logic-sequences', 'generated-reasoning-p3']),
      mission(3, 'Classer et choisir', ['generated-reasoning-p2', 'generated-comparison-p2']),
      mission(4, 'Observer avant d agir', ['generated-reasoning-p3', 'generated-word-problems']),
      mission(5, 'Memoire douce', ['generated-reasoning-p2', 'generated-reasoning-p3']),
      mission(6, 'Mini deduction', ['generated-reasoning-p3', 'generated-logic-sequences']),
      mission(7, 'Problemes logiques', ['generated-word-problems', 'generated-reasoning-p3']),
      mission(8, 'Calcul raisonne', ['generated-comparison-p2', 'generated-logic-sequences']),
      mission(9, 'Serie avancee', ['generated-reasoning-p3', 'generated-reasoning-p2']),
      mission(10, 'Defi logique', ['generated-reasoning-p3', 'generated-word-problems', 'generated-logic-sequences'])
    ]
  }),
  world({
    id: 'world-6',
    order: 6,
    title: 'Calcul rapide',
    icon: '6',
    theme: 'science',
    description: 'Multiplication, division et automatisation progressive.',
    gradeIds: ['P3'],
    subjectIds: ['mathematics'],
    missions: [
      mission(1, 'Table du 2', ['multiplication-table-2']),
      mission(2, 'Multiplier vite', ['generated-multiplication-p3', 'multiplication-table-2']),
      mission(3, 'Familles d operations', ['mult-div-families', 'generated-multiplication-p3']),
      mission(4, 'Problemes a groupes', ['word-problems', 'generated-multiplication-p3']),
      mission(5, 'Comparer et calculer', ['generated-comparison-p2', 'generated-multiplication-p3']),
      mission(6, 'Calcul mental', ['generated-multiplication-p3', 'number-line']),
      mission(7, 'Multiplier et comprendre', ['mult-div-families', 'word-problems']),
      mission(8, 'Defi de rapidite', ['generated-multiplication-p3', 'multiplication-table-2']),
      mission(9, 'Calculs melanges', ['mult-div-families', 'generated-word-problems']),
      mission(10, 'Mission calcul', ['multiplication-table-2', 'generated-multiplication-p3', 'mult-div-families'])
    ]
  }),
  world({
    id: 'world-7',
    order: 7,
    title: 'Langues du monde',
    icon: '7',
    theme: 'island',
    description: 'Neerlandais, anglais et espagnol en progression.',
    gradeIds: ['P3', 'P4'],
    subjectIds: ['dutch', 'english', 'spanish'],
    missions: [
      mission(1, 'Mots utiles NL', ['generated-dutch-vocabulary', 'dutch-school-words']),
      mission(2, 'Mots utiles EN', ['generated-english-vocabulary', 'generated-english-reading']),
      mission(3, 'Mots utiles ES', ['generated-spanish-vocabulary', 'generated-spanish-reading']),
      mission(4, 'Lire en neerlandais', ['generated-dutch-reading', 'dutch-picture-words']),
      mission(5, 'Lire en anglais', ['generated-english-reading', 'generated-english-vocabulary']),
      mission(6, 'Lire en espagnol', ['generated-spanish-reading', 'generated-spanish-vocabulary']),
      mission(7, 'Phrases neerlandaises', ['generated-dutch-sentences-p4', 'generated-dutch-reading']),
      mission(8, 'Phrases anglaises', ['generated-english-sentences-p4', 'generated-english-reading']),
      mission(9, 'Phrases espagnoles', ['generated-spanish-sentences-p4', 'generated-spanish-reading']),
      mission(10, 'Tour du monde', ['generated-dutch-vocabulary', 'generated-english-vocabulary', 'generated-spanish-vocabulary'])
    ]
  }),
  world({
    id: 'world-8',
    order: 8,
    title: 'Multiplications',
    icon: '8',
    theme: 'mountain',
    description: 'Tables, liens et premieres divisions.',
    gradeIds: ['P3', 'P4'],
    subjectIds: ['mathematics'],
    missions: [
      mission(1, 'Entrer dans les tables', ['multiplication-table-2', 'generated-multiplication-p3']),
      mission(2, 'Rythme des tables', ['generated-multiplication-p3', 'mult-div-families']),
      mission(3, 'Produits et paquets', ['generated-multiplication-p3', 'word-problems']),
      mission(4, 'Familles et liens', ['mult-div-families', 'generated-division-p4']),
      mission(5, 'Premieres divisions', ['generated-division-p4', 'mult-div-families']),
      mission(6, 'Problemes multiplicatifs', ['word-problems', 'generated-division-p4']),
      mission(7, 'Calcul sans erreur', ['generated-multiplication-p3', 'generated-division-p4']),
      mission(8, 'Observer le schema', ['mult-div-families', 'generated-comparison-p2']),
      mission(9, 'Defi des tables', ['multiplication-table-2', 'generated-multiplication-p3']),
      mission(10, 'Sommet des multiplications', ['multiplication-table-2', 'generated-multiplication-p3', 'generated-division-p4'])
    ]
  }),
  world({
    id: 'world-9',
    order: 9,
    title: 'Problemes et strategie',
    icon: '9',
    theme: 'city',
    description: 'Problemes plus longs, strategie et logique combinee.',
    gradeIds: ['P3', 'P4', 'P5'],
    subjectIds: ['mathematics', 'reasoning'],
    missions: [
      mission(1, 'Lire le probleme', ['generated-word-problems', 'word-problems']),
      mission(2, 'Choisir la bonne operation', ['word-problems', 'generated-multiplication-p3']),
      mission(3, 'Problemes a etapes', ['generated-word-problems', 'generated-division-p4']),
      mission(4, 'Penser avant d agir', ['generated-reasoning-p3', 'generated-reasoning-p4']),
      mission(5, 'Strategie simple', ['generated-reasoning-p4', 'generated-word-problems']),
      mission(6, 'Problemes et logique', ['generated-reasoning-p3', 'word-problems']),
      mission(7, 'Diviser et verifier', ['generated-division-p4', 'generated-reasoning-p4']),
      mission(8, 'Comparer des solutions', ['generated-comparison-p2', 'generated-word-problems']),
      mission(9, 'Missions combinees', ['generated-reasoning-p4', 'generated-division-p4']),
      mission(10, 'Grande strategie', ['generated-word-problems', 'generated-reasoning-p4', 'generated-division-p4'])
    ]
  }),
  world({
    id: 'world-10',
    order: 10,
    title: 'Precision',
    icon: '10',
    theme: 'sky',
    description: 'Langues et lecture plus fines en P4/P5.',
    gradeIds: ['P4', 'P5'],
    subjectIds: ['french', 'english', 'spanish'],
    missions: [
      mission(1, 'Lecture active FR', ['generated-french-reading-p4', 'generated-french-sentences']),
      mission(2, 'Langue precise FR', ['generated-french-reading-p4', 'generated-french-language-p6']),
      mission(3, 'Reading precision EN', ['generated-english-reading', 'generated-english-sentences-p4']),
      mission(4, 'Sentence focus EN', ['generated-english-sentences-p4', 'generated-english-reading']),
      mission(5, 'Lectura precisa ES', ['generated-spanish-reading', 'generated-spanish-sentences-p4']),
      mission(6, 'Frases precisas ES', ['generated-spanish-sentences-p4', 'generated-spanish-reading']),
      mission(7, 'Comparar textos', ['generated-french-reading-p4', 'generated-english-reading']),
      mission(8, 'Choisir la bonne forme', ['generated-french-language-p6', 'generated-spanish-sentences-p4']),
      mission(9, 'Lire et repondre', ['generated-french-reading-p4', 'generated-english-reading', 'generated-spanish-reading']),
      mission(10, 'Mission precision', ['generated-french-reading-p4', 'generated-english-sentences-p4', 'generated-spanish-sentences-p4'])
    ]
  }),
  world({
    id: 'world-11',
    order: 11,
    title: 'Maitrise',
    icon: '11',
    theme: 'stars',
    description: 'Consolidation avancee et entrainement mixte.',
    gradeIds: ['P5', 'P6'],
    subjectIds: ['mathematics', 'reasoning', 'stories'],
    missions: [
      mission(1, 'Fractions essentielles', ['generated-fractions-p4', 'generated-decimals-p5']),
      mission(2, 'Decimaux utiles', ['generated-decimals-p5', 'generated-mixed-operations-p6']),
      mission(3, 'Operations mixtes', ['generated-mixed-operations-p6', 'generated-division-p4']),
      mission(4, 'Raisonnement avance', ['generated-reasoning-p6', 'generated-reasoning-p4']),
      mission(5, 'Lire pour maitriser', ['magic-library', 'generated-french-reading-p4']),
      mission(6, 'Calcul de maitrise', ['generated-mixed-operations-p6', 'generated-decimals-p5']),
      mission(7, 'Problemes experts', ['generated-word-problems', 'generated-reasoning-p6']),
      mission(8, 'Logique et lecture', ['generated-reasoning-p6', 'magic-library']),
      mission(9, 'Fractions et sens', ['generated-fractions-p4', 'generated-word-problems']),
      mission(10, 'Sommet de maitrise', ['generated-mixed-operations-p6', 'generated-reasoning-p6', 'magic-library'])
    ]
  }),
  world({
    id: 'world-12',
    order: 12,
    title: 'Grand voyage',
    icon: '12',
    theme: 'castle',
    description: 'Monde final avec melanges de matieres et grands defis.',
    gradeIds: ['P2', 'P3', 'P4', 'P5', 'P6'],
    subjectIds: ['mathematics', 'french', 'dutch', 'english', 'spanish', 'reasoning', 'stories'],
    missions: [
      mission(1, 'Retour sur les nombres', ['build-number', 'generated-addition-p2', 'generated-comparison-p2']),
      mission(2, 'Retour sur les mots', ['associe-image-mot', 'generated-dutch-vocabulary', 'generated-english-vocabulary']),
      mission(3, 'Retour sur les phrases', ['phrase-a-trous', 'generated-spanish-vocabulary', 'generated-french-sentences']),
      mission(4, 'Retour sur la lecture', ['generated-french-reading', 'generated-dutch-reading', 'magic-library']),
      mission(5, 'Retour sur la logique', ['generated-reasoning-p2', 'generated-reasoning-p3', 'generated-reasoning-p4']),
      mission(6, 'Retour sur les tables', ['multiplication-table-2', 'generated-multiplication-p3', 'generated-division-p4']),
      mission(7, 'Retour sur les problemes', ['generated-word-problems', 'word-problems']),
      mission(8, 'Retour sur les grands niveaux', ['generated-fractions-p4', 'generated-decimals-p5', 'generated-mixed-operations-p6']),
      mission(9, 'Tour des langues', ['generated-dutch-reading', 'generated-english-reading', 'generated-spanish-reading']),
      mission(10, 'Grande finale', ['generated-word-problems', 'magic-library', 'generated-reasoning-p6', 'generated-mixed-operations-p6'])
    ]
  })
];

function buildLevelIds(worldId, missionOrder) {
  return Array.from({ length: 10 }, (_, index) => `${worldId}-mission-${missionOrder}-level-${index + 1}`);
}

export const worldJourneyData = WORLD_SPECS.map((spec) => {
  const missionDefinitions = spec.missions.map((entry) => {
    const levelIds = buildLevelIds(spec.id, entry.order);
    return defineMission({
      id: `${spec.id}-mission-${entry.order}`,
      worldId: spec.id,
      order: entry.order,
      title: entry.title,
      description: entry.description,
      levelIds,
      challengeLevelId: levelIds[8],
      examLevelId: levelIds[9],
      tags: [...spec.subjectIds, ...spec.gradeIds]
    });
  });

  const worldDefinition = defineWorld({
    id: spec.id,
    order: spec.order,
    title: spec.title,
    theme: spec.theme,
    description: spec.description,
    missionIds: missionDefinitions.map((entry) => entry.id),
    gradeIds: spec.gradeIds,
    subjectIds: spec.subjectIds
  });

  return Object.freeze({
    ...worldDefinition,
    name: spec.title,
    icon: spec.icon,
    missions: missionDefinitions,
    missionActivityMap: Object.freeze(
      Object.fromEntries(
        spec.missions.map((entry) => [`${spec.id}-mission-${entry.order}`, [...entry.activityIds]])
      )
    )
  });
});

