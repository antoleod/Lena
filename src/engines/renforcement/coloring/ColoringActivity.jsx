import { useMemo, useState } from 'react';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getProfile } from '../../../services/storage/profileStore.js';
import { recordQuestionOutcome } from '../../../services/storage/progressStore.js';
import { recordPlayedExercise } from '../../../services/learning/recordPlayedExercise.js';
import { useSpeechPlayer } from '../../../shared/hooks/useSpeechPlayer.js';

const FEEDBACK_SUCCESS = [
  'Bravo 🌟',
  'Super {prenom} !',
  'Tu progresses 🌱'
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
  const list = messages.slice();
  const raw = list[Math.floor(Math.random() * list.length)] || messages[0] || '';
  return prenom ? raw.replace('{prenom}', prenom) : raw.replace('{prenom}', '');
}

export default function ColoringActivity({ activity, progress, onComplete, onQuestionChange }) {
  const { t } = useLocale();
  const prenom = getProfile().name || '';
  const { supported: speechSupported, speaking, speak, stop } = useSpeechPlayer(activity.language || 'fr');
  const queue = useMemo(() => buildQueue(activity), [activity]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const total = queue.length || 1;
  const current = queue[currentIndex];

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
    if (onQuestionChange) onQuestionChange(nextIndex);
  }

  function handlePick(choiceValue) {
    if (!current) return;
    const correct = String(current.answer ?? '') === String(choiceValue ?? '');
    const state = recordQuestionOutcome(activity.id, current.sourceId, correct);
    recordPlayedExercise({
      exerciseId: activity.id, sourceModule: 'renforcement-coloring',
      subject: activity.subject ?? 'renforcement', questionType: 'coloring',
      question: current.prompt ?? current.question ?? null,
      expectedAnswer: current.answer ?? null, childAnswer: choiceValue ?? null,
      isCorrect: correct, attempts: state.attempts,
    });

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
    <section className="engine-card engine-card--compact engine-card--arcade">
      {/* Progress rail */}
      <div className="mc-progress-rail">
        <span className="mc-progress-rail__label">{current.sectionTitle}</span>
        <div className="mc-progress-rail__bar">
          <div className="mc-progress-rail__fill" style={{ width: `${Math.max((currentIndex / total) * 100, 3)}%` }} />
        </div>
        <strong className="mc-progress-rail__counter">{currentIndex + 1}/{total}</strong>
      </div>

      {/* Question prompt + speak button */}
      <div className="mc-prompt-area">
        <p className="mc-prompt">{current.prompt}</p>
        {speechSupported ? (
          <button
            type="button"
            className={`mc-speak-btn${speaking ? ' is-playing' : ''}`}
            onClick={() => (speaking ? stop() : speak(`${current.prompt}`))}
            aria-label={speaking ? 'Arrêter la lecture' : 'Lire la consigne'}
          >
            <span aria-hidden="true">{speaking ? '■' : '🔊'}</span>
          </button>
        ) : null}
      </div>

      {/* Choices */}
      <div className="mc-choices mc-choices--compact">
        {(current.choices || []).map((choice, idx) => {
          const value = typeof choice === 'object' ? (choice.value ?? choice.label ?? choice.id) : choice;
          const label = typeof choice === 'object' ? (choice.label ?? choice.value ?? choice.id) : String(choice);
          return (
            <button
              key={idx}
              type="button"
              className="mc-choice mc-choice--compact mc-choice--row"
              onClick={() => handlePick(value)}
              data-testid={`coloring-choice-${idx}`}
            >
              <span className="mc-choice__letter" aria-hidden="true">{['A', 'B', 'C', 'D'][idx] || ''}</span>
              <span className="mc-choice__text"><strong>{label}</strong></span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback ? (
        <div
          className={`mc-feedback mc-feedback--${feedback.isCorrect ? 'correct' : 'wrong'}`}
          role="status"
          aria-live="polite"
        >
          <div className="mc-feedback__top">
            <span className="mc-feedback__icon" aria-hidden="true">{feedback.isCorrect ? '✅' : '❌'}</span>
            <strong className="mc-feedback__msg">{feedback.msg}</strong>
          </div>
          {feedback.explanation ? (
            <p className="mc-feedback__detail">{feedback.explanation}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

