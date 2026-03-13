import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { logoutProfile } from '../../services/storage/profileStore.js';
import { getSessionSnapshot, rememberLastVisitedRoute, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import { useEffect, useMemo, useState } from 'react';

function getInitial(name, fallback) {
  const value = String(name || fallback || 'L').trim();
  return value ? value[0].toUpperCase() : 'L';
}

export default function AppShell() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => ([
    { to: '/map', label: t('missions') },
    { to: '/subjects', label: t('subjectsLabel') || 'Subjects' },
    { to: '/history', label: t('historyTitle') || 'History' },
    { to: '/shop', label: t('shop') }
  ]), [t]);

  useEffect(() => {
    function handleLogout() {
      navigate('/onboarding');
    }

    const unsubscribe = subscribeToSessionChanges(setSession);
    window.addEventListener('lena-profile-logout', handleLogout);
    return () => {
      unsubscribe();
      window.removeEventListener('lena-profile-logout', handleLogout);
    };
  }, [navigate]);

  useEffect(() => {
    document.documentElement.dataset.effect = session.rewards.equippedEffectId || 'effect-rainbow';
  }, [session.rewards.equippedEffectId]);

  useEffect(() => {
    rememberLastVisitedRoute(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell app-shell--game">
      <div className="scene-effects" aria-hidden="true">
        <span className="scene-effects__rain"></span>
        <span className="scene-effects__rain scene-effects__rain--b"></span>
        <span className="scene-effects__snow"></span>
        <span className="scene-effects__snow scene-effects__snow--b"></span>
        <span className="scene-effects__rainbow"></span>
      </div>
      <header className="app-topbar">
        <button type="button" className="brand-inline" onClick={() => navigate('/settings')}>
          <span className="brand-inline__mark">L</span>
          <span className="brand-inline__name">Lena</span>
        </button>

        <nav className="topbar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `topbar-link${isActive ? ' is-active' : ''}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-tools">
          <button type="button" className="wallet-compact" onClick={() => navigate('/shop')}>
            <span>{session.rewards.balance}</span>
            <small>{t('crystals')}</small>
          </button>

          <button
            type="button"
            className="profile-inline"
            onClick={() => navigate('/settings')}
            title={session.profile.name || t('defaultChildName')}
          >
            <span className="profile-inline__avatar">{getInitial(session.profile.name, t('defaultChildName'))}</span>
            <span className="profile-inline__name">{session.profile.name || t('defaultChildName')}</span>
          </button>

          <button type="button" className="icon-link" onClick={() => navigate('/settings')}>
            {t('settingsLabel') || 'Settings'}
          </button>
          <button
            type="button"
            className="icon-link"
            onClick={() => {
              logoutProfile();
              navigate('/onboarding', { replace: true, state: { from: location.pathname } });
            }}
          >
            {t('logoutLabel') || 'Logout'}
          </button>
        </div>
      </header>

      <main className="app-main app-main--game">
        <Outlet />
      </main>
    </div>
  );
}
