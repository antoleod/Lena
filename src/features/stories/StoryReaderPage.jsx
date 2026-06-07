import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConteById } from '../../content/stories/contes.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import './stories.css';
import '../../engines/story/storyActivity.css';

// ── i18n ─────────────────────────────────────────────────────────────────────
const STORY_UI = {
  fr: {
    scene:        (i, n) => `${i} / ${n}`,
    vocabulary:   'Vocabulaire',
    miniGame:     'Mini-jeu',
    emotional:    'Moment emotion',
    reward:       'Bravo !',
    prevScene:    '←',
    nextScene:    'Suivant',
    toVocab:      'Vocabulaire',
    toMiniGame:   'Jouer',
    toEmotional:  'Continuer',
    toReward:     'Terminer',
    muteOn:       'Activer le son',
    muteOff:      'Couper le son',
    backToLib:    'Bibliotheque',
    newStory:     'Nouvelle histoire',
    readAgain:    'Lire encore',
    finishedLabel:'Histoire terminee !',
    validate:     'Valider',
    correct:      'Bravo !',
    incorrect:    'Essaie encore...',
    notFound:     'Histoire introuvable.',
    noGame:       'Pas de mini-jeu.',
    speechLang:   'fr-FR',
  },
  nl: {
    scene:        (i, n) => `${i} / ${n}`,
    vocabulary:   'Woordenschat',
    miniGame:     'Mini-spel',
    emotional:    'Gevoelsmoment',
    reward:       'Goed gedaan!',
    prevScene:    '←',
    nextScene:    'Volgende',
    toVocab:      'Woordenschat',
    toMiniGame:   'Spelen',
    toEmotional:  'Doorgaan',
    toReward:     'Afsluiten',
    muteOn:       'Geluid aan',
    muteOff:      'Geluid uit',
    backToLib:    'Bibliotheek',
    newStory:     'Nieuw verhaal',
    readAgain:    'Opnieuw lezen',
    finishedLabel:'Verhaal klaar!',
    validate:     'Bevestigen',
    correct:      'Goed gedaan!',
    incorrect:    'Probeer opnieuw...',
    notFound:     'Verhaal niet gevonden.',
    noGame:       'Geen mini-spel.',
    speechLang:   'nl-NL',
  },
  en: {
    scene:        (i, n) => `${i} / ${n}`,
    vocabulary:   'Vocabulary',
    miniGame:     'Mini-game',
    emotional:    'Emotional moment',
    reward:       'Well done!',
    prevScene:    '←',
    nextScene:    'Next',
    toVocab:      'Vocabulary',
    toMiniGame:   'Play',
    toEmotional:  'Continue',
    toReward:     'Finish',
    muteOn:       'Unmute',
    muteOff:      'Mute',
    backToLib:    'Library',
    newStory:     'New story',
    readAgain:    'Read again',
    finishedLabel:'Story complete!',
    validate:     'Validate',
    correct:      'Well done!',
    incorrect:    'Try again...',
    notFound:     'Story not found.',
    noGame:       'No mini-game.',
    speechLang:   'en-US',
  },
  es: {
    scene:        (i, n) => `${i} / ${n}`,
    vocabulary:   'Vocabulario',
    miniGame:     'Minijuego',
    emotional:    'Momento emocional',
    reward:       'Muy bien!',
    prevScene:    '←',
    nextScene:    'Siguiente',
    toVocab:      'Vocabulario',
    toMiniGame:   'Jugar',
    toEmotional:  'Continuar',
    toReward:     'Terminar',
    muteOn:       'Activar sonido',
    muteOff:      'Silenciar',
    backToLib:    'Biblioteca',
    newStory:     'Nueva historia',
    readAgain:    'Leer de nuevo',
    finishedLabel:'Historia completada!',
    validate:     'Validar',
    correct:      'Bravo!',
    incorrect:    'Intentalo otra vez...',
    notFound:     'Historia no encontrada.',
    noGame:       'Sin minijuego.',
    speechLang:   'es-ES',
  },
};

