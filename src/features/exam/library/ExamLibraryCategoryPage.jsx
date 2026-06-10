import { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getExamsByCategory } from '../../../content/exams/registry.js';
import { getCategoryLabel, getCategoryEmoji, getDifficultyLevels, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getResult, starsFor } from './examLibraryProgress.js';
import { isFavorite, toggleFavorite } from './examFavoritesStore.js';
import {
  IconGeoB01, IconGeoB02, IconGeoB03, IconGeoB04, IconGeoB05,
  IconGeoB06, IconGeoB07, IconGeoB08, IconGeoB09, IconGeoB10,
  IconGeoB11, IconGeoB12, IconGeoB13, IconGeoB14, IconGeoB15,
  IconGeoB16, IconGeoB17, IconGeoB18, IconGeoB19, IconGeoB20,
} from '../../../assets/icons/ExamIcons.jsx';

const GEO_BELGIQUE_ICONS = {
  'geographie-belgique-01': IconGeoB01,
  'geographie-belgique-02': IconGeoB02,
  'geographie-belgique-03': IconGeoB03,
  'geographie-belgique-04': IconGeoB04,
  'geographie-belgique-05': IconGeoB05,
  'geographie-belgique-06': IconGeoB06,
  'geographie-belgique-07': IconGeoB07,
  'geographie-belgique-08': IconGeoB08,
  'geographie-belgique-09': IconGeoB09,
  'geographie-belgique-10': IconGeoB10,
  'geographie-belgique-11': IconGeoB11,
  'geographie-belgique-12': IconGeoB12,
  'geographie-belgique-13': IconGeoB13,
  'geographie-belgique-14': IconGeoB14,
  'geographie-belgique-15': IconGeoB15,
  'geographie-belgique-16': IconGeoB16,
  'geographie-belgique-17': IconGeoB17,
  'geographie-belgique-18': IconGeoB18,
  'geographie-belgique-19': IconGeoB19,
  'geographie-belgique-20': IconGeoB20,
};

/* ── Accent palette: 16 distinct hues cycling per exam order ── */
const CARD_ACCENTS = [
  '#ff6b6b', '#ff8c42', '#ffc857', '#9cde7c',
  '#56cfe1', '#6c9bcf', '#9b72cf', '#e05f87',
  '#3ddc97', '#ffb347', '#a18cd1', '#4ecdc4',
  '#f7b731', '#fc5c65', '#45aaf2', '#26de81',
];

function accent(order) {
  return CARD_ACCENTS[(order - 1) % CARD_ACCENTS.length];
}

/* ── Stars display ── */
function StarRow({ count }) {
  return (
    <div className="ec-stars">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`ec-star${i <= count ? ' ec-star--on' : ''}`}>⭐</span>
      ))}
    </div>
  );
}

/* ── Per-exam progress: total stars earned / max ── */
function examProgress(exam) {
  const levelKeys = exam.levelKeys ?? ['facile', 'moyen', 'difficile'];
  let earned = 0;
  for (const lk of levelKeys) {
    const res = getResult(exam.id, lk);
    if (!res) continue;
    earned += starsFor(res.bestScore, res.total, exam.levelPassPercent?.[lk]);
  }
  const maxStars = levelKeys.length * 3;
  return { earned, maxStars, pct: maxStars > 0 ? Math.round((earned / maxStars) * 100) : 0 };
}

/* ── Best stars across all difficulty levels ── */
function bestStarsForExam(exam) {
  const levelKeys = exam.levelKeys ?? ['facile', 'moyen', 'difficile'];
  let best = 0;
  for (const lk of levelKeys) {
    const res = getResult(exam.id, lk);
    if (!res) continue;
    const s = starsFor(res.bestScore, res.total, exam.levelPassPercent?.[lk]);
    if (s > best) best = s;
  }
  return best;
}

const NEW_EXAM_IDS = new Set([
  'calcul-mental-11','calcul-mental-12',
  'problemes-mathematiques-21','problemes-mathematiques-22',
  'conjugaison-24','conjugaison-25',
  'grammaire-24','grammaire-25',
  'orthographe-21','orthographe-22',
  'geometrie-21','geometrie-22',
  'mesures-21','mesures-22',
]);

const NEW_BADGE_LABEL = {
  fr: { ce1: 'Nouveau · CE1', ce2: 'Nouveau · CE2' },
  nl: { ce1: 'Nieuw · CE1',   ce2: 'Nieuw · CE2'   },
  en: { ce1: 'New · Year 2',  ce2: 'New · Year 3'  },
  es: { ce1: 'Nuevo · CE1',   ce2: 'Nuevo · CE2'   },
};

/* ── Level dot config ── */
const LEVEL_STYLE = {
  guide:     { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', color: '#4338ca', dot: '#6366f1', label: 'ⓘ' },
  facile:    { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)', color: '#15803d', dot: '#22c55e', label: null },
  moyen:     { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)', color: '#92400e', dot: '#f59e0b', label: null },
  difficile: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)', color: '#b91c1c', dot: '#ef4444', label: null },
};

