import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_RIDDLES = [
  { q: 'Je suis jaune. Les singes m\'adorent. Qui suis-je ?', a: 'Banane', choices: ['Pomme', 'Banane', 'Cerise', 'Raisin'] },
  { q: 'J\'ai des ailes mais je ne suis pas un oiseau. Je fais du miel. Qui suis-je ?', a: 'Abeille', choices: ['Papillon', 'Fourmi', 'Abeille', 'Mouche'] },
  { q: 'Je tombe l\'hiver et je suis blanche. Qui suis-je ?', a: 'Neige', choices: ['Pluie', 'Neige', 'Grele', 'Brouillard'] },
  { q: 'Je chante le matin pour reveiller les fermiers. Qui suis-je ?', a: 'Coq', choices: ['Vache', 'Coq', 'Mouton', 'Cheval'] },
  { q: 'On me lit, on me feuillette, je contiens des histoires. Qui suis-je ?', a: 'Livre', choices: ['Journal', 'Livre', 'Cahier', 'Affiche'] },
  { q: 'Je suis ronde, rouge ou verte. On me croque. Qui suis-je ?', a: 'Pomme', choices: ['Orange', 'Pomme', 'Tomate', 'Balle'] },
  { q: 'J\'eclaire la nuit. Je suis dans le ciel. Qui suis-je ?', a: 'Lune', choices: ['Etoile', 'Soleil', 'Lune', 'Nuage'] },
  { q: 'Je nage dans la mer. J\'ai des nageoires. Qui suis-je ?', a: 'Poisson', choices: ['Dauphin', 'Poisson', 'Crabe', 'Baleine'] },
  { q: 'Je sers a ecrire. J\'ai une mine. Qui suis-je ?', a: 'Crayon', choices: ['Stylo', 'Crayon', 'Feutre', 'Pinceau'] },
  { q: 'Je fais du lait. Je vais au pre. Qui suis-je ?', a: 'Vache', choices: ['Chevre', 'Vache', 'Brebis', 'Ane'] },
  { q: 'Je grandis dans la terre. Je suis orange. Les lapins m\'adorent. Qui suis-je ?', a: 'Carotte', choices: ['Radis', 'Navet', 'Carotte', 'Patate'] },
  { q: 'Je protege la tete quand il pleut. Qui suis-je ?', a: 'Chapeau', choices: ['Echarpe', 'Gants', 'Chapeau', 'Bottes'] },
  { q: 'Je suis froid et sucre. On me mange l\'ete. Qui suis-je ?', a: 'Glace', choices: ['Yaourt', 'Gateau', 'Glace', 'Confiture'] },
  { q: 'J\'ai quatre pattes et je ronronne. Qui suis-je ?', a: 'Chat', choices: ['Chien', 'Chat', 'Lapin', 'Renard'] },
  { q: 'Je transporte les lettres dans ta boite. Qui suis-je ?', a: 'Facteur', choices: ['Medecin', 'Boulanger', 'Facteur', 'Pompier'] },
  { q: 'Je suis la couleur du ciel par beau temps. Qui suis-je ?', a: 'Bleu', choices: ['Vert', 'Rouge', 'Bleu', 'Jaune'] },
  { q: 'On me mange le matin avec du beurre. Qui suis-je ?', a: 'Pain', choices: ['Biscuit', 'Gateau', 'Pain', 'Crepe'] },
  { q: 'Je suis le roi de la jungle. Qui suis-je ?', a: 'Lion', choices: ['Elephant', 'Gorille', 'Lion', 'Tigre'] },
  { q: 'J\'ai un long cou et je mange les feuilles des grands arbres. Qui suis-je ?', a: 'Girafe', choices: ['Elephant', 'Girafe', 'Chameau', 'Antilope'] },
  { q: 'Je coule dans les robinets. On me boit. Qui suis-je ?', a: 'Eau', choices: ['Lait', 'Jus', 'Sirop', 'Eau'] },
];

const ROUND_SIZE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export default function DevinettesPage() {
  const [phase, setPhase] = useState('play');
  const [round, setRound] = useState(() => shuffle(ALL_RIDDLES).slice(0, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null); // index of chosen answer
  const [shakeIdx, setShakeIdx] = useState(null);

  const riddle = round[idx];

  function startGame() {
    setRound(shuffle(ALL_RIDDLES).slice(0, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === riddle.a;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 600 : 1200);
  }, [picked, riddle, idx, round]);

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="dv-page">
        <h2 className="dv-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <button className="dv-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="dv-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="dv-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="dv-hud">
        <span className="dv-progress">Question {idx + 1} / {round.length}</span>
        <span className="dv-score">⭐ {score}</span>
      </div>

      <div className="dv-riddle-card">
        <div className="dv-riddle-emoji">🤔</div>
        <p className="dv-riddle-text">{riddle.q}</p>
      </div>

      <div className="dv-choices">
        {riddle.choices.map((c, ci) => {
          let cls = 'dv-choice';
          if (picked !== null) {
            if (c === riddle.a) cls += ' dv-choice--correct';
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
