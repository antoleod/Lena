import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function additionRange(grade, difficulty) {
  if (grade !== 'P2') {
    if (difficulty === 'hard') return [20, 80];
    if (difficulty === 'medium') return [10, 60];
    return [5, 30];
  }

  if (difficulty === 'hard') return [8, 25];
  if (difficulty === 'medium') return [4, 20];
  return [1, 12];
}

export function generateAdditionExercise({ grade, difficulty }) {
  const [min, max] = additionRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max);
  const correct = left + right;
  const wrong = [correct - 1, correct + 1, correct + right, left + 1].filter((value) => value >= 0);

  return createExercise({
    question: `${left} + ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_addition',
    level: gradeToLabel(grade),
    explanation: `${left} + ${right} = ${correct}.`
  });
}
