import { createModule } from '../../curriculum/moduleTemplate.js';

export const spanishGrade6Modules = [

  createModule({
    id: 'spanish-g6-reading',
    subjectId: 'spanish',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Lectura',
    title: 'Lectura y comprension',
    summary: 'Leer textos en espanol.',
    goal: 'Entender el idioma.',
    demo: 'Demo lectura.',
    guidedActivityIds: ['generated-spanish-reading-p6'],
    independentActivityIds: ['generated-spanish-reading-p6'],
    challengeActivityId: 'generated-spanish-reading-p6',
    examActivityId: 'generated-spanish-reading-p6',
    missionTitle: 'Mission Lectura'
  })

];
