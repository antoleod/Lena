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
  }),
  createModule({
    id: 'stories-g3-night-market',
    subjectId: 'stories',
    gradeId: 'P3',
    domainId: 'night-market',
    domainLabel: 'Aventures',
    title: 'Feu de camp et chateau',
    summary: 'Deux aventures plus marquees pour travailler comprehension et ordre des evenements.',
    goal: 'Donner plus de relief a Stories avec de vrais parcours narratifs.',
    demo: 'La demonstration relie les indices du texte a la bonne question.',
    guidedActivityIds: ['campfire-tales', 'castle-chronicles'],
    independentActivityIds: ['magic-library'],
    challengeActivityId: 'castle-chronicles',
    examActivityId: 'campfire-tales',
    suggestedReviewIds: ['magic-library']
  })
];
