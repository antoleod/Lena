import { Link } from 'react-router-dom';
import { activities, getCurriculumStats, getFeaturedActivities, modules, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';
import { getProgressOverview, getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { findPositionForModule } from '../../shared/gameplay/worldMap.js';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { locale, t } = useLocale();
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const [progressState, setProgressState] = useState(() => getProgressOverview(activities, modules));
  const stats = getCurriculumStats();
  const featured = getFeaturedActivities();
  const rainbowSticker = `${import.meta.env.BASE_URL}assets/stickers/sticker-arcenciel.svg`;
  const snapshot = getProgressSnapshot();
  const continueActivityId = snapshot.meta.lastActivityId;
  const nextModules = modules.slice(0, 4);

  const continueModule = continueActivityId
    ? modules.find((module) =>
        module.phases?.guidedPractice?.includes(continueActivityId)
        || module.phases?.independentPractice?.includes(continueActivityId)
        || module.phases?.miniChallenge === continueActivityId
        || module.phases?.miniExam === continueActivityId
      )
    : null;
  const currentPosition = continueModule ? findPositionForModule(continueModule.id) : null;

  useEffect(() => {
    function syncStores() {
      setRewardState(getRewardState());
      setProgressState(getProgressOverview(activities, modules));
    }

    window.addEventListener('lena-rewards-change', syncStores);
    window.addEventListener('lena-progress-change', syncStores);
    return () => {
      window.removeEventListener('lena-rewards-change', syncStores);
      window.removeEventListener('lena-progress-change', syncStores);
    };
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-panel hero-panel--primary">
          <span className="eyebrow">{t('heroEyebrow')}</span>
          <h2>{t('heroTitle')}</h2>
          <p>{t('heroText')}</p>
          <div className="hero-badges">
            <span className="pill">{t('heroBadge1')}</span>
            <span className="pill">{t('heroBadge2')}</span>
            <span className="pill">{t('heroBadge3')}</span>
          </div>
          <div className="hero-actions">
            {continueActivityId ? (
              <Link className="primary-action" to={`/activities/${continueActivityId}`}>{t('continue')}</Link>
            ) : (
              <Link className="primary-action" to="/map">{t('startAdventure')}</Link>
            )}
            <Link className="secondary-action" to="/map">{t('missions')}</Link>
          </div>
          <img className="hero-sticker" src={rainbowSticker} alt="" />
        </div>
        <div className="hero-panel hero-panel--stats">
          <div className="stat-card">
            <span>{t('universes')}</span>
            <strong>{stats.subjects}</strong>
          </div>
          <div className="stat-card">
            <span>{t('missions')}</span>
            <strong>{stats.activities}</strong>
          </div>
          <div className="stat-card">
            <span>{t('crystals')}</span>
            <strong>{rewardState.balance}</strong>
          </div>
          <div className="stat-card">
            <span>Streak</span>
            <strong>{progressState.streakCurrent}</strong>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h3>Continuer et progres global</h3>
          </div>
        </div>
        <div className="activity-preview-grid">
          <article className="preview-card">
            <span className="pill">Continue</span>
            <h4>Derniere activite</h4>
            <p>{continueActivityId ? continueActivityId : 'Aucune activite lancee pour le moment.'}</p>
            {continueActivityId ? <Link className="text-link" to={`/activities/${continueActivityId}`}>{t('continue')}</Link> : null}
          </article>
          {currentPosition ? (
            <article className="preview-card">
              <span className="pill">Parcours</span>
              <h4>Monde actuel</h4>
              <p>{currentPosition.worldName} • Mission {currentPosition.missionOrder}</p>
              <Link className="text-link" to={`/map/${currentPosition.worldId}`}>{t('missions')}</Link>
            </article>
          ) : (
            <article className="preview-card">
              <span className="pill">Carte</span>
              <h4>Explorer la carte</h4>
              <p>Choisis un monde et une mission adaptes a ton niveau.</p>
              <Link className="text-link" to="/map">{t('startAdventure')}</Link>
            </article>
          )}
          <article className="preview-card">
            <span className="pill">Progression</span>
            <h4>Activites terminees</h4>
            <p>{progressState.completedActivities} / {progressState.totalActivities}</p>
          </article>
          <article className="preview-card">
            <span className="pill">Modules</span>
            <h4>Base curriculaire</h4>
            <p>{stats.modules} modules structures pour les niveaux P2 a P3, avec base P4-P6.</p>
          </article>
          <article className="preview-card">
            <span className="pill">Recompenses</span>
            <h4>Boutique et debloque</h4>
            <p>{rewardState.inventory.length} objets debloques et themes applicables.</p>
            <Link className="text-link" to="/shop">{t('shop')}</Link>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('byDomain')}</span>
            <h3>{t('chooseUniverse')}</h3>
          </div>
        </div>
        <div className="subject-grid">
          {subjects.map((subject, index) => (
            <Link
              key={subject.id}
              className="subject-card subject-card--animated"
              style={{
                '--subject-color': subject.color,
                '--subject-accent': subject.accent,
                animationDelay: `${index * 90}ms`
              }}
              to={`/subjects/${subject.id}`}
            >
              <span className="pill">{subject.grades.slice(0, 2).join(' • ')}</span>
              <h4>{getSubjectLabel(subject, locale, t)}</h4>
              <p>{getSubjectDescription(subject, locale)}</p>
              <ul className="roadmap-list">
                {getSubjectRoadmap(subject, locale).slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Prochains modules</span>
            <h3>Apprendre puis evaluer</h3>
          </div>
        </div>
        <div className="activity-preview-grid">
          {nextModules.map((module) => (
            <article key={module.id} className="preview-card">
              <span className="pill">{module.gradeId}</span>
              <h4>{module.title}</h4>
              <p>{module.summary}</p>
              <Link
                className="text-link"
                to={`/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}`}
              >
                {t('startAdventure')}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
