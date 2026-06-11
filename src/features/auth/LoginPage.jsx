import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext.jsx';
import {
  signInGoogle, signInEmail, signUpEmail,
  signInAnon, linkAnonWithGoogle,
} from '../../services/firebase/authService.js';
import { getProfile, saveProfile, isProfileComplete } from '../../services/storage/profileStore.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';

// ── Emoji palette (4×5 grid) ──────────────────────────────────────────────────
const EMOJIS = [
  '🌟','⭐','🎈','🦋',
  '🐱','🐶','🌸','🍦',
  '🎮','🏆','🌈','🦄',
  '🍕','🎵','🐸','🦁',
  '🚀','🌙','🎀','🐙',
];

const PIN_KEY = 'lena:emoji-pin';
const PIN_LEN = 4;

function hashPin(pin)  { return btoa(unescape(encodeURIComponent(pin.join('')))); }
function savePin(pin)  { localStorage.setItem(PIN_KEY, hashPin(pin)); }
function loadPin()     { return localStorage.getItem(PIN_KEY) || null; }
function clearPin()    { localStorage.removeItem(PIN_KEY); }

const ERROR_MAP = {
  'auth/user-not-found':        'Aucun compte avec cet email.',
  'auth/wrong-password':        'Mot de passe incorrect.',
  'auth/email-already-in-use':  'Email déjà utilisé.',
  'auth/weak-password':         'Mot de passe trop court (6 car. min).',
  'auth/invalid-email':         'Adresse email invalide.',
  'auth/popup-closed-by-user':  'Connexion annulée.',
  'auth/network-request-failed':'Problème réseau. Vérifie ta connexion.',
  'auth/invalid-credential':    'Email ou mot de passe incorrect.',
  'auth/credential-already-in-use': 'Ce compte Google est déjà lié à un autre profil.',
};
const friendlyErr = code => ERROR_MAP[code] || 'Une erreur est survenue.';

// ── Stars background (positions fixed at module load) ─────────────────────────
const STAR_POS = Array.from({ length: 24 }, () => ({
  left:      `${Math.random() * 100}%`,
  top:       `${Math.random() * 100}%`,
  '--delay': `${(Math.random() * 4).toFixed(1)}s`,
  '--size':  `${4 + Math.random() * 8}px`,
  '--dur':   `${2 + Math.random() * 2}s`,
}));

// ── Particles (positions fixed at module load) ────────────────────────────────
const PARTICLE_POS = Array.from({ length: 14 }, (_, i) => ({
  left:      `${5 + Math.random() * 90}%`,
  bottom:    `${Math.random() * 20}%`,
  '--delay': `${(i * 0.4).toFixed(1)}s`,
  '--size':  `${3 + Math.random() * 5}px`,
  '--drift': `${Math.random() > 0.5 ? '' : '-'}${(10 + Math.random() * 30).toFixed(0)}px`,
}));

function Stars() {
  return (
    <div className="login-stars" aria-hidden="true">
      {STAR_POS.map((s, i) => <span key={i} className="login-star" style={s} />)}
    </div>
  );
}

function Particles() {
  return (
    <div className="login-particles" aria-hidden="true">
      {PARTICLE_POS.map((p, i) => <span key={i} className="login-particle" style={p} />)}
    </div>
  );
}

function Planets() {
  return (
    <div className="login-planets" aria-hidden="true">
      <div className="login-planet login-planet--1" />
      <div className="login-planet login-planet--2" />
    </div>
  );
}

const MASCOT_HAPPY     = 'assets/characters/mascot-happy.svg';
const MASCOT_CELEBRATE = 'assets/characters/mascot-celebrate.svg';

function MascotHero({ src = MASCOT_HAPPY }) {
  return (
    <div className="login-mascot-hero-wrap" aria-hidden="true">
      <img
        src={assetUrl(src)}
        className="login-mascot-hero"
        alt=""
        draggable="false"
      />
      {/* Glow ring behind mascot */}
      <div className="login-mascot-glow" />
    </div>
  );
}

// ── Emoji slots ───────────────────────────────────────────────────────────────
function EmojiSlots({ pin, shake }) {
  return (
    <div className={`ep-slots${shake ? ' ep-slots--shake' : ''}`}>
      {Array.from({ length: PIN_LEN }, (_, i) => (
        <div key={i} className={`ep-slot${i < pin.length ? ' ep-slot--filled' : ''}`}>
          {pin[i] || ''}
        </div>
      ))}
    </div>
  );
}

