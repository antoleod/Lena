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

// ============================================
// LOGIQUE (Logic) - 10 levels × 7 exercises = 70
// ============================================

const LOGIQUE_LESSONS = [
  // NIVEAU 1: Identifier les formes simples
  {
    id: 'logique-1-1',
    prompt: 'Quel est le nom de cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'forme' }],
    choices: ['Triangle', 'Cercle', 'Carré'],
    answer: 'Triangle',
    explanation: 'C\'est un triangle, une forme avec 3 côtés.'
  },
  {
    id: 'logique-1-2',
    prompt: 'Quel est le nom de cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'forme' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Carré',
    explanation: 'C\'est un carré, une forme avec 4 côtés égaux.'
  },
  {
    id: 'logique-1-3',
    prompt: 'Quel est le nom de cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'forme' }],
    choices: ['Carré', 'Cercle', 'Triangle'],
    answer: 'Cercle',
    explanation: 'C\'est un cercle, une forme ronde.'
  },
  {
    id: 'logique-1-4',
    prompt: 'Quel est le nom de cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'forme' }],
    choices: ['Rectangle', 'Triangle', 'Cercle'],
    answer: 'Rectangle',
    explanation: 'C\'est un rectangle, une forme avec 4 côtés.'
  },
  {
    id: 'logique-1-5',
    prompt: 'Lequel est un triangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'forme' }],
    choices: ['Carré', 'Triangle', 'Cercle'],
    answer: 'Triangle',
    explanation: 'Le triangle est la forme pointue avec 3 côtés.'
  },
  {
    id: 'logique-1-6',
    prompt: 'Lequel est un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'forme' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Cercle',
    explanation: 'Le cercle est la forme ronde sans angles.'
  },
  {
    id: 'logique-1-7',
    prompt: 'Lequel est un carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'forme' }],
    choices: ['Cercle', 'Carré', 'Triangle'],
    answer: 'Carré',
    explanation: 'Le carré est la forme avec 4 côtés égaux.'
  },

  // NIVEAU 2: Compter les côtés
  {
    id: 'logique-2-1',
    prompt: 'Combien de côtés a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 côtés.'
  },
  {
    id: 'logique-2-2',
    prompt: 'Combien de côtés a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['2', '3', '4'],
    answer: '4',
    explanation: 'Un carré a 4 côtés.'
  },
  {
    id: 'logique-2-3',
    prompt: 'Combien de côtés a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Un rectangle a 4 côtés.'
  },
  {
    id: 'logique-2-4',
    prompt: 'Combien de côtés a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['3', '4', '5'],
    answer: '5',
    explanation: 'Un pentagone a 5 côtés.'
  },
  {
    id: 'logique-2-5',
    prompt: 'Combien de côtés a un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['0', '1', '2'],
    answer: '0',
    explanation: 'Un cercle n\'a pas de côtés, c\'est une courbe.'
  },
  {
    id: 'logique-2-6',
    prompt: 'Quelle forme a 3 côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['Carré', 'Triangle', 'Cercle'],
    answer: 'Triangle',
    explanation: 'Seul le triangle a 3 côtés.'
  },
  {
    id: 'logique-2-7',
    prompt: 'Quelle forme a le plus de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Triangle', 'Carré', 'Pentagone'],
    answer: 'Pentagone',
    explanation: 'Le pentagone a 5 côtés, c\'est le plus.'
  },

  // NIVEAU 3: Compter les angles
  {
    id: 'logique-3-1',
    prompt: 'Combien d\'angles a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 angles aux 3 coins.'
  },
  {
    id: 'logique-3-2',
    prompt: 'Combien d\'angles a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Un carré a 4 angles à chaque coin.'
  },
  {
    id: 'logique-3-3',
    prompt: 'Combien d\'angles a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Un rectangle a 4 angles.'
  },
  {
    id: 'logique-3-4',
    prompt: 'Combien d\'angles a cette forme ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['4', '5', '6'],
    answer: '5',
    explanation: 'Un pentagone a 5 angles.'
  },
  {
    id: 'logique-3-5',
    prompt: 'Combien d\'angles a un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['0', '1', '2'],
    answer: '0',
    explanation: 'Un cercle n\'a pas d\'angles, c\'est lisse.'
  },
  {
    id: 'logique-3-6',
    prompt: 'Quelle forme a 4 angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Carré',
    explanation: 'Le carré (et rectangle) ont 4 angles.'
  },
  {
    id: 'logique-3-7',
    prompt: 'Quelle forme n\'a pas d\'angles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Cercle',
    explanation: 'Le cercle est la seule forme sans angles.'
  },

  // NIVEAU 4: Propriétés (égalité des côtés)
  {
    id: 'logique-4-1',
    prompt: 'Tous les côtés sont égaux... laquelle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Rectangle', 'Carré', 'Triangle'],
    answer: 'Carré',
    explanation: 'Le carré a tous ses côtés de la même longueur.'
  },
  {
    id: 'logique-4-2',
    prompt: 'Lequel a des côtés différents ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['Carré', 'Rectangle', 'Triangle'],
    answer: 'Rectangle',
    explanation: 'Le rectangle a 2 côtés longs et 2 côtés courts.'
  },
  {
    id: 'logique-4-3',
    prompt: 'Quelle différence entre carré et rectangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['Pas différent', 'Côtés différents', 'Formes opposées'],
    answer: 'Côtés différents',
    explanation: 'Rectangle: côtés différents. Carré: côtés égaux.'
  },
  {
    id: 'logique-4-4',
    prompt: 'Lequel a 4 côtés égaux ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'losange' }],
    choices: ['Triangle', 'Rectangle', 'Losange'],
    answer: 'Losange',
    explanation: 'Le losange a 4 côtés égaux, comme le carré mais tourné.'
  },
  {
    id: 'logique-4-5',
    prompt: 'Tous les côtés égaux, combien ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Un triangle a 3 côtés qui peuvent être égaux.'
  },
  {
    id: 'logique-4-6',
    prompt: 'Quelle forme est symétrique ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Triangle', 'Carré', 'Ligne'],
    answer: 'Carré',
    explanation: 'Le carré est parfaitement symétrique de tous les côtés.'
  },
  {
    id: 'logique-4-7',
    prompt: 'Plus de côtés = ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Plus pointu', 'Plus proche du cercle', 'Plus grand'],
    answer: 'Plus proche du cercle',
    explanation: 'Plus une forme a de côtés, plus elle ressemble à un cercle.'
  },

  // NIVEAU 5: Comparaisons et tailles
  {
    id: 'logique-5-1',
    prompt: 'Quelle forme a le plus de côtés : triangle ou carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Triangle (3)', 'Carré (4)', 'Les deux pareil'],
    answer: 'Carré (4)',
    explanation: 'Le carré a 4 côtés, c\'est plus que le triangle qui en a 3.'
  },
  {
    id: 'logique-5-2',
    prompt: 'Triangle vs Carré: laquelle a moins de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['Triangle', 'Carré', 'Égal'],
    answer: 'Triangle',
    explanation: 'Triangle = 3 côtés. Carré = 4 côtés. Triangle en a moins.'
  },
  {
    id: 'logique-5-3',
    prompt: 'Ordre du moins au plus de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Cercle, Triangle, Carré, Pentagone', 'Triangle, Carré, Pentagone, Cercle', 'Pentagone, Carré, Triangle, Cercle'],
    answer: 'Cercle, Triangle, Carré, Pentagone',
    explanation: 'Cercle(0) < Triangle(3) < Carré(4) < Pentagone(5).'
  },
  {
    id: 'logique-5-4',
    prompt: 'Combien de côtés total: Triangle + Carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['5', '6', '7'],
    answer: '7',
    explanation: '3 (triangle) + 4 (carré) = 7 côtés.'
  },
  {
    id: 'logique-5-5',
    prompt: 'Combien de côtés total: Carré + Carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['6', '8', '10'],
    answer: '8',
    explanation: '4 + 4 = 8 côtés.'
  },
  {
    id: 'logique-5-6',
    prompt: 'Si Triangle a 3 et Carré a 4, Pentagone a ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['5', '6', '7'],
    answer: '5',
    explanation: 'Pentagone = 5 côtés. Un de plus que le carré.'
  },
  {
    id: 'logique-5-7',
    prompt: 'Ordre de côtés: Pentagone, Triangle, Carré',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['3, 4, 5', '5, 3, 4', '4, 5, 3'],
    answer: '5, 3, 4',
    explanation: 'Pentagone(5), Triangle(3), Carré(4).'
  },

  // NIVEAU 6: Objets du monde réel
  {
    id: 'logique-6-1',
    prompt: 'Quel objet ressemble à un cercle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Livre', 'Ballon', 'Boîte'],
    answer: 'Ballon',
    explanation: 'Un ballon est rond comme un cercle.'
  },
  {
    id: 'logique-6-2',
    prompt: 'Quel objet ressemble à un triangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['Part de pizza', 'Verre', 'Assiette'],
    answer: 'Part de pizza',
    explanation: 'Une part de pizza a la forme d\'un triangle.'
  },
  {
    id: 'logique-6-3',
    prompt: 'Quel objet ressemble à un carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Ballon de foot', 'Fenêtre', 'Ballon'],
    answer: 'Fenêtre',
    explanation: 'Les fenêtres ont souvent la forme d\'un carré.'
  },
  {
    id: 'logique-6-4',
    prompt: 'Quel objet ressemble à un rectangle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['Ballon', 'Livre', 'Dé'],
    answer: 'Livre',
    explanation: 'Les livres ont une forme rectangulaire.'
  },
  {
    id: 'logique-6-5',
    prompt: 'Quel objet ressemble à un pentagone ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Ballon de foot', 'Petite maison', 'Assiette creuse'],
    answer: 'Petite maison',
    explanation: 'Une maison vue de face ressemble à un pentagone.'
  },
  {
    id: 'logique-6-6',
    prompt: 'Quelle forme a une pièce de monnaie ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Carrée', 'Triangulaire', 'Ronde'],
    answer: 'Ronde',
    explanation: 'Les pièces de monnaie sont rondes comme un cercle.'
  },
  {
    id: 'logique-6-7',
    prompt: 'Quelle forme a une étoile ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.star, alt: 'étoile' }],
    choices: ['Carrée', 'Avec des pointes', 'Ronde'],
    answer: 'Avec des pointes',
    explanation: 'Une étoile a des pointes acérées.'
  },

  // NIVEAU 7: Combinaisons logiques
  {
    id: 'logique-7-1',
    prompt: 'Triangle + Carré = ? côtés en tout',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['6 côtés', '7 côtés', '8 côtés'],
    answer: '7 côtés',
    explanation: '3 (triangle) + 4 (carré) = 7 côtés.'
  },
  {
    id: 'logique-7-2',
    prompt: 'Combien d\'angles a un carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['4', '5', '6'],
    answer: '4',
    explanation: 'Un carré a 4 angles, un dans chaque coin.'
  },
  {
    id: 'logique-7-3',
    prompt: 'Forme sans angle ni côté... laquelle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle', 'Rectangle', 'Cercle'],
    answer: 'Cercle',
    explanation: 'Le cercle est la seule forme sans angle ni côté droit.'
  },
  {
    id: 'logique-7-4',
    prompt: 'Un carré tourné ressemble à... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'losange' }],
    choices: ['Losange', 'Triangle', 'Rectangle'],
    answer: 'Losange',
    explanation: 'Un carré tourné à 45 degrés ressemble à un losange.'
  },
  {
    id: 'logique-7-5',
    prompt: 'Le pentagone a-t-il plus de 4 côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Oui', 'Non', 'Ce n\'est pas une forme'],
    answer: 'Oui',
    explanation: 'Le pentagone a 5 côtés, c\'est plus que 4.'
  },
  {
    id: 'logique-7-6',
    prompt: 'Rectangle = Carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectangle' }],
    choices: ['Oui', 'Non', 'Parfois'],
    answer: 'Non',
    explanation: 'Pas pareil. Le rectangle a des côtés différents, le carré a des côtés égaux.'
  },
  {
    id: 'logique-7-7',
    prompt: 'Toutes les formes à 4 côtés sont... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'losange' }],
    choices: ['Des carrés', 'Différentes', 'Des rectangles'],
    answer: 'Différentes',
    explanation: 'Il existe plusieurs formes à 4 côtés : carré, rectangle, losange, trapèze...'
  },

  // NIVEAU 8: Suites et séquences
  {
    id: 'logique-8-1',
    prompt: '3 côtés, 4 côtés, ? côtés',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['5 côtés', '6 côtés', '7 côtés'],
    answer: '5 côtés',
    explanation: 'La suite augmente de 1 : 3, 4, 5...'
  },
  {
    id: 'logique-8-2',
    prompt: 'Suite : cercle (0), triangle (3), ? ',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Carré (4)', 'Rectangle (4)', 'Pentagone (5)'],
    answer: 'Carré (4)',
    explanation: '0, 3, 4 est une suite croissante. Le carré (4) suit le triangle (3).'
  },
  {
    id: 'logique-8-3',
    prompt: 'Plus on ajoute des côtés, la forme ressemble davantage à... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Un triangle', 'Un cercle', 'Une ligne'],
    answer: 'Un cercle',
    explanation: 'Plus une forme a de côtés, plus elle ressemble à un cercle.'
  },
  {
    id: 'logique-8-4',
    prompt: 'Ordre croissant : cercle, ?, ?, pentagone',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle, Carré', 'Carré, Triangle', 'Rectangle, Triangle'],
    answer: 'Triangle, Carré',
    explanation: 'Ordre par nombre de côtés : 0 (cercle), 3 (triangle), 4 (carré), 5 (pentagone).'
  },
  {
    id: 'logique-8-5',
    prompt: 'Toutes les formes ont des angles, sauf... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle', 'Cercle', 'Rectangle'],
    answer: 'Cercle',
    explanation: 'Toutes les formes polygonales ont des angles. Le cercle n\'en a pas.'
  },
  {
    id: 'logique-8-6',
    prompt: 'Suite de côtés : 3, 4, 5, ?, ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['6, 7', '5, 5', '4, 3'],
    answer: '6, 7',
    explanation: 'La suite continue : +1 à chaque fois : 3, 4, 5, 6, 7...'
  },
  {
    id: 'logique-8-7',
    prompt: 'Du moins au plus de côtés : Triangle, Carré, ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Cercle', 'Pentagone', 'Rectangle'],
    answer: 'Pentagone',
    explanation: 'Ordre par côtés : 3 (triangle), 4 (carré), 5 (pentagone).'
  },

  // NIVEAU 9: Raisonnement déductif
  {
    id: 'logique-9-1',
    prompt: 'Une forme avec 4 angles a combien de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: '4 angles = 4 côtés (un côté entre chaque angle).'
  },
  {
    id: 'logique-9-2',
    prompt: 'Une forme ronde sans angles... c\'est... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle', 'Cercle', 'Carré'],
    answer: 'Cercle',
    explanation: 'Seul le cercle est rond et sans angles.'
  },
  {
    id: 'logique-9-3',
    prompt: 'Si une forme a 3 angles, combien a-t-elle de côtés ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Angles = Côtés dans les polygones. 3 angles = 3 côtés.'
  },
  {
    id: 'logique-9-4',
    prompt: 'Une forme avec tous les côtés égaux... laquelle ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'losange' }],
    choices: ['Rectangle', 'Losange', 'Triangle'],
    answer: 'Losange',
    explanation: 'Le losange et le carré ont tous leurs côtés égaux.'
  },
  {
    id: 'logique-9-5',
    prompt: 'Une forme avec des angles inégaux est plutôt... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['Régulière', 'Irrégulière', 'Symétrique'],
    answer: 'Irrégulière',
    explanation: 'Si les angles ne sont pas égaux, la forme est irrégulière.'
  },
  {
    id: 'logique-9-6',
    prompt: 'Le cercle est différent des polygones parce que... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Il n\'a pas d\'angles', 'Il n\'est pas plat', 'Il est trop grand'],
    answer: 'Il n\'a pas d\'angles',
    explanation: 'Les polygones ont des angles. Le cercle n\'en a pas.'
  },
  {
    id: 'logique-9-7',
    prompt: 'Un carré est un cas spécial de... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Triangle', 'Rectangle', 'Cercle'],
    answer: 'Rectangle',
    explanation: 'Un carré est un rectangle dont tous les côtés sont égaux.'
  },

  // NIVEAU 10: Pensée abstraite
  {
    id: 'logique-10-1',
    prompt: 'Triangle + carré = ? côtés en tout',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triangle' }],
    choices: ['7', '8', '12'],
    answer: '7',
    explanation: '3 (triangle) + 4 (carré) = 7 côtés au total.'
  },
  {
    id: 'logique-10-2',
    prompt: 'Une forme avec infiniment de côtés... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Triangle', 'Cercle', 'Polygone'],
    answer: 'Cercle',
    explanation: 'Le cercle a infiniment de minuscules côtés : c\'est une courbe infinie.'
  },
  {
    id: 'logique-10-3',
    prompt: 'La forme la plus efficace pour rouler est... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Carré', 'Triangle', 'Cercle'],
    answer: 'Cercle',
    explanation: 'Le cercle est la forme la plus ronde et roule sans effort.'
  },
  {
    id: 'logique-10-4',
    prompt: 'La forme la plus stable sur 4 points d\'appui est... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Triangle', 'Carré', 'Cercle'],
    answer: 'Carré',
    explanation: 'Le carré est stable avec ses 4 coins sur une table.'
  },
  {
    id: 'logique-10-5',
    prompt: 'En ajoutant infiniment de côtés à un polygone, il devient... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentagone' }],
    choices: ['Triangle', 'Cercle', 'Ligne'],
    answer: 'Cercle',
    explanation: 'Quand un polygone a infiniment de petits côtés, il ressemble à un cercle.'
  },
  {
    id: 'logique-10-6',
    prompt: 'Combien d\'axes de symétrie a un carré ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['2', '4', '8'],
    answer: '4',
    explanation: 'Un carré a 4 axes de symétrie : horizontal, vertical, et les 2 diagonales.'
  },
  {
    id: 'logique-10-7',
    prompt: 'Dans quelle forme peut-on placer infiniment de triangles ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'cercle' }],
    choices: ['Deux carrés', 'Dans un cercle', 'Dans un triangle'],
    answer: 'Dans un cercle',
    explanation: 'On peut mettre infiniment de petits triangles dans un cercle.'
  }
];

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

