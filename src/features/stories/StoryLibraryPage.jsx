import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTES } from '../../content/stories/contes.js';
import { CONTES_NL } from '../../content/stories/contes.nl.js';
import { CONTES_EN } from '../../content/stories/contes.en.js';
import { CONTES_ES } from '../../content/stories/contes.es.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const STORY_TRANSLATIONS = { nl: CONTES_NL, en: CONTES_EN, es: CONTES_ES };
import { STORY_COVER_MAP } from '../../assets/icons/StoryCovers.jsx';
import './stories.css';

const STORY_LIB_UI = {
  fr: {
    title: '📚 Bibliotheque Magique',
    subtitle: 'Choisis une histoire et plonge dans la magie',
    easy: 'doux',
    adventure: 'aventure',
    explorer: 'explorateur',
    minutes: 'min',
  },
  nl: {
    title: '📚 Magische Bibliotheek',
    subtitle: 'Kies een verhaal en duik in de magie',
    easy: 'zacht',
    adventure: 'avontuur',
    explorer: 'ontdekker',
    minutes: 'min',
  },
  en: {
    title: '📚 Magical Library',
    subtitle: 'Choose a story and dive into the magic',
    easy: 'gentle',
    adventure: 'adventure',
    explorer: 'explorer',
    minutes: 'min',
  },
  es: {
    title: '📚 Biblioteca Magica',
    subtitle: 'Elige una historia y sumérgete en la magia',
    easy: 'suave',
    adventure: 'aventura',
    explorer: 'explorador',
    minutes: 'min',
  },
};

function getReadIds() {
  try {
    return JSON.parse(localStorage.getItem('lena:stories-read') || '[]');
  } catch {
    return [];
  }
}

const SCENE_EMOJIS = ['🌟', '✨', '🎭', '🌙', '🌲', '🏰', '🌊', '🦋', '🌺', '⭐', '🎪', '🌈'];
function sceneEmoji(idx) { return SCENE_EMOJIS[idx % SCENE_EMOJIS.length]; }

export default function StoryLibraryPage() {
  const { locale } = useLocale();
  const ui = STORY_LIB_UI[locale] || STORY_LIB_UI.fr;
  const [readIds, setReadIds] = useState(() => getReadIds());

  useEffect(() => {
    function sync() { setReadIds(getReadIds()); }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return (
    <div className="sl-page">
      <header className="sl-header">
        <h1 className="sl-header__title">{ui.title}</h1>
        <p className="sl-header__sub">{ui.subtitle}</p>
      </header>

      <div className="sl-grid">
        {CONTES.map((conte, conteIdx) => {
          const diffKey = conte.difficulty;
          const diffLabel = diffKey === 'doux'
            ? ui.easy
            : diffKey === 'aventure'
              ? ui.adventure
              : ui.explorer;
          const isRead = readIds.includes(conte.id);
          const duration = Math.ceil((conte.scenes?.length || 4) * 0.75);
          const coverBg = conte.palette?.primary
            ? `linear-gradient(135deg, ${conte.palette.primary}cc, ${conte.palette.accent || conte.palette.primary}88)`
            : 'linear-gradient(135deg,#6366f1,#8b5cf6)';

          const CoverIcon = STORY_COVER_MAP[conte.id] || null;
          const tl = STORY_TRANSLATIONS[locale]?.[conte.id];
          const displayTitle = tl?.title ?? conte.title;

          return (
            <Link
              key={conte.id}
              to={`/stories/${conte.id}`}
              className="sl-card"
            >
              <div className="sl-card__cover" style={{ background: coverBg }}>
                {CoverIcon && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                    <CoverIcon size={80} />
                  </div>
                )}
                {conte.coverImage && (
                  <img
                    src={conte.coverImage}
                    alt={displayTitle}
                    className="sl-card__cover-img"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {!CoverIcon && !conte.coverImage && (
                  <span role="img" aria-label={conte.title} style={{ fontSize: '3rem' }}>
                    {conte.emoji || sceneEmoji(conteIdx)}
                  </span>
                )}
                {isRead && <span className="sl-card__crown">👑</span>}
              </div>
              <div className="sl-card__body">
                <span className="sl-card__title">{displayTitle}</span>
                <span className={`sl-card__badge sl-card__badge--${diffKey}`}>{diffLabel}</span>
                <div className="sl-card__meta">
                  <span>⏱ {duration} {ui.minutes}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
