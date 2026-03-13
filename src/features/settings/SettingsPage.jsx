import { useEffect, useState } from 'react';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getProfile, saveProfile } from '../../services/storage/profileStore.js';
import { equipEffect, equipWallpaper, getRewardCatalog, getRewardState } from '../../services/storage/rewardStore.js';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function SettingsPage() {
  const { locale, setLocale, t } = useLocale();
  const { setThemeId } = useTheme();
  const [profile, setProfile] = useState(() => getProfile());
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const [draftName, setDraftName] = useState(() => getProfile().name || '');
  const avatarItems = getRewardCatalog().filter((item) => item.type === 'avatar');
  const themeItems = getRewardCatalog().filter((item) => item.type === 'theme');
  const effectItems = getRewardCatalog().filter((item) => item.type === 'effect');
  const wallpaperItems = getRewardCatalog().filter((item) => item.type === 'wallpaper');

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

  function saveName() {
    const next = saveProfile({ name: draftName.trim() || t('defaultChildName') });
    setProfile(next);
  }

  function chooseAvatar(avatarId) {
    const owned = avatarId === 'avatar-unicorn' || rewardState.inventory.includes(avatarId);
    if (!owned) return;
    setProfile(saveProfile({ avatarId }));
  }

  function chooseTheme(themeId) {
    setThemeId(themeId);
    setProfile(saveProfile({ themeId }));
  }

  function chooseEffect(effectId) {
    equipEffect(effectId);
    setRewardState(getRewardState());
  }

  function chooseWallpaper(wallpaperId) {
    equipWallpaper(wallpaperId);
    setRewardState(getRewardState());
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
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveName();
                }
              }}
            />
            <button type="button" className="primary-action" onClick={saveName}>Save</button>
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
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Effects</span>
            <h3>Background effects</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {effectItems.map((item) => {
            const owned = item.id === 'effect-rainbow' || rewardState.inventory.includes(item.id);
            const active = rewardState.equippedEffectId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`reward-card reward-card--effect${active ? ' is-active' : ''}`}
                onClick={() => owned && chooseEffect(item.id)}
              >
                <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`}></div>
                <div className="reward-card__body">
                  <h4>{locale === 'nl' ? item.nameNl || item.name : item.name}</h4>
                  <p>{owned ? 'Use' : `${item.price} ${t('crystals')}`}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Wallpapers</span>
            <h3>Backgrounds</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {wallpaperItems.map((item) => {
            const owned = item.id === 'wallpaper-dreamy-sky' || rewardState.inventory.includes(item.id);
            const active = rewardState.equippedWallpaperId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`reward-card reward-card--theme${active ? ' is-active' : ''}`}
                onClick={() => owned && chooseWallpaper(item.id)}
              >
                <div className="theme-preview theme-preview--wallpaper">
                  <span className="theme-preview__icon">{item.icon}</span>
                  {item.preview.map((color) => (
                    <span key={color} style={{ backgroundColor: color }}></span>
                  ))}
                </div>
                <div className="reward-card__body">
                  <h4>{locale === 'nl' ? item.nameNl || item.name : item.name}</h4>
                  <p>{owned ? (t('shopEquip') || 'Use') : `${item.price} ${t('crystals')}`}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Avatar</span>
            <h3>{t('shopChooseReward')}</h3>
          </div>
        </div>
        <div className="avatar-grid">
          {avatarItems.map((item) => {
            const owned = item.id === 'avatar-unicorn' || rewardState.inventory.includes(item.id);
            const active = profile.avatarId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`avatar-option${active ? ' is-active' : ''}${owned ? '' : ' is-locked'}`}
                onClick={() => chooseAvatar(item.id)}
              >
                <img src={assetUrl(item.assetPath)} alt="" />
                <span>{locale === 'nl' ? item.nameNl || item.name : item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('theme')}</span>
            <h3>{t('shopThemes')}</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {themeItems.map((item) => {
            const owned = item.id === 'theme-candy' || rewardState.inventory.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`reward-card reward-card--theme${profile.themeId === item.id ? ' is-active' : ''}`}
                onClick={() => owned && chooseTheme(item.id)}
              >
                <div className="theme-preview">
                  <span className="theme-preview__icon">{item.icon}</span>
                  {item.preview.map((color) => (
                    <span key={color} style={{ backgroundColor: color }}></span>
                  ))}
                </div>
                <div className="reward-card__body">
                  <h4>{locale === 'nl' ? item.nameNl || item.name : item.name}</h4>
                  <p>{owned ? (t('shopEquip') || 'Use') : `${item.price} ${t('crystals')}`}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
