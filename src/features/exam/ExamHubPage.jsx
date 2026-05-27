import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  { topic: 'addition', label: 'Addition', emoji: '➕', grade: 'P3' },
  { topic: 'subtraction', label: 'Soustraction', emoji: '➖', grade: 'P3' },
  { topic: 'multiplication', label: 'Multiplication', emoji: '✖️', grade: 'P3' },
  { topic: 'division', label: 'Division', emoji: '➗', grade: 'P4' },
  { topic: 'fractions', label: 'Fractions', emoji: '½', grade: 'P4' },
  { topic: 'mixed-operations', label: 'Opérations mixtes', emoji: '🔢', grade: 'P5' },
  { topic: 'logic', label: 'Logique', emoji: '🧠', grade: 'P3' },
  { topic: 'word-problems', label: 'Problèmes', emoji: '📖', grade: 'P3' },
  { topic: 'general-knowledge', label: 'Culture générale', emoji: '🌍', grade: 'P3' },
];

const MODES = [
  { mode: 'relax', label: 'Relax', emoji: '😌', className: 'exam-mode-btn--relax' },
  { mode: 'time', label: 'Chrono', emoji: '⏱️', className: 'exam-mode-btn--chrono' },
  { mode: 'challenge', label: 'Défi', emoji: '🏆', className: 'exam-mode-btn--defi' },
];

export default function ExamHubPage() {
  const navigate = useNavigate();

  function startExam(topic, mode) {
    navigate(`/exam/play?topic=${topic}&mode=${mode}`);
  }

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/">←</Link>
        <div>
          <span className="eyebrow">Examens & Défis</span>
          <h1>Arène des examens</h1>
          <p className="exam-hub-sub">Choisis une matière et un mode de jeu.</p>
        </div>
      </div>

      <div className="exam-mode-legend">
        <span className="exam-mode-legend__item exam-mode-legend__item--relax">😌 Relax — sans minuterie, explication après chaque réponse</span>
        <span className="exam-mode-legend__item exam-mode-legend__item--chrono">⏱️ Chrono — 20 s par question</span>
        <span className="exam-mode-legend__item exam-mode-legend__item--defi">🏆 Défi — 3 vies, 3 minutes globales</span>
      </div>

      <div className="exam-subject-grid">
        {SUBJECTS.map(({ topic, label, emoji, grade }) => (
          <div key={topic} className="exam-subject-card">
            <div className="exam-subject-card__top">
              <span className="exam-subject-card__emoji">{emoji}</span>
              <span className="exam-subject-card__name">{label}</span>
            </div>
            <div className="exam-subject-card__modes">
              {MODES.map(({ mode, label: modeLabel, emoji: modeEmoji, className }) => (
                <button
                  key={mode}
                  type="button"
                  className={`exam-mode-btn ${className}`}
                  onClick={() => startExam(topic, mode)}
                >
                  <span>{modeEmoji}</span>
                  <span>{modeLabel}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
