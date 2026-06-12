import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getActivityQuestionStates,
  recordQuestionOutcome
} from '../../services/storage/progressStore.js';
import { recordPlayedExercise } from '../../services/learning/recordPlayedExercise.js';
import { useSpeechPlayer } from '../../shared/hooks/useSpeechPlayer.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { playCorrectSound, playWrongSound } from '../../services/sound/soundService.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';

const MASCOT_PAIR_SRC = assetUrl('assets/characters/mascot-pair.svg');


function shuffleChoices(choices = []) {
  const list = [...choices];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function createQueueEntry(section, lesson, index, queueKey) {
  return {
    ...lesson,
    choices: shuffleChoices(lesson.choices || []),
    sourceId: lesson.id || `${section.id}-${index}-${lesson.prompt}`,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionKind: section.kind,
    queueKey
  };
}

function resolveCorrectValues(entry) {
  if (entry.correctOptionIds?.length) return entry.correctOptionIds.map((value) => String(value));
  if (entry.acceptedValues?.length) return entry.acceptedValues.map((value) => String(value));
  if (entry.answer !== undefined && entry.answer !== null) return [String(entry.answer)];
  return [];
}

function buildQueue(activity) {
  const sections = activity.sections || [{ id: 'practice', title: 'Practice', kind: 'practice', lessons: activity.lessons || [] }];
  return sections.flatMap((section) =>
    (section.lessons || []).map((lesson, index) =>
      createQueueEntry(section, lesson, index, `${section.id}-${lesson.id || index}-${index}`)
    )
  );
}

function getFutureRepeats(queue, currentIndex, sourceId) {
  return queue.slice(currentIndex + 1).filter((entry) => entry.sourceId === sourceId).length;
}

function normalizeOption(choice, index) {
  if (choice && typeof choice === 'object') {
    return {
      id: choice.id || `option-${index + 1}`,
      value: String(choice.value ?? choice.label ?? choice.text ?? choice.id ?? index + 1),
      label: String(choice.label ?? choice.text ?? choice.value ?? ''),
      description: choice.description || '',
      media: choice.media || null
    };
  }
  const value = String(choice);
  return { id: `option-${index + 1}`, value, label: value, description: '', media: null };
}

function normalizeContextSlot(slot, index) {
  if (slot && typeof slot === 'object') {
    return {
      id: slot.id || `context-${index + 1}`,
      kind: slot.kind || (slot.src ? 'image' : 'text'),
      text: slot.text || '',
      src: slot.src || '',
      alt: slot.alt || '',
      caption: slot.caption || ''
    };
  }
  return { id: `context-${index + 1}`, kind: 'text', text: String(slot), src: '', alt: '', caption: '' };
}

// Positive feedback messages
const CORRECT_MESSAGES = [
  '¡Perfecto! 🌟', '¡Genial! 💪', '¡Muy bien! ✨', '¡Correcto! 🎉',
  '¡Excelente! 🏆', '¡Increíble! ⭐', '¡Fantástico! 🚀',
];
const WRONG_MESSAGES = [
  'Casi, intenta de nuevo', 'No pasa nada, sigue', '¡Tú puedes!', 'Inténtalo otra vez 💡',
];

// Renforcement: feedback 100% en francais et doux
const CORRECT_MESSAGES_FR = [
  'Bravo 🌟',
  'Super ! ✨',
  'Tu progresses 🌱',
  'Très bien ! 🎉'
];
const WRONG_MESSAGES_FR = [
  'Très bien essayé',
  'On regarde encore ensemble',
  'Tu y es presque',
  'Encore une, en douceur'
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MultipleChoiceActivity({ activity, progress, onComplete, onAnswerStateChange, onQuestionChange }) {
  const { t } = useLocale();

  const { supported: speechSupported, speaking, speak, stop } = useSpeechPlayer(activity.language || 'fr');
  const initialQuestionStates = useMemo(() => getActivityQuestionStates(activity.id), [activity.id]);
  const [queue, setQueue] = useState(() => buildQueue(activity));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const pendingAdvanceRef = useRef(null);
  const timerRef = useRef(null);
  // When the child started reading the current question — for responseTimeMs (Track 1).
  const questionStartRef = useRef(Date.now());
  const feedbackPreferences = getProfile().feedbackPreferences || {};

  const current = queue[currentIndex];
  const total = queue.length;
  const progressPercent = total ? Math.round((currentIndex / total) * 100) : 0;
  const currentOptions = useMemo(
    () => (current?.choices || []).map((choice, index) => normalizeOption(choice, index)),
    [current]
  );
  const currentContextSlots = useMemo(() => {
    const rawContext = current?.contextSlots?.length ? current.contextSlots : current?.context || [];
    return rawContext.map((slot, index) => normalizeContextSlot(slot, index));
  }, [current]);
  const correctOptionId = useMemo(() => {
    if (!current) return '';
    if (current.correctOptionIds?.length) return current.correctOptionIds[0];
    const correctValues = resolveCorrectValues(current);
    return currentOptions.find((option) => correctValues.includes(option.value) || correctValues.includes(option.id))?.id || '';
  }, [current, currentOptions]);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  // Reset the per-question timer whenever the displayed question changes.
  useEffect(() => { questionStartRef.current = Date.now(); }, [currentIndex]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Enter' || !pendingAdvanceRef.current) return;
      event.preventDefault();
      if (timerRef.current) window.clearTimeout(timerRef.current);
      const pending = pendingAdvanceRef.current;
      pendingAdvanceRef.current = null;
      goNext(pending.score, pending.queue);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, queue, score]);

  if (!current) {
    return <section className="engine-card engine-card--compact">{t('noQuestion')}</section>;
  }

  function finalize(nextScore, finalQueueLength) {
    setCompleted(true);
    onComplete({ completed: true, lastScore: nextScore, bestScore: Math.max(progress.bestScore || 0, nextScore), totalQuestions: finalQueueLength });
  }

  function goNext(nextScore, nextQueue) {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= nextQueue.length) { finalize(nextScore, nextQueue.length); return; }
    setCurrentIndex(nextIndex);
    setSelected('');
    setFeedback(null);
    setFeedbackMsg('');
    setIsLocked(false);
    if (onAnswerStateChange) {
      onAnswerStateChange('thinking');
    }
    if (onQuestionChange) onQuestionChange(nextIndex);
  }


  function handleChoiceClick(option) {
    if (feedback || isLocked) return;
    const correctValues = resolveCorrectValues(current);
    const isCorrect = option.id === correctOptionId || correctValues.includes(option.value) || correctValues.includes(option.id);
    const questionState = recordQuestionOutcome(activity.id, current.sourceId, isCorrect);

    // Track 1: record the real played exercise (rich, per-question flavor).
    recordPlayedExercise({
      exerciseId:     activity.id,
      sourceModule:   'multiple-choice',
      subject:        activity.subject ?? null,
      skill:          activity.skill ?? null,
      questionType:   current.kind ?? 'multiple-choice',
      question:       current.prompt ?? current.question ?? null,
      expectedAnswer: currentOptions.find((o) => o.id === correctOptionId)?.label ?? null,
      childAnswer:    option.label ?? option.value ?? option.id ?? null,
      isCorrect,
      responseTimeMs: Date.now() - questionStartRef.current,
      attempts:       questionState.attempts,
      generatedBy:    activity.generated ? 'generator' : 'static',
    });

    const nextScore = score + (isCorrect ? 1 : 0);
    const nextQueue = [...queue];
    const futureRepeats = getFutureRepeats(nextQueue, currentIndex, current.sourceId);

    if (!isCorrect && futureRepeats < 2) {
      const insertAt = Math.min(nextQueue.length, currentIndex + 2 + questionState.failures);
      nextQueue.splice(insertAt, 0, {
        ...createQueueEntry(
          { id: current.sectionId, title: current.sectionTitle, kind: current.sectionKind },
          current, currentIndex,
          `${current.queueKey}-repeat-${questionState.failures}-${Date.now()}`
        ),
        explanation: current.explanation,
        context: current.context
      });
    }

    const isRenforcement = activity?.subject === 'renforcement';
    const msg = isCorrect
      ? randomFrom(isRenforcement ? CORRECT_MESSAGES_FR : CORRECT_MESSAGES)
      : randomFrom(isRenforcement ? WRONG_MESSAGES_FR : WRONG_MESSAGES);
    setQueue(nextQueue);
    setSelected(option.id);
    setScore(nextScore);
    const shouldShowFeedback = isCorrect
      ? feedbackPreferences.showCorrect !== false
      : feedbackPreferences.showWrong !== false;
    const feedbackDuration = isCorrect
      ? Number(feedbackPreferences.correctDurationMs || 1500)
      : Number(feedbackPreferences.wrongDurationMs || 2500);

    if (isCorrect) {
      playCorrectSound();
      if (onAnswerStateChange) {
        onAnswerStateChange('correct');
      }
    } else {
      playWrongSound();
      if (onAnswerStateChange) {
        onAnswerStateChange('wrong');
      }
    }

    setFeedbackMsg(msg);
    setIsLocked(true);

    const correctLabel = currentOptions.find((o) => o.id === correctOptionId)?.label || '';
    setFeedback(shouldShowFeedback ? {
      isCorrect,
      correctLabel: isCorrect ? '' : correctLabel,
      explanation: isCorrect ? current.explanation : (current.explanation || activity.hints?.[0] || ''),
      status: questionState.status
    } : null);

    pendingAdvanceRef.current = { score: nextScore, queue: nextQueue };
    timerRef.current = window.setTimeout(() => {
      pendingAdvanceRef.current = null;
      goNext(nextScore, nextQueue);
    }, shouldShowFeedback ? feedbackDuration : 120);
  }

  function handleContinueClick() {
    if (!pendingAdvanceRef.current) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const pending = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    goNext(pending.score, pending.queue);
  }

  if (completed) {
    return (
      <section className="engine-card engine-card--compact">
        <div className="mc-complete">
          <span className="mc-complete__emoji" aria-hidden="true">🎉</span>
          <h3 className="mc-complete__title">{activity.title}</h3>
          <p className="mc-complete__score">{score}/{queue.length}</p>
        </div>
      </section>
    );
  }

  const currentState = initialQuestionStates[current.sourceId]?.status || 'unseen';
  const speechText = [current.prompt, ...currentContextSlots.filter((slot) => slot.kind === 'text' && slot.text).map((slot) => slot.text)].join('. ');
  const hasMedia = currentOptions.some((option) => option.media?.src);
  const compactChoices = hasMedia || currentOptions.every((option) => option.label.length <= 24 && !option.description);

  // Number-comparison gets a dedicated "arcade" hero: the two numbers being
  // compared, side by side, with the mascot duo cheering in the middle.
  const comparisonNumbers = (current.type === 'math_number_comparison')
    ? currentContextSlots.filter((slot) => slot.kind === 'text' && slot.text.trim()).map((slot) => slot.text.trim())
    : [];
  const isComparison = comparisonNumbers.length === 2;

  return (
    <section className={`engine-card engine-card--compact engine-card--arcade${isComparison ? ' engine-card--comparison' : ''}`}>
      {/* Progress rail */}
      <div className="mc-progress-rail">
        <span className="mc-progress-rail__label">{current.sectionTitle}</span>
        <div className="mc-progress-rail__bar">
          <div className="mc-progress-rail__fill" style={{ width: `${Math.max(progressPercent, 3)}%` }} />
        </div>
        <strong className="mc-progress-rail__counter">{currentIndex + 1}/{total}</strong>
      </div>

      {/* Comparison hero: number — mascot — number */}
      {isComparison && (
        <div className="mc-vs" aria-hidden="false">
          <span className="mc-vs__num mc-vs__num--a">{comparisonNumbers[0]}</span>
          <span className="mc-vs__mascot">
            <span className="mc-vs__bubble">Salut ! Apprenons ensemble.</span>
            <img src={MASCOT_PAIR_SRC} alt="" className="mc-vs__mascot-img" draggable="false" />
          </span>
          <span className="mc-vs__num mc-vs__num--b">{comparisonNumbers[1]}</span>
        </div>
      )}

      {/* Context slots */}
      {!isComparison && currentContextSlots.length > 0 && (
        <div className="mc-context">
          {currentContextSlots.map((slot) => (
            <div key={slot.id} className={`mc-context__slot mc-context__slot--${slot.kind}`}>
              {slot.kind === 'image' && slot.src ? (
                <>
                  <img src={slot.src} alt={slot.alt || ''} className="mc-context__img" />
                  {slot.caption && <small className="mc-context__caption">{slot.caption}</small>}
                </>
              ) : slot.kind === 'svg' && slot.markup ? (
                <div className="mc-context__svg" dangerouslySetInnerHTML={{ __html: slot.markup }} aria-label={slot.alt || ''} />
              ) : slot.kind === 'audio' && slot.src ? (
                <audio controls preload="none"><source src={slot.src} /></audio>
              ) : (
                <p className="mc-context__text">{slot.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Divider between context and question */}
      {!isComparison && currentContextSlots.length > 0 && (
        <hr className="mc-context-divider" />
      )}

      {/* Question prompt */}
      <div className="mc-prompt-area">
        <p className="mc-prompt">{current.prompt}</p>
        {speechSupported && (
          <button
            type="button"
            className={`mc-speak-btn${speaking ? ' is-playing' : ''}`}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => speaking ? stop() : speak(speechText)}
            data-testid="play-question"
            aria-label={speaking ? 'Detener lectura' : 'Leer pregunta'}
          >
            <span aria-hidden="true">{speaking ? '■' : '🔊'}</span>
          </button>
        )}
      </div>

      {/* Hint strip */}
      {!feedback && currentState === 'failed' && current.explanation && (
        <div className="mc-hint">
          <span aria-hidden="true">💡</span>
          <span>{current.explanation}</span>
        </div>
      )}

      {/* Choices */}
      <div className={`mc-choices${hasMedia ? ' mc-choices--media' : ''}${compactChoices ? ' mc-choices--compact' : ''}`}>
        {currentOptions.map((option, i) => {
          const isSelected = selected === option.id;
          const isAnswer = option.id === correctOptionId;
          const stateClass = feedback
            ? isAnswer ? ' mc-choice--correct' : isSelected ? ' mc-choice--wrong' : ''
            : isSelected ? ' mc-choice--selected' : '';
          const rowClass = !hasMedia ? ' mc-choice--row' : '';

          return (
            <button
              key={option.id}
              className={`mc-choice${hasMedia ? ' mc-choice--visual' : ''}${compactChoices ? ' mc-choice--compact' : ''}${rowClass}${stateClass}`}
              disabled={Boolean(feedback) || isLocked}
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => handleChoiceClick(option)}
              data-testid={`choice-${option.id}`}
            >
              {!hasMedia && (
                <span className="mc-choice__letter" aria-hidden="true">
                  {['A', 'B', 'C', 'D'][i] || ''}
                </span>
              )}
              {option.media?.src && (
                <span className="mc-choice__media">
                  <img src={option.media.src} alt={option.media.alt || option.label} />
                </span>
              )}
              <span className="mc-choice__text">
                <strong>{option.label}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
              {feedback && isAnswer && <span className="mc-choice__check" aria-hidden="true">✓</span>}
              {feedback && isSelected && !isAnswer && <span className="mc-choice__check" aria-hidden="true">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback strip */}
      {feedback && (
        <div className={`mc-feedback mc-feedback--${feedback.isCorrect ? 'correct' : 'wrong'}`}>
          <div className="mc-feedback__top">
            <span className="mc-feedback__icon" aria-hidden="true">
              {feedback.isCorrect ? '✅' : '❌'}
            </span>
            <strong className="mc-feedback__msg">{feedbackMsg}</strong>
            <button
              type="button"
              className="mc-feedback__continue"
              onPointerDown={(e) => e.preventDefault()}
              onClick={handleContinueClick}
              aria-label="Continuer"
            >
              ▶
            </button>
          </div>
          {!feedback.isCorrect && feedback.correctLabel && (
            <div className="mc-feedback__correct-answer">
              <span className="mc-feedback__correct-label">Bonne réponse :</span>
              <span className="mc-feedback__correct-value">{feedback.correctLabel}</span>
            </div>
          )}
          {feedback.explanation && (
            <p className="mc-feedback__detail">{feedback.explanation}</p>
          )}
        </div>
      )}
    </section>
  );
}
