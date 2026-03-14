function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function uniqueOptions(correct, wrongOptions) {
  const seen = new Set([String(correct)]);
  const wrong = [];

  wrongOptions.forEach((option) => {
    const key = String(option);
    if (!seen.has(key)) {
      seen.add(key);
      wrong.push(option);
    }
  });

  return shuffle([correct, ...shuffle(wrong).slice(0, 3)]);
}

const GRADE_LABELS = {
  P2: '2nd_grade',
  P3: '3rd_grade',
  P4: '4th_grade',
  P5: '5th_grade',
  P6: '6th_grade'
};

function gradeToLabel(grade) {
  return GRADE_LABELS[grade] || grade;
}

function createExercise(base) {
  return {
    ...base,
    prompt: base.question,
    choices: base.options,
    answer: base.correct,
    renderType: base.renderType || 'multiple-choice',
    engineType: base.engineType || 'multiple-choice'
  };
}

export {
  createExercise,
  gradeToLabel,
  randomInt,
  sample,
  shuffle,
  uniqueOptions
};
