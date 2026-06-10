import { createModule } from '../../curriculum/moduleTemplate.js';

export const informatiqueGrade4Modules = [
  createModule({
    id: 'informatique-g4-fichiers',
    subjectId: 'informatique',
    gradeId: 'P4',
    domainId: 'fichiers-et-dossiers',
    domainLabel: 'Fichiers et dossiers',
    title: 'Organiser les fichiers et dossiers',
    summary: "Apprendre à créer, nommer et organiser des fichiers et dossiers.",
    goal: "Développer des habitudes d'organisation numérique.",
    demo: "On montre comment créer une structure de dossiers logique.",
    guidedActivityIds: ['generated-informatique-fichiers-et-dossiers-p4', 'generated-informatique-logique-informatique-p4'],
    independentActivityIds: ['generated-informatique-securite-numerique-p4'],
    challengeActivityId: 'generated-informatique-premiers-algorithmes-p4',
    examActivityId: 'generated-informatique-fichiers-et-dossiers-p4',
    suggestedReviewIds: ['generated-informatique-internet-p3'],
    missionTitle: 'Mission fichiers P4',
    missionSummary: "Créer et organiser des fichiers et dossiers."
  }),
  createModule({
    id: 'informatique-g4-logique',
    subjectId: 'informatique',
    gradeId: 'P4',
    domainId: 'logique-informatique',
    domainLabel: 'Logique informatique',
    title: 'Comprendre la logique informatique',
    summary: "Découvrir les bases du raisonnement logique utilisé en informatique.",
    goal: "Préparer à la pensée algorithmique.",
    demo: "La démonstration introduit les notions de vrai/faux et de conditions.",
    guidedActivityIds: ['generated-informatique-logique-informatique-p4', 'generated-informatique-fichiers-et-dossiers-p4'],
    independentActivityIds: ['generated-informatique-premiers-algorithmes-p4'],
    challengeActivityId: 'generated-informatique-securite-numerique-p4',
    examActivityId: 'generated-informatique-logique-informatique-p4',
    suggestedReviewIds: ['generated-informatique-fichiers-et-dossiers-p4'],
    missionTitle: 'Mission logique P4',
    missionSummary: "Comprendre et appliquer les bases de la logique informatique."
  })
];
