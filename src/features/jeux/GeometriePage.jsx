import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const ALL_QUESTIONS = [
  // N1 — formes et côtés
  { q: "Combien de côtés a un triangle ?", a: "3", choices: ["3", "4", "5", "6"], level: 1 },
  { q: "Combien de côtés a un carré ?", a: "4", choices: ["4", "3", "5", "6"], level: 1 },
  { q: "Combien de côtés a un pentagone ?", a: "5", choices: ["5", "4", "6", "3"], level: 1 },
  { q: "Combien de côtés a un hexagone ?", a: "6", choices: ["6", "5", "7", "8"], level: 1 },
  { q: "Combien de côtés a un octogone ?", a: "8", choices: ["8", "6", "7", "9"], level: 1 },
  { q: "Une figure avec 4 côtés égaux et 4 angles droits est un...", a: "Carré", choices: ["Carré", "Rectangle", "Losange", "Trapèze"], level: 1 },
  { q: "Une figure avec 4 côtés et 4 angles droits est un...", a: "Rectangle", choices: ["Rectangle", "Carré", "Losange", "Parallélogramme"], level: 1 },
  { q: "Combien de sommets a un triangle ?", a: "3", choices: ["3", "4", "2", "5"], level: 1 },
  { q: "Un cercle a combien de côtés ?", a: "0 (aucun)", choices: ["0 (aucun)", "1", "2", "Infini"], level: 1 },
  { q: "Une figure à 4 côtés s'appelle un...", a: "Quadrilatère", choices: ["Quadrilatère", "Triangle", "Pentagone", "Hexagone"], level: 1 },
  { q: "Comment appelle-t-on un triangle avec 3 côtés égaux ?", a: "Équilatéral", choices: ["Équilatéral", "Isocèle", "Scalène", "Rectangle"], level: 1 },
  { q: "Comment appelle-t-on un triangle avec 2 côtés égaux ?", a: "Isocèle", choices: ["Isocèle", "Équilatéral", "Scalène", "Obtus"], level: 1 },
  // N2 — angles et symétrie
  { q: "Un angle droit mesure...", a: "90°", choices: ["90°", "180°", "45°", "360°"], level: 2 },
  { q: "La somme des angles d'un triangle est...", a: "180°", choices: ["180°", "360°", "90°", "270°"], level: 2 },
  { q: "La somme des angles d'un quadrilatère est...", a: "360°", choices: ["360°", "180°", "270°", "540°"], level: 2 },
  { q: "Combien d'axes de symétrie a un carré ?", a: "4", choices: ["4", "2", "1", "0"], level: 2 },
  { q: "Combien d'axes de symétrie a un cercle ?", a: "Infini", choices: ["Infini", "1", "2", "4"], level: 2 },
  { q: "Combien d'axes de symétrie a un rectangle ?", a: "2", choices: ["2", "4", "1", "0"], level: 2 },
  { q: "Combien d'axes de symétrie a un triangle équilatéral ?", a: "3", choices: ["3", "1", "0", "6"], level: 2 },
  { q: "Un angle obtus est...", a: "Plus grand que 90°", choices: ["Plus grand que 90°", "Plus petit que 90°", "Égal à 90°", "Égal à 180°"], level: 2 },
  { q: "Un angle aigu est...", a: "Plus petit que 90°", choices: ["Plus petit que 90°", "Égal à 90°", "Plus grand que 90°", "Égal à 180°"], level: 2 },
  { q: "Combien d'axes de symétrie a un losange ?", a: "2", choices: ["2", "4", "1", "0"], level: 2 },
  // N3 — périmètre et aire
  { q: "Le périmètre d'un carré de côté 5 cm est...", a: "20 cm", choices: ["20 cm", "25 cm", "10 cm", "15 cm"], level: 3 },
  { q: "L'aire d'un rectangle 4×6 est...", a: "24 cm²", choices: ["24 cm²", "20 cm²", "10 cm²", "48 cm²"], level: 3 },
  { q: "L'aire d'un carré de côté 3 cm est...", a: "9 cm²", choices: ["9 cm²", "12 cm²", "6 cm²", "16 cm²"], level: 3 },
  { q: "Le périmètre d'un rectangle 3×7 est...", a: "20 cm", choices: ["20 cm", "21 cm", "10 cm", "14 cm"], level: 3 },
  { q: "La formule de l'aire d'un triangle est...", a: "(base × hauteur) ÷ 2", choices: ["(base × hauteur) ÷ 2", "base × hauteur", "base + hauteur", "base² "], level: 3 },
  { q: "L'aire d'un triangle base 6 hauteur 4 est...", a: "12 cm²", choices: ["12 cm²", "24 cm²", "10 cm²", "8 cm²"], level: 3 },
  { q: "Le périmètre d'un triangle côtés 3, 4, 5 est...", a: "12 cm", choices: ["12 cm", "60 cm", "7 cm", "9 cm"], level: 3 },
  { q: "La formule du périmètre d'un carré est...", a: "4 × côté", choices: ["4 × côté", "côté²", "2 × côté", "côté × côté"], level: 3 },
  { q: "L'aire d'un carré de côté 10 est...", a: "100 cm²", choices: ["100 cm²", "40 cm²", "20 cm²", "1000 cm²"], level: 3 },
  { q: "Le périmètre d'un hexagone régulier de côté 4 est...", a: "24 cm", choices: ["24 cm", "16 cm", "20 cm", "32 cm"], level: 3 },
  { q: "La formule de l'aire d'un rectangle est...", a: "longueur × largeur", choices: ["longueur × largeur", "2×(l+L)", "l²", "l+L"], level: 3 },
];

const LEVELS = [
  { label: 'N1 — Formes', key: 'n1', emoji: '🔺', levelMax: 1, count: 10 },
  { label: 'N2 — Angles', key: 'n2', emoji: '📐', levelMax: 2, count: 10 },
  { label: 'N3 — Mesures', key: 'n3', emoji: '📏', levelMax: 3, count: 10 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function GeometriePage() {
  const { progress, saveSession, resetTimer } = useGameSession('geometrie');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);

  const startGame = useCallback((idx) => {
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    const pool = ALL_QUESTIONS.filter(q => q.level <= cfg.levelMax);
    setQuestions(shuffle(pool).slice(0, cfg.count));
    setQIdx(0);
    setScore(0);
    setChosen(null);
    resetTimer();
    setPhase('play');
  }, [resetTimer]);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const correct = questions[qIdx].a;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        const stars = calcStars(finalScore, questions.length);
        const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
        setResult({ score: finalScore, stars, ...res });
        setPhase('results');
      } else {
        setQIdx(i => i + 1);
        setChosen(null);
      }
    }, 900);
  }, [chosen, qIdx, questions, score, saveSession, levelIdx]);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">📐</div>
            <h1 className="sm-setup__title">Géométrie</h1>
            <p className="sm-setup__sub">Formes, angles et mesures !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-results">
          <div className="game-results__emoji">📐</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}/{questions.length}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{qIdx + 1}/{questions.length}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16 }}>
        <div className="game-question-card">
          <div className="game-question-sub">{cfg.emoji} {cfg.label}</div>
          <div className="game-question-text">{q.q}</div>
        </div>
        <div className="sm-choices">
          {q.choices.map((c) => {
            let cls = 'sm-choice';
            if (chosen !== null) {
              if (c === q.a) cls += ' is-correct';
              else if (c === chosen) cls += ' is-wrong';
            }
            return (
              <button key={c} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#059669', fontSize: '0.95rem' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
