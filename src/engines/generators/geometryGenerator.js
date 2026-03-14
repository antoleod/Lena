import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const SHAPES = [
  { shape: 'triangle', property: '3 cotes' },
  { shape: 'carre', property: '4 cotes egaux' },
  { shape: 'rectangle', property: '2 paires de cotes egaux' },
  { shape: 'cercle', property: 'aucun cote' }
];

export function generateGeometryExercise({ grade }) {
  const item = sample(SHAPES);
  const askProperty = Math.random() > 0.5;
  const correct = askProperty ? item.property : item.shape;
  const wrong = askProperty
    ? SHAPES.filter((shape) => shape.shape !== item.shape).map((shape) => shape.property)
    : SHAPES.filter((shape) => shape.shape !== item.shape).map((shape) => shape.shape);

  return createExercise({
    question: askProperty
      ? `Quelle propriete correspond au ${item.shape} ?`
      : `Quelle figure a ${item.property} ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_geometry',
    level: gradeToLabel(grade),
    explanation: askProperty
      ? `Le ${item.shape} a ${item.property}.`
      : `La bonne figure est ${item.shape}.`
  });
}
