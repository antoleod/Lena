import { createModule } from '../../curriculum/moduleTemplate.js';

export const informatiqueGrade5Modules = [
  createModule({
    id: 'informatique-g5-algorithmes',
    subjectId: 'informatique',
    gradeId: 'P5',
    domainId: 'premiers-algorithmes',
    domainLabel: 'Premiers algorithmes',
    title: 'Écrire ses premiers algorithmes',
    summary: "Apprendre à décomposer un problème en instructions séquentielles.",
    goal: "Développer la pensée algorithmique et la logique séquentielle.",
    demo: "On écrit ensemble un algorithme simple pour une tâche du quotidien.",
    guidedActivityIds: ['generated-informatique-premiers-algorithmes-p5', 'generated-informatique-logique-informatique-p5'],
    independentActivityIds: ['generated-informatique-fichiers-et-dossiers-p5'],
    challengeActivityId: 'generated-informatique-securite-numerique-p5',
    examActivityId: 'generated-informatique-premiers-algorithmes-p5',
    suggestedReviewIds: ['generated-informatique-logique-informatique-p4'],
    missionTitle: 'Mission algorithmes P5',
    missionSummary: "Écrire et comprendre des algorithmes simples."
  }),
  createModule({
    id: 'informatique-g5-logique',
    subjectId: 'informatique',
    gradeId: 'P5',
    domainId: 'logique-informatique',
    domainLabel: 'Logique avancée',
    title: 'Logique informatique avancée',
    summary: "Appliquer des raisonnements logiques plus complexes en informatique.",
    goal: "Maîtriser les conditions, boucles et structures logiques simples.",
    demo: "La démonstration présente des conditions et des répétitions dans un programme.",
    guidedActivityIds: ['generated-informatique-logique-informatique-p5', 'generated-informatique-premiers-algorithmes-p5'],
    independentActivityIds: ['generated-informatique-internet-p5'],
    challengeActivityId: 'generated-informatique-securite-numerique-p5',
    examActivityId: 'generated-informatique-logique-informatique-p5',
    suggestedReviewIds: ['generated-informatique-premiers-algorithmes-p5'],
    missionTitle: 'Mission logique P5',
    missionSummary: "Logique informatique avancée avec conditions et boucles."
  })
];
