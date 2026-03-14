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
    missionSummary: 'Patrons, suites et matrices avec règles plus riches.'
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
    missionSummary: 'Deduction simple, mémoire visuelle et attention à plusieurs critères.'
  })
];
