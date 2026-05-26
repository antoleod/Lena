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
    prompt: 'Laquelle est plus grande ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'carré' }],
    choices: ['Plus de côtés', 'Plus grand', 'Plus rond'],
    answer: 'Plus grand',
    explanation: 'La taille dépend de la longueur des côtés.'
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

  // NIVEL 6: Objetos del mundo real
  {
    id: 'logique-6-1',
    prompt: 'Qué objeto parece un círculo ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Libro', 'Pelota', 'Caja'],
    answer: 'Pelota',
    explanation: 'Una pelota es redonda como un círculo.'
  },
  {
    id: 'logique-6-2',
    prompt: 'Qué objeto parece un triángulo ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triángulo' }],
    choices: ['Rebanada de pizza', 'Vaso', 'Plato'],
    answer: 'Rebanada de pizza',
    explanation: 'Una rebanada de pizza tiene forma de triángulo.'
  },
  {
    id: 'logique-6-3',
    prompt: 'Qué objeto parece un cuadrado ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['Balón de fútbol', 'Ventana', 'Pelota'],
    answer: 'Ventana',
    explanation: 'Las ventanas a menudo tienen forma de cuadrado.'
  },
  {
    id: 'logique-6-4',
    prompt: 'Qué objeto parece un rectángulo ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectángulo' }],
    choices: ['Pelota', 'Libro', 'Dado'],
    answer: 'Libro',
    explanation: 'Los libros tienen forma rectangular.'
  },
  {
    id: 'logique-6-5',
    prompt: 'Qué objeto parece un pentágono ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['Balón de fútbol', 'Casa pequeña', 'Plato hondo'],
    answer: 'Casa pequeña',
    explanation: 'Una casa vista de frente puede parecer un pentágono.'
  },
  {
    id: 'logique-6-6',
    prompt: 'Qué forma tiene una moneda ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Cuadrada', 'Triangular', 'Redonda'],
    answer: 'Redonda',
    explanation: 'Las monedas son redondas como un círculo.'
  },
  {
    id: 'logique-6-7',
    prompt: 'Qué forma tiene una estrella ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.star, alt: 'estrella' }],
    choices: ['Cuadrada', 'Con puntas', 'Redonda'],
    answer: 'Con puntas',
    explanation: 'Una estrella tiene puntas puntiagudas.'
  },

  // NIVEL 7: Combinaciones lógicas
  {
    id: 'logique-7-1',
    prompt: 'Triángulo + Carré = ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triángulo' }],
    choices: ['6 lados', '7 lados', '8 lados'],
    answer: '7 lados',
    explanation: '3 (triangle) + 4 (carré) = 7 lados.'
  },
  {
    id: 'logique-7-2',
    prompt: 'Si cuento todos los ángulos... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['4', '5', '6'],
    answer: '4',
    explanation: 'Un cuadrado tiene 4 ángulos en las 4 esquinas.'
  },
  {
    id: 'logique-7-3',
    prompt: 'Forma sin ángulos ni lados... cuál ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Triángulo', 'Rectángulo', 'Círculo'],
    answer: 'Círculo',
    explanation: 'El círculo es la única forma sin ángulos ni lados.'
  },
  {
    id: 'logique-7-4',
    prompt: 'Cuadrado girado = ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'rombo' }],
    choices: ['Rombo', 'Triángulo', 'Rectángulo'],
    answer: 'Rombo',
    explanation: 'Un cuadrado girado 45 grados se ve como un rombo.'
  },
  {
    id: 'logique-7-5',
    prompt: 'Pentagono tiene más de 4 lados? Verdadero',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['Verdadero', 'Falso', 'No es una forma'],
    answer: 'Verdadero',
    explanation: 'Pentágono = 5 lados, que es más que 4.'
  },
  {
    id: 'logique-7-6',
    prompt: 'Rectángulo = Cuadrado? ',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.rectangle, alt: 'rectángulo' }],
    choices: ['Sí', 'No', 'A veces'],
    answer: 'No',
    explanation: 'No son iguales. Rectángulo tiene lados diferentes, cuadrado tiene iguales.'
  },
  {
    id: 'logique-7-7',
    prompt: 'Todas las formas con 4 lados son... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'rombo' }],
    choices: ['Cuadrados', 'Diferentes', 'Rectángulos'],
    answer: 'Diferentes',
    explanation: 'Hay muchos tipos de formas con 4 lados (cuadrado, rectángulo, rombo, trapecio).'
  },

  // NIVEL 8: Patrones y secuencias
  {
    id: 'logique-8-1',
    prompt: '3 lados, 4 lados, ? lados',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['5 lados', '6 lados', '7 lados'],
    answer: '5 lados',
    explanation: 'La secuencia aumenta de 1 en 1: 3, 4, 5...'
  },
  {
    id: 'logique-8-2',
    prompt: 'Patrón: círculo (0), triángulo (3), ? ',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['Cuadrado (4)', 'Rectángulo (4)', 'Pentagono (5)'],
    answer: 'Cuadrado (4)',
    explanation: '0, 3, 4 sigue una lógica creciente.'
  },
  {
    id: 'logique-8-3',
    prompt: 'Si aumentamos lados, la forma se parece más a... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['Un triángulo', 'Un círculo', 'Una línea'],
    answer: 'Un círculo',
    explanation: 'Mientras más lados, más se parece a un círculo redondo.'
  },
  {
    id: 'logique-8-4',
    prompt: 'Orden: círculo, ?, ?, cuadrado (lógica de lados)',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Triángulo, Pentagono', 'Pentagono, Triángulo', 'Línea, Punto'],
    answer: 'Triángulo, Pentagono',
    explanation: 'Orden lógico: 0 lados (círculo), 3 (triángulo), 5 (pentágono), infinitos (círculo).'
  },
  {
    id: 'logique-8-5',
    prompt: 'Todas las formas con ángulos excepto ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Triángulo', 'Círculo', 'Rectángulo'],
    answer: 'Círculo',
    explanation: 'Todas las formas poligonales (triángulo, cuadrado, etc.) tienen ángulos, excepto el círculo.'
  },
  {
    id: 'logique-8-6',
    prompt: 'Patrón de lados: 3, 4, 5, ?, ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['6, 7', '5, 5', '4, 3'],
    answer: '6, 7',
    explanation: 'La secuencia sigue: +1 cada vez: 3, 4, 5, 6, 7...'
  },
  {
    id: 'logique-8-7',
    prompt: 'Menor a mayor: Triángulo, Carré, ? ',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['Círculo', 'Pentágono', 'Rectángulo'],
    answer: 'Pentágono',
    explanation: 'Orden por número de lados: 3 (triángulo), 4 (carré), 5 (pentágono).'
  },

  // NIVEL 9: Razonamiento deductivo
  {
    id: 'logique-9-1',
    prompt: 'Una forma con 4 ángulos, ¿cuántos lados tiene?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['3', '4', '5'],
    answer: '4',
    explanation: 'Si hay 4 ángulos, hay 4 lados (uno en cada esquina).'
  },
  {
    id: 'logique-9-2',
    prompt: 'Una forma redonda sin ángulos es... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Triángulo', 'Círculo', 'Cuadrado'],
    answer: 'Círculo',
    explanation: 'Solo el círculo es redondo y sin ángulos.'
  },
  {
    id: 'logique-9-3',
    prompt: 'Si una forma tiene 3 ángulos, tiene cuántos lados ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triángulo' }],
    choices: ['2', '3', '4'],
    answer: '3',
    explanation: 'Ángulos = Lados en polígonos. 3 ángulos = 3 lados.'
  },
  {
    id: 'logique-9-4',
    prompt: 'Una forma con todos los lados iguales es... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.diamond, alt: 'rombo' }],
    choices: ['Rectángulo', 'Rombo', 'Triángulo'],
    answer: 'Rombo',
    explanation: 'El rombo y el cuadrado tienen todos los lados iguales.'
  },
  {
    id: 'logique-9-5',
    prompt: 'Una forma con ángulos desiguales es más... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triángulo' }],
    choices: ['Regular', 'Irregular', 'Simetrica'],
    answer: 'Irregular',
    explanation: 'Si los ángulos no son iguales, la forma es irregular.'
  },
  {
    id: 'logique-9-6',
    prompt: 'Conclusión: Círculo es diferente de polígonos porque... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['No tiene ángulos', 'No tiene lados', 'No es ronda'],
    answer: 'No tiene ángulos',
    explanation: 'Los polígonos (formas con lados) tienen ángulos. El círculo no.'
  },
  {
    id: 'logique-9-7',
    prompt: 'Un cuadrado es un caso especial de... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['Triángulo', 'Rectángulo', 'Círculo'],
    answer: 'Rectángulo',
    explanation: 'El cuadrado es un rectángulo donde todos los lados son iguales.'
  },

  // NIVEL 10: Pensamiento abstracto
  {
    id: 'logique-10-1',
    prompt: 'Si combino triángulo + cuadrado, tengo... lados',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.triangle, alt: 'triángulo' }],
    choices: ['7', '8', '12'],
    answer: '7',
    explanation: '3 (triángulo) + 4 (cuadrado) = 7 lados en total.'
  },
  {
    id: 'logique-10-2',
    prompt: 'Una forma sin fin de lados es... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Triángulo', 'Círculo', 'Polígono'],
    answer: 'Círculo',
    explanation: 'El círculo tiene infinitos lados microscópicos (es la curva infinita).'
  },
  {
    id: 'logique-10-3',
    prompt: 'La forma más eficiente para rol/movimiento es... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Cuadrado', 'Triángulo', 'Círculo'],
    answer: 'Círculo',
    explanation: 'El círculo es la forma más redonda y rueda sin esfuerzo.'
  },
  {
    id: 'logique-10-4',
    prompt: 'La forma más estable con 4 puntos de contacto es... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['Triángulo', 'Cuadrado', 'Círculo'],
    answer: 'Cuadrado',
    explanation: 'El cuadrado es estable en una mesa con sus 4 esquinas.'
  },
  {
    id: 'logique-10-5',
    prompt: 'Si aumentas infinitamente los lados de un polígono, se convierte en... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.pentagon, alt: 'pentágono' }],
    choices: ['Triángulo', 'Círculo', 'Línea'],
    answer: 'Círculo',
    explanation: 'Cuando un polígono tiene infinitos lados pequeños, se ve como un círculo.'
  },
  {
    id: 'logique-10-6',
    prompt: 'Las simetrias en un cuadrado... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.square, alt: 'cuadrado' }],
    choices: ['2', '4', '8'],
    answer: '4',
    explanation: 'Un cuadrado tiene 4 ejes de simetría (horizontal, vertical, 2 diagonales).'
  },
  {
    id: 'logique-10-7',
    prompt: 'Una forma que caben infinitas dentro de otra... ?',
    contextSlots: [{ kind: 'svg', markup: SHAPE_SVG_MARKUP.circle, alt: 'círculo' }],
    choices: ['Dos cuadrados', 'Triángulos en un círculo', 'Nada en un triángulo'],
    answer: 'Triángulos en un círculo',
    explanation: 'Puedes encajar infinitos triángulos pequeños dentro de un círculo.'
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
  })
];
