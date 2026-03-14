import { resolveActivity } from '../../content/registry/activityRegistry.js';

function warnMissingScope(scope, key) {
  if (import.meta.env.DEV) {
    console.warn(`[content:${scope}] Missing activity reference: ${key}`);
  }
}

export function resolveExistingActivities(activityIds = [], scope = 'content') {
  return activityIds
    .map((activityId) => {
      const activity = resolveActivity(activityId);
      if (!activity && activityId) {
        warnMissingScope(scope, activityId);
      }
      return activity;
    })
    .filter(Boolean);
}

export function resolveExistingActivityIds(activityIds = [], scope = 'content') {
  return resolveExistingActivities(activityIds, scope).map((activity) => activity.id);
}
