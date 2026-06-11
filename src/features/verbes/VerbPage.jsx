import { useEffect, useRef, useState } from 'react';
import './verb.css';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';
import FunContentCard from '../../shared/ui/FunContentCard.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  VERBES, NIVEAUX, VERB_BADGES, ENCOURAGEMENTS_VERB, HISTOIRES,
  PHRASES_VERBES, MINI_LECONS, PUZZLE_PHRASES, SUJETS_DISPLAY, SUJET_EMOJI,
  TEMPS_LABEL, genDragonQuestion, genMemoryPairs, pickRandom,
} from './verbEngine.js';
import {
  loadProgress, completeNiveau, addXP, checkNewBadges, recordVerbAnswer,
} from './verbProgress.js';

// ── BadgePopup ─────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="vb-overlay" role="dialog" aria-modal="true">
      <div className="vb-badge-popup">
        <span className="vb-badge-popup__emoji">{badge.emoji}</span>
        <div className="vb-badge-popup__title">{badge.label}</div>
        <div className="vb-badge-popup__sub">Nouveau badge debloque !</div>
        <button
          ref={closeRef}
          className="vb-badge-popup__close"
          type="button"
          onPointerDown={e => { e.preventDefault(); onClose(); }}
        >
          Super !
        </button>
      </div>
    </div>
  );
}

// ── XPPopup ────────────────────────────────────────────────────────────
function XPPopup({ text }) {
  if (!text) return null;
  return <div className="vb-xp-popup">{text}</div>;
}