const NOMBRES_LESSONS = [
  { id: 'nombres-1', prompt: 'Combien de points vois-tu ? ● ● ●', choices: ['3', '2', '4'], answer: '3', explanation: 'Il y a 3 points.' },
  { id: 'nombres-2', prompt: 'Quel nombre vient après 5 ?', choices: ['6', '4', '7'], answer: '6', explanation: '5 + 1 = 6.' },
  { id: 'nombres-3', prompt: 'Quel nombre vient avant 10 ?', choices: ['9', '11', '8'], answer: '9', explanation: '10 - 1 = 9.' },
  { id: 'nombres-4', prompt: 'Lequel est le plus grand ?', choices: ['12', '8', '10'], answer: '12', explanation: '12 est plus grand que 8 et 10.' },
  { id: 'nombres-5', prompt: 'Lequel est le plus petit ?', choices: ['3', '7', '5'], answer: '3', explanation: '3 est plus petit que 5 et 7.' },
  { id: 'nombres-6', prompt: 'Compte par 2 : 2, 4, 6, ... ?', choices: ['8', '7', '9'], answer: '8', explanation: '6 + 2 = 8.' },
  { id: 'nombres-7', prompt: 'Quel nombre est entre 14 et 16 ?', choices: ['15', '13', '17'], answer: '15', explanation: '14, 15, 16 : le nombre du milieu est 15.' },
  { id: 'nombres-8', prompt: 'Combien font 3 + 4 ?', choices: ['7', '6', '8'], answer: '7', explanation: '3 + 4 = 7.' },
  { id: 'nombres-9', prompt: 'Combien font 10 - 3 ?', choices: ['7', '8', '6'], answer: '7', explanation: '10 - 3 = 7.' }
];

