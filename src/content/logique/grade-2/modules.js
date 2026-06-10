import { createModule } from '../../curriculum/moduleTemplate.js';

export const logiqueGrade2Modules = [
  createModule({
    id: 'logique-g2-suites',
    subjectId: 'logique',
    gradeId: 'P2',
    domainId: 'suites-logiques',
    domainLabel: 'Suites logiques',
    title: 'Suites logiques simples',
    summary: 'Observer une suite et trouver le prochain élément.',
    goal: 'Développer la reconnaissance de règles simples.',
    demo: 'On montre comment observer la transformation entre deux éléments voisins.',
    guidedActivityIds: ['generated-logique-suites-logiques-p2', 'generated-logique-formes-et-motifs-p2'],
    independentActivityIds: ['generated-logique-logique-visuelle-p2'],
    challengeActivityId: 'generated-logique-comparaison-p2',
    examActivityId: 'generated-logique-suites-logiques-p2',
    suggestedReviewIds: ['generated-logique-formes-et-motifs-p2'],
    missionTitle: 'Mission suites P2',
    missionSummary: 'Repérer et continuer des suites logiques simples.'
  }),
  createModule({
    id: 'logique-g2-intrus',
    subjectId: 'logique',
    gradeId: 'P2',
    domainId: 'trouve-lintrus',
    domainLabel: "Trouver l'intrus",
    title: "Trouver l'intrus dans un groupe",
    summary: "Identifier l'élément qui ne fait pas partie du groupe.",
    goal: 'Construire la notion de catégorie et de différence.',
    demo: "On explique comment trouver ce que tous les éléments ont en commun, sauf un.",
    guidedActivityIds: ['generated-logique-trouve-lintrus-p2', 'generated-logique-comparaison-p2'],
    independentActivityIds: ['generated-logique-logique-visuelle-p2'],
    challengeActivityId: 'generated-logique-deduction-p2',
    examActivityId: 'generated-logique-trouve-lintrus-p2',
    suggestedReviewIds: ['generated-logique-suites-logiques-p2'],
    missionTitle: "Mission intrus P2",
    missionSummary: "Trouver l'élément qui ne correspond pas au groupe."
  }),
  createModule({
    id: 'logique-g2-formes',
    subjectId: 'logique',
    gradeId: 'P2',
    domainId: 'formes-et-motifs',
    domainLabel: 'Formes et motifs',
    title: 'Reconnaître et compléter les motifs',
    summary: 'Analyser des motifs géométriques et les compléter.',
    goal: 'Développer la perception spatiale et la logique visuelle.',
    demo: 'La démonstration montre comment observer les lignes et colonnes dans un motif.',
    guidedActivityIds: ['generated-logique-formes-et-motifs-p2', 'generated-logique-logique-visuelle-p2'],
    independentActivityIds: ['generated-logique-suites-logiques-p2'],
    challengeActivityId: 'generated-logique-labyrinthes-p2',
    examActivityId: 'generated-logique-formes-et-motifs-p2',
    suggestedReviewIds: ['generated-logique-suites-logiques-p2'],
    missionTitle: 'Mission formes P2',
    missionSummary: 'Reconnaître et compléter des motifs simples.'
  })
];
