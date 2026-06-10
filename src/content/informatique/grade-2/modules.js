import { createModule } from '../../curriculum/moduleTemplate.js';

export const informatiqueGrade2Modules = [
  createModule({
    id: 'informatique-g2-ordinateur',
    subjectId: 'informatique',
    gradeId: 'P2',
    domainId: 'parties-de-lordinateur',
    domainLabel: "Parties de l'ordinateur",
    title: "Découvrir les parties d'un ordinateur",
    summary: "Identifier et nommer les principales parties d'un ordinateur.",
    goal: "Mémoriser le vocabulaire de base de l'informatique.",
    demo: "On présente chaque partie de l'ordinateur avec son nom et sa fonction.",
    guidedActivityIds: ['generated-informatique-parties-de-lordinateur-p2', 'generated-informatique-le-clavier-p2'],
    independentActivityIds: ['generated-informatique-la-souris-p2'],
    challengeActivityId: 'generated-informatique-internet-p2',
    examActivityId: 'generated-informatique-parties-de-lordinateur-p2',
    suggestedReviewIds: ['generated-informatique-le-clavier-p2'],
    missionTitle: 'Mission ordinateur P2',
    missionSummary: "Reconnaître et nommer les parties de l'ordinateur."
  }),
  createModule({
    id: 'informatique-g2-clavier',
    subjectId: 'informatique',
    gradeId: 'P2',
    domainId: 'le-clavier',
    domainLabel: 'Le clavier',
    title: 'Apprendre à utiliser le clavier',
    summary: 'Découvrir les touches importantes du clavier et leur utilisation.',
    goal: "Développer une première aisance avec le clavier.",
    demo: 'La démonstration montre les touches les plus importantes du clavier.',
    guidedActivityIds: ['generated-informatique-le-clavier-p2', 'generated-informatique-la-souris-p2'],
    independentActivityIds: ['generated-informatique-parties-de-lordinateur-p2'],
    challengeActivityId: 'generated-informatique-internet-p2',
    examActivityId: 'generated-informatique-le-clavier-p2',
    suggestedReviewIds: ['generated-informatique-parties-de-lordinateur-p2'],
    missionTitle: 'Mission clavier P2',
    missionSummary: 'Découvrir et utiliser les touches importantes du clavier.'
  })
];
