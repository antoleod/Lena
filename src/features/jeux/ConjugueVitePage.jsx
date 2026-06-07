import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// ─── Verb data ────────────────────────────────────────────────────────────────
const VERBS = {
  etre: {
    label: 'etre',
    present:   { je:'suis',    tu:'es',       il:'est',      nous:'sommes',    vous:'etes',      ils:'sont'      },
    passe:     { je:'ai ete',  tu:'as ete',   il:'a ete',    nous:'avons ete', vous:'avez ete',  ils:'ont ete'   },
    imparfait: { je:'etais',   tu:'etais',    il:'etait',    nous:'etions',    vous:'etiez',     ils:'etaient'   },
    futur:     { je:'serai',   tu:'seras',    il:'sera',     nous:'serons',    vous:'serez',     ils:'seront'    },
  },
  avoir: {
    label: 'avoir',
    present:   { je:'ai',      tu:'as',       il:'a',        nous:'avons',     vous:'avez',      ils:'ont'       },
    passe:     { je:'ai eu',   tu:'as eu',    il:'a eu',     nous:'avons eu',  vous:'avez eu',   ils:'ont eu'    },
    imparfait: { je:'avais',   tu:'avais',    il:'avait',    nous:'avions',    vous:'aviez',     ils:'avaient'   },
    futur:     { je:'aurai',   tu:'auras',    il:'aura',     nous:'aurons',    vous:'aurez',     ils:'auront'    },
  },
  aller: {
    label: 'aller',
    present:   { je:'vais',    tu:'vas',      il:'va',       nous:'allons',    vous:'allez',     ils:'vont'      },
    passe:     { je:'suis alle',tu:'es alle', il:'est alle', nous:'sommes alles',vous:'etes alles',ils:'sont alles'},
    imparfait: { je:'allais',  tu:'allais',   il:'allait',   nous:'allions',   vous:'alliez',    ils:'allaient'  },
    futur:     { je:'irai',    tu:'iras',     il:'ira',      nous:'irons',     vous:'irez',      ils:'iront'     },
  },
  faire: {
    label: 'faire',
    present:   { je:'fais',    tu:'fais',     il:'fait',     nous:'faisons',   vous:'faites',    ils:'font'      },
    passe:     { je:'ai fait', tu:'as fait',  il:'a fait',   nous:'avons fait',vous:'avez fait', ils:'ont fait'  },
    imparfait: { je:'faisais', tu:'faisais',  il:'faisait',  nous:'faisions',  vous:'faisiez',   ils:'faisaient' },
    futur:     { je:'ferai',   tu:'feras',    il:'fera',     nous:'ferons',    vous:'ferez',     ils:'feront'    },
  },
  jouer: {
    label: 'jouer',
    present:   { je:'joue',    tu:'joues',    il:'joue',     nous:'jouons',    vous:'jouez',     ils:'jouent'    },
    passe:     { je:'ai joue', tu:'as joue',  il:'a joue',   nous:'avons joue',vous:'avez joue', ils:'ont joue'  },
    imparfait: { je:'jouais',  tu:'jouais',   il:'jouait',   nous:'jouions',   vous:'jouiez',    ils:'jouaient'  },
    futur:     { je:'jouerai', tu:'joueras',  il:'jouera',   nous:'jouerons',  vous:'jouerez',   ils:'joueront'  },
  },
  manger: {
    label: 'manger',
    present:   { je:'mange',   tu:'manges',   il:'mange',    nous:'mangeons',  vous:'mangez',    ils:'mangent'   },
    passe:     { je:'ai mange',tu:'as mange', il:'a mange',  nous:'avons mange',vous:'avez mange',ils:'ont mange' },
    imparfait: { je:'mangeais',tu:'mangeais', il:'mangeait', nous:'mangions',  vous:'mangiez',   ils:'mangeaient'},
    futur:     { je:'mangerai',tu:'mangeras', il:'mangera',  nous:'mangerons', vous:'mangerez',  ils:'mangeront' },
  },
  finir: {
    label: 'finir',
    present:   { je:'finis',   tu:'finis',    il:'finit',    nous:'finissons', vous:'finissez',  ils:'finissent' },
    passe:     { je:'ai fini', tu:'as fini',  il:'a fini',   nous:'avons fini',vous:'avez fini', ils:'ont fini'  },
    imparfait: { je:'finissais',tu:'finissais',il:'finissait',nous:'finissions',vous:'finissiez', ils:'finissaient'},
    futur:     { je:'finirai', tu:'finiras',  il:'finira',   nous:'finirons',  vous:'finirez',   ils:'finiront'  },
  },
  sortir: {
    label: 'sortir',
    present:   { je:'sors',    tu:'sors',     il:'sort',     nous:'sortons',   vous:'sortez',    ils:'sortent'   },
    passe:     { je:'suis sorti',tu:'es sorti',il:'est sorti',nous:'sommes sortis',vous:'etes sortis',ils:'sont sortis'},
    imparfait: { je:'sortais', tu:'sortais',  il:'sortait',  nous:'sortions',  vous:'sortiez',   ils:'sortaient' },
    futur:     { je:'sortirai',tu:'sortiras', il:'sortira',  nous:'sortirons', vous:'sortirez',  ils:'sortiront' },
  },
  dormir: {
    label: 'dormir',
    present:   { je:'dors',    tu:'dors',     il:'dort',     nous:'dormons',   vous:'dormez',    ils:'dorment'   },
    passe:     { je:'ai dormi',tu:'as dormi', il:'a dormi',  nous:'avons dormi',vous:'avez dormi',ils:'ont dormi' },
    imparfait: { je:'dormais', tu:'dormais',  il:'dormait',  nous:'dormions',  vous:'dormiez',   ils:'dormaient' },
    futur:     { je:'dormirai',tu:'dormiras', il:'dormira',  nous:'dormirons', vous:'dormirez',  ils:'dormiront' },
  },
  partir: {
    label: 'partir',
    present:   { je:'pars',    tu:'pars',     il:'part',     nous:'partons',   vous:'partez',    ils:'partent'   },
    passe:     { je:'suis parti',tu:'es parti',il:'est parti',nous:'sommes partis',vous:'etes partis',ils:'sont partis'},
    imparfait: { je:'partais', tu:'partais',  il:'partait',  nous:'partions',  vous:'partiez',   ils:'partaient' },
    futur:     { je:'partirai',tu:'partiras', il:'partira',  nous:'partirons', vous:'partirez',  ils:'partiront' },
  },
  mettre: {
    label: 'mettre',
    present:   { je:'mets',    tu:'mets',     il:'met',      nous:'mettons',   vous:'mettez',    ils:'mettent'   },
    passe:     { je:'ai mis',  tu:'as mis',   il:'a mis',    nous:'avons mis', vous:'avez mis',  ils:'ont mis'   },
    imparfait: { je:'mettais', tu:'mettais',  il:'mettait',  nous:'mettions',  vous:'mettiez',   ils:'mettaient' },
    futur:     { je:'mettrai', tu:'mettras',  il:'mettra',   nous:'mettrons',  vous:'mettrez',   ils:'mettront'  },
  },
  dire: {
    label: 'dire',
    present:   { je:'dis',     tu:'dis',      il:'dit',      nous:'disons',    vous:'dites',     ils:'disent'    },
    passe:     { je:'ai dit',  tu:'as dit',   il:'a dit',    nous:'avons dit', vous:'avez dit',  ils:'ont dit'   },
    imparfait: { je:'disais',  tu:'disais',   il:'disait',   nous:'disions',   vous:'disiez',    ils:'disaient'  },
    futur:     { je:'dirai',   tu:'diras',    il:'dira',     nous:'dirons',    vous:'direz',     ils:'diront'    },
  },
  prendre: {
    label: 'prendre',
    present:   { je:'prends',  tu:'prends',   il:'prend',    nous:'prenons',   vous:'prenez',    ils:'prennent'  },
    passe:     { je:'ai pris', tu:'as pris',  il:'a pris',   nous:'avons pris',vous:'avez pris', ils:'ont pris'  },
    imparfait: { je:'prenais', tu:'prenais',  il:'prenait',  nous:'prenions',  vous:'preniez',   ils:'prenaient' },
    futur:     { je:'prendrai',tu:'prendras', il:'prendra',  nous:'prendrons', vous:'prendrez',  ils:'prendront' },
  },
  connaitre: {
    label: 'connaitre',
    present:   { je:'connais', tu:'connais',  il:'connait',  nous:'connaissons',vous:'connaissez',ils:'connaissent'},
    passe:     { je:'ai connu',tu:'as connu', il:'a connu',  nous:'avons connu',vous:'avez connu',ils:'ont connu' },
    imparfait: { je:'connaissais',tu:'connaissais',il:'connaissait',nous:'connaissions',vous:'connaissiez',ils:'connaissaient'},
    futur:     { je:'connaitrai',tu:'connaîtras',il:'connaitra',nous:'connaitrons',vous:'connaitrez',ils:'connaitront'},
  },
};

