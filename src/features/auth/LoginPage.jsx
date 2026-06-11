import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext.jsx';
import {
  signInGoogle, signInEmail, signUpEmail,
  signInAnon, linkAnonWithGoogle, setAuthPersistence,
} from '../../services/firebase/authService.js';
import { getProfile, saveProfile, isProfileComplete } from '../../services/storage/profileStore.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';
import { IconCreate, IconArrow } from './LoginIcons.jsx';
import IconPinPad from './IconPinPad.jsx';
import { hashPin, savePin, loadPin, clearPin } from './iconPinStore.js';

// ── Small inline icons for the v2 welcome panel ───────────────────────────────
const GoogleGlyph = () => (
  <svg className="lp2-gi" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z"/>
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6C29.9 37.8 27.1 38.8 24 38.8c-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.6 14.6 48 24 48z"/>
    <path fill="#FBBC05" d="M10.5 28.9c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-6.2H2.4C.9 16.1 0 19.9 0 24s.9 7.9 2.4 11.1l8.1-6.2z"/>
    <path fill="#EA4335" d="M24 9.2c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.1 30.5 0 24 0 14.6 0 6.4 5.4 2.4 13.1l8.1 6.2C12.4 13.4 17.7 9.2 24 9.2z"/>
  </svg>
);
const MailGlyph = () => (
  <svg className="lp2-bi" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor"/>
    <path d="M5 8l7 5 7-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LockGlyph = () => (
  <svg className="lp2-bi" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2.5" fill="currentColor"/>
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <circle cx="12" cy="15" r="1.6" fill="#1a1340"/>
  </svg>
);
const GuestGlyph = () => (
  <svg className="lp2-bi" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" fill="currentColor"/>
    <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" fill="currentColor"/>
  </svg>
);
const RocketGlyph = () => (
  <svg className="lp2-cta__rocket" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3c5 3 7 8 6.5 14l-3 4.5h-7L9.5 17C9 11 11 6 16 3z" fill="#dfe6ff"/>
    <path d="M16 3c3 2 4.6 5 4.8 8.5L16 10l-4.8 1.5C11.4 8 13 5 16 3z" fill="#8b6cf0"/>
    <circle cx="16" cy="12" r="2.9" fill="#6ad0ff" stroke="#3a2c8f" strokeWidth="1"/>
    <path d="M9.6 19l-3.2 3.2 4.4-1.1zM22.4 19l3.2 3.2-4.4-1.1z" fill="#7c5fd0"/>
    <path d="M12.8 21.5c0 3 3.2 6.5 3.2 6.5s3.2-3.5 3.2-6.5z" fill="#ffb13b"/>
    <path d="M13.6 22.5c0 2 2.4 4.5 2.4 4.5s2.4-2.5 2.4-4.5z" fill="#ffe27a"/>
  </svg>
);
const StarGlyph = () => (
  <svg className="lp2-head__star" viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="#ffd24d" stroke="#e0951a" strokeWidth="1"/>
  </svg>
);
const ShieldGlyph = () => (
  <svg className="lp2-safe__ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="currentColor"/>
    <path d="M8.5 12l2.5 2.5L16 9" stroke="#1a1340" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  'auth/unconfigured':          'Connexion indisponible ici. Tu peux jouer sans compte ! 🕹️',
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

function Nebula() {
  return (
    <div className="login-nebula" aria-hidden="true">
      <span className="login-nebula__cloud login-nebula__cloud--1" />
      <span className="login-nebula__cloud login-nebula__cloud--2" />
      <span className="login-nebula__cloud login-nebula__cloud--3" />
    </div>
  );
}

function ShootingStars() {
  return (
    <div className="login-shooting" aria-hidden="true">
      <span className="login-shoot login-shoot--1" />
      <span className="login-shoot login-shoot--2" />
      <span className="login-shoot login-shoot--3" />
    </div>
  );
}

const MASCOT_HAPPY     = 'assets/characters/mascot-happy.svg';
const MASCOT_CELEBRATE = 'assets/characters/mascot-celebrate.svg';

function MascotHero({ src = MASCOT_HAPPY }) {
  return (
    <div className="login-mascot-hero-wrap login-mascot-hero-wrap--alive" aria-hidden="true">
      {/* Pulsing glow ring behind mascot */}
      <div className="login-mascot-glow" />
      {/* Breathing + floating shell — the SVG handles its own eye-blink */}
      <div className="login-mascot-breathe">
        <img
          src={assetUrl(src)}
          className="login-mascot-hero"
          alt=""
          draggable="false"
        />
      </div>
      {/* Sparkles orbiting the mascot */}
      <span className="login-mascot-spark login-mascot-spark--1">✨</span>
      <span className="login-mascot-spark login-mascot-spark--2">⭐</span>
      <span className="login-mascot-spark login-mascot-spark--3">💫</span>
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
  const [emailForm, setEmailForm] = useState({
    email: localStorage.getItem('lena:remember-email') || '',
    password: '', name: '', mode: 'login',
    remember: localStorage.getItem('lena:remember-email') !== null,
  });

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
      // Re-activate the local session so the route guard lets the child back in
      // (works for guest/offline profiles too, not just Firebase users).
      saveProfile({ sessionActive: true });
      if (!user) localStorage.setItem('lena:guest-session', '1');
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
    const { email, password, name, mode, remember } = emailForm;
    try {
      await setAuthPersistence(remember);
      if (remember) localStorage.setItem('lena:remember-email', email.trim());
      else localStorage.removeItem('lena:remember-email');
      if (mode === 'signup') await signUpEmail(email, password, name);
      else await signInEmail(email, password);
    } catch (err) { setError(friendlyErr(err.code)); }
    setLoading('');
  }

  function handleGuest() {
    localStorage.setItem('lena:guest-session', '1');
    navigate(isProfileComplete() ? '/' : '/onboarding', { replace: true });
  }

  // ── Secret-code login (emoji "password with special characters") ──────────
  function handleSecretCode() {
    setError('');
    // Got a saved code → enter it; otherwise start the create flow to make one.
    setStep(loadPin() ? 'pin' : 'creer-enfant');
  }

  // ── Returning-user resume (local profile exists) ──────────────────────────
  function handleResume() {
    // If the child set an emoji code, ask for it (their "password with figures").
    // Otherwise resume straight away.
    if (loadPin()) {
      setError('');
      setStep('pin');
      return;
    }
    if (!isProfileComplete()) localStorage.setItem('lena:guest-session', '1');
    navigate(profile.lastVisitedRoute || '/', { replace: true });
  }

  // ── Recognition data (from local stores) ──────────────────────────────────
  const hasSession = Boolean(profile.name && (profile.sessionActive || loadPin()));

  // Smart primary CTA: returning user resumes, new user starts account creation.
  function handleStartAdventure() {
    setError('');
    if (hasSession) handleResume();
    else setStep('creer-enfant');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <Nebula />
      <Stars />
      <ShootingStars />
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

      {/* ── Welcome: full-bleed scene (v2, maquette) ── */}
      {step === 'welcome' && (
        <div className="lp2-welcome">
          {/* ── Decorative cosmos scene ── */}
          <div className="lp2-scene" aria-hidden="true">
            {/* Ringed planet (left) */}
            <svg className="lp2-planet" viewBox="0 0 220 180">
              <defs><radialGradient id="lp2-pl" cx="36%" cy="30%" r="72%"><stop offset="0" stopColor="#8e7bd6"/><stop offset="1" stopColor="#3a2a72"/></radialGradient></defs>
              <circle cx="108" cy="92" r="64" fill="url(#lp2-pl)"/>
              <ellipse cx="108" cy="96" rx="104" ry="26" fill="none" stroke="#b9a6f0" strokeWidth="6" opacity=".65" transform="rotate(-16 108 96)"/>
              <ellipse cx="108" cy="96" rx="104" ry="26" fill="none" stroke="#7c5fd0" strokeWidth="2" opacity=".7" transform="rotate(-16 108 96)"/>
            </svg>

            {/* Soft clouds */}
            <span className="lp2-cloud lp2-cloud--1" />
            <span className="lp2-cloud lp2-cloud--2" />
            <span className="lp2-cloud lp2-cloud--3" />

            {/* Floating castle island (left) */}
            <svg className="lp2-island lp2-island--castle" viewBox="0 0 140 130">
              <ellipse cx="70" cy="104" rx="58" ry="18" fill="#6a4fb0"/>
              <path d="M14 100 Q70 128 126 100 L116 112 Q70 134 24 112 Z" fill="#4f3a8f"/>
              <g fill="#7d72d8" stroke="#a99cf0" strokeWidth="2">
                <rect x="40" y="44" width="44" height="52" rx="3"/>
                <rect x="32" y="34" width="16" height="62"/><rect x="76" y="34" width="16" height="62"/>
              </g>
              <g fill="#b3a6f2"><polygon points="48,34 30,34 40,18"/><polygon points="94,34 76,34 84,18"/></g>
              <g fill="#ffd36b"><rect x="56" y="58" width="10" height="14" rx="2"/></g>
              <rect x="83" y="10" width="2.5" height="12" fill="#caa"/>
              <polygon points="85,10 85,18 96,14" fill="#ffce5a"/>
              <g fill="#56c98a"><ellipse cx="22" cy="92" rx="10" ry="8"/><ellipse cx="118" cy="92" rx="10" ry="8"/></g>
            </svg>

            {/* Rocket (bottom-right) */}
            <svg className="lp2-rocket" viewBox="0 0 120 150">
              <ellipse cx="60" cy="138" rx="34" ry="9" fill="#6a4fb0" opacity=".6"/>
              <path d="M60 14 C82 30 90 64 86 96 L72 112 H48 L34 96 C30 64 38 30 60 14 Z" fill="#e7ecff"/>
              <path d="M60 14 C74 26 82 50 82 76 L60 70 L38 76 C38 50 46 26 60 14 Z" fill="#8b6cf0"/>
              <circle cx="60" cy="62" r="14" fill="#1f2a55"/><circle cx="60" cy="62" r="9" fill="#6ad0ff"/>
              <path d="M48 96 L30 116 L40 112 L44 122 Z" fill="#7c5fd0"/>
              <path d="M72 96 L90 116 L80 112 L76 122 Z" fill="#7c5fd0"/>
              <ellipse cx="60" cy="120" rx="8" ry="14" fill="#ffb13b"/>
              <ellipse cx="60" cy="122" rx="4" ry="8" fill="#ffe27a"/>
              <rect x="92" y="118" width="3" height="20" fill="#caa"/>
              <polygon points="95,118 95,130 110,124" fill="#7c5fd0"/>
              <polygon points="101,121 101,127 108,124" fill="#ffd36b"/>
            </svg>

            {/* Crystal cluster (bottom-right) */}
            <svg className="lp2-crystals" viewBox="0 0 120 110">
              <g stroke="#2b2a78" strokeWidth="1.5" strokeLinejoin="round">
                <polygon points="40,108 30,60 50,46 66,66 58,108" fill="#6ad0ff"/>
                <polygon points="40,108 30,60 44,66 42,108" fill="#9ae3ff"/>
                <polygon points="74,108 64,38 82,30 96,58 90,108" fill="#8b6cf0"/>
                <polygon points="74,108 64,38 78,46 80,108" fill="#b59bf2"/>
                <polygon points="98,108 92,72 104,66 112,90 108,108" fill="#7ce0c0"/>
              </g>
            </svg>

            {/* Ground glow + light path */}
            <div className="lp2-ground" />
            <div className="lp2-path">
              {Array.from({ length: 7 }).map((_, i) => <span key={i} style={{ '--i': i }} />)}
            </div>
          </div>

          {/* ── Mascot (même avatar, sans cadre — libre) ── */}
          <div className="lp2-mascot-wrap">
            <img src={assetUrl(MASCOT_HAPPY)} className="lp2-mascot lp2-mascot--img" alt="" draggable="false" />
          </div>

          {/* ── Control panel (right) ── */}
          <div className="lp2-panel">
            <div className="lp2-logo-wrap">
              <h1 className="lp2-logo" data-text="LénaLand">LénaLand</h1>
              <span className="lp2-logo__star" aria-hidden="true">★</span>
            </div>

            <div className="lp2-head">
              <StarGlyph />
              <h2 className="lp2-head__title">Prêt pour ta mission&nbsp;?</h2>
              <StarGlyph />
            </div>
            <p className="lp2-subtitle">
              Connecte-toi pour retrouver tes étoiles<br />
              et continuer ton <b>aventure</b>&nbsp;!
            </p>

            {error && <p className="login-error lp2-error">{error}</p>}

            <button className="lp2-cta" type="button" onClick={handleStartAdventure} disabled={!!loading}>
              <RocketGlyph />
              <span>Commencer l&apos;aventure</span>
            </button>

            <div className="lp2-or"><span>Ou continuer avec</span></div>

            <div className="lp2-row">
              <button className="lp2-btn lp2-btn--google" type="button" onClick={handleGoogle} disabled={!!loading}>
                {loading === 'google' ? <span className="login-spinner" /> : <GoogleGlyph />} Google
              </button>
              <button className="lp2-btn lp2-btn--email" type="button" onClick={() => setStep('parent-email')}>
                <MailGlyph /> Email
              </button>
            </div>

            <button className="lp2-btn lp2-btn--dark" type="button" onClick={handleSecretCode}>
              <LockGlyph /> Code secret
            </button>

            <div className="lp2-or"><span>Ou</span></div>

            <button className="lp2-btn lp2-btn--dark lp2-btn--guest" type="button" onClick={handleGuest}>
              <GuestGlyph /> Jouer en invité
            </button>

            <p className="lp2-safe"><ShieldGlyph /> Espace sécurisé pour les enfants</p>
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
            Suivant <IconArrow />
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
            <p className="login-instruction">Choisis 4 images faciles à retenir</p>
            {error && <p className="login-error">{error}</p>}
            <IconPinPad onComplete={handlePinSetup} onBack={() => { setStep(childName ? 'creer-enfant' : 'welcome'); setError(''); }} />
          </div>
        </div>
      )}

      {/* ── Confirm PIN ── */}
      {step === 'confirm-pin' && (
        <div className="login-scene">
          <MascotHero src={MASCOT_CELEBRATE} />
          <div className="login-card">
            <h1 className="login-hello">Confirme ton code !</h1>
            <p className="login-instruction">Retape tes 4 images dans le même ordre</p>
            {error && <p className="login-error">{error}</p>}
            {loading === 'anon' && <span className="login-spinner login-spinner--lg" />}
            {loading !== 'anon' && (
              <IconPinPad
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
            {/* Username badge — who is signing in */}
            <div className="login-whois">
              <span className="login-whois__avatar">👧</span>
              <span className="login-whois__name">{profile.name || 'toi'}</span>
            </div>
            <h1 className="login-hello">Salut {profile.name || 'toi'} ! 👋</h1>
            <p className="login-instruction">Tape tes 4 images secrètes</p>
            {error && <p className="login-error">{error}</p>}
            <IconPinPad onComplete={handlePinEntry} shake={shake} />
            {user === false && (
              <button className="login-secondary-btn login-secondary-btn--sm" onClick={() => { setError(''); setStep('welcome'); }} type="button">
                ← Changer de profil
              </button>
            )}
            <button className="login-guest-btn" onClick={() => { clearPin(); setStep(user ? 'setup-pin' : 'welcome'); setError(''); }}>
              J&apos;ai oublié mon code — mon parent va m&apos;aider 🔑
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
            <label className="login-remember">
              <input type="checkbox" checked={emailForm.remember}
                onChange={e => setEmailForm(f => ({ ...f, remember: e.target.checked }))} />
              <span>Se souvenir de moi</span>
            </label>
            {error && <p className="login-error">{error}</p>}
            <button className="login-submit-btn" type="submit" disabled={!!loading}>
              {loading === 'email' ? <span className="login-spinner" /> : null}
              {loading === 'email'
                ? 'Chargement…'
                : emailForm.mode === 'signup'
                  ? <><IconCreate /> Créer</>
                  : <>Entrer <IconArrow /></>}
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
