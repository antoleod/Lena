import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { getAdventureDashboard } from '../../shared/gameplay/adventureProgress.js';
import { getLevelProgress } from '../../services/learning/levelSystem.js';

function formatMinutes(minutes) {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

function StreakFlame({ count }) {
  if (!count) return null;
  return (
    <span className="streak-flame">
      <img src="/assets/stickers/badge-fire.svg" alt="" className="streak-flame__icon" />
      <strong>{count}</strong>
    </span>
  );
}

export default function HomePage() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const [greeting, setGreeting] = useState('');

  useEffect(() => subscribeToSessionChanges(setSession), []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('icon-sun');
    else if (hour < 17) setGreeting('icon-cloud');
    else setGreeting('icon-moon');
  }, []);

  const profile = session.profile;
  const rewards = session.rewards;
  const overview = session.overview;
  const adventure = getAdventureDashboard(session.progress);
  const nextTarget = adventure.nextTarget;
  const primaryRoute = nextTarget?.route || '/map';
  const totalProgress = adventure.totalNodes
    ? Math.round((adventure.completedNodes / adventure.totalNodes) * 100)
    : 0;
  const levelInfo = getLevelProgress(profile.totalActivitiesCompleted || 0);

  const quickLinks = useMemo(() => [
    { to: '/map', icon: 'icon-home', label: t('homeMapCardTitle'), sub: t('homeMapCardCopy') },
    { to: '/subjects', icon: 'icon-book', label: t('homeSubjectsCardTitle'), sub: t('homeSubjectsCardCopy') },
    { to: '/renforcement', icon: 'icon-star', label: 'Renforcement', sub: 'Des exercices doux, une consigne a la fois.' },
    { to: '/history', icon: 'icon-star', label: t('homeHistoryCardTitle'), sub: t('homeHistoryCardCopy') },
    { to: '/shop', icon: 'icon-gem', label: t('homeShopCardTitle'), sub: `${rewards.balance || 0} ${t('crystals')}` },
  ], [t, rewards.balance]);

  const stats = useMemo(() => [
    { icon: 'icon-star', label: t('progression'), value: `${totalProgress}%` },
    { icon: 'badge-fire', label: t('streakLabel'), value: `${overview.streakCurrent || 0}` },
    { icon: 'icon-gem', label: t('crystals'), value: `${rewards.balance || 0}` },
    { icon: 'icon-check', label: t('homeCompletedNodes'), value: `${adventure.completedNodes}/${adventure.totalNodes || 0}` },
  ], [adventure.completedNodes, adventure.totalNodes, overview.streakCurrent, rewards.balance, t, totalProgress]);

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Banner */}
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__content">
          <div className="home-hero__top">
            <div>
              <p className="home-hero__greeting">
                {greeting && <img src={`/assets/icons/${greeting}.svg`} alt="" className="hero-greeting__icon" />}
                {t('homeDashboardEyebrow')}
              </p>
              <h1 className="home-hero__name">{profile.name || t('defaultChildName')}</h1>
              {nextTarget && (
                <p className="home-hero__path">
                  {nextTarget.world.title}
                  <span aria-hidden="true"> · </span>
                  {nextTarget.activity?.title || t('homeNextLessonFallback')}
                </p>
              )}
            </div>
            <StreakFlame count={overview.streakCurrent} />
          </div>

          <Link className="home-cta" to={primaryRoute} data-testid="home-primary-cta">
            <img src={`/assets/icons/${nextTarget ? 'icon-play' : 'icon-star'}.svg`} alt="" className="home-cta__icon" />
            <span className="home-cta__label">{nextTarget ? t('homeContinueMission') : t('startAdventure')}</span>
            <img src="/assets/icons/icon-arrow-right.svg" alt="" className="home-cta__arrow" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="home-hero__progress-wrap">
          <div className="home-hero__progress-bar">
            <div
              className="home-hero__progress-fill"
              style={{ width: `${Math.max(totalProgress, totalProgress > 0 ? 4 : 0)}%` }}
            />
          </div>
          <span className="home-hero__progress-label">{totalProgress}% {t('progression')}</span>
        </div>

        {/* Level progress bar */}
        <div className="home-hero__level-wrap">
          <div className="home-hero__level-row">
            <span className="home-hero__level-label">
              ⭐ Niveau {levelInfo.level}
              {levelInfo.level < 10 && levelInfo.nextLevelAt && (
                <span className="home-hero__level-hint">
                  {' · '}{levelInfo.nextLevelAt - (profile.totalActivitiesCompleted || 0)} activités pour Niv. {levelInfo.level + 1}
                </span>
              )}
            </span>
          </div>
          <div className="home-hero__level-bar">
            <div
              className="home-hero__level-fill"
              style={{ width: `${Math.round(levelInfo.progress * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="home-stats" aria-label="Estadísticas">
        {stats.map((stat) => (
          <div key={stat.label} className="home-stat-card">
            <img src={`/assets/${stat.icon.includes('badge') ? 'stickers' : 'icons'}/${stat.icon}.svg`} alt="" className="home-stat-card__icon" />
            <strong className="home-stat-card__value">{stat.value}</strong>
            <span className="home-stat-card__label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('homeQuickActionsEyebrow')}</span>
            <h2>{t('homeQuickActionsTitle')}</h2>
          </div>
        </div>
        <div className="home-quick-grid">
          {quickLinks.map((link) => (
            <Link key={link.to} className="home-quick-card" to={link.to} data-testid={`home-link-${link.to.replace('/', '')}`}>
              <img src={`/assets/icons/${link.icon}.svg`} alt="" className="home-quick-card__icon" />
              <div>
                <strong>{link.label}</strong>
                <span>{link.sub}</span>
              </div>
              <span className="home-quick-card__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Current mission detail */}
      {nextTarget && (
        <section className="panel panel--tight home-mission-panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('currentMissionLabel')}</span>
              <h2>{nextTarget.mission?.title || t('homeMissionStartTitle')}</h2>
            </div>
            <span className="home-badge home-badge--gold">
              🏆 +10 {t('crystals')}
            </span>
          </div>
          <div className="home-mission-details">
            <div className="home-mission-detail">
              <span>{t('homeWorldLabel')}</span>
              <strong>{nextTarget.world?.title || '-'}</strong>
            </div>
            <div className="home-mission-detail">
              <span>{t('homeLessonLabel')}</span>
              <strong>{nextTarget.activity?.title || '-'}</strong>
            </div>
            <div className="home-mission-detail">
              <span>{t('studyTimeLabel')}</span>
              <strong>{formatMinutes(profile.totalStudyMinutes)}</strong>
            </div>
          </div>
          <div className="dashboard-actions" style={{ marginTop: 14 }}>
            <Link className="primary-action" to={primaryRoute}>
              <img src="/assets/icons/icon-play.svg" alt="" className="button-icon" />
              <span>{t('homeContinueMission')}</span>
            </Link>
            <Link className="secondary-action" to="/map">
              <img src="/assets/icons/icon-home.svg" alt="" className="button-icon" />
              <span>{t('homeMapCardTitle')}</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
