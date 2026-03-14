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
  })
];
