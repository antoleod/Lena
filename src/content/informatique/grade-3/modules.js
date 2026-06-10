import { createModule } from '../../curriculum/moduleTemplate.js';

export const informatiqueGrade3Modules = [
  createModule({
    id: 'informatique-g3-internet',
    subjectId: 'informatique',
    gradeId: 'P3',
    domainId: 'internet',
    domainLabel: 'Internet',
    title: 'Découvrir internet',
    summary: "Comprendre à quoi sert internet et comment il fonctionne.",
    goal: "Développer une première culture numérique.",
    demo: "On explique comment des ordinateurs sont connectés et ce qu'est une adresse web.",
    guidedActivityIds: ['generated-informatique-internet-p3', 'generated-informatique-securite-numerique-p3'],
    independentActivityIds: ['generated-informatique-fichiers-et-dossiers-p3'],
    challengeActivityId: 'generated-informatique-logique-informatique-p3',
    examActivityId: 'generated-informatique-internet-p3',
    suggestedReviewIds: ['generated-informatique-le-clavier-p2'],
    missionTitle: 'Mission internet P3',
    missionSummary: "Comprendre le fonctionnement d'internet et ses usages."
  }),
  createModule({
    id: 'informatique-g3-securite',
    subjectId: 'informatique',
    gradeId: 'P3',
    domainId: 'securite-numerique',
    domainLabel: 'Sécurité numérique',
    title: 'Rester en sécurité sur internet',
    summary: "Apprendre les règles de base pour naviguer en sécurité sur internet.",
    goal: "Développer des comportements sûrs et responsables en ligne.",
    demo: "La démonstration présente des situations concrètes et comment réagir.",
    guidedActivityIds: ['generated-informatique-securite-numerique-p3', 'generated-informatique-internet-p3'],
    independentActivityIds: ['generated-informatique-fichiers-et-dossiers-p3'],
    challengeActivityId: 'generated-informatique-logique-informatique-p3',
    examActivityId: 'generated-informatique-securite-numerique-p3',
    suggestedReviewIds: ['generated-informatique-internet-p3'],
    missionTitle: 'Mission sécurité P3',
    missionSummary: "Appliquer les règles de sécurité numérique de base."
  })
];
