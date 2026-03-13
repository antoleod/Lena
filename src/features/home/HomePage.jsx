import { Link } from 'react-router-dom';
import { activities, modules, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressOverview, getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { findPositionForActivity, getWorldById, getMission } from '../../shared/gameplay/worldMap.js';
import { useEffect, useMemo, useState } from 'react';

function formatMinutes(minutes) {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export default function HomePage() {
  const { locale, t } = useLocale();
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const [profile, setProfile] = useState(() => getProfile());
  const [progressState, setProgressState] = useState(() => getProgressOverview(activities, modules));

  useEffect(() => {
    function syncStores() {
      setRewardState(getRewardState());
      setProfile(getProfile());
      setProgressState(getProgressOverview(activities, modules));
    }

    window.addEventListener('lena-rewards-change', syncStores);
    window.addEventListener('lena-progress-change', syncStores);
    window.addEventListener('lena-profile-change', syncStores);
    return () => {
      window.removeEventListener('lena-rewards-change', syncStores);
      window.removeEventListener('lena-progress-change', syncStores);
      window.removeEventListener('lena-profile-change', syncStores);
    };
  }, []);

  const snapshot = getProgressSnapshot();
  const continueActivityId = snapshot.meta.lastActivityId;
  const currentPosition = continueActivityId ? findPositionForActivity(continueActivityId) : null;
  const currentWorld = currentPosition ? getWorldById(currentPosition.worldId) : null;
  const currentMission = currentPosition ? getMission(currentPosition.worldId, currentPosition.missionId) : null;

  const weakSubjects = useMemo(() => {
    return Object.entries(progressState.subjectProgress || {})
      .map(([subjectId, entry]) => ({
        subjectId,
        completion: entry.total ? entry.completed / entry.total : 0
      }))
      .sort((left, right) => left.completion - right.completion)
      .slice(0, 3);
  }, [progressState.subjectProgress]);

  const recentSubjects = subjects.slice(0, 6);
  const currentActivity = continueActivityId ? activities.find((activity) => activity.id === continueActivityId) : null;

  return (
    <div className="page-stack page-stack--compact">
      <section className="dashboard-grid">
        <article className="panel panel--hero-compact">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('learningAdventure')}</span>
              <h2>{profile.name || t('defaultChildName')}</h2>
            </div>
            <span className="progress-badge">{progressState.streakCurrent} streak</span>
          </div>
          <p className="panel__copy">{t('heroText')}</p>
          <div className="dashboard-actions">
            <Link className="primary-action" to={continueActivityId ? `/activities/${continueActivityId}` : '/map'}>
              {continueActivityId ? t('continue') : t('startAdventure')}
            </Link>
            <Link className="secondary-action" to="/map">{t('missions')}</Link>
          </div>
          <div className="mini-metrics">
            <div><span>{t('crystals')}</span><strong>{rewardState.balance}</strong></div>
            <div><span>{t('progression')}</span><strong>{progressState.completedActivities}/{progressState.totalActivities}</strong></div>
            <div><span>{t('studyTimeLabel') || 'Study'}</span><strong>{formatMinutes(profile.totalStudyMinutes)}</strong></div>
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('continue')}</span>
              <h3>{t('continueJourneyLabel') || 'Continue journey'}</h3>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>{t('currentWorldLabel') || 'Current world'}</span>
              <strong>{currentWorld?.name || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('currentMissionLabel') || 'Current mission'}</span>
              <strong>{currentMission ? `${t('missions')} ${currentMission.order}` : '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('exercise')}</span>
              <strong>{currentActivity?.title || '-'}</strong>
            </div>
          </div>
          {currentPosition ? (
            <Link className="text-link" to={`/map/${currentPosition.worldId}/missions/${currentPosition.missionId}`}>
              {t('openMapLabel') || 'Open mission'}
            </Link>
          ) : (
            <Link className="text-link" to="/map">{t('startAdventure')}</Link>
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('progression')}</span>
              <h3>{t('globalProgressLabel') || 'Global progress'}</h3>
            </div>
          </div>
          <div className="subject-progress-list">
            {recentSubjects.map((subject) => {
              const entry = progressState.subjectProgress?.[subject.id] || { total: 0, completed: 0 };
              const percent = entry.total ? Math.round((entry.completed / entry.total) * 100) : 0;
              return (
                <Link key={subject.id} className="subject-progress-row" to={`/subjects/${subject.id}`}>
                  <span>{getSubjectLabel(subject, locale, t)}</span>
                  <div className="subject-progress-row__bar">
                    <i style={{ width: `${percent}%`, background: subject.color }}></i>
                  </div>
                  <strong>{percent}%</strong>
                </Link>
              );
            })}
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('smartTraining')}</span>
              <h3>{t('reinforceLabel') || 'Topics to reinforce'}</h3>
            </div>
          </div>
          <div className="tag-list">
            {weakSubjects.map(({ subjectId }) => {
              const subject = subjects.find((entry) => entry.id === subjectId);
              if (!subject) return null;
              return (
                <Link key={subjectId} className="tag-chip" to={`/subjects/${subjectId}`}>
                  {getSubjectLabel(subject, locale, t)}
                </Link>
              );
            })}
            <Link className="tag-chip" to="/history">{t('historyTitle') || 'History'}</Link>
            <Link className="tag-chip" to="/shop">{t('shop')}</Link>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>Mastered</span>
              <strong>{progressState.mastery?.mastered || 0}</strong>
            </div>
            <div className="detail-list__row">
              <span>Shaky</span>
              <strong>{progressState.mastery?.shaky || 0}</strong>
            </div>
            <div className="detail-list__row">
              <span>Failed</span>
              <strong>{progressState.mastery?.failed || 0}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
