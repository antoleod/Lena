import { useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

export default function StoryActivity({ activity, progress, onComplete }) {
  const { t } = useLocale();
  const stories = activity.stories || [];
  const [storyIndex, setStoryIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const story = stories[storyIndex];
  const question = story?.quiz?.[quizIndex];

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
      return;
    }

    setQuizIndex((value) => value + 1);
    setSelected('');
    setScore(nextScore);
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
    <section className="engine-card story-card engine-card--floating">
      <div className="engine-progress">
        <div>
          <span className="eyebrow">{t('story')} {storyIndex + 1} / {stories.length}</span>
          <h3>{story.title}</h3>
        </div>
        <strong>{story.theme}</strong>
      </div>
      <div className="story-copy">
        {story.text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {question ? (
        <>
          <div className="story-question">
            <strong>{question.prompt}</strong>
          </div>
          <div className="choice-grid">
            {question.choices.map((choice) => (
              <button
                key={choice}
                className={`choice-button${selected === choice ? ' is-selected' : ''}`}
                type="button"
                onClick={() => setSelected(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
          <div className="engine-actions">
            <button className="primary-action" type="button" disabled={!selected} onClick={chooseAnswer}>
              <span className="button-icon" aria-hidden="true">✅</span>
              <span>{t('validateAnswer')}</span>
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
