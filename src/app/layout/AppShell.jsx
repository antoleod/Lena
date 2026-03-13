import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { getProfile, logoutProfile } from '../../services/storage/profileStore.js';
import { useEffect, useMemo, useState } from 'react';

function getInitial(name, fallback) {
  const value = String(name || fallback || 'L').trim();
  return value ? value[0].toUpperCase() : 'L';
}

export default function AppShell() {
  const { t } = useLocale();
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const [profile, setProfile] = useState(() => getProfile());
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => ([
    { to: '/map', label: t('missions') },
    { to: '/subjects', label: t('subjectsLabel') || 'Subjects' },
    { to: '/history', label: t('historyTitle') || 'History' },
    { to: '/shop', label: t('shop') }
  ]), [t]);

  useEffect(() => {
    function syncRewards() {
      setRewardState(getRewardState());
    }
    function syncProfile() {
      setProfile(getProfile());
    }
    function handleLogout() {
      navigate('/onboarding');
    }

    window.addEventListener('lena-rewards-change', syncRewards);
    window.addEventListener('lena-profile-change', syncProfile);
    window.addEventListener('lena-profile-logout', handleLogout);
    return () => {
      window.removeEventListener('lena-rewards-change', syncRewards);
      window.removeEventListener('lena-profile-change', syncProfile);
      window.removeEventListener('lena-profile-logout', handleLogout);
    };
  }, [navigate]);

  useEffect(() => {
    document.documentElement.dataset.effect = rewardState.equippedEffectId || 'effect-rainbow';
  }, [rewardState.equippedEffectId]);

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
            <span>{rewardState.balance}</span>
            <small>{t('crystals')}</small>
          </button>

          <button
            type="button"
            className="profile-inline"
            onClick={() => navigate('/settings')}
            title={profile.name || t('defaultChildName')}
          >
            <span className="profile-inline__avatar">{getInitial(profile.name, t('defaultChildName'))}</span>
            <span className="profile-inline__name">{profile.name || t('defaultChildName')}</span>
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
