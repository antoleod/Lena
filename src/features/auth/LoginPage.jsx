import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext.jsx';
import { signInGoogle, signInEmail, signUpEmail } from '../../services/firebase/authService.js';
import { getProfile } from '../../services/storage/profileStore.js';

// ── Emoji palette (4×5 grid) ──────────────────────────────────────────────────
const EMOJIS = [
  '🌟','⭐','🎈','🦋',
  '🐱','🐶','🌸','🍦',
  '🎮','🏆','🌈','🦄',
  '🍕','🎵','🐸','🦁',
  '🚀','🌙','🎀','🐙',
];

const PIN_KEY  = 'lena:emoji-pin';
const PIN_LEN  = 4;

function savePin(pin)  { localStorage.setItem(PIN_KEY, pin.join('')); }
function loadPin()     { return localStorage.getItem(PIN_KEY) || null; }
function clearPin()    { localStorage.removeItem(PIN_KEY); }

function hashPin(pin)  { return btoa(unescape(encodeURIComponent(pin.join('')))); }

const ERROR_MAP = {
  'auth/user-not-found':        'Aucun compte avec cet email.',
  'auth/wrong-password':        'Mot de passe incorrect.',
  'auth/email-already-in-use':  'Email déjà utilisé.',
  'auth/weak-password':         'Mot de passe trop court (6 car. min).',
  'auth/invalid-email':         'Adresse email invalide.',
  'auth/popup-closed-by-user':  'Connexion annulée.',
  'auth/network-request-failed':'Problème réseau. Vérifie ta connexion.',
  'auth/invalid-credential':    'Email ou mot de passe incorrect.',
};
const friendlyErr = code => ERROR_MAP[code] || 'Une erreur est survenue.';

// ── Emoji slot display ────────────────────────────────────────────────────────
function EmojiSlots({ pin, total = PIN_LEN, shake }) {
  return (
    <div className={`ep-slots${shake ? ' ep-slots--shake' : ''}`}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`ep-slot${i < pin.length ? ' ep-slot--filled' : ''}`}>
          {pin[i] || ''}
        </div>
      ))}
    </div>
  );
}

