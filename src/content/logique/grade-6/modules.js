import { createModule } from '../../curriculum/moduleTemplate.js';

export const logiqueGrade6Modules = [
  createModule({
    id: 'logique-g6-strategie',
    subjectId: 'logique',
    gradeId: 'P6',
    domainId: 'resolution-de-problemes',
    domainLabel: 'Stratégie logique',
    title: 'Stratégie logique et raisonnement expert',
    summary: 'Maîtriser les raisonnements logiques les plus complexes.',
    goal: 'Atteindre un niveau expert en pensée logique et critique.',
    demo: 'On présente des problèmes ouverts et comment les aborder avec méthode.',
    guidedActivityIds: ['generated-logique-resolution-de-problemes-p6', 'generated-logique-deduction-p6'],
    independentActivityIds: ['generated-logique-suites-logiques-p6'],
    challengeActivityId: 'generated-logique-logique-visuelle-p6',
    examActivityId: 'generated-logique-resolution-de-problemes-p6',
    suggestedReviewIds: ['generated-logique-deduction-p5'],
    missionTitle: 'Mission stratégie P6',
    missionSummary: 'Raisonnement expert et stratégies logiques avancées.'
  }),
  createModule({
    id: 'logique-g6-deduction',
    subjectId: 'logique',
    gradeId: 'P6',
    domainId: 'deduction',
    domainLabel: 'Déduction experte',
    title: 'Déduction experte et logique formelle',
    summary: 'Appliquer des principes de logique formelle dans des contextes variés.',
    goal: 'Préparer à la pensée algorithmique et scientifique.',
    demo: 'La démonstration introduit des chaînes de raisonnement et la logique formelle.',
    guidedActivityIds: ['generated-logique-deduction-p6', 'generated-logique-comparaison-p6'],
    independentActivityIds: ['generated-logique-trouve-lintrus-p6'],
    challengeActivityId: 'generated-logique-resolution-de-problemes-p6',
    examActivityId: 'generated-logique-deduction-p6',
    suggestedReviewIds: ['generated-logique-resolution-de-problemes-p5'],
    missionTitle: 'Mission déduction P6',
    missionSummary: 'Déduction experte et introduction à la logique formelle.'
  })
];
