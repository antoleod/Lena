import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// ─── Question pool ─────────────────────────────────────────────────────────
// Each question has: q, a, choices, fact (optional), cat, level (1-5)
const ALL_QUESTIONS = [
  // ── Level 1 — very easy ──────────────────────────────────────────────────
  { q:'De quelle couleur est le ciel par beau temps ?', a:'Bleu', choices:['Bleu','Vert','Rouge','Jaune'], fact:'Le ciel est bleu a cause de la lumiere du soleil.', cat:'nature', level:1 },
  { q:'Quel animal fait "Miaou" ?', a:'Chat', choices:['Chat','Chien','Vache','Canard'], fact:'Les chats ronronnent aussi quand ils sont contents.', cat:'animaux', level:1 },
  { q:'De quelle couleur est une banane mure ?', a:'Jaune', choices:['Jaune','Rouge','Bleue','Verte'], fact:'Une banane verte n\'est pas encore mure !', cat:'nature', level:1 },
  { q:'Combien de jours y a-t-il dans une semaine ?', a:'7', choices:['7','5','6','8'], fact:'Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche — 7 jours !', cat:'maths', level:1 },
  { q:'De quelle couleur est l\'herbe ?', a:'Verte', choices:['Verte','Bleue','Rouge','Jaune'], fact:'L\'herbe est verte grace a la chlorophylle.', cat:'nature', level:1 },
  { q:'Combien font 2 + 2 ?', a:'4', choices:['3','4','5','6'], fact:'Deux plus deux font quatre !', cat:'maths', level:1 },
  { q:'Quel animal est le plus grand ?', a:'Elephant', choices:['Elephant','Cheval','Vache','Cochon'], fact:'L\'elephant est le plus grand animal terrestre !', cat:'animaux', level:1 },
  { q:'Combien y a-t-il de mois dans une annee ?', a:'12', choices:['12','10','11','13'], fact:'Janvier a decembre — 12 mois !', cat:'maths', level:1 },
  { q:'Quel animal fait "Meuh" ?', a:'Vache', choices:['Vache','Mouton','Chevre','Cochon'], fact:'La vache fait "Meuh" et nous donne le lait !', cat:'animaux', level:1 },
  { q:'Quelle saison vient apres l\'ete ?', a:'Automne', choices:['Printemps','Hiver','Automne','Ete'], fact:'Apres l\'ete vient l\'automne, les feuilles tombent.', cat:'nature', level:1 },
  { q:'Combien a-t-on de doigts sur une main ?', a:'5', choices:['4','5','6','10'], fact:'Cinq doigts par main, dix au total !', cat:'corps', level:1 },
  { q:'De quelle couleur est le soleil ?', a:'Jaune', choices:['Jaune','Rouge','Blanc','Orange'], fact:'Le soleil semble jaune depuis la Terre, mais il est blanc dans l\'espace !', cat:'science', level:1 },
  { q:'Quel est le bebe de la vache ?', a:'Veau', choices:['Veau','Agneau','Poulain','Chaton'], fact:'Le bebe vache s\'appelle un veau !', cat:'animaux', level:1 },
  { q:'Quelle couleur obtient-on en melangeant bleu et jaune ?', a:'Vert', choices:['Vert','Orange','Violet','Rouge'], fact:'Bleu + Jaune = Vert !', cat:'art', level:1 },
  // ── Level 2 ──────────────────────────────────────────────────────────────
  { q:'Quelle est la capitale de la Belgique ?', a:'Bruxelles', choices:['Bruxelles','Paris','Amsterdam','Berlin'], fact:'Bruxelles est aussi la capitale de l\'Europe !', cat:'geo', level:2 },
  { q:'Quelle est la saison apres l\'hiver ?', a:'Printemps', choices:['Printemps','Ete','Automne','Decembre'], fact:'Au printemps, les fleurs s\'epanouissent !', cat:'nature', level:2 },
  { q:'Dans quel pays se trouve la Tour Eiffel ?', a:'France', choices:['France','Belgique','Espagne','Italie'], fact:'La Tour Eiffel est a Paris, construite en 1889 !', cat:'geo', level:2 },
  { q:'Combien font 5 × 5 ?', a:'25', choices:['25','20','30','15'], fact:'La table de 5 finit toujours par 0 ou 5 !', cat:'maths', level:2 },
  { q:'Quelle est la capitale de la France ?', a:'Paris', choices:['Paris','Lyon','Marseille','Bordeaux'], fact:'Paris est appelee "la Ville Lumiere" !', cat:'geo', level:2 },
  { q:'Combien de saisons y a-t-il dans une annee ?', a:'4', choices:['4','3','5','2'], fact:'Printemps, ete, automne, hiver — 4 saisons !', cat:'nature', level:2 },
  { q:'Quel est le plus grand animal terrestre ?', a:'Elephant', choices:['Lion','Elephant','Girafe','Hippopotame'], fact:'L\'elephant d\'Afrique peut peser 6 tonnes !', cat:'animaux', level:2 },
  { q:'De quelle couleur est une feuille en ete ?', a:'Verte', choices:['Jaune','Rouge','Verte','Marron'], fact:'La chlorophylle donne la couleur verte aux feuilles.', cat:'nature', level:2 },
  { q:'Combien de cotes a un carre ?', a:'4', choices:['3','4','5','6'], fact:'Un carre a 4 cotes egaux !', cat:'maths', level:2 },
  { q:'Quel animal est le "roi des animaux" ?', a:'Lion', choices:['Tigre','Leopard','Lion','Elephant'], fact:'Le lion est appele le roi de la jungle.', cat:'animaux', level:2 },
  { q:'Quel est le fleuve qui traverse Paris ?', a:'La Seine', choices:['La Seine','Le Rhin','La Loire','Le Rhone'], fact:'La Seine mesure 775 km de long !', cat:'geo', level:2 },
  { q:'Combien font 8 × 3 ?', a:'24', choices:['24','21','27','18'], fact:'Huit fois trois font vingt-quatre !', cat:'maths', level:2 },
  // ── Level 3 ──────────────────────────────────────────────────────────────
  { q:'Quelle est la capitale du Royaume-Uni ?', a:'Londres', choices:['Londres','Dublin','Edimbourg','Cardiff'], fact:'Londres est sur la Tamise et accueille Big Ben !', cat:'geo', level:3 },
  { q:'Quel est le plus grand ocean du monde ?', a:'Pacifique', choices:['Pacifique','Atlantique','Indien','Arctique'], fact:'L\'ocean Pacifique est plus grand que tous les continents reunis !', cat:'geo', level:3 },
  { q:'Combien de pattes a une araignee ?', a:'8', choices:['8','6','4','10'], fact:'Les araignees ont 8 pattes, les insectes 6 !', cat:'science', level:3 },
  { q:'Quel animal est le plus rapide sur terre ?', a:'Guepard', choices:['Guepard','Lion','Cheval','Autruche'], fact:'Le guepard peut courir a 110 km/h !', cat:'animaux', level:3 },
  { q:'Quelle est la capitale de l\'Italie ?', a:'Rome', choices:['Rome','Milan','Venise','Florence'], fact:'Rome est appelee "la Ville Eternelle" !', cat:'geo', level:3 },
  { q:'Quel est l\'animal le plus grand du monde ?', a:'Baleine bleue', choices:['Baleine bleue','Elephant','Girafe','Rhinoceros'], fact:'La baleine bleue peut mesurer jusqu\'a 30 metres !', cat:'animaux', level:3 },
  { q:'Combien de cotes a un hexagone ?', a:'6', choices:['6','5','7','8'], fact:'Hexa signifie six en grec !', cat:'maths', level:3 },
  { q:'Quelle est la capitale de l\'Espagne ?', a:'Madrid', choices:['Madrid','Barcelone','Seville','Valence'], fact:'Madrid est la plus grande ville d\'Espagne !', cat:'geo', level:3 },
  { q:'Quel oiseau ne peut pas voler mais court tres vite ?', a:'Autruche', choices:['Autruche','Pingouin','Aigle','Perroquet'], fact:'L\'autruche peut courir a 70 km/h !', cat:'animaux', level:3 },
  { q:'De quoi se nourrit le panda geant ?', a:'Bambou', choices:['Bambou','Viande','Poisson','Fruits'], fact:'Le panda mange jusqu\'a 38 kg de bambou par jour !', cat:'animaux', level:3 },
  { q:'Quel insecte produit le miel ?', a:'Abeille', choices:['Abeille','Guepe','Bourdon','Mouche'], fact:'Une abeille visite jusqu\'a 1500 fleurs pour faire une cuillere de miel !', cat:'science', level:3 },
  { q:'Quel gas les plantes absorbent-elles ?', a:'Le CO2', choices:['L\'oxygene','Le CO2','L\'azote','La vapeur'], fact:'Les plantes transforment le CO2 en oxygene !', cat:'science', level:3 },
  { q:'Combien y a-t-il de planetes dans le systeme solaire ?', a:'8', choices:['7','8','9','10'], fact:'Depuis 2006, Pluton n\'est plus une planete !', cat:'science', level:3 },
  { q:'Comment appelle-t-on les animaux qui mangent uniquement des plantes ?', a:'Herbivores', choices:['Carnivores','Herbivores','Omnivores','Insectivores'], fact:'Les vaches, lapins et chevaux sont herbivores.', cat:'science', level:3 },
  // ── Level 4 ──────────────────────────────────────────────────────────────
  { q:'Quelle est la plus haute montagne du monde ?', a:'Everest', choices:['Everest','Kilimandjaro','Mont Blanc','Aconcagua'], fact:'L\'Everest culmine a 8 849 metres !', cat:'geo', level:4 },
  { q:'Combien d\'os y a-t-il dans le corps humain adulte ?', a:'206', choices:['206','180','250','220'], fact:'Les bebes naissent avec 270 os, qui fusionnent ensuite !', cat:'science', level:4 },
  { q:'Qui a invente le telephone ?', a:'Alexander Graham Bell', choices:['Alexander Graham Bell','Thomas Edison','Nikola Tesla','Marie Curie'], fact:'Graham Bell a brevete le telephone en 1876 !', cat:'histoire', level:4 },
  { q:'Quel est le pays le plus grand du monde ?', a:'Russie', choices:['Russie','Canada','Chine','USA'], fact:'La Russie fait 17 millions de km2 — deux fois le Canada !', cat:'geo', level:4 },
  { q:'Qui a peint la Joconde ?', a:'Leonard de Vinci', choices:['Leonard de Vinci','Michel-Ange','Raphael','Botticelli'], fact:'Leonard de Vinci a peint la Joconde vers 1503 !', cat:'culture', level:4 },
  { q:'Quel scientifique a decouvert la gravite ?', a:'Isaac Newton', choices:['Isaac Newton','Albert Einstein','Galilee','Darwin'], fact:'Newton observa une pomme tomber et formula la loi de la gravite !', cat:'science', level:4 },
  { q:'Quelle planete a des anneaux visibles ?', a:'Saturne', choices:['Saturne','Jupiter','Uranus','Mars'], fact:'Les anneaux de Saturne sont faits de glace et de roches !', cat:'science', level:4 },
  { q:'Quel est l\'os le plus long du corps humain ?', a:'Le femur', choices:['Le bras','Le tibia','Le femur','Le dos'], fact:'Le femur (os de la cuisse) est le plus long os du corps !', cat:'science', level:4 },
  { q:'Combien de cordes a une guitare classique ?', a:'6', choices:['4','5','6','8'], fact:'La guitare classique a 6 cordes.', cat:'culture', level:4 },
  { q:'Qui a decouvert l\'Amerique en 1492 ?', a:'Christophe Colomb', choices:['Christophe Colomb','Vasco de Gama','Magellan','Amerigo Vespucci'], fact:'Colomb cherchait les Indes et a decouvert les Ameriques !', cat:'histoire', level:4 },
  { q:'Combien font 12 × 12 ?', a:'144', choices:['144','132','156','148'], fact:'12 × 12 = 144 — c\'est la douzaine de douzaines !', cat:'maths', level:4 },
  // ── Level 5 ──────────────────────────────────────────────────────────────
  { q:'Quelle est la formule de l\'eau ?', a:'H2O', choices:['H2O','CO2','NaCl','O2'], fact:'2 atomes d\'hydrogene + 1 atome d\'oxygene = eau !', cat:'science', level:5 },
  { q:'En quelle annee a eu lieu la Revolution francaise ?', a:'1789', choices:['1689','1789','1889','1989'], fact:'La prise de la Bastille le 14 juillet 1789 !', cat:'histoire', level:5 },
  { q:'Quel est le livre le plus vendu au monde ?', a:'La Bible', choices:['Harry Potter','Le Petit Prince','La Bible','Le Coran'], fact:'La Bible a ete vendue a plus de 5 milliards d\'exemplaires !', cat:'culture', level:5 },
  { q:'Quelle planete est la plus proche du Soleil ?', a:'Mercure', choices:['Venus','Mercure','Mars','Terre'], fact:'Mercure est si proche du soleil qu\'une journee y dure 59 jours terrestres !', cat:'science', level:5 },
  { q:'Qui a ecrit "Les Miserables" ?', a:'Victor Hugo', choices:['Balzac','Victor Hugo','Zola','Stendhal'], fact:'Victor Hugo a publie Les Miserables en 1862 !', cat:'culture', level:5 },
  { q:'Combien de pays composent l\'Union europeenne en 2024 ?', a:'27', choices:['25','27','30','32'], fact:'27 pays membres depuis le Brexit en 2020 !', cat:'geo', level:5 },
  { q:'Quel pays a la plus grande superficie du monde ?', a:'Russie', choices:['Canada','Chine','USA','Russie'], fact:'La Russie s\'etend sur 17 millions de km2 !', cat:'geo', level:5 },
  { q:'En quelle annee a-t-on pose le pied sur la Lune pour la premiere fois ?', a:'1969', choices:['1961','1965','1969','1972'], fact:'Neil Armstrong — 21 juillet 1969 — "Un petit pas pour l\'homme..."', cat:'science', level:5 },
  { q:'Quel est le fleuve le plus long du monde ?', a:'Le Nil', choices:['Le Mississippi','Le Nil','L\'Amazone','Le Yangtsé'], fact:'Le Nil mesure environ 6 650 km de long !', cat:'geo', level:5 },
  { q:'Qu\'est-ce qu\'un palindrome ?', a:'Un mot qui se lit pareil a l\'envers', choices:['Un mot qui se lit pareil a l\'envers','Un tres grand nombre','Une figure geometrique','Une espece d\'oiseau'], fact:'"Radar", "elle", "kayak" sont des palindromes !', cat:'culture', level:5 },
  { q:'Quel est le plus petit nombre premier superieur a 10 ?', a:'11', choices:['11','12','13','10'], fact:'11 n\'est divisible que par 1 et lui-meme !', cat:'maths', level:5 },
  { q:'Combien de degres dans un triangle quelconque ?', a:'180', choices:['180','90','360','270'], fact:'La somme des angles d\'un triangle est toujours 180 !', cat:'maths', level:5 },
];