// ── Per-story scene emoji pools ───────────────────────────────────────────────
const STORY_SCENE_EMOJIS = {
  'snow-white':               ['','','','',''],
  'cinderella':               ['\u{1F9F9}','\u{1F383}','\u{1F460}','\u{1F55B}','\u{1F48E}'],
  'little-red-riding-hood':   ['\u{1F9E3}','\u{1F332}','\u{1F98A}','\u{1FA93}','\u{1F35E}'],
  'hansel-and-gretel':        ['\u{1FAA8}','\u{1F332}','\u{1F36C}','\u{1F91D}','\u{1F319}'],
  'rapunzel':                 ['\u{1F5FC}','\u{1F3B5}','\u{1F31F}','\u{23F3}','\u{1F33F}'],
  'the-ugly-duckling':        ['\u{1F986}','\u{1F4A7}','\u{1F97A}','\u{1F342}','\u{1F9A2}'],
  'the-little-mermaid':       ['\u{1F41A}','\u{1F30A}','\u{1F420}','\u{2728}','\u{1F305}'],
  'beauty-and-the-beast':     ['\u{1F339}','\u{1F3F0}','\u{1F4DA}','\u{1F49B}','\u{2728}'],
  'the-three-little-pigs':    ['\u{1F437}','\u{1F33E}','\u{1FAB5}','\u{1F9F1}','\u{1F43A}'],
  'jack-and-the-beanstalk':   ['\u{1FAD8}','\u{2601}','\u{1F3F0}','\u{1FA99}','\u{1F331}'],
  'the-lion-and-the-mouse':   ['\u{1F981}','\u{1F42D}','\u{1F578}','\u{1F33F}','\u{1F91D}'],
  'the-tortoise-and-the-hare':['\u{1F422}','\u{1F407}','\u{1F3C3}','\u{1F634}','\u{1F3C6}'],
  'pinocchio':                ['\u{1FAB5}','\u{1F3AD}','\u{1F41F}','\u{1F31F}','\u{1F466}'],
  'ali-baba':                 ['\u{1FAF7}','\u{1F3DC}','\u{1F5DD}','\u{1F4B0}','\u{1F319}'],
  'little-prince':            ['\u{1F339}','\u{1F98A}','\u{1F30D}','\u{2B50}','\u{1FA90}'],
  'puss-in-boots':            ['\u{1F408}','\u{1F3A9}','\u{1F5E1}','\u{1F451}','\u{1F33E}'],
  'the-sleeping-beauty':      ['\u{1F339}','\u{1F9DA}','\u{1F4A4}','\u{1F451}','\u{1F496}'],
  'three-billy-goats-gruff':  ['\u{1F410}','\u{1F309}','\u{1F9CC}','\u{1F33F}','\u{1F304}'],
  'the-emperor-new-clothes':  ['\u{1F455}','\u{1F451}','\u{1F339}','\u{1F605}','\u{1F389}'],
  'goldilocks':               ['\u{1F43B}','\u{1F3E1}','\u{1F963}','\u{1F6CF}','\u{1F332}'],
};

const FALLBACK_EMOJIS = ['\u{1F31F}','\u{2728}','\u{1F3AD}','\u{1F319}','\u{1F332}','\u{1F3F0}','\u{1F30A}','\u{1F98B}','\u{1F33A}','\u{2B50}'];

function getSceneEmoji(storyId, idx) {
  const pool = STORY_SCENE_EMOJIS[storyId] || FALLBACK_EMOJIS;
  return pool[idx % pool.length];
}

// ── Derive dark page bg from story primary color ───────────────────────────
function darkBg(hex) {
  if (!hex || hex.length < 7) return '#0f0826';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r*.16)},${Math.round(g*.13)},${Math.round(b*.22 + 8)})`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getReadIds() {
  try { return JSON.parse(localStorage.getItem('lena:stories-read') || '[]'); }
  catch { return []; }
}
function markRead(id) {
  try {
    const ids = getReadIds();
    if (!ids.includes(id)) localStorage.setItem('lena:stories-read', JSON.stringify([...ids, id]));
  } catch (_) { /* ignore */ }
}

function fireConfetti() {
  const STYLE_ID = 'confetti-kf';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = '@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
  const colors = ['#f39c12','#e74c3c','#2ecc71','#3498db','#9b59b6','#1abc9c','#e67e22','#f1c40f'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.style.cssText = `position:absolute;top:0;left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation:confettiFall ${2+Math.random()*1.2}s ${Math.random()*.8}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 4500);
}

