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
  // NIVEAU 1: Compter les côtés (basique)
  {
    id: 'logique-1',
    prompt: 'Combien de côtés a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 côtés et 3 angles.'
  },
  {
    id: 'logique-2',
    prompt: 'Combien de côtés a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Un carré a 4 côtés égaux.'
  },
  {
    id: 'logique-3',
    prompt: 'Combien de côtés a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Un rectangle a 4 côtés.'
  },
  {
    id: 'logique-4',
    prompt: 'Combien d\'angles a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 angles, un à chaque coin.'
  },
  {
    id: 'logique-5',
    prompt: 'Combien d\'angles a cette figure ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'un pentagone' }],
    choices: ['4', '5', '6'],
    answer: '5',
    explanation: 'Un pentagone a 5 angles.'
  },

  // NIVEAU 2: Propriétés et comparaisons
  {
    id: 'logique-6',
    prompt: 'Laquelle n\'a pas d\'angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['Carré', 'Cercle', 'Triangle'],
    answer: 'Cercle',
    explanation: 'Un cercle est rond, sans angles. Les autres figures ont des angles.'
  },
  {
    id: 'logique-7',
    prompt: 'Quel carré et rectangle différent ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['Tous les côtés égaux', 'Côtés différents', 'Sans angles'],
    answer: 'Côtés différents',
    explanation: 'Le rectangle a 2 côtés longs et 2 côtés courts. Le carré a tous les côtés égaux.'
  },
  {
    id: 'logique-8',
    prompt: 'Quelle figure a tous les côtés égaux ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['Triangle', 'Rectangle', 'Carré'],
    answer: 'Carré',
    explanation: 'Le carré a 4 côtés parfaitement égaux.'
  },
  {
    id: 'logique-9',
    prompt: 'Quelle figure a le plus de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'un pentagone' }],
    choices: ['Triangle (3)', 'Carré (4)', 'Pentagone (5)'],
    answer: 'Pentagone (5)',
    explanation: 'Le pentagone a 5 côtés. C\'est plus que le triangle et le carré.'
  },

  // NIVEAU 3: Objets réels et associations
  {
    id: 'logique-10',
    prompt: 'Quel objet ressemble à cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['Une balle', 'Un livre', 'Une boîte'],
    answer: 'Une balle',
    explanation: 'Un cercle ressemble à une balle, une roue ou une assiette.'
  },
  {
    id: 'logique-11',
    prompt: 'Quelle forme ressemble à une fenêtre ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Carré',
    explanation: 'Une fenêtre ressemble souvent à un carré avec 4 côtés égaux.'
  },
  {
    id: 'logique-12',
    prompt: 'Quelle forme ressemble à une pizza coupée ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['Triangle', 'Cercle', 'Rectangle'],
    answer: 'Triangle',
    explanation: 'Une part de pizza ressemble à un triangle.'
  },
  {
    id: 'logique-13',
    prompt: 'Quel objet a la même forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['Une balle', 'Un livre', 'Un chapeau'],
    answer: 'Un livre',
    explanation: 'Un livre a souvent une forme rectangulaire.'
  },

  // NIVEAU 4: Logique combinée
  {
    id: 'logique-14',
    prompt: 'Laquelle a 4 côtés ET tous différents ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'un losange' }],
    choices: ['Carré', 'Losange', 'Triangle'],
    answer: 'Losange',
    explanation: 'Un losange est comme un carré tourné avec 4 côtés égaux mais angles différents.'
  },
  {
    id: 'logique-15',
    prompt: 'Quel groupe a figures avec angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['Cercle, triangle', 'Carré, cercle', 'Triangle, carré, pentagone'],
    answer: 'Triangle, carré, pentagone',
    explanation: 'Le triangle, carré et pentagone ont tous des angles. Le cercle n\'en a pas.'
  },
  {
    id: 'logique-16',
    prompt: 'Si je compte les côtés: 3 + 4 = ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['6', '7', '8'],
    answer: '7',
    explanation: 'Triangle (3 côtés) + Carré (4 côtés) = 7 côtés en total.'
  }
];

