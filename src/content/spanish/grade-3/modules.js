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
    guidedActivityIds: ['generated-spanish-reading'],
    independentActivityIds: ['generated-spanish-vocabulary'],
    challengeActivityId: 'generated-spanish-reading',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  }),
  createModule({
    id: 'spanish-g3-grammar',
    subjectId: 'spanish',
    gradeId: 'P3',
    domainId: 'grammar',
    domainLabel: 'Gramatica',
    title: 'Sujeto, verbo y orden de frases',
    summary: 'Trabajar sentido, orden y lectura funcional.',
    goal: 'Facilitar escritura guiada futura.',
    demo: 'Una demostracion explica que palabra da la accion.',
    guidedActivityIds: ['generated-spanish-vocabulary'],
    independentActivityIds: ['generated-spanish-reading'],
    challengeActivityId: 'generated-spanish-vocabulary',
    examActivityId: 'generated-spanish-reading',
    suggestedReviewIds: ['generated-spanish-vocabulary']
  })
];
