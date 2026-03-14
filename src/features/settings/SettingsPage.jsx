import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getProfile, logoutProfile, saveProfile } from '../../services/storage/profileStore.js';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
  const { setThemeId } = useTheme();
  const [profile, setProfile] = useState(() => getProfile());
  const [draftName, setDraftName] = useState(() => getProfile().name || '');
  const [rewardState, setRewardState] = useState(() => getRewardState());

  useEffect(() => {
    function sync() {
      setProfile(getProfile());
      setRewardState(getRewardState());
    }
    window.addEventListener('lena-profile-change', sync);
    window.addEventListener('lena-rewards-change', sync);
    return () => {
      window.removeEventListener('lena-profile-change', sync);
      window.removeEventListener('lena-rewards-change', sync);
    };
  }, []);

  function handleSaveProfile() {
    setProfile(saveProfile({ name: draftName.trim() || t('defaultChildName') }));
  }

  function handleThemeChange(themeId) {
    setThemeId(themeId);
    setProfile(saveProfile({ themeId }));
  }

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('settingsLabel') || 'Settings'}</span>
            <h2>{profile.name || t('defaultChildName')}</h2>
          </div>
          <span className="pill">{rewardState.balance} {t('crystals')}</span>
        </div>

        <div className="settings-grid">
          <div className="form-field">
            <label htmlFor="settings-name">{t('onboardingChildName')}</label>
            <input
              id="settings-name"
              type="text"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <button type="button" className="primary-action" onClick={handleSaveProfile}>
              <span className="button-icon" aria-hidden="true">💾</span>
              <span>Save</span>
            </button>
          </div>

          <div className="form-field">
            <label htmlFor="settings-language">{t('uiLanguage')}</label>
            <select
              id="settings-language"
              value={locale}
              onChange={(event) => {
                setLocale(event.target.value);
                setProfile(saveProfile({ language: event.target.value }));
              }}
            >
              <option value="fr">FR</option>
              <option value="nl">NL</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="settings-theme">{t('theme')}</label>
            <select
              id="settings-theme"
              value={profile.themeId || 'theme-candy'}
              onChange={(event) => handleThemeChange(event.target.value)}
            >
              <option value="theme-candy">Candy</option>
              <option value="theme-ocean">Ocean</option>
              <option value="theme-sunset">Sunset</option>
            </select>
          </div>
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('historyTitle')}</span>
            <h3>{t('globalProgressLabel')}</h3>
          </div>
        </div>
        <div className="mini-metrics">
          <div><span>{t('studyTimeLabel') || 'Study'}</span><strong>{profile.totalStudyMinutes || 0}</strong></div>
          <div><span>{t('completed')}</span><strong>{profile.totalActivitiesCompleted || 0}</strong></div>
          <div><span>{t('streakLabel')}</span><strong>{profile.streakCurrent || 0}</strong></div>
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="dashboard-actions">
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              logoutProfile();
              navigate('/onboarding', { replace: true });
            }}
          >
            <span className="button-icon" aria-hidden="true">↩</span>
            <span>{t('logoutLabel') || 'Logout'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
