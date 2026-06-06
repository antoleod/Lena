import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getConteById } from '../../content/stories/contes.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import './stories.css';

// ── i18n map ──────────────────────────────────────────────────────────────────
const STORY_UI = {
  fr: {
    scene: (i, n) => `Scene ${i} / ${n}`,
    vocabulary: 'Vocabulaire',
    miniGame: 'Mini-jeu',
    emotional: 'Moment emotion',
    reward: 'Bravo !',
    prevScene: '←',
    nextScene: 'Suivant →',
    toVocab: 'Vocabulaire →',
    toMiniGame: 'Jouer →',
    toEmotional: 'Continuer →',
    toReward: 'Terminer →',
    muteOn: 'Activer le son',
    muteOff: 'Couper le son',
    listenBtn: '🔊 Ecouter',
    backToLibrary: '← Bibliotheque',
    newStory: '📚 Nouvelle histoire',
    readAgain: '🔄 Lire encore',
    finishedLabel: 'Histoire terminee !',
    validate: 'Valider',
    correct: '✅ Bravo !',
    incorrect: '❌ Essaie encore...',
    notFound: 'Histoire introuvable.',
    noGame: 'Pas de mini-jeu pour cette histoire.',
    speechLang: 'fr-FR',
  },
  nl: {
    scene: (i, n) => `Scene ${i} / ${n}`,
    vocabulary: 'Woordenschat',
    miniGame: 'Mini-spel',
    emotional: 'Gevoelsmoment',
    reward: 'Goed gedaan!',
    prevScene: '←',
    nextScene: 'Volgende →',
    toVocab: 'Woordenschat →',
    toMiniGame: 'Spelen →',
    toEmotional: 'Doorgaan →',
    toReward: 'Afsluiten →',
    muteOn: 'Geluid aan',
    muteOff: 'Geluid uit',
    listenBtn: '🔊 Luisteren',
    backToLibrary: '← Bibliotheek',
    newStory: '📚 Nieuw verhaal',
    readAgain: '🔄 Opnieuw lezen',
    finishedLabel: 'Verhaal klaar!',
    validate: 'Bevestigen',
    correct: '✅ Goed gedaan!',
    incorrect: '❌ Probeer opnieuw...',
    notFound: 'Verhaal niet gevonden.',
    noGame: 'Geen mini-spel voor dit verhaal.',
    speechLang: 'nl-NL',
  },
  en: {
    scene: (i, n) => `Scene ${i} / ${n}`,
    vocabulary: 'Vocabulary',
    miniGame: 'Mini-game',
    emotional: 'Emotional moment',
    reward: 'Well done!',
    prevScene: '←',
    nextScene: 'Next →',
    toVocab: 'Vocabulary →',
    toMiniGame: 'Play →',
    toEmotional: 'Continue →',
    toReward: 'Finish →',
    muteOn: 'Unmute',
    muteOff: 'Mute',
    listenBtn: '🔊 Listen',
    backToLibrary: '← Library',
    newStory: '📚 New story',
    readAgain: '🔄 Read again',
    finishedLabel: 'Story complete!',
    validate: 'Validate',
    correct: '✅ Well done!',
    incorrect: '❌ Try again...',
    notFound: 'Story not found.',
    noGame: 'No mini-game for this story.',
    speechLang: 'en-US',
  },
  es: {
    scene: (i, n) => `Escena ${i} / ${n}`,
    vocabulary: 'Vocabulario',
    miniGame: 'Minijuego',
    emotional: 'Momento emocional',
    reward: '¡Muy bien!',
    prevScene: '←',
    nextScene: 'Siguiente →',
    toVocab: 'Vocabulario →',
    toMiniGame: 'Jugar →',
    toEmotional: 'Continuar →',
    toReward: 'Terminar →',
    muteOn: 'Activar sonido',
    muteOff: 'Silenciar',
    listenBtn: '🔊 Escuchar',
    backToLibrary: '← Biblioteca',
    newStory: '📚 Nueva historia',
    readAgain: '🔄 Leer de nuevo',
    finishedLabel: '¡Historia completada!',
    validate: 'Validar',
    correct: '✅ ¡Bravo!',
    incorrect: '❌ Intentalo otra vez...',
    notFound: 'Historia no encontrada.',
    noGame: 'Sin minijuego para esta historia.',
    speechLang: 'es-ES',
  },
};

