import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const ALL_SENTENCES = [
  // Level 1 — simple vocabulary fill-in
  { tmpl:'Le chat boit du ___.', opts:['lait','pain','stylo','livre'], ans:0, cat:'vocabulaire', level:1 },
  { tmpl:'Le soleil brille dans le ___.', opts:['mer','ciel','jardin','grenier'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Je lis un ___ avant de dormir.', opts:['stylo','verre','livre','carton'], ans:2, cat:'vocabulaire', level:1 },
  { tmpl:'Les oiseaux ont des ___.', opts:['pattes','ailes','nageoires','cornes'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Je dessine avec un ___.', opts:['livre','crayon','ciseau','regle'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Le chien remue la ___.', opts:['tete','queue','patte','oreille'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Je mets mes chaussures a mes ___.', opts:['mains','pieds','oreilles','yeux'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'La pomme tombe de l\'___.', opts:['arbre','echelle','toit','mur'], ans:0, cat:'vocabulaire', level:1 },
  { tmpl:'Le lapin mange des ___.', opts:['carottes','bonbons','gateaux','fromages'], ans:0, cat:'vocabulaire', level:1 },
  { tmpl:'On joue avec un ___ de foot.', opts:['chapeau','ballon','sac','velo'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Le chat ___ sur le tapis.', opts:['dort','dorment','dormez','dormions'], ans:0, cat:'conjugaison', level:1 },
  { tmpl:'Marie ___ une belle robe.', opts:['porte','portent','portez','portons'], ans:0, cat:'conjugaison', level:1 },
  { tmpl:'Il fait ___ aujourd\'hui.', opts:['chaud','chaude','chauds','chaudes'], ans:0, cat:'accord', level:1 },
  { tmpl:'En hiver, il tombe de la ___.', opts:['pluie','neige','boue','grele'], ans:1, cat:'vocabulaire', level:1 },
  { tmpl:'Le pompier eteint le ___.', opts:['feu','vent','nuage','brouillard'], ans:0, cat:'vocabulaire', level:1 },
  // Level 2 — slightly more complex grammar
  { tmpl:'Les poissons vivent dans l\'___.', opts:['air','feu','eau','terre'], ans:2, cat:'vocabulaire', level:2 },
  { tmpl:'La nuit, on peut voir les ___.', opts:['nuages','etoiles','oiseaux','avions'], ans:1, cat:'vocabulaire', level:2 },
  { tmpl:'Je me brosse les ___ deux fois par jour.', opts:['cheveux','dents','mains','pieds'], ans:1, cat:'vocabulaire', level:2 },
  { tmpl:'Nous ___ au parc hier.', opts:['allons','sommes alles','irons','aillons'], ans:1, cat:'conjugaison', level:2 },
  { tmpl:'Le soleil ___ le matin.', opts:['se leve','se lever','se levait','se levons'], ans:0, cat:'conjugaison', level:2 },
  { tmpl:'Les fleurs ___ tres belles.', opts:['est','sont','sommes','etes'], ans:1, cat:'accord', level:2 },
  { tmpl:'Paul ___ son livre tous les soirs.', opts:['lis','lira','lit','lisent'], ans:2, cat:'conjugaison', level:2 },
  { tmpl:'On mange ___ restaurant.', opts:['au','a la','dans le','du'], ans:0, cat:'preposition', level:2 },
  { tmpl:'Le train roule sur des ___.', opts:['routes','rails','herbes','rivieres'], ans:1, cat:'vocabulaire', level:2 },
  { tmpl:'Je mets du ___ dans mon the.', opts:['sel','sucre','poivre','farine'], ans:1, cat:'vocabulaire', level:2 },
  { tmpl:'Les enfants ___ dans la cour.', opts:['joue','jouent','joues','jouez'], ans:1, cat:'conjugaison', level:2 },
  { tmpl:'Le boulanger fait du ___.', opts:['gateau','lait','pain','jus'], ans:2, cat:'vocabulaire', level:2 },
  // Level 3 — conditional, subjonctif, passe compose
  { tmpl:'Si j\'avais des ailes, je ___ voler.', opts:['pourrais','pourrai','peux','puisse'], ans:0, cat:'conditionnel', level:3 },
  { tmpl:'Hier, il ___ beaucoup plu.', opts:['a','avait','aura','est'], ans:0, cat:'passe-compose', level:3 },
  { tmpl:'Les voitures ___ tres rapides.', opts:['peut','peuvent','pourons','pouvez'], ans:1, cat:'accord', level:3 },
  { tmpl:'Je me ___ les mains avant de manger.', opts:['laves','lave','lavent','lavons'], ans:1, cat:'conjugaison', level:3 },
  { tmpl:'Il faut que tu ___ tes devoirs.', opts:['fais','fasse','feras','faisait'], ans:1, cat:'subjonctif', level:3 },
  { tmpl:'Elle ___ tres fatiguee apres la course.', opts:['etait','etes','etre','etaient'], ans:0, cat:'conjugaison', level:3 },
  { tmpl:'Nous ___ partir tot demain.', opts:['devons','devoir','devez','doivent'], ans:0, cat:'conjugaison', level:3 },
  { tmpl:'La ville ___ laquelle j\'habite est belle.', opts:['dans','de','a','en'], ans:0, cat:'relatif', level:4 },
  // Level 4 — advanced grammar
  { tmpl:'C\'est ___ moi que tu parles ?', opts:['a','de','en','sur'], ans:0, cat:'preposition', level:4 },
  { tmpl:'Bien qu\'il ___ fatigue, il continue.', opts:['soit','est','sera','serait'], ans:0, cat:'subjonctif', level:4 },
  { tmpl:'Les eleves ___ de bons resultats.', opts:['ont obtenu','a obtenu','obtient','obtiendront'], ans:0, cat:'passe-compose', level:4 },
  { tmpl:'Il est important que vous ___ a l\'heure.', opts:['soyez','etes','serez','etiez'], ans:0, cat:'subjonctif', level:4 },
  { tmpl:'Je doute qu\'il ___ venir.', opts:['puisse','peut','pourra','pouvait'], ans:0, cat:'subjonctif', level:4 },
  { tmpl:'Nous sommes ___ du meme avis.', opts:['tout','tous','toutes','touts'], ans:1, cat:'accord', level:4 },
  // Level 5 — advanced syntax and vocabulary
  { tmpl:'Apres ___ rentre, il s\'est couche.', opts:['etre','avoir','s\'etre','y etre'], ans:0, cat:'infinitif', level:5 },
  { tmpl:'Non seulement il travaille mais il ___ beaucoup.', opts:['aussi apprend','apprend aussi','aussi apprenait','apprend'], ans:1, cat:'syntaxe', level:5 },
  { tmpl:'C\'est lui ___ a trouve la solution.', opts:['qui','que','dont','ou'], ans:0, cat:'relatif', level:5 },
  { tmpl:'Le livre ___ je parle est introuvable.', opts:['qui','que','dont','ou'], ans:2, cat:'relatif', level:5 },
  { tmpl:'Quoi ___ il arrive, restez calmes.', opts:['que','qui','dont','ou'], ans:0, cat:'subjonctif', level:5 },
  { tmpl:'Elle a agi ___ qu\'on le lui demandait.', opts:['ainsi','parce','afin','bien'], ans:3, cat:'syntaxe', level:5 },
];

const LEVEL_CONFIG = [
  { id:1,  label:'N1',  n:6,  poolLvl:[1],   timePerQ:null },
  { id:2,  label:'N2',  n:6,  poolLvl:[1],   timePerQ:null },
  { id:3,  label:'N3',  n:8,  poolLvl:[1],   timePerQ:null },
  { id:4,  label:'N4',  n:8,  poolLvl:[1,2], timePerQ:null },
  { id:5,  label:'N5',  n:8,  poolLvl:[1,2], timePerQ:30   },
  { id:6,  label:'N6',  n:10, poolLvl:[2],   timePerQ:30   },
  { id:7,  label:'N7',  n:10, poolLvl:[2],   timePerQ:25   },
  { id:8,  label:'N8',  n:10, poolLvl:[2,3], timePerQ:25   },
  { id:9,  label:'N9',  n:12, poolLvl:[2,3], timePerQ:20   },
  { id:10, label:'N10', n:12, poolLvl:[3],   timePerQ:20   },
  { id:11, label:'N11', n:12, poolLvl:[3,4], timePerQ:15   },
  { id:12, label:'N12', n:12, poolLvl:[3,4], timePerQ:15   },
  { id:13, label:'N13', n:15, poolLvl:[4],   timePerQ:12   },
  { id:14, label:'N14', n:15, poolLvl:[4,5], timePerQ:10   },
  { id:15, label:'N15', n:15, poolLvl:[5],   timePerQ:8    },
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
  const pool = ALL_SENTENCES.filter(s => cfg.poolLvl.includes(s.level));
  return shuffle(pool).slice(0, cfg.n);
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

function renderSentence(tmpl, blank, answerShown) {
  const parts = tmpl.split('___');
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
  const { progress, saveSession, resetTimer } = useGameSession('complete-phrase');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [round, setRound] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [qTimerPct, setQTimerPct] = useState(100);

  const timerIntervalRef = useRef(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  // Per-question timer
  useEffect(() => {
    if (phase !== 'play') return;
    const c = LEVEL_CONFIG[selectedLevel - 1];
    if (!c.timePerQ) return;
    setQTimerPct(100);
    clearInterval(timerIntervalRef.current);
    let t = c.timePerQ;
    timerIntervalRef.current = setInterval(() => {
      t -= 1;
      setQTimerPct((t / c.timePerQ) * 100);
      if (t <= 0) {
        clearInterval(timerIntervalRef.current);
        // timeout — count as wrong, advance
        setPicked(-1);
        setTimeout(() => {
          setPicked(null);
          setIdx(i => {
            const next = i + 1;
            if (next >= round.length) setPhase('results');
            return next < round.length ? next : i;
          });
        }, 800);
      }
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [phase, idx]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const item = round[idx] || null;

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null || !item) return;
    clearInterval(timerIntervalRef.current);
    const correct = choice === item.opts[item.ans];
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

  // Save on results
  useEffect(() => {
    if (phase === 'results' && round.length > 0) {
      const stars = calcStars(score, round.length);
      const result = saveSession({ score, level: selectedLevel, stars });
      setSessionResult(result);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return (
      <div className="clp-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="clp-result-title" style={{ fontSize: '1.6rem', margin: '16px 0 4px' }}>✍️ Complete la Phrase</h1>
        <p style={{ textAlign: 'center', opacity: .7, marginBottom: 16 }}>Choisis le bon mot pour completer !</p>

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
          <span>📝 {cfg.n} phrases</span>
          {cfg.timePerQ && <span>⏱ {cfg.timePerQ}s/phrase</span>}
        </div>

        <button className="clp-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="clp-page">
        <h2 className="clp-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}
        <button className="clp-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <button className="clp-cta" style={{ marginTop: 8, background: 'rgba(255,255,255,.1)' }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>
          Niveaux
        </button>
        <Link to="/jeux" className="clp-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  if (!item) return null;

  const correctAnswer = item.opts[item.ans];
  const c = LEVEL_CONFIG[selectedLevel - 1];

  return (
    <div className="clp-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="clp-hud">
        <span className="clp-progress">Phrase {idx + 1} / {round.length}</span>
        <span className="clp-score">⭐ {score}</span>
      </div>

      {c.timePerQ && (
        <div className="sm-timer-bar" style={{ marginBottom: 8 }}>
          <div className="sm-timer-fill" style={{ width: `${qTimerPct}%`, background: qTimerPct < 30 ? '#ef4444' : '#22c55e' }} />
        </div>
      )}

      <div className="clp-sentence-card">
        <p className="clp-sentence">
          {picked !== null
            ? renderSentence(item.tmpl, correctAnswer, true)
            : renderSentence(item.tmpl, '', false)}
        </p>
      </div>

      <div className="clp-choices">
        {item.opts.map((opt, ci) => {
          let cls = 'clp-choice';
          if (picked !== null) {
            if (opt === correctAnswer) cls += ' clp-choice--correct';
            else if (picked === ci) cls += ' clp-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' clp-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(opt, ci); }}
              disabled={picked !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
