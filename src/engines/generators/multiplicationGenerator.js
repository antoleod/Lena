import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function multiplicationRange(grade, difficulty) {
  if (grade === 'P3' || grade === 'P4' || grade === 'P5' || grade === 'P6') {
    if (difficulty === 'hard') return [6, 12];
    if (difficulty === 'medium') return [4, 10];
    return [2, 8];
  }
  // P2
  if (difficulty === 'hard') return [3, 5];
  return [2, 3];
}

export function generateMultiplicationExercise({ grade, difficulty }) {
  const [min, max] = multiplicationRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max + 2);
  const correct = left * right;

  // Sometimes ask for missing factor: 5 x ? = 35
  const isGap = (grade === 'P3' || difficulty === 'hard') && Math.random() > 0.6;

  if (isGap) {
    const wrong = [right - 1, right + 1, right - 2, right + 2, left].filter((v) => v > 0);
    return createExercise({
      question: `${left} × ? = ${correct}`,
      options: uniqueOptions(right, wrong),
      correct: right,
      type: 'math_multiplication_gap',
      level: gradeToLabel(grade),
      explanation: `${left} fois ${right} fait ${correct}.`
    });
  }

  const wrong = [
    correct + left,
    correct - left,
    left * (right + 2),
    (left - 1) * right
  ].filter((value) => value > 0);

  return createExercise({
    question: `${left} × ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_multiplication',
    level: gradeToLabel(grade),
    explanation: `${left} × ${right} = ${correct}.`
  });
}
