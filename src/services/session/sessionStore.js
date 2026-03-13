import { activities, modules } from '../../features/curriculum/catalog.js';
import { getProfile, saveProfile } from '../storage/profileStore.js';
import { getProgressOverview, getProgressSnapshot } from '../storage/progressStore.js';
import { getRewardState } from '../storage/rewardStore.js';

const SESSION_EVENTS = ['lena-profile-change', 'lena-progress-change', 'lena-rewards-change'];

export function getSessionSnapshot() {
  return {
    profile: getProfile(),
    rewards: getRewardState(),
    progress: getProgressSnapshot(),
    overview: getProgressOverview(activities, modules)
  };
}

export function subscribeToSessionChanges(listener) {
  const wrapped = () => listener(getSessionSnapshot());
  SESSION_EVENTS.forEach((eventName) => window.addEventListener(eventName, wrapped));

  return () => {
    SESSION_EVENTS.forEach((eventName) => window.removeEventListener(eventName, wrapped));
  };
}

export function rememberLastVisitedRoute(route) {
  if (!route) {
    return null;
  }

  const profile = getProfile();
  if (profile.lastVisitedRoute === route) {
    return route;
  }

  saveProfile({ lastVisitedRoute: route });
  return route;
}

