import { createModule } from '../../curriculum/moduleTemplate.js';

export const logiqueGrade4Modules = [
  createModule({
    id: 'logique-g4-suites',
    subjectId: 'logique',
    gradeId: 'P4',
    domainId: 'suites-logiques',
    domainLabel: 'Suites logiques',
    title: 'Suites abstraites et règles complexes',
    summary: 'Analyser des suites avec des transformations multiples.',
    goal: 'Maîtriser la pensée abstraite et la reconnaissance de règles complexes.',
    demo: 'On décompose chaque transformation de la suite avant de choisir.',
    guidedActivityIds: ['generated-logique-suites-logiques-p4', 'generated-logique-formes-et-motifs-p4'],
    independentActivityIds: ['generated-logique-logique-visuelle-p4'],
    challengeActivityId: 'generated-logique-deduction-p4',
    examActivityId: 'generated-logique-suites-logiques-p4',
    suggestedReviewIds: ['generated-logique-suites-logiques-p3'],
    missionTitle: 'Mission suites P4',
    missionSummary: 'Suites abstraites avec transformations multiples.'
  }),
  createModule({
    id: 'logique-g4-resolution',
    subjectId: 'logique',
    gradeId: 'P4',
    domainId: 'resolution-de-problemes',
    domainLabel: 'Résolution de problèmes',
    title: 'Résoudre des problèmes logiques',
    summary: 'Appliquer des stratégies de raisonnement pour résoudre des problèmes.',
    goal: 'Développer une approche méthodique de résolution.',
    demo: 'La démonstration montre comment décomposer un problème en étapes.',
    guidedActivityIds: ['generated-logique-resolution-de-problemes-p4', 'generated-logique-deduction-p4'],
    independentActivityIds: ['generated-logique-comparaison-p4'],
    challengeActivityId: 'generated-logique-trouve-lintrus-p4',
    examActivityId: 'generated-logique-resolution-de-problemes-p4',
    suggestedReviewIds: ['generated-logique-deduction-p3'],
    missionTitle: 'Mission résolution P4',
    missionSummary: 'Stratégies de résolution de problèmes logiques.'
  })
];
