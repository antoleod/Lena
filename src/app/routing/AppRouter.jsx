import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../layout/AppShell.jsx';
import HomePage from '../../features/home/HomePage.jsx';
import SubjectPage from '../../features/subject/SubjectPage.jsx';
import GradePage from '../../features/grade/GradePage.jsx';
import ModulePage from '../../features/module/ModulePage.jsx';
import ActivityPage from '../../features/activity/ActivityPage.jsx';
import ShopPage from '../../features/shop/ShopPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/subjects/:subjectId" element={<SubjectPage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId" element={<GradePage />} />
        <Route path="/subjects/:subjectId/grades/:gradeId/modules/:moduleId" element={<ModulePage />} />
        <Route path="/activities/:activityId" element={<ActivityPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
