import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// Each text: text (string), intrus (exact word string, must appear exactly once), reason (explanation)
// Intrus word is intentionally placed in the middle of sentences, not at the end.

const ALL_TEXTS = [
  // ─── Niveau 1 — Animaux et vie quotidienne ─────────────────────────────────
  {
    level: 1,
    text: "Le chat dort paisiblement sur le canapé. Il est très nageur et passe sa journée à ronronner près de la fenêtre.",
    intrus: "nageur",
    reason: "Un chat ne nage pas, il ronronne !"
  },
  {
    level: 1,
    text: "La vache broute de l'herbe verte dans le pré. Elle donne du lait délicieux chaque matin et pond des oeufs pour le fermier.",
    intrus: "pond",
    reason: "Une vache ne pond pas d'oeufs, ce sont les poules qui pondent !"
  },
  {
    level: 1,
    text: "Le chien aboie et court dans le jardin. Il mange sa nourriture, fait la sieste dans sa niche et parfois miaule quand il veut jouer.",
    intrus: "miaule",
    reason: "Le chien aboie, c'est le chat qui miaule !"
  },
  {
    level: 1,
    text: "Ce matin, Lena se brosse les dents, mange son petit-déjeuner chaud et part à l'école. Elle tricote son cartable sur ses épaules et marche gaiement.",
    intrus: "tricote",
    reason: "On ne tricote pas un cartable, on le porte sur ses épaules !"
  },
  {
    level: 1,
    text: "L'oiseau chante dans l'arbre au printemps. Il construit un nid avec des brindilles, y dépose ses oeufs et nage avec ses petits.",
    intrus: "nage",
    reason: "Un oiseau ne nage pas dans son nid, il y couve ses oeufs !"
  },

  // ─── Niveau 2 — École et nature ────────────────────────────────────────────
  {
    level: 2,
    text: "En classe de mathématiques, la maîtresse écrit une équation au tableau. Les élèves réfléchissent, sortent leurs crayons et commencent à jardiner les exercices dans leur cahier.",
    intrus: "jardiner",
    reason: "On ne jardine pas des exercices, on les fait ou résout !"
  },
  {
    level: 2,
    text: "Au printemps, les fleurs éclosent dans le jardin. Les abeilles butinent les pétales colorés, récoltent le pollen et fabriquent du miel délicieux en grimpant les arbres.",
    intrus: "grimpant",
    reason: "Les abeilles volent, elles ne grimpent pas aux arbres pour faire du miel !"
  },
  {
    level: 2,
    text: "La bibliothèque de l'école est pleine de livres passionnants. Les enfants les empruntent, les lisent tranquillement et soufflent leurs résumés à la maîtresse.",
    intrus: "soufflent",
    reason: "On n'écrit pas ses résumés en soufflant, on les rédige ou récite !"
  },
  {
    level: 2,
    text: "En automne, les feuilles des arbres rougissent et tombent. Les enfants les ramassent pour faire des herbiers, courent dans les tas dorés et sèment le vent froid.",
    intrus: "sèment",
    reason: "Les enfants courent dans les feuilles, mais ils ne sèment pas le vent !"
  },
  {
    level: 2,
    text: "Le potager de grand-père regorge de tomates, de carottes et de courgettes. Chaque été, il arrose ses plantes avec soin, retire les mauvaises herbes et coud les légumes mûrs.",
    intrus: "coud",
    reason: "On ne coud pas les légumes, on les cueille ou récolte !"
  },

  // ─── Niveau 3 — Sciences ────────────────────────────────────────────────────
  {
    level: 3,
    text: "Les planètes du système solaire tournent autour du Soleil. La Terre, Mars, Jupiter et Saturne suivent chacune leur orbite. La Lune est une planète qui orbite directement autour du Soleil comme les autres.",
    intrus: "planète",
    reason: "La Lune est un satellite naturel de la Terre, pas une planète — elle orbite autour de la Terre !"
  },
  {
    level: 3,
    text: "L'eau peut exister sous trois états : solide comme la glace, liquide comme la rivière, et gazeux comme la vapeur. Quand elle chauffe, l'eau se solidifie et monte dans les nuages.",
    intrus: "solidifie",
    reason: "Quand l'eau chauffe, elle s'évapore (devient gazeuse), elle ne se solidifie pas !"
  },
  {
    level: 3,
    text: "Les végétaux fabriquent leur nourriture grâce à la photosynthèse. Ils absorbent la lumière du soleil, le dioxyde de carbone et expulsent de l'oxygène. Sans le soleil, ils pourraient pousser normalement dans le noir.",
    intrus: "normalement",
    reason: "Sans le soleil, les plantes ne peuvent pas pousser normalement !"
  },
  {
    level: 3,
    text: "Le squelette humain est composé de 206 os. Ces os protègent les organes internes, permettent le mouvement grâce aux muscles et se régénèrent quand on les casse. Les os les plus durs sont les dents, qui font partie des muscles.",
    intrus: "muscles",
    reason: "Les dents ne font pas partie des muscles, ce sont des os ou tissus calcifiés !"
  },
  {
    level: 3,
    text: "Les volcans se forment à cause du magma en fusion qui remonte vers la surface terrestre. Lors d'une éruption, ils projettent de la lave, des cendres et parfois du gaz glacé en très grande quantité.",
    intrus: "glacé",
    reason: "Les volcans projettent des gaz brûlants, pas du gaz glacé !"
  },

  // ─── Niveau 4 — Histoire et géographie ─────────────────────────────────────
  {
    level: 4,
    text: "La Révolution française éclata en 1789. Le peuple se souleva contre la monarchie, prit la Bastille et proclama les droits de l'homme. Le roi Louis XVI fut ensuite exilé paisiblement à la campagne.",
    intrus: "paisiblement",
    reason: "Louis XVI ne fut pas exilé paisiblement, il fut arrêté puis guillotiné !"
  },
  {
    level: 4,
    text: "L'Amazonie est la plus grande forêt tropicale du monde. Elle abrite une biodiversité exceptionnelle, des milliers d'espèces animales et végétales, et produit une part importante de l'oxygène terrestre. Elle se trouve principalement au Pôle Nord.",
    intrus: "Nord",
    reason: "L'Amazonie se trouve en Amérique du Sud, pas au Pôle Nord !"
  },
  {
    level: 4,
    text: "Léonard de Vinci était un génie de la Renaissance italienne. Il peignit La Joconde, dessina des machines révolutionnaires pour son époque, et composa de nombreuses symphonies qui restent célèbres aujourd'hui.",
    intrus: "symphonies",
    reason: "Léonard de Vinci était peintre et inventeur, pas compositeur de symphonies !"
  },
  {
    level: 4,
    text: "La Chine est le pays le plus peuplé du monde avec plus d'un milliard d'habitants. Sa capitale est Pékin, sa langue officielle est le mandarin et sa plus grande muraille, construite pour se défendre, borde l'Atlantique.",
    intrus: "Atlantique",
    reason: "La Grande Muraille de Chine borde la Mongolie et l'Asie centrale, pas l'Atlantique !"
  },
  {
    level: 4,
    text: "Les pyramides d'Égypte furent construites il y a plus de 4 000 ans. Elles servaient de tombeaux aux pharaons et furent érigées par des milliers d'ouvriers. La plus grande, celle de Khéops, est coiffée aujourd'hui d'un dôme de verre.",
    intrus: "dôme",
    reason: "La pyramide de Khéops n'est pas coiffée d'un dôme de verre, son sommet est érodé !"
  },

  // ─── Niveau 5 — Raisonnement abstrait et philosophie ───────────────────────
  {
    level: 5,
    text: "La liberté est un concept fondamental en philosophie. Pour Rousseau, l'homme naît libre mais partout il est dans les fers. Cette liberté naturelle est cependant absolue et ne peut jamais être limitée par les lois de la société.",
    intrus: "absolue",
    reason: "Rousseau ne considère pas la liberté comme absolue — les lois sociales la limitent, c'est précisément sa thèse !"
  },
  {
    level: 5,
    text: "Le paradoxe de Schrödinger illustre une propriété étrange de la mécanique quantique. Un chat enfermé dans une boîte est à la fois vivant et mort jusqu'à ce qu'on l'observe. Cette expérience de pensée démontre que l'observation crée toujours des particules nouvelles.",
    intrus: "crée",
    reason: "L'expérience ne dit pas que l'observation crée des particules, mais qu'elle en fixe l'état !"
  },
  {
    level: 5,
    text: "Le langage structure notre façon de percevoir le monde. Certains linguistes avancent que les mots dont nous disposons délimitent les pensées que nous pouvons formuler. Une langue sans mot pour 'demain' rendrait impossible toute planification temporelle selon cette logique.",
    intrus: "impossible",
    reason: "Cette thèse est nuancée — 'impossible' est trop fort, les linguistes parlent d'influence, pas d'impossibilité totale !"
  },
  {
    level: 5,
    text: "La démocratie repose sur le principe que chaque citoyen a une voix égale dans les décisions collectives. Pourtant, Platon critiquait ce système en arguant que gouverner nécessite une expertise, tout comme naviguer un bateau requiert un capitaine compétent, et non le vote unanime et aveugle des passagers.",
    intrus: "unanime",
    reason: "Platon critique la démocratie mais ne parle pas d'un vote unanime — il critique le vote populaire en général !"
  },
  {
    level: 5,
    text: "L'intelligence artificielle soulève des questions éthiques majeures. Peut-on considérer qu'une machine qui simule parfaitement la conscience la possède réellement ? Le test de Turing propose justement qu'une machine incapable de tromper un humain lors d'une conversation ne peut être considérée intelligente.",
    intrus: "incapable",
    reason: "Le test de Turing dit qu'une machine CAPABLE de tromper un humain peut être considérée intelligente — le mot 'incapable' inverse le sens !"
  },
];

