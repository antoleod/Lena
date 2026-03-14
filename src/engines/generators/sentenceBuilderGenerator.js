import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const SENTENCE_PACKS = {
  fr: [
    { prompt: 'Choisis la phrase correcte.', answer: 'Je suis pret pour l ecole.', wrong: ['Je vais pret pour l ecole.', 'Je pret suis pour l ecole.', 'Je est pret pour l ecole.'] },
    { prompt: 'Complete la phrase: Nous ___ au parc.', answer: 'allons', wrong: ['allez', 'va', 'vais'] }
  ],
  en: [
    { prompt: 'Choose the correct sentence.', answer: 'She is my friend.', wrong: ['She my friend is.', 'She are my friend.', 'Is she my friend.'] },
    { prompt: 'Complete the sentence: We ___ to school.', answer: 'go', wrong: ['goes', 'going', 'is'] }
  ],
  es: [
    { prompt: 'Elige la frase correcta.', answer: 'Yo voy a la escuela.', wrong: ['Yo va a la escuela.', 'Voy yo la escuela.', 'Yo escuela a la voy.'] },
    { prompt: 'Completa: Ella ___ una historia.', answer: 'lee', wrong: ['leen', 'leer', 'leo'] }
  ],
  nl: [
    { prompt: 'Kies de juiste zin.', answer: 'Ik lees een boek.', wrong: ['Ik boek een lees.', 'Ik leest een boek.', 'Lees ik een boek.'] },
    { prompt: 'Vul aan: Wij ___ naar school.', answer: 'gaan', wrong: ['gaat', 'ga', 'is'] }
  ]
};

export function generateSentenceBuilderExercise({ grade, language }) {
  const item = sample(SENTENCE_PACKS[language] || SENTENCE_PACKS.fr);
  return createExercise({
    question: item.prompt,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'language_sentence_completion',
    level: gradeToLabel(grade),
    explanation: `${item.answer} est la structure correcte.`
  });
}
