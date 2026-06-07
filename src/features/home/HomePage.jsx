import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { getAdventureDashboard } from '../../shared/gameplay/adventureProgress.js';
import { getLevelProgress } from '../../services/learning/levelSystem.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';

function StreakFlame({ count }) {
  if (!count) return null;
  return (
    <span className="streak-flame">
      <img src={assetUrl('assets/stickers/badge-fire.svg')} alt="" className="streak-flame__icon" />
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

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Banner */}
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__content">
          <div className="home-hero__top">
            <div>
              <p className="home-hero__greeting">
                {greeting && <img src={assetUrl(`assets/icons/${greeting}.svg`)} alt="" className="hero-greeting__icon" />}
                {t('homeDashboardEyebrow')}
              </p>
              <h1 className="home-hero__name">{profile.name || t('defaultChildName')}</h1>
            </div>
            <StreakFlame count={overview.streakCurrent} />
          </div>

          <Link className="home-cta home-cta--tall" to={primaryRoute} data-testid="home-primary-cta">
            <img src={assetUrl(`assets/icons/${nextTarget ? 'icon-play' : 'icon-star'}.svg`)} alt="" className="home-cta__icon" />
            <span className="home-cta__label">{nextTarget ? t('homeContinueMission') : t('startAdventure')}</span>
            <img src={assetUrl('assets/icons/icon-arrow-right.svg')} alt="" className="home-cta__arrow" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="home-hero__stat-row">
          <span className="home-stat">⭐ Niv. {levelInfo.level}</span>
          <span className="home-stat">🔥 {overview.streakCurrent || 0}</span>
          <span className="home-stat">💎 {rewards.balance || 0}</span>
        </div>
      </section>

      {/* Compact mission card */}
      {nextTarget && (
        <div className="home-mission-quick">
          <span className="home-mission-quick__world" aria-hidden="true">
            🌍
          </span>
          <span className="home-mission-quick__title">
            {nextTarget.mission?.title || nextTarget.activity?.title || t('homeMissionStartTitle')}
          </span>
        </div>
      )}
    </div>
  );
}
