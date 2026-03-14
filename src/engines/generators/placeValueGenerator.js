import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

export function generatePlaceValueExercise({ grade }) {
  if (grade === 'P3') {
    const hundreds = randomInt(1, 9);
    const tens = randomInt(0, 9);
    const ones = randomInt(0, 9);
    const correct = `${hundreds} centaines, ${tens} dizaines, ${ones} unites`;
    const wrong = [
      `${tens} centaines, ${hundreds} dizaines, ${ones} unites`,
      `${hundreds} centaines, ${ones} dizaines, ${tens} unites`,
      `${hundreds * 100 + tens} dizaines, ${ones} unites`
    ];

    return createExercise({
      question: `Decompose ${hundreds}${tens}${ones}.`,
      options: uniqueOptions(correct, wrong),
      correct,
      type: 'math_place_value',
      level: gradeToLabel(grade),
      explanation: `${hundreds}${tens}${ones} = ${correct}.`
    });
  }

  const tens = randomInt(1, 9);
  const ones = randomInt(0, 9);
  const correct = `${tens} dizaines et ${ones} unites`;
  const wrong = [
    `${ones} dizaines et ${tens} unites`,
    `${tens + ones} dizaines`,
    `${tens} unites et ${ones} dizaines`
  ];

  return createExercise({
    question: `Comment lire ${tens}${ones} ?`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'math_place_value',
    level: gradeToLabel(grade),
    explanation: `${tens}${ones} contient ${tens} dizaines et ${ones} unites.`
  });
}
