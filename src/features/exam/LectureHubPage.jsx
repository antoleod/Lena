import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LECTURE_STORIES } from '../../content/lecture/stories.js';
import { getErrorCount } from '../../services/storage/errorHistoryStore.js';

const PROGRESS_KEY = 'lena:lecture:v1';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}

function starsForScore(score, total) {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct === 1) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

function StarsDisplay({ count }) {
  return (
    <span className="lecture-card__stars">
      {[1, 2, 3].map(i => (
        <span key={i} style={{ opacity: i <= count ? 1 : 0.25 }}>⭐</span>
      ))}
    </span>
  );
}

export default function LectureHubPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setProgress(loadProgress());
    setErrorCount(getErrorCount());
  }, []);

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">Lecture & Compréhension</span>
          <h1>Histoires à lire</h1>
          <p className="exam-hub-sub">Lis l'histoire, puis réponds aux questions.</p>
        </div>
      </div>

      {errorCount > 0 && (
        <button
          type="button"
          className="errors-cta"
          onClick={() => navigate('/exam/errors')}
        >
          <span>⚠️ Révision des erreurs</span>
          <span className="errors-cta__badge">{errorCount}</span>
        </button>
      )}

      <div className="lecture-grid">
        {LECTURE_STORIES.map(story => {
          const storyProgress = progress[story.id];
          const attempted = !!storyProgress;
          const stars = attempted
            ? starsForScore(storyProgress.score, storyProgress.total)
            : null;

          return (
            <button
              key={story.id}
              type="button"
              className="lecture-card"
              onClick={() => navigate(`/exam/lecture/play?story=${story.id}`)}
            >
              <span className="lecture-card__emoji">{story.emoji}</span>
              <span className="lecture-card__title">{story.title}</span>
              <span className="lecture-card__meta">Niveau {story.level} · ~{story.estimatedMinutes} min</span>
              {attempted && <StarsDisplay count={stars} />}
              {!attempted && <span className="lecture-card__meta">Pas encore lu</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
