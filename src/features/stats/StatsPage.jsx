import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllGameProgress,
  getAppTime,
  getAllErrors,
  getTotalStats,
  formatDuration,
} from '../../services/storage/gameProgressStore.js';
import './stats.css';

// ── Data maps ────────────────────────────────────────────────────────────────

const GAME_NAMES = {
  'mots-melanges':       'Mots Mélangés',
  'mots-caches':         'Mots Cachés',
  'devinettes':          'Devinettes',
  'complete-phrase':     'Complète la Phrase',
  'chasse-lettres':      'Chasse Lettres',
  'antonymes':           'Antonymes',
  'ordre-alpha':         'Ordre Alphabétique',
  'conjugue':            'Conjugue Vite',
  'mots-croises':        'Mots Croisés',
  'phrase-mystere':      'Phrase Mystère',
  'histoire-ordre':      'Histoire en Ordre',
  'detective-histoires': 'Détective',
  'calcul-rapide':       'Calcul Rapide',
  'course-maths':        'Course Maths',
  'bulles-calcul':       'Bulles de Calcul',
  'saute-mouton':        'Saute Mouton',
  'horloge':             "Lis l'Heure",
  'taupes':              'Taupes Maths',
  'bombes-maths':        'Bombes Maths',
  'nombre-secret':       'Nombre Secret',
  'comparaison':         'Comparaison',
  'codeur-maths':        'Codeur de Maths',
  'suite-logique':       'Suite Logique',
  'intrus':              "Trouve l'Intrus",
  'trie-express':        'Trie Express',
  'memory':              'Memory',
  'quiz-culture':        'Quiz Culture',
  'tetris':              'Tetris',
};

const GAME_EMOJIS = {
  'mots-melanges':       '🔤',
  'mots-caches':         '🔍',
  'devinettes':          '❓',
  'complete-phrase':     '✏️',
  'chasse-lettres':      '🎯',
  'antonymes':           '↔️',
  'ordre-alpha':         '🔡',
  'conjugue':            '📝',
  'mots-croises':        '🧩',
  'phrase-mystere':      '🕵️',
  'histoire-ordre':      '📖',
  'detective-histoires': '🔎',
  'calcul-rapide':       '⚡',
  'course-maths':        '🏁',
  'bulles-calcul':       '🫧',
  'saute-mouton':        '🐑',
  'horloge':             '🕐',
  'taupes':              '🦔',
  'bombes-maths':        '💣',
  'nombre-secret':       '🔢',
  'comparaison':         '⚖️',
  'codeur-maths':        '💡',
  'suite-logique':       '📊',
  'intrus':              '🚫',
  'trie-express':        '⚡',
  'memory':              '🧠',
  'quiz-culture':        '🌍',
  'tetris':              '🕹️',
};

const GAME_CATEGORIES = {
  'mots-melanges':       'langage',
  'mots-caches':         'langage',
  'devinettes':          'langage',
  'complete-phrase':     'langage',
  'chasse-lettres':      'langage',
  'antonymes':           'langage',
  'ordre-alpha':         'langage',
  'conjugue':            'langage',
  'mots-croises':        'langage',
  'phrase-mystere':      'lecture',
  'histoire-ordre':      'lecture',
  'detective-histoires': 'lecture',
  'calcul-rapide':       'maths',
  'course-maths':        'maths',
  'bulles-calcul':       'maths',
  'saute-mouton':        'maths',
  'horloge':             'maths',
  'taupes':              'maths',
  'bombes-maths':        'maths',
  'nombre-secret':       'maths',
  'comparaison':         'maths',
  'codeur-maths':        'maths',
  'suite-logique':       'maths',
  'intrus':              'logique',
  'trie-express':        'logique',
  'memory':              'memoire',
  'quiz-culture':        'culture',
  'tetris':              'arcade',
};

const CAT_LABELS = {
  langage:  '📚 Langage',
  maths:    '🔢 Maths',
  logique:  '🧩 Logique',
  lecture:  '📖 Lecture',
  culture:  '🌍 Culture',
  memoire:  '🧠 Mémoire',
  arcade:   '🕹️ Arcade',
};

