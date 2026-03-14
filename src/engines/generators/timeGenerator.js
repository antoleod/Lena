import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

export function generateTimeExercise({ grade }) {
  const hour = randomInt(1, 12);
  const half = Math.random() > 0.5;
  const prompt = grade === 'P3' && Math.random() > 0.5
    ? `Quel moment dure 30 minutes apres ${hour} h ?`
    : `Quelle heure vois-tu ? ${hour} h${half ? '30' : '00'}`;
  const correct = grade === 'P3' && prompt.includes('30 minutes apres')
    ? `${hour === 12 ? 1 : hour + 1} h 00`
    : `${hour} h ${half ? '30' : '00'}`;
  const wrong = [
    `${hour} h ${half ? '00' : '30'}`,
    `${hour === 12 ? 1 : hour + 1} h ${half ? '00' : '30'}`,
    `${hour === 1 ? 12 : hour - 1} h 30`
  ];

  return createExercise({
    question: prompt,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_time',
    level: gradeToLabel(grade),
    explanation: `La bonne lecture est ${correct}.`
  });
}
