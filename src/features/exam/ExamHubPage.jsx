import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getErrorCount } from '../../services/storage/errorHistoryStore.js';
import {
  IconExamAddition, IconExamSoustraction, IconExamMultiplication,
  IconExamDivision, IconExamCalculMental, IconExamFractions,
  IconExamLogique, IconExamProblemes, IconExamCultureGenerale,
  IconExamDecimaux, IconExamGeometrie, IconExamMesures,
} from '../../assets/icons/ExamIcons.jsx';

const SUBJECT_GROUPS = [
  {
    groupLabel: '➕ Calcul',
    subjects: [
      { topic: 'addition',         label: 'Addition',            Icon: IconExamAddition,       badge: 'P2–P3' },
      { topic: 'subtraction',      label: 'Soustraction',        Icon: IconExamSoustraction,   badge: 'P2–P3' },
      { topic: 'multiplication',   label: 'Multiplication',      Icon: IconExamMultiplication, badge: 'P3–P4' },
      { topic: 'division',         label: 'Division',            Icon: IconExamDivision,       badge: 'P4' },
      { topic: 'mixed-operations', label: 'Calcul mental',       Icon: IconExamCalculMental,   badge: 'P4–P5' },
      { topic: 'fractions',        label: 'Fractions',           Icon: IconExamFractions,      badge: 'P4' },
    ]
  },
  {
    groupLabel: '🧠 Raisonnement',
    subjects: [
      { topic: 'logic',            label: 'Logique',             Icon: IconExamLogique,        badge: 'P3' },
      { topic: 'word-problems',    label: 'Problèmes',           Icon: IconExamProblemes,      badge: 'P3–P4' },
      { topic: 'general-knowledge',label: 'Culture générale',    Icon: IconExamCultureGenerale,badge: 'P3' },
    ]
  },
  {
    groupLabel: '🔥 Niveau Expert',
    hard: true,
    subjects: [
      { topic: 'decimals',         label: 'Décimaux',            Icon: IconExamDecimaux,       badge: 'P5', grade: 'P5' },
      { topic: 'fractions',        label: 'Fractions avancées',  Icon: IconExamFractions,      badge: 'P5', grade: 'P5' },
      { topic: 'mixed-operations', label: 'Calcul avancé',       Icon: IconExamCalculMental,   badge: 'P5–P6', grade: 'P5' },
      { topic: 'geometry',         label: 'Géométrie',           Icon: IconExamGeometrie,      badge: 'P4–P5', grade: 'P4' },
      { topic: 'measurement',      label: 'Mesures',             Icon: IconExamMesures,        badge: 'P4', grade: 'P4' },
      { topic: 'word-problems',    label: 'Problèmes complexes', Icon: IconExamProblemes,      badge: 'P5', grade: 'P5' },
    ]
  },
];

const MODES = [
  { mode: 'relax', label: 'Relax', emoji: '😌', className: 'exam-mode-btn--relax' },
  { mode: 'time', label: 'Chrono', emoji: '⏱️', className: 'exam-mode-btn--chrono' },
  { mode: 'challenge', label: 'Défi', emoji: '🏆', className: 'exam-mode-btn--defi' },
];

export default function ExamHubPage() {
  const navigate = useNavigate();
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setErrorCount(getErrorCount());
  }, []);

  function startExam(topic, mode, grade) {
    const params = new URLSearchParams({ topic, mode });
    if (grade) params.set('grade', grade);
    navigate(`/exam/play?${params.toString()}`);
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

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
        <Link to="/exam/lecture" className="errors-cta" style={{ background: 'rgba(52,152,219,.18)', borderColor: 'rgba(52,152,219,.4)' }}>
          📚 Lecture &amp; Examens
        </Link>
        <Link to="/exam/library" className="errors-cta" style={{ background: 'rgba(46,204,113,.18)', borderColor: 'rgba(46,204,113,.4)' }}>
          🗂️ Bibliothèque d'examens
        </Link>
        {errorCount > 0 && (
          <Link to="/exam/errors" className="errors-cta">
            ⚠️ Erreurs à réviser
            <span className="errors-cta__badge">{errorCount}</span>
          </Link>
        )}
      </div>

      <div className="exam-mode-legend">
        <span className="exam-mode-legend__item exam-mode-legend__item--relax">😌 Relax — sans minuterie, explication après chaque réponse</span>
        <span className="exam-mode-legend__item exam-mode-legend__item--chrono">⏱️ Chrono — 20 s par question</span>
        <span className="exam-mode-legend__item exam-mode-legend__item--defi">🏆 Défi — 3 vies, 3 minutes globales</span>
      </div>

      {SUBJECT_GROUPS.map(({ groupLabel, subjects, hard }) => (
        <div key={groupLabel} className={`exam-subject-section${hard ? ' exam-subject-section--hard' : ''}`}>
          <h2 className="exam-subject-section__title">
            {groupLabel}
            {hard && <span className="exam-hard-badge">Difficile</span>}
          </h2>
          <div className="exam-subject-grid">
            {subjects.map(({ topic, label, Icon, badge, grade }) => (
              <div key={`${topic}-${grade || ''}`} className={`exam-subject-card${hard ? ' exam-subject-card--hard' : ''}`}>
                <div className="exam-subject-card__top">
                  <span className="exam-subject-card__emoji">
                    {Icon ? <Icon size={36} /> : null}
                  </span>
                  <div className="exam-subject-card__info">
                    <span className="exam-subject-card__name">{label}</span>
                    {badge && <span className="exam-subject-card__badge">{badge}</span>}
                  </div>
                </div>
                <div className="exam-subject-card__modes">
                  {MODES.map(({ mode, label: modeLabel, emoji: modeEmoji, className }) => (
                    <button
                      key={mode}
                      type="button"
                      className={`exam-mode-btn ${className}`}
                      onClick={() => startExam(topic, mode, grade)}
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
      ))}
    </div>
  );
}
