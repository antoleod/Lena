import { Link } from 'react-router-dom';
import { getCurriculumStats, getFeaturedActivities, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { locale, t } = useLocale();
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const stats = getCurriculumStats();
  const featured = getFeaturedActivities();
  const rainbowSticker = `${import.meta.env.BASE_URL}assets/stickers/sticker-arcenciel.svg`;

  useEffect(() => {
    function syncRewards() {
      setRewardState(getRewardState());
    }

    window.addEventListener('lena-rewards-change', syncRewards);
    return () => window.removeEventListener('lena-rewards-change', syncRewards);
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
            <Link className="primary-action" to="/subjects/mathematics">{t('enterMath')}</Link>
            <Link className="secondary-action" to="/subjects/french">{t('seeFrench')}</Link>
            <Link className="secondary-action" to="/shop">{t('shop')}</Link>
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
            <span>{t('classes')}</span>
            <strong>{stats.grades}</strong>
          </div>
          <div className="stat-card">
            <span>{t('rhythm')}</span>
            <strong>{t('practiceExam')}</strong>
          </div>
          <div className="stat-card">
            <span>{t('crystals')}</span>
            <strong>{rewardState.balance}</strong>
          </div>
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
              <span className="pill">{subject.grades.join(' • ')}</span>
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
            <span className="eyebrow">{t('favoriteMissions')}</span>
            <h3>{t('startAdventure')}</h3>
          </div>
        </div>
        <div className="activity-preview-grid">
          {featured.map((activity) => (
            <article key={activity.id} className="preview-card">
              <span className="pill">{activity.originRepo}</span>
              <h4>{activity.title}</h4>
              <p>{activity.instructions}</p>
              <div className="preview-meta">
                <span>{activity.gradeBand.join(' • ')}</span>
                <span>{activity.estimatedDurationMin} min</span>
              </div>
              <Link className="text-link" to={`/activities/${activity.id}`}>{t('openActivity')}</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
