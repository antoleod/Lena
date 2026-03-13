import { mathematicsActivities, mathematicsSubject } from '../../content/mathematics/activities.js';
import { generatedMathematicsActivities } from '../../content/mathematics/generatedActivities.js';
import { mathematicsGrade2Modules } from '../../content/mathematics/grade-2/modules.js';
import { mathematicsGrade3Modules } from '../../content/mathematics/grade-3/modules.js';
import { frenchActivities, frenchSubject } from '../../content/french/activities.js';
import { generatedFrenchActivities } from '../../content/french/generatedActivities.js';
import { frenchGrade2Modules } from '../../content/french/grade-2/modules.js';
import { frenchGrade3Modules } from '../../content/french/grade-3/modules.js';
import { dutchActivities, dutchSubject } from '../../content/dutch/activities.js';
import { generatedDutchActivities } from '../../content/dutch/generatedActivities.js';
import { dutchGrade2Modules } from '../../content/dutch/grade-2/modules.js';
import { dutchGrade3Modules } from '../../content/dutch/grade-3/modules.js';
import { englishSubject, generatedEnglishActivities } from '../../content/english/generatedActivities.js';
import { englishGrade2Modules } from '../../content/english/grade-2/modules.js';
import { englishGrade3Modules } from '../../content/english/grade-3/modules.js';
import { generatedSpanishActivities, spanishSubject } from '../../content/spanish/generatedActivities.js';
import { spanishGrade2Modules } from '../../content/spanish/grade-2/modules.js';
import { spanishGrade3Modules } from '../../content/spanish/grade-3/modules.js';
import { reasoningSubject, generatedReasoningActivities } from '../../content/reasoning/generatedActivities.js';
import { reasoningGrade2Modules } from '../../content/reasoning/grade-2/modules.js';
import { reasoningGrade3Modules } from '../../content/reasoning/grade-3/modules.js';
import { storiesSubject, storyActivities } from '../../content/stories/activities.js';
import { storiesGrade2Modules } from '../../content/stories/grade-2/modules.js';
import { storiesGrade3Modules } from '../../content/stories/grade-3/modules.js';

export const subjects = [
  mathematicsSubject,
  frenchSubject,
  dutchSubject,
  englishSubject,
  spanishSubject,
  reasoningSubject,
  storiesSubject
];

export const activities = [
  ...mathematicsActivities,
  ...generatedMathematicsActivities,
  ...frenchActivities,
  ...generatedFrenchActivities,
  ...dutchActivities,
  ...generatedDutchActivities,
  ...generatedEnglishActivities,
  ...generatedSpanishActivities,
  ...generatedReasoningActivities,
  ...storyActivities
];

export const gradeCatalog = ['P2', 'P3', 'P4', 'P5', 'P6'];

export const modules = [
  ...mathematicsGrade2Modules,
  ...mathematicsGrade3Modules,
  ...frenchGrade2Modules,
  ...frenchGrade3Modules,
  ...dutchGrade2Modules,
  ...dutchGrade3Modules,
  ...englishGrade2Modules,
  ...englishGrade3Modules,
  ...spanishGrade2Modules,
  ...spanishGrade3Modules,
  ...reasoningGrade2Modules,
  ...reasoningGrade3Modules,
  ...storiesGrade2Modules,
  ...storiesGrade3Modules
];

export function getSubjectById(subjectId) {
  return subjects.find((subject) => subject.id === subjectId) || null;
}

export function getActivitiesBySubject(subjectId) {
  return activities.filter((activity) => activity.subject === subjectId);
}

export function getActivityById(activityId) {
  return activities.find((activity) => activity.id === activityId) || null;
}

export function getFeaturedActivities() {
  return activities.filter((activity) => activity.featured);
}

export function getModulesBySubjectAndGrade(subjectId, gradeId) {
  return modules.filter((module) => module.subjectId === subjectId && module.gradeId === gradeId);
}

export function getModuleById(moduleId) {
  return modules.find((module) => module.id === moduleId) || null;
}

export function getGradeProgression(subjectId) {
  return gradeCatalog.map((gradeId) => ({
    gradeId,
    modules: getModulesBySubjectAndGrade(subjectId, gradeId)
  })).filter((entry) => entry.modules.length > 0);
}

export function getCurriculumStats() {
  return {
    subjects: subjects.length,
    activities: activities.length,
    modules: modules.length,
    grades: 'P2-P6',
    engines: 4
  };
}
