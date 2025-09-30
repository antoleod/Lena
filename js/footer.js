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
    const inHtmlDir = /\/html\//.test(window.location.pathname);
    const basePath = inHtmlDir ? target : `html/${target}`;
    if (window.location.pathname.endsWith(`/${target}`)) { return; }
    window.location.href = basePath;
  }

  function createFooterButton({ id, icon, label, handler, isCurrent = false }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'footer-btn';
    btn.id = id;
    if (isCurrent) {
      btn.setAttribute('aria-current', 'page');
    }
    const iconSpan = document.createElement('span');
    iconSpan.className = 'footer-btn__icon';
    iconSpan.textContent = icon;
    btn.appendChild(iconSpan);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'footer-btn__label';
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);

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
    const label = button.querySelector('.footer-btn__label');
    if (icon) {
      icon.textContent = muted ? AUDIO_ACTION.iconOff : AUDIO_ACTION.iconOn;
    }
    if (label) {
      label.textContent = muted ? AUDIO_ACTION.labelOff : AUDIO_ACTION.labelOn;
    }
  }

  function initFooter() {
    if (document.querySelector('[data-app-footer]')) {
      enhanceExistingFooter();
      return;
    }
    const footer = document.createElement('footer');
    footer.className = 'global-footer';
    footer.setAttribute('data-app-footer', '');
    mountFooterContent(footer);
    document.body.appendChild(footer);
  }

  function enhanceExistingFooter() {
    const footer = document.querySelector('[data-app-footer]');
    if (!footer) { return; }
    footer.classList.add('global-footer');
    footer.innerHTML = '';
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
