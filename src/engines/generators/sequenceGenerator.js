import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

export function generateSequenceExercise({ grade, difficulty, language }) {
  const start = randomInt(grade === 'P3' ? 3 : 1, grade === 'P3' ? 12 : 8);
  const step = randomInt(grade === 'P3' ? 3 : 2, difficulty === 'hard' ? 9 : 6);
  const sequence = [start, start + step, start + step * 2, start + step * 3];
  const correct = start + step * 4;
  const wrong = [correct - 1, correct + 1, sequence[3] + step + 2].filter((value) => value >= 0);

  return createExercise({
    question: language === 'nl' ? 'Maak de reeks af.' : 'Complete la suite.',
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'logic_sequence',
    level: gradeToLabel(grade),
    context: [sequence.join(', ') + ', ?'],
    explanation: language === 'nl' ? `We tellen telkens ${step} erbij.` : `On ajoute ${step} a chaque fois.`
  });
}
