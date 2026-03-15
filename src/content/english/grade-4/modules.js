import { createModule } from '../../curriculum/moduleTemplate.js';

export const englishGrade4Modules = [

  createModule({
    id: 'english-g4-sentences',
    subjectId: 'english',
    gradeId: 'P4',
    domainId: 'sentences',
    domainLabel: 'Sentence Builder+',
    title: 'Building better sentences',
    summary: 'Combine words for fluid sentences.',
    goal: 'Improve writing fluency.',
    demo: 'Demo builder.',
    guidedActivityIds: ['generated-english-sentences-p4'],
    independentActivityIds: ['generated-english-sentences-p4'],
    challengeActivityId: 'generated-english-sentences-p4',
    examActivityId: 'generated-english-sentences-p4',
    missionTitle: 'Mission Sentence Builder'
  })

];