const LEVEL_CONFIG = [
  { id:1,  label:'N1',  n:8,  poolLvl:[1],   timePerQ:null },
  { id:2,  label:'N2',  n:8,  poolLvl:[1],   timePerQ:null },
  { id:3,  label:'N3',  n:10, poolLvl:[1,2], timePerQ:null },
  { id:4,  label:'N4',  n:10, poolLvl:[1,2], timePerQ:null },
  { id:5,  label:'N5',  n:10, poolLvl:[2],   timePerQ:30   },
  { id:6,  label:'N6',  n:10, poolLvl:[2],   timePerQ:25   },
  { id:7,  label:'N7',  n:12, poolLvl:[2,3], timePerQ:25   },
  { id:8,  label:'N8',  n:12, poolLvl:[2,3], timePerQ:20   },
  { id:9,  label:'N9',  n:12, poolLvl:[3],   timePerQ:20   },
  { id:10, label:'N10', n:12, poolLvl:[3],   timePerQ:15   },
  { id:11, label:'N11', n:15, poolLvl:[3,4], timePerQ:15   },
  { id:12, label:'N12', n:15, poolLvl:[3,4], timePerQ:12   },
  { id:13, label:'N13', n:15, poolLvl:[4,5], timePerQ:12   },
  { id:14, label:'N14', n:15, poolLvl:[4,5], timePerQ:10   },
  { id:15, label:'N15', n:20, poolLvl:[5],   timePerQ:8    },
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
  const pool = ALL_QUESTIONS.filter(q => cfg.poolLvl.includes(q.level));
  return shuffle(pool).slice(0, cfg.n);
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export default function QuizCulturePage() {
  const { progress, saveSession, resetTimer, elapsedSecs, logError } = useGameSession('quiz-culture');

  const [phase, setPhase]         = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [round, setRound]         = useState(() => buildRound(LEVEL_CONFIG[0]));
  const [idx, setIdx]             = useState(0);
  const [score, setScore]         = useState(0);
  const [picked, setPicked]       = useState(null);
  const [shakeIdx, setShakeIdx]   = useState(null);
  const [showFact, setShowFact]   = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [qTimer, setQTimer]       = useState(null);
  const [qTimerPct, setQTimerPct] = useState(100);

  const qTimerRef = { current: null };
  const qTimerRefReal = useState(null)[0]; // kept for interval cleanup
  // Use a ref for the interval
  const intervalRef = { current: null };

  // We use a closure approach for the timer — store it in a module-level ref via useRef
  const timerIntervalRef = useState(() => ({ current: null }))[0];

  useEffect(() => {
    if (phase !== 'play') return;
    const cfg = LEVEL_CONFIG[selectedLevel - 1];
    if (!cfg.timePerQ) return;
    setQTimer(cfg.timePerQ);
    setQTimerPct(100);
    clearInterval(timerIntervalRef.current);
    let t = cfg.timePerQ;
    timerIntervalRef.current = setInterval(() => {
      t -= 1;
      setQTimer(t);
      setQTimerPct((t / cfg.timePerQ) * 100);
      if (t <= 0) {
        clearInterval(timerIntervalRef.current);
        // timeout — advance without answer
        setPicked(-1);
        setTimeout(() => {
          setPicked(null);
          setShowFact(false);
          setIdx(i => {
            const next = i + 1;
            if (next >= round.length) {
              setPhase('results');
            }
            return next < round.length ? next : i;
          });
        }, 800);
      }
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [phase, idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function startGame() {
    const cfg = LEVEL_CONFIG[selectedLevel - 1];
    setRound(buildRound(cfg));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setShowFact(false);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  const q = round[idx];

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null || !q) return;
    clearInterval(timerIntervalRef.current);
    const correct = choice === q.a;
    setPicked(ci);
    let newScore = score;
    if (correct) {
      newScore = score + 1;
      setScore(newScore);
      setShowFact(true);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
      logError({ label: q.q, correct: q.a, given: choice });
    }
    setTimeout(() => {
      setPicked(null);
      setShowFact(false);
      if (idx + 1 >= round.length) {
        const stars = calcStars(newScore, round.length);
        const secs = elapsedSecs();
        const result = saveSession({ score: newScore, level: selectedLevel, stars });
        setSessionResult({ ...result, timeSecs: secs, stars });
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 1400 : 1200);
  }, [picked, q, idx, round, score, selectedLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    const cfg = LEVEL_CONFIG[selectedLevel - 1];
    return (
      <div className="qc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="qc-setup-hero">
          <div className="qc-setup-icon">🌍</div>
          <h1 className="qc-setup-title">Quiz Culture</h1>
          <p className="qc-setup-desc">
            Questions sur la Belgique, la France et le monde entier !
          </p>
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore || 0}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed || 0}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatDuration(progress.totalTimeSecs || 0)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
        </div>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lc => {
            const locked = lc.id > progress.unlockedLevel;
            return (
              <button
                key={lc.id}
                className={`jeux-level-btn${selectedLevel === lc.id ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lc.id); }}
              >
                {locked ? '🔒' : lc.label}
                {!locked && progress.bestLevel >= lc.id && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.n} questions</span>
          {cfg.timePerQ && <span>⏱ {cfg.timePerQ}s/question</span>}
        </div>

        <div className="qc-setup-preview">
          <div className="qc-preview-item">🗺️ Geographie</div>
          <div className="qc-preview-item">🔢 Maths</div>
          <div className="qc-preview-item">🐾 Animaux</div>
          <div className="qc-preview-item">🌱 Nature</div>
        </div>
        <button className="qc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Commencer le quiz !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Tres bien !' : '📚 Continue !';
    return (
      <div className="qc-page">
        <h2 className="qc-result-title">{msg}</h2>
        <div className="jeux-stars">{starStr}</div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <div className="jeux-result-stat"><span>Bonnes reponses</span><span>{Math.round((score / round.length) * 100)} %</span></div>
        <button className="qc-cta" style={{ marginTop: 28 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <button className="qc-cta" style={{ marginTop: 8, background: 'rgba(255,255,255,.1)' }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>
          Changer de niveau
        </button>
        <Link to="/jeux" className="qc-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  return (
    <div className="qc-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="qc-hud">
        <span className="qc-progress">Question {idx + 1} / {round.length}</span>
        <span className="qc-score">⭐ {score}</span>
      </div>

      {cfg.timePerQ && (
        <div className="sm-timer-bar" style={{ marginBottom: 8 }}>
          <div className="sm-timer-fill" style={{ width: `${qTimerPct}%`, background: qTimerPct < 30 ? '#ef4444' : '#22c55e' }} />
        </div>
      )}

      <div className="qc-question-card">
        <div className="qc-question-emoji">🤔</div>
        <p className="qc-question-text">{q.q}</p>
      </div>

      {showFact && q.fact && (
        <div className="qc-fact-box">
          💡 {q.fact}
        </div>
      )}

      <div className="qc-choices">
        {q.choices.map((c, ci) => {
          let cls = 'qc-choice';
          if (picked !== null) {
            if (c === q.a) cls += ' qc-choice--correct';
            else if (picked === ci) cls += ' qc-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' qc-choice--shake';
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
