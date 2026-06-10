import { useEffect, useRef, useState } from 'react';
import './lexi.css';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';
import FunContentCard from '../../shared/ui/FunContentCard.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  MOT_MANQUANT, MOTS_CACHES, RECONSTRUCTIONS, MEMOIRE_PHRASES,
  CLASSIFICATION_ITEMS, SONS_FAMILLES, DETECTIVE_ERREURS, LECTURE_RAPIDE,
  VOCAB_THEMES, VOCAB_DEFINITIONS, LEXI_BADGES, ENCOURAGEMENTS_LEXI,
  genDetectiveQuestion, genVocabQuestion,
} from './lexiEngine.js';
import { checkNewBadges, loadProgress, recordAnswer } from './lexiProgress.js';

// ── BadgePopup ─────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="lx-overlay" role="dialog" aria-modal="true" aria-labelledby="lx-badge-title">
      <div className="lx-badge-popup">
        <div className="lx-badge-popup__emoji">{badge.emoji}</div>
        <div className="lx-badge-popup__title" id="lx-badge-title">{badge.label}</div>
        <div className="lx-badge-popup__sub">Nouveau badge débloqué !</div>
        <button
          ref={closeRef}
          className="lx-badge-popup__close"
          type="button"
          onPointerDown={e => { e.preventDefault(); onClose(); }}
        >
          Super !
        </button>
      </div>
    </div>
  );
}

// ── QuizBar ────────────────────────────────────────────────────────────
function QuizBar({ title, idx, total, onBack }) {
  return (
    <div className="lx-quiz-bar">
      <button className="lx-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }}>←</button>
      <span className="lx-quiz-bar__title">{title}</span>
      <span className="lx-quiz-bar__counter">{idx + 1}/{total}</span>
    </div>
  );
}

