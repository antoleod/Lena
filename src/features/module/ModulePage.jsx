import { Link, useParams } from 'react-router-dom';
import { getActivityById, getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

function phaseActivities(activityIds) {
  return activityIds.map((activityId) => getActivityById(activityId)).filter(Boolean);
}

export default function ModulePage() {
  const { locale, t } = useLocale();
  const { subjectId, gradeId, moduleId } = useParams();
  const subject = getSubjectById(subjectId);
  const module = getModuleById(moduleId);

  if (!subject || !module) {
    return (
      <section className="section-block">
        <h2>{t('activityNotFound')}</h2>
      </section>
    );
  }

  const guided = phaseActivities(module.phases.guidedPractice);
  const independent = phaseActivities(module.phases.independentPractice);
  const challenge = getActivityById(module.phases.miniChallenge);
  const exam = getActivityById(module.phases.miniExam);
  const review = phaseActivities(module.phases.suggestedReview);

  return (
    <div className="page-stack">
      <section className="subject-hero" style={{ '--subject-accent': subject.accent }}>
        <div>
          <span className="eyebrow">{gradeId} • {module.domainLabel}</span>
          <h2>{module.title}</h2>
          <p>{module.summary}</p>
        </div>
        <div className="subject-hero__panel">
          <span className="pill">{getSubjectLabel(subject, locale, t)}</span>
          <p>{module.phases.introduction}</p>
        </div>
      </section>

      <section className="section-block">
        <div className="learning-path">
          <article className="phase-card">
            <span className="pill">1</span>
            <h4>Introduction</h4>
            <p>{module.phases.introduction}</p>
          </article>
          <article className="phase-card">
            <span className="pill">2</span>
            <h4>Demonstration</h4>
            <p>{module.phases.demonstration}</p>
          </article>
          <article className="phase-card">
            <span className="pill">3</span>
            <h4>Pratique guidee</h4>
            {guided.map((activity) => (
              <Link key={activity.id} className="phase-link" to={`/activities/${activity.id}?module=${module.id}`}>
                {activity.title}
              </Link>
            ))}
          </article>
          <article className="phase-card">
            <span className="pill">4</span>
            <h4>Pratique autonome</h4>
            {independent.map((activity) => (
              <Link key={activity.id} className="phase-link" to={`/activities/${activity.id}?module=${module.id}`}>
                {activity.title}
              </Link>
            ))}
          </article>
          <article className="phase-card">
            <span className="pill">5</span>
            <h4>Mini reto</h4>
            {challenge ? (
              <Link className="phase-link" to={`/activities/${challenge.id}?module=${module.id}`}>{challenge.title}</Link>
            ) : null}
          </article>
          <article className="phase-card">
            <span className="pill">6</span>
            <h4>Mini examen</h4>
            {exam ? (
              <Link className="phase-link" to={`/activities/${exam.id}?module=${module.id}`}>{exam.title}</Link>
            ) : null}
          </article>
          <article className="phase-card">
            <span className="pill">7</span>
            <h4>Recompense</h4>
            <p>Crystals, etoiles et objets de boutique.</p>
          </article>
          <article className="phase-card">
            <span className="pill">8</span>
            <h4>Repaso sugerido</h4>
            {review.map((activity) => (
              <Link key={activity.id} className="phase-link" to={`/activities/${activity.id}?module=${module.id}`}>
                {activity.title}
              </Link>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}
