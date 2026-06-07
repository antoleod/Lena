import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const ALL_RIDDLES = [
  // Level 1 — very easy, obvious
  { q:'Je suis jaune. Les singes m\'adorent. Qui suis-je ?', opts:['Pomme','Banane','Cerise','Raisin'], ans:1, level:1 },
  { q:'J\'ai quatre pattes et je ronronne. Qui suis-je ?', opts:['Chien','Chat','Lapin','Renard'], ans:1, level:1 },
  { q:'Je tombe l\'hiver et je suis blanche. Qui suis-je ?', opts:['Pluie','Neige','Grele','Brouillard'], ans:1, level:1 },
  { q:'Je chante le matin pour reveiller les fermiers. Qui suis-je ?', opts:['Vache','Coq','Mouton','Cheval'], ans:1, level:1 },
  { q:'Je suis rouge, ronde et sucree. On me mange. Qui suis-je ?', opts:['Une pomme','Une balle','Un ballon','Un chapeau'], ans:0, level:1 },
  { q:'J\'aboie et je suis le meilleur ami de l\'homme. Qui suis-je ?', opts:['Un chat','Un chien','Un lapin','Un oiseau'], ans:1, level:1 },
  { q:'Je suis jaune le jour, sombre la nuit. Qui suis-je ?', opts:['Le soleil','La lune','Une lampe','Un citron'], ans:0, level:1 },
  { q:'Je pousse sur les arbres, je tombe en automne. Qui suis-je ?', opts:['Un fruit','Une feuille','Un oiseau','Une fleur'], ans:1, level:1 },
  { q:'Je coule dans les robinets. On me boit. Qui suis-je ?', opts:['Lait','Jus','Sirop','Eau'], ans:3, level:1 },
  { q:'Je fais du lait. Je vais au pre. Qui suis-je ?', opts:['Chevre','Vache','Brebis','Ane'], ans:1, level:1 },
  // Level 2 — easy but needs one step of reasoning
  { q:'On me lit, on me feuillette, je contiens des histoires. Qui suis-je ?', opts:['Journal','Livre','Cahier','Affiche'], ans:1, level:2 },
  { q:'Je nage dans la mer. J\'ai des nageoires. Qui suis-je ?', opts:['Dauphin','Poisson','Crabe','Baleine'], ans:1, level:2 },
  { q:'Je sers a ecrire. J\'ai une mine. Qui suis-je ?', opts:['Stylo','Crayon','Feutre','Pinceau'], ans:1, level:2 },
  { q:'On me taille et j\'ecris. Qui suis-je ?', opts:['Un crayon','Un stylo','Une gomme','Une regle'], ans:0, level:2 },
  { q:'J\'ai des ailes mais je ne suis pas un oiseau. Je fabrique du miel. Qui suis-je ?', opts:['Une guepe','Un papillon','Une abeille','Une mouche'], ans:2, level:2 },
  { q:'Je vis dans l\'eau et je respire par des branchies. Qui suis-je ?', opts:['Une grenouille','Un poisson','Un crabe','Un dauphin'], ans:1, level:2 },
  { q:'J\'ai des aiguilles mais je ne couds pas. Qui suis-je ?', opts:['Un sapin','Une horloge','Un cactus','Un herisson'], ans:0, level:2 },
  { q:'Je grandis dans la terre. Je suis orange. Les lapins m\'adorent. Qui suis-je ?', opts:['Radis','Navet','Carotte','Patate'], ans:2, level:2 },
  { q:'Je suis froid et sucre. On me mange l\'ete. Qui suis-je ?', opts:['Yaourt','Gateau','Glace','Confiture'], ans:2, level:2 },
  { q:'Je tombe sans jamais me blesser. Qui suis-je ?', opts:['La neige','La pluie','Les feuilles','Les etoiles'], ans:1, level:2 },
  // Level 3 — requires logic
  { q:'Je suis plein de trous mais je retiens l\'eau. Qui suis-je ?', opts:['Un seau','Une eponge','Un tamis','Une passoire'], ans:1, level:3 },
  { q:'Plus je grandis, plus je rapetisse. Qui suis-je ?', opts:['Un enfant','Une bougie','Une plante','Un ballon'], ans:1, level:3 },
  { q:'Je parle toutes les langues mais je ne dis rien. Qui suis-je ?', opts:['Un livre','Un dictionnaire','Une oreille','Un miroir'], ans:1, level:3 },
  { q:'Je cours sans jamais me fatiguer. Qui suis-je ?', opts:['Un cheval','L\'eau d\'une riviere','Un velo','Une voiture'], ans:1, level:3 },
  { q:'J\'ai deux tetes mais un seul corps. Qui suis-je ?', opts:['Un marteau','Des ciseaux','Un sablier','Un manche a balai'], ans:2, level:3 },
  { q:'Plus je seche, plus je suis mouillee. Qui suis-je ?', opts:['Une serviette','Une eponge','Une bougie','Un nuage'], ans:1, level:3 },
  { q:'J\'ai un long cou et je mange les feuilles des grands arbres. Qui suis-je ?', opts:['Elephant','Girafe','Chameau','Antilope'], ans:1, level:3 },
  { q:'Je suis ronde, rouge ou verte. On me croque. Qui suis-je ?', opts:['Orange','Pomme','Tomate','Balle'], ans:1, level:3 },
  // Level 4 — tricky riddles
  { q:'Je suis toujours devant vous mais impossible a voir. Qui suis-je ?', opts:['Le futur','L\'ombre','L\'air','Le temps'], ans:0, level:4 },
  { q:'Je pese la meme chose qu\'un kilo de plumes. Qui suis-je ?', opts:['Un kilo de fer','Un kilo de coton','Un kilo de plumes','Un kilo de pierre'], ans:2, level:4 },
  { q:'Je voyage partout mais reste dans un coin. Qui suis-je ?', opts:['Un timbre','Une valise','Un avion','Un passeport'], ans:0, level:4 },
  { q:'Je n\'ai qu\'un pied mais je porte une tete. Qui suis-je ?', opts:['Un clou','Un champignon','Une fleur','Un homme'], ans:1, level:4 },
  { q:'Je suis le fils de ton pere mais pas ton frere. Qui suis-je ?', opts:['Ton oncle','Toi-meme','Ton cousin','Ton demi-frere'], ans:1, level:4 },
  { q:'Plus on m\'utilise, plus je m\'use. Qui suis-je ?', opts:['Un crayon','Une gomme','Un livre','Un velo'], ans:1, level:4 },
  // Level 5 — advanced / wordplay
  { q:'Enleve ma tete, j\'ai encore la queue. Enleve ma queue, j\'ai encore la tete. Qui suis-je ?', opts:['Une comete','Un tetard','Un poisson','Une grenouille'], ans:1, level:5 },
  { q:'Je commence la nuit et je finis le matin. Qui suis-je ?', opts:['La lettre N','Un reve','La lettre M','Les etoiles'], ans:0, level:5 },
  { q:'On me brise des qu\'on me prononce. Qui suis-je ?', opts:['Le silence','Un voeu','Un secret','Une promesse'], ans:0, level:5 },
  { q:'J\'ai des dents mais je ne mords pas. Qui suis-je ?', opts:['Un peigne','Une scie','Une fourchette','Un engrenage'], ans:0, level:5 },
  { q:'Plus on me prend, plus on me laisse. Qui suis-je ?', opts:['La liberte','Une empreinte','Le temps','Des photos'], ans:1, level:5 },
  { q:'J\'eclaire la nuit. Je suis dans le ciel. Qui suis-je ?', opts:['Etoile','Soleil','Lune','Nuage'], ans:2, level:5 },
];