function speakText(text, lang, onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang; utt.rate = 0.9;
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

// ── Mini-games ────────────────────────────────────────────────────────────────
function MiniGameChoice({ game, onDone, ui }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options">
        {game.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,.1)', border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (i === game.answerIndex)       { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (i === selected)          { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button key={i} type="button" onClick={() => { if (!answered) setSelected(i); }}
              style={{ background: bg, border, borderRadius: 14, padding: '12px 16px', fontWeight: 700, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', textAlign: 'left', color: '#fff' }}>
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
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options story-minigame__options--row">
        {game.options.map((n) => {
          const correct = n === game.answer, chosen = n === selected;
          let bg = 'rgba(255,255,255,.1)', border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (correct)     { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (chosen) { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button key={n} type="button" onClick={() => { if (!answered) setSelected(n); }}
              style={{ background: bg, border, borderRadius: 14, padding: '16px 24px', fontWeight: 800, fontSize: '1.4rem', cursor: answered ? 'default' : 'pointer', minWidth: 64, color: '#fff' }}>
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
    if (selected === null) { setSelected(idx); return; }
    if (selected === idx)  { setSelected(null); return; }
    const next = [...order];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setOrder(next); setSelected(null);
  }
  function confirm() {
    const ok = order.every((item, i) => item.orig === i);
    setCorrect(ok); setConfirmed(true);
  }

  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', margin: '-6px 0 6px' }}>
        Appuie sur deux cases pour les echanger.
      </p>
      <div className="story-minigame__sequence">
        {order.map((item, i) => (
          <button key={item.orig} type="button" onClick={() => tap(i)}
            style={{
              background: selected === i ? 'var(--story-accent,#6366f1)' : confirmed ? (item.orig === i ? '#166534' : '#7f1d1d') : 'rgba(255,255,255,.1)',
              border: `2px solid ${selected === i ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.2)'}`,
              borderRadius: 12, padding: '12px 14px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
            }}>
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
            {correct ? '✅ ' + ui.correct : '❌ ' + ui.incorrect}
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
  const answered = selected !== null;
  return (
    <div className="story-minigame">
      <p className="story-minigame__prompt">{game.prompt}</p>
      <div className="story-minigame__options">
        {choices.map((c) => {
          const correct = c === game.target, chosen = c === selected;
          let bg = 'rgba(255,255,255,.1)', border = '2px solid rgba(255,255,255,.2)';
          if (answered) {
            if (correct)          { bg = '#166534'; border = '2px solid #22c55e'; }
            else if (chosen)      { bg = '#7f1d1d'; border = '2px solid #ef4444'; }
          }
          return (
            <button key={c} type="button" onClick={() => { if (!answered) setSelected(c); }}
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
  const allDone = Object.keys(matched).length === game.pairs.length;

  function tapLeft(a) {
    if (confirmed) return;
    setLeftSel(leftSel === a ? null : a);
  }
  function tapRight(b) {
    if (confirmed || !leftSel) return;
    const pair = game.pairs.find((p) => p.a === leftSel);
    if (pair && pair.b === b) {
      setMatched((prev) => ({ ...prev, [leftSel]: b }));
      setLeftSel(null);
    } else {
      setWrongFlash({ a: leftSel, b });
      setTimeout(() => { setWrongFlash(null); setLeftSel(null); }, 600);
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
          {game.pairs.map(({ a }) => {
            const isM = matched[a] !== undefined;
            const isS = leftSel === a;
            const isW = wrongFlash && wrongFlash.a === a;
            return (
              <button key={a} type="button" onClick={() => tapLeft(a)}
                style={{ background: isW ? '#7f1d1d' : isS ? 'var(--story-accent,#6366f1)' : isM ? '#166534' : 'rgba(255,255,255,.1)', border: `2px solid ${isW ? '#ef4444' : isS ? 'rgba(255,255,255,.4)' : isM ? '#22c55e' : 'rgba(255,255,255,.2)'}`, borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem', color: '#fff' }}>
                {a}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rights.map((b) => {
            const isM = Object.values(matched).includes(b);
            const isW = wrongFlash && wrongFlash.b === b;
            return (
              <button key={b} type="button" onClick={() => tapRight(b)}
                style={{ background: isW ? '#7f1d1d' : isM ? '#166534' : 'rgba(255,255,255,.1)', border: `2px solid ${isW ? '#ef4444' : isM ? '#22c55e' : 'rgba(255,255,255,.2)'}`, borderRadius: 12, padding: '10px 12px', fontWeight: 700, cursor: confirmed ? 'default' : 'pointer', textAlign: 'center', fontSize: '.9rem', color: '#fff' }}>
                {b}
              </button>
            );
          })}
        </div>
      </div>
      {confirmed && <p style={{ fontWeight: 800, marginTop: 10, color: '#22c55e' }}>{ui.correct}</p>}
    </div>
  );
}

function MiniGameDispatch({ game, onDone, ui }) {
  if (!game) return (
    <div className="story-minigame">
      <p style={{ textAlign: 'center', opacity: .7, color: '#fff' }}>{ui.noGame}</p>
      <button type="button" className="story-btn story-btn--primary" onClick={onDone}>{ui.toEmotional}</button>
    </div>
  );
  switch (game.type) {
    case 'choice':   return <MiniGameChoice   game={game} onDone={onDone} ui={ui} />;
    case 'count':    return <MiniGameCount    game={game} onDone={onDone} ui={ui} />;
    case 'sequence': return <MiniGameSequence game={game} onDone={onDone} ui={ui} />;
    case 'find':     return <MiniGameFind     game={game} onDone={onDone} ui={ui} />;
    case 'match':    return <MiniGameMatch    game={game} onDone={onDone} ui={ui} />;
    default:
      return (
        <div className="story-minigame">
          <p style={{ color: '#fff' }}>{ui.noGame}</p>
          <button type="button" className="story-btn story-btn--primary" onClick={onDone}>{ui.toEmotional}</button>
        </div>
      );
  }
}

// ── Shared phase header ───────────────────────────────────────────────────────
function PhaseHeader({ conte, tag, onBack }) {
  return (
    <header className="sr-phase-header">
      <button type="button" className="sr-phase-header__back" onClick={onBack}>←</button>
      <h1 className="sr-phase-header__title">{conte.emoji} {conte.title}</h1>
      <span className="sr-phase-tag">{tag}</span>
    </header>
  );
}

// ── Floating dust particles ───────────────────────────────────────────────────
function DustParticles() {
  const particles = [
    { size: 4,  left: '18%', bottom: '30%', duration: '7s',  delay: '0s'   },
    { size: 3,  left: '35%', bottom: '25%', duration: '9s',  delay: '1.5s' },
    { size: 5,  left: '52%', bottom: '20%', duration: '6s',  delay: '0.8s' },
    { size: 3,  left: '68%', bottom: '35%', duration: '11s', delay: '2s'   },
    { size: 4,  left: '82%', bottom: '28%', duration: '8s',  delay: '3s'   },
    { size: 2,  left: '25%', bottom: '15%', duration: '10s', delay: '1s'   },
    { size: 3,  left: '75%', bottom: '18%', duration: '7.5s',delay: '4s'   },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="sa-dust-particle"
          style={{
            width: p.size, height: p.size,
            left: p.left, bottom: p.bottom,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
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
  const [turning, setTurning]   = useState(false);
  const bookRef                  = useRef(null);
  const swipeRef                 = useRef({ startX: 0, startY: 0 });

  useEffect(() => {
    if (!conte) return;
    if (phase === PHASE_REWARD) markRead(conte.id);
  }, [conte, phase]);

  useEffect(() => () => stopSpeech(), []);
  useEffect(() => {
    stopSpeech();
    setSpeaking(false);
    speakingRef.current = false;
  }, [sceneIdx]);

  const handleSpeak = useCallback(() => {
    if (!conte) return;
    if (speakingRef.current) {
      stopSpeech(); setSpeaking(false); speakingRef.current = false; return;
    }
    const scene = conte.scenes[sceneIdx];
    const text = scene.dialogue
      ? `${scene.text} ${scene.dialogue.speaker} dit : ${scene.dialogue.line}`
      : scene.text;
    setSpeaking(true); speakingRef.current = true;
    speakText(text, ui.speechLang, () => { setSpeaking(false); speakingRef.current = false; });
  }, [conte, sceneIdx, ui.speechLang]);

  if (!conte) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#fff' }}>
        <p>{ui.notFound}</p>
        <button type="button" onClick={() => navigate('/stories')}
          style={{ color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          ← {ui.backToLib}
        </button>
      </div>
    );
  }

  const { palette, scenes, vocabulary, miniGame, emotionalMoment, rewardEmoji, rewardName } = conte;
  const storyAccent = palette?.primary    || '#6366f1';
  const bookBg      = palette?.background || '#fffef7';
  const darkPage    = darkBg(storyAccent);

  const pageStyle = {
    '--story-accent': storyAccent,
    '--book-bg':      bookBg,
    '--book-text':    '#1a1a2e',
    background:       `linear-gradient(160deg, ${darkPage} 0%, ${storyAccent}1a 55%, ${darkPage} 100%)`,
  };

  const totalScenes = scenes.length;
  const scene = scenes[sceneIdx];

  function spawnSparkles(container) {
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('span');
      el.textContent = '✨';
      el.style.cssText = `position:absolute;left:${20 + Math.random() * 60}%;top:${20 + Math.random() * 60}%;font-size:${14 + Math.random() * 10}px;pointer-events:none;animation:saSpark .8s ${Math.random() * .3}s ease-out forwards;z-index:10;`;
      container.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1100);
    }
  }

  function triggerPageTurn(callback) {
    setTurning(true);
    if (bookRef.current) spawnSparkles(bookRef.current);
    setTimeout(() => {
      setTurning(false);
      callback();
    }, 500);
  }

  function goNext() {
    triggerPageTurn(() => {
      if (sceneIdx < totalScenes - 1) setSceneIdx(sceneIdx + 1);
      else setPhase(PHASE_VOCAB);
    });
  }
  function goPrev() {
    if (sceneIdx > 0) triggerPageTurn(() => setSceneIdx(sceneIdx - 1));
  }
  function goBack() { stopSpeech(); navigate('/stories'); }

  function onTouchStart(e) {
    swipeRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - swipeRef.current.startX;
    const dy = e.changedTouches[0].clientY - swipeRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  // ── REWARD ────────────────────────────────────────────────────────────────
  if (phase === PHASE_REWARD) {
    return (
      <div className="sr-page" style={pageStyle}>
        <div className="sr-reward">
          <span className="sr-reward__emoji">{rewardEmoji}</span>
          <h2 className="sr-reward__name">{rewardName}</h2>
          <p className="sr-reward__label">{ui.finishedLabel}</p>
          <div className="sr-reward__stars">
            <span className="sr-reward__star">⭐</span>
            <span className="sr-reward__star">⭐</span>
            <span className="sr-reward__star">⭐</span>
          </div>
          <div className="sr-reward__actions">
            <button type="button" className="story-btn story-btn--primary" onClick={() => navigate('/stories')}>
              📚 {ui.newStory}
            </button>
            <button type="button" className="story-btn" onClick={() => { setPhase(PHASE_SCENES); setSceneIdx(0); }}>
              🔄 {ui.readAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EMOTIONAL ─────────────────────────────────────────────────────────────
  if (phase === PHASE_EMOTIONAL) {
    return (
      <div className="sr-page" style={pageStyle}>
        <div className="sr-emotional">
          <span className="sr-emotional__icon">💭</span>
          <span className="sr-emotional__badge">{emotionalMoment.feeling}</span>
          <p className="sr-emotional__prompt">{emotionalMoment.prompt}</p>
          <button type="button" className="story-btn story-btn--primary"
            onClick={() => { fireConfetti(); setPhase(PHASE_REWARD); }}>
            {ui.toReward} ✨
          </button>
        </div>
      </div>
    );
  }

  // ── MINI-GAME ─────────────────────────────────────────────────────────────
  if (phase === PHASE_MINIGAME) {
    return (
      <div className="sr-page" style={pageStyle}>
        <PhaseHeader conte={conte} tag="🎮" onBack={goBack} />
        <div className="sr-minigame-body">
          <span className="sr-minigame-eyebrow">{ui.miniGame}</span>
          <MiniGameDispatch game={miniGame} onDone={() => setPhase(PHASE_EMOTIONAL)} ui={ui} />
        </div>
      </div>
    );
  }

  // ── VOCABULARY ────────────────────────────────────────────────────────────
  if (phase === PHASE_VOCAB) {
    return (
      <div className="sr-page" style={pageStyle}>
        <PhaseHeader conte={conte} tag="📖" onBack={goBack} />
        <div className="sr-vocab-list">
          {vocabulary.map((v) => (
            <div key={v.word} className="sr-vocab-card">
              <span className="sr-vocab-card__emoji">{v.emoji}</span>
              <div>
                <div className="sr-vocab-card__word">{v.word}</div>
                <div className="sr-vocab-card__meaning">{v.meaning}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sr-nav">
          <button type="button" className="sr-nav-btn sr-nav-btn--next"
            onClick={() => setPhase(PHASE_MINIGAME)}>
            {ui.toMiniGame} →
          </button>
        </div>
      </div>
    );
  }

  // ── SCENES — magic book ───────────────────────────────────────────────────
  const firstChar = scene.text.charAt(0);
  const restText  = scene.text.slice(1);

  return (
    <div
      className="sa-book-wrap"
      style={{ '--story-accent': storyAccent }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <DustParticles />

      {/* Top bar */}
      <header className="sa-topbar">
        <button type="button" className="sa-topbar__back" onClick={goBack} aria-label={ui.backToLib}>
          ←
        </button>
        <h1 className="sa-topbar__title">{conte.emoji} {conte.title}</h1>
        <div className="sa-progress-dots" aria-hidden="true">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`sa-dot${i < sceneIdx ? ' done' : i === sceneIdx ? ' current' : ''}`}
            />
          ))}
        </div>
        <button
          type="button"
          className={`sa-topbar__speak${speaking ? ' sa-topbar__speak--active' : ''}`}
          onClick={handleSpeak}
          title={speaking ? ui.muteOff : ui.muteOn}
        >
          🔊
        </button>
      </header>

      {/* Leather-bound book */}
      <div className="sa-book-outer">
        <div className="sa-book" ref={bookRef}>
          <div className="sa-bookmark" aria-hidden="true" />

          {/* Left page — illustration */}
          <div className="sa-page-left">
            <div className="sa-illustration-frame">
              <span className="sa-scene-emoji" role="img" aria-hidden="true">
                {getSceneEmoji(conte.id, sceneIdx)}
              </span>
            </div>
            <span className="sa-page-num">{sceneIdx * 2 + 1}</span>
          </div>

          {/* Right page — story text */}
          <div className={`sa-page-right${turning ? ' is-turning' : ''}`}>
            <div className="sa-page-right-vignette" aria-hidden="true" />
            <p className="sa-story-text">
              <span className="sa-drop-cap" aria-hidden="true">{firstChar}</span>
              {restText}
            </p>
            {scene.dialogue && (
              <>
                <div className="sa-divider" aria-hidden="true">
                  <span className="sa-divider__ornament">❧</span>
                </div>
                <div className="sa-dialogue">
                  <span className="sa-dialogue__speaker">{scene.dialogue.speaker}</span>
                  <p className="sa-dialogue__line">&laquo;&nbsp;{scene.dialogue.line}&nbsp;&raquo;</p>
                </div>
              </>
            )}
            <span className="sa-page-num">{sceneIdx * 2 + 2}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sa-nav">
        <button
          type="button"
          className="sa-nav-btn"
          onClick={goPrev}
          disabled={sceneIdx === 0 || turning}
          aria-label={ui.prevScene}
        >
          ←
        </button>
        <button
          type="button"
          className="sa-nav-btn sa-nav-btn--next"
          onClick={goNext}
          disabled={turning}
        >
          {sceneIdx === totalScenes - 1 ? `${ui.toVocab} →` : `${ui.nextScene} →`}
        </button>
      </nav>
    </div>
  );
}
