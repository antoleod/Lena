import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { getAdventureDashboard } from '../../shared/gameplay/adventureProgress.js';
import InstallAppButton from '../../shared/ui/InstallAppButton.jsx';

function formatMinutes(minutes) {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export default function HomePage() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());

  useEffect(() => subscribeToSessionChanges(setSession), []);

  const profile = session.profile;
  const rewards = session.rewards;
  const overview = session.overview;
  const adventure = getAdventureDashboard(session.progress);
  const nextTarget = adventure.nextTarget;
  const primaryRoute = nextTarget?.route || '/map';
  const primaryLabel = nextTarget ? t('homeContinueMission') : t('startAdventure');
  const totalProgress = adventure.totalNodes ? Math.round((adventure.completedNodes / adventure.totalNodes) * 100) : 0;

  const progressRows = useMemo(() => ([
    { label: t('progression'), value: `${totalProgress}%` },
    { label: t('streakLabel'), value: String(overview.streakCurrent || 0) },
    { label: t('crystals'), value: String(rewards.balance || 0) },
    { label: t('homeCompletedNodes'), value: `${adventure.completedNodes}/${adventure.totalNodes || 0}` }
  ]), [adventure.completedNodes, adventure.totalNodes, overview.streakCurrent, rewards.balance, t, totalProgress]);

  return (
    <div className="page-stack page-stack--compact" data-testid="home-page">
      <section className="panel panel--hero-compact">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('homeDashboardEyebrow')}</span>
            <h2>{profile.name || t('defaultChildName')}</h2>
          </div>
          <span className="progress-badge">{overview.streakCurrent || 0} {t('streakLabel')}</span>
        </div>

        <p className="panel__copy">
          {nextTarget
            ? `${nextTarget.world.title} · ${t('currentMissionLabel').toLowerCase()} ${nextTarget.mission.order} · ${nextTarget.activity?.title || t('homeNextLessonFallback')}`
            : t('homeReadyAdventure')}
        </p>

        <div className="dashboard-actions">
          <Link className="primary-action" to={primaryRoute} data-testid="home-primary-cta">
            <span className="button-icon" aria-hidden="true">{nextTarget ? '▶' : '✨'}</span>
            <span>{primaryLabel}</span>
          </Link>
          <InstallAppButton />
        </div>

        <div className="mini-metrics">
          {progressRows.map((item) => (
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
              <span className="eyebrow">{t('currentMissionLabel')}</span>
              <h3>{nextTarget?.mission?.title || t('homeMissionStartTitle')}</h3>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>{t('homeWorldLabel')}</span>
              <strong>{nextTarget?.world?.title || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('homeLessonLabel')}</span>
              <strong>{nextTarget?.activity?.title || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('homeRewardLabel')}</span>
              <strong>+10 {t('crystals')}</strong>
            </div>
          </div>
          <div className="dashboard-actions">
            <Link className="primary-action" to={primaryRoute}>
              <span className="button-icon" aria-hidden="true">🎯</span>
              <span>{t('homeContinueMission')}</span>
            </Link>
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('homeResumeEyebrow')}</span>
              <h3>{t('homeWhereNext')}</h3>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>{t('homeNextNodeLabel')}</span>
              <strong>{nextTarget ? `${t('level')} ${nextTarget.level.order}` : '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('studyTimeLabel')}</span>
              <strong>{formatMinutes(profile.totalStudyMinutes)}</strong>
            </div>
            <div className="detail-list__row">
              <span>{t('homeBestHabitLabel')}</span>
              <strong>{overview.streakCurrent ? `${overview.streakCurrent} ${t('homeDaysLabel')}` : t('homeNewSeries')}</strong>
            </div>
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('homeQuickActionsEyebrow')}</span>
              <h3>{t('homeQuickActionsTitle')}</h3>
            </div>
          </div>
          <div className="subject-grid subject-grid--compact dashboard-quick-links">
            <Link className="subject-tile" to="/map" data-testid="home-link-map">
              <strong>{t('homeMapCardTitle')}</strong>
              <span>{t('homeMapCardCopy')}</span>
            </Link>
            <Link className="subject-tile" to="/subjects" data-testid="home-link-subjects">
              <strong>{t('homeSubjectsCardTitle')}</strong>
              <span>{t('homeSubjectsCardCopy')}</span>
            </Link>
            <Link className="subject-tile" to="/history" data-testid="home-link-history">
              <strong>{t('homeHistoryCardTitle')}</strong>
              <span>{t('homeHistoryCardCopy')}</span>
            </Link>
            <Link className="subject-tile" to="/shop" data-testid="home-link-shop">
              <strong>{t('homeShopCardTitle')}</strong>
              <span>{rewards.balance} {t('crystals')}</span>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
