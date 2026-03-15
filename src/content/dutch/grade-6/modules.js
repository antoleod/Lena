import { createModule } from '../../curriculum/moduleTemplate.js';

export const dutchGrade6Modules = [

  createModule({
    id: 'dutch-g6-reading',
    subjectId: 'dutch',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Leesbegrip',
    title: 'Begrijpend lezen',
    summary: 'Lees teksten en beantwoord vragen.',
    goal: 'Tekstbegrip optimaliseren.',
    demo: 'Demo tekst.',
    guidedActivityIds: ['generated-dutch-reading-p6'],
    independentActivityIds: ['generated-dutch-reading-p6'],
    challengeActivityId: 'generated-dutch-reading-p6',
    examActivityId: 'generated-dutch-reading-p6',
    missionTitle: 'Missie Leesbegrip'
  })

];
