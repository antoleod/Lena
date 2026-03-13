import { createModule } from '../../curriculum/moduleTemplate.js';

export const spanishGrade2Modules = [
  createModule({
    id: 'spanish-g2-vocabulary',
    subjectId: 'spanish',
    gradeId: 'P2',
    domainId: 'vocabulary',
    domainLabel: 'Vocabulario',
    title: 'Saludos, colores y escuela',
    summary: 'Aprender palabras faciles antes de leer frases largas.',
    goal: 'Construir una base oral y visual en espanol.',
    demo: 'Una demostracion muestra imagen, palabra y repeticion.',
    guidedActivityIds: ['spanish-visual-words', 'generated-spanish-vocabulary'],
    independentActivityIds: ['spanish-visual-words', 'generated-spanish-vocabulary'],
    challengeActivityId: 'generated-spanish-vocabulary',
    examActivityId: 'generated-spanish-vocabulary',
    suggestedReviewIds: ['spanish-visual-words']
  }),
  createModule({
    id: 'spanish-g2-sentences',
    subjectId: 'spanish',
    gradeId: 'P2',
    domainId: 'sentences',
    domainLabel: 'Frases',
    title: 'Frases basicas y sentido',
    summary: 'Leer frases cortas y completar la palabra correcta.',
    goal: 'Pasar del vocabulario a pequenas frases utiles.',
    demo: 'Se lee primero la frase completa antes de elegir.',
    guidedActivityIds: ['spanish-basic-sentences', 'generated-spanish-sentences'],
    independentActivityIds: ['generated-spanish-vocabulary'],
    challengeActivityId: 'spanish-basic-sentences',
    examActivityId: 'generated-spanish-sentences',
    suggestedReviewIds: ['spanish-visual-words']
  }),
  createModule({
    id: 'spanish-g2-reading',
    subjectId: 'spanish',
    gradeId: 'P2',
    domainId: 'reading',
    domainLabel: 'Lectura',
    title: 'Imagen, palabra y frase corta',
    summary: 'Leer mini textos y responder una pregunta clara.',
    goal: 'Pasar del vocabulario al sentido.',
    demo: 'Se destaca primero la frase importante antes de responder.',
    guidedActivityIds: ['generated-spanish-reading', 'generated-spanish-sentences'],
    independentActivityIds: ['spanish-basic-sentences'],
    challengeActivityId: 'generated-spanish-reading',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  })
];
