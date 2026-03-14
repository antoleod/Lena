import { getActivityById, getActivitiesBySubjectAndGrade, getModuleById, getModulesBySubjectAndGrade } from '../../features/curriculum/catalog.js';

function resolveActivities(ids = []) {
  return ids.map((activityId) => getActivityById(activityId)).filter(Boolean);
}

function createModuleStage(id, title, kind, activities) {
  if (!activities.length) {
    return null;
  }

  return {
    id,
    title,
    kind,
    activities
  };
}

export function getModuleJourney(module, labels = {}) {
  if (!module) {
    return {
      module: null,
      stages: [],
      activities: []
    };
  }

  const stages = [
    createModuleStage('guided', labels.guided || 'Guided', 'guided', resolveActivities(module.phases.guidedPractice)),
    createModuleStage('independent', labels.independent || 'Practice', 'independent', resolveActivities(module.phases.independentPractice)),
    createModuleStage('challenge', labels.challenge || 'Challenge', 'challenge', resolveActivities(module.phases.miniChallenge ? [module.phases.miniChallenge] : [])),
    createModuleStage('exam', labels.exam || 'Exam', 'exam', resolveActivities(module.phases.miniExam ? [module.phases.miniExam] : [])),
    createModuleStage('review', labels.review || 'Review', 'review', resolveActivities(module.phases.suggestedReview))
  ].filter(Boolean);

  const activities = stages.flatMap((stage) => stage.activities);

  return {
    module,
    stages,
    activities
  };
}

export function getModuleActivityPlan(moduleId, labels) {
  const module = getModuleById(moduleId);
  return getModuleJourney(module, labels);
}

export function getGradeJourney(subjectId, gradeId, labels) {
  const modules = getModulesBySubjectAndGrade(subjectId, gradeId);
  const standaloneActivities = getActivitiesBySubjectAndGrade(subjectId, gradeId);

  return {
    modules,
    standaloneActivities,
    moduleJourneys: modules.map((module) => getModuleJourney(module, labels))
  };
}
