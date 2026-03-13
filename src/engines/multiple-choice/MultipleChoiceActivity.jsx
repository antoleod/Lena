import { useMemo, useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getActivityQuestionStates,
  recordQuestionOutcome
} from '../../services/storage/progressStore.js';

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
    (section.lessons || []).map((lesson, index) => ({
      ...lesson,
      sourceId: lesson.id || `${section.id}-${index}-${lesson.prompt}`,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionKind: section.kind,
      queueKey: `${section.id}-${lesson.id || index}-${index}`
    }))
  );
}

function getFutureRepeats(queue, currentIndex, sourceId) {
  return queue.slice(currentIndex + 1).filter((entry) => entry.sourceId === sourceId).length;
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

  const current = queue[currentIndex];
  const total = queue.length;
  const progressPercent = total ? Math.round((currentIndex / total) * 100) : 0;

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

  function handleChoiceClick(choice) {
    if (feedback) return;

    const isCorrect = choice === current.answer;
    const questionState = recordQuestionOutcome(activity.id, current.sourceId, isCorrect);
    const nextScore = score + (isCorrect ? 1 : 0);
    const nextQueue = [...queue];
    const futureRepeats = getFutureRepeats(nextQueue, currentIndex, current.sourceId);

    if (!isCorrect && futureRepeats < 2) {
      const insertAt = Math.min(nextQueue.length, currentIndex + 2 + questionState.failures);
      nextQueue.splice(insertAt, 0, {
        ...current,
        queueKey: `${current.queueKey}-repeat-${questionState.failures}-${Date.now()}`
      });
    }

    setQueue(nextQueue);
    setSelected(choice);
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

    window.setTimeout(() => {
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

      {current.context?.length ? (
        <div className="question-context question-context--compact">
          {current.context.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      <p className="engine-prompt engine-prompt--compact">{current.prompt}</p>
      <div className="choice-grid choice-grid--compact">
        {current.choices.map((choice) => {
          const isSelected = selected === choice;
          const isAnswer = choice === current.answer;
          const resultClass = feedback
            ? isAnswer
              ? ' is-correct'
              : isSelected
                ? ' is-wrong'
                : ''
            : '';

          return (
            <button
              key={choice}
              className={`choice-button choice-button--compact${isSelected ? ' is-selected' : ''}${resultClass}`}
              disabled={Boolean(feedback)}
              type="button"
              onClick={() => handleChoiceClick(choice)}
            >
              {choice}
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