// ── Emoji PIN pad ─────────────────────────────────────────────────────────────
function EmojiPad({ onComplete, onBack }) {
  const [pin, setPin] = useState([]);
  const [shake, setShake] = useState(false);

  function tap(emoji) {
    if (pin.length >= PIN_LEN) return;
    const next = [...pin, emoji];
    setPin(next);
    if (next.length === PIN_LEN) {
      setTimeout(() => onComplete(next), 200);
    }
  }

  function del() { setPin(p => p.slice(0, -1)); }

  return (
    <div className="ep-pad">
      <EmojiSlots pin={pin} shake={shake} />

      <div className="ep-grid">
        {EMOJIS.map(e => (
          <button
            key={e}
            className={`ep-emoji${pin.includes(e) ? ' ep-emoji--used' : ''}`}
            onClick={() => tap(e)}
            type="button"
          >
            {e}
          </button>
        ))}
      </div>

      <div className="ep-controls">
        {onBack && (
          <button className="ep-ctrl ep-ctrl--back" onClick={onBack} type="button">
            ← Retour
          </button>
        )}
        <button
          className="ep-ctrl ep-ctrl--del"
          onClick={del}
          disabled={pin.length === 0}
          type="button"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

// ── Floating stars background ─────────────────────────────────────────────────
function Stars() {
  return (
    <div className="login-stars" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="login-star"
          style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            '--delay': `${(Math.random() * 3).toFixed(1)}s`,
            '--size':  `${6 + Math.random() * 10}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const profile   = getProfile();

  // step: 'detecting' | 'pin' | 'setup-pin' | 'confirm-pin' | 'parent-auth' | 'parent-email'
  const [step, setStep]         = useState('detecting');
  const [pinDraft, setPinDraft] = useState([]);   // used during setup confirm
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState('');
  const [shake, setShake]       = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', password: '', name: '', mode: 'login' });

  // ── Determine initial step based on auth state ────────────────────────────
  useEffect(() => {
    if (user === null) return;           // still loading
    if (user === false) {
      setStep('parent-auth');
    } else {
      const saved = loadPin();
      setStep(saved ? 'pin' : 'setup-pin');
    }
  }, [user]);

  // ── PIN entry (returning child) ───────────────────────────────────────────
  function handlePinEntry(entered) {
    const saved = loadPin();
    if (entered.join('') === saved) {
      navigate('/', { replace: true });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError('Ce n\'est pas le bon code 🙈 Réessaie !');
    }
  }

  // ── PIN setup (first time) ────────────────────────────────────────────────
  function handlePinSetup(first) {
    setPinDraft(first);
    setStep('confirm-pin');
  }

  function handlePinConfirm(second) {
    if (second.join('') === pinDraft.join('')) {
      savePin(second);
      navigate('/', { replace: true });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError('Les deux codes ne correspondent pas. Réessaie !');
      setStep('setup-pin');
    }
  }

  // ── Parent auth ───────────────────────────────────────────────────────────
  async function handleGoogle() {
    setError(''); setLoading('google');
    try {
      await signInGoogle();
      // AuthContext will update user → useEffect above fires
    } catch (e) { setError(friendlyErr(e.code)); }
    setLoading('');
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError(''); setLoading('email');
    const { email, password, name, mode } = emailForm;
    try {
      if (mode === 'signup') {
        await signUpEmail(email, password, name);
      } else {
        await signInEmail(email, password);
      }
    } catch (err) { setError(friendlyErr(err.code)); }
    setLoading('');
  }

  function handleGuest() {
    navigate('/', { replace: true });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <Stars />
      <div className="login-bg" aria-hidden="true">
        <span className="login-bg__blob login-bg__blob--1" />
        <span className="login-bg__blob login-bg__blob--2" />
        <span className="login-bg__blob login-bg__blob--3" />
      </div>

      {/* ── Detecting / Loading ── */}
      {step === 'detecting' && (
        <div className="login-card login-card--centered">
          <span className="login-spinner login-spinner--lg" />
        </div>
      )}

      {/* ── Child PIN entry ── */}
      {step === 'pin' && (
        <div className="login-card">
          <div className="login-logo">
            <div className="login-avatar-bubble">
              {profile.avatarId ? '🦄' : '🚀'}
            </div>
            <h1 className="login-hello">
              Salut {profile.name || 'toi'} ! 👋
            </h1>
            <p className="login-instruction">Tape tes 4 emojis secrets</p>
          </div>

          {error && <p className="login-error">{error}</p>}

          <EmojiPad
            onComplete={handlePinEntry}
            shake={shake}
          />

          <button
            className="login-guest-btn"
            onClick={() => { clearPin(); setStep('parent-auth'); }}
          >
            Mon parent va m'aider 🔑
          </button>
        </div>
      )}

      {/* ── Create emoji PIN ── */}
      {step === 'setup-pin' && (
        <div className="login-card">
          <div className="login-logo">
            <span className="login-logo__icon">🔐</span>
            <h1 className="login-hello">Crée ton code secret !</h1>
            <p className="login-instruction">
              Choisis 4 emojis que tu peux retenir facilement
            </p>
          </div>

          {error && <p className="login-error">{error}</p>}

          <EmojiPad onComplete={handlePinSetup} />
        </div>
      )}

      {/* ── Confirm PIN ── */}
      {step === 'confirm-pin' && (
        <div className="login-card">
          <div className="login-logo">
            <span className="login-logo__icon">✅</span>
            <h1 className="login-hello">Confirme ton code !</h1>
            <p className="login-instruction">Retape tes 4 emojis dans le même ordre</p>
          </div>

          {error && <p className="login-error">{error}</p>}

          <EmojiPad
            onComplete={handlePinConfirm}
            onBack={() => { setStep('setup-pin'); setError(''); }}
          />
        </div>
      )}

      {/* ── Parent auth ── */}
      {(step === 'parent-auth' || step === 'parent-email') && (
        <div className="login-card">
          <div className="login-logo">
            <span className="login-logo__icon">🚀</span>
            <h1 className="login-logo__name">LénaLand</h1>
            <p className="login-logo__sub">Explorer · Apprendre · Rêver · Grandir</p>
          </div>

          <div className="login-parent-label">
            <span>👨‍👩‍👧 Espace parents — connexion une seule fois</span>
          </div>

          {/* Google — primary CTA */}
          <button
            className="login-google-btn"
            onClick={handleGoogle}
            disabled={!!loading}
          >
            {loading === 'google' ? (
              <span className="login-spinner" />
            ) : (
              <svg className="login-google-icon" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6C29.9 37.8 27.1 38.8 24 38.8c-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.6 14.6 48 24 48z"/>
                <path fill="#FBBC05" d="M10.5 28.9c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-6.2H2.4C.9 16.1 0 19.9 0 24s.9 7.9 2.4 11.1l8.1-6.2z"/>
                <path fill="#EA4335" d="M24 9.2c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.1 30.5 0 24 0 14.6 0 6.4 5.4 2.4 13.1l8.1 6.2C12.4 13.4 17.7 9.2 24 9.2z"/>
              </svg>
            )}
            {loading === 'google' ? 'Connexion…' : 'Continuer avec Google'}
          </button>

          {/* Email toggle */}
          {step === 'parent-auth' ? (
            <button
              className="login-email-toggle"
              onClick={() => setStep('parent-email')}
            >
              Utiliser un email →
            </button>
          ) : (
            <>
              <div className="login-divider"><span>email</span></div>

              <div className="login-toggle" style={{ marginBottom: 0 }}>
                <button
                  className={`login-toggle__btn${emailForm.mode === 'login' ? ' login-toggle__btn--active' : ''}`}
                  onClick={() => setEmailForm(f => ({ ...f, mode: 'login' }))}
                >
                  Se connecter
                </button>
                <button
                  className={`login-toggle__btn${emailForm.mode === 'signup' ? ' login-toggle__btn--active' : ''}`}
                  onClick={() => setEmailForm(f => ({ ...f, mode: 'signup' }))}
                >
                  Créer un compte
                </button>
              </div>

              <form className="login-form" onSubmit={handleEmailAuth}>
                {emailForm.mode === 'signup' && (
                  <input
                    className="login-field__input"
                    type="text"
                    placeholder="Prénom de l'enfant"
                    value={emailForm.name}
                    onChange={e => setEmailForm(f => ({ ...f, name: e.target.value }))}
                    autoComplete="name"
                  />
                )}
                <input
                  className="login-field__input"
                  type="email"
                  placeholder="Email du parent"
                  value={emailForm.email}
                  onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                  required autoComplete="email"
                />
                <input
                  className="login-field__input"
                  type="password"
                  placeholder={emailForm.mode === 'signup' ? 'Mot de passe (6 car. min)' : 'Mot de passe'}
                  value={emailForm.password}
                  onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
                  required autoComplete={emailForm.mode === 'signup' ? 'new-password' : 'current-password'}
                />
                {error && <p className="login-error">{error}</p>}
                <button className="login-submit-btn" type="submit" disabled={!!loading}>
                  {loading === 'email' ? <span className="login-spinner" /> : null}
                  {loading === 'email' ? 'Chargement…' : emailForm.mode === 'signup' ? '🎉 Créer' : '→ Entrer'}
                </button>
              </form>

              <button
                className="login-email-toggle"
                onClick={() => setStep('parent-auth')}
              >
                ← Retour
              </button>
            </>
          )}

          {error && step === 'parent-auth' && <p className="login-error">{error}</p>}

          <button className="login-guest-btn" onClick={handleGuest}>
            Jouer sans compte →
          </button>
        </div>
      )}
    </div>
  );
}
