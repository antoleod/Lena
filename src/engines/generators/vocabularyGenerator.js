import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const PACKS = {
  fr: [
    { prompt: 'Choisis le mot de l ecole.', answer: 'cartable', wrong: ['nuage', 'poisson', 'train'] },
    { prompt: 'Choisis un mot de nourriture.', answer: 'banane', wrong: ['cahier', 'lampe', 'banc'] },
    { prompt: 'Choisis une emotion.', answer: 'joie', wrong: ['cuillere', 'fenetre', 'chaussure'] }
  ],
  nl: [
    { prompt: 'Welk woord hoort bij school?', answer: 'boek', wrong: ['regen', 'soep', 'boom'] },
    { prompt: 'Kies een dier.', answer: 'kat', wrong: ['stoel', 'klok', 'tas'] },
    { prompt: 'Kies een gevoel.', answer: 'blij', wrong: ['brood', 'jas', 'plant'] }
  ],
  en: [
    { prompt: 'Choose the animal word.', answer: 'rabbit', wrong: ['table', 'window', 'school'] },
    { prompt: 'Choose the color word.', answer: 'purple', wrong: ['bread', 'garden', 'teacher'] },
    { prompt: 'Choose a family word.', answer: 'sister', wrong: ['pencil', 'kitchen', 'rain'] }
  ],
  es: [
    { prompt: 'Elige una palabra de la escuela.', answer: 'cuaderno', wrong: ['nube', 'pez', 'tren'] },
    { prompt: 'Elige una comida.', answer: 'manzana', wrong: ['lampara', 'mesa', 'puerta'] },
    { prompt: 'Elige una emocion.', answer: 'alegria', wrong: ['zapato', 'sopa', 'jardin'] }
  ]
};

export function generateVocabularyExercise({ grade, language }) {
  const pack = sample(PACKS[language] || PACKS.fr);
  return createExercise({
    question: pack.prompt,
    options: uniqueOptions(pack.answer, pack.wrong),
    correct: pack.answer,
    type: 'language_vocabulary',
    level: gradeToLabel(grade),
    explanation: `${pack.answer} est la bonne reponse.`
  });
}
