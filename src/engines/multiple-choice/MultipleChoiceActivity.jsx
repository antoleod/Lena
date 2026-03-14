import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getActivityQuestionStates,
  recordQuestionOutcome
} from '../../services/storage/progressStore.js';
import { useSpeechPlayer } from '../../shared/hooks/useSpeechPlayer.js';
import { getProfile } from '../../services/storage/profileStore.js';

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

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MultipleChoiceActivity({ activity, progress, onComplete }) {
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
  }

  function handleChoiceClick(option) {
    if (feedback || isLocked) return;
    const correctValues = resolveCorrectValues(current);
    const isCorrect = option.id === correctOptionId || correctValues.includes(option.value) || correctValues.includes(option.id);
    const questionState = recordQuestionOutcome(activity.id, current.sourceId, isCorrect);
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

    const msg = isCorrect ? randomFrom(CORRECT_MESSAGES) : randomFrom(WRONG_MESSAGES);
    setQueue(nextQueue);
    setSelected(option.id);
    setScore(nextScore);
    const shouldShowFeedback = isCorrect
      ? feedbackPreferences.showCorrect !== false
      : feedbackPreferences.showWrong !== false;
    const feedbackDuration = isCorrect
      ? Number(feedbackPreferences.correctDurationMs || 1000)
      : Number(feedbackPreferences.wrongDurationMs || 2000);

    setFeedbackMsg(msg);
    setIsLocked(true);
    setFeedback(shouldShowFeedback ? {
      isCorrect,
      explanation: !isCorrect && questionState.failures >= 2
        ? current.explanation
        : isCorrect
          ? current.explanation
          : activity.hints?.[0],
      status: questionState.status
    } : null);

    pendingAdvanceRef.current = { score: nextScore, queue: nextQueue };
    timerRef.current = window.setTimeout(() => {
      pendingAdvanceRef.current = null;
      goNext(nextScore, nextQueue);
    }, shouldShowFeedback ? feedbackDuration : 120);
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

  return (
    <section className="engine-card engine-card--compact">
      {/* Progress rail */}
      <div className="mc-progress-rail">
        <span className="mc-progress-rail__label">{current.sectionTitle}</span>
        <div className="mc-progress-rail__bar">
          <div className="mc-progress-rail__fill" style={{ width: `${Math.max(progressPercent, 3)}%` }} />
        </div>
        <strong className="mc-progress-rail__counter">{currentIndex + 1}/{total}</strong>
      </div>

      {/* Context slots */}
      {currentContextSlots.length > 0 && (
        <div className="mc-context">
          {currentContextSlots.map((slot) => (
            <div key={slot.id} className={`mc-context__slot mc-context__slot--${slot.kind}`}>
              {slot.kind === 'image' && slot.src ? (
                <>
                  <img src={slot.src} alt={slot.alt || ''} className="mc-context__img" />
                  {slot.caption && <small className="mc-context__caption">{slot.caption}</small>}
                </>
              ) : slot.kind === 'audio' && slot.src ? (
                <audio controls preload="none"><source src={slot.src} /></audio>
              ) : (
                <p className="mc-context__text">{slot.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Question prompt */}
      <div className="mc-prompt-area">
        <p className="mc-prompt">{current.prompt}</p>
        {speechSupported && (
          <button
            type="button"
            className={`mc-speak-btn${speaking ? ' is-playing' : ''}`}
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
        {currentOptions.map((option) => {
          const isSelected = selected === option.id;
          const isAnswer = option.id === correctOptionId;
          const stateClass = feedback
            ? isAnswer ? ' mc-choice--correct' : isSelected ? ' mc-choice--wrong' : ''
            : isSelected ? ' mc-choice--selected' : '';

          return (
            <button
              key={option.id}
              className={`mc-choice${hasMedia ? ' mc-choice--visual' : ''}${compactChoices ? ' mc-choice--compact' : ''}${stateClass}`}
              disabled={Boolean(feedback) || isLocked}
              type="button"
              onClick={() => handleChoiceClick(option)}
              data-testid={`choice-${option.id}`}
            >
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
              {feedback.isCorrect ? '✅' : '💡'}
            </span>
            <strong className="mc-feedback__msg">{feedbackMsg}</strong>
          </div>
          {feedback.explanation && (
            <p className="mc-feedback__detail">{feedback.explanation}</p>
          )}
        </div>
      )}
    </section>
  );
}
