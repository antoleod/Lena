import { createModule } from '../../curriculum/moduleTemplate.js';

export const informatiqueGrade6Modules = [
  createModule({
    id: 'informatique-g6-algorithmes',
    subjectId: 'informatique',
    gradeId: 'P6',
    domainId: 'premiers-algorithmes',
    domainLabel: 'Algorithmes experts',
    title: 'Algorithmes et pensée computationnelle',
    summary: "Concevoir des algorithmes pour résoudre des problèmes complexes.",
    goal: "Consolider la pensée algorithmique et préparer à la programmation.",
    demo: "On conçoit un algorithme complet pour un problème réel.",
    guidedActivityIds: ['generated-informatique-premiers-algorithmes-p6', 'generated-informatique-logique-informatique-p6'],
    independentActivityIds: ['generated-informatique-fichiers-et-dossiers-p6'],
    challengeActivityId: 'generated-informatique-securite-numerique-p6',
    examActivityId: 'generated-informatique-premiers-algorithmes-p6',
    suggestedReviewIds: ['generated-informatique-logique-informatique-p5'],
    missionTitle: 'Mission algorithmes P6',
    missionSummary: "Concevoir des algorithmes et développer la pensée computationnelle."
  }),
  createModule({
    id: 'informatique-g6-securite',
    subjectId: 'informatique',
    gradeId: 'P6',
    domainId: 'securite-numerique',
    domainLabel: 'Sécurité experte',
    title: 'Sécurité numérique et citoyenneté digitale',
    summary: "Approfondir les enjeux de la sécurité numérique et du comportement responsable en ligne.",
    goal: "Former un citoyen numérique responsable et averti.",
    demo: "La démonstration présente des cas réels de cybersécurité pour enfants.",
    guidedActivityIds: ['generated-informatique-securite-numerique-p6', 'generated-informatique-internet-p6'],
    independentActivityIds: ['generated-informatique-premiers-algorithmes-p6'],
    challengeActivityId: 'generated-informatique-logique-informatique-p6',
    examActivityId: 'generated-informatique-securite-numerique-p6',
    suggestedReviewIds: ['generated-informatique-securite-numerique-p5'],
    missionTitle: 'Mission sécurité P6',
    missionSummary: "Sécurité numérique avancée et citoyenneté digitale responsable."
  })
];
