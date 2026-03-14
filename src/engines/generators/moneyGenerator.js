import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

export function generateMoneyExercise({ grade }) {
  const first = randomInt(grade === 'P3' ? 20 : 1, grade === 'P3' ? 80 : 15);
  const second = randomInt(grade === 'P3' ? 5 : 1, grade === 'P3' ? 40 : 10);
  const total = first + second;
  const askChange = grade === 'P3' && Math.random() > 0.5;
  const paid = askChange ? total + randomInt(5, 20) : null;
  const correct = askChange ? paid - total : total;
  const question = askChange
    ? `Tu achetes pour ${total} c et tu donnes ${paid} c. Quelle monnaie recois-tu ?`
    : `Combien font ${first} c + ${second} c ?`;
  const wrong = [correct + 5, correct - 5, total, first].filter((value) => value >= 0);

  return createExercise({
    question,
    options: uniqueOptions(`${correct} c`, wrong.map((value) => `${value} c`)),
    correct: `${correct} c`,
    type: 'math_money',
    level: gradeToLabel(grade),
    explanation: askChange ? `${paid} c - ${total} c = ${correct} c.` : `${first} c + ${second} c = ${correct} c.`
  });
}
