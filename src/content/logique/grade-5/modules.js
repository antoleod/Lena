import { createModule } from '../../curriculum/moduleTemplate.js';

export const logiqueGrade5Modules = [
  createModule({
    id: 'logique-g5-deduction',
    subjectId: 'logique',
    gradeId: 'P5',
    domainId: 'deduction',
    domainLabel: 'Déduction avancée',
    title: 'Déduction et raisonnement avancé',
    summary: 'Résoudre des problèmes nécessitant plusieurs étapes de déduction.',
    goal: 'Maîtriser le raisonnement hypothético-déductif.',
    demo: 'On montre comment formuler des hypothèses et les tester systematiquement.',
    guidedActivityIds: ['generated-logique-deduction-p5', 'generated-logique-resolution-de-problemes-p5'],
    independentActivityIds: ['generated-logique-comparaison-p5'],
    challengeActivityId: 'generated-logique-suites-logiques-p5',
    examActivityId: 'generated-logique-deduction-p5',
    suggestedReviewIds: ['generated-logique-deduction-p4'],
    missionTitle: 'Mission déduction P5',
    missionSummary: 'Déduction avancée avec plusieurs étapes de raisonnement.'
  }),
  createModule({
    id: 'logique-g5-resolution',
    subjectId: 'logique',
    gradeId: 'P5',
    domainId: 'resolution-de-problemes',
    domainLabel: 'Résolution avancée',
    title: 'Problèmes complexes et stratégies',
    summary: 'Résoudre des problèmes logiques complexes en utilisant plusieurs stratégies.',
    goal: 'Développer la flexibilité cognitive et la persévérance.',
    demo: 'La démonstration présente différentes stratégies et comment choisir la meilleure.',
    guidedActivityIds: ['generated-logique-resolution-de-problemes-p5', 'generated-logique-deduction-p5'],
    independentActivityIds: ['generated-logique-logique-visuelle-p5'],
    challengeActivityId: 'generated-logique-formes-et-motifs-p5',
    examActivityId: 'generated-logique-resolution-de-problemes-p5',
    suggestedReviewIds: ['generated-logique-resolution-de-problemes-p4'],
    missionTitle: 'Mission résolution P5',
    missionSummary: 'Problèmes logiques complexes avec plusieurs stratégies.'
  })
];
