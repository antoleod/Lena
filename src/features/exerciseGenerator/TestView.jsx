import { useMemo, useState } from 'react';
import MathVisualSvg from './MathVisualSvg.jsx';
import { EyeOpenIcon, EyeHiddenIcon } from '../../assets/icons/VisualHintIcons.jsx';
import { useCahierT } from './cahierI18n.js';
import { checkAnswer } from './exerciseEngine.js';
import { recordError } from '../../services/storage/errorHistoryStore.js';
import NumericAnswerInput from '../../shared/ui/NumericAnswerInput.jsx';

export default function TestView({ exercises, onBack, onFinish }) {
  const L = useCahierT();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({});
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showMethod, setShowMethod] = useState(false);
  const [showExpl, setShowExpl] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [firstTryWrong, setFirstTryWrong] = useState(false);
  const [answerMode, setAnswerMode] = useState('keyboard');
  const [showVisual, setShowVisual] = useState(false);

  const ex = exercises[index];
  const total = exercises.length;
  const isLast = index === total - 1;
  const hints = ex.hints && ex.hints.length ? ex.hints : (ex.hint ? [ex.hint] : []);
  const expectedAnswer = useMemo(() => String(ex.answer ?? ex.correctAnswer ?? '').trim(), [ex]);
  const isNumericAnswer = ex.inputType === 'number' || /^-?\d+([.,]\d+)?$/.test(expectedAnswer);
  const starsEarned = feedback === 'correct' ? (firstTryWrong ? 1 : 3) : 0;
  const canContinue = feedback === 'correct' || revealed;

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    window.speechSynthesis.speak(u);
  }

  function evaluate(value) {
    if (feedback === 'correct') return;
    setSelected(value);
    const ok = checkAnswer(ex, value);
    if (ok) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
      setFirstTryWrong(true);
      recordError({
        topic: ex.subject || 'cahier',
        question: ex.testQuestion || ex.question,
        correctAnswer: String(ex.answer ?? ex.correctAnswer),
        userAnswer: String(value),
        source: 'cahier-test',
        practiceKey: `${ex.subject}:${ex.type}`,
        level: ex.level,
      });
    }
  }

  function retry() {
    setFeedback(null);
    setSelected(null);
    setDraft('');
    setAnswerMode('keyboard');
  }

  function advance() {
    const next = { ...results, [ex.id]: { correct: !firstTryWrong, starsEarned, answerMode } };
    if (isLast) {
      onFinish(next);
      return;
    }
    setResults(next);
    setIndex((i) => i + 1);
    setDraft('');
    setFeedback(null);
    setSelected(null);
    setAnswerMode('keyboard');
    setHintLevel(0);
    setShowMethod(false);
    setShowExpl(false);
    setRevealed(false);
    setFirstTryWrong(false);
    setShowVisual(false);
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">{L.t('verifTitle')}</span>
          <h1>{L.t('question')} {index + 1} / {total}</h1>
        </div>
      </div>

      <div className="cahier-progress">
        <div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="test-card">
        {ex.dictation && (
          <button type="button" className="dictee-audio dictee-audio--big" onClick={() => speak(ex.dictation)}>🔊 Réécouter</button>
        )}
        <div className="test-card__question-row">
          <p className="test-card__question">{ex.testQuestion || ex.question}</p>
          {ex.visual && (
            <button
              type="button"
              className="notebook-visual-toggle"
              onClick={() => setShowVisual((v) => !v)}
              aria-label="Voir l'aide visuelle"
            >
              {showVisual ? <EyeHiddenIcon size={18} /> : <EyeOpenIcon size={18} />}
            </button>
          )}
          {ex.visual && showVisual && <MathVisualSvg visual={ex.visual} />}
        </div>
      </div>

      {!canContinue && (
        <div className="test-answer">
          {ex.inputType === 'choice' && (ex.options || []).map((opt) => {
            const wrongPick = feedback === 'wrong' && opt === selected;
            return (
              <button key={opt} type="button" className="test-choice" style={wrongPick ? { background: '#e74c3c', color: '#fff' } : {}} onClick={() => evaluate(opt)}>
                {opt}
              </button>
            );
          })}

          {ex.inputType !== 'choice' && (
            <>
              {isNumericAnswer ? (
                <NumericAnswerInput
                  value={draft}
                  onChange={setDraft}
                  onSubmit={(value) => {
                    const text = String(value).trim();
                    if (text) evaluate(text);
                  }}
                  expectedAnswer={expectedAnswer}
                  placeholder={L.t('taReponse')}
                  allowNegative={expectedAnswer.startsWith('-')}
                  valueLabel={L.t('taReponse')}
                  readLabel={L.t('jAiLu')}
                  handwritingLabel={L.t('ecrireReponse')}
                  keypadLabel="Clavier numérique"
                  onModeChange={setAnswerMode}
                />
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) evaluate(draft.trim()); }} className="test-input-row">
                  <input
                    className="test-input"
                    inputMode="text"
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setAnswerMode('keyboard');
                    }}
                    placeholder={L.t('taReponse')}
                    autoFocus
                  />
                  <button type="submit" className="cahier-cta cahier-cta--inline" disabled={draft.trim() === ''}>
                    {L.t('verifier')}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {feedback === 'wrong' && (
        <div className="test-help">
          <p className="test-help__head test-help__head--ko">❌ {L.t('notCorrect')} {L.t('pasGrave')}</p>

          {hints.slice(0, hintLevel).map((h, k) => (
            <p key={k} className="test-help__hint">💡 {h}</p>
          ))}
          <div className="test-help__actions">
            {hintLevel < hints.length && (
              <button type="button" className="geo-hint-btn" onClick={() => setHintLevel((n) => n + 1)}>{L.t('indice')}</button>
            )}
            {ex.method && !showMethod && (
              <button type="button" className="geo-hint-btn" onClick={() => setShowMethod(true)}>{L.t('methodeBtn')}</button>
            )}
            {ex.explanation && !showExpl && (
              <button type="button" className="geo-hint-btn" onClick={() => setShowExpl(true)}>{L.t('explicationBtn')}</button>
            )}
          </div>

          {showMethod && ex.method && (
            <div className="test-help__method">
              <strong>{L.t('methodeBtn')}</strong>
              {String(ex.method).split('\n').map((line, k) => <span key={k} className="explain-item__step">{line}</span>)}
            </div>
          )}
          {showExpl && ex.explanation && <p className="test-help__expl">📖 {ex.explanation}</p>}

          <div className="cahier-actions">
            <button type="button" className="cahier-cta cahier-cta--go" onClick={retry}>{L.t('reessayer')}</button>
            {!revealed && (
              <button type="button" className="cahier-cta cahier-cta--soft" onClick={() => setRevealed(true)}>{L.t('voirSolution')}</button>
            )}
          </div>
        </div>
      )}

      {feedback === 'wrong' && revealed && (
        <div className="test-help test-help--solution">
          <p>{L.t('solution')} : <strong>{ex.inputType === 'true_false' ? (ex.answer ? 'Vrai' : 'Faux') : String(ex.answer ?? ex.correctAnswer)}</strong></p>
          <button type="button" className="cahier-cta" onClick={advance}>{isLast ? L.t('voirResultat') : L.t('exerciceSuivant')}</button>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="test-help test-help--ok">
          <p className="test-help__head test-help__head--ok">✅ {L.t('goodAnswer')} {firstTryWrong ? '' : L.t('felicitations')}</p>
          <p className="test-help__stars">⭐ {L.t('etoilesGagnees')} <strong>+{starsEarned}</strong></p>
          {ex.improvementTip && <p className="test-help__tip">{L.t('conseil')} : {ex.improvementTip}</p>}
          <button type="button" className="cahier-cta" onClick={advance}>{isLast ? L.t('voirResultat') : L.t('exerciceSuivant')}</button>
        </div>
      )}
    </div>
  );
}
