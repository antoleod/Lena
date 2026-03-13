import { useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

export default function MultipleChoiceActivity({ activity, progress, onComplete }) {
  const { t } = useLocale();
  const sections = activity.sections || [
    {
      id: 'practice',
      title: 'Pratique',
      kind: 'practice',
      lessons: activity.lessons || []
    }
  ];
  const [sectionIndex, setSectionIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showSectionIntro, setShowSectionIntro] = useState(false);

  const currentSection = sections[sectionIndex];
  const lessons = currentSection?.lessons || [];
  const current = lessons[index];
  const total = lessons.length;
  const totalQuestions = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const answeredBefore = sections
    .slice(0, sectionIndex)
    .reduce((sum, section) => sum + section.lessons.length, 0);
  const progressPercent = totalQuestions
    ? Math.round(((answeredBefore + index) / totalQuestions) * 100)
    : 0;

  if (!current) {
    return <div className="engine-card">{t('noQuestion')}</div>;
  }

  function validate() {
    if (!selected) return;
    setShowResult(true);
  }

  function next() {
    const computedScore = score + (selected === current.answer ? 1 : 0);
    const isLast = index === total - 1;
    const isLastSection = sectionIndex === sections.length - 1;

    if (isLast && isLastSection) {
      setFinalScore(computedScore);
      setCompleted(true);
      onComplete({
        completed: true,
        lastScore: computedScore,
        bestScore: Math.max(progress.bestScore || 0, computedScore)
      });
      return;
    }

    if (isLast) {
      setSectionIndex((value) => value + 1);
      setIndex(0);
      setShowSectionIntro(true);
    } else {
      setIndex((value) => value + 1);
    }
    setScore(computedScore);
    setSelected('');
    setShowResult(false);
  }

  if (completed) {
    return (
      <section className="engine-card">
        <div className="completion-banner celebration-shell">
          <div className="celebration-stars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="pill">{t('activityDone')}</span>
          <h3>{activity.title}</h3>
          <p>{t('scoreSaved')}: {Math.max(progress.bestScore || 0, finalScore)}/{totalQuestions}.</p>
        </div>
      </section>
    );
  }

  if (showSectionIntro && currentSection) {
    return (
      <section className="engine-card">
        <div className="completion-banner is-magical celebration-shell">
          <span className="pill">
            {currentSection.kind === 'exam' ? t('miniExam') : t('newLevel')}
          </span>
          <h3>{currentSection.title}</h3>
          <p>{currentSection.description || t('continueStep')}</p>
          <button className="primary-action" type="button" onClick={() => setShowSectionIntro(false)}>
            {t('start')}
          </button>
        </div>
      </section>
    );
  }

  const isCorrect = selected === current.answer;

  return (
    <section className="engine-card engine-card--floating">
      <div className="engine-progress">
        <div>
          <span className="eyebrow">{currentSection.title}</span>
          <h3>{activity.title}</h3>
        </div>
        <strong>{progressPercent}%</strong>
      </div>
      <div className="stage-progress">
        <span>{t('exercise')} {index + 1} / {total}</span>
        <span>{currentSection.kind === 'exam' ? t('examMode') : t('practiceMode')}</span>
      </div>
      {current.context?.length ? (
        <div className="question-context">
          {current.context.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
      <p className="engine-prompt">{current.prompt}</p>
      <div className="choice-grid">
        {current.choices.map((choice) => (
          <button
            key={choice}
            className={`choice-button${selected === choice ? ' is-selected' : ''}`}
            disabled={showResult}
            type="button"
            onClick={() => setSelected(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {showResult ? (
        <div className={`feedback-panel${isCorrect ? ' is-success celebration-shell' : ' is-warning'}`}>
          {isCorrect ? (
            <div className="celebration-stars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : null}
          <strong>{isCorrect ? t('correctAnswer') : t('reviewTogether')}</strong>
          <p>{current.explanation}</p>
        </div>
      ) : (
        <p className="hint-copy">{t('hint')}: {activity.hints?.[0]}</p>
      )}
      <div className="engine-actions">
        {!showResult ? (
          <button className="primary-action" type="button" onClick={validate} disabled={!selected}>
            {currentSection.kind === 'exam' ? t('answer') : t('validate')}
          </button>
        ) : (
          <button className="primary-action" type="button" onClick={next}>
            {index === total - 1
              ? (sectionIndex === sections.length - 1 ? t('finish') : t('continue'))
              : t('nextQuestion')}
          </button>
        )}
      </div>
    </section>
  );
}
