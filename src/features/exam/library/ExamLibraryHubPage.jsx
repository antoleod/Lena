import { Link } from 'react-router-dom';
import { getCategories } from '../../../content/exams/registry.js';
import { getCategoryLabel, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getResult, starsFor } from './examLibraryProgress.js';
import {
  IconLibCalculMental, IconLibProblemesMaths, IconLibMesures,
  IconLibGeometrie, IconLibLogique, IconLibCalendrierTemps,
  IconLibDecouverteMonde, IconLibComprehensionLecture, IconLibVocabulaire,
  IconLibOrthographe, IconLibDictee, IconLibGrammaire,
  IconLibConjugaison, IconLibTablesMult, IconLibFractions,
  IconLibSciences, IconLibGeographieBelgique, IconLibGrandDefi,
} from '../../../assets/icons/ExamIcons.jsx';

const LIBRARY_ICON_MAP = {
  'calcul-mental':             IconLibCalculMental,
  'problemes-mathematiques':   IconLibProblemesMaths,
  'mesures':                   IconLibMesures,
  'geometrie':                 IconLibGeometrie,
  'logique':                   IconLibLogique,
  'calendrier-temps':          IconLibCalendrierTemps,
  'decouverte-monde':          IconLibDecouverteMonde,
  'comprehension-lecture':     IconLibComprehensionLecture,
  'vocabulaire':               IconLibVocabulaire,
  'orthographe':               IconLibOrthographe,
  'dictee':                    IconLibDictee,
  'grammaire':                 IconLibGrammaire,
  'conjugaison':               IconLibConjugaison,
  'tables-multiplication':     IconLibTablesMult,
  'fractions':                 IconLibFractions,
  'sciences':                  IconLibSciences,
  'geographie-belgique':       IconLibGeographieBelgique,
  'grand-defi':                IconLibGrandDefi,
};

const CATEGORY_COLORS = [
  '#007aff', '#34c759', '#ff9500', '#ff3b30', '#af52de',
  '#5ac8fa', '#ff2d55', '#ff6b35', '#30b0c7', '#64d2ff',
  '#30d158', '#ffd60a', '#bf5af2', '#ff6961', '#4fc3f7',
  '#a29bfe', '#fd79a8', '#00b894',
];

function getCategoryProgress(cat) {
  const total = cat.exams.length;
  let passed = 0;
  for (const exam of cat.exams) {
    const levelKeys = exam.levelKeys ?? ['facile', 'moyen', 'difficile'];
    const anyPassed = levelKeys.some((lk) => {
      const res = getResult(exam.id, lk);
      if (!res) return false;
      return starsFor(res.bestScore, res.total, exam.levelPassPercent?.[lk]) >= 1;
    });
    if (anyPassed) passed++;
  }
  return { passed, total, pct: total > 0 ? Math.round((passed / total) * 100) : 0 };
}

const MEGA_LABELS = {
  fr: { title: 'Mega Examen', sub: 'Combine plusieurs thèmes' },
  nl: { title: 'Mega Examen', sub: 'Combineer meerdere thema\'s' },
  en: { title: 'Mega Exam',   sub: 'Combine multiple topics' },
  es: { title: 'Mega Examen', sub: 'Combina varios temas' },
};

export default function ExamLibraryHubPage() {
  const { locale } = useLocale();
  const categories = getCategories();
  const ui = getExamUi(locale);
  const mega = MEGA_LABELS[locale] || MEGA_LABELS.fr;

  return (
    <div className="elh-page">

      {/* ── Hero header ── */}
      <div className="elh-hero">
        <Link className="elh-hero__back" to="/exam" aria-label="Retour">←</Link>
        <div className="elh-hero__text">
          <span className="elh-hero__eyebrow">{ui.libraryTitle}</span>
          <h1 className="elh-hero__title">{ui.librarySubtitle}</h1>
          <p className="elh-hero__sub">{ui.libraryHint}</p>
        </div>
      </div>

      {/* ── Action row ── */}
      <div className="elh-actions">
        <Link to="/exam/history" className="elh-action-pill">
          <span>📋</span>
          <span>Historique</span>
        </Link>
      </div>

      {/* ── Mega Examen banner ── */}
      <Link to="/exam/mega" className="elh-mega">
        <div className="elh-mega__glow" aria-hidden="true" />
        <div className="elh-mega__icon">🏆</div>
        <div className="elh-mega__body">
          <strong className="elh-mega__title">{mega.title}</strong>
          <span className="elh-mega__sub">{mega.sub}</span>
        </div>
        <span className="elh-mega__arrow">→</span>
      </Link>

      {/* ── Category grid ── */}
      <div className="elh-grid">
        {categories.map((cat, idx) => {
          const { passed, total, pct } = getCategoryProgress(cat);
          const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const Icon = LIBRARY_ICON_MAP[cat.id];
          const isDone = total > 0 && passed === total;

          return (
            <Link
              key={cat.id}
              to={`/exam/library/${cat.id}`}
              className={`elh-cat-card${isDone ? ' elh-cat-card--done' : ''}`}
              style={{ '--cat-color': color }}
            >
              {isDone && <span className="elh-cat-card__crown" aria-label="Complété">👑</span>}
              <div className="elh-cat-card__icon-wrap">
                {Icon ? <Icon size={36} /> : <span style={{ fontSize: '2rem' }}>{cat.emoji || '📚'}</span>}
              </div>
              <span className="elh-cat-card__title">{getCategoryLabel(cat.id, locale) || cat.label}</span>
              <span className="elh-cat-card__meta">
                {ui.exams(cat.exams.length)} · {ui.levels(cat.exams[0]?.levelKeys?.length ?? 3)}
              </span>
              {total > 0 && (
                <div className="elh-cat-card__prog">
                  <div className="elh-cat-card__prog-track">
                    <div className="elh-cat-card__prog-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="elh-cat-card__prog-label">{ui.progress(passed, total)}</span>
                </div>
              )}
            </Link>
          );
        })}
        {categories.length === 0 && (
          <p style={{ color: 'var(--muted)', padding: '32px 0', textAlign: 'center', gridColumn: '1/-1' }}>
            Aucun examen disponible.
          </p>
        )}
      </div>
    </div>
  );
}
