import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { activities, getSubjectById, modules } from '../curriculum/catalog.js';
import { getProgressOverview, getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

export default function HistoryPage() {
  const { locale, t } = useLocale();
  const snapshot = getProgressSnapshot();
  const overview = getProgressOverview(activities, modules);
  const entries = Object.entries(snapshot.activities)
    .map(([activityId, record]) => {
      const activity = activities.find((item) => item.id === activityId);
      if (!activity) return null;
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
    .slice(0, 12);

  return (
    <div className="page-stack page-stack--compact" data-testid="history-page">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('historyTitle')}</span>
            <h2>{t('globalProgressLabel')}</h2>
          </div>
        </div>
        <div className="mini-metrics">
          <div><span>{t('completed')}</span><strong>{overview.completedActivities}</strong></div>
          <div><span>{t('masteredLabel')}</span><strong>{overview.mastery?.mastered || 0}</strong></div>
          <div><span>{t('streakLabel')}</span><strong>{overview.streakCurrent || 0}</strong></div>
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('recentLabel')}</span>
            <h3>{t('historyTitle')}</h3>
          </div>
        </div>
        {!entries.length ? (
          <div className="detail-list">
            <div className="detail-list__row">
              <span>{t('historyEmpty')}</span>
              <strong><Link className="text-link" to="/map">{t('startAdventure')}</Link></strong>
            </div>
          </div>
        ) : (
          <div className="history-list history-list--compact">
            {entries.map((entry) => {
              const subject = getSubjectById(entry.subject);
              return (
                <article key={entry.id} className="history-row history-row--compact">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{subject ? getSubjectLabel(subject, locale, t) : entry.subject}</p>
                  </div>
                  <div className="history-row__meta">
                    <span>{t('bestLabel')} {entry.bestScore}</span>
                    <span>{t('attemptsLabel')} {entry.attempts}</span>
                    <span>{entry.completed ? t('completed') : t('inProgress')}</span>
                    <Link className="text-link" to={`/activities/${entry.id}`} data-testid={`history-open-${entry.id}`}>{t('openActivity')}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
