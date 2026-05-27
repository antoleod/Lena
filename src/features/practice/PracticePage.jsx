import { useState } from 'react';
import { Link } from 'react-router-dom';
import Mascot from '../../shared/ui/Mascot.jsx';
import { playTapSound } from '../../services/sound/soundService.js';
import { generateMultiplicationExercise } from '../../engines/generators/multiplicationGenerator.js';
import { generateDivisionExercise } from '../../engines/generators/divisionGenerator.js';
import { generateSubtractionExercise } from '../../engines/generators/subtractionGenerator.js';

// ─── helpers ────────────────────────────────────────────────────────────────

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeTableQuestion(tableNum) {
  const b = rnd(1, 10);
  const correct = tableNum * b;
  const wrong = [
    tableNum * (b + 1),
    tableNum * Math.max(1, b - 1),
    tableNum * (b + 2),
    correct + 1,
  ].filter((v) => v > 0 && v !== correct);
  return {
    question: `${tableNum} × ${b} = ?`,
    options: shuffled([correct, ...shuffled(wrong).slice(0, 3)]),
    correct,
    explanation: `${tableNum} × ${b} = ${correct} (${tableNum} fois ${b}).`,
  };
}

function makeQuestion(topic, tableNum) {
  if (topic === 'multiplication') {
    return tableNum
      ? makeTableQuestion(tableNum)
      : generateMultiplicationExercise({ grade: 'P3', difficulty: 'medium' });
  }
  if (topic === 'division') return generateDivisionExercise({ grade: 'P3', difficulty: 'medium' });
  return generateSubtractionExercise({ grade: 'P3', difficulty: 'medium' });
}

const TOTAL = 10;

// ─── topics ─────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: 'multiplication', symbol: '×', label: 'Tables de multiplication', sub: 'Choisis une table ou mixte', color: '#ffcf74', ring: 'rgba(255,207,116,0.18)' },
  { id: 'division',       symbol: '÷', label: 'Division',                 sub: 'Partager en groupes égaux',  color: '#8bdcc3', ring: 'rgba(139,220,195,0.18)' },
  { id: 'subtraction',    symbol: '−', label: 'Soustraction',             sub: 'Enlever une quantité',       color: '#78a6ff', ring: 'rgba(120,166,255,0.18)' },
];

// ─── visual sub-components ───────────────────────────────────────────────────

function DotGrid({ rows, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 5, margin: '0 auto', width: 'fit-content' }}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
      ))}
    </div>
  );
}

function GroupsDots({ total, groups }) {
  const perGroup = Math.floor(total / groups);
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} style={{ border: '2px solid var(--mint)', borderRadius: 10, padding: 7, display: 'flex', gap: 5, flexWrap: 'wrap', maxWidth: 64, justifyContent: 'center' }}>
          {Array.from({ length: perGroup }, (_, d) => (
            <span key={d} style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mint)', display: 'block' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function RemoveDots({ start, remove }) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: start }, (_, i) => {
        const removed = i >= start - remove;
        return (
          <span key={i} style={{
            width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: removed ? 'rgba(255,100,100,0.1)' : 'var(--secondary)',
            border: removed ? '2px solid #ff6464' : 'none',
            fontSize: 9, color: '#ff6464', fontWeight: 900,
          }}>
            {removed ? '✕' : ''}
          </span>
        );
      })}
    </div>
  );
}

function StepBreakdown({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          padding: '7px 18px',
          borderRadius: 10,
          background: i === steps.length - 1 ? 'var(--theme-gradient)' : 'rgba(255,255,255,0.75)',
          color: i === steps.length - 1 ? 'white' : 'var(--text)',
          fontWeight: 800,
          fontSize: i === steps.length - 1 ? '1.05rem' : '0.92rem',
          boxShadow: i === steps.length - 1 ? '0 4px 16px rgba(244,109,177,0.18)' : 'none',
          minWidth: 160, textAlign: 'center',
        }}>
          {step}
        </div>
      ))}
    </div>
  );
}

