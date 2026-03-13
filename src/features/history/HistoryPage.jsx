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
        lastScore: record.lastScore,
        bestScore: record.bestScore,
        attempts: record.attempts,
        completed: record.completed,
        updatedAt: record.updatedAt
      };
    })
    .filter(Boolean)
    .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
    .slice(0, 24);

  return (
    <div className="page-stack page-stack--compact">
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
          <div><span>{t('failedLabel')}</span><strong>{overview.mastery?.failed || 0}</strong></div>
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
          <p className="panel__copy">{t('historyEmpty')}</p>
        ) : (
          <div className="history-list history-list--compact">
            {entries.map((entry) => {
              const subject = getSubjectById(entry.subject);
              return (
                <article key={entry.id} className="history-row history-row--compact">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{subject ? getSubjectLabel(subject, locale, t) : entry.subject} · {entry.completed ? t('completed') : t('inProgress')}</p>
                  </div>
                  <div className="history-row__meta">
                    <span>{t('bestLabel')} {entry.bestScore}</span>
                    <span>{t('attemptsLabel')} {entry.attempts}</span>
                    <Link className="text-link" to={`/activities/${entry.id}`}>{t('openActivity')}</Link>
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