// ── TimerBar ──────────────────────────────────────────────────────────
function TimerBar({ timeLeft, megaReto }) {
  if (!megaReto) return null;
  return (
    <div className="lx-timer-bar">
      <div className="lx-timer-bar__track">
        <div className={`lx-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
      </div>
      <span className="lx-timer-bar__num">{timeLeft}s</span>
    </div>
  );
}

// ── ProgBar ────────────────────────────────────────────────────────────
function ProgBar({ idx, total }) {
  const w = total > 0 ? ((idx / total) * 100) : 0;
  return <div className="lx-prog-bar"><div className="lx-prog-bar__fill" style={{ width: w + '%' }} /></div>;
}

// ── MCQ choices ────────────────────────────────────────────────────────
function Choices({ options, correct, selected, onSelect, col1 }) {
  return (
    <div className={`lx-choices${col1 ? ' lx-choices--col1' : ''}`}>
      {options.map((opt, i) => {
        let cls = 'lx-choice';
        if (selected !== null) {
          if (opt === correct) cls += ' is-correct';
          else if (opt === selected) cls += ' is-wrong';
        }
        return (
          <button
            key={i}
            className={cls}
            type="button"
            onPointerDown={e => {
              e.preventDefault();
              if (selected !== null) return;
              onSelect(opt);
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── LexiPage ───────────────────────────────────────────────────────────
export default function LexiPage() {
  // All hooks at top level
  const { locale } = useLocale();
  const [fbState, setFbState] = useState(null);
  const [phase, setPhase] = useState('hub');
  const [currentMode, setCurrentMode] = useState('');
  const [progress, setProgress] = useState(() => loadProgress());
  const [badge, setBadge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedInput, setSelectedInput] = useState(null);
  const [encourage, setEncourage] = useState('');
  const [tries, setTries] = useState(0);
  const [megaReto, setMegaReto] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);
  // Reconstruction-specific
  const [tappedWords, setTappedWords] = useState([]);
  // Mots cachés-specific
  const [revealedCount, setRevealedCount] = useState(0);
  // Mémoire visuelle-specific
  const [isHidden, setIsHidden] = useState(false);
  // Lecture rapide-specific
  const [flashVisible, setFlashVisible] = useState(true);
  // Classification-specific
  const [classified, setClassified] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Mémoire timer — 2s in Mega Reto (très long phrases), 3s otherwise
  useEffect(() => {
    if (phase !== 'memoire') return;
    setIsHidden(false);
    const delay = megaReto ? 2000 : 3000;
    const t = setTimeout(() => setIsHidden(true), delay);
    return () => clearTimeout(t);
  }, [phase, qIdx, megaReto]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lecture rapide flash timer — 1s in Mega Reto, 2s otherwise
  useEffect(() => {
    if (phase !== 'lecture-rapide') return;
    setFlashVisible(true);
    const delay = megaReto ? 1000 : 2000;
    const t = setTimeout(() => setFlashVisible(false), delay);
    return () => clearTimeout(t);
  }, [phase, qIdx, megaReto]); // eslint-disable-line react-hooks/exhaustive-deps

  const LX_QUIZ_PHASES = ['mot-manquant','mots-caches','reconstruction','memoire','classification','sons','detective','lecture-rapide','vocabulaire'];

  function handleTimeOut() {
    const newProg = recordAnswer(false);
    setProgress(newProg);
    setStatus('wrong');
    const q = questions[qIdx];
    const correctAnswer = q ? (q.answer || q.word || q.text || q.suffix || q.correct || q.correctTheme || q.type || '') : '';
    setFbState({ isCorrect: false, correctAnswer: String(correctAnswer) });
    setTimeout(() => handleNext(), 2500);
  }

  // Mega Reto timer effect
  useEffect(() => {
    if (!megaReto) return;
    if (!LX_QUIZ_PHASES.includes(phase)) return;
    if (status !== 'idle') return;
    clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx, megaReto, status]); // eslint-disable-line react-hooks/exhaustive-deps

  function startMode(mode) {
    clearInterval(timerRef.current);
    setCurrentMode(mode);
    setPhase(mode);
    setQIdx(0); setScore(0); setStatus('idle'); setTries(0);
    setEncourage(''); setSelectedInput(null);
    setTappedWords([]); setRevealedCount(0); setIsHidden(false); setFlashVisible(true);
    setClassified({}); setSelectedTheme(null); setTimeLeft(15);
    const count = megaReto ? 20 : 10;

    if (mode === 'mot-manquant') {
      const pool = megaReto
        ? [...MOT_MANQUANT].filter(q => q.difficulty === 'difficile')
        : [...MOT_MANQUANT].filter(q => q.difficulty !== 'difficile');
      setQuestions(pool.sort(() => Math.random() - .5).slice(0, count));
    } else if (mode === 'mots-caches') {
      const pool = megaReto
        ? [...MOTS_CACHES].filter(q => q.difficulty === 'difficile')
        : [...MOTS_CACHES].filter(q => q.difficulty !== 'difficile');
      const picked = pool.sort(() => Math.random() - .5).slice(0, Math.min(count, pool.length));
      setQuestions(picked.map(item => {
        const others = pool.filter(x => x.word !== item.word).sort(() => Math.random() - .5).slice(0, 3).map(x => x.word);
        return { ...item, mcqOptions: [item.word, ...others].sort(() => Math.random() - .5) };
      }));
    } else if (mode === 'reconstruction') {
      const pool = megaReto
        ? [...RECONSTRUCTIONS].filter(q => q.difficulty === 'difficile')
        : [...RECONSTRUCTIONS].filter(q => q.difficulty !== 'difficile');
      setQuestions(pool.sort(() => Math.random() - .5).slice(0, Math.min(count, pool.length)));
    } else if (mode === 'memoire') {
      const levels = megaReto ? ['tres_long', 'long'] : ['court', 'moyen'];
      const filtered = MEMOIRE_PHRASES.filter(p => levels.includes(p.level));
      setQuestions(filtered.sort(() => Math.random() - .5).slice(0, count));
    } else if (mode === 'classification') {
      const pool = megaReto
        ? [...CLASSIFICATION_ITEMS].filter(q => q.difficulty === 'difficile')
        : [...CLASSIFICATION_ITEMS].filter(q => q.difficulty !== 'difficile');
      setQuestions(pool.sort(() => Math.random() - .5).slice(0, count));
    } else if (mode === 'sons') {
      const familles = megaReto
        ? SONS_FAMILLES.filter(f => f.difficulty === 'difficile')
        : SONS_FAMILLES.filter(f => f.difficulty !== 'difficile');
      const items = familles.flatMap(f => f.words.map(w => ({ ...w, family: f.family, options: f.options, description: f.description })));
      setQuestions(items.sort(() => Math.random() - .5).slice(0, count));
    } else if (mode === 'detective') {
      const pool = megaReto
        ? [...DETECTIVE_ERREURS].filter(q => q.difficulty === 'difficile')
        : [...DETECTIVE_ERREURS].filter(q => q.difficulty !== 'difficile');
      setQuestions(pool.sort(() => Math.random() - .5).slice(0, Math.min(count, pool.length)).map(genDetectiveQuestion));
    } else if (mode === 'lecture-rapide') {
      const lvl = megaReto ? [4, 5] : [1, 2, 3];
      const filtered = LECTURE_RAPIDE.filter(item => lvl.includes(item.level));
      const picked = filtered.sort(() => Math.random() - .5).slice(0, count);
      setQuestions(picked.map(item => {
        const pool = filtered.filter(x => x.text !== item.text);
        const d = pool.sort(() => Math.random() - .5).slice(0, 3).map(x => x.text);
        while (d.length < 3) d.push('...');
        return { ...item, flashOpts: [item.text, ...d.slice(0, 3)].sort(() => Math.random() - .5) };
      }));
    } else if (mode === 'vocabulaire') {
      const allThemes = Object.keys(VOCAB_THEMES);
      if (megaReto) {
        const defs = [...VOCAB_DEFINITIONS].sort(() => Math.random() - .5).slice(0, count);
        setQuestions(defs.map(d => {
          const others = allThemes.filter(t => t !== d.correct).sort(() => Math.random() - .5).slice(0, 3);
          return { ...d, correctTheme: d.correct, options: [d.correct, ...others].sort(() => Math.random() - .5) };
        }));
      } else {
        const themes = allThemes.filter(t => !VOCAB_THEMES[t].difficulty);
        const qs = Array.from({ length: count }, (_, i) => genVocabQuestion(themes[i % themes.length]));
        setQuestions(qs);
      }
    }
  }

  function handleAnswer(answer, correct) {
    const isCorrect = String(answer).trim() === String(correct).trim();
    const newProg = recordAnswer(isCorrect);
    setProgress(newProg);
    const newBadges = checkNewBadges(newProg, LEXI_BADGES);
    if (newBadges.length > 0) setBadge(newBadges[0]);
    setSelectedInput(answer);
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(s => s + 1);
      setTries(0);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      const t = tries + 1; setTries(t);
      if (!megaReto) setEncourage(ENCOURAGEMENTS_LEXI[Math.floor(Math.random() * ENCOURAGEMENTS_LEXI.length)]);
      if (t >= 2) {
        setFbState({ isCorrect: false, correctAnswer: String(correct) });
      } else {
        setTimeout(() => { setStatus('idle'); setSelectedInput(null); }, 1000);
      }
    }
  }

  function advance() {
    clearInterval(timerRef.current);
    const next = qIdx + 1;
    if (next >= questions.length) { setPhase('results'); return; }
    setQIdx(next);
    setStatus('idle'); setSelectedInput(null); setEncourage(''); setTries(0);
    setTappedWords([]); setRevealedCount(0); setIsHidden(false); setFlashVisible(true);
  }

  function handleNext() {
    setFbState(null);
    setStatus('idle');
    advance();
  }

  function goHub() { clearInterval(timerRef.current); setPhase('hub'); setTimeLeft(15); }

  // Generate mémoire MCQ options for a question
  function genMemoireOptions(q, allQuestions) {
    const others = allQuestions.filter(x => x.text !== q.text);
    const distractors = others.sort(() => Math.random() - .5).slice(0, 3).map(x => x.text);
    return [q.text, ...distractors].sort(() => Math.random() - .5);
  }

  // Generate lecture rapide MCQ options
  function genFlashOptions(q) {
    const pool = LECTURE_RAPIDE.filter(x => x.text !== q.text && x.level === q.level);
    const distractors = pool.sort(() => Math.random() - .5).slice(0, 3).map(x => x.text);
    while (distractors.length < 3) {
      distractors.push(q.text.split('').sort(() => Math.random() - .5).join(''));
    }
    return [q.text, ...distractors.slice(0, 3)].sort(() => Math.random() - .5);
  }

  const pct = progress.totalAttempts > 0
    ? Math.min(100, Math.round((progress.totalCorrect / progress.totalAttempts) * 100))
    : 0;

  // ── HUB ────────────────────────────────────────────────────────────────
  if (phase === 'hub') {
    const earnedBadges = LEXI_BADGES.filter(b => progress.badges.includes(b.id));
    const gameCards = [
      { mode: 'mot-manquant',   emoji: '📝', name: 'Mot Manquant',           desc: 'Complete la phrase',            color: '#7c3aed' },
      { mode: 'mots-caches',    emoji: '🔤', name: 'Mots Caches',            desc: 'Retrouve le mot cache',         color: '#ec4899' },
      { mode: 'reconstruction', emoji: '🧩', name: 'Reconstruis la Phrase',  desc: 'Remets les mots dans l\'ordre', color: '#06b6d4' },
      { mode: 'memoire',        emoji: '🧠', name: 'Memoire Visuelle',       desc: 'Lis, cache, retrouve',          color: '#f59e0b' },
      { mode: 'classification', emoji: '🗂️', name: 'Adjectif ou Verbe ?',    desc: 'Classe les mots',               color: '#22c55e' },
      { mode: 'sons',           emoji: '🔊', name: 'Sons Complexes',         desc: 'Complete le son manquant',      color: '#f97316' },
      { mode: 'detective',      emoji: '🔍', name: 'Detective des Erreurs',  desc: 'Trouve la faute',               color: '#ef4444' },
      { mode: 'lecture-rapide', emoji: '⚡', name: 'Lecture Rapide',         desc: 'Lis vite !',                    color: '#14b8a6' },
      { mode: 'vocabulaire',    emoji: '📖', name: 'Laboratoire de Vocab',   desc: 'Les mots par theme',            color: '#8b5cf6' },
    ];

    return (
      <div className="lx-page">
        <div className="lx-hero">
          <div className="lx-hero__mascot">📚</div>
          <div>
            <h1 className="lx-hero__title">LexiLena</h1>
            <p className="lx-hero__sub">L\'Academie des Mots et des Phrases</p>
          </div>
        </div>

        <div className="lx-global-prog">
          <div className="lx-global-prog__bar">
            <div className="lx-global-prog__fill" style={{ width: pct + '%' }} />
          </div>
          <div className="lx-global-prog__stats">
            <span className="lx-global-prog__stat"><strong>{progress.totalCorrect}</strong> correct</span>
            <span className="lx-global-prog__stat"><strong>{progress.totalAttempts}</strong> tentatives</span>
            <span className="lx-global-prog__stat"><strong>{earnedBadges.length}</strong> badges</span>
          </div>
        </div>

        <div className="lx-body">
          <p className="lx-section-label">Les Univers</p>
          <div className="lx-cat-grid">
            {gameCards.map(c => (
              <button
                key={c.mode}
                className="lx-cat-card"
                style={{ '--cat-color': c.color }}
                type="button"
                onPointerDown={e => { e.preventDefault(); startMode(c.mode); }}
              >
                <div className="lx-cat-card__stripe" />
                <div className="lx-cat-card__body">
                  <span className="lx-cat-card__emoji">{c.emoji}</span>
                  <span className="lx-cat-card__name">{c.name}</span>
                  <span className="lx-cat-card__desc">{c.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`lx-mega-btn${megaReto ? ' is-active' : ''}`}
            onPointerDown={e => { e.preventDefault(); setMegaReto(m => !m); }}
          >
            {megaReto ? '🔥 Mega Reto ACTIF — Touche pour desactiver' : '🔥 Activer le Mega Reto'}
          </button>

          {LEXI_BADGES.length > 0 && (
            <>
              <p className="lx-section-label">Badges</p>
              <div className="lx-badges">
                {LEXI_BADGES.map(b => {
                  const earned = progress.badges.includes(b.id);
                  return (
                    <div key={b.id} className={'lx-badge-chip' + (earned ? ' is-earned' : ' is-locked')}>
                      <span className="lx-badge-chip__emoji">{b.emoji}</span>
                      <span>{b.label}</span>
                      {!earned && <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>({b.threshold}✓)</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ height: 80 }} />
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = questions.length;
    const pctR = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = megaReto
      ? (pctR >= 95 ? 3 : pctR >= 80 ? 2 : pctR >= 60 ? 1 : 0)
      : (pctR >= 90 ? 3 : pctR >= 70 ? 2 : pctR >= 50 ? 1 : 0);
    const trophy = pctR >= 90 ? '🏆' : pctR >= 70 ? '🎉' : pctR >= 50 ? '👍' : '💪';
    const title = pctR >= 90 ? 'Bravo ! Tu es fantastique !' : pctR >= 70 ? 'Tres bien fait !' : pctR >= 50 ? 'Bon travail !' : 'Continue, tu progresses !';
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="lx-results">
          <div className="lx-results__trophy">{trophy}</div>
          <h2 className="lx-results__title">{title}</h2>
          <div className="lx-results__score">{score}/{total}</div>
          <div className="lx-results-stars">
            {[1, 2, 3].map(i => (
              <span key={i} className="lx-results-star" style={{ opacity: i <= stars ? undefined : '.2' }}>
                {i <= stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <FunContentCard />
          <div className="lx-results-btns">
            <button className="lx-results-btn lx-results-btn--primary" type="button" onPointerDown={e => { e.preventDefault(); startMode(currentMode); }}>
              Rejouer
            </button>
            <button className="lx-results-btn lx-results-btn--secondary" type="button" onPointerDown={e => { e.preventDefault(); goHub(); }}>
              Retour au menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Guard — no questions yet
  if (questions.length === 0) return null;
  const q = questions[qIdx];
  if (!q) return null;

  // ── MOT MANQUANT ────────────────────────────────────────────────────
  if (phase === 'mot-manquant') {
    const parts = q.sentence.split('___');
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Mot Manquant" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-sentence-display">
          {parts[0]}<span className="lx-blank">{selectedInput !== null ? selectedInput : '___'}</span>{parts[1] || ''}
        </div>
        <div className="lx-question">Quel mot complete la phrase ?</div>
        <Choices
          options={q.options}
          correct={q.answer}
          selected={selectedInput}
          onSelect={opt => handleAnswer(opt, q.answer)}
        />
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── MOTS CACHES ─────────────────────────────────────────────────────
  if (phase === 'mots-caches') {
    const wordLetters = q.word.replace(/-/g, '').split('');
    const revealLetters = wordLetters.slice(0, revealedCount);
    void revealLetters;
    const mcqOptions = q.mcqOptions;
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Mots Caches" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-sentence-display" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
          <span style={{ fontSize: '2rem' }}>{q.emoji}</span><br />
          {q.hint}
        </div>
        <div className="lx-word-boxes">
          {wordLetters.map((letter, i) => (
            <div key={i} className={'lx-letter-box' + (i < revealedCount ? ' is-revealed' : '')}>
              {i < revealedCount ? letter : ''}
            </div>
          ))}
        </div>
        {revealedCount < wordLetters.length && selectedInput === null && (
          <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
            <button
              type="button"
              className="lx-choice"
              style={{ width: '100%', borderColor: 'rgba(167,139,250,.4)', background: 'rgba(124,58,237,.2)' }}
              onPointerDown={e => { e.preventDefault(); setRevealedCount(r => r + 1); }}
            >
              💡 Indice (+1 lettre)
            </button>
          </div>
        )}
        <div className="lx-question">Quel est ce mot ?</div>
        <Choices
          options={mcqOptions}
          correct={q.word}
          selected={selectedInput}
          onSelect={opt => handleAnswer(opt, q.word)}
        />
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── RECONSTRUCTION ──────────────────────────────────────────────────
  if (phase === 'reconstruction') {
    const seed = qIdx;
    const stableShuffled = [...q.words].map((w, i) => ({ w, r: ((i * 7 + seed * 13) % q.words.length) })).sort((a, b) => a.r - b.r).map(x => x.w);
    const builtSentence = tappedWords.join(' ');
    const allTapped = tappedWords.length >= q.words.length;

    function validateReconstruct() {
      const built = tappedWords.join(' ');
      handleAnswer(built, q.answer);
    }

    // Track per-word tapped counts
    const tappedCounts = {};
    tappedWords.forEach(w => { tappedCounts[w] = (tappedCounts[w] || 0) + 1; });
    const totalCounts = {};
    stableShuffled.forEach(w => { totalCounts[w] = (totalCounts[w] || 0) + 1; });

    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Reconstruis la Phrase" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-question">Remets les mots dans le bon ordre !</div>
        <div className="lx-reconstruct-area">
          <div className={'lx-result-area' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}
            style={status === 'correct' ? { borderColor: '#22c55e', background: 'rgba(34,197,94,.1)' } : status === 'wrong' ? { borderColor: '#f97316', background: 'rgba(249,115,22,.08)' } : {}}>
            {tappedWords.length === 0
              ? <span style={{ color: 'rgba(255,255,255,.3)', fontStyle: 'italic', fontSize: '.9rem' }}>Tape les mots ici...</span>
              : tappedWords.map((w, i) => (
                <span key={i} className="lx-word-chip" style={{ cursor: 'default', opacity: 1 }}>{w}</span>
              ))
            }
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {stableShuffled.map((word, i) => {
              const usedSoFar = tappedCounts[word] || 0;
              const totalForWord = totalCounts[word] || 0;
              const isUsed = usedSoFar >= totalForWord;
              return (
                <button
                  key={i}
                  className={'lx-word-chip' + (isUsed ? ' is-used' : '')}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    if (isUsed || status !== 'idle') return;
                    setTappedWords(prev => [...prev, word]);
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 14px', flexShrink: 0 }}>
          <button
            type="button"
            className="lx-results-btn lx-results-btn--secondary"
            style={{ flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer' }}
            onPointerDown={e => { e.preventDefault(); setTappedWords([]); setStatus('idle'); setSelectedInput(null); }}
          >
            Effacer
          </button>
          {allTapped && status === 'idle' && (
            <button
              type="button"
              className="lx-results-btn lx-results-btn--primary"
              style={{ flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer' }}
              onPointerDown={e => { e.preventDefault(); validateReconstruct(); }}
            >
              Valider ✓
            </button>
          )}
        </div>
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── MEMOIRE VISUELLE ────────────────────────────────────────────────
  if (phase === 'memoire') {
    const opts = (() => {
      const others = questions.filter(x => x.text !== q.text);
      const d = others.sort(() => Math.random() - .5).slice(0, 3).map(x => x.text);
      while (d.length < 3) d.push(q.text + '...');
      return [q.text, ...d.slice(0, 3)].sort(() => Math.random() - .5);
    })();
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Memoire Visuelle" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className={'lx-memoire-display' + (isHidden ? ' is-hidden' : '')}>{q.text}</div>
        {isHidden && (
          <>
            <div className="lx-question">Quelle phrase as-tu lue ?</div>
            <Choices
              options={opts}
              correct={q.text}
              selected={selectedInput}
              onSelect={opt => handleAnswer(opt, q.text)}
              col1
            />
          </>
        )}
        {!isHidden && <div className="lx-question">Lis bien cette phrase...</div>}
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── CLASSIFICATION ──────────────────────────────────────────────────
  if (phase === 'classification') {
    const colDefs = [
      { key: 'adjectif', label: 'Adjectif 🎨', color: '#f97316' },
      { key: 'verbe_infinitif', label: 'Verbe infinitif ∞', color: '#22c55e' },
      { key: 'verbe_conjugue', label: 'Verbe conjugue ⚡', color: '#3b82f6' },
    ];
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Adjectif ou Verbe ?" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className={'lx-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{q.word}</div>
        </div>
        <div className="lx-question">Ce mot est...</div>
        <div className="lx-choices lx-choices--col1">
          {colDefs.map(col => {
            let cls = 'lx-choice';
            if (selectedInput !== null) {
              if (col.key === q.type) cls += ' is-correct';
              else if (col.key === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={col.key}
                className={cls}
                type="button"
                style={{ borderColor: selectedInput === null ? col.color + '44' : undefined }}
                onPointerDown={e => {
                  e.preventDefault();
                  if (selectedInput !== null) return;
                  handleAnswer(col.key, q.type);
                }}
              >
                {col.label}
              </button>
            );
          })}
        </div>
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── SONS COMPLEXES ──────────────────────────────────────────────────
  if (phase === 'sons') {
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Sons Complexes" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-sons-card">
          <div className="lx-sons-card__family">{q.family}</div>
          <div className="lx-sons-card__word">{q.blank}<span style={{ color: '#a78bfa' }}>__</span></div>
          <div className="lx-sons-card__example">{q.example}</div>
        </div>
        <div className="lx-question">Quelle terminaison complete ce mot ?</div>
        <div className="lx-choices">
          {q.options.map((opt, i) => {
            let cls = 'lx-choice';
            if (selectedInput !== null) {
              if (opt === q.suffix) cls += ' is-correct';
              else if (opt === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (selectedInput !== null) return;
                  handleAnswer(opt, q.suffix);
                }}
              >
                -{opt}
              </button>
            );
          })}
        </div>
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── DETECTIVE DES ERREURS ────────────────────────────────────────────
  if (phase === 'detective') {
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Detective des Erreurs" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-error-display">
          <div className="lx-error-type">🔍 {q.errorType}</div>
          {q.wrong}
        </div>
        <div className="lx-question">Quelle est la phrase correcte ?</div>
        <Choices
          options={q.options}
          correct={q.correct}
          selected={selectedInput}
          onSelect={opt => handleAnswer(opt, q.correct)}
          col1
        />
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── LECTURE RAPIDE ──────────────────────────────────────────────────
  if (phase === 'lecture-rapide') {
    const flashOpts = q.flashOpts;
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Lecture Rapide" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className={'lx-flash-display' + (flashVisible ? '' : ' is-hidden')}>{q.text}</div>
        {!flashVisible && (
          <>
            <div className="lx-question">Quel mot as-tu vu ?</div>
            <Choices
              options={flashOpts}
              correct={q.text}
              selected={selectedInput}
              onSelect={opt => handleAnswer(opt, q.text)}
              col1
            />
          </>
        )}
        {flashVisible && <div className="lx-question">Lis vite !</div>}
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  // ── VOCABULAIRE ─────────────────────────────────────────────────────
  if (phase === 'vocabulaire') {
    return (
      <div className="lx-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        <QuizBar title="Laboratoire de Vocab" idx={qIdx} total={questions.length} onBack={goHub} />
        <ProgBar idx={qIdx} total={questions.length} />
        <TimerBar timeLeft={timeLeft} megaReto={megaReto} />
        <div className="lx-word-display">
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{q.word}</div>
          {q.hint && <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', marginTop: 6, fontStyle: 'italic' }}>{q.hint}</div>}
        </div>
        <div className="lx-question">A quel theme appartient ce mot ?</div>
        <div className="lx-vocab-theme-grid">
          {q.options.map((themeKey, i) => {
            const theme = VOCAB_THEMES[themeKey];
            let cls = 'lx-vocab-theme-btn';
            if (selectedInput !== null) {
              if (themeKey === q.correctTheme) cls += ' is-correct';
              else if (themeKey === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (selectedInput !== null) return;
                  handleAnswer(themeKey, q.correctTheme);
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>{theme.emoji}</span>
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
        {encourage !== '' && status === 'wrong' && <div className="lx-encourage">{encourage}</div>}
      </div>
    );
  }

  return null;
}
