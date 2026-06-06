import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getConteById } from '../../content/stories/contes.js';

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
    s.textContent = `@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`;
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
function speakText(text, onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'fr-FR';
  utt.rate = 0.9;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}
function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// ── Phases ────────────────────────────────────────────────────────────────────
const PHASE_SCENES     = 'scenes';
const PHASE_VOCAB      = 'vocab';
const PHASE_MINIGAME   = 'minigame';
const PHASE_EMOTIONAL  = 'emotional';
const PHASE_REWARD     = 'reward';

// ── Mini-game sub-components ──────────────────────────────────────────────────
function MiniGameChoice({ game, onDone }) {
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
          let bg = 'var(--surface-strong)';
          let border = '2px solid var(--line)';
          if (answered) {
            if (i === game.answerIndex) { bg = '#eafaf1'; border = '2px solid #27AE60'; }
            else if (i === selected)   { bg = '#fef0f0'; border = '2px solid #e74c3c'; }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              style={{ background: bg, border, borderRadius: 14, padding: '12px 16px', fontWeight: 700, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'background .2s' }}
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
          Continuer →
        </button>
      )}
    </div>
  );
}

function MiniGameCount({ game, onDone }) {
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
          let bg = 'var(--surface-strong)';
          let border = '2px solid var(--line)';
          if (answered) {
            if (correct)              { bg = '#eafaf1'; border = '2px solid #27AE60'; }
            else if (chosen)          { bg = '#fef0f0'; border = '2px solid #e74c3c'; }
          }
          return (
            <button
              key={n}
              type="button"
              onClick={() => pick(n)}
              style={{ background: bg, border, borderRadius: 14, padding: '16px 24px', fontWeight: 800, fontSize: '1.4rem', cursor: answered ? 'default' : 'pointer', minWidth: 64 }}
            >
              {answered && correct && '✅ '}{n}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 16 }}>
          Continuer →
        </button>
      )}
    </div>
  );
}

function MiniGameSequence({ game, onDone }) {
  const [order, setOrder] = useState(() => [...game.steps].map((s, i) => ({ text: s, orig: i })).sort(() => Math.random() - 0.5));
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
      // swap
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
      <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: -8, marginBottom: 8 }}>Appuie sur deux cases pour les echanger.</p>
      <div className="story-minigame__sequence">
        {order.map((item, i) => (
          <button
            key={item.orig}
            type="button"
            onClick={() => tap(i)}
            style={{
              background: selected === i ? 'var(--primary)' : confirmed ? (item.orig === i ? '#eafaf1' : '#fef0f0') : 'var(--surface-strong)',
              border: selected === i ? '2px solid var(--primary-strong)' : '2px solid var(--line)',
              borderRadius: 12, padding: '12px 14px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ background: 'var(--line)', borderRadius: 8, padding: '2px 8px', fontWeight: 800 }}>{i + 1}</span>
            {item.text}
          </button>
        ))}
      </div>
      {!confirmed && (
        <button type="button" className="story-btn story-btn--primary" onClick={confirm} style={{ marginTop: 12 }}>
          Verifier !
        </button>
      )}
      {confirmed && (
        <>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: correct ? '#27AE60' : '#e74c3c', marginTop: 8 }}>
            {correct ? '✅ Bravo ! C\'est le bon ordre !' : '❌ Pas tout a fait... mais c\'est bien essaye !'}
          </p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 8 }}>
            Continuer →
          </button>
        </>
      )}
    </div>
  );
}

function MiniGameFind({ game, onDone }) {
  const [choices] = useState(() => {
    const all = [game.target, ...(game.decoys || [])].sort(() => Math.random() - 0.5);
    return all;
  });
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
          let bg = 'var(--surface-strong)'; let border = '2px solid var(--line)';
          if (answered) {
            if (correct)          { bg = '#eafaf1'; border = '2px solid #27AE60'; }
            else if (chosen)      { bg = '#fef0f0'; border = '2px solid #e74c3c'; }
          }
          return (
            <button key={c} type="button" onClick={() => pick(c)}
              style={{ background: bg, border, borderRadius: 14, padding: '12px 16px', fontWeight: 700, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', textAlign: 'left' }}>
              {answered && correct && '✅ '}{answered && chosen && !correct && '❌ '}{c}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 16 }}>
          Continuer →
        </button>
      )}
    </div>
  );
}

