import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const LOGIC_TASKS = [
  {
    prompt: 'Quel element ne va pas avec les autres ?',
    answer: 'triangle',
    wrong: ['rouge', 'bleu', 'vert'],
    explanation: 'Triangle est une forme, les autres sont des couleurs.'
  },
  {
    prompt: 'Que faut-il pour completer la serie cercle, carre, cercle, carre, ... ?',
    answer: 'cercle',
    wrong: ['triangle', 'etoile', 'rectangle'],
    explanation: 'Le motif alterne cercle puis carre.'
  },
  {
    prompt: 'Quel objet peut aller dans la categorie "ecole" ?',
    answer: 'crayon',
    wrong: ['banane', 'oreiller', 'savon'],
    explanation: 'Crayon appartient a la categorie ecole.'
  }
];

export function generateLogicExercise({ grade }) {
  const item = sample(LOGIC_TASKS);
  return createExercise({
    question: item.prompt,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'logic_reasoning',
    level: gradeToLabel(grade),
    explanation: item.explanation
  });
}
