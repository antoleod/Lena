import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getActivityQuestionStates,
  recordQuestionOutcome
} from '../../services/storage/progressStore.js';

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
  if (entry.correctOptionIds?.length) {
    return entry.correctOptionIds.map((value) => String(value));
  }
  if (entry.acceptedValues?.length) {
    return entry.acceptedValues.map((value) => String(value));
  }
  if (entry.answer !== undefined && entry.answer !== null) {
    return [String(entry.answer)];
  }
  return [];
}

function buildQueue(activity) {
  const sections = activity.sections || [
    {
      id: 'practice',
      title: 'Practice',
      kind: 'practice',
      lessons: activity.lessons || []
    }
  ];

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
  return {
    id: `option-${index + 1}`,
    value,
    label: value,
    description: '',
    media: null
  };
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

  return {
    id: `context-${index + 1}`,
    kind: 'text',
    text: String(slot),
    src: '',
    alt: '',
    caption: ''
  };
}

export default function MultipleChoiceActivity({ activity, progress, onComplete }) {
  const { t } = useLocale();
  const initialQuestionStates = useMemo(() => getActivityQuestionStates(activity.id), [activity.id]);
  const [queue, setQueue] = useState(() => buildQueue(activity));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const pendingAdvanceRef = useRef(null);
  const timerRef = useRef(null);

  const current = queue[currentIndex];
  const total = queue.length;
  const progressPercent = total ? Math.round((currentIndex / total) * 100) : 0;
  const currentOptions = useMemo(
    () => (current?.choices || []).map((choice, index) => normalizeOption(choice, index)),
    [current]
  );
  const currentContextSlots = useMemo(
    () => {
      const rawContext = current?.contextSlots?.length ? current.contextSlots : current?.context || [];
      return rawContext.map((slot, index) => normalizeContextSlot(slot, index));
    },
    [current]
  );
  const correctOptionId = useMemo(() => {
    if (!current) {
      return '';
    }
    if (current.correctOptionIds?.length) {
      return current.correctOptionIds[0];
    }
    const correctValues = resolveCorrectValues(current);
    return currentOptions.find((option) => correctValues.includes(option.value) || correctValues.includes(option.id))?.id || '';
  }, [current, currentOptions]);

  useEffect(() => () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Enter' || !pendingAdvanceRef.current) {
        return;
      }
      event.preventDefault();
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
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
    onComplete({
      completed: true,
      lastScore: nextScore,
      bestScore: Math.max(progress.bestScore || 0, nextScore),
      totalQuestions: finalQueueLength
    });
  }

  function goNext(nextScore, nextQueue) {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= nextQueue.length) {
      finalize(nextScore, nextQueue.length);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelected('');
    setFeedback(null);
  }

  function handleChoiceClick(option) {
    if (feedback) return;

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
          {
            id: current.sectionId,
            title: current.sectionTitle,
            kind: current.sectionKind
          },
          current,
          currentIndex,
          `${current.queueKey}-repeat-${questionState.failures}-${Date.now()}`
        ),
        explanation: current.explanation,
        context: current.context
      });
    }

    setQueue(nextQueue);
    setSelected(option.id);
    setScore(nextScore);
    setFeedback({
      isCorrect,
      explanation: !isCorrect && questionState.failures >= 2
        ? current.explanation
        : isCorrect
          ? current.explanation
          : activity.hints?.[0],
      status: questionState.status
    });

    pendingAdvanceRef.current = {
      score: nextScore,
      queue: nextQueue
    };
    timerRef.current = window.setTimeout(() => {
      pendingAdvanceRef.current = null;
      goNext(nextScore, nextQueue);
    }, isCorrect ? 700 : 1100);
  }

  if (completed) {
    return (
      <section className="engine-card engine-card--compact">
        <div className="completion-banner completion-banner--compact celebration-shell">
          <div className="celebration-stars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="pill">{t('activityDone')}</span>
          <h3>{activity.title}</h3>
          <p>{score}/{queue.length}</p>
        </div>
      </section>
    );
  }

  const currentState = initialQuestionStates[current.sourceId]?.status || 'unseen';

  return (
    <section className="engine-card engine-card--compact">
      <div className="activity-rail">
        <span className="activity-rail__tag">{current.sectionTitle}</span>
        <div className="activity-rail__progress">
          <i style={{ width: `${Math.max(progressPercent, 4)}%` }}></i>
        </div>
        <strong>{currentIndex + 1}/{total}</strong>
      </div>

      {currentContextSlots.length ? (
        <div className="question-context question-context--compact">
          {currentContextSlots.map((slot) => (
            <div key={slot.id} className={`question-context__slot question-context__slot--${slot.kind}`}>
              {slot.kind === 'image' && slot.src ? (
                <>
                  <img src={slot.src} alt={slot.alt || ''} />
                  {slot.caption ? <small>{slot.caption}</small> : null}
                </>
              ) : slot.kind === 'audio' && slot.src ? (
                <audio controls preload="none">
                  <source src={slot.src} />
                </audio>
              ) : (
                <p>{slot.text}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

      <p className="engine-prompt engine-prompt--compact">{current.prompt}</p>
      <div className={`choice-grid choice-grid--compact${currentOptions.some((option) => option.media?.src) ? ' choice-grid--media' : ''}`}>
        {currentOptions.map((option) => {
          const isSelected = selected === option.id;
          const isAnswer = option.id === correctOptionId;
          const resultClass = feedback
            ? isAnswer
              ? ' is-correct'
              : isSelected
                ? ' is-wrong'
                : ''
            : '';

          return (
            <button
              key={option.id}
              className={`choice-button choice-button--compact${option.media?.src ? ' choice-button--visual' : ''}${isSelected ? ' is-selected' : ''}${resultClass}`}
              disabled={Boolean(feedback)}
              type="button"
              onClick={() => handleChoiceClick(option)}
            >
              <span className="choice-button__inner">
                {option.media?.src ? (
                  <span className="choice-button__media">
                    <img src={option.media.src} alt={option.media.alt || option.label} />
                  </span>
                ) : null}
                <span className="choice-button__text">
                  <strong>{option.label}</strong>
                  {option.description ? <small>{option.description}</small> : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={`feedback-strip${feedback ? ` is-${feedback.isCorrect ? 'success' : 'warning'}` : ''}`}>
        {feedback ? (
          <>
            <strong>{feedback.isCorrect ? t('correctAnswer') : t('reviewTogether')}</strong>
            <span>{feedback.explanation}</span>
          </>
        ) : (
          <>
            <strong>{t('hint')}</strong>
            <span>{currentState === 'failed' ? current.explanation : activity.hints?.[0]}</span>
          </>
        )}
      </div>
    </section>
  );
}
