import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function divisionRange(grade, difficulty) {
  if (grade === 'P2') {
    if (difficulty === 'hard') return [2, 5];
    return [2, 3];
  }

  if (difficulty === 'hard') return [4, 9];
  if (difficulty === 'medium') return [2, 8];
  return [2, 5];
}

export function generateDivisionExercise({ grade, difficulty }) {
  const [min, max] = divisionRange(grade, difficulty);
  const divisor = randomInt(min, max);
  const quotient = randomInt(min, max + 1);
  const dividend = divisor * quotient;
  const wrong = [quotient + 1, quotient - 1, divisor, dividend].filter((value) => value >= 0);

  return createExercise({
    question: `${dividend} / ${divisor} = ?`,
    options: uniqueOptions(quotient, wrong),
    correct: quotient,
    type: 'math_division',
    level: gradeToLabel(grade),
    explanation: `${dividend} partage en groupes de ${divisor} donne ${quotient}.`
  });
}
