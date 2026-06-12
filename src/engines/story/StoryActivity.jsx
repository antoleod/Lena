import { useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useSpeechPlayer } from '../../shared/hooks/useSpeechPlayer.js';

export default function StoryActivity({ activity, progress, onComplete, onQuestionChange }) {
  const { t } = useLocale();
  const { supported: speechSupported, speaking, speak, stop } = useSpeechPlayer(activity.language || 'fr');
  const stories = activity.stories || [];
  const [storyIndex, setStoryIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const globalQuestionIndex = stories.slice(0, storyIndex).reduce((acc, s) => acc + (s.quiz?.length || 0), 0) + quizIndex;

  const story = stories[storyIndex];
  const question = story?.quiz?.[quizIndex];
  const storySpeechText = story ? [...story.text, question?.prompt].filter(Boolean).join('. ') : '';

  if (!story) {
    return <div className="engine-card">{t('noStory')}</div>;
  }

  function chooseAnswer() {
    if (!selected || !question) return;

    const nextScore = selected === question.answer ? score + 1 : score;
    const isLastQuestion = quizIndex === story.quiz.length - 1;
    const isLastStory = storyIndex === stories.length - 1;

    if (isLastQuestion && isLastStory) {
      setScore(nextScore);
      setFinished(true);
      onComplete({
        completed: true,
        lastScore: nextScore,
        bestScore: Math.max(progress.bestScore || 0, nextScore)
      });
      return;
    }

    if (isLastQuestion) {
      setStoryIndex((value) => value + 1);
      setQuizIndex(0);
      setSelected('');
      setScore(nextScore);
      if (onQuestionChange) onQuestionChange(globalQuestionIndex + 1);
      return;
    }

    setQuizIndex((value) => value + 1);
    setSelected('');
    setScore(nextScore);
    if (onQuestionChange) onQuestionChange(globalQuestionIndex + 1);
  }

  if (finished) {
    return (
      <section className="engine-card">
        <div className="completion-banner celebration-shell">
          <div className="celebration-stars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="pill">{t('readingDone')}</span>
          <h3>{activity.title}</h3>
          <p>{t('scoreSaved')}: {Math.max(progress.bestScore || 0, score)}.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="engine-card engine-card--compact engine-card--arcade">
      {/* Progress rail */}
      <div className="mc-progress-rail">
        <span className="mc-progress-rail__label">{t('story')} {storyIndex + 1} / {stories.length}</span>
        <div className="mc-progress-rail__bar">
          <div className="mc-progress-rail__fill" style={{ width: `${Math.max((globalQuestionIndex / Math.max((stories.reduce((a, s) => a + (s.quiz?.length || 0), 0)), 1)) * 100, 3)}%` }} />
        </div>
        <strong className="mc-progress-rail__counter">{story.theme}</strong>
      </div>

      {/* Story title + read button */}
      <div className="mc-prompt-area">
        <p className="mc-prompt">{story.title}</p>
        {speechSupported ? (
          <button
            type="button"
            className={`mc-speak-btn${speaking ? ' is-playing' : ''}`}
            onClick={() => (speaking ? stop() : speak(storySpeechText))}
            data-testid="play-question"
            aria-label={speaking ? 'Arrêter la lecture' : 'Lire l\'histoire'}
          >
            <span aria-hidden="true">{speaking ? '■' : '🔊'}</span>
          </button>
        ) : null}
      </div>

      {/* Story body */}
      <div className="story-copy">
        {story.text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {question ? (
        <>
          {/* Question prompt */}
          <div className="mc-prompt-area" style={{ marginTop: 8 }}>
            <p className="mc-prompt">{question.prompt}</p>
          </div>

          {/* Choices */}
          <div className="mc-choices mc-choices--compact">
            {question.choices.map((choice, i) => (
              <button
                key={choice}
                className={`mc-choice mc-choice--compact mc-choice--row${selected === choice ? ' mc-choice--selected' : ''}`}
                type="button"
                onClick={() => setSelected(choice)}
              >
                <span className="mc-choice__letter" aria-hidden="true">{['A', 'B', 'C', 'D'][i] || ''}</span>
                <span className="mc-choice__text"><strong>{choice}</strong></span>
              </button>
            ))}
          </div>

          <div className="engine-actions">
            <button className="primary-action" type="button" disabled={!selected} onClick={chooseAnswer}>
              <span className="button-icon" aria-hidden="true">✓</span>
              <span>{t('validateAnswer')}</span>
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
