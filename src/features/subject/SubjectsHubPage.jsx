import { Link } from 'react-router-dom';
import { getActivitiesBySubject, getGradeProgression, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

const SUBJECT_CONFIG = {
  mathematics: {
    icon: '🔢',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    accent: '#764ba2',
    topics: ['Sumas', 'Restas', 'Tablas'],
    color: '#667eea',
  },
  french: {
    icon: '✍️',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    accent: '#f5576c',
    topics: ['Vocabulaire', 'Phrases', 'Récits'],
    color: '#f093fb',
  },
  dutch: {
    icon: '🗣️',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    accent: '#4facfe',
    topics: ['Woorden', 'Zinnen', 'Lezen'],
    color: '#4facfe',
  },
  english: {
    icon: '🌍',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    accent: '#43e97b',
    topics: ['Words', 'Sentences', 'Reading'],
    color: '#43e97b',
  },
  spanish: {
    icon: '🌞',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    accent: '#fa709a',
    topics: ['Palabras', 'Frases', 'Lectura'],
    color: '#fa709a',
  },
  reasoning: {
    icon: '🧩',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    accent: '#a18cd1',
    topics: ['Lógica', 'Secuencias', 'Estrategia'],
    color: '#a18cd1',
  },
  stories: {
    icon: '📖',
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    accent: '#fcb69f',
    topics: ['Mini-récits', 'Compréhension', 'Questions'],
    color: '#ffecd2',
  },
};

function getSubjectTileData(subject, progress) {
  const activities = getActivitiesBySubject(subject.id).filter((activity) =>
    activity.gradeBand?.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
  const completed = activities.filter((activity) => progress.activities[activity.id]?.completed).length;
  const total = activities.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const grades = getGradeProgression(subject.id).filter((entry) => entry.gradeId === 'P2' || entry.gradeId === 'P3');

  return { completed, total, percent, grades };
}

function SubjectCard({ subject, locale, t, progress, index }) {
  const config = SUBJECT_CONFIG[subject.id] || {
    icon: '🎮',
    gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    accent: '#a8edea',
    topics: [],
    color: '#a8edea',
  };
  const data = getSubjectTileData(subject, progress);

  return (
    <article
      className="subject-card-v2"
      style={{
        '--card-gradient': config.gradient,
        '--card-accent': config.accent,
        animationDelay: `${index * 60}ms`,
      }}
      data-testid={`subject-tile-${subject.id}`}
    >
      {/* Header */}
      <div className="subject-card-v2__header">
        <span className="subject-card-v2__icon" aria-hidden="true">{config.icon}</span>
        <div className="subject-card-v2__titles">
          <strong className="subject-card-v2__name">{getSubjectLabel(subject, locale, t)}</strong>
          <span className="subject-card-v2__desc">{getSubjectDescription(subject, locale)}</span>
        </div>
        <span className="subject-card-v2__grade">
          {subject.grades.filter((g) => g === 'P2' || g === 'P3').join(' · ')}
        </span>
      </div>

      {/* Topics */}
      {config.topics.length > 0 && (
        <div className="subject-card-v2__topics">
          {config.topics.map((topic) => (
            <span key={topic} className="subject-card-v2__topic">{topic}</span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="subject-card-v2__progress">
        <div className="subject-card-v2__progress-bar">
          <div
            className="subject-card-v2__progress-fill"
            style={{
              width: `${Math.max(data.percent, data.completed ? 6 : 0)}%`,
              background: config.gradient,
            }}
          />
        </div>
        <span className="subject-card-v2__progress-label">
          {data.completed}/{data.total || 0}
        </span>
      </div>

      {/* CTA */}
      <div className="subject-card-v2__footer">
        <Link
          className="subject-card-v2__cta"
          to={`/subjects/${subject.id}`}
          data-testid={`subject-launch-${subject.id}`}
          style={{ background: config.gradient }}
        >
          <span>Comenzar</span>
          <span aria-hidden="true">→</span>
        </Link>
        {data.grades.map((grade) => (
          <Link
            key={grade.gradeId}
            className="subject-card-v2__grade-cta"
            to={`/subjects/${subject.id}/grades/${grade.gradeId}`}
            data-testid={`subject-grade-direct-${subject.id}-${grade.gradeId}`}
          >
            {grade.gradeId}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default function SubjectsHubPage() {
  const { locale, t } = useLocale();
  const progress = getProgressSnapshot();
  const activeSubjects = subjects.filter(
    (subject) => subject.grades.includes('P2') || subject.grades.includes('P3')
  );

  return (
    <div className="page-stack page-stack--compact" data-testid="subjects-page">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('subjectsLabel') || 'Subjects'}</span>
            <h1 style={{ margin: '4px 0 0', fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {t('chooseUniverse')}
            </h1>
          </div>
          <span className="home-badge home-badge--blue">
            {activeSubjects.length} {t('subjectsLabel') || 'materias'}
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
          Elige una materia para explorar los módulos y las actividades.
        </p>
      </section>

      <div className="subjects-grid-v2">
        {activeSubjects.map((subject, index) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            locale={locale}
            t={t}
            progress={progress}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
