import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_SENTENCES = [
  { sentence: 'Le chat boit du ___.', a: 'lait', choices: ['lait', 'pain', 'stylo', 'livre'] },
  { sentence: 'Le soleil brille dans le ___.', a: 'ciel', choices: ['mer', 'ciel', 'jardin', 'grenier'] },
  { sentence: 'Je lis un ___ avant de dormir.', a: 'livre', choices: ['stylo', 'verre', 'livre', 'carton'] },
  { sentence: 'Les poissons vivent dans l\'___.', a: 'eau', choices: ['air', 'feu', 'eau', 'terre'] },
  { sentence: 'Le boulanger fait du ___.', a: 'pain', choices: ['gateau', 'lait', 'pain', 'jus'] },
  { sentence: 'Les oiseaux ont des ___.', a: 'ailes', choices: ['pattes', 'ailes', 'nageoires', 'cornes'] },
  { sentence: 'En hiver, il tombe de la ___.', a: 'neige', choices: ['pluie', 'neige', 'boue', 'grele'] },
  { sentence: 'Je dessine avec un ___.', a: 'crayon', choices: ['livre', 'crayon', 'ciseau', 'regle'] },
  { sentence: 'Le chien remue la ___.', a: 'queue', choices: ['tete', 'queue', 'patte', 'oreille'] },
  { sentence: 'La nuit, on peut voir les ___.', a: 'etoiles', choices: ['nuages', 'etoiles', 'oiseaux', 'avions'] },
  { sentence: 'Je mets mes chaussures a mes ___.', a: 'pieds', choices: ['mains', 'pieds', 'oreilles', 'yeux'] },
  { sentence: 'On joue avec un ___ de foot.', a: 'ballon', choices: ['chapeau', 'ballon', 'sac', 'velo'] },
  { sentence: 'La pomme tombe de l\'___.', a: 'arbre', choices: ['arbre', 'echelle', 'toit', 'mur'] },
  { sentence: 'Je me brosse les ___ deux fois par jour.', a: 'dents', choices: ['cheveux', 'dents', 'mains', 'pieds'] },
  { sentence: 'Le lapin mange des ___.', a: 'carottes', choices: ['carottes', 'bonbons', 'gateaux', 'fromages'] },
  { sentence: 'La ___ est ronde et grande.', a: 'lune', choices: ['lune', 'etoile', 'lampe', 'balle'] },
  { sentence: 'On traverse la rue sur le passage ___.', a: 'pieton', choices: ['pieton', 'voiture', 'cycliste', 'velo'] },
  { sentence: 'Le pompier eteint le ___.', a: 'feu', choices: ['feu', 'vent', 'nuage', 'brouillard'] },
  { sentence: 'Le train roule sur des ___.', a: 'rails', choices: ['routes', 'rails', 'herbes', 'rivieres'] },
  { sentence: 'Je mets du ___ dans mon the.', a: 'sucre', choices: ['sel', 'sucre', 'poivre', 'farine'] },
];

const ROUND_SIZE = 15;

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

function renderSentence(sentence, blank, answerShown) {
  const parts = sentence.split('___');
  return (
    <span>
      {parts[0]}
      <span className={`clp-blank${answerShown ? ' clp-blank--filled' : ''}`}>
        {answerShown ? blank : '___'}
      </span>
      {parts[1]}
    </span>
  );
}

export default function CompleteLaPhrasePage() {
  const [round] = useState(() => shuffle(ALL_SENTENCES).slice(0, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('play');
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);

  const item = round[idx];

  function startGame() {
    window.location.reload();
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === item.a;
    setPicked(ci);
    if (!correct) {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    } else {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 600 : 1200);
  }, [picked, item, idx, round]);

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="clp-page">
        <h2 className="clp-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <button className="clp-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="clp-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="clp-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="clp-hud">
        <span className="clp-progress">Phrase {idx + 1} / {round.length}</span>
        <span className="clp-score">⭐ {score}</span>
      </div>

      <div className="clp-sentence-card">
        <p className="clp-sentence">
          {picked !== null
            ? renderSentence(item.sentence, item.a, true)
            : renderSentence(item.sentence, '', false)}
        </p>
      </div>

      <div className="clp-choices">
        {item.choices.map((c, ci) => {
          let cls = 'clp-choice';
          if (picked !== null) {
            if (c === item.a) cls += ' clp-choice--correct';
            else if (picked === ci) cls += ' clp-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' clp-choice--shake';
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