// ── MiniLecon ──────────────────────────────────────────────────────────
function MiniLecon({ leconKey, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  const lecon = MINI_LECONS[leconKey];
  if (!lecon) return null;
  return (
    <div className="vb-lecon-overlay" role="dialog" aria-modal="true">
      <div className="vb-lecon-card">
        <span className="vb-lecon__emoji">{lecon.emoji}</span>
        <h2 className="vb-lecon__title">{lecon.title}</h2>
        <p className="vb-lecon__content">{lecon.content}</p>
        {lecon.paradigm && (
          <div className="vb-paradigm">
            {lecon.paradigm.map((row, i) => (
              <div key={i} className="vb-paradigm__row">
                <span className="vb-paradigm__sujet" style={{ '--pc': row.color }}>{row.sujet}</span>
                {row.exemple && <span className="vb-paradigm__form">{row.exemple}</span>}
                {row.terminaison && <span className="vb-paradigm__suf">→ -{row.terminaison}</span>}
              </div>
            ))}
          </div>
        )}
        {lecon.examples && (
          <div className="vb-paradigm">
            {lecon.examples.map((ex, i) => (
              <div key={i} className="vb-paradigm__row">
                <span className="vb-paradigm__sujet" style={{ '--pc': ex.color }}>{ex.sujet}</span>
                <span className="vb-paradigm__form">{ex.verbe}</span>
              </div>
            ))}
          </div>
        )}
        <div className="vb-lecon__rule">{lecon.rule}</div>
        <button
          ref={closeRef}
          className="vb-lecon-close"
          type="button"
          onPointerDown={e => { e.preventDefault(); onClose(); }}
        >
          J'ai compris !
        </button>
      </div>
    </div>
  );
}

// ── QuizBar ────────────────────────────────────────────────────────────
function QuizBar({ title, idx, total, onBack }) {
  return (
    <div className="vb-quiz-bar">
      <button
        className="vb-back"
        type="button"
        aria-label="Retour"
        onPointerDown={e => { e.preventDefault(); onBack(); }}
      >
        ←
      </button>
      <span className="vb-quiz-bar__title">{title}</span>
      <span className="vb-quiz-bar__counter">{idx + 1}/{total}</span>
    </div>
  );
}

// ── ProgBar ────────────────────────────────────────────────────────────
function ProgBar({ idx, total }) {
  const w = total > 0 ? ((idx / total) * 100) : 0;
  return (
    <div className="vb-prog-bar">
      <div className="vb-prog-bar__fill" style={{ width: w + '%' }} />
    </div>
  );
}

// ── Choices ────────────────────────────────────────────────────────────
function Choices({ options, correct, selected, onSelect, col1 }) {
  return (
    <div className={`vb-choices${col1 ? ' vb-choices--col1' : ''}`}>
      {options.map((opt, i) => {
        let cls = 'vb-choice';
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

// ── Helpers ────────────────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - .5); }

function genDragonQuestions(niveau, count = 10) {
  const qs = [];
  const sujets = ['je','tu','il','nous','vous','ils'];
  for (let i = 0; i < count; i++) {
    const verbKey = pickRandom(niveau.verbes);
    const sujet = pickRandom(sujets);
    const temps = pickRandom(niveau.temps);
    const q = genDragonQuestion(verbKey, sujet, temps);
    if (q) qs.push(q);
  }
  return qs;
}

function genMemoryCards(niveau) {
  const verbKey = pickRandom(niveau.verbes);
  const temps = pickRandom(niveau.temps);
  const pairs = genMemoryPairs(verbKey, temps).slice(0, 6);
  const cards = [];
  pairs.forEach((p, i) => {
    cards.push({ id: `s${i}`, pairId: i, type: 'sujet', text: `${p.sujetEmoji} ${p.sujetDisplay}`, matched: false });
    cards.push({ id: `f${i}`, pairId: i, type: 'forme', text: p.forme, matched: false });
  });
  return shuffle(cards);
}

function leconKeyForNiveau(niveauId) {
  if (niveauId <= 2) return 'decouverte';
  if (niveauId === 3) return 'present-je-tu-il';
  if (niveauId === 4) return 'present-nous-vous-ils';
  if (niveauId === 5) return 'etre-avoir';
  if (niveauId === 7) return 'futur';
  if (niveauId === 8) return 'imparfait';
  return 'present-je-tu-il';
}

// ── Main component ─────────────────────────────────────────────────────
export default function VerbPage() {
  // All hooks at top level
  const { locale } = useLocale();
  const [fbState, setFbState] = useState(null);
  const [phase, setPhase] = useState('hub');
  const [currentNiveau, setCurrentNiveau] = useState(null);
  const [currentJeu, setCurrentJeu] = useState('');
  const [progress, setProgress] = useState(() => loadProgress());
  const [badge, setBadge] = useState(null);
  const [xpPopup, setXpPopup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedInput, setSelectedInput] = useState(null);
  const [encourage, setEncourage] = useState('');
  const [showLecon, setShowLecon] = useState(false);
  const [leconKey, setLeconKey] = useState('');
  const [monsterHP, setMonsterHP] = useState(100);
  const [coursePos, setCoursePos] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [memoryCards, setMemoryCards] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tappedWords, setTappedWords] = useState([]);
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyScore, setStoryScore] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [puzzleWords, setPuzzleWords] = useState([]);
  const [puzzleBuilt, setPuzzleBuilt] = useState([]);
  const [isMonsterHit, setIsMonsterHit] = useState(false);
  const [pendingJeu, setPendingJeu] = useState(null);

  const xpTimerRef = useRef(null);

  // XP popup auto-clear
  useEffect(() => {
    if (xpPopup) {
      clearTimeout(xpTimerRef.current);
      xpTimerRef.current = setTimeout(() => setXpPopup(null), 1000);
    }
    return () => clearTimeout(xpTimerRef.current);
  }, [xpPopup]);

  // ── Award XP helper ──
  function awardXP(niveauId, amount) {
    const prog = addXP(niveauId, amount);
    setProgress(prog);
    setXpPopup(`+${amount} XP`);
    const newBadges = checkNewBadges(prog, VERB_BADGES);
    if (newBadges.length > 0) setBadge(newBadges[0]);
  }

  // ── Open niveau ──
  function openNiveau(niveau) {
    const lk = leconKeyForNiveau(niveau.id);
    setCurrentNiveau(niveau);
    setLeconKey(lk);
    setPendingJeu(niveau.miniJeux[0]);
    setShowLecon(true);
  }

  // ── Start jeu after lecon ──
  function startJeuAfterLecon() {
    setShowLecon(false);
    if (pendingJeu) {
      startJeu(pendingJeu, currentNiveau);
      setPendingJeu(null);
    }
  }

  // ── Start jeu ──
  function startJeu(jeu, niveau) {
    setCurrentJeu(jeu);
    setCurrentNiveau(niveau);
    setScore(0);
    setQIdx(0);
    setStatus('idle');
    setSelectedInput(null);
    setEncourage('');
    setMonsterHP(100);
    setCoursePos(0);
    setFlippedCards([]);
    setMatchedPairs([]);
    setTappedWords([]);
    setStoryIdx(0);
    setStoryScore(0);
    setPuzzleBuilt([]);

    if (jeu === 'dragon' || jeu === 'terminaison' || jeu === 'course' || jeu === 'combat' || jeu === 'boss') {
      const count = jeu === 'boss' ? 10 : (jeu === 'combat' ? 5 : 10);
      setQuestions(genDragonQuestions(niveau, count));
      setPhase('dragon');
    } else if (jeu === 'chasse') {
      const pool = shuffle(PHRASES_VERBES).slice(0, 10);
      setQuestions(pool);
      setCurrentPhrase(pool[0]);
      setPhase('chasse');
    } else if (jeu === 'memory' || jeu === 'sujet') {
      const cards = genMemoryCards(niveau);
      setMemoryCards(cards);
      setPhase('memory');
    } else if (jeu === 'histoire') {
      const story = pickRandom(HISTOIRES);
      setCurrentStory(story);
      setCurrentPhraseIdx(0);
      setPhase('histoire');
    } else if (jeu === 'puzzle') {
      const pool = shuffle(PUZZLE_PHRASES).slice(0, 8);
      setQuestions(pool);
      const first = pool[0];
      setPuzzleWords(shuffle(first.words));
      setPuzzleBuilt([]);
      setPhase('puzzle');
    }
  }

  // ── Handle dragon answer ──
  function handleDragonAnswer(opt) {
    if (selectedInput !== null) return;
    const q = questions[qIdx];
    const correct = opt === q.answer;
    setSelectedInput(opt);
    recordVerbAnswer(correct, q.temps);

    if (correct) {
      setScore(s => s + 1);
      awardXP(currentNiveau.id, 5);
      if (currentJeu === 'combat' || currentJeu === 'boss') {
        setIsMonsterHit(true);
        setTimeout(() => setIsMonsterHit(false), 400);
        setMonsterHP(hp => Math.max(0, hp - (currentJeu === 'boss' ? 10 : 20)));
      }
      if (currentJeu === 'course') {
        setCoursePos(p => Math.min(100, p + 10));
      }
      setEncourage(pickRandom(ENCOURAGEMENTS_VERB));
      setTimeout(() => handleDragonNext(), 600);
    } else {
      setEncourage('Presque ! La bonne reponse est : ' + q.answer);
      setFbState({ isCorrect: false, correctAnswer: q.answer });
    }
  }

  function handleDragonNext() {
    setFbState(null);
    setStatus('idle');
    setSelectedInput(null);
    setEncourage('');
    if (qIdx + 1 >= questions.length) {
      goToResults();
    } else {
      setQIdx(i => i + 1);
    }
  }

  // ── Handle chasse answer ──
  function handleWordTap(word, idx) {
    if (selectedWord !== null) return;
    const q = currentPhrase;
    const correct = word === q.verbe;
    setSelectedWord(idx);
    recordVerbAnswer(correct, 'present');

    if (correct) {
      setScore(s => s + 1);
      awardXP(currentNiveau.id, 5);
    }
    setFbState({ isCorrect: correct, correctAnswer: correct ? null : q.verbe });
  }

  function handleChasseNext() {
    setFbState(null);
    setSelectedWord(null);
    const nextIdx = qIdx + 1;
    if (nextIdx >= questions.length) {
      goToResults();
    } else {
      setQIdx(nextIdx);
      setCurrentPhrase(questions[nextIdx]);
    }
  }

  // ── Handle memory card tap ──
  function handleMemoryTap(cardId) {
    if (matchedPairs.includes(cardId)) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped.map(id => memoryCards.find(c => c.id === id));
      if (a && b && a.pairId === b.pairId && a.type !== b.type) {
        setMatchedPairs(mp => [...mp, a.id, b.id]);
        setScore(s => s + 1);
        awardXP(currentNiveau.id, 5);
        setFlippedCards([]);
        if (matchedPairs.length + 2 >= memoryCards.length) {
          setTimeout(() => goToResults(), 600);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 900);
      }
    }
  }

  // ── Handle histoire answer ──
  function handleHistoireAnswer(opt) {
    if (selectedInput !== null) return;
    const sentence = currentStory.sentences[currentPhraseIdx];
    const correct = opt === sentence.answer;
    setSelectedInput(opt);
    recordVerbAnswer(correct, 'present');

    if (correct) {
      setStoryScore(s => s + 1);
      awardXP(currentNiveau.id, 5);
    }
    setFbState({ isCorrect: correct, correctAnswer: correct ? null : sentence.answer });
  }

  function handleHistoireNext() {
    setFbState(null);
    setSelectedInput(null);
    const next = currentPhraseIdx + 1;
    if (next >= currentStory.sentences.length) {
      const finalScore = storyScore + (fbState?.isCorrect ? 0 : 0); // storyScore already set
      setScore(storyScore);
      goToResultsWithScore(storyScore, currentStory.sentences.length);
    } else {
      setCurrentPhraseIdx(next);
    }
  }

  // ── Handle puzzle ──
  function handlePuzzleTap(word, wordIdx) {
    if (puzzleBuilt.includes(wordIdx)) return;
    setPuzzleBuilt(prev => [...prev, wordIdx]);
  }

  function handlePuzzleRemove(builtIdx) {
    setPuzzleBuilt(prev => prev.filter((_, i) => i !== builtIdx));
  }

  function handlePuzzleCheck() {
    const q = questions[qIdx];
    const built = puzzleBuilt.map(i => puzzleWords[i]).join(' ');
    const correct = built === q.answer;
    recordVerbAnswer(correct, 'present');
    if (correct) {
      setScore(s => s + 1);
      awardXP(currentNiveau.id, 8);
      setEncourage('Bravo ! Phrase correcte ! ⭐');
    } else {
      setEncourage('Essaie encore ! Regarde l\'ordre des mots.');
    }
    setFbState({ isCorrect: correct, correctAnswer: correct ? null : q.answer });
  }

  function handlePuzzleNext() {
    setFbState(null);
    setEncourage('');
    const next = qIdx + 1;
    if (next >= questions.length) {
      goToResults();
    } else {
      setQIdx(next);
      const nextQ = questions[next];
      setPuzzleWords(shuffle(nextQ.words));
      setPuzzleBuilt([]);
    }
  }

  // ── Go to results ──
  function goToResults() {
    goToResultsWithScore(score, questions.length || 1);
  }

  function goToResultsWithScore(sc, total) {
    const pct = sc / (total || 1);
    const stars = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .5 ? 1 : 0;
    const xpGained = sc * 10;
    const prog = completeNiveau(currentNiveau.id, stars);
    setProgress(prog);
    addXP(currentNiveau.id, xpGained);
    const newBadges = checkNewBadges(loadProgress(), VERB_BADGES);
    if (newBadges.length > 0) setBadge(newBadges[0]);
    setScore(sc);
    setPhase('results');
  }

  function goHub() {
    setProgress(loadProgress());
    setPhase('hub');
    setCurrentNiveau(null);
    setCurrentJeu('');
  }

  function isNiveauUnlocked(niveau) {
    if (niveau.id === 1) return true;
    const prev = progress.niveaux[niveau.id - 1];
    return prev && prev.completed;
  }

  // ── XP bar max ──
  const totalXPMax = NIVEAUX.reduce((s, n) => s + n.xpMax, 0);
  const xpPct = Math.min(100, ((progress.totalXP || 0) / totalXPMax) * 100);

  // ── Render hub ──
  if (phase === 'hub') {
    return (
      <div className="vb-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        {showLecon && (
          <MiniLecon
            leconKey={leconKey}
            onClose={startJeuAfterLecon}
          />
        )}
        <div className="vb-hero">
          <span className="vb-hero__mascot">🧙</span>
          <h1 className="vb-hero__title">Le Royaume des Verbes</h1>
          <p className="vb-hero__sub">Apprends les verbes en jouant !</p>
        </div>
        <div className="vb-xp-bar">
          <div className="vb-xp-bar__fill" style={{ width: xpPct + '%' }} />
        </div>
        <p className="vb-xp-total">{progress.totalXP || 0} XP</p>
        <div className="vb-body">
          <p className="vb-section-label">Niveaux</p>
          <div className="vb-levels-grid">
            {NIVEAUX.map(niveau => {
              const unlocked = isNiveauUnlocked(niveau);
              const nProg = progress.niveaux[niveau.id] || {};
              const done = nProg.completed;
              const stars = nProg.stars || 0;
              let cls = 'vb-level-card';
              if (!unlocked) cls += ' is-locked';
              else if (done) cls += ' is-done';
              else cls += ' is-active';
              return (
                <button
                  key={niveau.id}
                  className={cls}
                  style={{ '--lc': niveau.color }}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    if (unlocked) openNiveau(niveau);
                  }}
                >
                  <span className="vb-level-card__emoji">{niveau.emoji}</span>
                  <div className="vb-level-card__name">{niveau.label}</div>
                  <div className="vb-level-card__stars">
                    {[1,2,3].map(s => <span key={s}>{s <= stars ? '⭐' : '☆'}</span>)}
                  </div>
                  <div className="vb-level-card__xp">{nProg.xp || 0} / {niveau.xpMax} XP</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Render results ──
  if (phase === 'results') {
    const total = currentJeu === 'memory' ? (memoryCards.length / 2) : questions.length || 1;
    const displayScore = currentJeu === 'histoire' ? storyScore : score;
    const displayTotal = currentJeu === 'histoire' ? (currentStory?.sentences.length || 1) : total;
    const pct = displayScore / displayTotal;
    const stars = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .5 ? 1 : 0;
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        <div className="vb-results">
          <span className="vb-results__trophy">🏆</span>
          <h2 className="vb-results__title">
            {stars === 3 ? 'Parfait !' : stars === 2 ? 'Tres bien !' : stars === 1 ? 'Bien !' : 'Continue !'}
          </h2>
          <p className="vb-results__score">{displayScore} / {displayTotal}</p>
          <div className="vb-results-stars">
            {[1,2,3].map(s => (
              <span key={s} className="vb-results-star">{s <= stars ? '⭐' : '☆'}</span>
            ))}
          </div>
          <FunContentCard />
          <div className="vb-results-btns">
            <button
              className="vb-results-btn vb-results-btn--primary"
              type="button"
              onPointerDown={e => { e.preventDefault(); startJeu(currentJeu, currentNiveau); }}
            >
              Rejouer
            </button>
            <button
              className="vb-results-btn vb-results-btn--secondary"
              type="button"
              onPointerDown={e => { e.preventDefault(); goHub(); }}
            >
              Retour au menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FeedbackCard overlay ──
  const fbOverlay = fbState !== null ? (
    <FeedbackCard
      isCorrect={fbState.isCorrect}
      correctAnswer={fbState.correctAnswer}
      locale={locale}
      onNext={
        phase === 'chasse' ? handleChasseNext :
        phase === 'histoire' ? handleHistoireNext :
        phase === 'puzzle' ? handlePuzzleNext :
        handleDragonNext
      }
    />
  ) : null;

  // ── Render dragon / terminaison / course / combat / boss ──
  if (phase === 'dragon') {
    const q = questions[qIdx];
    if (!q) return null;
    const isCombat = currentJeu === 'combat' || currentJeu === 'boss';
    const isCourse = currentJeu === 'course';
    const monsterEmoji = isCombat || currentJeu === 'boss' ? '🐉' : (VERBES[q.verbKey]?.emoji || '⚽');
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        {fbOverlay}
        <QuizBar
          title={currentNiveau?.label || ''}
          idx={qIdx}
          total={questions.length}
          onBack={goHub}
        />
        <ProgBar idx={qIdx} total={questions.length} />
        <div className="vb-quiz-body">
          {isCombat && (
            <div className="vb-combat-scene">
              <div>
                <span className={`vb-monster${isMonsterHit ? ' is-hit' : ''}`}>{monsterEmoji}</span>
                <div className="vb-monster__hp">
                  <div className="vb-monster__hp__fill" style={{ width: monsterHP + '%' }} />
                </div>
              </div>
              <span className="vb-vs">VS</span>
              <div className="vb-hero-hp">🧙</div>
            </div>
          )}
          {isCourse && (
            <div className="vb-course-scene">
              <span className={`vb-runner${selectedInput && selectedInput === questions[qIdx]?.answer ? ' is-running' : ''}`}>🏃</span>
              <div className="vb-course-track">
                <div className="vb-course-track__fill" style={{ width: coursePos + '%' }} />
              </div>
            </div>
          )}
          {!isCombat && !isCourse && (
            <div className="vb-dragon-scene">
              <span className={`vb-dragon-scene__monster${selectedInput && selectedInput !== q.answer ? ' is-wrong' : ''}`}>
                {monsterEmoji}
              </span>
              <div className="vb-dragon-scene__verb">{q.infinitif}</div>
            </div>
          )}
          <div className="vb-dragon-scene__sujet" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,.15)', borderRadius: 20, padding: '6px 14px', fontSize: '.9rem', fontWeight: 700, color: '#10b981', margin: '0 auto', width: 'fit-content' }}>
            <span>{SUJET_EMOJI[q.sujet] || '👤'}</span>
            <span>{SUJETS_DISPLAY[q.sujet] || q.sujet}</span>
            <span style={{ color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>— {TEMPS_LABEL[q.temps] || q.temps}</span>
          </div>
          <Choices
            options={q.options}
            correct={q.answer}
            selected={selectedInput}
            onSelect={handleDragonAnswer}
          />
          <p className="vb-encourage">{encourage}</p>
        </div>
      </div>
    );
  }

  // ── Render chasse ──
  if (phase === 'chasse') {
    const q = currentPhrase;
    if (!q) return null;
    const words = q.phrase.split(' ');
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        {fbOverlay}
        <QuizBar
          title="Chasse aux verbes"
          idx={qIdx}
          total={questions.length}
          onBack={goHub}
        />
        <ProgBar idx={qIdx} total={questions.length} />
        <div className="vb-quiz-body">
          <div className="vb-info-card">
            <div className="vb-info-card__title">Touche le VERBE dans la phrase !</div>
          </div>
          <div className="vb-phrase-words">
            {words.map((word, idx) => {
              const cleanWord = word.replace(/[.,!?]/g, '');
              const isSelected = selectedWord === idx;
              const isCorrectVerb = cleanWord === q.verbe || word === q.verbe;
              let cls = 'vb-word-btn';
              if (isSelected) {
                cls += isCorrectVerb ? ' is-selected correct' : ' is-selected wrong';
              }
              return (
                <button
                  key={idx}
                  className={cls}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    handleWordTap(cleanWord, idx);
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
          <p className="vb-encourage">{encourage}</p>
        </div>
      </div>
    );
  }

  // ── Render memory ──
  if (phase === 'memory') {
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        <QuizBar
          title="Memory Sujet-Verbe"
          idx={matchedPairs.length / 2}
          total={memoryCards.length / 2}
          onBack={goHub}
        />
        <div className="vb-quiz-body">
          <div className="vb-info-card">
            <div className="vb-info-card__title">Trouve les paires sujet / conjugaison !</div>
          </div>
          <div className="vb-memory-grid">
            {memoryCards.map(card => {
              const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.id);
              const isMatched = matchedPairs.includes(card.id);
              let cls = 'vb-memory-card';
              if (isFlipped) cls += ' is-flipped';
              if (isMatched) cls += ' is-matched';
              return (
                <button
                  key={card.id}
                  className={cls}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    if (!isMatched && !isFlipped) handleMemoryTap(card.id);
                  }}
                >
                  {isFlipped ? card.text : '?'}
                </button>
              );
            })}
          </div>
          <p className="vb-encourage">{encourage}</p>
        </div>
      </div>
    );
  }

  // ── Render histoire ──
  if (phase === 'histoire') {
    const story = currentStory;
    if (!story) return null;
    const sentence = story.sentences[currentPhraseIdx];
    if (!sentence) return null;
    const parts = sentence.text.split('___');
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        {fbOverlay}
        <QuizBar
          title={story.title}
          idx={currentPhraseIdx}
          total={story.sentences.length}
          onBack={goHub}
        />
        <ProgBar idx={currentPhraseIdx} total={story.sentences.length} />
        <div className="vb-quiz-body">
          <div className="vb-dragon-scene">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 8 }}>{story.emoji}</span>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.5, margin: 0 }}>
              {parts[0]}
              <span style={{ color: '#f59e0b', borderBottom: '2px solid #f59e0b', minWidth: 40, display: 'inline-block' }}>
                {selectedInput || '___'}
              </span>
              {parts[1]}
            </p>
          </div>
          <Choices
            options={sentence.options}
            correct={sentence.answer}
            selected={selectedInput}
            onSelect={handleHistoireAnswer}
            col1
          />
          <p className="vb-encourage">{encourage}</p>
        </div>
      </div>
    );
  }

  // ── Render puzzle ──
  if (phase === 'puzzle') {
    const q = questions[qIdx];
    if (!q) return null;
    const built = puzzleBuilt.map(i => puzzleWords[i]);
    return (
      <div className="vb-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        {xpPopup && <XPPopup text={xpPopup} />}
        {fbOverlay}
        <QuizBar
          title="Puzzle de phrases"
          idx={qIdx}
          total={questions.length}
          onBack={goHub}
        />
        <ProgBar idx={qIdx} total={questions.length} />
        <div className="vb-quiz-body">
          <div className="vb-info-card">
            <div className="vb-info-card__title">Remets les mots dans le bon ordre !</div>
          </div>
          <div className="vb-puzzle-built">
            {built.length === 0 && (
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem' }}>Tape les mots dans le bon ordre...</span>
            )}
            {built.map((w, i) => (
              <button
                key={i}
                className="vb-puzzle-word is-placed"
                type="button"
                onPointerDown={e => { e.preventDefault(); handlePuzzleRemove(i); }}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="vb-phrase-words">
            {puzzleWords.map((word, idx) => {
              const used = puzzleBuilt.includes(idx);
              return (
                <button
                  key={idx}
                  className={`vb-puzzle-word${used ? ' is-used' : ''}`}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    if (!used) handlePuzzleTap(word, idx);
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
          <button
            className="vb-results-btn vb-results-btn--primary"
            type="button"
            style={{ marginTop: 8 }}
            onPointerDown={e => { e.preventDefault(); handlePuzzleCheck(); }}
          >
            Verifier !
          </button>
          <p className="vb-encourage">{encourage}</p>
        </div>
      </div>
    );
  }

  return null;
}
