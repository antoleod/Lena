import { useEffect, useRef, useState } from 'react';
import MathVisualSvg from './MathVisualSvg.jsx';
import { useCahierT } from './cahierI18n.js';

// Notebook phase — the child solves these by hand. NO inputs, NO answers shown.
export default function NotebookView({ exercises, subject, level, timerMinutes, onBack, onDone }) {
  const L = useCahierT();
  const totalSeconds = timerMinutes ? timerMinutes * 60 : null;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="exam-progress-bar" style={{ flex: 1, height: 10, borderRadius: 5 }}>
            <div className="exam-progress-fill" style={{ width: `${pct}%`, background: fillColor, transition: 'width 1s linear, background .5s' }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem', whiteSpace: 'nowrap' }}>
            {L.t('tempsRestant')} : {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
          </span>
        </div>
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
              </div>
              {ex.visual && <MathVisualSvg visual={ex.visual} />}
              {ex.notebookInstruction && (
                <span className="notebook-item__hint">{ex.notebookInstruction}</span>
              )}
              <span className="notebook-item__blank" aria-hidden="true" />
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
