import { createModule } from '../../curriculum/moduleTemplate.js';
export const sciencesGrade4Modules = [
  createModule({ id: 'sci-g4-matter', subjectId: 'sciences', gradeId: 'P4', domainId: 'matter-ecosystems', domainLabel: 'Matiere et ecosystemes', title: 'La matiere et les ecosystemes', summary: 'Etats de la matiere et chaines alimentaires.', goal: 'Decrire les changements d\'etat et les relations dans un ecosysteme.', demo: 'Demo fusion et evaporation.', guidedActivityIds: ['sci-matter-p4'], independentActivityIds: ['sci-ecosystems-p4'], challengeActivityId: 'sci-matter-p4', examActivityId: 'sci-ecosystems-p4', missionTitle: 'Mission Matiere P4', levelTitles: { 'sci-matter-p4': 'Etats de la matiere', 'sci-ecosystems-p4': 'Chaines alimentaires' } }),
];
