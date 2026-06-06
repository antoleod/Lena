import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTES } from '../../content/stories/contes.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const STORY_LIB_UI = {
  fr: {
    title: '📚 Contes & Histoires',
    subtitle: 'Choisis une histoire a lire',
    readBadge: 'lu ✓',
    easy: 'doux',
    adventure: 'aventure',
    explorer: 'explorateur',
    back: '← Accueil',
  },
  nl: {
    title: '📚 Verhalen',
    subtitle: 'Kies een verhaal om te lezen',
    readBadge: 'gelezen ✓',
    easy: 'zacht',
    adventure: 'avontuur',
    explorer: 'ontdekkingsreiziger',
    back: '← Terug',
  },
  en: {
    title: '📚 Stories & Tales',
    subtitle: 'Choose a story to read',
    readBadge: 'read ✓',
    easy: 'gentle',
    adventure: 'adventure',
    explorer: 'explorer',
    back: '← Home',
  },
  es: {
    title: '📚 Cuentos e Historias',
    subtitle: 'Elige una historia para leer',
    readBadge: 'leido ✓',
    easy: 'suave',
    adventure: 'aventura',
    explorer: 'explorador',
    back: '← Inicio',
  },
};

const DIFFICULTY_CONFIG = {
  doux:        { color: '#27AE60', bg: '#eafaf1' },
  aventure:    { color: '#E67E22', bg: '#fef5e7' },
  explorateur: { color: '#2980B9', bg: '#eaf4fb' },
};

function getReadIds() {
  try {
    return JSON.parse(localStorage.getItem('lena:stories-read') || '[]');
  } catch {
    return [];
  }
}

export default function StoryLibraryPage() {
  const { locale } = useLocale();
  const ui = STORY_LIB_UI[locale] || STORY_LIB_UI.fr;
  const [readIds, setReadIds] = useState(() => getReadIds());

  // setReadIds kept for future reactive updates (e.g. after marking a story read)
  void setReadIds;

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/">{ui.back}</Link>
        <div>
          <span className="eyebrow">Bibliotheque</span>
          <h1>{ui.title}</h1>
          <p className="exam-hub-sub">{ui.subtitle}</p>
        </div>
      </div>

      <div className="lecture-grid">
        {CONTES.map((conte) => {
          const diffKey = conte.difficulty;
          const diff = DIFFICULTY_CONFIG[diffKey] || DIFFICULTY_CONFIG.doux;
          const diffLabel = diffKey === 'doux'
            ? ui.easy
            : diffKey === 'aventure'
              ? ui.adventure
              : ui.explorer;
          const isRead = readIds.includes(conte.id);
          return (
            <Link
              key={conte.id}
              to={`/stories/${conte.id}`}
              className="lecture-card"
              style={{ position: 'relative' }}
            >
              {isRead && (
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  fontSize: '.75rem', background: '#27AE60',
                  color: '#fff', borderRadius: 8, padding: '1px 6px', fontWeight: 700,
                }}>{ui.readBadge}</span>
              )}
              <span className="lecture-card__emoji">{conte.emoji}</span>
              <span className="lecture-card__title">{conte.title}</span>
              <em className="lecture-card__meta" style={{ fontStyle: 'italic' }}>{conte.theme}</em>
              <span style={{
                fontSize: '.68rem', fontWeight: 700, borderRadius: 8,
                padding: '2px 8px', color: diff.color, background: diff.bg,
                border: `1px solid ${diff.color}33`,
              }}>
                {diffLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
