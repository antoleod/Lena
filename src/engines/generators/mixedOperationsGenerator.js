import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

const CONTEXTS = [
  { name: 'La boulangerie', story: (a, b, c) => `Une boulangerie prépare ${a} croissants, ${b} pains et ${c} brioches.` },
  { name: 'La bibliothèque', story: (a, b, c) => `La bibliothèque a ${a} livres de science, ${b} romans et ${c} BD.` },
  { name: 'Le marché', story: (a, b, c) => `Au marché, il y a ${a} pommes, ${b} oranges et ${c} bananes.` }
];

export function generateMixedOperationsExercise({ grade, difficulty }) {
  const type = sample(['add-then-subtract', 'multiply-then-add', 'multi-step', 'order-of-ops']);

  if (type === 'add-then-subtract') {
    const a = randomInt(20, difficulty === 'hard' ? 200 : 80);
    const b = randomInt(10, difficulty === 'hard' ? 100 : 50);
    const c = randomInt(5, difficulty === 'hard' ? 80 : 30);
    const correct = a + b - c;
    const ctx = sample(CONTEXTS);
    return createExercise({
      question: `${ctx.story(a, b, c)} On en retire ${c}. Combien en reste-t-il en tout ?`,
      options: uniqueOptions(correct, [correct + 1, correct - 1, a + b, correct + c].filter((v) => v > 0 && v !== correct)),
      correct,
      type: 'mixed_add_subtract',
      level: gradeToLabel(grade),
      explanation: `${a} + ${b} = ${a + b}, puis ${a + b} - ${c} = ${correct}.`
    });
  }

  if (type === 'multiply-then-add') {
    const a = randomInt(2, difficulty === 'hard' ? 12 : 6);
    const b = randomInt(3, difficulty === 'hard' ? 10 : 6);
    const c = randomInt(1, difficulty === 'hard' ? 30 : 10);
    const correct = a * b + c;
    return createExercise({
      question: `Il y a ${a} rangées de ${b} élèves, plus ${c} élèves supplémentaires. Combien y a-t-il d'élèves en tout ?`,
      options: uniqueOptions(correct, [a * b, correct + b, correct - c, correct + 1].filter((v) => v > 0 && v !== correct)),
      correct,
      type: 'mixed_multiply_add',
      level: gradeToLabel(grade),
      explanation: `${a} × ${b} = ${a * b}, puis + ${c} = ${correct}.`
    });
  }

  if (type === 'order-of-ops') {
    const a = randomInt(2, 8);
    const b = randomInt(2, 6);
    const c = randomInt(2, 8);
    const correct = a + b * c;
    return createExercise({
      question: `Calcule : ${a} + ${b} × ${c} = ?`,
      options: uniqueOptions(correct, [(a + b) * c, a * b + c, correct + 1, correct - b].filter((v) => v !== correct)),
      correct,
      type: 'mixed_order_ops',
      level: gradeToLabel(grade),
      explanation: `La multiplication se fait en premier : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${correct}.`
    });
  }

  // multi-step
  const total = randomInt(difficulty === 'hard' ? 100 : 30, difficulty === 'hard' ? 300 : 80);
  const groups = randomInt(3, 6);
  const perGroup = Math.floor(total / groups);
  const remainder = total - perGroup * groups;
  const correct = perGroup;
  return createExercise({
    question: `${total} élèves sont répartis en ${groups} groupes égaux${remainder > 0 ? ` (il reste ${remainder} élève(s) en extra)` : ''}. Combien y a-t-il d'élèves par groupe ?`,
    options: uniqueOptions(correct, [correct + 1, correct - 1, correct + 2, groups].filter((v) => v > 0 && v !== correct)),
    correct,
    type: 'mixed_multi_step',
    level: gradeToLabel(grade),
    explanation: `On divise : ${total - remainder} ÷ ${groups} = ${correct} par groupe.`
  });
}
