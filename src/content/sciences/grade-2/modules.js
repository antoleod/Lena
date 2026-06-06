import { createModule } from '../../curriculum/moduleTemplate.js';
export const sciencesGrade2Modules = [
  createModule({ id: 'sci-g2-body', subjectId: 'sciences', gradeId: 'P2', domainId: 'body', domainLabel: 'Corps et sens', title: 'Mon corps et mes 5 sens', summary: 'Decouvrir les parties du corps et les 5 sens.', goal: 'Nommer les parties du corps et associer chaque sens a son organe.', demo: 'Demo interactive corps humain.', guidedActivityIds: ['sci-body-p2'], independentActivityIds: ['sci-animals-p2'], challengeActivityId: 'sci-body-p2', examActivityId: 'sci-animals-p2', missionTitle: 'Mission Corps Humain P2', levelTitles: { 'sci-body-p2': 'Les 5 sens', 'sci-animals-p2': 'Les animaux' } }),
];