const CAT_COLORS = {
  langage:  '#6366f1',
  maths:    '#f59e0b',
  logique:  '#ec4899',
  lecture:  '#10b981',
  culture:  '#f97316',
  memoire:  '#22c55e',
  arcade:   '#a855f7',
};

const CAT_ORDER = ['langage', 'maths', 'logique', 'lecture', 'culture', 'memoire', 'arcade'];

const GAME_TIPS = {
  'conjugue':        { struggle: 'Les verbes irréguliers sont difficiles. Lis à voix haute : je SUIS, tu ES, il EST...', errorTip: "Tu rates souvent les conjugaisons. Essaie de lire des livres pour t'y habituer !" },
  'mots-caches':     { struggle: 'Cherche les mots ligne par ligne, puis en colonne.', errorTip: 'Cherche d\'abord les mots courts !' },
  'bulles-calcul':   { struggle: 'Prends le temps de calculer avant de taper.', errorTip: 'Tu rates souvent les multiplications. Entraîne-toi avec les tables !' },
  'bombes-maths':    { struggle: 'Calcule de gauche à droite, étape par étape.', errorTip: 'Attention aux calculs avec × et ÷ — ils passent avant + et − !' },
  'horloge':         { struggle: 'La grande aiguille montre les minutes, la petite les heures.', errorTip: 'Les demies-heures te posent problème. Retiens : aiguille à gauche = 30 min !' },
  'ordre-alpha':     { struggle: "Chante l'alphabet en tête avant de répondre.", errorTip: 'Pense à l\'alphabet : A B C D E F G...' },
  'phrase-mystere':  { struggle: 'Lis toute la phrase avant de choisir.', errorTip: 'Relis la phrase avec chaque option pour vérifier le sens !' },
  'nombre-secret':   { struggle: 'Commence par un nombre au milieu (ex: 50) pour diviser par 2 les possibilités.', errorTip: 'Utilise les indices 🟢🟡 pour éliminer les mauvais chiffres !' },
  'codeur-maths':    { struggle: "Trouve d'abord le symbole dont tu connais la valeur, puis calcule l'autre.", errorTip: 'Isole un symbole à la fois !' },
  'suite-logique':   { struggle: 'Regarde la différence entre chaque nombre.', errorTip: 'Calcule le saut entre deux nombres consécutifs !' },
  'antonymes':       { struggle: 'Un antonyme est le contraire exact. Grand ↔ Petit.', errorTip: 'Fais attention aux adjectifs de qualité !' },
  'histoire-ordre':  { struggle: 'Pense à ce qui se passe en premier dans la vraie vie.', errorTip: "Visualise l'histoire comme un film !" },
  'comparaison':     { struggle: "Pour les grands nombres, regarde d'abord le nombre de chiffres.", errorTip: 'Aligne les chiffres par colonne pour comparer !' },
  'taupes':          { struggle: "Calcule pendant que la taupe apparaît, pas après.", errorTip: 'Mémorise les tables de 2, 5 et 10 en premier !' },
  'trie-express':    { struggle: 'Lis le mot vite et décide instinctivement.', errorTip: "Si tu hésites, pense à la définition du mot !" },
};

const TAB_CATEGORIES = {
  'Tous':     null,
  'Langage':  'langage',
  'Maths':    'maths',
  'Logique':  'logique',
  'Lecture':  'lecture',
  'Culture':  'culture',
  'Mémoire':  'memoire',
  'Arcade':   'arcade',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' });
}

function starsDisplay(stars, max = 3) {
  const filled = Math.round(Math.max(0, Math.min(stars, max)));
  return '★'.repeat(filled) + '☆'.repeat(max - filled);
}

function barColor(score, maxScore) {
  if (!maxScore) return '#6366f1';
  const pct = score / maxScore;
  if (pct >= 0.75) return '#22c55e';
  if (pct >= 0.4)  return '#f59e0b';
  return '#ef4444';
}

// ── Category stats from stars ─────────────────────────────────────────────────

