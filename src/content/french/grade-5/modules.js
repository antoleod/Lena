import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade5Modules = [

  createModule({
    id: 'french-g5-grammar',
    subjectId: 'french',
    gradeId: 'P5',
    domainId: 'grammar',
    domainLabel: 'Grammaire+',
    title: 'Avancees en grammaire',
    summary: 'Preparation a la langue.',
    goal: 'Maitriser les regles.',
    demo: 'Demo grammaticale.',
    guidedActivityIds: ['generated-french-reading-p4'],
    independentActivityIds: ['generated-french-reading-p4'],
    challengeActivityId: 'generated-french-reading-p4',
    examActivityId: 'generated-french-reading-p4',
    missionTitle: 'Mission Grammaire'
  })

];
