import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getLessonById } from '../../content/lessons/lessonsCatalog.js';
import { saveLessonProgress } from '../../services/storage/progressStore.js';

// Render markdown-lite: **bold**, \n as <br>
function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part.split('\n').map((line, j, arr) => (
          <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
        ));
      })}
    </span>
  );
}

function InfoSlide({ slide }) {
  return (
    <div className={`lp-slide lp-slide--info${slide.highlight ? ' lp-slide--highlight' : ''}${slide.isEnd ? ' lp-slide--end' : ''}`}>
      <div className="lp-slide__emoji">{slide.emoji}</div>
      <h2 className="lp-slide__title">{slide.title}</h2>
      <div className="lp-slide__body"><RichText text={slide.body} /></div>
      {slide.tip && (
        <div className="lp-slide__tip">
          <span className="lp-slide__tip-icon">💡</span>
          <RichText text={slide.tip} />
        </div>
      )}
    </div>
  );
}

function QuestionSlide({ slide, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = selected === slide.correct;

  function handleChoice(i) {
    if (answered) return;
    setSelected(i);
    setTimeout(() => onAnswer(i === slide.correct), 1200);
  }

  return (
    <div className="lp-slide lp-slide--question">
      <div className="lp-slide__emoji">{slide.emoji}</div>
      <h2 className="lp-slide__title">{slide.title}</h2>
      <p className="lp-slide__question"><RichText text={slide.question} /></p>
      <div className="lp-slide__choices">
        {slide.choices.map((choice, i) => {
          let cls = 'lp-choice';
          if (answered) {
            if (i === slide.correct) cls += ' lp-choice--correct';
            else if (i === selected) cls += ' lp-choice--wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handleChoice(i)} disabled={answered}>
              {choice}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`lp-slide__feedback${isCorrect ? ' lp-slide__feedback--ok' : ' lp-slide__feedback--miss'}`}>
          <RichText text={isCorrect ? slide.feedback.correct : slide.feedback.wrong} />
        </div>
      )}
    </div>
  );
}

function ActivitySlide({ slide }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="lp-slide lp-slide--activity">
      <div className="lp-slide__emoji">{slide.emoji}</div>
      <h2 className="lp-slide__title">{slide.title}</h2>
      <div className="lp-slide__body"><RichText text={slide.body} /></div>
      <div className="lp-activity">
        <p className="lp-activity__prompt">✏️ {slide.activityPrompt}</p>
        {!sent ? (
          <>
            <input
              className="lp-activity__input"
              type="text"
              placeholder={slide.activityPlaceholder}
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <button
              className="lp-activity__send"
              onClick={() => value.trim() && setSent(true)}
              disabled={!value.trim()}
            >
              Valider ✓
            </button>
          </>
        ) : (
          <div className="lp-activity__done">
            <span>🌟</span>
            <strong>Super ! Tu as noté : « {value} »</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LessonPlayerPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/lessons';
  const lesson = getLessonById(lessonId);

  const [index, setIndex] = useState(0);
  const [canAdvance, setCanAdvance] = useState(true);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!lesson) {
    return (
      <div className="lp-player">
        <div className="lp-slide lp-slide--info">
          <div className="lp-slide__emoji">🔭</div>
          <h2 className="lp-slide__title">Leçon introuvable</h2>
          <Link className="lp-btn lp-btn--primary" to="/lessons">← Retour</Link>
        </div>
      </div>
    );
  }

  const slide = lesson.slides[index];
  const total = lesson.slides.length;
  const pct = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  function handleNext() {
    if (isLast) {
      saveLessonProgress(lesson.id);
      setFinished(true);
      return;
    }
    setIndex(i => i + 1);
    setQuestionAnswered(false);
    setCanAdvance(slide.type !== 'question');
  }

  function handleQuestionAnswer(correct) {
    setQuestionAnswered(true);
    setCanAdvance(true);
  }

  const nextReady = slide.type === 'question' ? questionAnswered : true;

  if (finished) {
    return (
      <div className="lp-player" style={{ '--lp-color': lesson.color, '--lp-bg': lesson.bg }}>
        <div className="lp-finish">
          <div className="lp-finish__orb">{lesson.emoji}</div>
          <h2 className="lp-finish__title">Leçon terminée ! 🎉</h2>
          <p className="lp-finish__sub">Tu as appris à utiliser {lesson.title.replace(/📏|✏️|🔢/g, '').trim()} !</p>
          <div className="lp-finish__stars">{'★'.repeat(3)}</div>
          <div className="lp-finish__actions">
            <button className="lp-btn lp-btn--primary" onClick={() => { setIndex(0); setFinished(false); setQuestionAnswered(false); }}>
              🔄 Recommencer
            </button>
            <Link className="lp-btn lp-btn--secondary" to={returnTo}>← Retour</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-player" style={{ '--lp-color': lesson.color, '--lp-shadow': lesson.shadow, '--lp-bg': lesson.bg }}>
      {/* Topbar */}
      <div className="lp-topbar">
        <Link className="cc-back-btn" to={returnTo}>←</Link>
        <div className="lp-topbar__title">{lesson.title}</div>
        <span className="lp-topbar__count">{index + 1}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="lp-progress">
        <div className="lp-progress__fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Slide */}
      <div className="lp-slide-wrap" key={slide.id}>
        {slide.type === 'info'      && <InfoSlide slide={slide} />}
        {slide.type === 'question'  && <QuestionSlide slide={slide} onAnswer={handleQuestionAnswer} />}
        {slide.type === 'activity'  && <ActivitySlide slide={slide} />}
      </div>

      {/* Navigation */}
      <div className="lp-nav">
        {index > 0 && (
          <button className="lp-btn lp-btn--secondary" onClick={() => { setIndex(i => i - 1); setQuestionAnswered(false); }}>
            ← Précédent
          </button>
        )}
        <button
          className="lp-btn lp-btn--primary"
          onClick={handleNext}
          disabled={!nextReady}
          style={{ flex: 1 }}
        >
          {isLast ? '🏁 Terminer !' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
