import { createModule } from '../../curriculum/moduleTemplate.js';

export const spanishGrade5Modules = [

  createModule({
    id: 'spanish-g5-sentences',
    subjectId: 'spanish',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Frases',
    title: 'Frases divertidas',
    summary: 'Formar frases completas.',
    goal: 'Comprar, hablar y jugar.',
    demo: 'Demo frases 2.',
    guidedActivityIds: ['generated-spanish-sentences-p4'],
    independentActivityIds: ['generated-spanish-sentences-p4'],
    challengeActivityId: 'generated-spanish-sentences-p4',
    examActivityId: 'generated-spanish-sentences-p4',
    missionTitle: 'Mission Frases Plus'
  })

];
