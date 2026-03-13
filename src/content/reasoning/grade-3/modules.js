import { createModule } from '../../curriculum/moduleTemplate.js';

export const reasoningGrade3Modules = [
  createModule({
    id: 'reasoning-g3-logic',
    subjectId: 'reasoning',
    gradeId: 'P3',
    domainId: 'logic',
    domainLabel: 'Logique',
    title: 'Suites complexes et deduction',
    summary: 'Comparer, deduire et anticiper une regle plus complexe.',
    goal: 'Passer a une logique plus strategique.',
    demo: 'On explique comment eliminer les mauvaises reponses.',
    guidedActivityIds: ['generated-reasoning-p3'],
    independentActivityIds: ['generated-logic-sequences'],
    challengeActivityId: 'generated-reasoning-p3',
    examActivityId: 'generated-reasoning-p3',
    suggestedReviewIds: ['generated-reasoning-p2']
  }),
  createModule({
    id: 'reasoning-g3-spatial',
    subjectId: 'reasoning',
    gradeId: 'P3',
    domainId: 'spatial',
    domainLabel: 'Logique spatiale',
    title: 'Matrices simples et classification',
    summary: 'Lire une organisation, classer plusieurs criteres et verifier.',
    goal: 'Installer une vraie demarche de raisonnement.',
    demo: 'La demonstration montre comment chercher lignes et colonnes.',
    guidedActivityIds: ['generated-reasoning-p3'],
    independentActivityIds: ['generated-word-problems'],
    challengeActivityId: 'generated-reasoning-p3',
    examActivityId: 'generated-reasoning-p3',
    suggestedReviewIds: ['generated-logic-sequences']
  })
];
