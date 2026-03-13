import { Link } from 'react-router-dom';
import { subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

export default function SubjectsHubPage() {
  const { locale, t } = useLocale();

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('subjectsLabel') || 'Subjects'}</span>
            <h2>{t('chooseUniverse')}</h2>
          </div>
        </div>
        <div className="subject-grid subject-grid--compact">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              className="subject-tile"
              style={{ '--subject-accent': subject.accent }}
              to={`/subjects/${subject.id}`}
            >
              <strong>{getSubjectLabel(subject, locale, t)}</strong>
              <span>{getSubjectDescription(subject, locale)}</span>
              <small>{subject.grades.join(' - ')}</small>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
