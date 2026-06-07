import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ── Level configs ──────────────────────────────────────────────────────────

const LEVEL_CONFIG = [
  { n: 1, label: 'Niveau 1', desc: '1 chiffre, 4 essais, 3 manches',  digits: 1, maxAttempts: 4, totalRounds: 3 },
  { n: 2, label: 'Niveau 2', desc: '2 chiffres, 6 essais, 5 manches', digits: 2, maxAttempts: 6, totalRounds: 5 },
  { n: 3, label: 'Niveau 3', desc: '2 chiffres, 5 essais, 7 manches', digits: 2, maxAttempts: 5, totalRounds: 7 },
  { n: 4, label: 'Niveau 4', desc: '3 chiffres, 7 essais, 5 manches', digits: 3, maxAttempts: 7, totalRounds: 5 },
  { n: 5, label: 'Niveau 5', desc: '3 chiffres, 6 essais, 7 manches (indice flou)', digits: 3, maxAttempts: 6, totalRounds: 7, fuzzy: true },
];

function generateSecret(digits) {
  if (digits === 1) {
    return [Math.floor(Math.random() * 9) + 1]; // 1-9
  }
  // 2-digit: no repeat digits
  if (digits === 2) {
    let tens, units;
    do {
      tens  = Math.floor(Math.random() * 9) + 1;
      units = Math.floor(Math.random() * 10);
    } while (tens === units);
    return [tens, units];
  }
  // 3-digit: no repeat digits, hundreds 1-9
  let result;
  do {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const u = Math.floor(Math.random() * 10);
    if (h !== t && h !== u && t !== u) result = [h, t, u];
  } while (!result);
  return result;
}

// Returns array of 'green'|'yellow'|'black' per digit
function computeFeedback(secret, guess) {
  const n = secret.length;
  const result = Array(n).fill('black');
  for (let i = 0; i < n; i++) {
    if (guess[i] === secret[i]) result[i] = 'green';
  }
  for (let i = 0; i < n; i++) {
    if (result[i] === 'green') continue;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      if (guess[i] === secret[j] && result[j] !== 'green') {
        result[i] = 'yellow';
        break;
      }
    }
  }
  return result;
}

// For N5: fuzzy feedback — only show counts, not which position
function fuzzyFeedback(feedback) {
  const correct = feedback.filter(c => c === 'green').length;
  const present = feedback.filter(c => c === 'yellow').length;
  return { correct, present, wrong: feedback.length - correct - present };
}

function calcStars(wins, totalRounds) {
  const pct = wins / totalRounds;
  if (pct >= 0.8) return 3;
  if (pct >= 0.5) return 2;
  return 1;
}

const EMOJI = { green: '🟢', yellow: '🟡', black: '⬛' };

