import { activities, getActivityById } from '../../features/curriculum/catalog.js';
import { renforcementActivities } from '../../content/renforcement/activities.js';

function warnMissing(type, key) {
  if (import.meta.env.DEV) {
    console.warn(`[registry:${type}] Missing key: ${key}`);
  }
}

export function getActivityRegistry() {
  return activities.reduce((registry, activity) => {
    registry[activity.id] = activity;
    return registry;
  }, {});
}

export function resolveActivity(activityId) {
  const activity = getActivityById(activityId) || renforcementActivities.find((entry) => entry.id === activityId);
  if (!activity && activityId) {
    warnMissing('activity', activityId);
  }
  return activity || null;
}

