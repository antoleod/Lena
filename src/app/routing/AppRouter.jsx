import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../layout/AppShell.jsx';
import HomePage from '../../features/home/HomePage.jsx';
import SubjectPage from '../../features/subject/SubjectPage.jsx';
import GradePage from '../../features/grade/GradePage.jsx';
import ModulePage from '../../features/module/ModulePage.jsx';
import ActivityPage from '../../features/activity/ActivityPage.jsx';
import ShopPage from '../../features/shop/ShopPage.jsx';
import OnboardingFlow from '../../features/onboarding/OnboardingFlow.jsx';
import MapPage from '../../features/map/MapPage.jsx';
import WorldDetailPage from '../../features/map/WorldDetailPage.jsx';
import HistoryPage from '../../features/history/HistoryPage.jsx';
import { isProfileComplete } from '../../services/storage/profileStore.js';

export default function AppRouter() {
  const needsOnboarding = typeof window !== 'undefined' && !isProfileComplete();

  return (
    <Routes>
      <Route path="/onboarding" element={needsOnboarding ? <OnboardingFlow /> : <Navigate to="/" replace />} />
      <Route element={<AppShell />}>
        <Route path="/" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:worldId" element={<WorldDetailPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectPage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId" element={<GradePage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId/modules/:moduleId" element={<ModulePage />} />
        <Route path="/activities/:activityId" element={<ActivityPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to={needsOnboarding ? '/onboarding' : '/'} replace />} />
      </Route>
    </Routes>
  );
}
