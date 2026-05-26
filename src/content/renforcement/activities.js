import { generateCountAnglesExercise, generateCountSidesExercise, generateShapeRecognitionExercise } from '../../engines/generators/shapeGenerator.js';
import { generateColoringExercise } from '../../engines/generators/coloringGenerator.js';
import { generateObservationExercise } from '../../engines/generators/observationGenerator.js';
import { generateTableExercise } from '../../engines/generators/tableGenerator.js';

function asLesson(exercise, index, sectionId) {
  return {
    id: exercise.id || `${sectionId}-${index}`,
    prompt: exercise.question || exercise.prompt || '',
    choices: exercise.options || exercise.choices || [],
    answer: exercise.correct ?? exercise.answer ?? '',
    explanation: exercise.explanation || '',
    type: exercise.type,
    renderType: exercise.renderType,
    engineType: exercise.engineType
  };
}

function buildSingleSectionActivity({
  id,
  title,
  engineType,
  sectionId = 'practice',
  estimatedDurationMin = 8,
  instructions,
  lessons
}) {
  return {
    id,
    slug: id,
    title,
    subject: 'renforcement',
    subskill: 'renforcement',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin,
    instructions,
    correctionType: engineType === 'multiple-choice' ? 'multiple-choice' : 'auto',
    hints: ['Prends ton temps. On regarde ensemble.'],
    tags: ['renforcement', engineType],
    accessibility: ['consigne claire', 'grand bouton'],
    originRepo: 'renforcement',
    engineType,
    featured: false,
    sections: [
      {
        id: sectionId,
        title: 'Pratique',
        kind: 'practice',
        description: '',
        lessons
      }
    ]
  };
}

const FORME_LESSONS = [
  generateShapeRecognitionExercise({ grade: 'P2' }),
  generateCountSidesExercise({ grade: 'P2' }),
  generateCountAnglesExercise({ grade: 'P2' }),
  generateShapeRecognitionExercise({ grade: 'P3' }),
  generateCountSidesExercise({ grade: 'P3' }),
  generateCountAnglesExercise({ grade: 'P3' })
].map((ex, idx) => asLesson(ex, idx, 'formes'));

const COULEUR_LESSONS = Array.from({ length: 6 }, (_, idx) => generateColoringExercise({ grade: idx % 2 ? 'P3' : 'P2' }))
  .map((ex, idx) => asLesson(ex, idx, 'couleurs'));

const OBSERVER_LESSONS = Array.from({ length: 6 }, (_, idx) => generateObservationExercise({ grade: idx % 2 ? 'P3' : 'P2' }))
  .map((ex, idx) => asLesson(ex, idx, 'observer'));

const CALCUL_LESSONS = Array.from({ length: 6 }, (_, idx) => generateTableExercise({ grade: idx % 2 ? 'P3' : 'P2' }))
  .map((ex, idx) => asLesson(ex, idx, 'calcul'));

function manualMultipleChoiceLesson({ prompt, choices, answer, explanation = '' }) {
  return {
    id: `manual-${prompt.slice(0, 20).replace(/\s+/g, '-')}`,
    prompt,
    choices,
    answer,
    explanation
  };
}

const LOGIQUE_LESSONS = [
  manualMultipleChoiceLesson({
    prompt: 'Quel objet va avec les couleurs ?',
    choices: ['Un triangle', 'Une règle', 'Un ballon'],
    answer: 'Un triangle',
    explanation: 'Dans cette activité, on choisit une figure parmi des choix simples.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Quelle suite continue le même dessin ?',
    choices: ['Triangle, rectangle, cercle', 'Rectangle, cercle, triangle', 'Cercle, triangle, triangle'],
    answer: 'Triangle, rectangle, cercle',
    explanation: 'On continue en gardant le même ordre.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Choisis l intrus (ce qui ne va pas).',
    choices: ['Carre', 'Rectangle', 'Cercle'],
    answer: 'Rectangle',
    explanation: 'Deux figures ont des côtés égaux de façon simple, tandis que celle-ci a une propriété différente.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Quel choix est le plus grand ?',
    choices: ['3', '5', '4'],
    answer: '5',
    explanation: '5 est le plus grand.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Quel lien va ensemble ?',
    choices: ['Cercle → roue', 'Carré → soleil', 'Triangle → bateau'],
    answer: 'Cercle → roue',
    explanation: 'Le cercle ressemble à une roue.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Qu est-ce qui ressemble le plus ?',
    choices: ['Rectangle', 'Cercle', 'Carre'],
    answer: 'Carre',
    explanation: 'Ici, on choisit la forme qui a 4 côtés égaux.'
  })
];