function MiniGameMatch({ game, onDone }) {
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const lefts  = game.pairs.map((p) => p.a);
  const rights = game.pairs.map((p) => p.b);

  function tapLeft(a) {
    if (confirmed) return;
    setLeftSel(leftSel === a ? null : a);
  }
  function tapRight(b) {
    if (confirmed || !leftSel) return;
    setMatched((prev) => ({ ...prev, [leftSel]: b }));
    setLeftSel(null);
  }

  const allMatched = Object.keys(matched).length === game.pairs.length;

  function verify() { setConfirmed(true); }

  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lefts.map((a) => (
            <button key={a} type="button" onClick={() => tapLeft(a)}
              style={{
                background: leftSel === a ? 'var(--primary)' : confirmed ? (matched[a] === game.pairs.find((p) => p.a === a)?.b ? '#eafaf1' : '#fef0f0') : matched[a] ? '#eaf4fb' : 'var(--surface-strong)',
                border: leftSel === a ? '2px solid var(--primary-strong)' : '2px solid var(--line)',
                borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem',
              }}>
              {a}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rights.map((b) => {
            const isMatchedTo = Object.values(matched).includes(b);
            return (
              <button key={b} type="button" onClick={() => tapRight(b)}
                style={{
                  background: isMatchedTo ? '#eaf4fb' : 'var(--surface-strong)',
                  border: '2px solid var(--line)',
                  borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem',
                }}>
                {b}
              </button>
            );
          })}
        </div>
      </div>
      {!confirmed && allMatched && (
        <button type="button" className="story-btn story-btn--primary" onClick={verify} style={{ marginTop: 12 }}>
          Verifier !
        </button>
      )}
      {confirmed && (
        <>
          <p style={{ fontWeight: 800, marginTop: 10, color: '#27AE60' }}>✅ Super ! Tu as tout associe !</p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone} style={{ marginTop: 8 }}>
            Continuer →
          </button>
        </>
      )}
    </div>
  );
}

function MiniGameDispatch({ game, onDone }) {
  switch (game.type) {
    case 'choice':   return <MiniGameChoice   game={game} onDone={onDone} />;
    case 'count':    return <MiniGameCount    game={game} onDone={onDone} />;
    case 'sequence': return <MiniGameSequence game={game} onDone={onDone} />;
    case 'find':     return <MiniGameFind     game={game} onDone={onDone} />;
    case 'match':    return <MiniGameMatch    game={game} onDone={onDone} />;
    default:
      return (
        <div className="story-minigame">
          <p>Mini-jeu non disponible.</p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone}>Continuer →</button>
        </div>
      );
  }
}

