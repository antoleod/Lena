import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { getProfile, saveProfile } from '../../services/storage/profileStore.js';
import { assetUrl } from '../assets/assetUrl.js';
import {
  getRewardState,
  getRewardCatalog,
  equipTheme,
  equipEffect,
  equipWallpaper,
  equipPet,
  equipMascotColor,
  getMascotColors,
  isFreeMascotColor
} from '../../services/storage/rewardStore.js';

const DRAWER_LABELS = {
  fr: {
    title: 'Personnalise ton monde !',
    close: 'Fermer',
    name: '📝 Ton prénom',
    sound: '🔊 Effets sonores',
    soundToggle: 'Sons interactifs',
    themes: '🌈 Palette de couleurs',
    effects: '❄️ Effets météo',
    pets: '🐾 Mascottes',
    mascotColors: '🎨 Couleur de ta mascotte',
    moreInShop: '✨ Plus de couleurs dans la boutique',
    wallpapers: '🖼️ Fonds d\'écran',
  },
  nl: {
    title: 'Pas jouw wereld aan!',
    close: 'Sluiten',
    name: '📝 Jouw naam',
    sound: '🔊 Geluidseffecten',
    soundToggle: 'Interactieve geluiden',
    themes: '🌈 Kleurenpalet',
    effects: '❄️ Weereffecten',
    pets: '🐾 Huisdieren',
    mascotColors: '🎨 Kleur van je mascotte',
    moreInShop: '✨ Meer kleuren in de winkel',
    wallpapers: '🖼️ Achtergronden',
  },
  es: {
    title: '¡Personaliza tu mundo!',
    close: 'Cerrar',
    name: '📝 Tu nombre',
    sound: '🔊 Efectos de sonido',
    soundToggle: 'Sonidos interactivos',
    themes: '🌈 Paleta de colores',
    effects: '❄️ Efectos del clima',
    pets: '🐾 Mascotas',
    mascotColors: '🎨 Color de tu mascota',
    moreInShop: '✨ Más colores en la tienda',
    wallpapers: '🖼️ Fondos de pantalla',
  },
  en: {
    title: 'Personalise your world!',
    close: 'Close',
    name: '📝 Your name',
    sound: '🔊 Sound effects',
    soundToggle: 'Interactive sounds',
    themes: '🌈 Colour palette',
    effects: '❄️ Weather effects',
    pets: '🐾 Pets',
    mascotColors: '🎨 Your mascot colour',
    moreInShop: '✨ More colours in the shop',
    wallpapers: '🖼️ Wallpapers',
  },
};

