import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

function additionRange(grade, difficulty) {
  if (grade === 'P3') {
    if (difficulty === 'hard') return [50, 500];
    if (difficulty === 'medium') return [20, 150];
    return [10, 80];
  }
  if (grade === 'P2') {
    if (difficulty === 'hard') return [15, 50];
    if (difficulty === 'medium') return [5, 25];
    return [1, 15];
  }
  // Fallback for P4+
  return [100, 1000];
}

export function generateAdditionExercise({ grade, difficulty }) {
  const [min, max] = additionRange(grade, difficulty);
  const left = randomInt(min, max);
  const right = randomInt(min, max);
  const correct = left + right;

  // For P3/hard, sometimes do gap filling: left + ? = correct
  const isGap = (grade === 'P3' || difficulty === 'hard') && Math.random() > 0.6;

  if (isGap) {
    const wrong = [right - 10, right + 10, right - 1, right + 1].filter((v) => v > 0);
    return createExercise({
      question: `${left} + ? = ${correct}`,
      options: uniqueOptions(right, wrong),
      correct: right,
      type: 'math_addition_gap',
      level: gradeToLabel(grade),
      explanation: `Pour trouver le nombre manquant, on fait ${correct} - ${left} = ${right}.`
    });
  }

  const wrong = [
    correct - 10,
    correct + 10,
    correct - 1,
    correct + 1,
    left + right + 5
  ].filter((v) => v > 0);

  return createExercise({
    question: `${left} + ${right} = ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_addition',
    level: gradeToLabel(grade),
    explanation: `${left} + ${right} = ${correct}.`
  });
}
