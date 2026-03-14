import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import AppShell from '../layout/AppShell.jsx';
import HomePage from '../../features/home/HomePage.jsx';
import SubjectPage from '../../features/subject/SubjectPage.jsx';
import SubjectsHubPage from '../../features/subject/SubjectsHubPage.jsx';
import GradePage from '../../features/grade/GradePage.jsx';
import ModulePage from '../../features/module/ModulePage.jsx';
import ActivityPage from '../../features/activity/ActivityPage.jsx';
import ShopPage from '../../features/shop/ShopPage.jsx';
import OnboardingFlow from '../../features/onboarding/OnboardingFlow.jsx';
import MapPage from '../../features/map/MapPage.jsx';
import WorldDetailPage from '../../features/map/WorldDetailPage.jsx';
import MissionPage from '../../features/map/MissionPage.jsx';
import HistoryPage from '../../features/history/HistoryPage.jsx';
import SettingsPage from '../../features/settings/SettingsPage.jsx';
import { resolveActivity } from '../../content/registry/activityRegistry.js';
import { resolveMissionById } from '../../content/registry/worldRegistry.js';
import { isProfileComplete } from '../../services/storage/profileStore.js';
import { getNextAdventureTarget } from '../../shared/gameplay/adventureProgress.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function isOnboardingFlowActive() {
  try {
    return window.sessionStorage.getItem('lena:onboarding:active') === '1';
  } catch {
    return false;
  }
}

function LegacyModuleActivityRedirect() {
  const { moduleId, activityId } = useParams();
  const [searchParams] = useSearchParams();
  const activity = activityId ? resolveActivity(activityId) : null;

  if (!activity) {
    return <Navigate to="/" replace />;
  }

  const nextParams = new URLSearchParams(searchParams);
  if (moduleId && !nextParams.has('module')) {
    nextParams.set('module', moduleId);
  }

  const query = nextParams.toString();
  return <Navigate to={`/activities/${activity.id}${query ? `?${query}` : ''}`} replace />;
}

function ContinueRedirect() {
  const nextTarget = getNextAdventureTarget(getProgressSnapshot());
  return <Navigate to={nextTarget?.route || '/map'} replace />;
}

function LessonRedirect() {
  const { lessonId } = useParams();
  const activity = lessonId ? resolveActivity(lessonId) : null;
  return <Navigate to={activity ? `/activities/${activity.id}` : '/map'} replace />;
}

function MissionRedirect() {
  const { missionId } = useParams();
  const resolved = missionId ? resolveMissionById(missionId) : null;
  return <Navigate to={resolved ? `/map/${resolved.world.id}/missions/${resolved.mission.id}` : '/map'} replace />;
}

export default function AppRouter() {
  const [needsOnboarding, setNeedsOnboarding] = useState(() => typeof window !== 'undefined' && !isProfileComplete());
  const [onboardingActive, setOnboardingActive] = useState(() => typeof window !== 'undefined' && isOnboardingFlowActive());

  useEffect(() => {
    function syncProfile() {
      setNeedsOnboarding(!isProfileComplete());
      setOnboardingActive(isOnboardingFlowActive());
    }

    syncProfile();
    window.addEventListener('lena-profile-change', syncProfile);
    window.addEventListener('lena-profile-logout', syncProfile);
    window.addEventListener('storage', syncProfile);
    window.addEventListener('lena-onboarding-change', syncProfile);
    return () => {
      window.removeEventListener('lena-profile-change', syncProfile);
      window.removeEventListener('lena-profile-logout', syncProfile);
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('lena-onboarding-change', syncProfile);
    };
  }, []);

  return (
    <Routes>
      <Route path="/onboarding" element={needsOnboarding || onboardingActive ? <OnboardingFlow /> : <Navigate to="/" replace />} />
      <Route element={<AppShell />}>
        <Route path="/" element={needsOnboarding && !onboardingActive ? <Navigate to="/onboarding" replace /> : <HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/continue" element={<ContinueRedirect />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:worldId" element={<WorldDetailPage />} />
        <Route path="/map/:worldId/missions/:missionId" element={<MissionPage />} />
        <Route path="/subjects" element={<SubjectsHubPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectPage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId" element={<GradePage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId/modules/:moduleId" element={<ModulePage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId/modules/:moduleId/:activityId" element={<LegacyModuleActivityRedirect />} />
        <Route path="/lesson/:lessonId" element={<LessonRedirect />} />
        <Route path="/mission/:missionId" element={<MissionRedirect />} />
        <Route path="/activities/:activityId" element={<ActivityPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="*" element={<Navigate to={needsOnboarding && !onboardingActive ? '/onboarding' : '/'} replace />} />
      </Route>
    </Routes>
  );
}