// ── Main reader ───────────────────────────────────────────────────────────────
export default function StoryReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conte = getConteById(id);

  const [phase, setPhase]         = useState(PHASE_SCENES);
  const [sceneIdx, setSceneIdx]   = useState(0);
  const [speaking, setSpeaking]   = useState(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  // cancel speech when navigating scenes
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
    speakText(textToRead, () => { setSpeaking(false); speakingRef.current = false; });
  }, [conte, sceneIdx]);

  if (!conte) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p>Conte introuvable.</p>
        <Link to="/stories">← Retour aux contes</Link>
      </div>
    );
  }

  const { palette, scenes, vocabulary, miniGame, emotionalMoment, rewardEmoji, rewardName } = conte;
  const totalScenes = scenes.length;
  const scene = scenes[sceneIdx];

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

  // ── Reward phase ────────────────────────────────────────────────────────────
  if (phase === PHASE_REWARD) {
    markRead(conte.id);
    return (
      <div style={{ minHeight: '100vh', background: palette.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, textAlign: 'center' }}>
        <span style={{ fontSize: '5rem', display: 'inline-block', animation: 'storyBounce 0.6s infinite alternate' }}>{rewardEmoji}</span>
        <h2 style={{ fontSize: '1.8rem', color: palette.primary, margin: 0 }}>{rewardName}</h2>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem' }}>⭐</span>
          <span style={{ fontSize: '2rem' }}>⭐</span>
        </div>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: 320 }}>Bravo ! Tu as termine ce conte et gagne une recompense !</p>
        <button
          type="button"
          className="story-btn story-btn--primary"
          onClick={() => navigate('/stories')}
        >
          Retour aux contes →
        </button>
      </div>
    );
  }

  // ── Emotional moment phase ──────────────────────────────────────────────────
  if (phase === PHASE_EMOTIONAL) {
    return (
      <div style={{ minHeight: '100vh', background: palette.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
        <span style={{ fontSize: '3rem' }}>💭</span>
        <span style={{
          display: 'inline-block', background: palette.primary, color: '#fff',
          borderRadius: 20, padding: '6px 18px', fontWeight: 800, fontSize: '1rem',
        }}>
          Je me sens : {emotionalMoment.feeling}
        </span>
        <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 360, lineHeight: 1.6, fontWeight: 600 }}>
          {emotionalMoment.prompt}
        </p>
        <button
          type="button"
          className="story-btn story-btn--primary"
          onClick={() => { fireConfetti(); setPhase(PHASE_REWARD); }}
        >
          J\'ai reflechi ✓
        </button>
      </div>
    );
  }

  // ── Mini-game phase ─────────────────────────────────────────────────────────
  if (phase === PHASE_MINIGAME) {
    return (
      <div style={{ minHeight: '100vh', background: palette.background, padding: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/stories" style={{ textDecoration: 'none', fontSize: '1.4rem' }}>←</Link>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: palette.primary }}>🎮 Mini-jeu</h2>
        </div>
        <MiniGameDispatch game={miniGame} onDone={() => setPhase(PHASE_EMOTIONAL)} />
      </div>
    );
  }

  // ── Vocabulary phase ────────────────────────────────────────────────────────
  if (phase === PHASE_VOCAB) {
    return (
      <div style={{ minHeight: '100vh', background: palette.background, padding: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/stories" style={{ textDecoration: 'none', fontSize: '1.4rem' }}>←</Link>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: palette.primary }}>📚 Vocabulaire</h2>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {vocabulary.map((v) => (
            <div key={v.word} className="story-vocab-card" style={{ background: 'var(--surface-strong)', borderRadius: 16, padding: '14px 18px', border: '1.5px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '2rem' }}>{v.emoji}</span>
              <div>
                <strong style={{ fontSize: '1rem', color: palette.primary }}>{v.word}</strong>
                <p style={{ margin: 0, fontSize: '.88rem', color: '#555', marginTop: 2 }}>{v.meaning}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="story-btn story-btn--primary"
          style={{ marginTop: 28, width: '100%' }}
          onClick={() => setPhase(PHASE_MINIGAME)}
        >
          Mini-jeu →
        </button>
      </div>
    );
  }

  // ── Scenes phase (default) ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: palette.background, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(0,0,0,.06)' }}>
        <Link to="/stories" style={{ textDecoration: 'none', fontSize: '1.3rem', color: palette.primary }} onClick={stopSpeech}>←</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: palette.primary }}>{conte.emoji} {conte.title}</div>
          <div style={{ fontSize: '.78rem', color: '#888' }}>Scene {sceneIdx + 1} / {totalScenes}</div>
        </div>
        <button
          type="button"
          onClick={handleSpeak}
          title={speaking ? 'Arreter la lecture' : 'Lire a voix haute'}
          style={{ background: speaking ? palette.primary : 'transparent', border: `2px solid ${palette.primary}`, borderRadius: 50, width: 40, height: 40, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          🔊
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(0,0,0,.08)' }}>
        <div style={{ height: '100%', background: palette.primary, width: `${((sceneIdx + 1) / totalScenes) * 100}%`, transition: 'width .3s ease' }} />
      </div>

      {/* Scene content */}
      <div style={{ flex: 1, padding: '32px 24px', maxWidth: 640, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.75, color: '#2d2d2d', fontWeight: 500, margin: 0 }}>
          {scene.text}
        </p>

        {scene.dialogue && (
          <div className="story-speech-bubble" style={{
            background: palette.accent,
            borderRadius: '0 18px 18px 18px',
            padding: '14px 18px',
            position: 'relative',
            borderLeft: `4px solid ${palette.primary}`,
          }}>
            <div style={{ fontWeight: 800, fontSize: '.82rem', color: palette.primary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>{scene.dialogue.speaker}</div>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.05rem', color: '#333', lineHeight: 1.55 }}>
              &ldquo;{scene.dialogue.line}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: '16px 24px', display: 'flex', gap: 12, justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.06)' }}>
        <button
          type="button"
          onClick={goPrev}
          disabled={sceneIdx === 0}
          className="story-btn"
          style={{ opacity: sceneIdx === 0 ? 0.3 : 1, minWidth: 80 }}
        >
          ← Precedent
        </button>
        <button
          type="button"
          onClick={goNext}
          className="story-btn story-btn--primary"
          style={{ minWidth: 80 }}
        >
          {sceneIdx === totalScenes - 1 ? 'Vocabulaire →' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
