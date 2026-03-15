import { createModule } from '../../curriculum/moduleTemplate.js';

export const mathematicsGrade5Modules = [

  createModule({
    id: 'math-g5-decimals',
    subjectId: 'mathematics',
    gradeId: 'P5',
    domainId: 'decimals',
    domainLabel: 'Nombres decimaux',
    title: 'Les nombres decimaux',
    summary: 'Calculer et comprendre les nombres a virgule.',
    goal: 'Etendre la numeration au dela de l unite.',
    demo: 'Demo sur les dixiemes et centiemes.',
    guidedActivityIds: ['generated-decimals-p5'],
    independentActivityIds: ['generated-decimals-p5'],
    challengeActivityId: 'generated-decimals-p5',
    examActivityId: 'generated-decimals-p5',
    missionTitle: 'Mission Decimaux'
  })

];
