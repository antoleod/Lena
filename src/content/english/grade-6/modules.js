import { createModule } from '../../curriculum/moduleTemplate.js';

export const englishGrade6Modules = [

  createModule({
    id: 'english-g6-reading',
    subjectId: 'english',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Reading Challenge',
    title: 'Reading comprehension',
    summary: 'Read and understand texts.',
    goal: 'Deep comprehension.',
    demo: 'Demo Reading.',
    guidedActivityIds: ['generated-english-reading-p6'],
    independentActivityIds: ['generated-english-reading-p6'],
    challengeActivityId: 'generated-english-reading-p6',
    examActivityId: 'generated-english-reading-p6',
    missionTitle: 'Mission Reading'
  })

];
