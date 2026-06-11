import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getParentalState,
  isPinSet,
  verifyPin,
  setPin,
  removePin,
  toggleWorldBlock,
  setDailyLimit,
  getLearningControls,
  setLearningControl
} from '../../services/storage/parentalStore.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { gradeOptions, defaultCountrySystem } from '../../services/learning/gradeModel.js';
import { getProgressSnapshot, getStudyStats } from '../../services/storage/progressStore.js';
import { worldMap, getWorldProgress } from '../../shared/gameplay/worldMap.js';
import { WORLD_STYLES } from '../../shared/gameplay/worldThemes.js';
import { getCategories } from '../../content/exams/registry.js';
import { loadAllProgress, starsFor } from '../exam/library/examLibraryProgress.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

// ── Locale-aware day labels ──────────────────────────────────────────────────

const DAY_LABELS = {
  fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  nl: ['Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat', 'Zon'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  es: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
};

/** Returns ISO date string for `daysAgo` days before today. */
function dateKeyOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** JS Date.getDay() returns 0=Sun..6=Sat; we want 0=Mon..6=Sun */
function isoWeekday(dateStr) {
  const day = new Date(dateStr).getDay(); // 0=Sun..6=Sat
  return (day + 6) % 7; // 0=Mon..6=Sun
}

// ── Dashboard tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const { locale } = useLocale();
  const labels = DAY_LABELS[locale] || DAY_LABELS.fr;

  // Build last-7-days data from meta.dailyStudy
  const meta = getProgressSnapshot().meta;
  const dailyStudy = meta.dailyStudy || {};

  // Generate last 7 days (oldest first)
  const days = Array.from({ length: 7 }, (_, i) => {
    const key = dateKeyOffset(6 - i);          // 6 days ago ... today
    const seconds = dailyStudy[key] || 0;
    const minutes = Math.round(seconds / 60);
    const weekday = isoWeekday(key);
    return { key, minutes, label: labels[weekday] };
  });

  const maxMinutes = Math.max(...days.map((d) => d.minutes), 1);

  // ── Category performance ──────────────────────────────────────────────────
  const categories = getCategories();
  const allProgress = loadAllProgress();

  const catStats = categories.map((cat) => {
    let attempted = 0;
    let totalStars = 0;
    let totalLevels = 0;

    cat.exams.forEach((exam) => {
      exam.levelKeys.forEach((lk) => {
        const result = allProgress[`${exam.id}:${lk}`];
        if (result) {
          attempted++;
          const passPercent = exam.levelPassPercent?.[lk] ?? 60;
          totalStars += starsFor(result.bestScore, result.total, passPercent);
          totalLevels++;
        }
      });
    });

    const avgStars = totalLevels > 0 ? totalStars / totalLevels : 0;
    return { id: cat.id, label: cat.label, emoji: cat.emoji, attempted, avgStars };
  }).filter((c) => c.attempted > 0);

  return (
    <div className="parental-tab-content">
      {/* ── Weekly study chart ─────────────────────────────────────────── */}
      <h3 className="parental-section-title">Temps d&apos;etude cette semaine</h3>
      <div style={{
        background: 'rgba(255,255,255,.06)', borderRadius: 16,
        padding: '16px 12px 8px', display: 'flex',
        alignItems: 'flex-end', gap: 8, height: 160,
        marginBottom: 8,
      }}>
        {days.map((day) => {
          const barPct = (day.minutes / maxMinutes) * 100;
          const isToday = day.key === dateKeyOffset(0);
          return (
            <div
              key={day.key}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}
            >
              {day.minutes > 0 && (
                <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '.7rem', fontWeight: 600 }}>
                  {day.minutes}m
                </span>
              )}
              <div style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                height: `${Math.max(barPct, day.minutes > 0 ? 4 : 0)}%`,
                background: isToday
                  ? 'linear-gradient(180deg,#f1c40f,#f39c12)'
                  : 'linear-gradient(180deg,#3498db,#2980b9)',
                minHeight: day.minutes > 0 ? 4 : 0,
                transition: 'height .3s',
              }} />
              <span style={{
                color: isToday ? '#f1c40f' : 'rgba(255,255,255,.6)',
                fontSize: '.75rem', fontWeight: isToday ? 700 : 400,
              }}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem', margin: '0 0 20px', textAlign: 'center' }}>
        Aujourd&apos;hui en jaune
      </p>

      {/* ── Category performance ──────────────────────────────────────── */}
      <h3 className="parental-section-title">Performance par categorie</h3>
      {catStats.length === 0 ? (
        <p className="parental-hint">Aucun examen tenté pour l&apos;instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {catStats.map((cat) => {
            const fullStars = Math.floor(cat.avgStars);
            const halfStar = cat.avgStars - fullStars >= 0.4;
            return (
              <div
                key={cat.id}
                style={{
                  background: 'rgba(255,255,255,.07)', borderRadius: 14,
                  padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{cat.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.label}
                  </p>
                  <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,.55)', fontSize: '.8rem' }}>
                    {cat.attempted} niveau{cat.attempted !== 1 ? 'x' : ''} tenté{cat.attempted !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{
                      fontSize: '1.1rem',
                      opacity: i <= fullStars ? 1 : (i === fullStars + 1 && halfStar ? 0.6 : 0.2),
                    }}>
                      &#11088;
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reset progress ────────────────────────────────────────────── */}
      <h3 className="parental-section-title" style={{ marginTop: 28 }}>Zone de danger</h3>
      <p className="parental-hint">
        Supprimer tous les resultats d&apos;examens efface definitivement les scores. Les activites et la progression du cahier ne sont pas affectees.
      </p>
      <button
        type="button"
        style={{
          padding: '12px 24px', borderRadius: 14,
          background: 'rgba(231,76,60,.2)',
          border: '2px solid rgba(231,76,60,.5)',
          color: '#e74c3c', fontWeight: 700, cursor: 'pointer',
          fontSize: '.95rem',
        }}
        onClick={() => {
          if (window.confirm('Supprimer TOUS les resultats d\'examens ? Cette action est irreversible.')) {
            try { localStorage.removeItem('lena:exam-library:v1'); } catch (_) {}
            window.dispatchEvent(new Event('lena-progress-change'));
            alert('Resultats d\'examens effaces.');
          }
        }}
      >
        Reinitialiser les resultats d&apos;examens
      </button>
    </div>
  );
}

// ── PIN keypad ──────────────────────────────────────────────────────────────

function PinKeypad({ title, subtitle, onConfirm, error, onBack }) {
  const [digits, setDigits] = useState([]);

  function press(d) {
    if (digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      setTimeout(() => {
        onConfirm(next.join(''));
        setDigits([]);
      }, 120);
    }
  }

  function erase() {
    setDigits((prev) => prev.slice(0, -1));
  }

  const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'];

  return (
    <div className="pin-screen">
      <div className="pin-screen__header">
        {onBack && (
          <button className="pin-screen__back" type="button" onClick={onBack}>←</button>
        )}
        <h2 className="pin-screen__title">{title}</h2>
        {subtitle && <p className="pin-screen__sub">{subtitle}</p>}
      </div>

      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pin-dot ${i < digits.length ? 'pin-dot--filled' : ''}`} />
        ))}
      </div>

      {error && <p className="pin-error">{error}</p>}

      <div className="pin-keypad">
        {KEYS.map((k, i) => {
          if (k === null) return <div key={i} className="pin-key pin-key--empty" />;
          if (k === 'del') {
            return (
              <button key={i} className="pin-key pin-key--del" type="button" onClick={erase}>⌫</button>
            );
          }
          return (
            <button key={i} className="pin-key" type="button" onClick={() => press(k)}>
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Progress tab ────────────────────────────────────────────────────────────

function formatStudyTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

function ProgressTab() {
  const progress = getProgressSnapshot();
  const studyStats = getStudyStats();
  const worlds = worldMap;

  const recentActivities = Object.entries(progress.activities || {})
    .filter(([, v]) => v.updatedAt)
    .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
    .slice(0, 8);

  const totalCompleted = Object.values(progress.activities || {}).filter((v) => v.completed).length;
  const totalAttempted = Object.values(progress.activities || {}).filter((v) => v.attempts > 0).length;
  const mastered = Object.values(progress.questions || {}).filter((q) => q.status === 'mastered').length;
  const totalQ = Object.values(progress.questions || {}).length;

  return (
    <div className="parental-tab-content">
      <div className="parental-stat-row">
        <div className="parental-stat">
          <strong>{totalCompleted}</strong>
          <span>Activites completees</span>
        </div>
        <div className="parental-stat">
          <strong>{totalAttempted}</strong>
          <span>Activites essayees</span>
        </div>
        <div className="parental-stat">
          <strong>{mastered}/{totalQ}</strong>
          <span>Questions maitrisees</span>
        </div>
        <div className="parental-stat">
          <strong>{progress.meta?.streakCurrent || 0}</strong>
          <span>Serie actuelle</span>
        </div>
      </div>

      <h3 className="parental-section-title">Temps d&apos;etude</h3>
      <div className="parental-stat-row">
        <div className="parental-stat">
          <strong>{formatStudyTime(studyStats.totalStudySeconds)}</strong>
          <span>Temps total</span>
        </div>
        <div className="parental-stat">
          <strong>
            {studyStats.totalCorrect + studyStats.totalWrong > 0
              ? Math.round((studyStats.totalCorrect / (studyStats.totalCorrect + studyStats.totalWrong)) * 100)
              : 0}%
          </strong>
          <span>Taux de reussite</span>
        </div>
        <div className="parental-stat">
          <strong>{studyStats.streakCurrent}</strong>
          <span>Serie actuelle</span>
        </div>
        <div className="parental-stat">
          <strong>{studyStats.streakBest}</strong>
          <span>Meilleure serie</span>
        </div>
      </div>

      <h3 className="parental-section-title">Progression par monde</h3>
      <div className="parental-world-list">
        {worlds.map((world, i) => {
          const wp = getWorldProgress(world, progress);
          const style = WORLD_STYLES[(world.order - 1) % WORLD_STYLES.length];
          const pct = wp.total ? Math.round((wp.completed / wp.total) * 100) : 0;
          return (
            <div key={world.id} className="parental-world-row">
              <span className="parental-world-emoji">{style.emoji}</span>
              <div className="parental-world-info">
                <span className="parental-world-name">{world.title}</span>
                <div className="parental-world-bar">
                  <div className="parental-world-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="parental-world-pct">{pct}%</span>
            </div>
          );
        })}
      </div>

      {recentActivities.length > 0 && (
        <>
          <h3 className="parental-section-title">Activite recente</h3>
          <div className="parental-activity-list">
            {recentActivities.map(([id, v]) => (
              <div key={id} className="parental-activity-row">
                <span className="parental-activity-id">{id}</span>
                <div className="parental-activity-meta">
                  <span className={`parental-pill ${v.completed ? 'parental-pill--green' : 'parental-pill--yellow'}`}>
                    {v.completed ? 'Termine' : `${v.attempts} essai(s)`}
                  </span>
                  <span className="parental-activity-score">Note: {v.lastScore ?? '—'}/10</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Control tab ─────────────────────────────────────────────────────────────

const LIMIT_STEP = 5;

const TRISTATE_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'on', label: 'Autorisé' },
  { value: 'off', label: 'Bloqué' },
];

/** Map a stored learning-control value (null/true/false) to a select value. */
function triValue(v) {
  if (v === true) return 'on';
  if (v === false) return 'off';
  return 'auto';
}
/** Map a select value back to the stored value. */
function triStore(v) {
  if (v === 'on') return true;
  if (v === 'off') return false;
  return null;
}

function ControlTab() {
  const [state, setState] = useState(() => getParentalState());
  const [controls, setControls] = useState(() => getLearningControls());
  const countrySystem = getProfile().countrySystem || defaultCountrySystem(getProfile().language);
  const grades = gradeOptions(countrySystem);

  useEffect(() => {
    function sync() { setState(getParentalState()); setControls(getLearningControls()); }
    window.addEventListener('lena-parental-change', sync);
    return () => window.removeEventListener('lena-parental-change', sync);
  }, []);

  function handleToggle(worldId) {
    toggleWorldBlock(worldId);
    setState(getParentalState());
  }

  function updateControl(key, value) {
    setLearningControl(key, value);
    setControls(getLearningControls());
  }

  const currentLimit = state.dailyLimitMinutes || 0; // 0 means unlimited

  function adjustLimit(delta) {
    const next = Math.max(0, currentLimit + delta);
    setDailyLimit(next === 0 ? null : next);
    setState(getParentalState());
  }

  const selectStyle = {
    background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.3)',
    borderRadius: 10, color: '#fff', fontWeight: 600, padding: '6px 10px', cursor: 'pointer',
  };

  return (
    <div className="parental-tab-content">
      <h3 className="parental-section-title">Apprentissage</h3>
      <p className="parental-hint">
        « Auto » laisse l&apos;app choisir selon l&apos;âge et le niveau. Forcez « Autorisé » ou « Bloqué » pour passer outre.
      </p>
      <div className="parental-toggle-list" data-testid="parental-learning-controls">
        {[
          { key: 'allowMultiplication', label: '✖️ Multiplication' },
          { key: 'allowDivision', label: '➗ Division' },
          { key: 'allowAdvanced', label: '🎯 Questions avancées' },
        ].map((row) => (
          <div key={row.key} className="parental-toggle-row">
            <span className="parental-toggle-name">{row.label}</span>
            <select
              value={triValue(controls[row.key])}
              onChange={(e) => updateControl(row.key, triStore(e.target.value))}
              style={selectStyle}
              data-testid={`parental-control-${row.key}`}
            >
              {TRISTATE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}

        <div className="parental-toggle-row">
          <span className="parental-toggle-name">⏱️ Quiz chronométrés</span>
          <button
            type="button"
            className={`parental-toggle-btn ${controls.allowTimedQuizzes ? 'parental-toggle-btn--on' : ''}`}
            onClick={() => updateControl('allowTimedQuizzes', !controls.allowTimedQuizzes)}
            aria-label={controls.allowTimedQuizzes ? 'Désactiver' : 'Activer'}
          >
            <span className="parental-toggle-thumb" />
          </button>
        </div>

        <div className="parental-toggle-row">
          <span className="parental-toggle-name">📈 Difficulté max</span>
          <select
            value={controls.maxDifficultyGrade || ''}
            onChange={(e) => updateControl('maxDifficultyGrade', e.target.value || null)}
            style={selectStyle}
            data-testid="parental-control-maxDifficultyGrade"
          >
            <option value="">Aucune limite</option>
            {grades.map((g) => (
              <option key={g.key} value={g.key}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="parental-section-title" style={{ marginTop: 24 }}>Bloquer des mondes</h3>
      <p className="parental-hint">Les mondes bloques affichent un cadenas — l&apos;enfant ne peut pas y acceder.</p>
      <div className="parental-toggle-list">
        {worldMap.map((world, i) => {
          const style = WORLD_STYLES[(world.order - 1) % WORLD_STYLES.length];
          const blocked = state.blockedWorldIds.includes(world.id);
          return (
            <div key={world.id} className="parental-toggle-row">
              <span className="parental-toggle-emoji">{style.emoji}</span>
              <span className="parental-toggle-name">{world.title}</span>
              <button
                type="button"
                className={`parental-toggle-btn ${blocked ? 'parental-toggle-btn--on' : ''}`}
                onClick={() => handleToggle(world.id)}
                aria-label={blocked ? 'Debloquer' : 'Bloquer'}
              >
                <span className="parental-toggle-thumb" />
              </button>
            </div>
          );
        })}
      </div>

      <h3 className="parental-section-title" style={{ marginTop: 24 }}>Limite quotidienne</h3>
      <p className="parental-hint">Temps de jeu autorise par jour. 0 = aucune limite.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => adjustLimit(-LIMIT_STEP)}
          disabled={currentLimit === 0}
          style={{
            width: 44, height: 44, borderRadius: 12, fontSize: '1.4rem', fontWeight: 700,
            background: currentLimit === 0 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.2)',
            border: '2px solid rgba(255,255,255,.35)', color: '#fff',
            cursor: currentLimit === 0 ? 'default' : 'pointer',
          }}
        >
          −
        </button>

        <div style={{
          flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.1)',
          borderRadius: 14, padding: '10px 0',
        }}>
          {currentLimit === 0 ? (
            <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '1.1rem' }}>
              Illimitee
            </span>
          ) : (
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>
              {currentLimit} min / jour
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => adjustLimit(+LIMIT_STEP)}
          style={{
            width: 44, height: 44, borderRadius: 12, fontSize: '1.4rem', fontWeight: 700,
            background: 'rgba(255,255,255,.2)',
            border: '2px solid rgba(255,255,255,.35)', color: '#fff', cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', marginTop: 6, textAlign: 'center' }}>
        Ajuste par tranche de {LIMIT_STEP} minutes
      </p>
    </div>
  );
}

// ── Security tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [phase, setPhase] = useState('menu');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');
  const pinSet = isPinSet();

  function handleChangeFirst(pin) {
    setNewPin(pin);
    setPhase('confirm');
    setError('');
  }

  function handleChangeConfirm(pin) {
    if (pin !== newPin) {
      setError('Les codes ne correspondent pas. Reessayez.');
      setPhase('new');
      return;
    }
    setPin(pin);
    setPhase('done');
  }

  function handleRemoveVerify(pin) {
    if (!verifyPin(pin)) {
      setError('Code incorrect.');
      return;
    }
    removePin();
    setPhase('removed');
  }

  if (phase === 'new') {
    return (
      <PinKeypad
        title="Nouveau code PIN"
        subtitle="Choisissez un code a 4 chiffres"
        onConfirm={handleChangeFirst}
        error={error}
        onBack={() => setPhase('menu')}
      />
    );
  }

  if (phase === 'confirm') {
    return (
      <PinKeypad
        title="Confirmer le code PIN"
        subtitle="Repetez le code pour confirmer"
        onConfirm={handleChangeConfirm}
        error={error}
        onBack={() => setPhase('new')}
      />
    );
  }

  if (phase === 'remove') {
    return (
      <PinKeypad
        title="Supprimer le code PIN"
        subtitle="Entrez votre code actuel pour confirmer"
        onConfirm={handleRemoveVerify}
        error={error}
        onBack={() => setPhase('menu')}
      />
    );
  }

  if (phase === 'done') {
    return (
      <div className="parental-tab-content parental-done">
        <div className="parental-done__icon">✓</div>
        <p>Code PIN enregistre avec succes.</p>
        <button className="primary-action" type="button" onClick={() => setPhase('menu')}>OK</button>
      </div>
    );
  }

  if (phase === 'removed') {
    return (
      <div className="parental-tab-content parental-done">
        <div className="parental-done__icon">🔓</div>
        <p>Code PIN supprime.</p>
        <button className="primary-action" type="button" onClick={() => setPhase('menu')}>OK</button>
      </div>
    );
  }

  return (
    <div className="parental-tab-content">
      <h3 className="parental-section-title">Code PIN parental</h3>
      <p className="parental-hint">
        {pinSet
          ? 'Un code PIN est actif. Modifiez-le ou supprimez-le ci-dessous.'
          : "Aucun code PIN n'est defini. Creez-en un pour proteger ces parametres."}
      </p>
      <div className="parental-security-actions">
        <button className="primary-action" type="button" onClick={() => { setError(''); setPhase('new'); }}>
          {pinSet ? 'Modifier le PIN' : 'Creer un PIN'}
        </button>
        {pinSet && (
          <button className="secondary-action" type="button" onClick={() => { setError(''); setPhase('remove'); }}>
            Supprimer le PIN
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'progress', label: 'Progression' },
  { id: 'control', label: 'Controle' },
  { id: 'security', label: 'Securite' },
];

export default function ParentalPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => !isPinSet());
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  function handlePinEntry(pin) {
    if (verifyPin(pin)) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Code incorrect. Reessayez.');
    }
  }

  if (!unlocked) {
    return (
      <div className="parental-page">
        <PinKeypad
          title="Espace parents"
          subtitle="Entrez le code PIN parental"
          onConfirm={handlePinEntry}
          error={pinError}
          onBack={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <div className="parental-page" data-testid="parental-page">
      <div className="parental-header">
        <button className="parental-back" type="button" onClick={() => navigate(-1)}>←</button>
        <div>
          <span className="eyebrow">Espace parents</span>
          <h2>Controle parental</h2>
        </div>
        <span className="parental-lock-icon">🔒</span>
      </div>

      <div className="parental-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`parental-tab ${activeTab === tab.id ? 'parental-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'progress' && <ProgressTab />}
      {activeTab === 'control' && <ControlTab />}
      {activeTab === 'security' && <SecurityTab />}
    </div>
  );
}
