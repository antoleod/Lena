import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { activities } from '../curriculum/catalog.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

export default function HistoryPage() {
  const { t } = useLocale();
  const snapshot = getProgressSnapshot();
  const entries = Object.entries(snapshot.activities)
    .map(([activityId, record]) => {
      const activity = activities.find((item) => item.id === activityId);
      if (!activity) {
        return null;
      }
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
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 30);

  if (!entries.length) {
    return (
      <section className="section-block">
        <h2>{t('historyTitle') || 'Historique'}</h2>
        <p>{t('historyEmpty') || 'Aucune activite pour le moment.'}</p>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Log</span>
            <h3>{t('historyTitle') || 'Historique recent'}</h3>
          </div>
        </div>
        <div className="history-list">
          {entries.map((entry) => (
            <article key={entry.id} className="history-row">
              <div>
                <h4>{entry.title}</h4>
                <p>{entry.subject} • {entry.completed ? t('completed') : t('inProgress')}</p>
              </div>
              <div className="history-row__meta">
                <span>{t('scoreSaved')}: {entry.bestScore}</span>
                <span>{t('missions')}: {entry.attempts}</span>
                <Link className="text-link" to={`/activities/${entry.id}`}>{t('openActivity')}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

