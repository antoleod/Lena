import { Link, useParams } from 'react-router-dom';
import { activities, getGradeProgression, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getSubjectUniverse, getGradeWorld } from '../../shared/gameplay/subjectThemes.js';

function getGradeStats(subjectId, gradeId, progress) {
  const acts = activities.filter(a => a.subject === subjectId && a.gradeBand.includes(gradeId));
  const completed = acts.filter(a => progress.activities[a.id]?.completed).length;
  return { total: acts.length, completed, percent: acts.length ? Math.round((completed / acts.length) * 100) : 0 };
}

function Stars({ percent }) {
  const stars = percent >= 100 ? 3 : percent >= 60 ? 2 : percent > 0 ? 1 : 0;
  return (
    <div className="cc-stars">
      {[1,2,3].map(i => <span key={i} className={i <= stars ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>)}
    </div>
  );
}

export default function SubjectPage() {
  const { locale, t } = useLocale();
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const gradeProgression = getGradeProgression(subjectId);
  const progress = getProgressSnapshot();

  if (!subject) {
    return <section className="panel panel--tight"><h2>{t('subjectNotFound')}</h2><Link className="text-link" to="/">{t('backHome')}</Link></section>;
  }

  const universe = getSubjectUniverse(subjectId);
  const grades = subject.grades.map(gradeId => {
    const activityList = activities.filter(a => a.subject === subjectId && a.gradeBand.includes(gradeId));
    const gradeEntry = gradeProgression.find(e => e.gradeId === gradeId);
    const world = getGradeWorld(subjectId, gradeId);
    const stats = getGradeStats(subjectId, gradeId, progress);
    return { gradeId, modules: gradeEntry?.modules || [], activities: activityList, world, stats };
  }).filter(g => g.activities.length || g.modules.length);

  const roadmap = getSubjectRoadmap(subject, locale);
  const totalDone = grades.reduce((s, g) => s + g.stats.completed, 0);
  const totalActs = grades.reduce((s, g) => s + g.stats.total, 0);
  const overallPct = totalActs ? Math.round((totalDone / totalActs) * 100) : 0;

  return (
    <div
      className="sw-universe"
      style={{
        '--uni-accent':  universe.accent,
        '--uni-shadow':  universe.accentShadow,
        '--uni-bg':      universe.accentBg,
        '--uni-sky-top': universe.skyTop,
        '--uni-sky-bot': universe.skyBottom,
      }}
      data-testid={`subject-page-${subjectId}`}
    >
      {/* Topbar */}
      <div className="cc-topbar">
        <Link className="cc-back-btn" to="/subjects">←</Link>
        <div className="cc-topbar__title">{universe.icon} {universe.name}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar"><div className="cc-xp-fill" style={{ width: `${overallPct}%` }} /></div>
          <span className="cc-xp-text">{overallPct}%</span>
        </div>
      </div>

      {/* Universe hero */}
      <div className="sw-universe__hero">
        <div className="sw-universe__hero-orb">
          <span>{universe.icon}</span>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="sw-universe__hero-particle" style={{ '--i': i }}>{universe.particle}</span>
          ))}
        </div>
        <div className="sw-universe__hero-info">
          <h2 className="sw-universe__hero-name">{getSubjectLabel(subject, locale, t)}</h2>
          <p className="sw-universe__hero-desc">{getSubjectDescription(subject, locale)}</p>
          <div className="sw-universe__hero-stats">
            <span>{totalDone} / {totalActs} actividades</span>
            <span>·</span>
            <span>{grades.length} mundos</span>
          </div>
        </div>
      </div>

      {/* Roadmap scroll */}
      {roadmap.length > 0 && (
        <div className="sw-roadmap">
          <span className="sw-roadmap__label">Ruta de aprendizaje</span>
          <div className="sw-roadmap__track">
            {roadmap.map((item, i) => (
              <div key={item} className="sw-roadmap__step" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="sw-roadmap__step-num">{i + 1}</span>
                <span className="sw-roadmap__step-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Worlds — one per grade */}
      <div className="sw-worlds">
        <h3 className="sw-worlds__heading">Mundos dentro del universo</h3>
        <div className="sw-worlds__grid">
          {grades.map((grade, index) => {
            const w = grade.world;
            const launchTo = grade.modules.length
              ? `/subjects/${subjectId}/grades/${grade.gradeId}`
              : grade.activities[0] ? `/activities/${grade.activities[0].id}` : `/subjects/${subjectId}/grades/${grade.gradeId}`;

            return (
              <Link
                key={grade.gradeId}
                to={launchTo}
                className="sw-world-card"
                style={{
                  '--w-color':    w.color,
                  '--w-shadow':   w.shadow,
                  '--w-bg':       w.bg,
                  '--w-sky':      w.sky,
                  '--card-index': index,
                }}
                data-testid={`subject-grade-${grade.gradeId}`}
              >
                {/* Sky */}
                <div className="sw-world-card__sky" aria-hidden="true">
                  <span className="sw-world-card__star" />
                  <span className="sw-world-card__star" />
                  <span className="sw-world-card__grade-badge">{grade.gradeId}</span>
                </div>

                {/* Planet */}
                <div className="sw-world-card__planet">
                  <span className="sw-world-card__emoji">{w.emoji}</span>
                  {grade.stats.percent === 100 && <div className="sw-world-card__check">✓</div>}
                  <Stars percent={grade.stats.percent} />
                </div>

                {/* Info */}
                <div className="sw-world-card__body">
                  <strong className="sw-world-card__name">{w.name}</strong>
                  <span className="sw-world-card__meta">
                    {grade.modules.length ? `${grade.modules.length} módulos` : `${grade.activities.length} actividades`}
                  </span>
                  <div className="sw-world-card__bar">
                    <div className="sw-world-card__fill" style={{ width: `${grade.stats.percent}%` }} />
                  </div>
                </div>

                <div className="sw-world-card__cta">▶ Explorar</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
