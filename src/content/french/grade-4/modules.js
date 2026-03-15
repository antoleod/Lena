import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade4Modules = [

  createModule({
    id: 'french-g4-reading',
    subjectId: 'french',
    gradeId: 'P4',
    domainId: 'reading',
    domainLabel: 'Lecture active',
    title: 'Lecture et comprehension',
    summary: 'Lire des textes informatifs et repondre aux questions.',
    goal: 'Extraire l information.',
    demo: 'Demo avec un texte de decouverte.',
    guidedActivityIds: ['generated-french-reading-p4'],
    independentActivityIds: ['generated-french-reading-p4'],
    challengeActivityId: 'generated-french-reading-p4',
    examActivityId: 'generated-french-reading-p4',
    missionTitle: 'Mission Lecture Active'
  })

];
