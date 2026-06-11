import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateExercise } from '../../engines/generators/exerciseGenerators.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { gradeFromAge, gradeIndex } from '../../services/learning/gradeModel.js';
import { recordPlayedExercise } from '../../services/learning/recordPlayedExercise.js';
import {
  bandConfig, startingBand, nextBand, detectLimit, isMissionComplete, MAX_CHALLENGES,
} from './missionEngine.js';
import './missionImpossible.css';

const TOPIC_LABEL = {
  addition: 'Addition', subtraction: 'Soustraction', comparison: 'Comparaison',
  'logic-sequence': 'Logique', multiplication: 'Multiplication', division: 'Division',
  'word-problems': 'Problème', logic: 'Réflexion', fractions: 'Fractions',
  'mixed-operations': 'Calcul mixte',
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildChallenge(band) {
  const cfg = bandConfig(band);
  const topic = pick(cfg.topics);
  const ex = generateExercise({ topic, grade: cfg.grade, difficulty: cfg.difficulty, language: 'fr' });
  return { band, topic, cfg, ex };
}

export default function MissionImpossiblePage() {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'play' | 'done'
  const [challenge, setChallenge] = useState(null);
  const [band, setBand] = useState(2);
  const [picked, setPicked] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const logRef = useRef([]);             // [{band, isCorrect}] whole mission
  const bandResultsRef = useRef([]);     // boolean[] for the current band run
  const startRef = useRef(Date.now());
  const advanceTimerRef = useRef(null);  // auto-advance timer on correct answers

  const start = useCallback(() => {
    const profile = getProfile();
    const gi = gradeIndex(profile.schoolGrade || gradeFromAge(profile.age)) || 3;
    const first = startingBand(gi);
    logRef.current = [];
    bandResultsRef.current = [];
    setCorrectCount(0);
    setBand(first);
    setChallenge(buildChallenge(first));
    setPicked(null);
    setReveal(false);
    setPhase('play');
    startRef.current = Date.now();
  }, []);

  function answer(option) {
    if (reveal || !challenge) return;
    const { ex, band: b, topic, cfg } = challenge;
    const isCorrect = String(option) === String(ex.correct);
    setPicked(option);
    setReveal(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    // Track 1: record the real played challenge (rich, per-question).
    recordPlayedExercise({
      exerciseId:     `mission-${topic}`,
      sourceModule:   'mission-impossible',
      gameMode:       'mission',
      subject:        'mission',
      skill:          topic,
      questionType:   ex.type || topic,
      question:       ex.question,
      expectedAnswer: ex.correct,
      childAnswer:    option,
      isCorrect,
      responseTimeMs: Date.now() - startRef.current,
      difficultyBefore: b,
      generatedBy:    'mission-engine',
    });

    logRef.current.push({ band: b, isCorrect });
    bandResultsRef.current.push(isCorrect);

    // Positive feedback is silent: a correct answer just moves on (brief green flash).
    // Feedback is only shown when the child gets it wrong.
    if (isCorrect) {
      advanceTimerRef.current = window.setTimeout(advance, 650);
    }
  }

  function advance() {
    if (advanceTimerRef.current) { window.clearTimeout(advanceTimerRef.current); advanceTimerRef.current = null; }
    if (isMissionComplete(logRef.current)) { setPhase('done'); return; }
    const decision = nextBand(band, bandResultsRef.current);
    if (decision.direction !== 'stay') bandResultsRef.current = []; // fresh run on the new band
    setBand(decision.band);
    setChallenge(buildChallenge(decision.band));
    setPicked(null);
    setReveal(false);
    startRef.current = Date.now();
  }

  // Keyboard: Enter advances after reveal.
  useEffect(() => {
    function onKey(e) { if (e.key === 'Enter' && reveal) advance(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Clear any pending auto-advance timer on unmount.
  useEffect(() => () => { if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current); }, []);

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="mi-page">
        <Link to="/pratiquer" className="mi-back">←</Link>
        <div className="mi-intro">
          <div className="mi-badge">🕶️</div>
          <h1 className="mi-title">Mission Impossible</h1>
          <p className="mi-tagline">
            Une série de défis secrets. Plus tu réussis, plus ça devient corsé.
            On découvre jusqu'où tu peux aller&nbsp;!
          </p>
          <button className="mi-cta" onClick={start}>Commencer la mission</button>
        </div>
      </div>
    );
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const limit = detectLimit(logRef.current);
    const limitCfg = limit ? bandConfig(limit) : null;
    return (
      <div className="mi-page">
        <div className="mi-intro">
          <div className="mi-badge">🏆</div>
          <h1 className="mi-title">Mission terminée</h1>
          <p className="mi-tagline">
            Tu as réussi <strong>{correctCount}</strong> défis sur {logRef.current.length}.
          </p>
          {limitCfg && (
            <div className="mi-limit-card">
              <span className="mi-limit-label">Ton niveau actuel</span>
              <span className="mi-limit-band">Palier {limit} / 5</span>
              <span className="mi-limit-detail">{limitCfg.grade} · {limitCfg.difficulty}</span>
            </div>
          )}
          <div className="mi-actions">
            <button className="mi-cta" onClick={start}>Refaire une mission</button>
            <Link to="/pratiquer" className="mi-cta mi-cta--ghost">Retour</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Play ────────────────────────────────────────────────────────────────────
  const { ex, topic } = challenge;
  return (
    <div className="mi-page">
      <Link to="/pratiquer" className="mi-back">←</Link>
      <div className="mi-hud">
        <span className="mi-hud-band">PALIER {band}/5</span>
        <span className="mi-hud-topic">{TOPIC_LABEL[topic] || topic}</span>
        <span className="mi-hud-progress">{logRef.current.length}/{MAX_CHALLENGES}</span>
      </div>

      <div className="mi-stage">
        <div className="mi-question">{ex.question}</div>
        <div className="mi-options">
          {ex.options.map((opt, i) => {
            const isPicked = String(picked) === String(opt);
            const isAnswer = String(ex.correct) === String(opt);
            const cls = reveal
              ? isAnswer ? 'mi-opt mi-opt--correct'
                : isPicked ? 'mi-opt mi-opt--wrong' : 'mi-opt mi-opt--dim'
              : 'mi-opt';
            return (
              <button key={i} className={cls} disabled={reveal} onClick={() => answer(opt)}>
                {opt}
              </button>
            );
          })}
        </div>

        {reveal && String(picked) !== String(ex.correct) && (
          <div className="mi-feedback">
            <p className="mi-fb-no">❌ La réponse était <strong>{ex.correct}</strong></p>
            {ex.explanation && <p className="mi-fb-exp">{ex.explanation}</p>}
            <button className="mi-cta" onClick={advance}>Défi suivant →</button>
          </div>
        )}
      </div>
    </div>
  );
}
