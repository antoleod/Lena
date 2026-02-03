import { useEffect, useRef } from 'react';


const BASE_URL = import.meta.env.BASE_URL;
const HEAD_LINKS = [
  `${BASE_URL}css/style.css`,
  `${BASE_URL}css/login.css`,
  `${BASE_URL}css/feedback-system.css`
];

const SCRIPT_SOURCES = [
  `${BASE_URL}js/feedbackSystem.js`,
  `${BASE_URL}js/avatarData.js`,
  `${BASE_URL}js/storage.js`,
  `${BASE_URL}js/i18n.js`,
  `${BASE_URL}js/appData.js`,
  `${BASE_URL}js/login.js`
];

function useHeadLinks() {
  useEffect(() => {
    const added = [];
    HEAD_LINKS.forEach((href) => {
      const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .find((link) => link.href.endsWith(href));
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => link.remove());
    };
  }, []);
}

function ensureScript(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((script) => script.src.endsWith(src));
    if (existing) {
      resolve(existing);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`)
      .then((registration) => {
        if (registration.waiting) {
          notifyUpdate(registration);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                notifyUpdate(registration);
              }
            }
          });
        });

        function notifyUpdate(reg) {
          const updateBannerId = 'sw-update-banner';
          if (document.getElementById(updateBannerId)) return;

          const banner = document.createElement('div');
          banner.id = updateBannerId;
          banner.style.position = 'fixed';
          banner.style.left = '0';
          banner.style.right = '0';
          banner.style.bottom = '0';
          banner.style.background = '#fff8e1';
          banner.style.borderTop = '1px solid #ffd54f';
          banner.style.padding = '12px';
          banner.style.display = 'flex';
          banner.style.justifyContent = 'space-between';
          banner.style.alignItems = 'center';
          banner.style.zIndex = '9999';

          const text = document.createElement('div');
          text.textContent = 'Une nouvelle version est disponible.';
          const btn = document.createElement('button');
          btn.textContent = 'Mettre à jour';
          btn.style.marginLeft = '12px';
          btn.className = 'btn';

          btn.addEventListener('click', () => {
            if (!reg.waiting) return;
            reg.waiting.postMessage('skipWaiting');
          });

          banner.appendChild(text);
          banner.appendChild(btn);
          document.body.appendChild(banner);
        }

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

export default function LoginPage() {
  useHeadLinks();
  const mountedRef = useRef(false);

  useEffect(() => {
    document.title = 'Appli de Lena - Bienvenue !';
    document.documentElement.lang = 'fr';
    document.body.classList.add('login-body');
    registerServiceWorker();

    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  useEffect(() => {
    let active = true;
    const addedScripts = [];

    async function init() {
      try {
        for (const src of SCRIPT_SOURCES) {
          const script = await ensureScript(src);
          addedScripts.push(script);
        }
        if (!active) return;
        if (document.readyState !== 'loading') {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
          window.dispatchEvent(new Event('load'));
        }
      } catch (error) {
        console.warn('[login] Failed to load legacy scripts', error);
      }
    }

    if (!mountedRef.current) {
      mountedRef.current = true;
      init();
    }

    return () => {
      active = false;
      addedScripts.forEach((script) => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div>
      <div className="login-orb login-orb--pink"></div>
      <div className="login-orb login-orb--mint"></div>
      <div className="login-orb login-orb--lavender"></div>

      <div id="login-container" role="main">
        <div className="login-header">
          <div className="login-header__card">
            <span className="login-badge" data-i18n="loginBadge">✨ Choisis ton avatar ✨</span>
            <div className="login-settings">
              <div className="login-lang">
                <label className="login-lang__label" htmlFor="languageSelect" data-i18n="languageLabel">Langue</label>
                <select id="languageSelect" className="login-lang__select" data-language-select data-i18n-aria="languageSelectAria"></select>
              </div>
              <div className="login-calm">
                <button id="calmToggle" className="login-calm__toggle" type="button" role="switch" aria-checked="false" data-i18n-aria="calmToggleAria">
                  <span className="login-calm__label" data-i18n="calmModeLabel">Mode Calme</span>
                  <span className="login-calm__status" data-calm-status>Off</span>
                </button>
                <span className="login-calm__desc" data-i18n="calmModeDescription">Moins d'animations et de sons.</span>
              </div>
            </div>
            <div className="login-headline">
              <h1 className="login-title" data-i18n="loginTitle">Bienvenue dans ton aventure magique</h1>
              <p className="login-steps" data-i18n="loginSteps">Sélectionne un avatar, choisis ta couleur préférée et écris ton prénom.</p>
            </div>
          </div>

          <div className="selection-preview" aria-live="polite">
            <div className="selection-preview__avatar" aria-hidden="true">
              <img id="selected-avatar-preview" src="" alt="" />
              <span id="selected-avatar-placeholder" className="selection-preview__placeholder">✨</span>
            </div>
            <div className="selection-preview__details">
              <span className="selection-preview__label" data-i18n="selectedAvatarLabel">Avatar choisi</span>
              <span className="selection-preview__value" id="selected-avatar-name" data-i18n="selectedAvatarPlaceholder">Choisis ton avatar</span>
            </div>
            <div className="selection-preview__details">
              <span className="selection-preview__label" data-i18n="selectedNameLabel">Ton prénom</span>
              <span className="selection-preview__value" id="selected-player-name" data-i18n="selectedNamePlaceholder">Écris ton prénom</span>
            </div>
          </div>
        </div>

        <section className="login-section" aria-labelledby="avatar-section-title">
          <header className="section-header">
            <h2 id="avatar-section-title" data-i18n="avatarSectionTitle">Avatars délicieux</h2>
          </header>
          <div id="avatar-selection" role="listbox" aria-label="Choisis ton avatar préféré" data-i18n-aria="avatarListLabel">
            <button className="avatar-option" type="button" data-avatar-id="licorne" data-avatar-name="Licorne Arc-en-ciel" data-avatar-name-key="avatarUnicorn" data-avatar-icon={`${BASE_URL}assets/avatars/licorne.svg`} aria-label="Licorne" data-i18n-aria="avatarUnicorn">
              <span className="avatar-emoji">🦄</span>
              <span className="avatar-label" data-i18n="avatarUnicorn">Licorne</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="renard" data-avatar-name="Renard malicieux" data-avatar-name-key="avatarFox" data-avatar-icon={`${BASE_URL}assets/avatars/renard.svg`} aria-label="Renard" data-i18n-aria="avatarFox">
              <span className="avatar-emoji">🦊</span>
              <span className="avatar-label" data-i18n="avatarFox">Renard</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="panda" data-avatar-name="Panda câlin" data-avatar-name-key="avatarPanda" data-avatar-icon={`${BASE_URL}assets/avatars/panda.svg`} aria-label="Panda" data-i18n-aria="avatarPanda">
              <span className="avatar-emoji">🐼</span>
              <span className="avatar-label" data-i18n="avatarPanda">Panda</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="hibou" data-avatar-name="Hibou sage" data-avatar-name-key="avatarOwl" data-avatar-icon={`${BASE_URL}assets/avatars/hibou.svg`} aria-label="Hibou" data-i18n-aria="avatarOwl">
              <span className="avatar-emoji">🦉</span>
              <span className="avatar-label" data-i18n="avatarOwl">Hibou</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="fraise" data-avatar-name="Fraise pétillante" data-avatar-name-key="avatarStrawberry" data-avatar-icon={`${BASE_URL}assets/avatars/fraise.svg`} aria-label="Fraise" data-i18n-aria="avatarStrawberry">
              <span className="avatar-emoji">🍓</span>
              <span className="avatar-label" data-i18n="avatarStrawberry">Fraise</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="pomme" data-avatar-name="Pomme brillante" data-avatar-name-key="avatarApple" data-avatar-icon={`${BASE_URL}assets/avatars/pomme.svg`} aria-label="Pomme" data-i18n-aria="avatarApple">
              <span className="avatar-emoji">🍎</span>
              <span className="avatar-label" data-i18n="avatarApple">Pomme</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="banane" data-avatar-name="Banane rigolote" data-avatar-name-key="avatarBanana" data-avatar-icon={`${BASE_URL}assets/avatars/banane.svg`} aria-label="Banane" data-i18n-aria="avatarBanana">
              <span className="avatar-emoji">🍌</span>
              <span className="avatar-label" data-i18n="avatarBanana">Banane</span>
            </button>
            <button className="avatar-option" type="button" data-avatar-id="ananas" data-avatar-name="Ananas disco" data-avatar-name-key="avatarPineapple" data-avatar-icon={`${BASE_URL}assets/avatars/ananas.svg`} aria-label="Ananas" data-i18n-aria="avatarPineapple">
              <span className="avatar-emoji">🍍</span>
              <span className="avatar-label" data-i18n="avatarPineapple">Ananas</span>
            </button>
          </div>
        </section>

        <section className="login-section" aria-labelledby="color-section-title">
          <header className="section-header">
            <h2 id="color-section-title" data-i18n="colorSectionTitle">Choisis ta couleur préférée</h2>
          </header>
          <div id="color-selection" role="radiogroup" aria-label="Choisis ta couleur préférée" data-i18n-aria="colorListLabel">
            <button className="color-option" type="button" style={{ '--color-base': '#ffadad' }} data-color="#ffadad" data-tooltip="🌸 Rose pastel" data-i18n-tooltip="colorRoseTooltip" aria-label="Rose pastel" data-i18n-aria="colorRoseLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#ffd6a5' }} data-color="#ffd6a5" data-tooltip="🍑 Abricot doux" data-i18n-tooltip="colorApricotTooltip" aria-label="Abricot doux" data-i18n-aria="colorApricotLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#fdffb6' }} data-color="#fdffb6" data-tooltip="🍋 Citron léger" data-i18n-tooltip="colorLemonTooltip" aria-label="Citron léger" data-i18n-aria="colorLemonLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#caffbf' }} data-color="#caffbf" data-tooltip="🌿 Menthe fraîche" data-i18n-tooltip="colorMintTooltip" aria-label="Menthe fraîche" data-i18n-aria="colorMintLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#9bf6ff' }} data-color="#9bf6ff" data-tooltip="🌊 Océan clair" data-i18n-tooltip="colorOceanTooltip" aria-label="Océan clair" data-i18n-aria="colorOceanLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#a0c4ff' }} data-color="#a0c4ff" data-tooltip="☁️ Ciel calme" data-i18n-tooltip="colorSkyTooltip" aria-label="Ciel calme" data-i18n-aria="colorSkyLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#bdb2ff' }} data-color="#bdb2ff" data-tooltip="💜 Lavande" data-i18n-tooltip="colorLavenderTooltip" aria-label="Lavande" data-i18n-aria="colorLavenderLabel"></button>
            <button className="color-option" type="button" style={{ '--color-base': '#ffc6ff' }} data-color="#ffc6ff" data-tooltip="🍓 Framboise légère" data-i18n-tooltip="colorRaspberryTooltip" aria-label="Framboise légère" data-i18n-aria="colorRaspberryLabel"></button>
            <button className="color-option color-option-white" type="button" style={{ '--color-base': '#ffffff' }} data-color="#ffffff" data-tooltip="✨ Blanc magique" data-i18n-tooltip="colorWhiteTooltip" aria-label="Blanc magique" data-i18n-aria="colorWhiteLabel"></button>
          </div>
        </section>

        <div className="login-actions">
          <button id="login-btn" className="btn" type="button">
            <span className="rocket-icon" aria-hidden="true">🚀</span>
            <span className="btn-label" data-i18n="loginPlayButton">Jouer</span>
          </button>
          <button id="parent-access" className="parent-access" type="button" aria-label="Accès parents" data-i18n-aria="loginParentAccess" data-i18n-title="loginParentHold">
            <span aria-hidden="true">🛡️</span>
            <span className="parent-access__label" data-i18n="loginParentAccess">Accès parents</span>
            <span className="parent-access__hint" data-i18n="loginParentHold">Maintiens 2 secondes</span>
          </button>
        </div>

        <div id="parent-panel" className="parent-panel" hidden>
          <div className="parent-panel__card" role="dialog" aria-modal="true" aria-labelledby="parent-panel-title">
            <header className="parent-panel__header">
              <h2 id="parent-panel-title" data-i18n="parentPanelTitle">Espace parents</h2>
              <button id="parent-panel-close" type="button" className="parent-panel__close" data-i18n="parentPanelClose">Fermer</button>
            </header>
            <div className="parent-panel__content">
              <button id="parent-reset" type="button" className="parent-panel__action" data-i18n="parentResetLabel">Réinitialiser les données</button>
            </div>
          </div>
        </div>

        <p id="login-error" className="login-error" role="alert" aria-live="assertive" hidden></p>
      </div>

      <div className="login-wand" aria-hidden="true">🪄</div>
      <div className="login-fireflies" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>
  );
}