// ─── tutorial definitions ────────────────────────────────────────────────────

const TUTORIALS = {
  multiplication: [
    {
      title: 'Multiplier = compter des groupes égaux',
      mascotMsg: 'Je t\'explique avec des points, regarde ! 🌟',
      body: 'Multiplier 3 × 4, c\'est faire 3 rangées de 4 points. On additionne tout : 4 + 4 + 4 = 12 !',
      Visual: () => (
        <div style={{ textAlign: 'center' }}>
          <DotGrid rows={3} cols={4} />
          <div style={{ marginTop: 8, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text)' }}>3 × 4 = 12</div>
        </div>
      ),
    },
    {
      title: 'Exemple : 5 × 6',
      mascotMsg: 'Suis chaque étape, c\'est simple ! 👀',
      body: 'On lit "5 fois 6". On additionne 6 cinq fois. Résultat : 30.',
      Visual: () => <StepBreakdown steps={['5 × 6', '= 6 + 6 + 6 + 6 + 6', '= 30 ✓']} />,
    },
    {
      title: 'À toi d\'essayer !',
      mascotMsg: 'Tap "Voir la réponse", ensuite on s\'entraîne ! 🚀',
      body: '2 groupes de 5 = 5 + 5 = 10. Prêt(e) ?',
      Visual: null,
      tryIt: { q: '2 × 5 = ?', a: 10, hint: '2 groupes de 5 = 5 + 5' },
    },
  ],
  division: [
    {
      title: 'Diviser = partager en groupes égaux',
      mascotMsg: 'Imagine 12 bonbons pour 3 amis 🍬',
      body: '12 ÷ 3 = partager 12 objets en 3 groupes égaux. Chaque ami reçoit 4 objets.',
      Visual: () => (
        <div style={{ textAlign: 'center' }}>
          <GroupsDots total={12} groups={3} />
          <div style={{ marginTop: 8, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text)' }}>12 ÷ 3 = 4</div>
        </div>
      ),
    },
    {
      title: 'Exemple : 15 ÷ 5',
      mascotMsg: 'On répartit 15 en 5 groupes 📦',
      body: '15 ÷ 5 = 3. Vérifie : 5 × 3 = 15. Division et multiplication sont liées !',
      Visual: () => <StepBreakdown steps={['15 ÷ 5', '= 5 groupes de ?', '= 3 par groupe ✓']} />,
    },
    {
      title: 'À toi d\'essayer !',
      mascotMsg: 'Tap pour voir la réponse, puis on pratique ! 🎯',
      body: 'Partage 8 en 2 groupes égaux → 4 dans chaque groupe.',
      Visual: null,
      tryIt: { q: '8 ÷ 2 = ?', a: 4, hint: 'Partage 8 points en 2 groupes' },
    },
  ],
  subtraction: [
    {
      title: 'Soustraire = enlever une quantité',
      mascotMsg: 'Les ✕ rouges montrent ce qu\'on enlève ! 🎒',
      body: '10 − 3 : on commence avec 10, on retire 3. Il reste 7 points.',
      Visual: () => (
        <div style={{ textAlign: 'center' }}>
          <RemoveDots start={10} remove={3} />
          <div style={{ marginTop: 8, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text)' }}>10 − 3 = 7</div>
        </div>
      ),
    },
    {
      title: 'Exemple : 15 − 8',
      mascotMsg: 'On enlève 8 de 15, pas à pas 📏',
      body: 'Commence à 15, recule de 8. Tu arrives à 7. Compte à rebours mentalement !',
      Visual: () => <StepBreakdown steps={['Commence à 15', '− 8 pas en arrière', '= 7 ✓']} />,
    },
    {
      title: 'À toi d\'essayer !',
      mascotMsg: 'Tap pour voir la réponse ! Puis on commence 🌟',
      body: '12 points, on en enlève 5. Il reste 7. Bravo si tu l\'as trouvé !',
      Visual: null,
      tryIt: { q: '12 − 5 = ?', a: 7, hint: 'Enlève 5 des 12 points' },
    },
  ],
};

const FEEDBACK = {
  correct: ['Super ! ⭐', 'Excellent ! 🎉', 'Bravo ! 🏆', 'Parfait ! 🌟', 'Génial ! ✨'],
  wrong: ['Presque ! Essaie encore 💪', 'Pas tout à fait... 💡', 'Continue, tu progresses ! 🌱'],
};
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─── main component ───────────────────────────────────────────────────────────

export default function PracticePage() {
  // phases: 'select' | 'table-pick' | 'tutorial' | 'practice' | 'done'
  const [phase, setPhase] = useState('select');
  const [topic, setTopic] = useState(null);
  const [tableNum, setTableNum] = useState(null);
  const [tutStep, setTutStep] = useState(0);
  const [tryRevealed, setTryRevealed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [mascotStatus, setMascotStatus] = useState('idle');
  const [mascotMsg, setMascotMsg] = useState(null);

  const tutSteps = topic ? TUTORIALS[topic] : [];
  const currentTutStep = tutSteps[tutStep] ?? null;
  const currentQ = questions[qIdx] ?? null;

  function selectTopic(t) {
    playTapSound();
    setTopic(t);
    setTutStep(0);
    setTryRevealed(false);
    setMascotMsg(null);
    setMascotStatus('idle');
    setPhase(t === 'multiplication' ? 'table-pick' : 'tutorial');
    setTableNum(null);
  }

  function beginTutorial(tNum) {
    playTapSound();
    setTableNum(tNum);
    setPhase('tutorial');
  }

  function startPractice() {
    playTapSound();
    setQuestions(Array.from({ length: TOTAL }, () => makeQuestion(topic, tableNum)));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setMascotStatus('idle');
    setMascotMsg(null);
    setPhase('practice');
  }

  function handleAnswer(opt) {
    if (selected !== null) return;
    playTapSound();
    setSelected(opt);
    const correct = currentQ.correct ?? currentQ.answer;
    const ok = String(opt) === String(correct);
    if (ok) {
      setScore((s) => s + 1);
      setMascotStatus('correct');
      setMascotMsg(pick(FEEDBACK.correct));
    } else {
      setMascotStatus('wrong');
      setMascotMsg(pick(FEEDBACK.wrong));
    }
  }

  function handleNext() {
    playTapSound();
    setSelected(null);
    setMascotStatus('idle');
    setMascotMsg(null);
    if (qIdx + 1 >= TOTAL) {
      setPhase('done');
    } else {
      setQIdx((i) => i + 1);
    }
  }

  function restart() {
    playTapSound();
    setPhase('select');
    setTopic(null);
    setTableNum(null);
    setScore(0);
    setQIdx(0);
    setSelected(null);
    setMascotStatus('idle');
    setMascotMsg(null);
  }

  // ── TOPIC SELECTION ────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="page-stack page-stack--compact">
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Entraînement intelligent</span>
              <h1 className="practice-page-title">Que veux-tu pratiquer ?</h1>
            </div>
          </div>
          <div className="practice-topic-list">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="practice-topic-card"
                style={{ '--topic-color': t.color, '--topic-ring': t.ring }}
                onClick={() => selectTopic(t.id)}
              >
                <span className="practice-topic-card__symbol">{t.symbol}</span>
                <div className="practice-topic-card__body">
                  <strong>{t.label}</strong>
                  <span>{t.sub}</span>
                </div>
                <span className="practice-topic-card__arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link to="/" className="text-link" style={{ fontSize: '0.88rem' }}>← Retour à l'accueil</Link>
          </div>
        </section>
      </div>
    );
  }

  // ── TABLE PICKER ───────────────────────────────────────────────────────────
  if (phase === 'table-pick') {
    return (
      <div className="page-stack page-stack--compact">
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Multiplication</span>
              <h2 className="practice-page-title">Quelle table veux-tu travailler ?</h2>
            </div>
          </div>
          <div className="practice-table-grid">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                type="button"
                className="practice-table-btn"
                onClick={() => beginTutorial(n)}
              >
                × {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="practice-table-btn practice-table-btn--mix"
            style={{ marginTop: 12, width: '100%' }}
            onClick={() => beginTutorial(null)}
          >
            Toutes les tables (mixte)
          </button>
          <button
            type="button"
            className="secondary-action"
            style={{ marginTop: 14 }}
            onClick={() => { playTapSound(); setPhase('select'); }}
          >
            <span className="button-icon" aria-hidden="true">↩</span>
            Retour
          </button>
        </section>
      </div>
    );
  }

  // ── TUTORIAL ───────────────────────────────────────────────────────────────
  if (phase === 'tutorial' && currentTutStep) {
    const hasTryIt = !!currentTutStep.tryIt;
    const { Visual } = currentTutStep;
    return (
      <div className="page-stack page-stack--compact">
        <section className="panel panel--tight practice-tutorial">
          {/* Step dots */}
          <div className="ob-dots">
            {tutSteps.map((_, i) => (
              <span
                key={i}
                className={`ob-dot${i < tutStep ? ' is-done' : i === tutStep ? ' is-current' : ''}`}
              />
            ))}
          </div>

          {/* Mascot + speech */}
          <div className="practice-mascot-row">
            <div className="practice-mascot-avatar" aria-hidden="true">
              <Mascot status={mascotStatus} />
            </div>
            <div className="ob-bubble practice-bubble">{currentTutStep.mascotMsg}</div>
          </div>

          {/* Step title */}
          <h2 className="practice-step-title">{currentTutStep.title}</h2>

          {/* Visual */}
          {Visual && (
            <div className="practice-visual-box">
              <Visual />
            </div>
          )}

          {/* Try-it box */}
          {hasTryIt && (
            <div className="practice-tryit">
              <div className="practice-tryit__q">{currentTutStep.tryIt.q}</div>
              {!tryRevealed ? (
                <button
                  type="button"
                  className="primary-action"
                  style={{ margin: '0 auto', display: 'inline-flex' }}
                  onClick={() => { playTapSound(); setTryRevealed(true); }}
                >
                  <span className="button-icon" aria-hidden="true">👁</span>
                  Voir la réponse
                </button>
              ) : (
                <div className="practice-tryit__reveal">
                  <div className="practice-tryit__answer">{currentTutStep.tryIt.a}</div>
                  <div className="practice-tryit__hint">{currentTutStep.tryIt.hint}</div>
                </div>
              )}
            </div>
          )}

          {/* Body explanation */}
          <p className="practice-step-body">{currentTutStep.body}</p>

          {/* Navigation footer */}
          <div className="practice-tutorial-footer">
            {tutStep > 0 ? (
              <button
                type="button"
                className="secondary-action"
                onClick={() => { playTapSound(); setTutStep((s) => s - 1); setTryRevealed(false); }}
              >
                <span className="button-icon" aria-hidden="true">↩</span>
                Retour
              </button>
            ) : (
              <span />
            )}
            {hasTryIt ? (
              <button type="button" className="primary-action" onClick={startPractice}>
                <span className="button-icon" aria-hidden="true">🚀</span>
                C'est parti !
              </button>
            ) : (
              <button
                type="button"
                className="primary-action"
                onClick={() => { playTapSound(); setTutStep((s) => s + 1); }}
              >
                <span className="button-icon" aria-hidden="true">▶</span>
                Suivant
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  // ── PRACTICE SESSION ───────────────────────────────────────────────────────
  if (phase === 'practice' && currentQ) {
    const correct = currentQ.correct ?? currentQ.answer;
    const isAnswered = selected !== null;
    const isCorrect = isAnswered && String(selected) === String(correct);
    const opts = currentQ.options ?? currentQ.choices ?? [];

    return (
      <div className="page-stack page-stack--compact">
        <section className="panel panel--tight practice-session">
          {/* Progress */}
          <div className="practice-progress">
            <span className="practice-progress__label">Question {qIdx + 1} / {TOTAL}</span>
            <span className="practice-progress__score">⭐ {score} bonnes</span>
          </div>
          <div className="practice-progress__bar">
            <div
              className="practice-progress__fill"
              style={{ width: `${Math.round((qIdx / TOTAL) * 100)}%` }}
            />
          </div>

          {/* Mascot feedback */}
          <div className="practice-mascot-row" style={{ marginTop: 14 }}>
            <div className="practice-mascot-avatar" aria-hidden="true">
              <Mascot status={mascotStatus} />
            </div>
            {mascotMsg && <div className="ob-bubble practice-bubble">{mascotMsg}</div>}
          </div>

          {/* Question */}
          <div className="practice-question">
            {currentQ.question ?? currentQ.prompt}
          </div>

          {/* Choices */}
          <div className="practice-choices">
            {opts.map((opt, i) => {
              const sel = String(selected) === String(opt);
              const right = String(opt) === String(correct);
              let cls = 'practice-choice';
              if (isAnswered && right) cls += ' practice-choice--correct';
              else if (isAnswered && sel && !right) cls += ' practice-choice--wrong';
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={isAnswered}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && currentQ.explanation && (
            <div className={`practice-explanation${isCorrect ? ' practice-explanation--correct' : ' practice-explanation--wrong'}`}>
              {isCorrect ? '✅ ' : '💡 '}{currentQ.explanation}
            </div>
          )}

          {/* Next */}
          {isAnswered && (
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button type="button" className="primary-action" onClick={handleNext}>
                <span className="button-icon" aria-hidden="true">▶</span>
                {qIdx + 1 >= TOTAL ? 'Voir mes résultats' : 'Question suivante'}
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const percent = Math.round((score / TOTAL) * 100);
    const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : 1;
    const topicData = TOPICS.find((t) => t.id === topic);
    const msg =
      percent === 100 ? 'Parfait ! Tu maîtrises tout ! 🌟'
      : percent >= 80  ? 'Excellent travail ! Continue comme ça ! 🎉'
      : percent >= 60  ? 'Bien joué ! Encore un peu de pratique ! 💪'
                       : 'Continue, tu progresses à chaque fois ! 🌱';

    return (
      <div className="page-stack page-stack--compact">
        <section className="completion-screen">
          <div className="completion-screen__inner">
            <div className="completion-mascot-row">
              <Mascot status="completed" />
            </div>
            <div className="completion-stars">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`completion-star${n <= stars ? ' completion-star--lit' : ''}`}
                  style={{ animationDelay: `${(n - 1) * 200}ms` }}
                  aria-hidden="true"
                >
                  ⭐
                </span>
              ))}
            </div>
            <h1 className="completion-screen__msg">{msg}</h1>
            <p className="completion-screen__activity">
              {topicData?.label}{tableNum ? ` — Table du ${tableNum}` : ''}
            </p>
            <div className="completion-rewards">
              <div className="completion-reward">
                <span aria-hidden="true">🏆</span>
                <strong>{score}/{TOTAL}</strong>
                <small>Score</small>
              </div>
              <div className="completion-reward">
                <span aria-hidden="true">📊</span>
                <strong>{percent}%</strong>
                <small>Réussite</small>
              </div>
            </div>
            <div className="completion-actions">
              <button type="button" className="primary-action" onClick={() => { playTapSound(); startPractice(); }}>
                <span className="button-icon" aria-hidden="true">🔄</span>
                Rejouer
              </button>
              <button type="button" className="secondary-action" onClick={restart}>
                <span className="button-icon" aria-hidden="true">↩</span>
                Changer de sujet
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return null;
}