// ── Emoji pad ─────────────────────────────────────────────────────────────────
function EmojiPad({ onComplete, onBack }) {
  const [pin, setPin] = useState([]);

  function tap(e) {
    if (pin.length >= PIN_LEN) return;
    const next = [...pin, e];
    setPin(next);
    if (next.length === PIN_LEN) setTimeout(() => onComplete(next), 180);
  }

  return (
    <div className="ep-pad">
      <EmojiSlots pin={pin} />
      <div className="ep-grid">
        {EMOJIS.map(e => (
          <button
            key={e}
            type="button"
            className={`ep-emoji${pin.includes(e) ? ' ep-emoji--used' : ''}`}
            onClick={() => tap(e)}
            aria-label={`Choisir ${e}`}
          >{e}</button>
        ))}
      </div>
      <div className="ep-controls">
        {onBack && (
          <button className="ep-ctrl ep-ctrl--back" onClick={onBack} type="button">← Retour</button>
        )}
        <button
          className="ep-ctrl ep-ctrl--del"
          onClick={() => setPin(p => p.slice(0, -1))}
          disabled={pin.length === 0}
          type="button"
        >⌫</button>
      </div>
    </div>
  );
}

// ── Google button ─────────────────────────────────────────────────────────────
function GoogleBtn({ onClick, loading, label = 'Continuer avec Google' }) {
  return (
    <button className="login-google-btn" onClick={onClick} disabled={!!loading} type="button">
      {loading ? <span className="login-spinner" /> : (
        <svg className="login-google-icon" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6C29.9 37.8 27.1 38.8 24 38.8c-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.6 14.6 48 24 48z"/>
          <path fill="#FBBC05" d="M10.5 28.9c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-6.2H2.4C.9 16.1 0 19.9 0 24s.9 7.9 2.4 11.1l8.1-6.2z"/>
          <path fill="#EA4335" d="M24 9.2c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.1 30.5 0 24 0 14.6 0 6.4 5.4 2.4 13.1l8.1 6.2C12.4 13.4 17.7 9.2 24 9.2z"/>
        </svg>
      )}
      {loading ? 'Connexion…' : label}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());

  // step: 'detecting' | 'welcome' | 'creer-enfant' | 'setup-pin' | 'confirm-pin'
  //       | 'save-prompt' | 'pin' | 'parent-auth' | 'parent-email'
  const [step, setStep]         = useState('detecting');
  const [childName, setChildName] = useState('');
  const [pinDraft, setPinDraft] = useState([]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState('');
  const [shake, setShake]       = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', password: '', name: '', mode: 'login' });

  useEffect(() => {
    function sync() { setProfile(getProfile()); }
    window.addEventListener('lena-profile-change', sync);
    return () => window.removeEventListener('lena-profile-change', sync);
  }, []);

  // Decide initial step once auth resolves
  useEffect(() => {
    if (user === null) return;
    if (user === false) {
      setStep('welcome');
    } else {
      const saved = loadPin();
      setStep(saved ? 'pin' : 'setup-pin');
    }
  }, [user]);

  // ── PIN entry (returning child) ───────────────────────────────────────────
  function handlePinEntry(entered) {
    if (hashPin(entered) === loadPin()) {
      navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError('Ce n\'est pas le bon code 🙈 Réessaie !');
    }
  }

  // ── PIN setup ─────────────────────────────────────────────────────────────
  function handlePinSetup(first) {
    setPinDraft(first);
    setStep('confirm-pin');
  }

  async function handlePinConfirm(second) {
    if (second.join('') !== pinDraft.join('')) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError('Les deux codes sont différents. Réessaie !');
      setStep('setup-pin');
      return;
    }
    savePin(second);

    // If child came from 'creer-enfant', create anonymous account + save name
    if (childName && !user) {
      setLoading('anon');
      try {
        await signInAnon();
        saveProfile({ name: childName.trim() });
      } catch (e) {
        setError(friendlyErr(e.code));
        setLoading('');
        return;
      }
      setLoading('');
      setStep('save-prompt');
    } else {
      navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
    }
  }

  // ── Save prompt (link anon → Google) ─────────────────────────────────────
  async function handleLinkGoogle() {
    setError(''); setLoading('link');
    try {
      await linkAnonWithGoogle();
    } catch (e) {
      // If already linked, just proceed
      if (e.code !== 'auth/credential-already-in-use') {
        setError(friendlyErr(e.code));
        setLoading('');
        return;
      }
    }
    setLoading('');
    navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
  }

  function handleSkipSave() {
    navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
  }

  // ── Parent auth ───────────────────────────────────────────────────────────
  async function handleGoogle() {
    setError(''); setLoading('google');
    try { await signInGoogle(); } catch (e) { setError(friendlyErr(e.code)); }
    setLoading('');
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError(''); setLoading('email');
    const { email, password, name, mode } = emailForm;
    try {
      if (mode === 'signup') await signUpEmail(email, password, name);
      else await signInEmail(email, password);
    } catch (err) { setError(friendlyErr(err.code)); }
    setLoading('');
  }

  function handleGuest() {
    localStorage.setItem('lena:guest-session', '1');
    navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <Stars />
      <Particles />
      <Planets />

      {/* ── Loading ── */}
      {step === 'detecting' && (
        <div className="login-scene">
          <div className="login-card login-card--centered">
            <span className="login-spinner login-spinner--lg" />
          </div>
        </div>
      )}

      {/* ── Welcome: choose path ── */}
      {step === 'welcome' && (
        <div className="login-scene">
          {/* Mascota real — sobresale encima de la tarjeta */}
          <MascotHero src={MASCOT_HAPPY} />

          <div className="login-card login-card--welcome">
            {/* Logo */}
            <div className="login-logo">
              <h1 className="login-logo__name">LénaLand</h1>
              <p className="login-logo__tagline">✨ Bienvenue dans ton univers d&apos;apprentissage !</p>
            </div>

            {/* Social proof chips */}
            <div className="login-stats">
              <span className="login-stat">🎮 120+ Jeux</span>
              <span className="login-stat">📚 20+ Histoires</span>
              <span className="login-stat">🏆 Défis quotidiens</span>
            </div>

            {/* Google — parent / returning */}
            <GoogleBtn onClick={handleGoogle} loading={loading === 'google'} />

            {/* Create account — child primary CTA */}
            <button className="login-primary-btn" onClick={() => setStep('creer-enfant')} type="button">
              🎉 Créer mon compte
            </button>

            {/* Guest */}
            <button className="login-secondary-btn" onClick={handleGuest} type="button">
              🕹️ Jouer sans compte
            </button>

            <button className="login-email-toggle" onClick={() => setStep('parent-email')} type="button">
              📧 Connexion avec email →
            </button>

            <p className="login-safety">🛡️ Sécurisé et conçu pour les enfants</p>
          </div>
        </div>
      )}

      {/* ── Create child account: enter name ── */}
      {step === 'creer-enfant' && (
        <div className="login-scene"><div className="login-card">
          <div className="login-logo">
            <span className="login-logo__icon login-logo__icon--bounce">👋</span>
            <h1 className="login-hello">Comment tu t&apos;appelles ?</h1>
            <p className="login-instruction">Tape ton prénom ou ton surnom</p>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-name-field">
            <input
              className="login-name-input"
              type="text"
              placeholder="Ex : Léna, Max, Zara…"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              autoFocus
              maxLength={20}
              onKeyDown={e => e.key === 'Enter' && childName.trim() && setStep('setup-pin')}
            />
            <div className="login-name-emojis" aria-hidden="true">
              {['🌟','🎮','🦄','🚀','🎈'].map(e => <span key={e} className="login-name-emoji-item">{e}</span>)}
            </div>
          </div>

          <button
            className="login-submit-btn"
            onClick={() => { if (childName.trim()) { setError(''); setStep('setup-pin'); } else setError('Écris ton prénom d\'abord !'); }}
            type="button"
            disabled={!!loading}
          >
            Suivant →
          </button>

          <button className="login-guest-btn" onClick={() => { setStep('welcome'); setError(''); }}>
            ← Retour
          </button>
        </div></div>
      )}

      {/* ── Create PIN ── */}
      {step === 'setup-pin' && (
        <div className="login-scene">
          <MascotHero src={MASCOT_CELEBRATE} />
          <div className="login-card">
            <h1 className="login-hello">
              {childName ? `Super ${childName} ! ` : ''}Crée ton code secret !
            </h1>
            <p className="login-instruction">Choisis 4 emojis faciles à retenir</p>
            {error && <p className="login-error">{error}</p>}
            <EmojiPad onComplete={handlePinSetup} onBack={() => { setStep(childName ? 'creer-enfant' : 'welcome'); setError(''); }} />
          </div>
        </div>
      )}

      {/* ── Confirm PIN ── */}
      {step === 'confirm-pin' && (
        <div className="login-scene">
          <MascotHero src={MASCOT_CELEBRATE} />
          <div className="login-card">
            <h1 className="login-hello">Confirme ton code !</h1>
            <p className="login-instruction">Retape tes 4 emojis dans le même ordre</p>
            {error && <p className="login-error">{error}</p>}
            {loading === 'anon' && <span className="login-spinner login-spinner--lg" />}
            {loading !== 'anon' && (
              <EmojiPad
                onComplete={handlePinConfirm}
                onBack={() => { setStep('setup-pin'); setError(''); }}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Save prompt (link anon → Google, optional) ── */}
      {step === 'save-prompt' && (
        <div className="login-scene"><div className="login-card">
          {/* Rocket SVG illustration */}
          <div className="login-rocket-illus" aria-hidden="true">
            <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="85" rx="28" ry="8" fill="rgba(124,58,237,0.25)" />
              {/* Cloud */}
              <ellipse cx="60" cy="22" rx="30" ry="14" fill="rgba(255,255,255,0.18)" />
              <ellipse cx="44" cy="26" rx="18" ry="12" fill="rgba(255,255,255,0.14)" />
              <ellipse cx="76" cy="26" rx="18" ry="12" fill="rgba(255,255,255,0.14)" />
              {/* Rocket body */}
              <path d="M60 72 L50 90 L60 85 L70 90 Z" fill="#7C3AED" />
              <path d="M52 50 Q60 20 68 50 L66 72 L54 72 Z" fill="#fff" />
              <path d="M52 50 Q60 20 68 50" fill="#7C3AED" />
              {/* Window */}
              <circle cx="60" cy="56" r="6" fill="#22D3EE" opacity="0.9" />
              {/* Flames */}
              <ellipse cx="60" cy="78" rx="5" ry="9" fill="#FBBF24" opacity="0.9" />
              <ellipse cx="60" cy="80" rx="3" ry="6" fill="#fff" opacity="0.7" />
            </svg>
          </div>

          <div className="login-logo">
            <h1 className="login-hello">Sauvegarde ton progrès !</h1>
            <p className="login-instruction">
              Connecte un compte Google pour retrouver<br />
              tes points et trophées sur n&apos;importe quel appareil.
            </p>
          </div>

          {error && <p className="login-error">{error}</p>}

          <GoogleBtn
            onClick={handleLinkGoogle}
            loading={loading === 'link'}
            label="Sauvegarder avec Google"
          />

          <button className="login-secondary-btn login-secondary-btn--sm" onClick={handleSkipSave} type="button">
            Plus tard — on joue d&apos;abord ! 🎮
          </button>
        </div></div>
      )}

      {/* ── PIN entry (returning child) ── */}
      {step === 'pin' && (
        <div className="login-scene">
          <MascotHero src={MASCOT_HAPPY} />
          <div className="login-card">
            <h1 className="login-hello">Salut {profile.name || 'toi'} ! 👋</h1>
            <p className="login-instruction">Tape tes 4 emojis secrets</p>
            {error && <p className="login-error">{error}</p>}
            <EmojiPad onComplete={handlePinEntry} shake={shake} />
            <button className="login-guest-btn" onClick={() => { clearPin(); setStep('welcome'); }}>
              Mon parent va m&apos;aider 🔑
            </button>
          </div>
        </div>
      )}

      {/* ── Parent auth (email) ── */}
      {step === 'parent-email' && (
        <div className="login-scene"><div className="login-card">
          <div className="login-logo">
            <span className="login-logo__icon">👨‍👩‍👧</span>
            <h1 className="login-hello">Espace parents</h1>
            <p className="login-instruction">Connexion avec votre compte</p>
          </div>

          <GoogleBtn onClick={handleGoogle} loading={loading === 'google'} />

          <div className="login-divider"><span>ou email</span></div>

          <div className="login-toggle">
            <button
              className={`login-toggle__btn${emailForm.mode === 'login' ? ' login-toggle__btn--active' : ''}`}
              onClick={() => setEmailForm(f => ({ ...f, mode: 'login' }))}
            >Se connecter</button>
            <button
              className={`login-toggle__btn${emailForm.mode === 'signup' ? ' login-toggle__btn--active' : ''}`}
              onClick={() => setEmailForm(f => ({ ...f, mode: 'signup' }))}
            >Créer un compte</button>
          </div>

          <form className="login-form" onSubmit={handleEmailAuth}>
            {emailForm.mode === 'signup' && (
              <input className="login-field__input" type="text" placeholder="Prénom de l'enfant"
                value={emailForm.name} onChange={e => setEmailForm(f => ({ ...f, name: e.target.value }))} autoComplete="name" />
            )}
            <input className="login-field__input" type="email" placeholder="Email du parent"
              value={emailForm.email} onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))} required autoComplete="email" />
            <input className="login-field__input" type="password"
              placeholder={emailForm.mode === 'signup' ? 'Mot de passe (6 car. min)' : 'Mot de passe'}
              value={emailForm.password} onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))} required
              autoComplete={emailForm.mode === 'signup' ? 'new-password' : 'current-password'} />
            {error && <p className="login-error">{error}</p>}
            <button className="login-submit-btn" type="submit" disabled={!!loading}>
              {loading === 'email' ? <span className="login-spinner" /> : null}
              {loading === 'email' ? 'Chargement…' : emailForm.mode === 'signup' ? '🎉 Créer' : '→ Entrer'}
            </button>
          </form>

          <button className="login-email-toggle" onClick={() => { setStep('welcome'); setError(''); }} type="button">
            ← Retour
          </button>
        </div></div>
      )}
    </div>
  );
}
