import { createModule } from '../../curriculum/moduleTemplate.js';

export const mathematicsGrade6Modules = [

  createModule({
    id: 'math-g6-mixed',
    subjectId: 'mathematics',
    gradeId: 'P6',
    domainId: 'mixed-operations',
    domainLabel: 'Operations mixtes',
    title: 'Operations mixtes',
    summary: 'Combiner toutes les operations dans des defis.',
    goal: 'Respecter l ordre des operations.',
    demo: 'Demo calculs chaines.',
    guidedActivityIds: ['generated-mixed-operations-p6'],
    independentActivityIds: ['generated-mixed-operations-p6'],
    challengeActivityId: 'generated-mixed-operations-p6',
    examActivityId: 'generated-mixed-operations-p6',
    missionTitle: 'Mission Operations Mixtes'
  })

];
