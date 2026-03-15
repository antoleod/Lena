import { createModule } from '../../curriculum/moduleTemplate.js';

export const englishGrade5Modules = [

  createModule({
    id: 'english-g5-sentences',
    subjectId: 'english',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Sentence Builder++',
    title: 'Building advanced sentences',
    summary: 'Combine words for fluid sentences.',
    goal: 'Improve writing fluency further.',
    demo: 'Demo builder 2.',
    guidedActivityIds: ['generated-english-sentences-p4'],
    independentActivityIds: ['generated-english-sentences-p4'],
    challengeActivityId: 'generated-english-sentences-p4',
    examActivityId: 'generated-english-sentences-p4',
    missionTitle: 'Mission Sentence Builder Plus'
  })

];