// ── Scene emoji helper ────────────────────────────────────────────────────────
const SCENE_EMOJIS = ['🌟', '✨', '🎭', '🌙', '🌲', '🏰', '🌊', '🦋', '🌺', '⭐', '🎪', '🌈'];
function sceneEmoji(idx) { return SCENE_EMOJIS[idx % SCENE_EMOJIS.length]; }

// ── Fisher-Yates shuffle ──────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── localStorage helpers ───────────────────────────────────────────────────────
function getReadIds() {
  try { return JSON.parse(localStorage.getItem('lena:stories-read') || '[]'); }
  catch { return []; }
}
function markRead(id) {
  try {
    const ids = getReadIds();
    if (!ids.includes(id)) {
      localStorage.setItem('lena:stories-read', JSON.stringify([...ids, id]));
    }
  } catch (_) { /* storage unavailable */ }
}

// ── Confetti burst (no npm) ────────────────────────────────────────────────────
function fireConfetti() {
  const STYLE_ID = 'confetti-kf';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = '@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
  const colors = ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#f1c40f'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.style.cssText = `position:absolute;top:0;left:${Math.random() * 100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};animation:confettiFall ${2 + Math.random() * 1.2}s ${Math.random() * 0.8}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 4500);
}

// ── TTS helper ────────────────────────────────────────────────────────────────
function speakText(text, lang, onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.9;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}
function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// ── Phases ────────────────────────────────────────────────────────────────────
const PHASE_SCENES    = 'scenes';
const PHASE_VOCAB     = 'vocab';
const PHASE_MINIGAME  = 'minigame';
const PHASE_EMOTIONAL = 'emotional';
const PHASE_REWARD    = 'reward';

// ── Mini-game sub-components ──────────────────────────────────────────────────
function MiniGameChoice({ game, onDone, ui }) {
  const [selected, setSelected] = useState(null);
  function choose(idx) {
    if (selected !== null) return;
    setSelected(idx);
  }
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options">
        {game.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,.1)';
          let border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (i === game.answerIndex) { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (i === selected)   { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              style={{ background: bg, border, borderRadius: 14, padding: '12px 16px', fontWeight: 700, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'background .2s', color: '#fff' }}
            >
              {answered && i === game.answerIndex && '✅ '}
              {answered && i === selected && i !== game.answerIndex && '❌ '}
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 16 }}>
          {ui.toEmotional}
        </button>
      )}
    </div>
  );
}

function MiniGameCount({ game, onDone, ui }) {
  const [selected, setSelected] = useState(null);
  function pick(n) { if (selected !== null) return; setSelected(n); }
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options story-minigame__options--row">
        {game.options.map((n) => {
          const correct = n === game.answer;
          const chosen  = n === selected;
          let bg = 'rgba(255,255,255,.1)';
          let border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (correct)     { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (chosen) { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button
              key={n}
              type="button"
              onClick={() => pick(n)}
              style={{ background: bg, border, borderRadius: 14, padding: '16px 24px', fontWeight: 800, fontSize: '1.4rem', cursor: answered ? 'default' : 'pointer', minWidth: 64, color: '#fff' }}
            >
              {answered && correct && '✅ '}{n}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 16 }}>
          {ui.toEmotional}
        </button>
      )}
    </div>
  );
}

function MiniGameSequence({ game, onDone, ui }) {
  const [order, setOrder] = useState(() => shuffle([...game.steps].map((s, i) => ({ text: s, orig: i }))));
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correct, setCorrect] = useState(null);

  function tap(idx) {
    if (confirmed) return;
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const next = [...order];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setOrder(next);
      setSelected(null);
    }
  }

  function confirm() {
    const isCorrect = order.every((item, i) => item.orig === i);
    setCorrect(isCorrect);
    setConfirmed(true);
  }

  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', marginTop: -8, marginBottom: 8 }}>Appuie sur deux cases pour les echanger.</p>
      <div className="story-minigame__sequence">
        {order.map((item, i) => (
          <button
            key={item.orig}
            type="button"
            onClick={() => tap(i)}
            style={{
              background: selected === i ? 'var(--story-accent,#6366f1)' : confirmed ? (item.orig === i ? '#166534' : '#7f1d1d') : 'rgba(255,255,255,.1)',
              border: selected === i ? '2px solid rgba(255,255,255,.4)' : '2px solid rgba(255,255,255,.2)',
              borderRadius: 12, padding: '12px 14px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
            }}
          >
            <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: 8, padding: '2px 8px', fontWeight: 800 }}>{i + 1}</span>
            {item.text}
          </button>
        ))}
      </div>
      {!confirmed && (
        <button type="button" className="story-btn story-btn--primary" onClick={confirm} style={{ marginTop: 12 }}>
          {ui.validate}
        </button>
      )}
      {confirmed && (
        <>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: correct ? '#22c55e' : '#ef4444', marginTop: 8 }}>
            {correct ? ui.correct : ui.incorrect}
          </p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 8 }}>
            {ui.toEmotional}
          </button>
        </>
      )}
    </div>
  );
}

