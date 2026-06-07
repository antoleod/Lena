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
import RenforcementHubPage from '../../features/renforcement/RenforcementHubPage.jsx';
import RenforcementSectionPage from '../../features/renforcement/RenforcementSectionPage.jsx';
import PracticePage from '../../features/practice/PracticePage.jsx';
import LessonsHubPage from '../../features/lessons/LessonsHubPage.jsx';
import LessonPlayerPage from '../../features/lessons/LessonPlayerPage.jsx';
import ParentalPage from '../../features/parental/ParentalPage.jsx';
import ExamHubPage from '../../features/exam/ExamHubPage.jsx';
import ExamPage from '../../features/exam/ExamPage.jsx';
import LectureHubPage from '../../features/exam/LectureHubPage.jsx';
import LectureReaderPage from '../../features/exam/LectureReaderPage.jsx';
import ErrorReviewPage from '../../features/exam/ErrorReviewPage.jsx';
import ExamLibraryHubPage from '../../features/exam/library/ExamLibraryHubPage.jsx';
import ExamLibraryCategoryPage from '../../features/exam/library/ExamLibraryCategoryPage.jsx';
import ExamRunnerPage from '../../features/exam/library/ExamRunnerPage.jsx';
import ExamHistoryPage from '../../features/exam/library/ExamHistoryPage.jsx';
import CahierHistoryPage from '../../features/exerciseGenerator/CahierHistoryPage.jsx';
import ExerciseGeneratorPage from '../../features/exerciseGenerator/ExerciseGeneratorPage.jsx';
import GeometryPage from '../../features/mathGeometry/GeometryPage.jsx';
import CalculationChallengePage from '../../features/mathChallenges/CalculationChallengePage.jsx';
import MixedCalcPage from '../../features/mathChallenges/MixedCalcPage.jsx';
import MixedModePage from '../../features/exerciseGenerator/MixedModePage.jsx';
import TablesPage from '../../features/tables/TablesPage.jsx';
import DuduPage from '../../features/dudu/DuduPage.jsx';
import ChronoPage from '../../features/chrono/ChronoPage.jsx';
import StoryLibraryPage from '../../features/stories/StoryLibraryPage.jsx';
import StoryReaderPage from '../../features/stories/StoryReaderPage.jsx';
import PratiquerHubPage from '../../features/practise/PratiquerHubPage.jsx';
import ApprendreHubPage from '../../features/apprendre/ApprendreHubPage.jsx';
import JeuxHubPage from '../../features/jeux/JeuxHubPage.jsx';
import MemoryGamePage from '../../features/jeux/MemoryGamePage.jsx';
import SpeedMathPage from '../../features/jeux/SpeedMathPage.jsx';
import WordScramblePage from '../../features/jeux/WordScramblePage.jsx';
import MotsCachesPage from '../../features/jeux/MotsCachesPage.jsx';
import DevinettesPage from '../../features/jeux/DevinettesPage.jsx';
import CompleteLaPhrasePage from '../../features/jeux/CompleteLaPhrasePage.jsx';
import TrouveIntrusPage from '../../features/jeux/TrouveIntrusPage.jsx';
import CourseMathsPage from '../../features/jeux/CourseMathsPage.jsx';
import DetectiveHistoiresPage from '../../features/jeux/DetectiveHistoiresPage.jsx';
import BullesCalculPage from '../../features/jeux/BullesCalculPage.jsx';
import ChasseLettrePage from '../../features/jeux/ChasseLettrePage.jsx';
import SuiteLogiquePage from '../../features/jeux/SuiteLogiquePage.jsx';
import QuizCulturePage from '../../features/jeux/QuizCulturePage.jsx';
import MotsCroisesPage from '../../features/jeux/MotsCroisesPage.jsx';
import SauteMoutonPage from '../../features/jeux/SauteMoutonPage.jsx';
import TetrisPage from '../../features/jeux/TetrisPage.jsx';
import TaupesMathsPage from '../../features/jeux/TaupesMathsPage.jsx';
import ConjugueVitePage from '../../features/jeux/ConjugueVitePage.jsx';
import HorlogePage from '../../features/jeux/HorlogePage.jsx';
import AntonymesPage from '../../features/jeux/AntonymesPage.jsx';
import TrieExpressPage from '../../features/jeux/TrieExpressPage.jsx';
import BombesMathsPage from '../../features/jeux/BombesMathsPage.jsx';
import OrdreAlphaPage from '../../features/jeux/OrdreAlphaPage.jsx';
import PhraseMysteryPage from '../../features/jeux/PhraseMysteryPage.jsx';
import SequenceImagePage from '../../features/jeux/SequenceImagePage.jsx';
import NombreSecretPage from '../../features/jeux/NombreSecretPage.jsx';
import PlusPetitPlusGrandPage from '../../features/jeux/PlusPetitPlusGrandPage.jsx';
import CodeurMathsPage from '../../features/jeux/CodeurMathsPage.jsx';
import GrammiPage from '../../features/grammi/GrammiPage.jsx';
import MetriPage from '../../features/metri/MetriPage.jsx';
import LexiPage from '../../features/lexi/LexiPage.jsx';
import VerbPage from '../../features/verbes/VerbPage.jsx';

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
        <Route path="/renforcement" element={<RenforcementHubPage />} />
        <Route path="/renforcement/:sectionId" element={<RenforcementSectionPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/lessons" element={<LessonsHubPage />} />
        <Route path="/lessons/:lessonId" element={<LessonPlayerPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/parental" element={<ParentalPage />} />
        <Route path="/exam" element={<ExamHubPage />} />
        <Route path="/exam/play" element={<ExamPage />} />
        <Route path="/exam/lecture" element={<LectureHubPage />} />
        <Route path="/exam/lecture/play" element={<LectureReaderPage />} />
        <Route path="/exam/errors" element={<ErrorReviewPage />} />
        <Route path="/exam/library" element={<ExamLibraryHubPage />} />
        <Route path="/exam/history" element={<ExamHistoryPage />} />
        <Route path="/exam/library/play" element={<ExamRunnerPage />} />
        <Route path="/exam/library/:categoryId" element={<ExamLibraryCategoryPage />} />
        <Route path="/cahier" element={<ExerciseGeneratorPage />} />
        <Route path="/cahier/historique" element={<CahierHistoryPage />} />
        <Route path="/cahier/geometrie" element={<GeometryPage />} />
        <Route path="/cahier/defis-calcul" element={<CalculationChallengePage />} />
        <Route path="/cahier/calculs-melanges" element={<MixedModePage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/dudu" element={<DuduPage />} />
        <Route path="/chrono" element={<ChronoPage />} />
        <Route path="/stories" element={<StoryLibraryPage />} />
        <Route path="/stories/:id" element={<StoryReaderPage />} />
        <Route path="/pratiquer" element={<PratiquerHubPage />} />
        <Route path="/apprendre" element={<ApprendreHubPage />} />
        <Route path="/jeux" element={<JeuxHubPage />} />
        <Route path="/jeux/memory" element={<MemoryGamePage />} />
        <Route path="/jeux/calcul-rapide" element={<SpeedMathPage />} />
        <Route path="/jeux/mots-melanges" element={<WordScramblePage />} />
        <Route path="/jeux/mots-caches" element={<MotsCachesPage />} />
        <Route path="/jeux/devinettes" element={<DevinettesPage />} />
        <Route path="/jeux/complete-phrase" element={<CompleteLaPhrasePage />} />
        <Route path="/jeux/intrus" element={<TrouveIntrusPage />} />
        <Route path="/jeux/course-maths" element={<CourseMathsPage />} />
        <Route path="/jeux/detective-histoires" element={<DetectiveHistoiresPage />} />
        <Route path="/jeux/bulles-calcul" element={<BullesCalculPage />} />
        <Route path="/jeux/chasse-lettres" element={<ChasseLettrePage />} />
        <Route path="/jeux/suite-logique" element={<SuiteLogiquePage />} />
        <Route path="/jeux/quiz-culture" element={<QuizCulturePage />} />
        <Route path="/jeux/mots-croises" element={<MotsCroisesPage />} />
        <Route path="/jeux/saute-mouton" element={<SauteMoutonPage />} />
        <Route path="/jeux/tetris" element={<TetrisPage />} />
        <Route path="/jeux/taupes" element={<TaupesMathsPage />} />
        <Route path="/jeux/conjugue" element={<ConjugueVitePage />} />
        <Route path="/jeux/horloge" element={<HorlogePage />} />
        <Route path="/jeux/antonymes" element={<AntonymesPage />} />
        <Route path="/jeux/trie-express" element={<TrieExpressPage />} />
        <Route path="/jeux/bombes-maths" element={<BombesMathsPage />} />
        <Route path="/jeux/ordre-alpha" element={<OrdreAlphaPage />} />
        <Route path="/jeux/phrase-mystere" element={<PhraseMysteryPage />} />
        <Route path="/jeux/histoire-ordre" element={<SequenceImagePage />} />
        <Route path="/jeux/nombre-secret" element={<NombreSecretPage />} />
        <Route path="/jeux/comparaison" element={<PlusPetitPlusGrandPage />} />
        <Route path="/jeux/codeur-maths" element={<CodeurMathsPage />} />
        <Route path="/grammi" element={<GrammiPage />} />
        <Route path="/metri" element={<MetriPage />} />
        <Route path="/lexi" element={<LexiPage />} />
        <Route path="/verbes" element={<VerbPage />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="*" element={<Navigate to={needsOnboarding && !onboardingActive ? '/onboarding' : '/'} replace />} />
      </Route>
    </Routes>
  );
}
