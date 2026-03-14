import { createModule } from '../../curriculum/moduleTemplate.js';

export const storiesGrade3Modules = [
  createModule({
    id: 'stories-g3-narrative',
    subjectId: 'stories',
    gradeId: 'P3',
    domainId: 'narrative',
    domainLabel: 'Comprehension narrative',
    title: 'Ordre du recit et implicite',
    summary: 'Lire une mini histoire puis repondre a des questions plus fines.',
    goal: 'Renforcer la comprehension narrative et les details implicites.',
    demo: 'Une demonstration montre comment retrouver le bon passage.',
    guidedActivityIds: ['magic-library', 'campfire-tales'],
    independentActivityIds: ['castle-chronicles'],
    challengeActivityId: 'campfire-tales',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['magic-library', 'castle-chronicles']
  })
];