const LECTURE_LESSONS = [
  manualMultipleChoiceLesson({
    prompt: 'Choisis le mot qui correspond à l image (triangle).',
    choices: ['triangle', 'cercle', 'rectangle'],
    answer: 'triangle',
    explanation: 'Triangle est le bon mot.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Choisis le mot qui correspond à la forme (cercle).',
    choices: ['triangle', 'cercle', 'carre'],
    answer: 'cercle',
    explanation: 'Cercle est le bon mot.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Choisis le bon mot pour compléter : « Je vois un ____ ».',
    choices: ['carre', 'rectangle', 'cercle'],
    answer: 'rectangle',
    explanation: 'Rectangle complète la phrase.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Quel mot va avec « carré » ?',
    choices: ['carre', 'triangle', 'cercle'],
    answer: 'carre',
    explanation: 'Carré est le bon choix.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Choisis le mot : « rectangle ».',
    choices: ['carre', 'rectangle', 'cercle'],
    answer: 'rectangle',
    explanation: 'Rectangle est correct.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Complète : « Je vois un ____ ».',
    choices: ['triangle', 'etoile', 'carré'],
    answer: 'triangle',
    explanation: 'On voit un triangle.'
  })
];

const ECOUTE_LESSONS = [
  manualMultipleChoiceLesson({
    prompt: 'Écoute la consigne : choisis le cercle.',
    choices: ['cercle', 'triangle', 'rectangle'],
    answer: 'cercle',
    explanation: 'Le cercle est le bon choix.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Écoute la consigne : choisis le triangle.',
    choices: ['rectangle', 'triangle', 'carre'],
    answer: 'triangle',
    explanation: 'Le triangle est le bon choix.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Écoute la consigne : choisis le carré.',
    choices: ['carre', 'cercle', 'rectangle'],
    answer: 'carre',
    explanation: 'Le carré est le bon choix.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Écoute la consigne : choisis le rectangle.',
    choices: ['rectangle', 'triangle', 'cercle'],
    answer: 'rectangle',
    explanation: 'Le rectangle est le bon choix.'
  })
];

const TRACE_LESSONS = [
  manualMultipleChoiceLesson({
    prompt: 'Trace dans ton esprit la ligne : quel chemin va avec la consigne « droite » ?',
    choices: ['une ligne droite', 'un rond', 'des zigzags'],
    answer: 'une ligne droite',
    explanation: 'Une ligne droite va tout droit.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Trace encore : quel chemin est « vers le haut » ?',
    choices: ['un chemin vers le haut', 'un chemin vers le bas', 'un chemin qui tourne'],
    answer: 'un chemin vers le haut',
    explanation: 'Vers le haut veut dire monter.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Trace à nouveau : quel mouvement est « vers la droite » ?',
    choices: ['vers la droite', 'vers la gauche', 'en bas'],
    answer: 'vers la droite',
    explanation: 'Vers la droite avance de gauche à droite.'
  }),
  manualMultipleChoiceLesson({
    prompt: 'Trace encore : quel chemin est le plus simple ?',
    choices: ['la ligne simple', 'une courbe compliquée', 'une ligne cassée'],
    answer: 'la ligne simple',
    explanation: 'La ligne simple est plus facile.'
  })
];

export const renforcementActivities = [
  buildSingleSectionActivity({
    id: 'renforcement-formes',
    title: 'Formes',
    engineType: 'multiple-choice',
    instructions: 'Aujourd’hui, on travaille les figures. Une consigne à la fois.',
    lessons: FORME_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-couleurs',
    title: 'Couleurs',
    engineType: 'coloring',
    instructions: 'Aujourd’hui, on choisit et on colorie avec douceur. Une consigne à la fois.',
    lessons: COULEUR_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-tracer',
    title: 'Tracer',
    engineType: 'trace',
    instructions: 'Aujourd’hui, on trace calmement. Une consigne à la fois.',
    lessons: TRACE_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-logique',
    title: 'Logique',
    engineType: 'multiple-choice',
    instructions: 'Aujourd’hui, on cherche ensemble des liens visuels. Une consigne à la fois.',
    lessons: LOGIQUE_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-calcul',
    title: 'Calcul',
    engineType: 'grid',
    instructions: 'Aujourd’hui, on complète la table. Une consigne à la fois.',
    lessons: CALCUL_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-lecture',
    title: 'Lecture',
    engineType: 'multiple-choice',
    instructions: 'Aujourd’hui, on lit et on relie. Une consigne à la fois.',
    lessons: LECTURE_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-observer',
    title: 'Observer',
    engineType: 'spot-difference',
    instructions: 'Aujourd’hui, on observe attentivement. Une consigne à la fois.',
    lessons: OBSERVER_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-ecoute',
    title: 'Ecoute',
    engineType: 'multiple-choice',
    instructions: 'Aujourd’hui, on écoute et on répond tranquillement. Une consigne à la fois.',
    lessons: ECOUTE_LESSONS
  })
];

