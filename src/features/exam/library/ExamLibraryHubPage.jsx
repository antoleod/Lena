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

/** Returns { passed, total } for a category — an exam counts as passed if any
 *  difficulty level has >= 1 star. */
function getCategoryProgress(cat) {
  const total = cat.exams.length;
  let passed = 0;
  for (const exam of cat.exams) {
    const levelKeys = exam.levelKeys ?? ['facile', 'moyen', 'difficile'];
    const anyPassed = levelKeys.some((lk) => {
      const res = getResult(exam.id, lk);
      if (!res) return false;
      const passPercent = exam.levelPassPercent?.[lk];
      return starsFor(res.bestScore, res.total, passPercent) >= 1;
    });
    if (anyPassed) passed++;
  }
  return { passed, total };
}

export default function ExamLibraryHubPage() {
  const { locale } = useLocale();
  const categories = getCategories();
  const ui = getExamUi(locale);

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">{ui.libraryTitle}</span>
          <h1>{ui.librarySubtitle}</h1>
          <p className="exam-hub-sub">{ui.libraryHint}</p>
        </div>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <Link
          to="/exam/history"
          className="exam-choice"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', padding: '8px 18px', fontSize: '.88rem', fontWeight: 700 }}
        >
          📋 Historique
        </Link>
      </div>

      <Link
        to="/exam/mega"
        className="mega-entry-banner"
      >
        <span className="mega-entry-banner__icon">🏆</span>
        <div className="mega-entry-banner__text">
          <strong>{locale === 'nl' ? 'Mega Examen' : locale === 'en' ? 'Mega Exam' : locale === 'es' ? 'Mega Examen' : 'Mega Examen'}</strong>
          <span>{locale === 'nl' ? 'Combineer meerdere themas' : locale === 'en' ? 'Combine multiple topics' : locale === 'es' ? 'Combina varios temas' : 'Combine plusieurs themes'}</span>
        </div>
        <span className="mega-entry-banner__arrow">→</span>
      </Link>

      <div className="lecture-grid">
        {categories.map((cat) => {
          const { passed, total } = getCategoryProgress(cat);
          const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
          return (
            <Link
              key={cat.id}
              to={`/exam/library/${cat.id}`}
              className="lecture-card"
            >
              <span className="lecture-card__emoji">
                {LIBRARY_ICON_MAP[cat.id]
                  ? (() => { const Icon = LIBRARY_ICON_MAP[cat.id]; return <Icon size={40} />; })()
                  : (cat.emoji || '📚')}
              </span>
              <span className="lecture-card__title">{getCategoryLabel(cat.id, locale) || cat.label}</span>
              <span className="lecture-card__meta">
                {ui.exams(cat.exams.length)} · {ui.levels(cat.exams[0]?.levelKeys?.length ?? 3)}
              </span>
              {total > 0 && (
                <div className="lecture-card__progress">
                  <div
                    className="lecture-card__progress-track"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="lecture-card__progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="lecture-card__progress-label">
                    {ui.progress(passed, total)}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
        {categories.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,.6)' }}>Aucun examen disponible.</p>
        )}
      </div>
    </div>
  );
}
