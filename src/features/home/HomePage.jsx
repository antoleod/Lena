import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActivityById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { findPositionForActivity, findPositionForLevel, getMission, getWorldById } from '../../shared/gameplay/worldMap.js';

function formatMinutes(minutes) {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

function buildContinueRoute(position, activityId) {
  if (position) {
    return `/activities/${position.activityId}?world=${position.worldId}&mission=${position.missionId}&level=${position.levelOrder}`;
  }

  if (activityId) {
    return `/activities/${activityId}`;
  }

  return '/map';
}

export default function HomePage() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());

  useEffect(() => subscribeToSessionChanges(setSession), []);

  const snapshot = session.progress;
  const profile = session.profile;
  const rewards = session.rewards;
  const overview = session.overview;
  const continueActivityId = snapshot.meta.lastActivityId;
  const continueLevelId = snapshot.meta.lastLevelId;
  const currentPosition = continueLevelId
    ? findPositionForLevel(continueLevelId)
    : continueActivityId
      ? findPositionForActivity(continueActivityId)
      : null;
  const continueRoute = buildContinueRoute(currentPosition, continueActivityId);
  const currentWorld = currentPosition ? getWorldById(currentPosition.worldId) : null;
  const currentMission = currentPosition ? getMission(currentPosition.worldId, currentPosition.missionId) : null;
  const currentActivity = continueActivityId ? getActivityById(continueActivityId) : null;
  const primaryLabel = currentPosition || continueActivityId ? t('continue') : t('startAdventure');

  const profileRows = useMemo(() => ([
    {
      label: t('progression'),
      value: `${overview.completedActivities}/${overview.totalActivities || 0}`
    },
    {
      label: t('streakLabel'),
      value: String(overview.streakCurrent || 0)
    },
    {
      label: t('crystals'),
      value: String(rewards.balance || 0)
    },
    {
      label: t('studyTimeLabel') || 'Study',
      value: formatMinutes(profile.totalStudyMinutes)
    }
  ]), [overview.completedActivities, overview.streakCurrent, overview.totalActivities, profile.totalStudyMinutes, rewards.balance, t]);

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--hero-compact">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('learningAdventure')}</span>
            <h2>{profile.name || t('defaultChildName')}</h2>
          </div>
          <span className="progress-badge">{overview.streakCurrent || 0} {t('streakLabel')}</span>
        </div>

        <p className="panel__copy">
          {currentWorld
            ? `${currentWorld.name} · ${t('missions')} ${currentMission?.order || 1}`
            : t('heroText')}
        </p>

        <div className="dashboard-actions">
          <Link className="primary-action" to={continueRoute}>
            <span className="button-icon" aria-hidden="true">{currentPosition || continueActivityId ? '▶' : '✨'}</span>
            <span>{primaryLabel}</span>
          </Link>
        </div>

        <div className="mini-metrics">
          {profileRows.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('continueJourneyLabel') || 'Continue journey'}</span>
              <h3>{currentActivity?.title || t('startAdventure')}</h3>
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
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('missions')}</span>
              <h3>{t('chooseUniverse')}</h3>
            </div>
          </div>
          <div className="subject-grid subject-grid--compact dashboard-quick-links">
            <Link className="subject-tile" to="/map">
              <strong>🗺 {t('missions')}</strong>
              <span>{t('openMapLabel') || 'Open map'}</span>
            </Link>
            <Link className="subject-tile" to="/subjects">
              <strong>📚 {t('subjectsLabel')}</strong>
              <span>{t('chooseUniverse')}</span>
            </Link>
            <Link className="subject-tile" to="/history">
              <strong>📈 {t('historyTitle')}</strong>
              <span>{t('progression')}</span>
            </Link>
            <Link className="subject-tile" to="/shop">
              <strong>🛍 {t('shop')}</strong>
              <span>{t('crystals')} {rewards.balance}</span>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
