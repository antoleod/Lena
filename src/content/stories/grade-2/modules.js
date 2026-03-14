import { createModule } from '../../curriculum/moduleTemplate.js';

export const storiesGrade2Modules = [
  createModule({
    id: 'stories-g2-sequencing',
    subjectId: 'stories',
    gradeId: 'P2',
    domainId: 'stories',
    domainLabel: 'Histoires',
    title: 'Lire et retrouver l essentiel',
    summary: 'Ecouter ou lire, puis repondre a une question simple.',
    goal: 'Faire aimer la lecture avant de tester la comprehension.',
    demo: 'On lit d abord l histoire et on repere ensemble un detail important.',
    guidedActivityIds: ['magic-library', 'forest-friends'],
    independentActivityIds: ['generated-french-reading'],
    challengeActivityId: 'forest-friends',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['associe-image-mot']
  }),
  createModule({
    id: 'stories-g2-school-day',
    subjectId: 'stories',
    gradeId: 'P2',
    domainId: 'school-day',
    domainLabel: 'Journee douce',
    title: 'Amis, ecole et promenade',
    summary: 'Deux histoires tres accessibles pour lire et comprendre sans pression.',
    goal: 'Multiplier les recits differents des le debut.',
    demo: 'On montre comment retrouver le personnage, le lieu et l ordre des actions.',
    guidedActivityIds: ['forest-friends', 'magic-library'],
    independentActivityIds: ['forest-friends'],
    challengeActivityId: 'magic-library',
    examActivityId: 'forest-friends',
    suggestedReviewIds: ['magic-library']
  })
];