const TENSE_LABELS = {
  present:   'present',
  passe:     'passe compose',
  imparfait: 'imparfait',
  futur:     'futur simple',
};

const ALL_PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

const LEVEL_CONFIG = [
  { id:1,  label:'N1',  verbs:['etre','avoir'],                                                          tenses:['present'],                        nQ:8,  timer:15 },
  { id:2,  label:'N2',  verbs:['etre','avoir','aller'],                                                  tenses:['present'],                        nQ:8,  timer:12 },
  { id:3,  label:'N3',  verbs:['etre','avoir','aller','faire'],                                          tenses:['present'],                        nQ:10, timer:12 },
  { id:4,  label:'N4',  verbs:['etre','avoir','aller','faire','jouer','manger'],                         tenses:['present'],                        nQ:10, timer:10 },
  { id:5,  label:'N5',  verbs:['etre','avoir','aller','faire','jouer','manger','finir'],                 tenses:['present'],                        nQ:12, timer:10 },
  { id:6,  label:'N6',  verbs:['etre','avoir','aller','faire'],                                          tenses:['present','futur'],                nQ:10, timer:12 },
  { id:7,  label:'N7',  verbs:['aller','faire','jouer','finir','dormir'],                                tenses:['present','futur'],                nQ:12, timer:10 },
  { id:8,  label:'N8',  verbs:['etre','avoir','aller','faire','jouer','manger'],                         tenses:['present','imparfait'],            nQ:12, timer:10 },
  { id:9,  label:'N9',  verbs:['etre','avoir','partir','sortir','mettre'],                               tenses:['present','imparfait'],            nQ:12, timer:8  },
  { id:10, label:'N10', verbs:['etre','avoir','aller','faire','jouer','manger','finir','dormir'],         tenses:['present','futur','imparfait'],    nQ:12, timer:8  },
  { id:11, label:'N11', verbs:['aller','faire','jouer','manger','finir','partir','prendre'],              tenses:['present','futur','passe'],        nQ:15, timer:8  },
  { id:12, label:'N12', verbs:['etre','avoir','aller','faire','sortir','mettre','dire'],                  tenses:['present','imparfait','passe'],    nQ:15, timer:6  },
  { id:13, label:'N13', verbs:['etre','avoir','aller','faire','jouer','finir','dormir','partir','prendre'],tenses:['present','futur','imparfait'],   nQ:15, timer:6  },
  { id:14, label:'N14', verbs:['etre','avoir','aller','faire','jouer','manger','finir','dormir','partir','mettre'],tenses:['present','futur','passe','imparfait'],nQ:15,timer:5},
  { id:15, label:'N15', verbs:['etre','avoir','aller','faire','jouer','manger','finir','dormir','partir','mettre','dire','prendre','connaitre'],tenses:['present','futur','passe','imparfait'],nQ:15,timer:5},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildAllAnswers(verbKeys, tenses) {
  const pool = new Set();
  verbKeys.forEach(vk => {
    tenses.forEach(tense => {
      ALL_PRONOUNS.forEach(p => {
        const form = VERBS[vk]?.[tense]?.[p];
        if (form) pool.add(form);
      });
    });
  });
  return [...pool];
}

function generateQuestion(cfg) {
  const vk = cfg.verbs[Math.floor(Math.random() * cfg.verbs.length)];
  const tense = cfg.tenses[Math.floor(Math.random() * cfg.tenses.length)];
  const pron = ALL_PRONOUNS[Math.floor(Math.random() * ALL_PRONOUNS.length)];
  const correct = VERBS[vk][tense][pron];
  const allAnswers = buildAllAnswers(cfg.verbs, cfg.tenses);
  const distractors = allAnswers.filter(a => a !== correct);
  const chosen = [];
  while (chosen.length < 3 && distractors.length > 0) {
    const pick = distractors[Math.floor(Math.random() * distractors.length)];
    if (!chosen.includes(pick)) chosen.push(pick);
    if (chosen.length >= distractors.length) break;
  }
  // Pad if not enough distractors
  while (chosen.length < 3) chosen.push('—');
  const choices = [correct, ...chosen].sort(() => Math.random() - 0.5);
  return { verbKey: vk, pronoun: pron, tense, correct, choices };
}

function buildQuestions(cfg) {
  return Array.from({ length: cfg.nQ }, () => generateQuestion(cfg));
}

function starsFor(correct, total) {
  const ratio = correct / total;
  if (ratio >= 13 / 15) return 3;
  if (ratio >= 9 / 15) return 2;
  return 1;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const CV_CHOICE_COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#f97316'];

export default function ConjugueVitePage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('conjugue');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const timerRef = useRef(null);
  const lockRef = useRef(false);
  const scoreRef = useRef(0);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const startGame = () => {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const qs = buildQuestions(c);
    scoreRef.current = 0;
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(c.timer);
    setSelected(null);
    setSessionResult(null);
    lockRef.current = false;
    resetTimer();
    setPhase('play');
  };

  const advanceQuestion = (currentQIdx, currentCfg) => {
    const next = currentQIdx + 1;
    if (next >= currentCfg.nQ) {
      const stars = starsFor(scoreRef.current, currentCfg.nQ);
      const result = saveSession({ score: scoreRef.current, level: selectedLevel, stars });
      setSessionResult(result);
      setPhase('results');
      return;
    }
    setQIdx(next);
    setTimeLeft(currentCfg.timer);
    setSelected(null);
    lockRef.current = false;
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const c = LEVEL_CONFIG[selectedLevel - 1];
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!lockRef.current) {
            lockRef.current = true;
            setStreak(0);
            const tq = questions[qIdx];
            if (tq) {
              logError({
                label: `${tq.pronoun} ___ (${VERBS[tq.verbKey].label} — ${TENSE_LABELS[tq.tense]})`,
                correct: tq.correct,
                given: 'timeout',
              });
            }
            setSelected({ choice: null, correct: questions[qIdx]?.correct });
            setTimeout(() => advanceQuestion(qIdx, c), 1000);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (choice) => {
    if (lockRef.current) return;
    lockRef.current = true;
    clearInterval(timerRef.current);
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const q = questions[qIdx];
    const isCorrect = choice === q.correct;
    setSelected({ choice, correct: q.correct });
    if (isCorrect) {
      scoreRef.current += 1;
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        triggerCorrect();
        triggerScore('+10');
        if (newStreak >= 3) triggerCombo(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
      triggerWrong();
      logError({
        label: `${q.pronoun} ___ (${VERBS[q.verbKey].label} — ${TENSE_LABELS[q.tense]})`,
        correct: q.correct,
        given: choice,
      });
    }
    setTimeout(() => advanceQuestion(qIdx, c), 900);
  };

  if (phase === 'setup') {
    return (
      <div className="cv-page">
        <div className="cv-setup-icon">⚡</div>
        <div className="cv-setup-title">Conjugue Vite !</div>
        <div className="cv-setup-sub">Choisis le bon niveau et conjugue !</div>

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

        <div className="cv-setup-sub" style={{ marginBottom: 8 }}>
          {cfg.nQ} questions · {cfg.timer}s par question
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

        <button className="cv-cta" onPointerDown={e => { e.preventDefault(); startGame(); }} style={{ marginBottom: 12 }}>C'est parti !</button>
        <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
          Retour aux jeux
        </Link>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsFor(score, cfg.nQ);
    const emoji = stars === 3 ? '🏆' : stars === 2 ? '🎉' : '📚';
    const title = stars === 3 ? 'Parfait !' : stars === 2 ? 'Bien joue !' : 'Continue !';
    return (
      <div className="cv-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{emoji}</div>
          <div className="game-results__title">{title}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{score}/{cfg.nQ}</span>
              <span className="game-results__stat-lbl">Bonnes reponses</span>
            </div>
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const timerPct = (timeLeft / cfg.timer) * 100;
  const urgent = timeLeft <= 4;

  return (
    <div className="cv-page">
      <GameFeedback ref={feedbackRef} />
      <div className="cv-header">
        <Link to="/jeux" className="cv-back">← Jeux</Link>
        <div className="cv-title">Conjugue Vite</div>
      </div>
      <div className="cv-hud game-hud">
        <div className="cv-progress game-hud__round">{qIdx + 1}/{cfg.nQ}</div>
        <div className="cv-score game-hud__score">{score} pts</div>
        {streak >= 3 && <div className="cv-streak game-hud__streak">🔥 x{streak}</div>}
      </div>
      <div className="cv-timer-bar game-timer-bar">
        <div className={`cv-timer-fill game-timer-fill${urgent ? ' cv-timer-fill--urgent game-timer-fill--urgent' : ''}`} style={{ width: `${timerPct}%` }} />
      </div>
      <div className="cv-question-card game-question-card">
        <div className="cv-tense-label game-question-sub">{TENSE_LABELS[q.tense]}</div>
        <div className="cv-pronoun game-question-text">{q.pronoun.charAt(0).toUpperCase() + q.pronoun.slice(1)}</div>
        <div className="cv-verb-hint">
          <span className="cv-blank">___</span> ({VERBS[q.verbKey].label})
        </div>
      </div>
      <div className="cv-choices">
        {q.choices.map((c, i) => {
          let cls = 'cv-choice game-btn';
          if (selected) {
            if (c === selected.correct) cls += ' cv-choice--correct game-btn--correct';
            else if (c === selected.choice) cls += ' cv-choice--wrong game-btn--wrong';
          }
          return (
            <button
              key={i}
              className={cls}
              style={{ '--btn-color': CV_CHOICE_COLORS[i % CV_CHOICE_COLORS.length] }}
              onPointerDown={e => { e.preventDefault(); handleChoice(c); }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