const LECTURE_LESSONS = [
  // NIVEAU 1: Nommer les formes basiques
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

  // NIVEAU 2: Formes plus complexes
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
  },
  {
    id: 'lecture-7',
    prompt: 'Quel est le nom de cette étoile ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.star, alt: 'une étoile' }],
    choices: ['carré', 'étoile', 'cercle'],
    answer: 'étoile',
    explanation: 'C\'est une étoile. Elle a plusieurs points.'
  },

  // NIVEAU 3: Décrire les propriétés
  {
    id: 'lecture-8',
    prompt: 'Cette figure est... comment ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['ronde', 'pointue', 'carrée'],
    answer: 'pointue',
    explanation: 'Un triangle est pointu, avec 3 angles.'
  },
  {
    id: 'lecture-9',
    prompt: 'Cette figure est... comment ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['pointue', 'ronde', 'carrée'],
    answer: 'ronde',
    explanation: 'Un cercle est rond, sans angles.'
  },
  {
    id: 'lecture-10',
    prompt: 'Cette figure a... comment les côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['différents', 'égaux', 'courbes'],
    answer: 'égaux',
    explanation: 'Un carré a tous les côtés égaux.'
  },
  {
    id: 'lecture-11',
    prompt: 'Cette figure a... comment les côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['égaux', 'différents', 'courbes'],
    answer: 'différents',
    explanation: 'Un rectangle a 2 côtés longs et 2 côtés courts.'
  },

  // NIVEAU 4: Contexte et usage
  {
    id: 'lecture-12',
    prompt: 'Une fenêtre ressemble à un... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['triangle', 'carré', 'cercle'],
    answer: 'carré',
    explanation: 'Les fenêtres ont souvent une forme carrée.'
  },
  {
    id: 'lecture-13',
    prompt: 'Une part de pizza ressemble à un... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['carré', 'cercle', 'triangle'],
    answer: 'triangle',
    explanation: 'Une part de pizza a une forme triangulaire.'
  },
  {
    id: 'lecture-14',
    prompt: 'Un ballon ressemble à un... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['carré', 'triangle', 'cercle'],
    answer: 'cercle',
    explanation: 'Un ballon a une forme circulaire/ronde.'
  },
  {
    id: 'lecture-15',
    prompt: 'Complète: Un livre ressemble à un... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['carré', 'triangle', 'rectangle'],
    answer: 'rectangle',
    explanation: 'Les livres ont généralement une forme rectangulaire.'
  }
];

const ECOUTE_LESSONS = [
  // NIVEAU 1: Identifier par description simple
  {
    id: 'ecoute-1',
    prompt: 'Laquelle est un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'une figure ronde' }],
    choices: ['rectangle', 'cercle', 'carré'],
    answer: 'cercle',
    explanation: 'Un cercle est rond, sans angles.'
  },
  {
    id: 'ecoute-2',
    prompt: 'Laquelle est un triangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'une figure pointue' }],
    choices: ['rectangle', 'triangle', 'cercle'],
    answer: 'triangle',
    explanation: 'Un triangle a 3 côtés et 3 angles.'
  },
  {
    id: 'ecoute-3',
    prompt: 'Quelle est cette forme à 4 côtés égaux ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['carré', 'rectangle', 'triangle'],
    answer: 'carré',
    explanation: 'Un carré a 4 côtés égaux et 4 angles égaux.'
  },
  {
    id: 'ecoute-4',
    prompt: 'Quelle figure ressemble à une boîte plate ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['carré', 'triangle', 'rectangle'],
    answer: 'rectangle',
    explanation: 'Un rectangle ressemble à une boîte ou un drapeau.'
  },

  // NIVEAU 2: Propriétés multiples
  {
    id: 'ecoute-5',
    prompt: 'Quelle figure a 5 côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'un pentagone' }],
    choices: ['carré', 'triangle', 'pentagone'],
    answer: 'pentagone',
    explanation: 'Un pentagone a 5 côtés et 5 angles.'
  },
  {
    id: 'ecoute-6',
    prompt: 'Laquelle est un losange ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'un losange' }],
    choices: ['carré', 'losange', 'triangle'],
    answer: 'losange',
    explanation: 'Un losange ressemble à un carré tourné.'
  },
  {
    id: 'ecoute-7',
    prompt: 'Laquelle n\'a pas d\'angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['triangle', 'cercle', 'carré'],
    answer: 'cercle',
    explanation: 'Un cercle est une courbe sans angles.'
  },
  {
    id: 'ecoute-8',
    prompt: 'Quelle figure a le moins de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['carré', 'triangle', 'pentagone'],
    answer: 'triangle',
    explanation: 'Un triangle a 3 côtés. C\'est le moins.'
  },

  // NIVEAU 3: Comparaisons
  {
    id: 'ecoute-9',
    prompt: 'Carré et rectangle... quelle différence ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'un rectangle' }],
    choices: ['Même taille', 'Côtés différents', 'Pas d\'angles'],
    answer: 'Côtés différents',
    explanation: 'Le carré a tous côtés égaux. Le rectangle a 2 longs et 2 courts.'
  },
  {
    id: 'ecoute-10',
    prompt: 'Laquelle est pointue ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle pointu' }],
    choices: ['cercle', 'triangle', 'rectangle'],
    answer: 'triangle',
    explanation: 'Un triangle a des angles pointus.'
  },
  {
    id: 'ecoute-11',
    prompt: 'Laquelle est très ronde ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'un cercle' }],
    choices: ['carré', 'triangle', 'cercle'],
    answer: 'cercle',
    explanation: 'Un cercle est parfaitement rond.'
  }
];

