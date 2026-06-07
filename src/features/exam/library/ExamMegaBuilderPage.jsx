import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../content/exams/registry.js';
import { getCategoryLabel } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';

const MEGA_UI = {
  fr: {
    title: 'Mega Examen',
    subtitle: 'Choisis tes themes (2 minimum)',
    diffLabel: 'Difficulte',
    countLabel: 'Questions par theme',
    total: (n, themes) => `~${n} questions (${themes} theme${themes > 1 ? 's' : ''})`,
    launch: 'Lancer le Mega Examen',
    needMore: 'Selectionne au moins 2 themes',
    back: '←',
  },
  nl: {
    title: 'Mega Examen',
    subtitle: 'Kies je themas (minimaal 2)',
    diffLabel: 'Moeilijkheid',
    countLabel: 'Vragen per thema',
    total: (n, themes) => `~${n} vragen (${themes} thema${themes > 1 ? '\'s' : ''})`,
    launch: 'Mega Examen Starten',
    needMore: 'Selecteer minstens 2 themas',
    back: '←',
  },
  en: {
    title: 'Mega Exam',
    subtitle: 'Choose your topics (2 minimum)',
    diffLabel: 'Difficulty',
    countLabel: 'Questions per topic',
    total: (n, themes) => `~${n} questions (${themes} topic${themes > 1 ? 's' : ''})`,
    launch: 'Launch Mega Exam',
    needMore: 'Select at least 2 topics',
    back: '←',
  },
  es: {
    title: 'Mega Examen',
    subtitle: 'Elige tus temas (minimo 2)',
    diffLabel: 'Dificultad',
    countLabel: 'Preguntas por tema',
    total: (n, themes) => `~${n} preguntas (${themes} tema${themes > 1 ? 's' : ''})`,
    launch: 'Lanzar el Mega Examen',
    needMore: 'Selecciona al menos 2 temas',
    back: '←',
  },
};

const DIFF_OPTIONS_BY_LOCALE = {
  nl: { facile: 'Makkelijk', moyen: 'Gemiddeld', difficile: 'Moeilijk' },
  en: { facile: 'Easy', moyen: 'Medium', difficile: 'Hard' },
  es: { facile: 'Facil', moyen: 'Medio', difficile: 'Dificil' },
  fr: { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' },
};

export default function ExamMegaBuilderPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const ui = MEGA_UI[locale] || MEGA_UI.fr;
  const categories = getCategories();

  const [selected, setSelected] = useState(new Set());
  const [difficulty, setDifficulty] = useState('moyen');
  const [maxPerCat, setMaxPerCat] = useState(10);

  function toggleCat(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function launch() {
    if (selected.size < 2) return;
    const config = {
      categoryIds: [...selected],
      difficulty,
      maxPerCategory: maxPerCat,
    };
    sessionStorage.setItem('lena:mega:config', JSON.stringify(config));
    navigate('/exam/mega/play');
  }

  const canLaunch = selected.size >= 2;
  const totalEst = selected.size * maxPerCat;

  const diffLabels = DIFF_OPTIONS_BY_LOCALE[locale] || DIFF_OPTIONS_BY_LOCALE.fr;
  const DIFF_OPTIONS = [
    { key: 'facile',    emoji: '🟢', label: diffLabels.facile },
    { key: 'moyen',     emoji: '🟠', label: diffLabels.moyen },
    { key: 'difficile', emoji: '🔴', label: diffLabels.difficile },
  ];
  const COUNT_OPTIONS = [5, 10, 15];

  return (
    <div className="mega-builder">
      <div className="mega-builder__header">
        <button
          type="button"
          className="exam-back-btn"
          onPointerDown={e => { e.preventDefault(); navigate('/exam/library'); }}
        >
          {ui.back}
        </button>
        <div>
          <h1 className="mega-builder__title">🏆 {ui.title}</h1>
          <p className="mega-builder__sub">{ui.subtitle}</p>
        </div>
      </div>

      <div className="mega-builder__section">
        <div className="mega-cat-grid">
          {categories.map(cat => {
            const isOn = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                className={`mega-cat-chip${isOn ? ' mega-cat-chip--on' : ''}`}
                onPointerDown={e => { e.preventDefault(); toggleCat(cat.id); }}
              >
                <span className="mega-cat-chip__emoji">{cat.emoji || '📚'}</span>
                <span className="mega-cat-chip__label">{getCategoryLabel(cat.id, locale) || cat.label}</span>
                {isOn && <span className="mega-cat-chip__check">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mega-builder__section">
        <p className="mega-builder__section-label">{ui.diffLabel}</p>
        <div className="mega-opt-row">
          {DIFF_OPTIONS.map(d => (
            <button
              key={d.key}
              type="button"
              className={`mega-opt-btn${difficulty === d.key ? ' mega-opt-btn--on' : ''}`}
              onPointerDown={e => { e.preventDefault(); setDifficulty(d.key); }}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mega-builder__section">
        <p className="mega-builder__section-label">{ui.countLabel}</p>
        <div className="mega-opt-row">
          {COUNT_OPTIONS.map(n => (
            <button
              key={n}
              type="button"
              className={`mega-opt-btn${maxPerCat === n ? ' mega-opt-btn--on' : ''}`}
              onPointerDown={e => { e.preventDefault(); setMaxPerCat(n); }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mega-builder__footer">
        {selected.size >= 2 && (
          <p className="mega-builder__total">{ui.total(totalEst, selected.size)}</p>
        )}
        {selected.size > 0 && selected.size < 2 && (
          <p className="mega-builder__need-more">{ui.needMore}</p>
        )}
        <button
          type="button"
          className={`mega-launch-btn${canLaunch ? '' : ' mega-launch-btn--disabled'}`}
          onPointerDown={e => { e.preventDefault(); launch(); }}
          disabled={!canLaunch}
        >
          🚀 {ui.launch}
        </button>
      </div>
    </div>
  );
}
