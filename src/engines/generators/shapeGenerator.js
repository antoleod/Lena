import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const SHAPES = Object.freeze([
  { label: 'triangle', sides: 3, angles: 3 },
  { label: 'carre', sides: 4, angles: 4 },
  { label: 'rectangle', sides: 4, angles: 4 },
  { label: 'cercle', sides: 0, angles: 0 }
]);

function shapeLabelWithArticle(shapeLabel) {
  if (shapeLabel === 'triangle') return 'un triangle';
  if (shapeLabel === 'carre') return 'un carre';
  if (shapeLabel === 'rectangle') return 'un rectangle';
  if (shapeLabel === 'cercle') return 'un cercle';
  return `un ${shapeLabel}`;
}

function distractorNumbers(correct) {
  const base = [0, 1, 2, 3, 4, 5, 6, 8];
  return base.filter((n) => n !== correct).map(String);
}

export function generateShapeRecognitionExercise({ grade } = {}) {
  const item = sample(SHAPES);
  const correct = item.label;
  const wrong = SHAPES.filter((shape) => shape.label !== item.label).map((shape) => shape.label);

  return createExercise({
    question: `Quelle figure est ${shapeLabelWithArticle(item.label)} ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'renforcement_shapes',
    level: gradeToLabel(grade || 'P2'),
    explanation: `On reconnait ${shapeLabelWithArticle(item.label)}.`
  });
}

export function generateCountSidesExercise({ grade } = {}) {
  const item = sample(SHAPES);
  const correct = String(item.sides);

  return createExercise({
    question: `Combien de cotes a ${shapeLabelWithArticle(item.label)} ?`,
    options: uniqueOptions(correct, distractorNumbers(item.sides)),
    correct,
    type: 'renforcement_shapes',
    level: gradeToLabel(grade || 'P2'),
    explanation: `${shapeLabelWithArticle(item.label)} a ${correct} cote${correct === '1' ? '' : 's'}.`
  });
}

export function generateCountAnglesExercise({ grade } = {}) {
  const item = sample(SHAPES);
  const correct = String(item.angles);

  return createExercise({
    question: `Combien d angles a ${shapeLabelWithArticle(item.label)} ?`,
    options: uniqueOptions(correct, distractorNumbers(item.angles)),
    correct,
    type: 'renforcement_shapes',
    level: gradeToLabel(grade || 'P2'),
    explanation: `${shapeLabelWithArticle(item.label)} a ${correct} angle${correct === '1' ? '' : 's'}.`
  });
}

export function generateShapeExercise({ grade, difficulty } = {}) {
  const picker = difficulty === 'hard'
    ? sample([generateCountSidesExercise, generateCountAnglesExercise])
    : difficulty === 'medium'
      ? sample([generateShapeRecognitionExercise, generateCountSidesExercise])
      : generateShapeRecognitionExercise;

  return picker({ grade });
}

