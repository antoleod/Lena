import { mathematicsActivities, mathematicsSubject } from '../../content/mathematics/activities.js';
import { generatedMathematicsActivities } from '../../content/mathematics/generatedActivities.js';
import { frenchActivities, frenchSubject } from '../../content/french/activities.js';
import { generatedFrenchActivities } from '../../content/french/generatedActivities.js';
import { dutchActivities, dutchSubject } from '../../content/dutch/activities.js';
import { generatedDutchActivities } from '../../content/dutch/generatedActivities.js';
import { englishSubject, generatedEnglishActivities } from '../../content/english/generatedActivities.js';
import { generatedSpanishActivities, spanishSubject } from '../../content/spanish/generatedActivities.js';
import { storiesSubject, storyActivities } from '../../content/stories/activities.js';

export const subjects = [
  mathematicsSubject,
  frenchSubject,
  dutchSubject,
  englishSubject,
  spanishSubject,
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
  ...storyActivities
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

export function getCurriculumStats() {
  return {
    subjects: subjects.length,
    activities: activities.length,
    grades: 'P2-P3',
    engines: 4
  };
}
