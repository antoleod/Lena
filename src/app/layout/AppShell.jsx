import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { logoutProfile } from '../../services/storage/profileStore.js';
import { getSessionSnapshot, rememberLastVisitedRoute, subscribeToSessionChanges } from '../../services/session/sessionStore.js';

export default function AppShell() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic branding: use saved name or fallback to default
  const displayName = session.profile?.name || t('defaultChildName') || 'Kid';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const navItems = useMemo(() => ([
    { to: '/map', label: t('startAdventure') || 'Adventure', icon: '🗺' },
    { to: '/subjects', label: t('subjectsLabel') || 'Subjects', icon: '📚' },
    { to: '/history', label: t('historyTitle') || 'History', icon: '📈' },
    { to: '/settings', label: t('settingsLabel') || 'Settings', icon: '⚙' }
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
    document.documentElement.dataset.wallpaper = session.rewards.equippedWallpaperId || 'wallpaper-dreamy-sky';
  }, [session.rewards.equippedWallpaperId]);

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
      <header className="app-topbar" data-testid="app-shell">
        <button type="button" className="brand-inline" onClick={() => navigate('/')} data-testid="shell-brand">
          <span className="brand-inline__mark">{displayInitial}</span>
          <span className="brand-inline__name">{displayName}</span>
        </button>

        <nav className="topbar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `topbar-link${isActive ? ' is-active' : ''}`}
              to={item.to}
              data-testid={`nav-${item.to.replace('/', '') || 'home'}`}
            >
              <span className="topbar-link__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-tools">
          <button type="button" className="wallet-compact" onClick={() => navigate('/shop')} data-testid="shell-wallet">
            <span>{session.rewards.balance}</span>
            <small>{t('crystals')}</small>
          </button>

          <button
            type="button"
            className="profile-inline"
            onClick={() => navigate('/')}
            title={displayName}
            data-testid="shell-profile"
          >
            <span className="profile-inline__avatar">{displayInitial}</span>
            <span className="profile-inline__name">{displayName}</span>
          </button>

          <button type="button" className="icon-link" onClick={() => navigate('/shop')} data-testid="shell-shop">
            <span aria-hidden="true">🛍</span>
            <span>{t('shop')}</span>
          </button>
          <button
            type="button"
            className="icon-link"
            data-testid="shell-logout"
            onClick={() => {
              logoutProfile();
              navigate('/onboarding', { replace: true, state: { from: location.pathname } });
            }}
          >
            <span aria-hidden="true">↩</span>
            <span>{t('logoutLabel') || 'Logout'}</span>
          </button>
        </div>
      </header>

      <main className="app-main app-main--game">
        <Outlet />
      </main>
    </div>
  );
}
