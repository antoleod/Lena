import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function AccountWidget() {
  const { user, syncing, logout, syncNow } = useAuth();
  const navigate = useNavigate();

  // Still loading auth state
  if (user === null) return null;

  if (!user) {
    return (
      <div className="account-widget account-widget--guest">
        <span className="account-widget__icon">👤</span>
        <div className="account-widget__text">
          <p className="account-widget__title">Mode invité</p>
          <p className="account-widget__sub">Progrès local uniquement</p>
        </div>
        <button
          className="account-widget__btn account-widget__btn--login"
          onClick={() => navigate('/login')}
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="account-widget account-widget--logged">
      <div className="account-widget__avatar">
        {user.photoURL
          ? <img src={user.photoURL} alt="" className="account-widget__photo" />
          : <span>{(user.displayName || user.email || '?')[0].toUpperCase()}</span>
        }
      </div>
      <div className="account-widget__text">
        <p className="account-widget__title">{user.displayName || user.email}</p>
        <p className="account-widget__sub">
          {syncing ? '⏳ Synchronisation…' : '☁️ Sauvegarde activée'}
        </p>
      </div>
      <div className="account-widget__actions">
        <button
          className="account-widget__btn account-widget__btn--sync"
          onClick={syncNow}
          disabled={syncing}
          title="Synchroniser maintenant"
        >
          {syncing ? '⏳' : '↑'}
        </button>
        <button
          className="account-widget__btn account-widget__btn--logout"
          onClick={logout}
          title="Se déconnecter"
        >
          ⎋
        </button>
      </div>
    </div>
  );
}
