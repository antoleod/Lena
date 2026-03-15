import { createModule } from '../../curriculum/moduleTemplate.js';

export const spanishGrade4Modules = [

  createModule({
    id: 'spanish-g4-sentences',
    subjectId: 'spanish',
    gradeId: 'P4',
    domainId: 'sentences',
    domainLabel: 'Frases',
    title: 'Frases utiles',
    summary: 'Formar frases completas.',
    goal: 'Comprar, hablar y jugar.',
    demo: 'Demo frases.',
    guidedActivityIds: ['generated-spanish-sentences-p4'],
    independentActivityIds: ['generated-spanish-sentences-p4'],
    challengeActivityId: 'generated-spanish-sentences-p4',
    examActivityId: 'generated-spanish-sentences-p4',
    missionTitle: 'Mission Frases'
  })

];
