import { useMemo, useState } from 'react';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getProfile } from '../../../services/storage/profileStore.js';
import { recordQuestionOutcome } from '../../../services/storage/progressStore.js';

const FEEDBACK_SUCCESS = [
  'Bravo 🌟',
  'Super {prenom} !',
  'Tu y arrives 🌱'
];
const FEEDBACK_RETRY = [
  'Très bien essayé',
  'On regarde encore ensemble',
  'Encore une, en douceur'
];

function buildQueue(activity) {
  const sections = activity.sections || [{ id: 'practice', title: 'Practice', kind: 'practice', lessons: activity.lessons || [] }];
  return sections.flatMap((section) =>
    (section.lessons || []).map((lesson, index) => ({
      ...lesson,
      sourceId: lesson.id || `${section.id}-${index}-${lesson.prompt}`,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionKind: section.kind
    }))
  );
}

function pickMessage(messages, prenom) {
  const raw = messages[Math.floor(Math.random() * messages.length)] || messages[0] || '';
  return prenom ? raw.replace('{prenom}', prenom) : raw.replace('{prenom}', '');
}

export default function TraceActivity({ activity, progress, onComplete }) {
  const { t } = useLocale();
  const prenom = getProfile().name || '';
  const queue = useMemo(() => buildQueue(activity), [activity]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const current = queue[currentIndex];
  const total = queue.length || 1;

  function finish(finalScore) {
    onComplete({
      completed: true,
      lastScore: finalScore,
      bestScore: Math.max(progress.bestScore || 0, finalScore),
      totalQuestions: queue.length
    });
  }

  function goNext(nextScoreOverride) {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      finish(typeof nextScoreOverride === 'number' ? nextScoreOverride : score);
      return;
    }
    setCurrentIndex(nextIndex);
    setFeedback(null);
  }

  function handlePick(choiceValue) {
    if (!current) return;
    const correct = String(current.answer ?? '') === String(choiceValue ?? '');
    recordQuestionOutcome(activity.id, current.sourceId, correct);

    if (correct) {
      const msg = pickMessage(FEEDBACK_SUCCESS, prenom);
      setFeedback({ isCorrect: true, msg, explanation: current.explanation || '' });
      const nextScore = score + 1;
      setScore(nextScore);
      window.setTimeout(() => goNext(nextScore), 550);
      return;
    }

    const msg = pickMessage(FEEDBACK_RETRY, prenom);
    setFeedback({ isCorrect: false, msg, explanation: current.explanation || '' });
  }

  if (!current) {
    return (
      <section className="engine-card engine-card--compact">
        <p>{t('noQuestion')}</p>
      </section>
    );
  }

  return (
    <section className="engine-card engine-card--compact">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div>
          <small style={{ opacity: 0.85 }}>{current.sectionTitle}</small>
          <h3 style={{ margin: '6px 0 0' }}>{activity.title}</h3>
        </div>
        <strong>{currentIndex + 1}/{total}</strong>
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: '1.15rem', margin: '0 0 10px' }}>{current.prompt}</p>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
          {feedback?.isCorrect ? '' : 'Choisis calmement et réessaie si besoin.'}
        </p>
      </div>

      <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
        {(current.choices || []).map((choice, idx) => {
          const value = typeof choice === 'object' ? (choice.value ?? choice.label ?? choice.id) : choice;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePick(value)}
              style={{
                minHeight: 48,
                padding: '12px 14px',
                borderRadius: 16,
                border: '1px solid var(--border)',
                background: 'var(--panel)'
              }}
              data-testid={`trace-choice-${idx}`}
            >
              <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.05rem' }}>
                {typeof choice === 'object' ? (choice.label ?? choice.value ?? choice.id) : String(choice)}
              </span>
            </button>
          );
        })}
      </div>

      {feedback ? (
        <div
          style={{
            marginTop: 14,
            padding: '14px 16px',
            borderRadius: 18,
            border: `1px solid ${feedback.isCorrect ? 'rgba(53, 196, 144, 0.35)' : 'rgba(255, 207, 116, 0.35)'}`,
            background: feedback.isCorrect ? 'rgba(53, 196, 144, 0.12)' : 'rgba(255, 207, 116, 0.15)',
            animation: 'rise-in 0.25s ease both'
          }}
          role="status"
          aria-live="polite"
        >
          <strong>{feedback.msg}</strong>
          {feedback.explanation ? (
            <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: '0.95rem' }}>{feedback.explanation}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

