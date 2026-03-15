import { createModule } from '../../curriculum/moduleTemplate.js';

export const reasoningGrade5Modules = [

  createModule({
    id: 'reasoning-g5-matrices',
    subjectId: 'reasoning',
    gradeId: 'P5',
    domainId: 'matrices',
    domainLabel: 'Matrices et Suites',
    title: 'Matrices et deductions',
    summary: 'Resoudre des grilles complexes.',
    goal: 'Logique visuo spatiale avancee.',
    demo: 'Demo matrices.',
    guidedActivityIds: ['generated-reasoning-p4'],
    independentActivityIds: ['generated-reasoning-p4'],
    challengeActivityId: 'generated-reasoning-p4',
    examActivityId: 'generated-reasoning-p4',
    missionTitle: 'Mission Logique P5'
  })

];