export default function CustomizerDrawer({ isOpen, onClose }) {
  const { t, locale } = useLocale();
  const lbl = DRAWER_LABELS[locale] || DRAWER_LABELS.fr;
  const { themeId: activeThemeId, setThemeId } = useTheme();
  const [profile, setProfile] = useState(() => getProfile());
  const [rewards, setRewards] = useState(() => getRewardState());
  const [draftName, setDraftName] = useState(() => getProfile().name || '');

  const FREE_THEMES = ['theme-candy', 'theme-minimal'];
  const catalog = getRewardCatalog();
  const themeOptions = catalog.filter((item) => item.type === 'theme');
  const wallpaperOptions = catalog.filter((item) => item.type === 'wallpaper');
  const effectOptions = catalog.filter((item) => item.type === 'effect');
  const petOptions = catalog.filter((item) => item.type === 'pet');

  useEffect(() => {
    function sync() {
      setProfile(getProfile());
      setRewards(getRewardState());
    }
    window.addEventListener('lena-profile-change', sync);
    window.addEventListener('lena-rewards-change', sync);
    return () => {
      window.removeEventListener('lena-profile-change', sync);
      window.removeEventListener('lena-rewards-change', sync);
    };
  }, []);

  function handleNameSave() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== profile.name) {
      saveProfile({ name: trimmed });
    }
  }

  function handleThemeClick(themeOption) {
    if (FREE_THEMES.includes(themeOption.id) || rewards.inventory.includes(themeOption.id)) {
      setThemeId(themeOption.id);
      saveProfile({ themeId: themeOption.id });
    }
  }

  function handleWallpaperClick(wallpaperId) {
    if (wallpaperId === 'wallpaper-dreamy-sky' || rewards.inventory.includes(wallpaperId)) {
      equipWallpaper(wallpaperId);
    }
  }

  function handleEffectClick(effectId) {
    if (effectId === 'effect-rainbow' || rewards.inventory.includes(effectId)) {
      equipEffect(effectId);
    }
  }

  function handlePetClick(petId) {
    if (rewards.inventory.includes(petId)) {
      equipPet(petId);
    }
  }

  function handleColorClick(colorId) {
    if (isFreeMascotColor(colorId) || rewards.inventory.includes(colorId)) {
      equipMascotColor(colorId);
    }
  }
  const isColorOwned = (id) => isFreeMascotColor(id) || rewards.inventory.includes(id);
  const mascotColorOptions = getMascotColors();
  const equippedColorId = rewards.equippedMascotColorId || 'mascot-pink';

  function handleSoundToggle(e) {
    const nextSettings = {
      ...(profile.settings || {}),
      soundEnabled: e.target.checked
    };
    saveProfile({ settings: nextSettings });
  }

  const isThemeOwned = (id) => FREE_THEMES.includes(id) || rewards.inventory.includes(id);
  const isWallpaperOwned = (id) => id === 'wallpaper-dreamy-sky' || rewards.inventory.includes(id);
  const isEffectOwned = (id) => id === 'effect-rainbow' || rewards.inventory.includes(id);
  const isPetOwned = (id) => rewards.inventory.includes(id);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="customizer-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <div className="drawer-header__title">
            <span className="eyebrow">LENA 🎨 Customizer</span>
            <h2>{lbl.title}</h2>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label={lbl.close}>
            ✕
          </button>
        </header>

        <div className="drawer-content">
          {/* Quick profile name edit */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.name}</h3>
            <div className="drawer-name-field">
              <input
                type="text"
                maxLength={18}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={handleNameSave}
                placeholder={t('onboardingChildNamePlaceholder')}
              />
              <button type="button" className="primary-action" onClick={handleNameSave}>
                OK
              </button>
            </div>
          </section>

          {/* Sound settings */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.sound}</h3>
            <div className="drawer-switch-row">
              <span>{lbl.soundToggle}</span>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={profile.settings?.soundEnabled !== false}
                  onChange={handleSoundToggle}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </section>

          {/* Theme/Color palettes */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.themes}</h3>
            <div className="drawer-options-grid drawer-options-grid--themes">
              {themeOptions.map((theme) => {
                const owned = isThemeOwned(theme.id);
                const active = activeThemeId === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`drawer-theme-btn ${active ? 'is-active' : ''} ${!owned ? 'is-locked' : ''}`}
                    onClick={() => handleThemeClick(theme)}
                    aria-label={theme.name}
                    aria-pressed={active}
                  >
                    <div className="drawer-theme-header">
                      <span className="drawer-theme-icon">{theme.icon}</span>
                      {active && <span className="drawer-theme-check">✓</span>}
                      {!owned && <span className="drawer-theme-price">🔒{theme.price}💎</span>}
                    </div>
                    <div className="drawer-theme-colors">
                      {theme.preview.map((color, i) => (
                        <span key={i} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="drawer-theme-name">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Mascot colour */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.mascotColors}</h3>
            <div className="drawer-color-grid">
              {mascotColorOptions.map((color) => {
                const owned = isColorOwned(color.id);
                const active = equippedColorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    className={`drawer-color-btn ${active ? 'is-active' : ''} ${!owned ? 'is-locked' : ''}`}
                    onClick={() => handleColorClick(color.id)}
                    aria-label={color.name}
                    aria-pressed={active}
                    title={color.name}
                  >
                    <span
                      className="drawer-color-swatch"
                      style={{ '--swatch': color.preview[0], filter: `hue-rotate(${color.hue}deg)` }}
                    >
                      <img src={assetUrl('assets/characters/mascot-happy.svg')} alt="" draggable="false" />
                    </span>
                    <span className="drawer-color-name">{color.name}</span>
                    {active && <span className="drawer-color-check">✓</span>}
                    {!owned && <span className="drawer-color-lock">🔒 {color.price}💎</span>}
                  </button>
                );
              })}
            </div>
            <p className="drawer-color-hint">{lbl.moreInShop}</p>
          </section>

          {/* Weather Effects */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.effects}</h3>
            <div className="drawer-options-grid">
              {effectOptions.map((effect) => {
                const owned = isEffectOwned(effect.id);
                const active = rewards.equippedEffectId === effect.id;

                return (
                  <button
                    key={effect.id}
                    type="button"
                    className={`drawer-rect-btn ${active ? 'is-active' : ''} ${!owned ? 'is-locked' : ''}`}
                    onClick={() => handleEffectClick(effect.id)}
                  >
                    <span className="drawer-rect-icon">{effect.icon}</span>
                    <span className="drawer-rect-label">{effect.name}</span>
                    {!owned && (
                      <span className="drawer-item-lock">🔒 {effect.price}💎</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Mascots / Pets */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.pets}</h3>
            <div className="drawer-options-grid">
              {petOptions.map((pet) => {
                const owned = isPetOwned(pet.id);
                const active = rewards.equippedPetId === pet.id;

                return (
                  <button
                    key={pet.id}
                    type="button"
                    className={`drawer-rect-btn ${active ? 'is-active' : ''} ${!owned ? 'is-locked' : ''}`}
                    onClick={() => handlePetClick(pet.id)}
                  >
                    <span className="drawer-rect-icon">{pet.icon}</span>
                    <span className="drawer-rect-label">{pet.name}</span>
                    {!owned && (
                      <span className="drawer-item-lock">🔒 {pet.price}💎</span>
                    )}
                    {owned && active && (
                      <span className="drawer-item-lock" style={{ color: 'var(--primary)' }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Wallpapers */}
          <section className="drawer-section">
            <h3 className="drawer-section__title">{lbl.wallpapers}</h3>
            <div className="drawer-options-grid">
              {wallpaperOptions.map((wall) => {
                const owned = isWallpaperOwned(wall.id);
                const active = rewards.equippedWallpaperId === wall.id;

                return (
                  <button
                    key={wall.id}
                    type="button"
                    className={`drawer-rect-btn ${active ? 'is-active' : ''} ${!owned ? 'is-locked' : ''}`}
                    onClick={() => handleWallpaperClick(wall.id)}
                  >
                    <span className="drawer-rect-icon">{wall.icon}</span>
                    <span className="drawer-rect-label">{wall.name}</span>
                    {!owned && (
                      <span className="drawer-item-lock">🔒 {wall.price}💎</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
