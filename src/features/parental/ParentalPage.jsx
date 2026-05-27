import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getParentalState,
  isPinSet,
  verifyPin,
  setPin,
  removePin,
  toggleWorldBlock,
  setDailyLimit
} from '../../services/storage/parentalStore.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { worldMap, getWorldProgress } from '../../shared/gameplay/worldMap.js';
import { WORLD_STYLES } from '../../shared/gameplay/worldThemes.js';

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

function ProgressTab() {
  const progress = getProgressSnapshot();
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
          <span>Activités complétées</span>
        </div>
        <div className="parental-stat">
          <strong>{totalAttempted}</strong>
          <span>Activités essayées</span>
        </div>
        <div className="parental-stat">
          <strong>{mastered}/{totalQ}</strong>
          <span>Questions maîtrisées</span>
        </div>
        <div className="parental-stat">
          <strong>{progress.meta?.streakCurrent || 0}</strong>
          <span>Série actuelle</span>
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
          <h3 className="parental-section-title">Activité récente</h3>
          <div className="parental-activity-list">
            {recentActivities.map(([id, v]) => (
              <div key={id} className="parental-activity-row">
                <span className="parental-activity-id">{id}</span>
                <div className="parental-activity-meta">
                  <span className={`parental-pill ${v.completed ? 'parental-pill--green' : 'parental-pill--yellow'}`}>
                    {v.completed ? '✓ Terminé' : `${v.attempts} essai(s)`}
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

function ControlTab() {
  const [state, setState] = useState(() => getParentalState());
  const [limit, setLimitLocal] = useState(() => String(getParentalState().dailyLimitMinutes || ''));

  useEffect(() => {
    function sync() { setState(getParentalState()); }
    window.addEventListener('lena-parental-change', sync);
    return () => window.removeEventListener('lena-parental-change', sync);
  }, []);

  function handleToggle(worldId) {
    toggleWorldBlock(worldId);
    setState(getParentalState());
  }

  function handleLimitSave() {
    const mins = parseInt(limit, 10);
    setDailyLimit(isNaN(mins) || mins <= 0 ? null : mins);
  }

  return (
    <div className="parental-tab-content">
      <h3 className="parental-section-title">Bloquer des mondes</h3>
      <p className="parental-hint">Les mondes bloqués affichent un cadenas — l'enfant ne peut pas y accéder.</p>
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
                aria-label={blocked ? 'Débloquer' : 'Bloquer'}
              >
                <span className="parental-toggle-thumb" />
              </button>
            </div>
          );
        })}
      </div>

      <h3 className="parental-section-title" style={{ marginTop: 24 }}>Limite quotidienne</h3>
      <p className="parental-hint">Temps de jeu autorisé par jour (en minutes). Laissez vide pour aucune limite.</p>
      <div className="parental-limit-row">
        <input
          className="parental-limit-input"
          type="number"
          min="5"
          max="480"
          placeholder="ex: 30"
          value={limit}
          onChange={(e) => setLimitLocal(e.target.value)}
        />
        <span className="parental-limit-unit">min/jour</span>
        <button className="primary-action parental-limit-save" type="button" onClick={handleLimitSave}>
          Enregistrer
        </button>
      </div>
      {state.dailyLimitMinutes && (
        <p className="parental-hint parental-hint--active">
          ✓ Limite active : {state.dailyLimitMinutes} min/jour
        </p>
      )}
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
      setError('Les codes ne correspondent pas. Réessayez.');
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
        subtitle="Choisissez un code à 4 chiffres"
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
        subtitle="Répétez le code pour confirmer"
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
        <p>Code PIN enregistré avec succès.</p>
        <button className="primary-action" type="button" onClick={() => setPhase('menu')}>OK</button>
      </div>
    );
  }

  if (phase === 'removed') {
    return (
      <div className="parental-tab-content parental-done">
        <div className="parental-done__icon">🔓</div>
        <p>Code PIN supprimé.</p>
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
          : "Aucun code PIN n'est défini. Créez-en un pour protéger ces paramètres."}
      </p>
      <div className="parental-security-actions">
        <button className="primary-action" type="button" onClick={() => { setError(''); setPhase('new'); }}>
          {pinSet ? 'Modifier le PIN' : 'Créer un PIN'}
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
  { id: 'progress', label: 'Progression' },
  { id: 'control', label: 'Contrôle' },
  { id: 'security', label: 'Sécurité' },
];

export default function ParentalPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => !isPinSet());
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('progress');

  function handlePinEntry(pin) {
    if (verifyPin(pin)) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Code incorrect. Réessayez.');
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
          <h2>Contrôle parental</h2>
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

      {activeTab === 'progress' && <ProgressTab />}
      {activeTab === 'control' && <ControlTab />}
      {activeTab === 'security' && <SecurityTab />}
    </div>
  );
}
