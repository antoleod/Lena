import { useNavigate, Link } from 'react-router-dom';
import { getCategories } from '../../../content/exams/registry.js';
import { getCategoryLabel, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getResult, loadAllProgress, starsFor } from './examLibraryProgress.js';
import { loadFavorites, loadRecent } from './examFavoritesStore.js';
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

const LEVEL_LABELS = {
  facile: { fr: 'Facile', nl: 'Makkelijk', en: 'Easy', es: 'Fácil' },
  moyen: { fr: 'Moyen', nl: 'Gemiddeld', en: 'Medium', es: 'Medio' },
  difficile: { fr: 'Difficile', nl: 'Moeilijk', en: 'Hard', es: 'Difícil' },
  guide: { fr: 'Guidé', nl: 'Begeleid', en: 'Guided', es: 'Guiado' },
};

function levelLabel(key, locale) {
  return (LEVEL_LABELS[key] || {})[locale] || key;
}

/** Find an exam stub and its parent category from the manifest (sync). */
function resolveExamStub(examId, categories) {
  for (const cat of categories) {
    const stub = cat.exams.find((e) => e.id === examId);
    if (stub) return { stub, cat };
  }
  return null;
}

/** Build "continue" card data from recent + progress. */
function buildContinueCards(categories, locale) {
  const recent = loadRecent();
  const progress = loadAllProgress();
  return recent.slice(0, 5).map((entry) => {
    const resolved = resolveExamStub(entry.examId, categories);
    if (!resolved) return null;
    const { stub, cat } = resolved;
    const res = progress[`${entry.examId}:${entry.levelKey}`];
    const pct = res && res.total ? Math.round((res.bestScore / res.total) * 100) : null;
    return {
      examId: entry.examId,
      levelKey: entry.levelKey,
      title: stub.title || entry.title,
      emoji: stub.emoji || entry.emoji || '📝',
      catLabel: getCategoryLabel(cat.id, locale) || cat.label || cat.id,
      catEmoji: cat.emoji || '📚',
      pct,
      ts: entry.ts,
    };
  }).filter(Boolean);
}

/** Build favorites cards from saved favorite IDs. */
function buildFavoriteCards(categories, locale) {
  const favIds = loadFavorites();
  return favIds.map((examId) => {
    const resolved = resolveExamStub(examId, categories);
    if (!resolved) return null;
    const { stub, cat } = resolved;
    return {
      examId,
      title: stub.title,
      emoji: stub.emoji || '📝',
      catLabel: getCategoryLabel(cat.id, locale) || cat.label || cat.id,
      catEmoji: cat.emoji || '📚',
      category: cat.id,
    };
  }).filter(Boolean);
}

export default function ExamLibraryHubPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const categories = getCategories();
  const ui = getExamUi(locale);
  const mega = MEGA_LABELS[locale] || MEGA_LABELS.fr;

  const continueCards = buildContinueCards(categories, locale);
  const favoriteCards = buildFavoriteCards(categories, locale);

  // Recommendation: most recent incomplete exam
  const recommendation = (() => {
    if (!continueCards.length) return null;
    const incomplete = continueCards.find((c) => c.pct !== null && c.pct < 100);
    if (!incomplete) return null;
    const pctMsg = incomplete.pct >= 80
      ? (locale === 'nl' ? 'Je bent er bijna!' : locale === 'en' ? "You're almost done!" : locale === 'es' ? '¡Casi terminas!' : 'Tu y es presque !')
      : (locale === 'nl' ? 'Ga verder waar je gebleven bent.' : locale === 'en' ? 'Continue where you left off.' : locale === 'es' ? 'Continúa donde lo dejaste.' : 'Continue là où tu t\'es arrêté.');
    return { ...incomplete, pctMsg };
  })();

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

      {/* ── Recommendation banner ── */}
      {recommendation && (
        <div
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(99,102,241,0.08))', border: '1.5px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={() => navigate(`/exam/library/play?exam=${recommendation.examId}&level=${recommendation.levelKey}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/exam/library/play?exam=${recommendation.examId}&level=${recommendation.levelKey}`)}
        >
          <span style={{ fontSize: '2rem' }}>💡</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--fg, #fff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {recommendation.emoji} {recommendation.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted, rgba(255,255,255,0.65))', marginTop: 2 }}>
              {recommendation.catEmoji} {recommendation.catLabel} · {levelLabel(recommendation.levelKey, locale)} · {recommendation.pct}% — {recommendation.pctMsg}
            </div>
            <div style={{ marginTop: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.12)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#6366f1', width: `${recommendation.pct}%`, transition: 'width 0.4s' }} />
            </div>
          </div>
          <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.2rem' }}>→</span>
        </div>
      )}

      {/* ── Continuer à travailler ── */}
      {continueCards.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--fg, #fff)', display: 'flex', alignItems: 'center', gap: 8 }}>
            ▶️ {locale === 'nl' ? 'Verder werken' : locale === 'en' ? 'Continue working' : locale === 'es' ? 'Seguir trabajando' : 'Continuer à travailler'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {continueCards.map((card) => (
              <div
                key={`${card.examId}:${card.levelKey}`}
                style={{ background: 'var(--surface-strong, rgba(255,255,255,0.07))', border: '1.5px solid var(--line, rgba(255,255,255,0.1))', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => navigate(`/exam/library/play?exam=${card.examId}&level=${card.levelKey}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/exam/library/play?exam=${card.examId}&level=${card.levelKey}`)}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{card.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--fg, #fff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted, rgba(255,255,255,0.55))', marginTop: 1 }}>
                    {card.catEmoji} {card.catLabel} · {levelLabel(card.levelKey, locale)}
                    {card.pct !== null ? ` · ${card.pct}%` : ''}
                  </div>
                  {card.pct !== null && (
                    <div style={{ marginTop: 5, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: card.pct >= 80 ? '#2ecc71' : card.pct >= 50 ? '#f39c12' : '#3498db', width: `${card.pct}%` }} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  style={{ background: '#6366f1', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.82rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/exam/library/play?exam=${card.examId}&level=${card.levelKey}`); }}
                >
                  {locale === 'nl' ? 'Verdergaan' : locale === 'en' ? 'Continue' : locale === 'es' ? 'Continuar' : 'Continuer'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Favoris ── */}
      {favoriteCards.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--fg, #fff)', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⭐ {locale === 'nl' ? 'Favorieten' : locale === 'en' ? 'Favourites' : locale === 'es' ? 'Favoritos' : 'Favoris'}
          </h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {favoriteCards.map((card) => (
              <div
                key={card.examId}
                style={{ minWidth: 130, maxWidth: 150, background: 'var(--surface-strong, rgba(255,255,255,0.07))', border: '1.5px solid rgba(245,158,11,0.35)', borderRadius: 14, padding: '12px 10px', cursor: 'pointer', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}
                onClick={() => navigate(`/exam/library/${card.category}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/exam/library/${card.category}`)}
              >
                <span style={{ fontSize: '2rem' }}>{card.emoji}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg, #fff)', lineHeight: 1.2 }}>{card.title}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted, rgba(255,255,255,0.55))' }}>{card.catEmoji} {card.catLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