function computeCategoryStats(allProgress) {
  const catData = {};
  for (const cat of CAT_ORDER) {
    catData[cat] = { totalStars: 0, count: 0 };
  }

  for (const [gameId, gp] of Object.entries(allProgress)) {
    if (!gp.sessionsPlayed) continue;
    const cat = GAME_CATEGORIES[gameId];
    if (!cat || !catData[cat]) continue;

    // Average stars from recent history; fall back to bestScore-derived stars
    const history = gp.history || [];
    if (history.length > 0) {
      const recent = history.slice(0, 5);
      const avgStars = recent.reduce((sum, h) => sum + (h.stars || 0), 0) / recent.length;
      catData[cat].totalStars += avgStars;
    } else {
      catData[cat].totalStars += gp.bestScore > 0 ? 1 : 0;
    }
    catData[cat].count += 1;
  }

  const result = {};
  for (const cat of CAT_ORDER) {
    const { totalStars, count } = catData[cat];
    if (count === 0) {
      result[cat] = { avgStars: 0, pct: 0, count: 0 };
    } else {
      const avgStars = totalStars / count;
      result[cat] = {
        avgStars,
        pct: Math.min(100, Math.round((avgStars / 3) * 100)),
        count,
      };
    }
  }
  return result;
}

// ── Insights ─────────────────────────────────────────────────────────────────

function generateInsights(allProgress, allErrors) {
  const insights = [];

  for (const [gameId, gp] of Object.entries(allProgress)) {
    if (gp.sessionsPlayed < 2) continue;
    const history = gp.history || [];
    const recentScores = history.slice(0, 5).map((h) => h.score);
    const avg = recentScores.length
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : 0;

    if (avg < 5 && gp.sessionsPlayed >= 3) {
      insights.push({
        type: 'struggle',
        gameId,
        tip: GAME_TIPS[gameId]?.struggle || 'Continue à pratiquer — tu vas y arriver !',
      });
    }

    if (recentScores.length >= 3 && recentScores[0] > recentScores[2] * 1.3) {
      insights.push({
        type: 'progress',
        gameId,
        tip: `Tu progresses vite en ${GAME_NAMES[gameId] || gameId} ! Essaie le niveau suivant.`,
      });
    }

    if (gp.bestLevel < 5 && gp.unlockedLevel > gp.bestLevel) {
      insights.push({
        type: 'unlock',
        gameId,
        tip: `Le niveau ${gp.unlockedLevel} de ${GAME_NAMES[gameId] || gameId} t'attend !`,
      });
    }
  }

  for (const [gameId, errors] of Object.entries(allErrors)) {
    if (errors.length >= 3) {
      const tip = GAME_TIPS[gameId]?.errorTip;
      if (tip) {
        insights.push({ type: 'error', gameId, tip });
      }
    }
  }

  return insights.slice(0, 4);
}

const INSIGHT_ICONS = {
  struggle: '💪',
  progress: '🚀',
  unlock:   '🔓',
  error:    '🧐',
};

// ── Mini bars ────────────────────────────────────────────────────────────────

