import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInEmail, signInGoogle, signUpEmail } from '../../services/firebase/authService.js';

const ERROR_MESSAGES = {
  'auth/user-not-found':       'Aucun compte avec cet email.',
  'auth/wrong-password':       'Mot de passe incorrect.',
  'auth/email-already-in-use': 'Cet email est déjà utilisé.',
  'auth/weak-password':        'Mot de passe trop court (6 caractères min.).',
  'auth/invalid-email':        'Adresse email invalide.',
  'auth/popup-closed-by-user': 'Connexion annulée.',
  'auth/network-request-failed': 'Problème réseau. Vérifiez votre connexion.',
  'auth/invalid-credential':   'Email ou mot de passe incorrect.',
};

function friendlyError(code) {
  return ERROR_MESSAGES[code] || 'Une erreur est survenue. Réessaie.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState('login');    // 'login' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState('');        // 'google' | 'email' | ''
  const [error, setError]       = useState('');

  async function handleGoogle() {
    setError(''); setLoading('google');
    try {
      await signInGoogle();
      navigate('/', { replace: true });
    } catch (e) { setError(friendlyError(e.code)); }
    setLoading('');
  }

  async function handleEmail(e) {
    e.preventDefault();
    setError(''); setLoading('email');
    try {
      if (mode === 'signup') {
        await signUpEmail(email, password, name);
      } else {
        await signInEmail(email, password);
      }
      navigate('/', { replace: true });
    } catch (err) { setError(friendlyError(err.code)); }
    setLoading('');
  }

  function handleGuest() {
    navigate('/', { replace: true });
  }

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-bg" aria-hidden="true">
        <span className="login-bg__blob login-bg__blob--1" />
        <span className="login-bg__blob login-bg__blob--2" />
        <span className="login-bg__blob login-bg__blob--3" />
      </div>

      <div className="login-card">

        {/* Logo / title */}
        <div className="login-logo">
          <span className="login-logo__icon">🚀</span>
          <h1 className="login-logo__name">LénaLand</h1>
          <p className="login-logo__sub">Explorer · Apprendre · Rêver · Grandir</p>
        </div>

        {/* Mode toggle */}
        <div className="login-toggle">
          <button
            className={`login-toggle__btn${mode === 'login' ? ' login-toggle__btn--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Se connecter
          </button>
          <button
            className={`login-toggle__btn${mode === 'signup' ? ' login-toggle__btn--active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Créer un compte
          </button>
        </div>

        {/* Google */}
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

        <div className="login-divider"><span>ou</span></div>

        {/* Email form */}
        <form className="login-form" onSubmit={handleEmail}>
          {mode === 'signup' && (
            <div className="login-field">
              <label className="login-field__label">Prénom ou pseudo</label>
              <input
                className="login-field__input"
                type="text"
                placeholder="Ex: Lina, Tom…"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div className="login-field">
            <label className="login-field__label">Adresse email</label>
            <input
              className="login-field__input"
              type="email"
              placeholder="parent@exemple.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label className="login-field__label">Mot de passe</label>
            <input
              className="login-field__input"
              type="password"
              placeholder={mode === 'signup' ? 'Min. 6 caractères' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="login-submit-btn"
            type="submit"
            disabled={!!loading}
          >
            {loading === 'email' ? <span className="login-spinner" /> : null}
            {loading === 'email'
              ? 'Chargement…'
              : mode === 'signup' ? '🎉 Créer mon compte' : '→ Se connecter'
            }
          </button>
        </form>

        {/* Benefits */}
        <ul className="login-benefits">
          <li>☁️ Progrès sauvegardé sur tous tes appareils</li>
          <li>🏆 Scores et récompenses conservés</li>
          <li>📊 Statistiques détaillées par activité</li>
        </ul>

        {/* Guest */}
        <button className="login-guest-btn" onClick={handleGuest}>
          Continuer sans compte →
        </button>
      </div>
    </div>
  );
}
