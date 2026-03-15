import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade6Modules = [

  createModule({
    id: 'french-g6-language',
    subjectId: 'french',
    gradeId: 'P6',
    domainId: 'language',
    domainLabel: 'Langue P6',
    title: 'Maitrise de la langue',
    summary: 'Langue et orthographe avancees.',
    goal: 'Parfaite maitrise en vue du CEB.',
    demo: 'Demo analyse de phrase.',
    guidedActivityIds: ['generated-french-language-p6'],
    independentActivityIds: ['generated-french-language-p6'],
    challengeActivityId: 'generated-french-language-p6',
    examActivityId: 'generated-french-language-p6',
    missionTitle: 'Mission Langue CEB'
  })

];
