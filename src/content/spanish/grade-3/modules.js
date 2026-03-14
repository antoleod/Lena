import { createModule } from '../../curriculum/moduleTemplate.js';

export const spanishGrade3Modules = [
  createModule({
    id: 'spanish-g3-comprehension',
    subjectId: 'spanish',
    gradeId: 'P3',
    domainId: 'comprehension',
    domainLabel: 'Comprension',
    title: 'Lectura guiada y preguntas',
    summary: 'Leer textos cortos y encontrar la informacion importante.',
    goal: 'Preparar mini evaluaciones mas completas.',
    demo: 'Se muestra como volver al texto antes de elegir.',
    guidedActivityIds: ['generated-spanish-reading', 'generated-spanish-sentences'],
    independentActivityIds: ['generated-spanish-vocabulary'],
    challengeActivityId: 'generated-spanish-reading',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['spanish-basic-sentences']
  }),
  createModule({
    id: 'spanish-g3-grammar',
    subjectId: 'spanish',
    gradeId: 'P3',
    domainId: 'grammar',
    domainLabel: 'Gramatica',
    title: 'Sujeto, verbo y orden de frases',
    summary: 'Trabajar sentido, orden y lectura funcional.',
    goal: 'Dar una base clara para ordenar y entender frases.',
    demo: 'Una demostracion explica que palabra da la accion.',
    guidedActivityIds: ['spanish-basic-sentences', 'generated-spanish-sentences'],
    independentActivityIds: ['generated-spanish-reading'],
    challengeActivityId: 'generated-spanish-sentences',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  }),
  createModule({
    id: 'spanish-g3-writing',
    subjectId: 'spanish',
    gradeId: 'P3',
    domainId: 'guided-writing',
    domainLabel: 'Escritura guiada',
    title: 'Frases utiles y repaso',
    summary: 'Reforzar palabras, frases cortas y comprension basica.',
    goal: 'Dar seguridad antes de escribir mas.',
    demo: 'Se muestra como releer para comprobar si la frase tiene sentido.',
    guidedActivityIds: ['generated-spanish-vocabulary', 'generated-spanish-sentences'],
    independentActivityIds: ['spanish-basic-sentences'],
    challengeActivityId: 'generated-spanish-reading',
    examActivityId: 'generated-spanish-sentences',
    suggestedReviewIds: ['spanish-visual-words']
  }),
  createModule({
    id: 'spanish-g3-stories',
    subjectId: 'spanish',
    gradeId: 'P3',
    domainId: 'stories',
    domainLabel: 'Historias',
    title: 'Historias cortas y comprension',
    summary: 'Leer mini historias y contestar preguntas de quien, donde y que paso.',
    goal: 'Dar mas contexto y mas ganas de leer en espanol.',
    demo: 'Se muestra primero como buscar la pista en el texto.',
    guidedActivityIds: ['generated-spanish-stories', 'generated-spanish-reading'],
    independentActivityIds: ['generated-spanish-sentences', 'generated-spanish-daily-life'],
    challengeActivityId: 'generated-spanish-stories',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  })
];
