import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function randDecimal(intMin, intMax, decMin, decMax) {
  const intPart = randomInt(intMin, intMax);
  const decPart = randomInt(decMin, decMax);
  return parseFloat(`${intPart}.${decPart}`);
}

export function generateDecimalsExercise({ grade, difficulty }) {
  const type = Math.random() < 0.4 ? 'addition' : Math.random() < 0.6 ? 'comparison' : 'place-value';

  if (type === 'addition') {
    const a = randDecimal(1, difficulty === 'hard' ? 20 : 9, 1, 9);
    const b = randDecimal(1, difficulty === 'hard' ? 10 : 5, 1, 9);
    const correct = Math.round((a + b) * 10) / 10;
    return createExercise({
      question: `Calcule : ${a} + ${b} = ?`,
      options: uniqueOptions(correct, [
        Math.round((correct + 0.1) * 10) / 10,
        Math.round((correct - 0.1) * 10) / 10,
        Math.round((correct + 1) * 10) / 10
      ].filter((v) => v > 0 && v !== correct)),
      correct,
      type: 'decimals_addition',
      level: gradeToLabel(grade),
      explanation: `On aligne les dixièmes : ${a} + ${b} = ${correct}.`
    });
  }

  if (type === 'comparison') {
    const a = randDecimal(1, 9, 1, 9);
    const b = randDecimal(1, 9, 1, 9);
    if (Math.abs(a - b) < 0.01) {
      return generateDecimalsExercise({ grade, difficulty });
    }
    const bigger = a > b ? a : b;
    return createExercise({
      question: `Quel nombre est le plus grand : ${a} ou ${b} ?`,
      options: uniqueOptions(bigger, [a === bigger ? b : a, bigger + 0.1, bigger - 0.2].filter((v) => v > 0)),
      correct: bigger,
      type: 'decimals_comparison',
      level: gradeToLabel(grade),
      explanation: `${a} et ${b} : on compare les dixièmes. Le plus grand est ${bigger}.`
    });
  }

  // place-value
  const whole = randomInt(1, 9);
  const dec = randomInt(1, 9);
  const num = parseFloat(`${whole}.${dec}`);
  const questions = [
    {
      q: `Dans le nombre ${num}, que représente le chiffre ${dec} ?`,
      correct: `${dec} dixième(s)`,
      wrong: [`${dec} unité(s)`, `${dec} centième(s)`, `${whole} dizaine(s)`]
    },
    {
      q: `Quel est le chiffre des dixièmes dans ${num} ?`,
      correct: `${dec}`,
      wrong: [`${whole}`, `${dec + 1}`, `${Math.max(1, dec - 1)}`]
    }
  ];
  const chosen = questions[randomInt(0, questions.length - 1)];
  return createExercise({
    question: chosen.q,
    options: uniqueOptions(chosen.correct, chosen.wrong),
    correct: chosen.correct,
    type: 'decimals_place_value',
    level: gradeToLabel(grade),
    explanation: `Dans ${num}, la partie après la virgule (${dec}) représente des dixièmes.`
  });
}
