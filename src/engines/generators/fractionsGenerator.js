import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

const FRACTION_CONTEXTS = [
  { item: 'pizza', preposition: 'de la' },
  { item: 'tarte', preposition: 'de la' },
  { item: 'gateau', preposition: 'du' },
  { item: 'ruban', preposition: 'du' },
  { item: 'barre de chocolat', preposition: 'de la' }
];

function simpleDenominators(difficulty) {
  if (difficulty === 'hard') return [3, 4, 5, 6, 8, 10];
  if (difficulty === 'medium') return [2, 3, 4, 5];
  return [2, 3, 4];
}

export function generateFractionsExercise({ grade, difficulty }) {
  const denoms = simpleDenominators(difficulty);
  const denom = sample(denoms);
  const numer = randomInt(1, denom - 1);
  const type = sample(['identify', 'compare', 'equivalent', 'simplify']);

  if (type === 'identify') {
    const ctx = sample(FRACTION_CONTEXTS);
    return createExercise({
      question: `On partage ${ctx.preposition} ${ctx.item} en ${denom} parts égales. On prend ${numer} part(s). Quelle fraction cela représente-t-il ?`,
      options: uniqueOptions(`${numer}/${denom}`, [
        `${denom}/${numer}`,
        `${numer + 1}/${denom}`,
        `${numer}/${denom + 1}`
      ]),
      correct: `${numer}/${denom}`,
      type: 'fractions_identify',
      level: gradeToLabel(grade),
      explanation: `On a ${numer} part(s) sur ${denom} au total, donc la fraction est ${numer}/${denom}.`
    });
  }

  if (type === 'compare') {
    const denom2 = sample(denoms.filter((d) => d !== denom));
    const numer2 = randomInt(1, denom2 - 1);
    const val1 = numer / denom;
    const val2 = numer2 / denom2;
    const bigger = val1 >= val2 ? `${numer}/${denom}` : `${numer2}/${denom2}`;
    const smaller = val1 < val2 ? `${numer}/${denom}` : `${numer2}/${denom2}`;
    return createExercise({
      question: `Quelle fraction est la plus grande : ${numer}/${denom} ou ${numer2}/${denom2} ?`,
      options: uniqueOptions(bigger, [smaller, `${numer + numer2}/${denom + denom2}`, `${denom}/${numer}`]),
      correct: bigger,
      type: 'fractions_compare',
      level: gradeToLabel(grade),
      explanation: `${numer}/${denom} ≈ ${val1.toFixed(2)} et ${numer2}/${denom2} ≈ ${val2.toFixed(2)}. La plus grande est ${bigger}.`
    });
  }

  if (type === 'equivalent') {
    const mult = randomInt(2, 4);
    const newNumer = numer * mult;
    const newDenom = denom * mult;
    return createExercise({
      question: `Quelle fraction est équivalente à ${numer}/${denom} ?`,
      options: uniqueOptions(`${newNumer}/${newDenom}`, [
        `${newNumer + 1}/${newDenom}`,
        `${numer + 1}/${denom}`,
        `${newNumer}/${newDenom + 1}`
      ]),
      correct: `${newNumer}/${newDenom}`,
      type: 'fractions_equivalent',
      level: gradeToLabel(grade),
      explanation: `On multiplie numérateur et dénominateur par ${mult} : ${numer}×${mult}/${denom}×${mult} = ${newNumer}/${newDenom}.`
    });
  }

  // simplify
  const mult2 = randomInt(2, 3);
  const bigNumer = numer * mult2;
  const bigDenom = denom * mult2;
  return createExercise({
    question: `Quelle est la forme simplifiée de ${bigNumer}/${bigDenom} ?`,
    options: uniqueOptions(`${numer}/${denom}`, [
      `${numer + 1}/${denom}`,
      `${bigNumer}/${bigDenom + 1}`,
      `${numer}/${denom + 1}`
    ]),
    correct: `${numer}/${denom}`,
    type: 'fractions_simplify',
    level: gradeToLabel(grade),
    explanation: `On divise numérateur et dénominateur par ${mult2} : ${bigNumer}÷${mult2}/${bigDenom}÷${mult2} = ${numer}/${denom}.`
  });
}
