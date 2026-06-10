import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const SENTENCES = [
  { text: "Le chat dort sur le canapé rouge.", q: "Où dort le chat ?", a: "Sur le canapé rouge", choices: ["Sur le canapé rouge", "Dans le jardin", "Sur le lit", "Sous la table"] },
  { text: "Marie mange une pomme verte chaque matin.", q: "Que mange Marie ?", a: "Une pomme verte", choices: ["Une pomme verte", "Une orange", "Une banane", "Un gâteau"] },
  { text: "Le soleil se lève à l'est tous les jours.", q: "Où se lève le soleil ?", a: "À l'est", choices: ["À l'est", "À l'ouest", "Au nord", "Au sud"] },
  { text: "Les oiseaux chantent dans les arbres le matin.", q: "Quand chantent les oiseaux ?", a: "Le matin", choices: ["Le matin", "La nuit", "Le soir", "L'après-midi"] },
  { text: "Paul a trouvé trois pièces d'or dans le jardin.", q: "Combien de pièces a trouvé Paul ?", a: "Trois", choices: ["Trois", "Cinq", "Deux", "Dix"] },
  { text: "La grenouille verte saute dans la mare bleue.", q: "De quelle couleur est la grenouille ?", a: "Verte", choices: ["Verte", "Rouge", "Bleue", "Jaune"] },
  { text: "Thomas lit un livre d'aventure chaque soir.", q: "Quel type de livre lit Thomas ?", a: "Aventure", choices: ["Aventure", "Science", "Cuisine", "Poésie"] },
  { text: "La neige tombe doucement sur les montagnes.", q: "Où tombe la neige ?", a: "Sur les montagnes", choices: ["Sur les montagnes", "Dans la mer", "Dans la ville", "Sur les plages"] },
  { text: "Emma a cinq frères et sœurs.", q: "Combien de frères et sœurs a Emma ?", a: "Cinq", choices: ["Cinq", "Deux", "Sept", "Trois"] },
  { text: "Le boulanger prépare du pain frais chaque matin.", q: "Que prépare le boulanger ?", a: "Du pain frais", choices: ["Du pain frais", "Des gâteaux", "Des croissants", "De la soupe"] },
  { text: "Le dauphin nage rapidement dans l'océan Pacifique.", q: "Dans quel océan nage le dauphin ?", a: "Pacifique", choices: ["Pacifique", "Atlantique", "Indien", "Arctique"] },
  { text: "Sophie a planté des fleurs rouges dans le jardin.", q: "De quelle couleur sont les fleurs ?", a: "Rouges", choices: ["Rouges", "Bleues", "Jaunes", "Blanches"] },
  { text: "Le lion rugit trois fois puis s'endort.", q: "Combien de fois rugit le lion ?", a: "Trois", choices: ["Trois", "Deux", "Cinq", "Une"] },
  { text: "Les enfants jouent au ballon dans la cour de l'école.", q: "Où jouent les enfants ?", a: "Dans la cour de l'école", choices: ["Dans la cour de l'école", "Dans le jardin", "Dans la rue", "Dans le parc"] },
  { text: "La tortue mange des feuilles vertes et des légumes.", q: "Que mange la tortue ?", a: "Des feuilles et des légumes", choices: ["Des feuilles et des légumes", "De la viande", "Du poisson", "Des insectes"] },
  { text: "Lucas a reçu un vélo bleu pour son anniversaire.", q: "De quelle couleur est le vélo ?", a: "Bleu", choices: ["Bleu", "Rouge", "Vert", "Jaune"] },
  { text: "Il y a sept jours dans une semaine.", q: "Combien y a-t-il de jours dans une semaine ?", a: "Sept", choices: ["Sept", "Cinq", "Six", "Huit"] },
  { text: "La maison de grand-père se trouve au bord de la rivière.", q: "Où se trouve la maison ?", a: "Au bord de la rivière", choices: ["Au bord de la rivière", "Dans la forêt", "Sur la montagne", "En ville"] },
  { text: "Le renard roux court plus vite que le lapin blanc.", q: "Qui court plus vite ?", a: "Le renard roux", choices: ["Le renard roux", "Le lapin blanc", "Le chien", "Le chat"] },
  { text: "Anna mange des fraises rouges avec du sucre.", q: "Avec quoi mange-t-elle les fraises ?", a: "Du sucre", choices: ["Du sucre", "Du sel", "Du lait", "Du miel"] },
  { text: "Le train part à huit heures du matin.", q: "À quelle heure part le train ?", a: "Huit heures", choices: ["Huit heures", "Neuf heures", "Sept heures", "Dix heures"] },
  { text: "La bibliothèque possède mille livres différents.", q: "Combien de livres possède la bibliothèque ?", a: "Mille", choices: ["Mille", "Cent", "Dix mille", "Cinq cents"] },
  { text: "Le petit chien aboie quand il entend du bruit.", q: "Pourquoi le chien aboie-t-il ?", a: "Quand il entend du bruit", choices: ["Quand il entend du bruit", "Quand il a faim", "Quand il joue", "Quand il dort"] },
  { text: "La pizza est ronde et se mange chaude.", q: "Comment se mange la pizza ?", a: "Chaude", choices: ["Chaude", "Froide", "Crue", "Congelée"] },
  { text: "Les abeilles fabriquent du miel dans leurs ruches.", q: "Que fabriquent les abeilles ?", a: "Du miel", choices: ["Du miel", "Du sucre", "Du lait", "De la gelée"] },
  { text: "Le ballon rouge est tombé dans la piscine.", q: "Où est tombé le ballon ?", a: "Dans la piscine", choices: ["Dans la piscine", "Dans le jardin", "Sur le toit", "Dans la rue"] },
  { text: "Chaque nuit, les étoiles brillent dans le ciel noir.", q: "Quand brillent les étoiles ?", a: "Chaque nuit", choices: ["Chaque nuit", "Le matin", "L'après-midi", "En hiver"] },
  { text: "Le kangourou saute très haut avec ses pattes arrière.", q: "Avec quoi saute le kangourou ?", a: "Ses pattes arrière", choices: ["Ses pattes arrière", "Ses bras", "Sa queue", "Sa tête"] },
  { text: "L'hiver arrive et les arbres perdent leurs feuilles.", q: "Quelle saison fait perdre les feuilles ?", a: "L'hiver", choices: ["L'hiver", "L'été", "Le printemps", "L'automne"] },
  { text: "Clara a dessiné un château avec des crayons de couleur.", q: "Qu'a dessiné Clara ?", a: "Un château", choices: ["Un château", "Une maison", "Un animal", "Un bateau"] },
];

