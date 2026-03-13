import { Link, useParams } from 'react-router-dom';
import { getModulesBySubjectAndGrade, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

export default function GradePage() {
  const { subjectId, gradeId } = useParams();
  const { locale, t } = useLocale();
  const subject = getSubjectById(subjectId);
  const modules = getModulesBySubjectAndGrade(subjectId, gradeId);
  const groupedModules = modules.reduce((accumulator, module) => {
    const current = accumulator[module.domainLabel] || [];
    current.push(module);
    accumulator[module.domainLabel] = current;
    return accumulator;
  }, {});

  if (!subject) {
    return (
      <section className="section-block">
        <h2>{t('subjectNotFound')}</h2>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="subject-hero" style={{ '--subject-accent': subject.accent }}>
        <div>
          <span className="eyebrow">{gradeId}</span>
          <h2>{getSubjectLabel(subject, locale, t)}</h2>
          <p>{t('chooseLevel')}</p>
        </div>
        <div className="subject-hero__panel">
          <span className="pill">{modules.length} modules</span>
          <p>{t('smartTraining')}</p>
        </div>
      </section>

      {Object.entries(groupedModules).map(([domain, domainModules]) => (
        <section key={domain} className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{domain}</h3>
            </div>
          </div>
          <div className="activity-list">
            {domainModules.map((module) => (
              <article key={module.id} className="activity-row">
                <div>
                  <div className="preview-meta">
                    <span>{module.domainId}</span>
                    <span>{module.phases.guidedPractice.length} activites</span>
                  </div>
                  <h4>{module.title}</h4>
                  <p>{module.summary}</p>
                </div>
                <div className="activity-row__meta">
                  <Link
                    className="primary-action"
                    to={`/subjects/${subjectId}/grades/${gradeId}/modules/${module.id}`}
                  >
                    {t('launch')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
