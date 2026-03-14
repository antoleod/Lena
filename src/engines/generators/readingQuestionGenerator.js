import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

const PASSAGES = {
  fr: [
    {
      lines: ['Mila prepare son sac avant l ecole.', 'Elle prend un livre, une pomme et sa gourde.', 'Puis elle ferme la porte en souriant.'],
      question: 'Que prend Mila ?',
      answer: 'Un livre, une pomme et sa gourde',
      wrong: ['Un ballon et un manteau', 'Une lampe et un chat', 'Un velo et des fleurs']
    },
    {
      lines: ['Leo marche avec sa classe jusqu au marche.', 'Il voit des pommes, des fleurs et du pain chaud.', 'Il achete une petite brioche.'],
      question: 'Ou va Leo ?',
      answer: 'Au marche',
      wrong: ['A la plage', 'Au cinema', 'Au musee']
    }
  ],
  en: [
    {
      lines: ['Ava goes to the park after school.', 'She brings water and a red ball.', 'Her brother joins her near the slide.'],
      question: 'What color is the ball?',
      answer: 'Red',
      wrong: ['Blue', 'Green', 'Yellow']
    }
  ],
  es: [
    {
      lines: ['Luna prepara un picnic con su familia.', 'Lleva pan, queso y jugo.', 'Todos comen debajo de un arbol.'],
      question: 'Donde comen?',
      answer: 'Debajo de un arbol',
      wrong: ['En la cocina', 'En el autobus', 'En la clase']
    }
  ],
  nl: [
    {
      lines: ['Noor gaat naar de bibliotheek met haar papa.', 'Ze kiest een boek over dieren.', 'Daarna leest ze rustig aan tafel.'],
      question: 'Welk boek kiest Noor?',
      answer: 'Een boek over dieren',
      wrong: ['Een boek over auto s', 'Een kookboek', 'Een boek over de maan']
    }
  ]
};

export function generateReadingQuestionExercise({ grade, language }) {
  const entry = sample(PASSAGES[language] || PASSAGES.fr);
  return createExercise({
    question: entry.question,
    options: uniqueOptions(entry.answer, entry.wrong),
    correct: entry.answer,
    type: 'reading_comprehension',
    level: gradeToLabel(grade),
    context: entry.lines,
    explanation: `${entry.answer} est la bonne reponse.`
  });
}
