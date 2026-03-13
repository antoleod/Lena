import { Link, useParams } from 'react-router-dom';
import { getGradeProgression, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';

export default function SubjectPage() {
  const { locale, t } = useLocale();
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const grades = getGradeProgression(subjectId);

  if (!subject) {
    return (
      <section className="section-block">
        <h2>{t('subjectNotFound')}</h2>
        <Link className="text-link" to="/">{t('backHome')}</Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section
        className="subject-hero"
        style={{ '--subject-color': subject.color, '--subject-accent': subject.accent }}
      >
        <div>
          <span className="eyebrow">{subject.grades.join(' • ')}</span>
          <h2>{getSubjectLabel(subject, locale, t)}</h2>
          <p>{getSubjectDescription(subject, locale)}</p>
        </div>
        <div className="subject-hero__panel">
          <span className="pill">{t('subjectJourney')}</span>
          <ul className="roadmap-list">
            {getSubjectRoadmap(subject, locale).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('classes')}</span>
            <h3>{t('chooseLevel')}</h3>
          </div>
        </div>
        <div className="subject-grid">
          {grades.map((grade) => (
            <article key={grade.gradeId} className="subject-card">
              <span className="pill">{grade.gradeId}</span>
              <h4>{grade.modules.length} modules</h4>
              <p>{t('practiceExam')}</p>
              <ul className="roadmap-list">
                {grade.modules.slice(0, 3).map((module) => (
                  <li key={module.id}>{module.title}</li>
                ))}
              </ul>
              <Link className="primary-action" to={`/subjects/${subjectId}/grades/${grade.gradeId}`}>
                {t('launch')}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
