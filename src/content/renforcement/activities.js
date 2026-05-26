import { generateCountAnglesExercise, generateCountSidesExercise, generateShapeRecognitionExercise } from '../../engines/generators/shapeGenerator.js';
import { generateColoringExercise } from '../../engines/generators/coloringGenerator.js';
import { generateObservationExercise } from '../../engines/generators/observationGenerator.js';
import { generateTableExercise } from '../../engines/generators/tableGenerator.js';
import { SHAPE_SVG_MARKUP } from '../../shared/ui/ShapeSvg.jsx';

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
  {
    id: 'logique-1',
    prompt: 'Combien de côtés a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'une figure' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 côtés et 3 angles.'
  },
  {
    id: 'logique-2',
    prompt: 'Quelle figure ressemble à une fenêtre ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'une figure' }],
    choices: ['Un cercle', 'Un carré', 'Un triangle'],
    answer: 'Un carré',
    explanation: 'Un carré a 4 côtés égaux, comme une fenêtre.'
  },
  {
    id: 'logique-3',
    prompt: 'Quel objet ressemble à cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'une figure' }],
    choices: ['Une balle', 'Un livre', 'Une boîte'],
    answer: 'Une balle',
    explanation: 'Un cercle ressemble à une balle ou une roue.'
  },
  {
    id: 'logique-4',
    prompt: 'Combien de côtés a un rectangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'une figure' }],
    choices: ['2', '3', '4'],
    answer: '4',
    explanation: 'Un rectangle a 4 côtés : 2 courts et 2 longs.'
  },
  {
    id: 'logique-5',
    prompt: 'Laquelle n\'a pas d\'angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'une figure' }],
    choices: ['Carré', 'Cercle', 'Triangle'],
    answer: 'Cercle',
    explanation: 'Un cercle est rond, sans angles. Les autres figures ont des angles.'
  },
  {
    id: 'logique-6',
    prompt: 'Quelle figure a le plus de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'une figure' }],
    choices: ['Triangle', 'Carré', 'Pentagone'],
    answer: 'Pentagone',
    explanation: 'Un pentagone a 5 côtés. C\'est plus que le triangle (3) et le carré (4).'
  }
];

const LECTURE_LESSONS = [
  {
    id: 'lecture-1',
    prompt: 'Quel est le nom de cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'une figure' }],
    choices: ['triangle', 'cercle', 'rectangle'],
    answer: 'triangle',
    explanation: 'C\'est un triangle. Il a 3 côtés.'
  },
  {
    id: 'lecture-2',
    prompt: 'Quel est le nom de cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'une figure' }],
    choices: ['triangle', 'cercle', 'carré'],
    answer: 'cercle',
    explanation: 'C\'est un cercle. C\'est une forme ronde.'
  },
  {
    id: 'lecture-3',
    prompt: 'Comment s\'appelle cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'une figure' }],
    choices: ['carré', 'rectangle', 'triangle'],
    answer: 'carré',
    explanation: 'C\'est un carré. Il a 4 côtés égaux.'
  },
  {
    id: 'lecture-4',
    prompt: 'Quel mot décrit cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'une figure' }],
    choices: ['carré', 'rectangle', 'cercle'],
    answer: 'rectangle',
    explanation: 'C\'est un rectangle. Il a 4 côtés mais pas tous égaux.'
  },
  {
    id: 'lecture-5',
    prompt: 'Quel est le nom de cette figure avec 5 côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'une figure' }],
    choices: ['carré', 'pentagone', 'cercle'],
    answer: 'pentagone',
    explanation: 'C\'est un pentagone. Il a 5 côtés.'
  },
  {
    id: 'lecture-6',
    prompt: 'Comment s\'appelle cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'une figure' }],
    choices: ['carré', 'losange', 'triangle'],
    answer: 'losange',
    explanation: 'C\'est un losange. Il ressemble à un carré tourné.'
  }
];

const ECOUTE_LESSONS = [
  {
    id: 'ecoute-1',
    prompt: 'Laquelle est un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'une figure' }],
    choices: ['rectangle', 'cercle', 'carré'],
    answer: 'cercle',
    explanation: 'Un cercle est rond, sans angles.'
  },
  {
    id: 'ecoute-2',
    prompt: 'Laquelle est un triangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'une figure' }],
    choices: ['rectangle', 'triangle', 'cercle'],
    answer: 'triangle',
    explanation: 'Un triangle a 3 côtés et 3 angles.'
  },
  {
    id: 'ecoute-3',
    prompt: 'Quelle est cette forme à 4 côtés égaux ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'une figure' }],
    choices: ['carré', 'rectangle', 'triangle'],
    answer: 'carré',
    explanation: 'Un carré a 4 côtés égaux et 4 angles égaux.'
  },
  {
    id: 'ecoute-4',
    prompt: 'Quelle figure ressemble à une boîte plate ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'une figure' }],
    choices: ['carré', 'triangle', 'rectangle'],
    answer: 'rectangle',
    explanation: 'Un rectangle ressemble à une boîte ou un drapeau.'
  }
];

const TRACE_LESSONS = [
  {
    id: 'trace-1',
    prompt: 'Quel chemin va tout droit ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'une ligne' }],
    choices: ['une ligne droite', 'une courbe', 'des zigzags'],
    answer: 'une ligne droite',
    explanation: 'Une ligne droite ne tourne pas, elle va tout droit.'
  },
  {
    id: 'trace-2',
    prompt: 'Quel chemin monte vers le haut ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.arrow_up, alt: 'une flèche' }],
    choices: ['vers le bas', 'vers le haut', 'vers le côté'],
    answer: 'vers le haut',
    explanation: 'Vers le haut signifie monter, comme une flèche qui monte.'
  },
  {
    id: 'trace-3',
    prompt: 'Quel chemin va vers la droite ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.arrow_right, alt: 'une flèche' }],
    choices: ['vers la gauche', 'vers la droite', 'vers le bas'],
    answer: 'vers la droite',
    explanation: 'Vers la droite signifie avancer de gauche à droite.'
  },
  {
    id: 'trace-4',
    prompt: 'Quel chemin est le plus facile à tracer ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'une ligne' }],
    choices: ['une courbe', 'une ligne droite', 'des zigzags'],
    answer: 'une ligne droite',
    explanation: 'Une ligne droite est plus facile que les courbes ou les zigzags.'
  }
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