const TEMPS_LESSONS = [
  { id: 'temps-1', prompt: 'Quel jour vient après lundi ?', choices: ['mardi', 'mercredi', 'dimanche'], answer: 'mardi', explanation: 'Lundi, mardi, mercredi...' },
  { id: 'temps-2', prompt: 'Quel jour vient avant vendredi ?', choices: ['jeudi', 'samedi', 'mercredi'], answer: 'jeudi', explanation: 'La semaine : lundi, mardi, mercredi, jeudi, vendredi...' },
  { id: 'temps-3', prompt: 'Quel est le premier jour de la semaine ?', choices: ['lundi', 'dimanche', 'samedi'], answer: 'lundi', explanation: 'En Belgique, la semaine commence le lundi.' },
  { id: 'temps-4', prompt: 'Combien de jours y a-t-il dans une semaine ?', choices: ['7', '5', '6'], answer: '7', explanation: 'Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche : 7 jours.' },
  { id: 'temps-5', prompt: 'Quel mois vient après janvier ?', choices: ['février', 'mars', 'décembre'], answer: 'février', explanation: 'Janvier, février, mars...' },
  { id: 'temps-6', prompt: 'En quelle saison fait-il chaud ?', choices: ['été', 'hiver', 'automne'], answer: 'été', explanation: 'L\'été est la saison la plus chaude.' },
  { id: 'temps-7', prompt: 'En quelle saison les feuilles tombent-elles ?', choices: ['automne', 'printemps', 'été'], answer: 'automne', explanation: 'En automne, les feuilles changent de couleur et tombent.' },
  { id: 'temps-8', prompt: 'Quel est le dernier mois de l\'année ?', choices: ['décembre', 'novembre', 'janvier'], answer: 'décembre', explanation: 'Décembre est le 12e et dernier mois.' },
  { id: 'temps-9', prompt: 'Combien de mois y a-t-il dans une année ?', choices: ['12', '10', '11'], answer: '12', explanation: 'Il y a 12 mois dans une année.' }
];

