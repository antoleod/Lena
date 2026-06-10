import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// Each entry: lines (3 lines shown), correct (4th line), wrong (3 wrong endings)
const POEMS = [
  {
    lines: ["Petit chat sur le toit,", "tu regardes la pluie tomber,", "tu attends la belle nuit,"],
    correct: "pour enfin te promener.",
    wrong: ["pour manger du poisson.", "pour dormir longtemps.", "pour chanter les oiseaux."],
  },
  {
    lines: ["Le soleil brille aujourd'hui,", "les oiseaux chantent dans les bois,", "les fleurs s'ouvrent sous la pluie,"],
    correct: "quelle belle matinée je vois !",
    wrong: ["les enfants jouent au foot.", "le chat dort sur le toit.", "la lune brille la nuit."],
  },
  {
    lines: ["L'automne est arrivé,", "les feuilles tombent en dansant,", "les arbres sont dénudés,"],
    correct: "le vent les emporte en chantant.",
    wrong: ["les enfants vont à l'école.", "la neige recouvre tout.", "les oiseaux reviennent."],
  },
  {
    lines: ["Mon chien s'appelle Rex,", "il court dans le jardin,", "il aboie sans complexe,"],
    correct: "et joue jusqu'au matin.",
    wrong: ["et mange son os.", "et dort dans sa niche.", "et regarde la télé."],
  },
  {
    lines: ["La nuit est étoilée,", "la lune brille doucement,", "dans le ciel tout argenté,"],
    correct: "je dors paisiblement.",
    wrong: ["les loups hurlent fort.", "les enfants jouent encore.", "le soleil se lève vite."],
  },
  {
    lines: ["À l'école ce matin,", "j'apprends à lire et compter,", "avec mon petit cousin,"],
    correct: "on adore travailler.",
    wrong: ["on mange du pain.", "on regarde la télé.", "on dort dans la classe."],
  },
  {
    lines: ["La mer est si bleue,", "les vagues dansent sur le sable,", "une journée magnifique et heureuse,"],
    correct: "sous ce ciel admirable.",
    wrong: ["j'aime les poissons.", "le requin nage vite.", "les bateaux partent loin."],
  },
  {
    lines: ["En hiver il fait froid,", "la neige tombe sur les toits,", "les enfants font de la joie,"],
    correct: "en glissant sur la glace trois fois.",
    wrong: ["les chats restent dedans.", "on boit du chocolat chaud.", "les fleurs poussent vite."],
  },
  {
    lines: ["Maman prépare un gâteau,", "à la vanille et au chocolat,", "je sens l'odeur au berceau,"],
    correct: "c'est le meilleur des repas !",
    wrong: ["et le chat dort là.", "puis elle va travailler.", "et papa mange vite."],
  },
  {
    lines: ["Le printemps est revenu,", "les hirondelles sont de retour,", "tout le jardin est épanoui,"],
    correct: "on célèbre ce beau jour.",
    wrong: ["la neige tombe encore.", "les feuilles tombent.", "les enfants ont froid."],
  },
  {
    lines: ["Mon école est grande et belle,", "avec une cour pour courir,", "mes amis sont fidèles,"],
    correct: "on ne veut jamais partir.",
    wrong: ["on mange tous les jours.", "on apprend le calcul.", "on lit des histoires."],
  },
  {
    lines: ["Le lapin dans son terrier,", "mange des carottes bien fraîches,", "sort parfois pour gambader,"],
    correct: "dans les champs et sous les hêtres.",
    wrong: ["et dort tout l'hiver.", "et regarde les étoiles.", "et mange du chocolat."],
  },
  {
    lines: ["Grand-père dans son fauteuil,", "raconte des histoires de loup,", "ses yeux brillent comme un soleil,"],
    correct: "et nous rions tous beaucoup.",
    wrong: ["il boit son café chaud.", "il dort profondément.", "il lit son journal."],
  },
  {
    lines: ["La forêt est mystérieuse,", "les arbres sont très grands,", "une lumière lumineuse,"],
    correct: "filtre à travers les branches.",
    wrong: ["les animaux dorment.", "les enfants jouent.", "la nuit vient vite."],
  },
  {
    lines: ["Mon vélo rouge et vif,", "glisse sur le chemin,", "je pédale sans jamais m'arrêter,"],
    correct: "jusqu'au bout du jardin.",
    wrong: ["et je tombe souvent.", "et ma maman crie.", "et papa me regarde."],
  },
  {
    lines: ["Le papillon voltige,", "de fleur en fleur joyeux,", "ses ailes multicolores bougent,"],
    correct: "dans le vent merveilleux.",
    wrong: ["et il tombe par terre.", "et le chat l'attrape.", "et la pluie tombe."],
  },
  {
    lines: ["Dans la mare au fond du bois,", "les grenouilles chantent fort,", "elles coassent à la fois,"],
    correct: "jusqu'au soir et le dehors.",
    wrong: ["et les canards aussi.", "et il fait très beau.", "et les enfants rient."],
  },
  {
    lines: ["Le boulanger du village,", "fait du pain chaque matin,", "une odeur de bon visage,"],
    correct: "se répand sur le chemin.",
    wrong: ["et du café aussi.", "et des gâteaux sucrés.", "et de la soupe chaude."],
  },
  {
    lines: ["Les étoiles dans le ciel,", "brillent comme des diamants,", "une nuit douce et belle,"],
    correct: "calme nos cœurs d'enfants.",
    wrong: ["et la lune aussi.", "et le soleil aussi.", "et les nuages passent."],
  },
  {
    lines: ["Le vent souffle dans les arbres,", "et fait danser les feuilles mortes,", "les branches s'agitent avec éclat,"],
    correct: "comme une danse qui s'envole.",
    wrong: ["et il fait froid dehors.", "et les oiseaux partent.", "et la neige tombe."],
  },
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

export default function PoesiePage() {
  const { progress, saveSession, resetTimer } = useGameSession('poesie');
  const [phase, setPhase] = useState('setup');
  const [poems, setPoems] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);
  const ROUNDS = 8;

  const startGame = useCallback(() => {
    setPoems(shuffle(POEMS).slice(0, ROUNDS));
    setQIdx(0);
    setScore(0);
    setChosen(null);
    resetTimer();
    setPhase('play');
  }, [resetTimer]);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const correct = poems[qIdx].correct;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= poems.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        const stars = calcStars(finalScore, ROUNDS);
        const res = saveSession({ score: finalScore, level: 1, stars });
        setResult({ score: finalScore, stars, ...res });
        setPhase('results');
      } else {
        setQIdx(i => i + 1);
        setChosen(null);
      }
    }, 1200);
  }, [chosen, qIdx, poems, score, saveSession]);

  const best = progress?.bestScore ?? 0;

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">📜</div>
            <h1 className="sm-setup__title">Poésie</h1>
            <p className="sm-setup__sub">Complète les vers !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <button className="sm-cta" onClick={startGame}>Commencer</button>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-results">
          <div className="game-results__emoji">📜</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}/{ROUNDS}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={startGame}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const poem = poems[qIdx];
  const choices = shuffle([poem.correct, ...poem.wrong]);
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{qIdx + 1}/{ROUNDS}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16 }}>
        <div className="game-question-card" style={{ fontStyle: 'italic', lineHeight: 1.8 }}>
          <div className="game-question-sub">📜 Complète le poème</div>
          <div className="game-question-text" style={{ fontSize: '1rem', textAlign: 'left' }}>
            {poem.lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div style={{
              borderBottom: chosen ? 'none' : '2px dashed rgba(255,255,255,0.5)',
              minHeight: '1.6em',
              color: chosen ? (chosen === poem.correct ? '#4ade80' : '#f87171') : 'transparent',
            }}>
              {chosen || '...'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {choices.map((c) => {
            let cls = 'game-btn';
            if (chosen !== null) {
              if (c === poem.correct) cls += ' game-btn--correct';
              else if (c === chosen) cls += ' game-btn--wrong';
            }
            return (
              <button key={c} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#7c3aed', textAlign: 'left', fontSize: '0.9rem' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
