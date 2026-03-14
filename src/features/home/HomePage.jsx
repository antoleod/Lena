import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSessionSnapshot, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { getAdventureDashboard } from '../../shared/gameplay/adventureProgress.js';

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
  const primaryLabel = nextTarget ? 'Continuer ma mission' : t('startAdventure');
  const totalProgress = adventure.totalNodes ? Math.round((adventure.completedNodes / adventure.totalNodes) * 100) : 0;

  const progressRows = useMemo(() => ([
    { label: 'Progression', value: `${totalProgress}%` },
    { label: t('streakLabel'), value: String(overview.streakCurrent || 0) },
    { label: t('crystals'), value: String(rewards.balance || 0) },
    { label: 'Noeuds finis', value: `${adventure.completedNodes}/${adventure.totalNodes || 0}` }
  ]), [adventure.completedNodes, adventure.totalNodes, overview.streakCurrent, rewards.balance, t, totalProgress]);

  return (
    <div className="page-stack page-stack--compact" data-testid="home-page">
      <section className="panel panel--hero-compact">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Tableau de bord</span>
            <h2>{profile.name || t('defaultChildName')}</h2>
          </div>
          <span className="progress-badge">{overview.streakCurrent || 0} {t('streakLabel')}</span>
        </div>

        <p className="panel__copy">
          {nextTarget
            ? `${nextTarget.world.title} · mission ${nextTarget.mission.order} · ${nextTarget.activity?.title || 'prochaine lecon'}`
            : 'Ta prochaine aventure est prete sur la carte.'}
        </p>

        <div className="dashboard-actions">
          <Link className="primary-action" to={primaryRoute} data-testid="home-primary-cta">
            <span className="button-icon" aria-hidden="true">{nextTarget ? '▶' : '✨'}</span>
            <span>{primaryLabel}</span>
          </Link>
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
              <span className="eyebrow">Mission actuelle</span>
              <h3>{nextTarget?.mission?.title || 'Commencer'}</h3>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>Monde</span>
              <strong>{nextTarget?.world?.title || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>Lecon</span>
              <strong>{nextTarget?.activity?.title || '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>Recompense</span>
              <strong>+10 {t('crystals')}</strong>
            </div>
          </div>
          <div className="dashboard-actions">
            <Link className="primary-action" to={primaryRoute}>
              <span className="button-icon" aria-hidden="true">🎯</span>
              <span>Continuer ma mission</span>
            </Link>
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Resume</span>
              <h3>Ou aller maintenant</h3>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-list__row">
              <span>Prochain noeud</span>
              <strong>{nextTarget ? `Niveau ${nextTarget.level.order}` : '-'}</strong>
            </div>
            <div className="detail-list__row">
              <span>Temps</span>
              <strong>{formatMinutes(profile.totalStudyMinutes)}</strong>
            </div>
            <div className="detail-list__row">
              <span>Meilleure habitude</span>
              <strong>{overview.streakCurrent ? `${overview.streakCurrent} jours` : 'Nouvelle serie'}</strong>
            </div>
          </div>
        </article>

        <article className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Acces rapides</span>
              <h3>Faire quelque chose</h3>
            </div>
          </div>
          <div className="subject-grid subject-grid--compact dashboard-quick-links">
            <Link className="subject-tile" to="/map" data-testid="home-link-map">
              <strong>🗺 Grand Voyage</strong>
              <span>Voir le chemin et les noeuds</span>
            </Link>
            <Link className="subject-tile" to="/subjects" data-testid="home-link-subjects">
              <strong>📚 Matieres</strong>
              <span>Choisir une competence a jouer</span>
            </Link>
            <Link className="subject-tile" to="/history" data-testid="home-link-history">
              <strong>📈 Historique</strong>
              <span>Voir les dernieres lecons</span>
            </Link>
            <Link className="subject-tile" to="/shop" data-testid="home-link-shop">
              <strong>🛍 Boutique</strong>
              <span>{rewards.balance} {t('crystals')}</span>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
