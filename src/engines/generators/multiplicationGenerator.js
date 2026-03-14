import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function multiplicationRange(grade, difficulty) {
  if (grade === 'P2') {
    if (difficulty === 'hard') return [2, 5];
    return [2, 3];
  }

  if (difficulty === 'hard') return [4, 9];
  if (difficulty === 'medium') return [2, 8];
  return [2, 5];
}

export function generateMultiplicationExercise({ grade, difficulty }) {
  const [min, max] = multiplicationRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max + 1);
  const correct = left * right;
  const wrong = [correct + left, correct - left, left + right, correct + 2].filter((value) => value >= 0);

  return createExercise({
    question: `${left} x ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_multiplication',
    level: gradeToLabel(grade),
    explanation: `${left} x ${right} = ${correct}.`
  });
}
