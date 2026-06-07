import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { getAdventureDashboard } from '../../shared/gameplay/adventureProgress.js';
import { getLevelProgress } from '../../services/learning/levelSystem.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';

// ── Time of day ────────────────────────────────────────────────────────────────

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getGreetingIcon(timeOfDay) {
  if (timeOfDay === 'morning') return 'icon-sun';
  if (timeOfDay === 'afternoon') return 'icon-cloud';
  return 'icon-moon';
}

// ── Motivational quotes ────────────────────────────────────────────────────────

const MOTIVATIONS = [
  'Chaque jour appris est un trésor ! 🌟',
  'Tu es plus courageux(se) que tu ne le crois ! 💪',
  'Les étoiles brillent pour ceux qui travaillent ! ⭐',
  'Un petit pas chaque jour, et tu arrives loin ! 🚀',
  'Tu es fantastique — continue comme ça ! 🎉',
  'Apprendre, c\'est un super pouvoir ! 🦸',
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length];
}

// ── Quick-access grid data ─────────────────────────────────────────────────────

const QUICK_SECTIONS = [
  {
    to: '/jeux',
    emoji: '🎮',
    label: 'Jeux',
    desc: 'Mini-jeux amusants',
    gradient: 'linear-gradient(135deg, #f97316, #fbbf24)',
    shadow: 'rgba(249, 115, 22, 0.35)',
  },
  {
    to: '/cahier',
    emoji: '📝',
    label: 'Cahier',
    desc: 'Exercices & révisions',
    gradient: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    shadow: 'rgba(99, 102, 241, 0.35)',
  },
  {
    to: '/map',
    emoji: '🗺️',
    label: 'Aventure',
    desc: 'Ma carte du monde',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    shadow: 'rgba(16, 185, 129, 0.35)',
  },
  {
    to: '/shop',
    emoji: '💎',
    label: 'Boutique',
    desc: 'Mes récompenses',
    gradient: 'linear-gradient(135deg, #ec4899, #f9a8d4)',
    shadow: 'rgba(236, 72, 153, 0.35)',
  },
  {
    to: '/apprendre',
    emoji: '📚',
    label: 'Apprendre',
    desc: 'Cours & leçons',
    gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)',
    shadow: 'rgba(59, 130, 246, 0.35)',
  },
  {
    to: '/exam',
    emoji: '🏆',
    label: 'Examens',
    desc: 'Teste tes connaissances',
    gradient: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
    shadow: 'rgba(245, 158, 11, 0.35)',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StreakFlame({ count }) {
  if (!count) return null;
  return (
    <span className="streak-flame">
      <img src={assetUrl('assets/stickers/badge-fire.svg')} alt="" className="streak-flame__icon" />
      <strong>{count}</strong>
    </span>
  );
}

function LevelProgressBar({ levelInfo, totalActivities }) {
  const pct = Math.round((levelInfo.progress ?? 0) * 100);
  const { level, currentLevelAt, nextLevelAt } = levelInfo;
  const atMax = nextLevelAt == null;
  const rangeSize = atMax ? 0 : nextLevelAt - currentLevelAt;
  const userInRange = atMax ? 0 : Math.max(0, (totalActivities || 0) - currentLevelAt);

  return (
    <div className="home-level-bar">
      <div className="home-level-bar__header">
        <span className="home-level-bar__label">⭐ Niveau {level}</span>
        {!atMax && (
          <span className="home-level-bar__xp">{userInRange} / {rangeSize} XP</span>
        )}
      </div>
      <div className="home-level-bar__track">
        <div
          className="home-level-bar__fill"
          style={{ width: atMax ? '100%' : `${pct}%` }}
          role="progressbar"
          aria-valuenow={atMax ? 100 : pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="home-level-bar__next">
        {atMax
          ? '🏆 Niveau maximum atteint !'
          : pct >= 80
            ? '🚀 Presque au niveau suivant !'
            : `${100 - pct}% pour le niveau ${level + 1}`}
      </div>
    </div>
  );
}

function QuickGrid() {
  return (
    <section className="home-quick-section" aria-label="Accès rapide">
      <h2 className="home-section-heading">Accès rapide</h2>
      <div className="home-quick-tiles">
        {QUICK_SECTIONS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="home-tile"
            style={{ '--tile-gradient': item.gradient, '--tile-shadow': item.shadow }}
          >
            <span className="home-tile__emoji" aria-hidden="true">{item.emoji}</span>
            <strong className="home-tile__label">{item.label}</strong>
            <span className="home-tile__desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StreakRow({ count }) {
  if (!count) return null;
  const flames = Math.min(count, 7);
  return (
    <div className="home-streak-row" role="status" aria-label={`Série de ${count} jours`}>
      <div className="home-streak-row__flames" aria-hidden="true">
        {Array.from({ length: flames }, (_, i) => (
          <span key={i} className="home-streak-row__flame" style={{ animationDelay: `${i * 0.08}s` }}>
            🔥
          </span>
        ))}
        {count > 7 && <span className="home-streak-row__more">+{count - 7}</span>}
      </div>
      <div className="home-streak-row__text">
        <strong className="home-streak-row__count">{count} jours</strong>
        <span className="home-streak-row__label">de série — bravo ! 🎊</span>
      </div>
    </div>
  );
}

function DailyMotivation() {
  return (
    <div className="home-motivation" role="note">
      <span className="home-motivation__text">{getDailyQuote()}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const [timeOfDay, setTimeOfDay] = useState('morning');

  useEffect(() => subscribeToSessionChanges(setSession), []);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  const profile = session.profile;
  const rewards = session.rewards;
  const overview = session.overview;
  const adventure = getAdventureDashboard(session.progress);
  const nextTarget = adventure.nextTarget;
  const primaryRoute = nextTarget?.route || '/map';
  const levelInfo = getLevelProgress(profile.totalActivitiesCompleted || 0);
  const greetingIcon = getGreetingIcon(timeOfDay);

  return (
    <div className="home-page" data-testid="home-page">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className="home-hero home-hero--tod" data-time={timeOfDay}>
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__content">
          <div className="home-hero__top">
            <div>
              <p className="home-hero__greeting">
                {greetingIcon && (
                  <img
                    src={assetUrl(`assets/icons/${greetingIcon}.svg`)}
                    alt=""
                    className="hero-greeting__icon"
                  />
                )}
                {t('homeDashboardEyebrow')}
              </p>
              <h1 className="home-hero__name">{profile.name || t('defaultChildName')}</h1>
            </div>
            <StreakFlame count={overview.streakCurrent} />
          </div>

          {/* Level progress bar */}
          <LevelProgressBar levelInfo={levelInfo} totalActivities={profile.totalActivitiesCompleted || 0} />

          {/* Primary CTA */}
          <Link
            className="home-cta home-cta--tall home-cta--game"
            to={primaryRoute}
            data-testid="home-primary-cta"
          >
            <img
              src={assetUrl(`assets/icons/${nextTarget ? 'icon-play' : 'icon-star'}.svg`)}
              alt=""
              className="home-cta__icon"
            />
            <span className="home-cta__label">
              {nextTarget ? t('homeContinueMission') : t('startAdventure')}
            </span>
            <img
              src={assetUrl('assets/icons/icon-arrow-right.svg')}
              alt=""
              className="home-cta__arrow"
            />
          </Link>

          {/* Secondary CTA — Jouer maintenant */}
          <Link
            className="home-cta home-cta--secondary"
            to="/jeux"
            data-testid="home-jeux-cta"
          >
            <span className="home-cta__icon" role="img" aria-hidden="true">🎮</span>
            <span className="home-cta__label">Jouer maintenant</span>
          </Link>
        </div>

        {/* Stats row */}
        <div className="home-hero__stat-row">
          <span className="home-stat">⭐ Niv.&nbsp;{levelInfo.level}</span>
          <span className="home-stat">🔥 {overview.streakCurrent || 0}</span>
          <span className="home-stat">💎 {rewards.balance || 0}</span>
        </div>
      </section>

      {/* ── Mission quick card ───────────────────────────────────────── */}
      {nextTarget && (
        <div className="home-mission-quick">
          <span className="home-mission-quick__world" aria-hidden="true">🌍</span>
          <span className="home-mission-quick__title">
            {nextTarget.mission?.title || nextTarget.activity?.title || t('homeMissionStartTitle')}
          </span>
        </div>
      )}

      {/* ── Streak celebration ───────────────────────────────────────── */}
      <StreakRow count={overview.streakCurrent} />

      {/* ── Quick-access grid ────────────────────────────────────────── */}
      <QuickGrid />

      {/* ── Daily motivation ─────────────────────────────────────────── */}
      <DailyMotivation />

    </div>
  );
}
