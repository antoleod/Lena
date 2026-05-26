import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const COLORS = Object.freeze([
  { id: 'rouge', label: 'rouge' },
  { id: 'bleu', label: 'bleu' },
  { id: 'jaune', label: 'jaune' },
  { id: 'vert', label: 'vert' },
  { id: 'orange', label: 'orange' },
  { id: 'rose', label: 'rose' }
]);

const OBJECTS = Object.freeze([
  { object: 'banane', color: 'jaune' },
  { object: 'herbe', color: 'vert' },
  { object: 'ciel', color: 'bleu' },
  { object: 'carotte', color: 'orange' }
]);

export function generateColoringExercise({ grade } = {}) {
  const mode = Math.random() > 0.5 ? 'object' : 'pick';
  const item = sample(OBJECTS);
  const correct = mode === 'object' ? item.color : sample(COLORS).label;
  const wrong = COLORS.filter((c) => c.label !== correct).map((c) => c.label);

  return createExercise({
    question: mode === 'object'
      ? `Quelle couleur va bien avec ${item.object} ?`
      : `Choisis la couleur ${correct}.`,
    options: uniqueOptions(correct, wrong),
    correct,
    type: 'renforcement_colors',
    level: gradeToLabel(grade || 'P2'),
    engineType: 'coloring',
    renderType: 'multiple-choice',
    explanation: mode === 'object'
      ? `On dit souvent ${item.object} ${correct}.`
      : `Tu as choisi ${correct}.`
  });
}

