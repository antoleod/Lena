import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { activities, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
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
  const { locale, t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());

  useEffect(() => subscribeToSessionChanges(setSession), []);

  const snapshot = session.progress;
  const profile = session.profile;
  const rewardState = session.rewards;
  const progressState = session.overview;
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
  const currentActivity = continueActivityId ? activities.find((activity) => activity.id === continueActivityId) : null;

  const subjectEntries = useMemo(() => {
    return subjects.map((subject) => {
      const entry = progressState.subjectProgress?.[subject.id] || { total: 0, completed: 0 };
      const percent = entry.total ? Math.round((entry.completed / entry.total) * 100) : 0;
      return {
        subject,
        total: entry.total,
        completed: entry.completed,
        percent
      };
    });
  }, [progressState.subjectProgress]);

  const weakSubjects = useMemo(() => {
    return subjectEntries
      .filter((entry) => entry.total > 0)
      .sort((left, right) => left.percent - right.percent)
      .slice(0, 3);
  }, [subjectEntries]);

  const recentEntries = useMemo(() => {
    return Object.entries(snapshot.activities || {})
      .map(([activityId, record]) => {
        const activity = activities.find((item) => item.id === activityId);
        if (!activity) {
          return null;
        }

        return {
          id: activityId,
          title: activity.title,
          subject: activity.subject,
          lastScore: record.lastScore || 0,
          bestScore: record.bestScore || 0,
          attempts: record.attempts || 0,
          completed: Boolean(record.completed),
          updatedAt: record.updatedAt || 0
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .slice(0, 6);
  }, [snapshot.activities]);

  const recentStories = recentEntries.filter((entry) => entry.subject === 'stories').slice(0, 3);

  return (
    <div className="page-stack page-stack--compact">
      <section className="dashboard-grid">
        <article className="panel panel--hero-compact">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('learningAdventure')}</span>
              <h2>{profile.name || t('defaultChildName')}</h2>
            </div>
            <span className="progress-badge">{progressState.streakCurrent} {t('streakLabel')}</span>
          </div>

          <p className="panel__copy">
            {currentWorld
              ? `${t('currentWorldLabel') || 'Current world'}: ${currentWorld.name}`
              : t('heroText')}
          </p>

          <div className="dashboard-actions">
            <Link className="primary-action" to={continueRoute}>
              {currentPosition || continueActivityId ? t('continue') : t('startAdventure')}
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
              <span>{t('level')}</span>
              <strong>{currentPosition?.levelOrder || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('exercise')}</span>
              <strong>{currentActivity?.title || '-'}</strong>
            </div>
          </div>

          <div className="subject-grid subject-grid--compact dashboard-quick-links">
            <Link className="subject-tile" to="/map">
              <strong>{t('missions')}</strong>
              <span>{t('openMapLabel') || 'Open mission'}</span>
            </Link>
            <Link className="subject-tile" to="/subjects">
              <strong>{t('subjectsLabel')}</strong>
              <span>{t('chooseUniverse')}</span>
            </Link>
            <Link className="subject-tile" to="/history">
              <strong>{t('historyTitle')}</strong>
              <span>{t('progression')}</span>
            </Link>
            <Link className="subject-tile" to="/shop">
              <strong>{t('shop')}</strong>
              <span>{t('shopThemes')}</span>
            </Link>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('globalProgressLabel') || 'Global progress'}</span>
              <h3>{t('subjectsLabel')}</h3>
            </div>
          </div>

          <div className="subject-progress-list">
            {subjectEntries.map(({ subject, percent, completed, total }) => (
              <Link key={subject.id} className="subject-progress-row" to={`/subjects/${subject.id}`}>
                <span>{getSubjectLabel(subject, locale, t)}</span>
                <div className="subject-progress-row__bar">
                  <i style={{ width: `${percent}%`, background: subject.color }}></i>
                </div>
                <strong>{completed}/{total || 0}</strong>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('smartTraining')}</span>
              <h3>{t('reinforceLabel') || 'To reinforce'}</h3>
            </div>
          </div>

          <div className="tag-list">
            {weakSubjects.map(({ subject }) => (
              <Link key={subject.id} className="tag-chip" to={`/subjects/${subject.id}`}>
                {getSubjectLabel(subject, locale, t)}
              </Link>
            ))}
            <Link className="tag-chip" to="/settings">{t('settingsLabel')}</Link>
            <Link className="tag-chip" to="/shop">{t('shop')}</Link>
          </div>

          <div className="mini-metrics mini-metrics--stacked">
            <div><span>{t('masteredLabel')}</span><strong>{progressState.mastery?.mastered || 0}</strong></div>
            <div><span>{t('shakyLabel')}</span><strong>{progressState.mastery?.shaky || 0}</strong></div>
            <div><span>{t('failedLabel')}</span><strong>{progressState.mastery?.failed || 0}</strong></div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('historyTitle')}</span>
              <h3>{t('openActivity')}</h3>
            </div>
          </div>

          {!recentEntries.length ? (
            <p className="panel__copy">{t('noLevel')}</p>
          ) : (
            <div className="history-list history-list--compact">
              {recentEntries.map((entry) => (
                <article key={entry.id} className="history-row history-row--compact">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.completed ? t('completed') : t('inProgress')}</p>
                  </div>
                  <div className="history-row__meta">
                    <span>{t('bestLabel')} {entry.bestScore}</span>
                    <span>{t('attemptsLabel')} {entry.attempts}</span>
                    <Link className="text-link" to={`/activities/${entry.id}`}>{t('openActivity')}</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('stories')}</span>
              <h3>{t('readingAndUnderstanding')}</h3>
            </div>
          </div>

          {recentStories.length ? (
            <div className="history-list history-list--compact">
              {recentStories.map((entry) => (
                <article key={entry.id} className="history-row history-row--compact">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{t('stories')}</p>
                  </div>
                  <div className="history-row__meta">
                    <span>{t('bestLabel')} {entry.bestScore}</span>
                    <Link className="text-link" to={`/activities/${entry.id}`}>{t('openActivity')}</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="detail-list">
              <div className="detail-list__row">
                <span>{t('stories')}</span>
                <strong>{activities.filter((activity) => activity.subject === 'stories').length}</strong>
              </div>
              <div className="detail-list__row">
                <span>{t('missions')}</span>
                <strong>{currentWorld?.missions?.length || 0}</strong>
              </div>
              <div className="detail-list__row">
                <span>{t('progression')}</span>
                <strong>{progressState.completedActivities}</strong>
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
