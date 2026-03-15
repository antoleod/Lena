import { mathematicsActivities, mathematicsSubject } from '../../content/mathematics/activities.js';
import { generatedMathematicsActivities } from '../../content/mathematics/generatedActivities.js';
import { mathematicsGrade2Modules } from '../../content/mathematics/grade-2/modules.js';
import { mathematicsGrade3Modules } from '../../content/mathematics/grade-3/modules.js';
import { mathematicsGrade4Modules } from '../../content/mathematics/grade-4/modules.js';
import { mathematicsGrade5Modules } from '../../content/mathematics/grade-5/modules.js';
import { mathematicsGrade6Modules } from '../../content/mathematics/grade-6/modules.js';

import { frenchActivities, frenchSubject } from '../../content/french/activities.js';
import { generatedFrenchActivities } from '../../content/french/generatedActivities.js';
import { frenchGrade2Modules } from '../../content/french/grade-2/modules.js';
import { frenchGrade3Modules } from '../../content/french/grade-3/modules.js';
import { frenchGrade4Modules } from '../../content/french/grade-4/modules.js';
import { frenchGrade5Modules } from '../../content/french/grade-5/modules.js';
import { frenchGrade6Modules } from '../../content/french/grade-6/modules.js';

import { dutchActivities, dutchSubject } from '../../content/dutch/activities.js';
import { generatedDutchActivities } from '../../content/dutch/generatedActivities.js';
import { dutchGrade2Modules } from '../../content/dutch/grade-2/modules.js';
import { dutchGrade3Modules } from '../../content/dutch/grade-3/modules.js';
import { dutchGrade4Modules } from '../../content/dutch/grade-4/modules.js';
import { dutchGrade5Modules } from '../../content/dutch/grade-5/modules.js';
import { dutchGrade6Modules } from '../../content/dutch/grade-6/modules.js';

import { englishActivities } from '../../content/english/activities.js';
import { englishSubject, generatedEnglishActivities } from '../../content/english/generatedActivities.js';
import { englishGrade2Modules } from '../../content/english/grade-2/modules.js';
import { englishGrade3Modules } from '../../content/english/grade-3/modules.js';
import { englishGrade4Modules } from '../../content/english/grade-4/modules.js';
import { englishGrade5Modules } from '../../content/english/grade-5/modules.js';
import { englishGrade6Modules } from '../../content/english/grade-6/modules.js';

import { spanishActivities } from '../../content/spanish/activities.js';
import { generatedSpanishActivities, spanishSubject } from '../../content/spanish/generatedActivities.js';
import { spanishGrade2Modules } from '../../content/spanish/grade-2/modules.js';
import { spanishGrade3Modules } from '../../content/spanish/grade-3/modules.js';
import { spanishGrade4Modules } from '../../content/spanish/grade-4/modules.js';
import { spanishGrade5Modules } from '../../content/spanish/grade-5/modules.js';
import { spanishGrade6Modules } from '../../content/spanish/grade-6/modules.js';

import { reasoningSubject, generatedReasoningActivities } from '../../content/reasoning/generatedActivities.js';
import { reasoningGrade2Modules } from '../../content/reasoning/grade-2/modules.js';
import { reasoningGrade3Modules } from '../../content/reasoning/grade-3/modules.js';
import { reasoningGrade4Modules } from '../../content/reasoning/grade-4/modules.js';
import { reasoningGrade5Modules } from '../../content/reasoning/grade-5/modules.js';
import { reasoningGrade6Modules } from '../../content/reasoning/grade-6/modules.js';

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
  ...englishActivities,
  ...generatedEnglishActivities,
  ...spanishActivities,
  ...generatedSpanishActivities,
  ...generatedReasoningActivities,
  ...storyActivities
];

export const gradeCatalog = ['P2', 'P3', 'P4', 'P5', 'P6'];

export const modules = [
  ...mathematicsGrade4Modules,
  ...mathematicsGrade5Modules,
  ...mathematicsGrade6Modules,
  ...frenchGrade4Modules,  
  ...frenchGrade5Modules,
  ...frenchGrade6Modules,
  ...dutchGrade4Modules,
  ...dutchGrade5Modules,
  ...dutchGrade6Modules,
  ...englishGrade4Modules,
  ...englishGrade5Modules,
  ...englishGrade6Modules,
  ...spanishGrade4Modules,
  ...spanishGrade5Modules,
  ...spanishGrade6Modules,
  ...reasoningGrade4Modules,
  ...reasoningGrade5Modules,
  ...reasoningGrade6Modules,

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

export function getActivitiesBySubjectAndGrade(subjectId, gradeId) {
  return activities.filter((activity) => activity.subject === subjectId && (activity.gradeBand || []).includes(gradeId));
}

export function getModuleById(moduleId) {
  return modules.find((module) => module.id === moduleId) || null;
}

export function getGradeProgression(subjectId) {
  return gradeCatalog.map((gradeId) => ({
    gradeId,
    modules: getModulesBySubjectAndGrade(subjectId, gradeId),
    activities: getActivitiesBySubjectAndGrade(subjectId, gradeId)
  })).filter((entry) => entry.modules.length > 0 || entry.activities.length > 0);
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