function MiniBars({ history }) {
  const recent = history.slice(0, 5).reverse();
  if (recent.length === 0) return null;

  const maxScore = Math.max(...recent.map((h) => h.score || 0), 1);

  return (
    <div className="stats-mini-bars" title="Évolution de tes 5 derniers scores">
      {recent.map((h, i) => {
        const heightPx = Math.max(4, Math.round(((h.score || 0) / maxScore) * 40));
        const color = barColor(h.score || 0, maxScore);
        return (
          <div
            key={i}
            className="stats-mini-bar"
            style={{ height: `${heightPx}px`, background: color }}
            title={`Score : ${h.score}`}
          />
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function StatsPage() {
  const [allProgress, setAllProgress]   = useState({});
  const [allErrors, setAllErrors]       = useState({});
  const [appTime, setAppTime]           = useState({ totalSecs: 0 });
  const [totalStats, setTotalStats]     = useState(null);
  const [activeTab, setActiveTab]       = useState('Tous');
  const [loaded, setLoaded]             = useState(false);

  useEffect(() => {
    const progress = getAllGameProgress();
    const errors   = getAllErrors();
    const time     = getAppTime();
    const stats    = getTotalStats();

    setAllProgress(progress);
    setAllErrors(errors);
    setAppTime(time);
    setTotalStats(stats);
    setLoaded(true);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────

  const hasAnyData = loaded && totalStats && totalStats.gamesPlayed > 0;

  const categoryStats = hasAnyData ? computeCategoryStats(allProgress) : null;

  const insights = hasAnyData ? generateInsights(allProgress, allErrors) : [];

  // Best game (highest bestScore)
  const bestGameEntry = hasAnyData
    ? Object.entries(allProgress).reduce(
        (best, [id, gp]) => (gp.bestScore > (best?.score ?? -1) ? { id, score: gp.bestScore } : best),
        null,
      )
    : null;

  // Sorted played games
  const playedGames = hasAnyData
    ? Object.entries(allProgress)
        .filter(([, gp]) => gp.sessionsPlayed > 0)
        .sort((a, b) => {
          const dateA = a[1].lastPlayed ? new Date(a[1].lastPlayed).getTime() : 0;
          const dateB = b[1].lastPlayed ? new Date(b[1].lastPlayed).getTime() : 0;
          return dateB - dateA;
        })
    : [];

  const filteredGames = activeTab === 'Tous'
    ? playedGames
    : playedGames.filter(([id]) => GAME_CATEGORIES[id] === TAB_CATEGORIES[activeTab]);

  // Error games — max 5 games, max 3 errors each
  const errorGames = hasAnyData
    ? Object.entries(allErrors)
        .filter(([, errs]) => errs && errs.length > 0)
        .filter(([id]) => allProgress[id]?.sessionsPlayed > 0)
        .slice(0, 5)
    : [];

  // ── Render ────────────────────────────────────────────────────────────────

  if (!loaded) {
    return (
      <div className="stats-page">
        <div className="stats-empty">
          <span className="stats-empty__icon">⏳</span>
          <p className="stats-empty__text">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hasAnyData) {
    return (
      <div className="stats-page">
        <Link to="/jeux" className="stats-back">← Retour aux jeux</Link>
        <h1 className="stats-page-title">📊 Mes statistiques</h1>
        <div className="stats-empty">
          <span className="stats-empty__icon">🎮</span>
          <p className="stats-empty__text">
            Joue à des jeux pour voir tes statistiques ici !
          </p>
          <Link to="/jeux" className="stats-replay-btn" style={{ marginTop: 20, display: 'inline-block' }}>
            Jouer maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <Link to="/jeux" className="stats-back">← Retour aux jeux</Link>
      <h1 className="stats-page-title">📊 Mes statistiques</h1>

      {/* ── 1. Hero pills ───────────────────────────────────────────── */}
      <div className="stats-hero">
        <div className="stats-pill">
          <span className="stats-pill__emoji">🕐</span>
          <span className="stats-pill__val">{formatDuration(appTime.totalSecs)}</span>
          <span className="stats-pill__lbl">Temps total</span>
        </div>
        <div className="stats-pill">
          <span className="stats-pill__emoji">🎮</span>
          <span className="stats-pill__val">{totalStats.totalSessions}</span>
          <span className="stats-pill__lbl">Parties jouées</span>
        </div>
        <div className="stats-pill">
          <span className="stats-pill__emoji">🏆</span>
          <span className="stats-pill__val" style={{ fontSize: '0.85rem' }}>
            {bestGameEntry ? (GAME_NAMES[bestGameEntry.id] || bestGameEntry.id) : '—'}
          </span>
          <span className="stats-pill__lbl">Meilleur jeu</span>
        </div>
        <div className="stats-pill">
          <span className="stats-pill__emoji">🎯</span>
          <span className="stats-pill__val">{totalStats.gamesPlayed}</span>
          <span className="stats-pill__lbl">Jeux essayés</span>
        </div>
      </div>

      {/* ── 2. Category radar ───────────────────────────────────────── */}
      <h2 className="stats-section-title">Performances par catégorie</h2>
      {CAT_ORDER.map((cat) => {
        const data = categoryStats[cat];
        if (data.count === 0) return null;
        const color = CAT_COLORS[cat];
        const starsStr = starsDisplay(Math.round(data.avgStars));
        return (
          <div key={cat} className="stats-cat-row">
            <div className="stats-cat-label">
              <span>
                {CAT_LABELS[cat]}
                <span className="stats-cat-stars">{starsStr}</span>
              </span>
              <span className="stats-cat-label__pct">{data.pct}%</span>
            </div>
            <div className="stats-cat-bar">
              <div
                className="stats-cat-fill"
                style={{ width: `${data.pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}

      {/* ── 3. Insights ─────────────────────────────────────────────── */}
      {insights.length > 0 && (
        <>
          <h2 className="stats-section-title">Ce que tu peux améliorer</h2>
          <div className="stats-insights-grid">
            {insights.map((insight, i) => (
              <div key={i} className={`stats-insight stats-insight--${insight.type}`}>
                <span className="stats-insight__icon">{INSIGHT_ICONS[insight.type]}</span>
                <span className="stats-insight__game">
                  {GAME_NAMES[insight.gameId] || insight.gameId}
                </span>
                <p className="stats-insight__tip">{insight.tip}</p>
                <Link to={`/jeux/${insight.gameId}`} className="stats-insight__btn">
                  Rejouer
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── 4. Per-game list ─────────────────────────────────────────── */}
      <h2 className="stats-section-title">Mes jeux</h2>

      <div className="stats-tabs">
        {Object.keys(TAB_CATEGORIES).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`stats-tab${activeTab === tab ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <div className="stats-no-data">Aucun jeu dans cette catégorie pour l'instant.</div>
      ) : (
        <div className="stats-game-grid">
        {filteredGames.map(([gameId, gp]) => {
          const name    = GAME_NAMES[gameId] || gameId;
          const emoji   = GAME_EMOJIS[gameId] || '🎮';
          const stars   = Math.round(
            gp.history?.length
              ? gp.history.slice(0, 5).reduce((s, h) => s + (h.stars || 0), 0) / Math.min(gp.history.length, 5)
              : 0,
          );

          return (
            <div key={gameId} className="stats-game-card">
              <div className="stats-game-card__header">
                <span className="stats-game-card__name">{emoji} {name}</span>
                <span className="stats-game-card__level">Niv. {gp.bestLevel ?? 1}</span>
              </div>

              <div className="stats-game-card__meta">
                <span className="stats-game-card__meta-item">⭐ {gp.bestScore} pts</span>
                <span className="stats-game-card__meta-item">🎮 {gp.sessionsPlayed} {gp.sessionsPlayed === 1 ? 'partie' : 'parties'}</span>
                {gp.totalTimeSecs > 0 && <span className="stats-game-card__meta-item">⏱ {formatDuration(gp.totalTimeSecs)}</span>}
              </div>

              {gp.history?.length > 0 && (
                <MiniBars history={gp.history} />
              )}

              <div className="stats-game-card__footer">
                <div>
                  <div className="stats-game-stars">{starsDisplay(stars)}</div>
                  {gp.lastPlayed && (
                    <div className="stats-game-card__date">{formatDate(gp.lastPlayed)}</div>
                  )}
                </div>
                <Link to={`/jeux/${gameId}`} className="stats-replay-btn">
                  Rejouer
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* ── 5. Error log ─────────────────────────────────────────────── */}
      {errorGames.length > 0 && (
        <>
          <h2 className="stats-section-title">Tes erreurs récentes</h2>
          {errorGames.map(([gameId, errors]) => {
            const name = GAME_NAMES[gameId] || gameId;
            const emoji = GAME_EMOJIS[gameId] || '🎮';
            const recent = errors.slice(0, 3);
            return (
              <div key={gameId} className="stats-error-card">
                <div className="stats-error-card__header">
                  <span className="stats-error-card__title">{emoji} {name}</span>
                  <Link to={`/jeux/${gameId}`} className="stats-error-revise-btn">
                    Réviser
                  </Link>
                </div>
                {recent.map((err, i) => (
                  <div key={i} className="stats-error-item">
                    ❌{' '}
                    {err.label && <><strong>{err.label}</strong>{' → '}</>}
                    {err.given != null && err.correct != null
                      ? <>Tu as dit <em>"{String(err.given)}"</em>, la bonne réponse était <em>"{String(err.correct)}"</em></>
                      : err.label || 'Erreur enregistrée'}
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