const LEVELS = [
  { label: 'Flash 3s', key: 'l1', emoji: '🐢', flashMs: 3000 },
  { label: 'Flash 2s', key: 'l2', emoji: '🐇', flashMs: 2000 },
  { label: 'Flash 1s', key: 'l3', emoji: '⚡', flashMs: 1000 },
];

const ROUNDS = 8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function LectureVitessePage() {
  const { progress, saveSession, resetTimer } = useGameSession('lecture-vitesse');
  const [phase, setPhase] = useState('setup'); // setup | ready | flash | question | results
  const [levelIdx, setLevelIdx] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);
  const flashTimerRef = useRef(null);

  const startGame = useCallback((idx) => {
    setLevelIdx(idx);
    setSentences(shuffle(SENTENCES).slice(0, ROUNDS));
    setQIdx(0);
    setScore(0);
    setChosen(null);
    resetTimer();
    setPhase('ready');
  }, [resetTimer]);

  const startFlash = useCallback(() => {
    setPhase('flash');
    const cfg = LEVELS[levelIdx];
    flashTimerRef.current = setTimeout(() => {
      setPhase('question');
    }, cfg.flashMs);
  }, [levelIdx]);

  useEffect(() => () => clearTimeout(flashTimerRef.current), []);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const correct = sentences[qIdx].a;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      const nextIdx = qIdx + 1;
      if (nextIdx >= sentences.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        const stars = calcStars(finalScore, ROUNDS);
        const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
        setResult({ score: finalScore, stars, ...res });
        setPhase('results');
      } else {
        setQIdx(nextIdx);
        setChosen(null);
        setPhase('ready');
      }
    }, 900);
  }, [chosen, qIdx, sentences, score, saveSession, levelIdx]);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">⚡</div>
            <h1 className="sm-setup__title">Lecture Vitesse</h1>
            <p className="sm-setup__sub">Lis vite, réponds juste !</p>
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
          <div className="game-results__emoji">⚡</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}/{ROUNDS}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const s = sentences[qIdx];

  if (phase === 'ready') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-hud">
          <span className="game-hud__score">Score : {score}</span>
          <span className="game-hud__round">{qIdx + 1}/{ROUNDS}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 }}>
          <div className="game-question-card" style={{ textAlign: 'center' }}>
            <div className="game-question-sub">{cfg.emoji} {cfg.label}</div>
            <div className="game-question-text">Prêt ?</div>
            <div className="game-question-sub">La phrase s'affichera pendant {cfg.flashMs / 1000}s</div>
          </div>
          <button className="sm-cta" onClick={startFlash}>Afficher</button>
        </div>
      </div>
    );
  }

  if (phase === 'flash') {
    return (
      <div className="sm-page">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="game-question-card" style={{ textAlign: 'center' }}>
            <div className="game-question-text" style={{ fontSize: '1.3rem', lineHeight: 1.6 }}>{s.text}</div>
          </div>
        </div>
      </div>
    );
  }

  // question phase
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{qIdx + 1}/{ROUNDS}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16 }}>
        <div className="game-question-card">
          <div className="game-question-sub">❓ Question</div>
          <div className="game-question-text" style={{ fontSize: '1.1rem' }}>{s.q}</div>
        </div>
        <div className="sm-choices">
          {s.choices.map((c) => {
            let cls = 'sm-choice';
            if (chosen !== null) {
              if (c === s.a) cls += ' is-correct';
              else if (c === chosen) cls += ' is-wrong';
            }
            return (
              <button key={c} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#0891b2', fontSize: '0.9rem' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
