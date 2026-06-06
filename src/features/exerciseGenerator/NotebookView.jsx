import { useState } from 'react';

// Notebook phase — the child solves these by hand. NO inputs here on purpose.
export default function NotebookView({ exercises, subject, level, onBack, onStartTest }) {
  const [doneInNotebook, setDoneInNotebook] = useState(false);

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
          <span className="eyebrow">{subject?.emoji} {subject?.label}</span>
          <h1>Mon cahier</h1>
        </div>
      </div>

      <p className="cahier-instruction">
        ✍️ Fais ces exercices dans ton vrai cahier. Prends ton temps !
      </p>

      {/* Notebook sheet */}
      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">Exercices · {subject?.label}</h2>
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
              {ex.notebookInstruction && (
                <span className="notebook-item__hint">{ex.notebookInstruction}</span>
              )}
              <span className="notebook-item__blank" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      {!doneInNotebook ? (
        <button type="button" className="cahier-cta" onClick={() => setDoneInNotebook(true)}>
          ✅ J'ai terminé dans mon cahier
        </button>
      ) : (
        <div className="cahier-ready">
          <p className="cahier-ready__msg">Super ! Tu peux maintenant vérifier tes réponses. 🌟</p>
          <button type="button" className="cahier-cta cahier-cta--go" onClick={onStartTest}>
            ▶️ Commencer le test
          </button>
        </div>
      )}
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
