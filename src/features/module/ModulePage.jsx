import { Link, useParams } from 'react-router-dom';
import { getActivityById, getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

function resolveActivities(ids = []) {
  return ids.map((activityId) => getActivityById(activityId)).filter(Boolean);
}

function buildPlayableSections(module, t) {
  const sections = [];
  const guided = resolveActivities(module.phases.guidedPractice);
  const independent = resolveActivities(module.phases.independentPractice);
  const challenge = getActivityById(module.phases.miniChallenge);
  const exam = getActivityById(module.phases.miniExam);
  const review = resolveActivities(module.phases.suggestedReview);

  if (guided.length) {
    sections.push({ id: 'guided', title: t('practiceMode'), activities: guided });
  }
  if (independent.length) {
    sections.push({ id: 'independent', title: t('continueStep'), activities: independent });
  }
  if (challenge) {
    sections.push({ id: 'challenge', title: t('missionChallengeLabel'), activities: [challenge] });
  }
  if (exam && exam.id !== challenge?.id) {
    sections.push({ id: 'exam', title: t('missionExamLabel'), activities: [exam] });
  }
  if (review.length) {
    sections.push({ id: 'review', title: t('reinforceLabel'), activities: review });
  }

  return sections;
}

function buildLevelPlan(sections) {
  const activities = sections.flatMap((section) => section.activities);
  if (!activities.length) {
    return [];
  }

  return Array.from({ length: 10 }, (_, index) => {
    const activity = activities[index % activities.length];
    return {
      id: `${activity.id}-level-${index + 1}`,
      level: index + 1,
      activity
    };
  });
}

export default function ModulePage() {
  const { locale, t } = useLocale();
  const { subjectId, gradeId, moduleId } = useParams();
  const subject = getSubjectById(subjectId);
  const module = getModuleById(moduleId);

  if (!subject || !module) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
      </section>
    );
  }

  const sections = buildPlayableSections(module, t);
  const firstActivity = sections[0]?.activities[0] || null;
  const levelPlan = buildLevelPlan(sections);

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{gradeId} / {module.domainLabel}</span>
            <h2>{module.title}</h2>
          </div>
          <span className="pill">{getSubjectLabel(subject, locale, t)}</span>
        </div>
        <p className="panel__copy">{module.summary}</p>
        <div className="detail-list">
          <div className="detail-list__row">
            <span>{t('goalLabel')}</span>
            <strong>{module.phases.introduction}</strong>
          </div>
          {module.phases.demonstration ? (
            <div className="detail-list__row">
              <span>{t('hint')}</span>
              <strong>{module.phases.demonstration}</strong>
            </div>
          ) : null}
        </div>
        {firstActivity ? (
          <div className="dashboard-actions">
            <Link className="primary-action" to={`/activities/${firstActivity.id}?module=${module.id}`}>
              {t('startAdventure')}
            </Link>
            <Link className="secondary-action" to={`/subjects/${subjectId}/grades/${gradeId}`}>
              {t('back')}
            </Link>
          </div>
        ) : null}
      </section>

      {sections.map((section) => (
        <section key={section.id} className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{module.domainLabel}</span>
              <h3>{section.title}</h3>
            </div>
          </div>
          <div className="module-grid-compact">
            {section.activities.map((activity) => (
              <article key={activity.id} className="module-card-compact">
                <strong>{activity.title}</strong>
                <p>{activity.instructions}</p>
                <small>{activity.gradeBand.join(' / ')} · {activity.estimatedDurationMin} min</small>
                <Link className="primary-action" to={`/activities/${activity.id}?module=${module.id}`}>
                  {t('launch')}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}

      {levelPlan.length ? (
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{module.domainLabel}</span>
              <h3>{t('levelsSummaryLabel')}</h3>
            </div>
          </div>
          <div className="level-grid">
            {levelPlan.map((entry) => (
              <Link
                key={entry.id}
                className="level-card level-card--active"
                to={`/activities/${entry.activity.id}?module=${module.id}&level=${entry.level}`}
              >
                <span className="level-card__order">{t('level')} {entry.level}</span>
                <strong>{entry.activity.title}</strong>
                <small>{entry.activity.estimatedDurationMin} min</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
