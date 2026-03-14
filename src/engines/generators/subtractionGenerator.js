import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function subtractionRange(grade, difficulty) {
  if (grade !== 'P2') {
    if (difficulty === 'hard') return [30, 90];
    if (difficulty === 'medium') return [15, 70];
    return [8, 40];
  }

  if (difficulty === 'hard') return [12, 40];
  if (difficulty === 'medium') return [8, 25];
  return [4, 18];
}

export function generateSubtractionExercise({ grade, difficulty }) {
  const [min, max] = subtractionRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(1, Math.max(2, Math.floor(left * 0.6)));
  const correct = left - right;
  const wrong = [correct + 1, correct - 1, left + right, right].filter((value) => value >= 0);

  return createExercise({
    question: `${left} - ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_subtraction',
    level: gradeToLabel(grade),
    explanation: `${left} - ${right} = ${correct}.`
  });
}
