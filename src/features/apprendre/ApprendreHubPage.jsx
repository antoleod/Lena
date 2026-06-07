import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { subjects } from '../curriculum/catalog.js';
import { getSubjectUniverse } from '../../shared/gameplay/subjectThemes.js';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getActivitiesBySubject } from '../curriculum/catalog.js';
import { SUBJECT_ICONS } from '../../assets/icons/AppIcons.jsx';

const HUB_UI = {
  fr: {
    title: 'Apprendre',
    mapTitle: 'Grand Voyage',
    mapDesc: 'Suis ta carte d\'aventure',
    subjectsTitle: 'Mes Matières',
    subjectsDesc: 'Choisis une matière à explorer',
    progress: (c, t) => `${c} / ${t} activites`,
  },
  nl: {
    title: 'Leren',
    mapTitle: 'Groot Avontuur',
    mapDesc: 'Volg je avonturenkaart',
    subjectsTitle: 'Mijn Vakken',
    subjectsDesc: 'Kies een vak om te verkennen',
    progress: (c, t) => `${c} / ${t} activiteiten`,
  },
  en: {
    title: 'Learn',
    mapTitle: 'Grand Adventure',
    mapDesc: 'Follow your adventure map',
    subjectsTitle: 'My Subjects',
    subjectsDesc: 'Choose a subject to explore',
    progress: (c, t) => `${c} / ${t} activities`,
  },
  es: {
    title: 'Aprender',
    mapTitle: 'Gran Aventura',
    mapDesc: 'Sigue tu mapa de aventura',
    subjectsTitle: 'Mis Materias',
    subjectsDesc: 'Elige una materia para explorar',
    progress: (c, t) => `${c} / ${t} actividades`,
  },
};

function SubjectCard({ subject, locale, t, progress }) {
  const universe = getSubjectUniverse(subject.id);
  const acts = getActivitiesBySubject(subject.id);
  const completed = acts.filter(a => progress.activities?.[a.id]?.completed).length;
  const pct = acts.length ? Math.round((completed / acts.length) * 100) : 0;

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="al-subject-card"
      style={{
        '--s-sky-top': universe.skyTop,
        '--s-sky-bot': universe.skyBottom,
        '--s-accent':  universe.accent,
        '--s-shadow':  universe.accentShadow,
        '--s-bg':      universe.accentBg,
      }}
    >
      <div className="al-subject-card__sky">
        {(() => { const Icon = SUBJECT_ICONS[subject.id]; return Icon ? <Icon size={52} /> : <span className="al-subject-card__icon">{universe.icon}</span>; })()}
        {pct === 100 && <span className="al-subject-card__crown">👑</span>}
      </div>
      <div className="al-subject-card__body">
        <strong className="al-subject-card__name">{getSubjectLabel(subject, locale, t)}</strong>
        {acts.length > 0 && (
          <div className="al-subject-card__bar">
            <div className="al-subject-card__bar-fill" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ApprendreHubPage() {
  const { locale, t } = useLocale();
  const ui = HUB_UI[locale] || HUB_UI.fr;
  const progress = getProgressSnapshot();
  const activeSubjects = subjects.filter(s =>
    s.grades?.some(g => ['P2','P3','P4','P5','P6'].includes(g))
  );

  return (
    <div className="al-hub">
      {/* Adventure map shortcut */}
      <Link to="/map" className="al-map-banner">
        <div className="al-map-banner__bg" aria-hidden="true">
          {['☁️','🌟','✨','☁️','⭐'].map((e, i) => (
            <span key={i} className="al-map-banner__deco" style={{ '--i': i }}>{e}</span>
          ))}
        </div>
        <div className="al-map-banner__content">
          <span className="al-map-banner__emoji">🗺️</span>
          <div>
            <strong className="al-map-banner__title">{ui.mapTitle}</strong>
            <span className="al-map-banner__desc">{ui.mapDesc}</span>
          </div>
          <span className="al-map-banner__arrow">→</span>
        </div>
      </Link>

      {/* Language Academies */}
      <div className="al-section">
        <h2 className="al-section__title">
          {locale === 'nl' ? 'Taal Academies' : locale === 'en' ? 'Language Academies' : locale === 'es' ? 'Academias de Lengua' : 'Academies de Langue'}
        </h2>
        <div className="al-academy-grid">
          <Link to="/lexi" className="al-academy-card" style={{ '--ac-color': '#7c3aed' }}>
            <span className="al-academy-card__emoji">📚</span>
            <div className="al-academy-card__body">
              <strong className="al-academy-card__title">LexiLena</strong>
              <span className="al-academy-card__desc">
                {locale === 'nl' ? 'Woorden en Zinnen' : locale === 'en' ? 'Words and Sentences' : locale === 'es' ? 'Palabras y Frases' : 'Mots et Phrases'}
              </span>
            </div>
            <span className="al-academy-card__arrow">→</span>
          </Link>
          <Link to="/grammi" className="al-academy-card" style={{ '--ac-color': '#10b981' }}>
            <span className="al-academy-card__emoji">🏠</span>
            <div className="al-academy-card__body">
              <strong className="al-academy-card__title">GrammiLena</strong>
              <span className="al-academy-card__desc">
                {locale === 'nl' ? 'Het Rijk van de Woorden' : locale === 'en' ? 'The Magic Kingdom of Words' : locale === 'es' ? 'El Reino Magico de las Palabras' : 'Le Royaume Magique des Mots'}
              </span>
            </div>
            <span className="al-academy-card__arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Subjects grid */}
      <div className="al-section">
        <h2 className="al-section__title">{ui.subjectsTitle}</h2>
        <p className="al-section__sub">{ui.subjectsDesc}</p>
        <div className="al-subjects-grid">
          {activeSubjects.map(s => (
            <SubjectCard
              key={s.id}
              subject={s}
              locale={locale}
              t={t}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
