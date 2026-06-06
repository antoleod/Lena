import { Link } from 'react-router-dom';
import { CONTES } from '../../content/stories/contes.js';

const DIFFICULTY_CONFIG = {
  doux:        { label: 'Doux',        color: '#27AE60', bg: '#eafaf1' },
  aventure:    { label: 'Aventure',    color: '#E67E22', bg: '#fef5e7' },
  explorateur: { label: 'Explorateur', color: '#2980B9', bg: '#eaf4fb' },
};

function getReadIds() {
  try {
    return JSON.parse(localStorage.getItem('lena:stories-read') || '[]');
  } catch {
    return [];
  }
}

export default function StoryLibraryPage() {
  const readIds = getReadIds();

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/">←</Link>
        <div>
          <span className="eyebrow">Bibliotheque</span>
          <h1>📖 Contes &amp; Histoires</h1>
          <p className="exam-hub-sub">Lis une histoire et decouvre ses secrets !</p>
        </div>
      </div>

      <div className="lecture-grid">
        {CONTES.map((conte) => {
          const diff = DIFFICULTY_CONFIG[conte.difficulty] || DIFFICULTY_CONFIG.doux;
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
                }}>lu ✓</span>
              )}
              <span className="lecture-card__emoji">{conte.emoji}</span>
              <span className="lecture-card__title">{conte.title}</span>
              <em className="lecture-card__meta" style={{ fontStyle: 'italic' }}>{conte.theme}</em>
              <span style={{
                fontSize: '.68rem', fontWeight: 700, borderRadius: 8,
                padding: '2px 8px', color: diff.color, background: diff.bg,
                border: `1px solid ${diff.color}33`,
              }}>
                {diff.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