const TRACE_LESSONS = [
  // NIVEAU 1: Directions simples
  {
    id: 'trace-1',
    prompt: 'Quel chemin va tout droit ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'une ligne droite' }],
    choices: ['une ligne droite', 'une courbe', 'des zigzags'],
    answer: 'une ligne droite',
    explanation: 'Une ligne droite ne tourne pas, elle va tout droit.'
  },
  {
    id: 'trace-2',
    prompt: 'Quel chemin monte vers le haut ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.arrow_up, alt: 'une flèche vers le haut' }],
    choices: ['vers le bas', 'vers le haut', 'vers le côté'],
    answer: 'vers le haut',
    explanation: 'Vers le haut signifie monter, comme une flèche qui monte.'
  },
  {
    id: 'trace-3',
    prompt: 'Quel chemin va vers la droite ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.arrow_right, alt: 'une flèche vers la droite' }],
    choices: ['vers la gauche', 'vers la droite', 'vers le bas'],
    answer: 'vers la droite',
    explanation: 'Vers la droite signifie avancer de gauche à droite.'
  },
  {
    id: 'trace-4',
    prompt: 'Quelle ligne est courbe ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_curve, alt: 'une courbe' }],
    choices: ['droite', 'courbe', 'zigzag'],
    answer: 'courbe',
    explanation: 'Une courbe tourne graduellement, comme une arc.'
  },
  {
    id: 'trace-5',
    prompt: 'Quel chemin a beaucoup de zigzags ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_zigzag, alt: 'des zigzags' }],
    choices: ['droite', 'courbe', 'zigzag'],
    answer: 'zigzag',
    explanation: 'Un zigzag monte et descend rapidement.'
  },

  // NIVEAU 2: Comparer les chemins
  {
    id: 'trace-6',
    prompt: 'Quel chemin est le plus facile à tracer ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'une ligne droite' }],
    choices: ['une courbe', 'une ligne droite', 'des zigzags'],
    answer: 'une ligne droite',
    explanation: 'Une ligne droite est plus facile que les courbes ou les zigzags.'
  },
  {
    id: 'trace-7',
    prompt: 'Quel chemin est le plus difficile à tracer ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_zigzag, alt: 'des zigzags' }],
    choices: ['droite', 'courbe', 'zigzag'],
    answer: 'zigzag',
    explanation: 'Les zigzags sont difficiles car il faut changer de direction plusieurs fois.'
  },
  {
    id: 'trace-8',
    prompt: 'Quelle direction est contraire (opposée) à monter ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.arrow_up, alt: 'une flèche' }],
    choices: ['vers la droite', 'vers le bas', 'vers la gauche'],
    answer: 'vers le bas',
    explanation: 'Si vous montez (haut), le contraire est descendre (bas).'
  },

  // NIVEAU 3: Logique de directions
  {
    id: 'trace-9',
    prompt: 'Si tu vas DROITE puis HAUT, tu as tracé quoi ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'deux lignes' }],
    choices: ['un rectangle', 'un L', 'un carré'],
    answer: 'un L',
    explanation: 'Droite puis haut crée une forme en L.'
  },
  {
    id: 'trace-10',
    prompt: 'Si tu vas DROITE, HAUT, GAUCHE, puis BAS, tu crées quoi ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['un triangle', 'un carré', 'un cercle'],
    answer: 'un carré',
    explanation: 'Ces 4 mouvements créent un carré fermé.'
  },
  {
    id: 'trace-11',
    prompt: 'Quel chemin crée un triangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'un triangle' }],
    choices: ['droite, droite, fermer', 'droite, haut, bas', 'droite, diagonale, fermer'],
    answer: 'droite, diagonale, fermer',
    explanation: 'Un triangle a 3 côtés qui se referment.'
  },

  // NIVEAU 4: Séquences complexes
  {
    id: 'trace-12',
    prompt: 'Quel est le meilleur ordre pour tracer un carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'un carré' }],
    choices: ['haut, bas, gauche, droite', 'droite, haut, gauche, bas', 'zigzag partout'],
    answer: 'droite, haut, gauche, bas',
    explanation: 'Cette séquence crée un carré parfait dans l\'ordre.'
  },
  {
    id: 'trace-13',
    prompt: 'Si tu traces une ligne et puis tu reviens, tu as... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_straight, alt: 'une ligne' }],
    choices: ['un triangle', 'un aller-retour', 'un cercle'],
    answer: 'un aller-retour',
    explanation: 'Aller et revenir crée un aller-retour sur la même ligne.'
  },
  {
    id: 'trace-14',
    prompt: 'Quel chemin suit une courbe régulière ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.line_curve, alt: 'une courbe' }],
    choices: ['zigzag', 'courbe lisse', 'escalier'],
    answer: 'courbe lisse',
    explanation: 'Une courbe régulière tourne graduellement et lissement.'
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

