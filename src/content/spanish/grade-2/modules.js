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
    guidedActivityIds: ['generated-spanish-vocabulary'],
    independentActivityIds: ['generated-spanish-vocabulary'],
    challengeActivityId: 'generated-spanish-vocabulary',
    examActivityId: 'generated-spanish-vocabulary',
    suggestedReviewIds: ['generated-spanish-vocabulary']
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
    guidedActivityIds: ['generated-spanish-reading'],
    independentActivityIds: ['generated-spanish-vocabulary'],
    challengeActivityId: 'generated-spanish-reading',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  })
];
