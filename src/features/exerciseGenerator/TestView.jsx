import { useState } from 'react';

// Test phase — one exercise at a time, the child answers in the app.
export default function TestView({ exercises, onBack, onFinish }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState('');

  const ex = exercises[index];
  const total = exercises.length;
  const isLast = index === total - 1;

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    window.speechSynthesis.speak(u);
  }

  function commit(value) {
    const next = { ...answers, [ex.id]: value };
    setAnswers(next);
    setDraft('');
    if (isLast) onFinish(next);
    else setIndex((i) => i + 1);
  }

  function submitDraft(e) {
    e?.preventDefault();
    if (draft.trim() === '') return;
    commit(draft.trim());
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">Vérifier mes réponses</span>
          <h1>Question {index + 1} / {total}</h1>
        </div>
      </div>

      <div className="cahier-progress">
        <div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="test-card">
        {ex.dictation && (
          <button type="button" className="dictee-audio dictee-audio--big" onClick={() => speak(ex.dictation)}>
            🔊 Réécouter
          </button>
        )}
        <p className="test-card__question">{ex.testQuestion || ex.question}</p>
      </div>

      <div className="test-answer">
        {ex.inputType === 'choice' && (ex.options || []).map((opt) => (
          <button key={opt} type="button" className="test-choice" onClick={() => commit(opt)}>
            {opt}
          </button>
        ))}

        {ex.inputType !== 'choice' && (
          <form onSubmit={submitDraft} className="test-input-row">
            <input
              className="test-input"
              inputMode={ex.inputType === 'number' ? 'numeric' : 'text'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ta réponse…"
              autoFocus
            />
            <button type="submit" className="cahier-cta cahier-cta--inline" disabled={draft.trim() === ''}>
              {isLast ? 'Terminer' : 'Suivant →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
