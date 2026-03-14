import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function comparisonRange(grade, difficulty) {
  if (grade === 'P3') {
    if (difficulty === 'hard') return [120, 950];
    if (difficulty === 'medium') return [90, 700];
    return [30, 350];
  }

  if (difficulty === 'hard') return [20, 120];
  if (difficulty === 'medium') return [10, 80];
  return [1, 50];
}

export function generateComparisonExercise({ grade, difficulty, language }) {
  const [min, max] = comparisonRange(grade, difficulty);
  const first = randomInt(min, max);
  const second = randomInt(min, max);
  const askGreater = Math.random() > 0.5;
  const correct = askGreater ? Math.max(first, second) : Math.min(first, second);
  const question = language === 'nl'
    ? `Welk getal is ${askGreater ? 'groter' : 'kleiner'}?`
    : `Quel nombre est ${askGreater ? 'le plus grand' : 'le plus petit'} ?`;

  return createExercise({
    question,
    options: uniqueOptions(correct, [first, second, correct + 1, correct - 1].filter((value) => value >= 0)),
    correct,
    type: 'math_number_comparison',
    level: gradeToLabel(grade),
    context: [String(first), String(second)],
    explanation: language === 'nl' ? `${correct} is het juiste antwoord.` : `${correct} est la bonne reponse.`
  });
}
