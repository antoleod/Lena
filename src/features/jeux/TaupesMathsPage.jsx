import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const TOTAL_TIME = 60;
const MOLE_VISIBLE_MS = 2000;
const MOLE_INTERVAL_MS = 2000;

function generateProblem(level) {
  const ops = level === 'hard' ? ['+', '-', '*'] : level === 'medium' ? ['+', '-'] : ['+'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 10) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 10) + 5; b = Math.floor(Math.random() * a) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 5) + 2; b = Math.floor(Math.random() * 5) + 2; answer = a * b; }
  return { text: `${a}${op}${b}`, answer };
}

function generateChoices(answer) {
  const choices = new Set([answer]);
  while (choices.size < 3) {
    const delta = Math.floor(Math.random() * 5) + 1;
    const v = Math.random() < 0.5 ? answer + delta : Math.max(1, answer - delta);
    choices.add(v);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

function starsForScore(score) {
  if (score >= 80) return '★★★';
  if (score >= 40) return '★★☆';
  if (score >= 10) return '★☆☆';
  return '☆☆☆';
}

export default function TaupesMathsPage() {
  const [phase, setPhase] = useState('setup'); // setup | play | results
  const [level, setLevel] = useState('easy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [moles, setMoles] = useState(Array(9).fill(null)); // null or { text, answer }
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [activeMole, setActiveMole] = useState(null); // index of active mole
  const feedbackTimer = useRef(null);
  const moleHideTimer = useRef(null);
  const moleShowInterval = useRef(null);
  const clockInterval = useRef(null);

  const spawnMole = useCallback(() => {
    const problem = generateProblem(level);
    const idx = Math.floor(Math.random() * 9);
    setMoles(prev => {
      const next = [...prev];
      next[idx] = problem;
      return next;
    });
    setActiveMole(idx);
    setChoices(generateChoices(problem.answer));

    if (moleHideTimer.current) clearTimeout(moleHideTimer.current);
    moleHideTimer.current = setTimeout(() => {
      setMoles(prev => {
        const next = [...prev];
        next[idx] = null;
        return next;
      });
      setActiveMole(null);
    }, MOLE_VISIBLE_MS);
  }, [level]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setMoles(Array(9).fill(null));
    setActiveMole(null);
    setFeedback('');
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    spawnMole();
    moleShowInterval.current = setInterval(spawnMole, MOLE_INTERVAL_MS);
    clockInterval.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(moleShowInterval.current);
          clearInterval(clockInterval.current);
          clearTimeout(moleHideTimer.current);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(moleShowInterval.current);
      clearInterval(clockInterval.current);
      clearTimeout(moleHideTimer.current);
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (choice) => {
    if (activeMole === null) return;
    const mole = moles[activeMole];
    if (!mole) return;
    if (choice === mole.answer) {
      setScore(s => s + 10);
      setFeedback('+10 ! Bravo !');
      setMoles(prev => { const n = [...prev]; n[activeMole] = null; return n; });
      setActiveMole(null);
      clearTimeout(moleHideTimer.current);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(''), 800);
    } else {
      setScore(s => s - 5);
      setFeedback('-5 ! Essaie encore !');
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(''), 800);
    }
  };

  const handleHoleTap = (idx) => {
    if (idx !== activeMole) return;
  };

  if (phase === 'setup') {
    return (
      <div className="tm-page">
        <div className="tm-setup-icon">🦔</div>
        <div className="tm-setup-title">Taupes Maths</div>
        <div className="tm-setup-sub">Tape la bonne reponse avant que la taupe disparaisse !</div>
        <div style={{ marginBottom: 20 }}>
          {['easy', 'medium', 'hard'].map(l => (
            <button
              key={l}
              className={`tm-cta${level === l ? '' : ' tm-cta--soft'}`}
              style={{ marginBottom: 10, display: 'block' }}
              onPointerDown={() => setLevel(l)}
            >
              {l === 'easy' ? 'Facile (+)' : l === 'medium' ? 'Moyen (+-)' : 'Difficile (x)'}
            </button>
          ))}
        </div>
        <button className="tm-cta" onPointerDown={startGame}>C'est parti !</button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/jeux" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Retour aux jeux</Link>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsForScore(score);
    return (
      <div className="tm-page">
        <div className="tm-result-title">Temps ecoule !</div>
        <div className="jeux-stars">{stars}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="tm-cta" onPointerDown={startGame}>Rejouer</button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-page">
      <div className="tm-header">
        <Link to="/jeux" className="tm-back">← Jeux</Link>
        <div className="tm-title">Taupes Maths</div>
      </div>
      <div className="tm-hud">
        <div className="tm-score">Score : {score}</div>
        <div className={`tm-timer${timeLeft <= 10 ? ' tm-timer--urgent' : ''}`}>{timeLeft}s</div>
      </div>
      <div className="tm-grid">
        {moles.map((mole, idx) => (
          <div key={idx} className="tm-hole" onPointerDown={() => handleHoleTap(idx)}>
            {mole && (
              <div className="tm-mole">
                <span className="tm-mole-emoji">🦔</span>
                <span className="tm-mole-problem">{mole.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`tm-feedback${feedback.startsWith('+') ? ' tm-feedback--ok' : feedback ? ' tm-feedback--bad' : ''}`}>
        {feedback}
      </div>
      <div className="tm-choices">
        {choices.map((c, i) => (
          <button key={i} className="tm-choice" onPointerDown={() => handleChoice(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