function MiniGameFind({ game, onDone, ui }) {
  const [choices] = useState(() => shuffle([game.target, ...(game.decoys || [])]));
  const [selected, setSelected] = useState(null);
  function pick(c) { if (selected !== null) return; setSelected(c); }
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options">
        {choices.map((c) => {
          const correct = c === game.target;
          const chosen  = c === selected;
          let bg = 'rgba(255,255,255,.1)'; let border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (correct)          { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (chosen)      { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button key={c} type="button" onClick={() => pick(c)}
              style={{ background: bg, border, borderRadius: 14, padding: '12px 16px', fontWeight: 700, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', textAlign: 'left', color: '#fff' }}>
              {answered && correct && '✅ '}{answered && chosen && !correct && '❌ '}{c}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 16 }}>
          {ui.toEmotional}
        </button>
      )}
    </div>
  );
}

function MiniGameMatch({ game, onDone, ui }) {
  const [rights] = useState(() => shuffle(game.pairs.map((p) => p.b)));
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrongFlash, setWrongFlash] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const lefts = game.pairs.map((p) => p.a);
  const allMatchedCount = Object.keys(matched).length;
  const allDone = allMatchedCount === game.pairs.length;

  function tapLeft(a) {
    if (confirmed) return;
    setLeftSel(leftSel === a ? null : a);
  }

  function tapRight(b) {
    if (confirmed || !leftSel) return;
    const expectedPair = game.pairs.find((p) => p.a === leftSel);
    if (expectedPair && expectedPair.b === b) {
      setMatched((prev) => ({ ...prev, [leftSel]: b }));
      setLeftSel(null);
    } else {
      setWrongFlash({ a: leftSel, b });
      setTimeout(() => {
        setWrongFlash(null);
        setLeftSel(null);
      }, 600);
    }
  }

  useEffect(() => {
    if (allDone) {
      setConfirmed(true);
      const t = setTimeout(() => onDone(), 900);
      return () => clearTimeout(t);
    }
  }, [allDone, onDone]);

  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lefts.map((a) => {
            const isMatched = matched[a] !== undefined;
            const isSelected = leftSel === a;
            const isWrong = wrongFlash && wrongFlash.a === a;
            return (
              <button key={a} type="button" onClick={() => tapLeft(a)}
                style={{
                  background: isWrong ? '#7f1d1d' : isSelected ? 'var(--story-accent,#6366f1)' : isMatched ? '#166534' : 'rgba(255,255,255,.1)',
                  border: isWrong ? '2px solid #ef4444' : isSelected ? '2px solid rgba(255,255,255,.4)' : isMatched ? '2px solid #22c55e' : '2px solid rgba(255,255,255,.2)',
                  borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem', color: '#fff',
                }}>
                {a}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rights.map((b) => {
            const isMatchedTo = Object.values(matched).includes(b);
            const isWrong = wrongFlash && wrongFlash.b === b;
            return (
              <button key={b} type="button" onClick={() => tapRight(b)}
                style={{
                  background: isWrong ? '#7f1d1d' : isMatchedTo ? '#166534' : 'rgba(255,255,255,.1)',
                  border: isWrong ? '2px solid #ef4444' : isMatchedTo ? '2px solid #22c55e' : '2px solid rgba(255,255,255,.2)',
                  borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem', color: '#fff',
                }}>
                {b}
              </button>
            );
          })}
        </div>
      </div>
      {confirmed && (
        <p style={{ fontWeight: 800, marginTop: 10, color: '#22c55e' }}>{ui.correct}</p>
      )}
    </div>
  );
}

function MiniGameDispatch({ game, onDone, ui }) {
  if (!game) return <p style={{ textAlign: 'center', opacity: 0.7, color: '#fff' }}>{ui.noGame}</p>;
  switch (game.type) {
    case 'choice':   return <MiniGameChoice   game={game} onDone={onDone} ui={ui} />;
    case 'count':    return <MiniGameCount    game={game} onDone={onDone} ui={ui} />;
    case 'sequence': return <MiniGameSequence game={game} onDone={onDone} ui={ui} />;
    case 'find':     return <MiniGameFind     game={game} onDone={onDone} ui={ui} />;
    case 'match':    return <MiniGameMatch    game={game} onDone={onDone} ui={ui} />;
    default:
      return (
        <div className="story-minigame">
          <p>{ui.noGame}</p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone}>{ui.toEmotional}</button>
        </div>
      );
  }
}

// ── Main reader ───────────────────────────────────────────────────────────────
export default function StoryReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const ui = STORY_UI[locale] || STORY_UI.fr;
  const conte = getConteById(id);

  const [phase, setPhase]       = useState(PHASE_SCENES);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    if (!conte) return;
    if (phase === PHASE_REWARD) {
      markRead(conte.id);
    }
  }, [conte, phase]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    stopSpeech();
    setSpeaking(false);
    speakingRef.current = false;
  }, [sceneIdx]);

  const handleSpeak = useCallback(() => {
    if (!conte) return;
    if (speakingRef.current) {
      stopSpeech();
      setSpeaking(false);
      speakingRef.current = false;
      return;
    }
    const scene = conte.scenes[sceneIdx];
    const textToRead = scene.dialogue
      ? `${scene.text} ${scene.dialogue.speaker} dit : ${scene.dialogue.line}`
      : scene.text;
    setSpeaking(true);
    speakingRef.current = true;
    speakText(textToRead, ui.speechLang, () => { setSpeaking(false); speakingRef.current = false; });
  }, [conte, sceneIdx, ui.speechLang]);

  if (!conte) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#fff' }}>
        <p>{ui.notFound}</p>
        <Link to="/stories" style={{ color: '#a5b4fc' }}>{ui.backToLibrary}</Link>
      </div>
    );
  }

  const { palette, scenes, vocabulary, miniGame, emotionalMoment, rewardEmoji, rewardName } = conte;
  const totalScenes = scenes.length;
  const scene = scenes[sceneIdx];

  const storyAccent = palette?.primary || '#6366f1';
  const storyBg = palette?.background || '#0f0826';
  const pageStyle = {
    '--story-accent': storyAccent,
    '--story-bg': storyBg,
    background: `linear-gradient(160deg, ${storyBg} 0%, ${storyAccent}44 100%)`,
  };

  function goNext() {
    if (sceneIdx < totalScenes - 1) {
      setSceneIdx(sceneIdx + 1);
    } else {
      setPhase(PHASE_VOCAB);
    }
  }
  function goPrev() {
    if (sceneIdx > 0) setSceneIdx(sceneIdx - 1);
  }

  // ── Reward phase ─────────────────────────────────────────────────────────────
  if (phase === PHASE_REWARD) {
    return (
      <div className="sr-page sr-reward-wrap" style={pageStyle}>
        <span className="sr-reward-emoji">{rewardEmoji}</span>
        <h2 className="sr-reward-name">{rewardName}</h2>
        <p className="sr-reward-label">{ui.finishedLabel}</p>
        <div className="sr-reward-stars">
          <span className="sr-reward-star">⭐</span>
          <span className="sr-reward-star">⭐</span>
          <span className="sr-reward-star">⭐</span>
        </div>
        <div className="sr-reward-actions">
          <button
            type="button"
            className="story-btn story-btn--primary"
            onClick={() => navigate('/stories')}
          >
            {ui.newStory}
          </button>
          <button
            type="button"
            className="story-btn"
            onClick={() => { setPhase(PHASE_SCENES); setSceneIdx(0); }}
          >
            {ui.readAgain}
          </button>
        </div>
      </div>
    );
  }

  // ── Emotional moment phase ────────────────────────────────────────────────────
  if (phase === PHASE_EMOTIONAL) {
    return (
      <div className="sr-page sr-emotional-wrap" style={pageStyle}>
        <span className="sr-emotional-icon">💭</span>
        <span
          className="sr-emotional-badge"
          style={{ background: storyAccent }}
        >
          {emotionalMoment.feeling}
        </span>
        <p className="sr-emotional-prompt">{emotionalMoment.prompt}</p>
        <button
          type="button"
          className="story-btn story-btn--primary"
          onClick={() => { fireConfetti(); setPhase(PHASE_REWARD); }}
        >
          {ui.toReward}
        </button>
      </div>
    );
  }

  // ── Mini-game phase ───────────────────────────────────────────────────────────
  if (phase === PHASE_MINIGAME) {
    return (
      <div className="sr-page" style={pageStyle}>
        <header className="sr-header">
          <button
            type="button"
            className="sr-header__back"
            onClick={() => { stopSpeech(); navigate('/stories'); }}
            aria-label={ui.backToLibrary}
          >
            ←
          </button>
          <h1 className="sr-header__title">{conte.emoji} {conte.title}</h1>
        </header>
        <div className="sr-minigame-wrapper">
          <div className="sr-minigame-header">
            <span style={{ fontSize: '1.5rem' }}>🎮</span>
            <h2 className="sr-minigame-title">{ui.miniGame}</h2>
          </div>
          <MiniGameDispatch game={miniGame} onDone={() => setPhase(PHASE_EMOTIONAL)} ui={ui} />
        </div>
      </div>
    );
  }

  // ── Vocabulary phase ──────────────────────────────────────────────────────────
  if (phase === PHASE_VOCAB) {
    return (
      <div className="sr-page" style={pageStyle}>
        <header className="sr-header">
          <button
            type="button"
            className="sr-header__back"
            onClick={() => { stopSpeech(); navigate('/stories'); }}
            aria-label={ui.backToLibrary}
          >
            ←
          </button>
          <h1 className="sr-header__title">{conte.emoji} {conte.title}</h1>
        </header>
        <div className="sr-vocab-grid">
          {vocabulary.map((v) => (
            <div key={v.word} className="sr-vocab-card">
              <span className="sr-vocab-card__emoji">{v.emoji}</span>
              <div>
                <div className="sr-vocab-card__word" style={{ color: storyAccent }}>{v.word}</div>
                <div className="sr-vocab-card__meaning">{v.meaning}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sr-nav">
          <button
            type="button"
            className="sr-nav-btn sr-nav-btn--primary"
            onClick={() => setPhase(PHASE_MINIGAME)}
          >
            {ui.toMiniGame}
          </button>
        </div>
      </div>
    );
  }

  // ── Scenes phase (default) ────────────────────────────────────────────────────
  return (
    <div className="sr-page" style={pageStyle}>
      <header className="sr-header">
        <button
          type="button"
          className="sr-header__back"
          onClick={() => { stopSpeech(); navigate('/stories'); }}
          aria-label={ui.backToLibrary}
        >
          ←
        </button>
        <h1 className="sr-header__title">{conte.emoji} {conte.title}</h1>
        <button
          type="button"
          className={`sr-header__speak${speaking ? ' sr-header__speak--active' : ''}`}
          onClick={handleSpeak}
          title={speaking ? ui.muteOff : ui.muteOn}
        >
          🔊
        </button>
      </header>

      <div className="sr-progress-bar">
        <div
          className="sr-progress-fill"
          style={{ width: `${((sceneIdx + 1) / totalScenes) * 100}%` }}
        />
      </div>

      <div className="sr-book-card">
        <span className="sr-scene-emoji" role="img" aria-hidden="true">
          {sceneEmoji(sceneIdx)}
        </span>
        <p className="sr-scene-text">{scene.text}</p>

        {scene.dialogue && (
          <div className="sr-dialogue">
            <span className="sr-dialogue__speaker">{scene.dialogue.speaker}</span>
            &ldquo;{scene.dialogue.line}&rdquo;
          </div>
        )}
      </div>

      <nav className="sr-nav">
        <button
          type="button"
          className="sr-nav-btn"
          onClick={goPrev}
          disabled={sceneIdx === 0}
          aria-label={ui.prevScene}
        >
          {ui.prevScene}
        </button>
        <button
          type="button"
          className="sr-nav-btn sr-nav-btn--primary"
          onClick={goNext}
        >
          {sceneIdx === totalScenes - 1 ? ui.toVocab : ui.nextScene}
        </button>
      </nav>
    </div>
  );
}
