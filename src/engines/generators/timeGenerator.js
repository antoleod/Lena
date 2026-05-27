import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

export function generateTimeExercise({ grade }) {
  const hour = randomInt(1, 12);
  const half = Math.random() > 0.5;
  const isAfterVariant = grade === 'P3' && Math.random() > 0.5;
  const prompt = isAfterVariant
    ? `Quelle heure est-il 30 minutes apres ${hour} h 00 ?`
    : `Quelle heure vois-tu ? ${hour} h${half ? '30' : '00'}`;
  // 30 minutes after X h 00 → X h 30 (NOT X+1 h 00)
  const correct = isAfterVariant
    ? `${hour} h 30`
    : `${hour} h ${half ? '30' : '00'}`;
  const wrong = isAfterVariant
    ? [
      `${hour === 12 ? 1 : hour + 1} h 00`,
      `${hour === 12 ? 1 : hour + 1} h 30`,
      `${hour === 1 ? 12 : hour - 1} h 30`
    ]
    : [
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
