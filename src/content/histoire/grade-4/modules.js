import { createModule } from '../../curriculum/moduleTemplate.js';
export const histoireGrade4Modules = [
  createModule({ id: 'hist-g4-ancient', subjectId: 'histoire', gradeId: 'P4', domainId: 'ancient-medieval', domainLabel: 'Antiquite et Moyen Age', title: 'De l\'Antiquite au Moyen Age', summary: 'Grandes civilisations antiques et vie medievale.', goal: 'Situer l\'Egypte, la Grece, Rome et le Moyen Age dans le temps.', demo: 'Demo ligne du temps.', guidedActivityIds: ['hist-ancient-p4'], independentActivityIds: ['hist-medieval-p4'], challengeActivityId: 'hist-ancient-p4', examActivityId: 'hist-medieval-p4', missionTitle: 'Mission Antiquite P4', levelTitles: { 'hist-ancient-p4': 'Antiquite', 'hist-medieval-p4': 'Moyen Age' } }),
];