const LEVEL_CONFIG = [
  { label: 'N1 — Animaux et vie',      level: 1, questions: 5 },
  { label: 'N2 — École et nature',     level: 2, questions: 5 },
  { label: 'N3 — Sciences',            level: 3, questions: 5 },
  { label: 'N4 — Histoire·Géo',        level: 4, questions: 5 },
  { label: 'N5 — Raisonnement',        level: 5, questions: 5 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function tokenize(text) {
  // Split keeping punctuation attached to words to preserve readability,
  // but we need the intrus word to be independently tappable.
  // Strategy: split on spaces, each token is a word (possibly with punctuation).
  return text.split(' ').filter(t => t.length > 0);
}

function stripPunctuation(token) {
  return token.replace(/[.,!?;:"""«»()\-]/g, '').toLowerCase();
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function MotsIntrusPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('mots-intrus-texte');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase]               = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [textList, setTextList]         = useState([]);
  const [roundIndex, setRoundIndex]     = useState(0);
  const [score, setScore]               = useState(0);
  const [tappedToken, setTappedToken]   = useState(null); // token string
  const [showReason, setShowReason]     = useState(false);
  const [isCorrect, setIsCorrect]       = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const currentText = textList[roundIndex] ?? null;

  function startGame() {
    const texts = ALL_TEXTS.filter(t => t.level === selectedLevel);
    const selected = shuffle(texts).slice(0, cfg.questions);
    setTextList(selected);
    setRoundIndex(0);
    setScore(0);
    setTappedToken(null);
    setShowReason(false);
    setIsCorrect(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  function handleWordTap(token) {
    if (tappedToken !== null || !currentText) return;
    const clean = stripPunctuation(token);
    const intrusClean = stripPunctuation(currentText.intrus);
    const correct = clean === intrusClean;

    setTappedToken(token);
    setIsCorrect(correct);
    setShowReason(true);

    if (correct) {
      triggerCorrect();
      setScore(s => s + 1);
    } else {
      triggerWrong();
      logError({
        label: currentText.text.slice(0, 40) + '…',
        correct: currentText.intrus,
        given: clean,
      });
    }

    setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= cfg.questions) {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(cfg.questions * 0.86) ? 3
          : finalScore >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setScore(finalScore);
        setPhase('results');
        return;
      }
      setRoundIndex(next);
      setTappedToken(null);
      setShowReason(false);
      setIsCorrect(null);
    }, 2000);
  }

  // ─── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">❌ L'Intrus dans le Texte</h1>
        <p className="an-subtitle">Quel mot ne devrait pas être là ?</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.questions} textes</span>
          <span>👆 Tape le mot intrus</span>
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatTime(progress.totalTimeSecs)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
        </div>

        <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = score >= Math.ceil(cfg.questions * 0.86) ? 3
      : score >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.questions}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  // ─── Play ────────────────────────────────────────────────────────────────────
  if (!currentText) return null;

  const tokens = tokenize(currentText.text);

  return (
    <div className={`an-page${isCorrect === true ? ' an-flash-ok' : isCorrect === false ? ' an-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

      <div className="an-word-card" style={{ marginBottom: 16 }}>
        <div className="an-label" style={{ marginBottom: 8 }}>🔍 Trouve le mot qui ne va pas !</div>
      </div>

      {/* Tappable text */}
      <div style={{
        background: '#f9fafb',
        borderRadius: 16,
        padding: '16px 14px',
        margin: '0 0 16px',
        lineHeight: 2.2,
        fontSize: '1.05rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {tokens.map((token, i) => {
          const clean = stripPunctuation(token);
          const intrusClean = stripPunctuation(currentText.intrus);
          const isIntrus = clean === intrusClean;
          const isTapped = tappedToken === token;

          let bg = 'transparent';
          let color = '#1f2937';
          let border = '1.5px solid transparent';
          let fontWeight = 400;

          if (tappedToken !== null) {
            if (isIntrus) {
              bg = '#dcfce7'; color = '#166534'; border = '1.5px solid #22c55e'; fontWeight = 700;
            } else if (isTapped) {
              bg = '#fee2e2'; color = '#991b1b'; border = '1.5px solid #ef4444'; fontWeight = 700;
            }
          }

          return (
            <button
              key={i}
              onPointerDown={e => { e.preventDefault(); handleWordTap(token); }}
              disabled={tappedToken !== null}
              style={{
                display: 'inline',
                margin: '2px 3px',
                padding: '2px 5px',
                borderRadius: 6,
                border,
                background: bg,
                color,
                fontWeight,
                fontSize: 'inherit',
                lineHeight: 'inherit',
                cursor: tappedToken !== null ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s, border 0.2s',
                verticalAlign: 'baseline',
              }}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Reason / explanation */}
      {showReason && (
        <div style={{
          borderRadius: 12,
          padding: '12px 16px',
          background: isCorrect ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
          color: isCorrect ? '#15803d' : '#991b1b',
          fontWeight: 600,
          fontSize: '0.95rem',
          textAlign: 'center',
          marginTop: 4,
        }}>
          {isCorrect ? '✅ ' : `❌ L'intrus était : "${currentText.intrus}" — `}
          {currentText.reason}
        </div>
      )}
    </div>
  );
}
