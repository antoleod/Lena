import { createModule } from '../../curriculum/moduleTemplate.js';

export const dutchGrade3Modules = [
  createModule({
    id: 'dutch-g3-reading',
    subjectId: 'dutch',
    gradeId: 'P3',
    domainId: 'lezen',
    domainLabel: 'Lezen',
    title: 'Lezen en begrijpen',
    summary: 'Korte teksten lezen en begrijpen wat belangrijk is.',
    goal: 'Meer zelfstandigheid in Nederlands opbouwen.',
    demo: 'Een voorbeeld laat zien hoe je de vraag koppelt aan een zin in de tekst.',
    guidedActivityIds: ['generated-dutch-reading'],
    independentActivityIds: ['generated-dutch-vocabulary'],
    challengeActivityId: 'generated-dutch-reading',
    examActivityId: 'generated-dutch-reading',
    suggestedReviewIds: ['dutch-picture-words']
  }),
  createModule({
    id: 'dutch-g3-dialogues',
    subjectId: 'dutch',
    gradeId: 'P3',
    domainId: 'zinsbouw',
    domainLabel: 'Zinsbouw',
    title: 'Dagelijkse routine en vragen',
    summary: 'Oefenen met basiswoorden, vragen en kleine dialogen.',
    goal: 'Woorden sneller herkennen in context.',
    demo: 'We tonen eerst de routinewoorden die terugkomen in de zinnen.',
    guidedActivityIds: ['generated-dutch-vocabulary'],
    independentActivityIds: ['generated-dutch-reading'],
    challengeActivityId: 'generated-dutch-vocabulary',
    examActivityId: 'generated-dutch-reading',
    suggestedReviewIds: ['generated-dutch-vocabulary']
  })
];