const LEVEL_CONFIG = [
  { id:1,  label:'N1',  n:6,  choices:3, poolLvl:[1],   timePerQ:null },
  { id:2,  label:'N2',  n:6,  choices:3, poolLvl:[1],   timePerQ:null },
  { id:3,  label:'N3',  n:8,  choices:3, poolLvl:[1,2], timePerQ:null },
  { id:4,  label:'N4',  n:8,  choices:4, poolLvl:[1,2], timePerQ:null },
  { id:5,  label:'N5',  n:8,  choices:4, poolLvl:[1,2], timePerQ:30   },
  { id:6,  label:'N6',  n:10, choices:4, poolLvl:[2],   timePerQ:30   },
  { id:7,  label:'N7',  n:10, choices:4, poolLvl:[2],   timePerQ:25   },
  { id:8,  label:'N8',  n:10, choices:4, poolLvl:[2,3], timePerQ:25   },
  { id:9,  label:'N9',  n:10, choices:4, poolLvl:[2,3], timePerQ:20   },
  { id:10, label:'N10', n:12, choices:4, poolLvl:[3],   timePerQ:20   },
  { id:11, label:'N11', n:12, choices:4, poolLvl:[3,4], timePerQ:20   },
  { id:12, label:'N12', n:12, choices:4, poolLvl:[3,4], timePerQ:15   },
  { id:13, label:'N13', n:15, choices:4, poolLvl:[4,5], timePerQ:15   },
  { id:14, label:'N14', n:15, choices:4, poolLvl:[4,5], timePerQ:12   },
  { id:15, label:'N15', n:15, choices:4, poolLvl:[5],   timePerQ:10   },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(cfg) {
  const pool = ALL_RIDDLES.filter(r => cfg.poolLvl.includes(r.level));
  return shuffle(pool).slice(0, cfg.n);
}

function buildChoices(riddle, cfg) {
  // Use the riddle's own opts, but trim/expand to cfg.choices count
  const correct = riddle.opts[riddle.ans];
  const others = riddle.opts.filter((_, i) => i !== riddle.ans);
  const wrongs = shuffle(others).slice(0, cfg.choices - 1);
  return shuffle([correct, ...wrongs]);
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export default function DevinettesPage() {
  const { progress, saveSession, resetTimer } = useGameSession('devinettes');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [round, setRound] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [qTimer, setQTimer] = useState(null);
  const [qTimerPct, setQTimerPct] = useState(100);

  const qTimerRef = useRef(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  // Per-question timer
  useEffect(() => {
    if (phase !== 'play' || !cfg.timePerQ) return;
    setQTimer(cfg.timePerQ);
    setQTimerPct(100);
    clearInterval(qTimerRef.current);
    qTimerRef.current = setInterval(() => {
      setQTimer(t => {
        if (t <= 1) {
          clearInterval(qTimerRef.current);
          advanceAfterPick(false);
          return 0;
        }
        setQTimerPct(((t - 1) / cfg.timePerQ) * 100);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current);
  }, [phase, idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function advanceAfterPick(correct) {
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 600 : 1200);
  }

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const r = buildRound(c);
    setRound(r);
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  const riddle = round[idx] || null;
  const choices = riddle ? buildChoices(riddle, cfg) : [];
  const correctAnswer = riddle ? riddle.opts[riddle.ans] : null;

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null || !riddle) return;
    clearInterval(qTimerRef.current);
    const correct = choice === correctAnswer;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    advanceAfterPick(correct);
  }, [picked, riddle, correctAnswer, idx, round]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save on results phase
  useEffect(() => {
    if (phase === 'results' && round.length > 0) {
      const stars = calcStars(score, round.length);
      const result = saveSession({ score, level: selectedLevel, stars });
      setSessionResult(result);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return (
      <div className="dv-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="dv-result-title" style={{ fontSize: '1.6rem', margin: '16px 0 4px' }}>🤔 Devinettes</h1>
        <p style={{ textAlign: 'center', opacity: .7, marginBottom: 16 }}>Resous les enigmes !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lc => {
            const locked = lc.id > progress.unlockedLevel;
            const sel = lc.id === selectedLevel;
            return (
              <button
                key={lc.id}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lc.id); }}
                disabled={locked}
              >
                {locked ? '🔒' : lc.label}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.n} questions</span>
          {cfg.timePerQ && <span>⏱ {cfg.timePerQ}s/question</span>}
        </div>

        <button className="dv-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="dv-page">
        <h2 className="dv-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}
        <button className="dv-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <button className="dv-cta" style={{ marginTop: 8, background: 'rgba(255,255,255,.1)' }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>
          Niveaux
        </button>
        <Link to="/jeux" className="dv-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  if (!riddle) return null;

  return (
    <div className="dv-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="dv-hud">
        <span className="dv-progress">Question {idx + 1} / {round.length}</span>
        <span className="dv-score">⭐ {score}</span>
      </div>

      {cfg.timePerQ && (
        <div className="sm-timer-bar" style={{ marginBottom: 8 }}>
          <div className="sm-timer-fill" style={{ width: `${qTimerPct}%`, background: qTimerPct < 30 ? '#ef4444' : '#22c55e' }} />
        </div>
      )}

      <div className="dv-riddle-card">
        <div className="dv-riddle-emoji">🤔</div>
        <p className="dv-riddle-text">{riddle.q}</p>
      </div>

      <div className="dv-choices">
        {choices.map((c, ci) => {
          let cls = 'dv-choice';
          if (picked !== null) {
            if (c === correctAnswer) cls += ' dv-choice--correct';
            else if (picked === ci) cls += ' dv-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' dv-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(c, ci); }}
              disabled={picked !== null}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
