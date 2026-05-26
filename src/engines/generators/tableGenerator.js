import { createExercise, gradeToLabel, randomInt, uniqueOptions } from './generatorUtils.js';

function buildTableQuestion() {
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  return { a, b, result: a * b };
}

function wrongTableAnswers(correct) {
  const value = Number(correct);
  const deltas = [-4, -3, -2, -1, 1, 2, 3, 4];
  return deltas
    .map((delta) => value + delta)
    .filter((n) => n >= 0 && n !== value)
    .map(String);
}

export function generateTableExercise({ grade } = {}) {
  const { a, b, result } = buildTableQuestion();
  const correct = String(result);

  return createExercise({
    question: `Combien font ${a} × ${b} ?`,
    options: uniqueOptions(correct, wrongTableAnswers(correct)),
    correct,
    type: 'renforcement_tables',
    level: gradeToLabel(grade || 'P2'),
    explanation: `${a} × ${b} = ${correct}.`
  });
}

