import { useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

function countValue(counts) {
  return counts.tens * 10 + counts.ones;
}

export default function BaseTenActivity({ activity, progress, onComplete }) {
  const { t } = useLocale();
  const [levelIndex, setLevelIndex] = useState(0);
  const [counts, setCounts] = useState({ tens: 0, ones: 0 });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState({ text: '', tone: 'success' });
  const [completed, setCompleted] = useState(false);

  const level = activity.levels?.[levelIndex];

  if (!level && !completed) {
    return <div className="engine-card">{t('noLevel')}</div>;
  }

  function update(next) {
    setCounts((current) => ({ ...current, ...next }));
    setMessage({ text: '', tone: 'success' });
  }

  function check() {
    const currentValue = countValue(counts);

    if (currentValue !== level.target) {
      setMessage({ text: `${t('buildNumber')} ${currentValue}.`, tone: 'warning' });
      return;
    }

    const nextScore = score + 1;
    setScore(nextScore);
    setMessage({ text: t('correctAnswer'), tone: 'success' });

    if (levelIndex === activity.levels.length - 1) {
      setCompleted(true);
      onComplete({
        completed: true,
        lastScore: nextScore,
        bestScore: Math.max(progress.bestScore || 0, nextScore)
      });
      return;
    }

    setTimeout(() => {
      setLevelIndex((value) => value + 1);
      setCounts({ tens: 0, ones: 0 });
      setMessage({ text: '', tone: 'success' });
    }, 700);
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
          <span className="pill">{t('missionDone')}</span>
          <h3>{activity.title}</h3>
          <p>{t('scoreSaved')}: {Math.max(progress.bestScore || 0, score)}/{activity.levels.length}.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="engine-card engine-card--floating">
      <div className="engine-progress">
        <div>
          <span className="eyebrow">{t('level')} {levelIndex + 1} / {activity.levels.length}</span>
          <h3>{activity.title}</h3>
        </div>
        <strong>{countValue(counts)}</strong>
      </div>
      <p className="engine-prompt">{t('buildNumber')} {level.target}.</p>
      <p className="hint-copy">{t('hint')}: {level.hint}</p>
      <div className="base-ten-layout">
        <div className="base-ten-column">
          <span className="base-ten-label">{t('tens')}</span>
          <div className="base-ten-value">{counts.tens}</div>
          <div className="base-ten-actions">
            <button type="button" onClick={() => update({ tens: counts.tens + 1 })}>+10</button>
            <button type="button" onClick={() => update({ tens: Math.max(0, counts.tens - 1) })}>-10</button>
          </div>
        </div>
        <div className="base-ten-column">
          <span className="base-ten-label">{t('ones')}</span>
          <div className="base-ten-value">{counts.ones}</div>
          <div className="base-ten-actions">
            <button type="button" onClick={() => update({ ones: counts.ones + 1 })}>+1</button>
            <button type="button" onClick={() => update({ ones: Math.max(0, counts.ones - 1) })}>-1</button>
          </div>
        </div>
      </div>
      <div className="engine-actions">
        <button className="secondary-action" type="button" onClick={() => {
          if (counts.ones >= 10) {
            update({ tens: counts.tens + 1, ones: counts.ones - 10 });
          }
        }}>
          {t('groupTen')}
        </button>
        <button className="secondary-action" type="button" onClick={() => {
          if (counts.tens > 0) {
            update({ tens: counts.tens - 1, ones: counts.ones + 10 });
          }
        }}>
          {t('breakTen')}
        </button>
        <button className="primary-action" type="button" onClick={check}>
          <span className="button-icon" aria-hidden="true">✅</span>
          <span>{t('verify')}</span>
        </button>
      </div>
      {message.text ? (
        <div className={`feedback-panel${message.tone === 'success' ? ' is-success celebration-shell' : ' is-warning'}`}>
          {message.tone === 'success' ? (
            <div className="celebration-stars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : null}
          <p>{message.text}</p>
        </div>
      ) : null}
    </section>
  );
}
