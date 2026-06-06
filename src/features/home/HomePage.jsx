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

const ACTION_TILES = [
  { to: '/map',          emoji: '🗺️',  label: 'Carte' },
  { to: '/exam',         emoji: '🏆',  label: 'Examens' },
  { to: '/practice',     emoji: '✏️',  label: 'Pratique' },
  { to: '/lessons',      emoji: '📚',  label: 'Leçons' },
  { to: '/subjects',     emoji: '📖',  label: 'Matières' },
  { to: '/stories',      emoji: '📖',  label: 'Contes' },
  { to: '/renforcement', emoji: '🧩',  label: 'Renforcement' },
  { to: '/shop',         emoji: '💎',  label: 'Boutique' },
  { to: '/history',      emoji: '📊',  label: 'Historique' },
];

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

        {/* Adventure progress bar */}
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

      {/* Score strip */}
      <div className="home-score-strip" aria-label="Statistiques">
        <div className="home-score-item">
          <strong>{totalProgress}%</strong>
          <span>{t('progression')}</span>
        </div>
        <div className="home-score-item">
          <strong>{overview.streakCurrent || 0}🔥</strong>
          <span>{t('streakLabel')}</span>
        </div>
        <div className="home-score-item">
          <strong>{rewards.balance || 0}💎</strong>
          <span>{t('crystals')}</span>
        </div>
        <div className="home-score-item">
          <strong>{adventure.completedNodes}/{adventure.totalNodes || 0}</strong>
          <span>{t('homeCompletedNodes')}</span>
        </div>
      </div>

      {/* Action grid */}
      <div className="home-action-grid">
        {ACTION_TILES.map((tile) => (
          <Link
            key={tile.to}
            className="home-action-tile"
            to={tile.to}
            data-testid={`home-link-${tile.to.replace('/', '')}`}
          >
            <span className="home-action-tile__emoji" aria-hidden="true">{tile.emoji}</span>
            <span className="home-action-tile__label">{tile.label}</span>
          </Link>
        ))}
      </div>

      {/* Compact mission card */}
      {nextTarget && (
        <div className="home-mission-quick">
          <span className="home-mission-quick__world" aria-hidden="true">
            🌍
          </span>
          <span className="home-mission-quick__title">
            {nextTarget.mission?.title || nextTarget.activity?.title || t('homeMissionStartTitle')}
          </span>
          <Link className="home-mission-quick__btn" to={primaryRoute}>
            ▶ {t('homeContinueMission')}
          </Link>
        </div>
      )}
    </div>
  );
}
