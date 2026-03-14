import { createModule } from '../../curriculum/moduleTemplate.js';

export const reasoningGrade3Modules = [
  createModule({
    id: 'reasoning-g3-patterns',
    subjectId: 'reasoning',
    gradeId: 'P3',
    domainId: 'patterns',
    domainLabel: 'Patrons et series',
    title: 'Patrons, suites et matrices simples',
    summary: 'Comparer, deduire et anticiper une regle plus complexe.',
    goal: 'Passer a une logique plus strategique.',
    demo: 'On explique comment tester une hypothese et eliminer les mauvaises reponses.',
    guidedActivityIds: ['generated-patterns-reasoning-p3', 'generated-reasoning-p3'],
    independentActivityIds: ['generated-patterns-p3'],
    challengeActivityId: 'generated-logic-sequences',
    examActivityId: 'generated-patterns-reasoning-p3',
    suggestedReviewIds: ['generated-sequences-p2'],
    missionTitle: 'Mission patrons P3',
    missionSummary: 'Patrons, suites et matrices avec regles plus riches.'
  }),
  createModule({
    id: 'reasoning-g3-deduction',
    subjectId: 'reasoning',
    gradeId: 'P3',
    domainId: 'deduction',
    domainLabel: 'Deduction et attention',
    title: 'Classer, deduire et memoriser',
    summary: 'Lire une organisation, classer plusieurs criteres et verifier.',
    goal: 'Installer une vraie demarche de raisonnement.',
    demo: 'La demonstration montre comment chercher lignes, colonnes et indices utiles.',
    guidedActivityIds: ['generated-reasoning-p3', 'generated-memory-reasoning-p3'],
    independentActivityIds: ['generated-classification-p3'],
    challengeActivityId: 'generated-word-problems',
    examActivityId: 'generated-memory-reasoning-p3',
    suggestedReviewIds: ['generated-classification-reasoning-p2'],
    missionTitle: 'Mission deduction P3',
    missionSummary: 'Deduction simple, memoire visuelle et attention a plusieurs criteres.'
  }),
  createModule({
    id: 'reasoning-g3-soft-logic',
    subjectId: 'reasoning',
    gradeId: 'P3',
    domainId: 'soft-logic',
    domainLabel: 'Logique douce',
    title: 'Strategie, intrus et logique visuelle',
    summary: 'Relier categories, suites et matrices simples dans un vrai parcours.',
    goal: 'Rendre la logique plus riche et plus visible dans le grade P3.',
    demo: 'On teste une regle, puis on elimine les reponses qui ne collent pas.',
    guidedActivityIds: ['generated-logic-p3', 'generated-patterns-reasoning-p3'],
    independentActivityIds: ['generated-memory-reasoning-p3'],
    challengeActivityId: 'generated-word-problems',
    examActivityId: 'generated-logic-p3',
    suggestedReviewIds: ['generated-logic-p2'],
    missionTitle: 'Mission logique douce P3',
    missionSummary: 'Logique visuelle, intrus et deduction a plusieurs indices.'
  })
];