export default function ExamLibraryCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { locale } = useLocale();

  const cat = getCategories().find((c) => c.id === categoryId);
  const difficultyLevels = getDifficultyLevels(locale);
  const ui = getExamUi(locale);
  const badgeLabels = NEW_BADGE_LABEL[locale] || NEW_BADGE_LABEL.fr;

  const [exams, setExams] = useState(null);
  // Use a render counter so toggling favorites re-renders without separate state per exam
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;
    getExamsByCategory(categoryId).then((list) => {
      if (!cancelled) setExams(list);
    });
    return () => { cancelled = true; };
  }, [categoryId]);

  if (!cat) {
    return (
      <div className="exam-hub-page">
        <div className="ec-header">
          <div className="ec-header__back">
            <Link className="exam-back-btn" to="/exam/library">←</Link>
            <h1>{ui.notFound}</h1>
          </div>
        </div>
      </div>
    );
  }

  if (exams === null) {
    return (
      <div className="exam-hub-page">
        <div className="ec-header">
          <div className="ec-header__back">
            <Link className="exam-back-btn" to="/exam/library">←</Link>
            <span>Chargement…</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Global stats ── */
  let totalEarned = 0;
  let totalMax = 0;
  let passedCount = 0;
  for (const exam of exams) {
    const p = examProgress(exam);
    totalEarned += p.earned;
    totalMax += p.maxStars;
    if (p.earned > 0) passedCount++;
  }
  const globalPct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
  const catEmoji = getCategoryEmoji(cat.id);

  return (
    <div className="exam-hub-page">

      {/* ── Rich header ── */}
      <div className="ec-header">
        <div className="ec-header__back">
          <Link className="exam-back-btn" to="/exam/library">←</Link>
          <span className="eyebrow">{catEmoji} {getCategoryLabel(cat.id, locale)}</span>
        </div>

        <div className="ec-header__progress-card">
          <span className="ec-header__cat-icon">{catEmoji}</span>
          <div className="ec-header__stats">
            <h1 className="ec-header__title">{getCategoryLabel(cat.id, locale)}</h1>
            <div className="ec-header__row">
              <span>⭐ {totalEarned}/{totalMax}</span>
              <span>·</span>
              <span>📚 {passedCount}/{exams.length} {ui.exams ? '' : 'terminés'}</span>
              <span>·</span>
              <span>{globalPct}%</span>
            </div>
            <div className="ec-header__global-bar">
              <div className="ec-header__global-fill" style={{ width: `${globalPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Exam card grid ── */}
      <div className="ec-grid">
        {exams.map((exam) => {
          const best = bestStarsForExam(exam);
          const prog = examProgress(exam);
          const isNew = NEW_EXAM_IDS.has(exam.id);
          const isDone = prog.pct >= 100;
          const badgeLabel = isNew ? (exam.title.includes('CE2') ? badgeLabels.ce2 : badgeLabels.ce1) : null;
          const cardAccent = accent(exam.order ?? 1);

          return (
            <div
              key={exam.id}
              className={`ec-card${isDone ? ' ec-card--done' : ''}${isNew ? ' ec-card--new' : ''}`}
              style={{ '--accent': cardAccent }}
            >
              {/* Banner with icon */}
              <div className="ec-card__header">
                {GEO_BELGIQUE_ICONS[exam.id]
                  ? (() => { const Icon = GEO_BELGIQUE_ICONS[exam.id]; return <Icon size={44} />; })()
                  : <span className="ec-card__emoji">{exam.emoji}</span>
                }
                {isDone && <span className="ec-card__crown" aria-hidden="true">👑</span>}
                {isDone && <span className="ec-card__check-badge" aria-hidden="true">✓</span>}
                {isNew && <span className="ec-card__new-tag">✨ {badgeLabel}</span>}
                <button
                  type="button"
                  aria-label={isFavorite(exam.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(exam.id); forceUpdate(); }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, zIndex: 2, padding: 2, filter: isFavorite(exam.id) ? 'none' : 'grayscale(1) opacity(0.5)' }}
                >
                  ⭐
                </button>
              </div>

              {/* Body */}
              <div className="ec-card__body">
                <h3 className="ec-card__name">{exam.title}</h3>
                <StarRow count={best} />
                <div className="ec-card__progress">
                  <div className="ec-card__progress-bar">
                    <div className="ec-card__progress-fill" style={{ width: `${prog.pct}%` }} />
                  </div>
                  <span className="ec-card__progress-pct">{prog.pct}%</span>
                </div>
              </div>

              {/* Level dots */}
              <div className="ec-card__levels">
                {/* Guide */}
                <button
                  type="button"
                  className="ec-lvl ec-lvl--guide"
                  data-tooltip="Guidé"
                  style={{
                    background: LEVEL_STYLE.guide.bg,
                    borderColor: LEVEL_STYLE.guide.border,
                    color: LEVEL_STYLE.guide.color,
                  }}
                  onClick={() => navigate(`/exam/library/play?exam=${exam.id}&level=guide`)}
                  aria-label="Mode guidé"
                >
                  ⓘ
                </button>

                {/* Difficulty levels */}
                {difficultyLevels.map((lvl) => {
                  const res = getResult(exam.id, lvl.key);
                  const stars = res ? starsFor(res.bestScore, res.total, exam.levelPassPercent?.[lvl.key]) : 0;
                  const sty = LEVEL_STYLE[lvl.key] || {};
                  return (
                    <button
                      key={lvl.key}
                      type="button"
                      className={`ec-lvl ec-lvl--${lvl.key}${stars > 0 ? ' ec-lvl--done' : ''}`}
                      data-tooltip={lvl.label}
                      style={{
                        background: sty.bg,
                        borderColor: sty.border,
                        color: sty.color,
                      }}
                      onClick={() => navigate(`/exam/library/play?exam=${exam.id}&level=${lvl.key}`)}
                      aria-label={lvl.label}
                    >
                      <span
                        className="ec-lvl__dot"
                        style={{ background: sty.dot }}
                        aria-hidden="true"
                      />
                      {stars > 0 && <span className="ec-lvl__check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
