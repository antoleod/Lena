(function () {
  const ACTIONS = [
    {
      id: 'footer-menu',
      icon: '🏠',
      label: 'Menu principal',
      handler: () => navigateTo('juego.html'),
      match: /juego\.html$/
    },
    {
      id: 'footer-boutique',
      icon: '🛍️',
      label: 'Boutique',
      handler: () => navigateTo('boutique.html'),
      match: /boutique\.html$/
    },
    {
      id: 'footer-login',
      icon: '👤',
      label: 'Mon profil',
      handler: () => navigateTo('login.html'),
      match: /login\.html$/
    }
  ];

  const AUDIO_ACTION = {
    id: 'footer-audio',
    iconOn: '🔊',
    iconOff: '🔇',
    labelOn: 'Son actif',
    labelOff: 'Son coupé'
  };

  function navigateTo(target) {
    const path = window.location.pathname || '';
    const htmlIdx = path.indexOf('/html/');
    // If we are anywhere under /html/, build an absolute path rooted at /html/
    const href = htmlIdx >= 0
      ? path.slice(0, htmlIdx + '/html/'.length) + target
      : `html/${target}`; // otherwise navigate relative to root index
    if (path.endsWith(`/${target}`)) { return; }
    window.location.href = href;
  }

  function createFooterButton({ id, icon, label, handler, isCurrent = false }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'footer-btn';
    btn.id = id;
    btn.setAttribute('aria-label', label);
    if (isCurrent) {
      btn.setAttribute('aria-current', 'page');
    }
    const iconSpan = document.createElement('span');
    iconSpan.className = 'footer-btn__icon';
    iconSpan.textContent = icon;
    btn.appendChild(iconSpan);

    if (typeof handler === 'function') {
      btn.addEventListener('click', handler);
    }
    return btn;
  }

  function renderAudioButton(footerActions) {
    const btn = createFooterButton({
      id: AUDIO_ACTION.id,
      icon: AUDIO_ACTION.iconOn,
      label: AUDIO_ACTION.labelOn,
      handler: () => {
        if (!window.audioManager) { return; }
        window.audioManager.toggle();
        syncAudioButton(btn);
      }
    });
    syncAudioButton(btn);
    footerActions.appendChild(btn);
    if (window.audioManager) {
      window.audioManager.onChange(() => syncAudioButton(btn));
    }
  }

  function syncAudioButton(button) {
    if (!button) { return; }
    const muted = Boolean(window.audioManager?.isMuted);
    button.classList.toggle('is-audio-muted', muted);
    const icon = button.querySelector('.footer-btn__icon');
    const newLabel = muted ? AUDIO_ACTION.labelOff : AUDIO_ACTION.labelOn;
    
    if (icon) {
      icon.textContent = muted ? AUDIO_ACTION.iconOff : AUDIO_ACTION.iconOn;
    }
    button.setAttribute('aria-label', newLabel);
  }

  function initFooter() {
    const footer = document.querySelector('[data-app-footer]');
    if (!footer) {
      console.warn('Footer element with [data-app-footer] not found.');
      return;
    }
    footer.className = 'global-footer';
    footer.innerHTML = ''; // Clear any placeholder content
    mountFooterContent(footer);
  }

  function mountFooterContent(footer) {
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'footer-actions';
    footer.appendChild(actionsWrapper);

    const currentPath = window.location.pathname;

    ACTIONS.forEach(action => {
      const isCurrent = action.match?.test(currentPath) || false;
      const button = createFooterButton({
        id: action.id,
        icon: action.icon,
        label: action.label,
        handler: action.handler,
        isCurrent
      });
      actionsWrapper.appendChild(button);
    });

    renderAudioButton(actionsWrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('has-app-footer');
      initFooter();
    });
  } else {
    document.body.classList.add('has-app-footer');
    initFooter();
  }
})();
