import { createModule } from '../../curriculum/moduleTemplate.js';

export const reasoningGrade2Modules = [
  createModule({
    id: 'reasoning-g2-patterns',
    subjectId: 'reasoning',
    gradeId: 'P2',
    domainId: 'patterns',
    domainLabel: 'Patterns',
    title: 'Series visuelles et intrus',
    summary: 'Observer, classer et trouver ce qui ne va pas ensemble.',
    goal: 'Construire une attention visuelle stable.',
    demo: 'On montre comment comparer chaque element avant de choisir.',
    guidedActivityIds: ['generated-reasoning-p2'],
    independentActivityIds: ['generated-reasoning-p2'],
    challengeActivityId: 'generated-reasoning-p2',
    examActivityId: 'generated-reasoning-p2',
    suggestedReviewIds: ['generated-logic-sequences']
  }),
  createModule({
    id: 'reasoning-g2-memory',
    subjectId: 'reasoning',
    gradeId: 'P2',
    domainId: 'memory',
    domainLabel: 'Memoire visuelle',
    title: 'Correspondances et logique simple',
    summary: 'Faire des liens, repeter une regle et terminer une suite.',
    goal: 'Mieux preparer les mini defis de raisonnement.',
    demo: 'La demonstration decoupe la tache en petites etapes.',
    guidedActivityIds: ['generated-reasoning-p2'],
    independentActivityIds: ['generated-logic-sequences'],
    challengeActivityId: 'generated-reasoning-p2',
    examActivityId: 'generated-logic-sequences',
    suggestedReviewIds: ['generated-reasoning-p2']
  })
];
