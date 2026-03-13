import { createVisualWordQuestion } from '../language-packs/visualVocabulary.js';

function buildSections(practice, exam, practiceTitle = 'Practica visual', examTitle = 'Mini revision') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'Mira la imagen y elige la palabra correcta en espanol.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Una comprobacion visual corta al final.',
      lessons: exam
    }
  ];
}

export const spanishActivities = [
  {
    id: 'spanish-visual-words',
    slug: 'spanish-visual-words',
    title: 'Palabras con imagen',
    subject: 'spanish',
    subskill: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    language: 'es',
    difficulty: 'guided',
    estimatedDurationMin: 7,
    instructions: 'Mira la imagen y elige la palabra correcta en espanol.',
    correctionType: 'multiple-choice',
    hints: ['Observa bien la imagen antes de elegir.'],
    tags: ['visual-vocabulary', 'imagen-palabra'],
    accessibility: ['image support', 'short prompt'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde a la manzana?', answerConceptId: 'apple', distractorConceptIds: ['book', 'house'], explanation: 'Manzana es la palabra correcta.' }),
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde a la casa?', answerConceptId: 'house', distractorConceptIds: ['cat', 'water'], explanation: 'Casa es la palabra correcta.' }),
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde al gato?', answerConceptId: 'cat', distractorConceptIds: ['school', 'book'], explanation: 'Gato es la palabra correcta.' }),
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde al libro?', answerConceptId: 'book', distractorConceptIds: ['apple', 'water'], explanation: 'Libro es la palabra correcta.' })
      ],
      [
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde a la escuela?', answerConceptId: 'school', distractorConceptIds: ['house', 'cat'], explanation: 'Escuela es la palabra correcta.' }),
        createVisualWordQuestion({ locale: 'es', prompt: 'Que palabra corresponde al agua?', answerConceptId: 'water', distractorConceptIds: ['apple', 'book'], explanation: 'Agua es la palabra correcta.' })
      ]
    )
  },
  {
    id: 'spanish-basic-sentences',
    slug: 'spanish-basic-sentences',
    title: 'Frases basicas',
    subject: 'spanish',
    subskill: 'sentence-building',
    gradeBand: ['P2', 'P3'],
    language: 'es',
    difficulty: 'progressive',
    estimatedDurationMin: 8,
    instructions: 'Lee la frase y elige la palabra correcta.',
    correctionType: 'multiple-choice',
    hints: ['Lee toda la frase antes de responder.'],
    tags: ['frases', 'lectura'],
    accessibility: ['texto corto', 'opciones claras'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Yo leo un ...', choices: ['libro', 'gato', 'agua'], answer: 'libro', explanation: 'Leemos un libro.' },
        { prompt: 'El ... duerme en la casa.', choices: ['gato', 'escuela', 'manzana'], answer: 'gato', explanation: 'El gato puede dormir en la casa.' },
        { prompt: 'Voy a la ... por la manana.', choices: ['escuela', 'casa', 'agua'], answer: 'escuela', explanation: 'Los ninos van a la escuela.' },
        { prompt: 'Bebo ... despues de correr.', choices: ['agua', 'libro', 'gato'], answer: 'agua', explanation: 'Agua es la respuesta correcta.' }
      ],
      [
        { prompt: 'Como una ... en el recreo.', choices: ['manzana', 'escuela', 'casa'], answer: 'manzana', explanation: 'Una manzana es comida.' },
        { prompt: 'Vivo en una ... pequena.', choices: ['casa', 'agua', 'libro'], answer: 'casa', explanation: 'Vivimos en una casa.' }
      ],
      'Practica de frases',
      'Mini revision de frases'
    )
  }
];
