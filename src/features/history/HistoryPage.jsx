import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { activities, getSubjectById, modules } from '../curriculum/catalog.js';
import { getProgressOverview, getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

const SUBJECT_COLORS = {
  mathematics: '#667eea',
  french: '#f5576c',
  dutch: '#4facfe',
  english: '#43e97b',
  spanish: '#fa709a',
  reasoning: '#a18cd1',
  stories: '#fcb69f',
};

const SUBJECT_ICONS = {
  mathematics: '🔢',
  french: '✍️',
  dutch: '🗣️',
  english: '🌍',
  spanish: '🌞',
  reasoning: '🧩',
  stories: '📖',
};

function ScoreBar({ score, best }) {
  const percent = best > 0 ? Math.round((score / best) * 100) : 100;
  return (
    <div className="history-score-bar">
      <div
        className="history-score-bar__fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

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
        updatedAt: record.updatedAt || 0,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .slice(0, 20);

  const overviewStats = [
    { icon: '✅', label: t('completed'), value: overview.completedActivities, color: '#43e97b' },
    { icon: '🏆', label: t('masteredLabel'), value: overview.mastery?.mastered || 0, color: '#ffcf74' },
    { icon: '🔥', label: t('streakLabel'), value: overview.streakCurrent || 0, color: '#fa709a' },
  ];

  return (
    <div className="page-stack page-stack--compact" data-testid="history-page">
      {/* Stats bar */}
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('historyTitle')}</span>
            <h1 style={{ margin: '4px 0 0', fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}>
              {t('globalProgressLabel')}
            </h1>
          </div>
        </div>
        <div className="history-stats">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="history-stat">
              <span className="history-stat__icon" aria-hidden="true" style={{ '--stat-color': stat.color }}>
                {stat.icon}
              </span>
              <strong className="history-stat__value">{stat.value}</strong>
              <span className="history-stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Activity log */}
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('recentLabel')}</span>
            <h2 style={{ margin: '4px 0 0', fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem' }}>
              {t('historyTitle')}
            </h2>
          </div>
          {entries.length > 0 && (
            <span className="home-badge home-badge--blue">{entries.length} actividades</span>
          )}
        </div>

        {!entries.length ? (
          <div className="history-empty">
            <span aria-hidden="true">🚀</span>
            <p>{t('historyEmpty')}</p>
            <Link className="primary-action" to="/map">
              <span className="button-icon" aria-hidden="true">🗺️</span>
              <span>{t('startAdventure')}</span>
            </Link>
          </div>
        ) : (
          <div className="history-entries">
            {entries.map((entry) => {
              const subject = getSubjectById(entry.subject);
              const color = SUBJECT_COLORS[entry.subject] || '#a689ff';
              const icon = SUBJECT_ICONS[entry.subject] || '📚';

              return (
                <article key={entry.id} className="history-entry">
                  <div className="history-entry__icon" style={{ '--entry-color': color }} aria-hidden="true">
                    {icon}
                  </div>
                  <div className="history-entry__content">
                    <strong className="history-entry__title">{entry.title}</strong>
                    <span className="history-entry__subject">
                      {subject ? getSubjectLabel(subject, locale, t) : entry.subject}
                    </span>
                    <ScoreBar score={entry.lastScore} best={entry.bestScore || entry.lastScore || 1} />
                  </div>
                  <div className="history-entry__meta">
                    <span className={`history-entry__status${entry.completed ? ' is-done' : ''}`}>
                      {entry.completed ? '✅' : '⏳'}
                    </span>
                    <span className="history-entry__score">{entry.bestScore}</span>
                    <span className="history-entry__attempts">{entry.attempts}×</span>
                    <Link
                      className="history-entry__cta"
                      to={`/activities/${entry.id}`}
                      data-testid={`history-open-${entry.id}`}
                    >
                      ▶
                    </Link>
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
