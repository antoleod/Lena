import { createModule } from '../../curriculum/moduleTemplate.js';

export const dutchGrade5Modules = [

  createModule({
    id: 'dutch-g5-sentences',
    subjectId: 'dutch',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Zinnen+',
    title: 'Complexe zinnen (vervolg)',
    summary: 'Bouw langere zinnen in het Nederlands.',
    goal: 'Vloeiender worden in spreken en schrijven.',
    demo: 'Demo kalimat 2.',
    guidedActivityIds: ['generated-dutch-sentences-p4'],
    independentActivityIds: ['generated-dutch-sentences-p4'],
    challengeActivityId: 'generated-dutch-sentences-p4',
    examActivityId: 'generated-dutch-sentences-p4',
    missionTitle: 'Missie Zinnen Maken 2'
  })

];
