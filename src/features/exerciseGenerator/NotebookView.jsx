import { useEffect, useRef, useState } from 'react';
import MathVisualSvg from './MathVisualSvg.jsx';
import { useCahierT } from './cahierI18n.js';
import { EyeOpenIcon, EyeHiddenIcon } from '../../assets/icons/VisualHintIcons.jsx';

const RADIUS = 26;
const CIRC = 2 * Math.PI * RADIUS;

function CahierTimer({ secondsLeft, totalSeconds, label }) {
  const pct = totalSeconds ? secondsLeft / totalSeconds : 1;
  const isWarning = secondsLeft <= 120 && secondsLeft > 30;
  const isUrgent  = secondsLeft <= 30;

  const arcColor = isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : '#34d399';
  const glowColor = isUrgent ? 'rgba(239,68,68,.35)' : isWarning ? 'rgba(245,158,11,.25)' : 'rgba(52,211,153,.2)';

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className={`cahier-timer${isWarning ? ' is-warning' : ''}${isUrgent ? ' is-urgent' : ''}`}>
      {/* arc ring */}
      <svg className="cahier-timer__ring" width="68" height="68" viewBox="0 0 68 68">
        {/* glow */}
        <circle cx="34" cy="34" r={RADIUS} fill="none"
          stroke={glowColor} strokeWidth="10" />
        {/* track */}
        <circle cx="34" cy="34" r={RADIUS} fill="none"
          stroke="rgba(255,255,255,.12)" strokeWidth="5" />
        {/* arc */}
        <circle cx="34" cy="34" r={RADIUS} fill="none"
          stroke={arcColor} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - pct)}
          transform="rotate(-90 34 34)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke .6s ease' }}
        />
      </svg>

      {/* digital display */}
      <div className="cahier-timer__body">
        <span className="cahier-timer__label">{label}</span>
        <span className="cahier-timer__digits" style={{ color: arcColor }}>
          {mins}<span className="cahier-timer__colon">:</span>{secs}
        </span>
      </div>
    </div>
  );
}

// Notebook phase — the child solves these by hand. NO inputs, NO answers shown.
export default function NotebookView({ exercises, subject, level, timerMinutes, onBack, onDone }) {
  const L = useCahierT();
  const totalSeconds = timerMinutes ? timerMinutes * 60 : null;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [visibleVisuals, setVisibleVisuals] = useState(new Set());

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function toggleVisual(id) {
    setVisibleVisuals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!totalSeconds) return;
    setSecondsLeft(totalSeconds);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onDoneRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [totalSeconds]);

  const pct = totalSeconds ? (secondsLeft / totalSeconds) * 100 : 100;
  const fillColor = secondsLeft <= 30 ? '#e74c3c' : secondsLeft <= 120 ? '#f39c12' : '#2ecc71';
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="cahier-page cahier-page--notebook">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">{subject?.emoji} {L.label(subject?.id)}</span>
          <h1>{L.t('monCahier')}</h1>
        </div>
      </div>

      {timerMinutes && secondsLeft !== null && (
        <CahierTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} label={L.t('tempsRestant')} />
      )}

      <p className="cahier-instruction">{L.t('instructionNotebook')}</p>

      {/* Notebook sheet */}
      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">{L.t('ficheTitle')} · {L.label(subject?.id)}</h2>
        <ol className="notebook-list">
          {exercises.map((ex) => (
            <li key={ex.id} className="notebook-item">
              <div className="notebook-item__q">
                {ex.dictation ? (
                  <DictationRow text={ex.dictation} onPlay={() => speak(ex.dictation)} />
                ) : (
                  <span className="notebook-item__text">{ex.question}</span>
                )}
                {ex.visual && (
                  <button
                    type="button"
                    className="notebook-visual-toggle"
                    onClick={() => toggleVisual(ex.id)}
                    aria-label="Voir l'aide visuelle"
                  >
                    {visibleVisuals.has(ex.id) ? <EyeHiddenIcon size={18} /> : <EyeOpenIcon size={18} />}
                  </button>
                )}
                {ex.visual && visibleVisuals.has(ex.id) && (
                  <MathVisualSvg visual={ex.visual} />
                )}
              </div>
              <span className="notebook-item__blank" aria-hidden="true" />
              {ex.notebookInstruction && (
                <span className="notebook-item__hint">{ex.notebookInstruction}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <button type="button" className="cahier-cta" onClick={onDone}>
        {L.t('finishedNotebook')}
      </button>
    </div>
  );
}

// Dictation: the word/sentence is HIDDEN by default (for the adult), with a
// reveal toggle and an audio button.
function DictationRow({ text, onPlay }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="dictee-row">
      <button type="button" className="dictee-audio" onClick={onPlay}>🔊 Écouter</button>
      <button type="button" className="dictee-toggle" onClick={() => setShown((s) => !s)}>
        {shown ? '🙈 Cacher la phrase' : '👁️ Afficher la phrase'}
      </button>
      {shown && <span className="dictee-text">{text}</span>}
    </div>
  );
}