export default function NombreSecretPage() {
  const { progress, saveSession, resetTimer } = useGameSession('nombre-secret');

  const [phase, setPhase]         = useState('setup');
  const [levelNum, setLevelNum]   = useState(progress.unlockedLevel);
  const [roundNum, setRoundNum]   = useState(1);
  const [wins, setWins]           = useState(0);
  const [secret, setSecret]       = useState(null);
  const [attempts, setAttempts]   = useState([]);
  const [currentInput, setCurrentInput] = useState([]);
  const [roundOver, setRoundOver]   = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [lastResult, setLastResult]   = useState(null);

  const cfg = LEVEL_CONFIG[levelNum - 1];

  function startGame() {
    resetTimer();
    setRoundNum(1);
    setWins(0);
    setSecret(generateSecret(cfg.digits));
    setAttempts([]);
    setCurrentInput([]);
    setRoundOver(false);
    setRoundResult(null);
    setLastResult(null);
    setPhase('play');
  }

  function nextRound(newWins) {
    if (roundNum >= cfg.totalRounds) {
      const stars = calcStars(newWins, cfg.totalRounds);
      const result = saveSession({ score: newWins, level: levelNum, stars });
      setWins(newWins);
      setLastResult(result);
      setPhase('results');
    } else {
      setRoundNum(r => r + 1);
      setSecret(generateSecret(cfg.digits));
      setAttempts([]);
      setCurrentInput([]);
      setRoundOver(false);
      setRoundResult(null);
      setWins(newWins);
    }
  }

  const handleDigit = useCallback((d) => {
    if (roundOver) return;
    if (currentInput.length >= cfg.digits) return;
    setCurrentInput(prev => [...prev, d]);
  }, [currentInput, roundOver, cfg.digits]);

  const handleBackspace = useCallback(() => {
    if (roundOver) return;
    setCurrentInput(prev => prev.slice(0, -1));
  }, [roundOver]);

  const handleSubmit = useCallback(() => {
    if (roundOver) return;
    if (currentInput.length !== cfg.digits) return;
    const feedback = computeFeedback(secret, currentInput);
    const newAttempts = [...attempts, { guess: currentInput, feedback }];
    setAttempts(newAttempts);
    setCurrentInput([]);
    const won = feedback.every(c => c === 'green');
    if (won) {
      setRoundOver(true);
      setRoundResult('win');
    } else if (newAttempts.length >= cfg.maxAttempts) {
      setRoundOver(true);
      setRoundResult('lose');
    }
  }, [currentInput, secret, attempts, roundOver, cfg.digits, cfg.maxAttempts]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="ns-page" style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #000510 100%)' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', margin: '16px 0 4px' }}>
          🛸 Signal Cosmique
        </h1>
        <p style={{ textAlign: 'center', opacity: .7, fontSize: '.9rem', marginBottom: 8 }}>
          Devine le nombre en quelques essais
        </p>

        {progress.sessionsPlayed > 0 && (
          <div className="jeux-setup-stats">
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">🏆 {progress.bestScore}</span>
              <span className="jeux-setup-stat__lbl">Meilleur score</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">Niv.{progress.bestLevel}</span>
              <span className="jeux-setup-stat__lbl">Niveau atteint</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
              <span className="jeux-setup-stat__lbl">Parties</span>
            </div>
          </div>
        )}

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lv => {
            const locked = lv.n > progress.unlockedLevel;
            return (
              <button
                key={lv.n}
                className={`jeux-level-btn${levelNum === lv.n ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setLevelNum(lv.n); }}
                disabled={locked}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>N{lv.n}</span>
                <span style={{ fontSize: '.72rem', opacity: .8, textAlign: 'center' }}>{lv.desc}</span>
                {locked && <span style={{ fontSize: '.7rem' }}>🔒</span>}
              </button>
            );
          })}
        </div>

        <button
          className="ns-cta"
          style={{ marginTop: 16 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(wins, cfg.totalRounds);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="ns-page" style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #000510 100%)' }}>
        <h2 className="ns-result-title">
          {stars === 3 ? '🎉 Genial !' : stars === 2 ? '👍 Bien joue !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {lastResult?.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
        {lastResult?.newUnlocked && (
          <div className="jeux-unlocked">Niveau {levelNum + 1} debloque !</div>
        )}
        <div className="jeux-result-stat"><span>Victoires</span><span>{wins} / {cfg.totalRounds}</span></div>
        <div className="jeux-result-stat"><span>Niveau</span><span>N{levelNum}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="ns-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            Rejouer
          </button>
          <button className="ns-cta" style={{ flex: 1, background: 'rgba(255,255,255,.12)' }}
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Niveaux
          </button>
        </div>
        <Link to="/jeux" className="ns-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // ── Play ───────────────────────────────────────────────────────────────────
  const isFuzzy = cfg.fuzzy;

  return (
    <div className="ns-page" style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #000510 100%)' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="ns-hud" style={{ fontFamily: 'monospace', color: '#06b6d4' }}>
        <span className="ns-progress" style={{ color: '#06b6d4' }}>TENTATIVES: {attempts.length}/{cfg.maxAttempts} | MANCHE: {roundNum}/{cfg.totalRounds}</span>
        <span className="ns-score" style={{ color: '#06b6d4', background: 'rgba(6,182,212,.12)', borderRadius: 20, padding: '3px 12px' }}>SCORE: {wins}</span>
      </div>

      <div className="ns-info-card">
        <p className="ns-info-text">
          Trouve le nombre secret a {cfg.digits} chiffre{cfg.digits > 1 ? 's' : ''}{cfg.digits > 1 ? ' (pas de chiffres repetes)' : ''} !
        </p>
        {isFuzzy ? (
          <div className="ns-legend">
            <span>✅ Bien places</span>
            <span>🔶 Mal places</span>
            <span>❌ Absents</span>
          </div>
        ) : (
          <div className="ns-legend">
            <span>🟢 Bien place</span>
            <span>🟡 Mal place</span>
            <span>⬛ Absent</span>
          </div>
        )}
      </div>

      <div className="ns-attempts">
        {attempts.map((a, i) => {
          const fuzz = isFuzzy ? fuzzyFeedback(a.feedback) : null;
          return (
            <div key={i} className="ns-attempt-row">
              <div className="ns-guess-digits">
                {a.guess.map((d, j) => (
                  <span key={j} className="ns-digit-box">{d}</span>
                ))}
              </div>
              <div className="ns-feedback">
                {isFuzzy ? (
                  <span style={{ fontSize: '.85rem', fontWeight: 700 }}>
                    ✅{fuzz.correct} 🔶{fuzz.present} ❌{fuzz.wrong}
                  </span>
                ) : (
                  a.feedback.map((c, j) => <span key={j}>{EMOJI[c]}</span>)
                )}
              </div>
            </div>
          );
        })}
        {/* Empty rows for current attempt slot */}
        {!roundOver && Array.from({ length: cfg.maxAttempts - attempts.length }).map((_, i) => (
          <div key={'e' + i} className={`ns-attempt-row ns-attempt-row--empty${i === 0 ? ' ns-attempt-row--current' : ''}`}>
            <div className="ns-guess-digits">
              {Array.from({ length: cfg.digits }).map((_, j) => (
                <span key={j} className={`ns-digit-box${i === 0 && currentInput[j] !== undefined ? ' ns-digit-box--active' : ' ns-digit-box--empty'}`}>
                  {i === 0 ? (currentInput[j] !== undefined ? currentInput[j] : '') : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {roundOver ? (
        <div className={`ns-round-banner ${roundResult === 'win' ? 'ns-round-banner--win' : 'ns-round-banner--lose'}`}>
          {roundResult === 'win'
            ? `✅ Trouve en ${attempts.length} essai${attempts.length > 1 ? 's' : ''} !`
            : `❌ C'etait ${secret.join('')}`}
          <button
            className="ns-cta ns-cta--next"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', boxShadow: '0 4px 20px rgba(6,182,212,.4)' }}
            onPointerDown={e => { e.preventDefault(); nextRound(roundResult === 'win' ? wins + 1 : wins); }}
          >
            {roundNum >= cfg.totalRounds ? 'Voir resultats' : 'Manche suivante →'}
          </button>
        </div>
      ) : (
        <div className="ns-numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'OK'].map((key) => (
            <button
              key={key}
              className={`ns-key${key === 'OK' ? ' ns-key--ok' : key === '←' ? ' ns-key--back' : ''}`}
              style={key === 'OK' ? { background: 'linear-gradient(135deg, #0891b2, #06b6d4)', fontFamily: 'monospace', border: '1.5px solid #06b6d4' } : { fontFamily: 'monospace', background: 'rgba(6,182,212,.08)', border: '1.5px solid rgba(6,182,212,.25)', color: '#06b6d4' }}
              onPointerDown={e => {
                e.preventDefault();
                if (key === '←') handleBackspace();
                else if (key === 'OK') handleSubmit();
                else handleDigit(key);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
