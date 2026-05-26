import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const PAIRS = Object.freeze([
  { a: 'chat', b: 'souris', answer: 'chat', prompt: 'Quel animal est le plus grand ?' },
  { a: 'elephant', b: 'lapin', answer: 'elephant', prompt: 'Quel animal est le plus grand ?' },
  { a: 'crayon', b: 'gomme', answer: 'crayon', prompt: 'Quel objet est le plus long ?' },
  { a: 'arbre', b: 'fleur', answer: 'arbre', prompt: 'Quel est le plus grand ?' }
]);

export function generateObservationExercise({ grade } = {}) {
  const item = sample(PAIRS);
  const correct = item.answer;
  const wrong = [item.a, item.b].filter((value) => value !== correct);

  return createExercise({
    question: item.prompt,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'renforcement_observation',
    level: gradeToLabel(grade || 'P2'),
    explanation: `On observe: ${correct} est le bon choix.`
  });
}