export const renforcementActivities = [
  buildSingleSectionActivity({
    id: 'renforcement-logique',
    title: 'Logique',
    engineType: 'multiple-choice',
    instructions: 'Aujourd\'hui, on travaille la logique des formes. Une consigne à la fois.',
    lessons: LOGIQUE_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-formes',
    title: 'Formes',
    engineType: 'multiple-choice',
    instructions: 'Aujourd\'hui, on travaille les figures. Une consigne à la fois.',
    lessons: FORME_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-couleurs',
    title: 'Couleurs',
    engineType: 'coloring',
    instructions: 'Colorie les formes correctement.',
    lessons: COULEUR_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-observer',
    title: 'Observer',
    engineType: 'multiple-choice',
    instructions: 'Observe bien et réponds aux questions.',
    lessons: OBSERVER_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-calcul',
    title: 'Calcul',
    engineType: 'multiple-choice',
    instructions: 'Complète les calculs correctement.',
    lessons: CALCUL_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-nombres',
    title: 'Nombres',
    engineType: 'multiple-choice',
    instructions: 'Travaille les nombres : compter, comparer et calculer.',
    lessons: NOMBRES_LESSONS
  }),
  buildSingleSectionActivity({
    id: 'renforcement-temps',
    title: 'Le temps',
    engineType: 'multiple-choice',
    instructions: 'Jours, mois et saisons : un à la fois.',
    lessons: TEMPS_LESSONS
  })
];
