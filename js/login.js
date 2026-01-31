console.log("login.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  const avatars = Array.from(document.querySelectorAll('.avatar-option'));
  const colors = Array.from(document.querySelectorAll('.color-option'));
  const nameInput = document.getElementById('name-input');
  const loginBtn = document.getElementById('login-btn');
  const nameWrapper = document.querySelector('.name-input-wrapper');
  const selectionPreview = document.querySelector('.selection-preview');
  const previewAvatarWrapper = document.querySelector('.selection-preview__avatar');
  const previewAvatarImg = document.getElementById('selected-avatar-preview');
  const previewAvatarName = document.getElementById('selected-avatar-name');
  const previewPlayerName = document.getElementById('selected-player-name');
  const errorEl = document.getElementById('login-error');
  const calmToggle = document.getElementById('calmToggle');
  const calmStatus = document.querySelector('[data-calm-status]');
  const parentAccess = document.getElementById('parent-access');
  const parentPanel = document.getElementById('parent-panel');
  const parentPanelCard = parentPanel?.querySelector('.parent-panel__card') || null;
  const parentPanelClose = document.getElementById('parent-panel-close');
  const parentReset = document.getElementById('parent-reset');

  const t = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);
  const appData = typeof window.loadAppData === 'function' ? window.loadAppData() : {};

  const defaultColor = colors[0]?.dataset.color || '#ffc6ff';

  // Intentar recuperar la selección anterior si existe
  const storedAvatarSelection = (typeof storage.loadSelectedAvatar === 'function')
    ? storage.loadSelectedAvatar()
    : null;
  const storedNameDraft = (typeof storage.loadNameDraft === 'function')
    ? storage.loadNameDraft()
    : '';

  let selectedAvatar = null;
  let selectedColor = defaultColor;
  let userChoseColor = false;
  let parentHoldTimer = null;

  if (nameInput && storedNameDraft) {
    nameInput.value = storedNameDraft;
  }

  updateSelectionPreview();
  syncCalmToggle(Boolean(appData?.calmMode));


  function renderOwnedCosmetics(profile) {
    const ownedAvatarsEl = document.getElementById('owned-avatars');
    const ownedBackgroundsEl = document.getElementById('owned-backgrounds');
    if (!ownedAvatarsEl || !ownedBackgroundsEl || !profile?.name) return;
    const progress = storage.loadUserProgress(profile.name);
    const items = Array.isArray(progress.ownedItems) ? progress.ownedItems : [];
    const activeBg = progress.activeCosmetics?.background || null;
    ownedAvatarsEl.innerHTML = '';
    ownedBackgroundsEl.innerHTML = '';
    items.forEach(item => {
      if (item.type === 'avatar') {
        const div = document.createElement('div'); div.className = 'owned-item';
        const img = document.createElement('img'); img.alt = item.name || t('avatarAlt', 'Avatar'); img.src = resolveAvatarIcon(item.iconUrl || '');
        const label = document.createElement('div'); label.className = 'owned-item__name'; label.textContent = item.name || item.id;
        const btn = document.createElement('button'); btn.className = 'owned-item__btn'; btn.type='button'; btn.textContent = t('ownedAvatarUse', 'Utiliser');
        if (profile.avatar?.id === item.id) { btn.disabled = true; }
        btn.addEventListener('click', () => {
          const newProfile = { ...profile, avatar: { id: item.id, name: item.name, iconUrl: item.iconUrl } };
          storage.saveUserProfile(newProfile);
          selectedAvatar = newProfile.avatar; updateSelectionPreview();
          renderOwnedCosmetics(newProfile);
        });
        div.append(img, label, btn); ownedAvatarsEl.appendChild(div);
      } else if (item.type === 'background' || item.type === 'theme') {
        const div = document.createElement('div'); div.className = 'owned-item';
        const img = document.createElement('img'); img.alt = item.name || t('backgroundAlt', 'Fond'); img.src = item.previewUrl || resolveAvatarIcon(profile.avatar?.iconUrl || '');
        const label = document.createElement('div'); label.className = 'owned-item__name'; label.textContent = item.name || item.id;
        const btn = document.createElement('button'); btn.className = 'owned-item__btn'; btn.type='button'; btn.textContent = t('ownedBackgroundSet', 'Définir');
        if (activeBg === item.id) { btn.disabled = true; }
        btn.addEventListener('click', () => {
          const prog = storage.loadUserProgress(profile.name);
          prog.activeCosmetics = { ...(prog.activeCosmetics || {}), background: item.id };
          storage.saveUserProgress(profile.name, prog);
          renderOwnedCosmetics(profile);
        });
        div.append(img, label, btn); ownedBackgroundsEl.appendChild(div);
      }
    });
  }

  function createAudio(src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
  }

  // Sonidos locales para clic y brillo (offline-friendly)
  const popSound = createAudio('../sonidos/bling.wav');
  const sparkleSound = createAudio('../sonidos/correct.wav');
  window.audioManager?.bind(popSound);
  window.audioManager?.bind(sparkleSound);
  popSound.volume = 0.4;
  sparkleSound.volume = 0.3;

  // Si ya existe perfil, redireccionar
  const menuPath = window.location.pathname.includes('/html/') ? 'juego.html' : 'html/juego.html';
  const existingProfile = storage.loadUserProfile();
  if (existingProfile?.name) {
    window.location.href = menuPath;
    return;
  }

  // Aplicar color por defecto al inicio
  applyAccentColor(defaultColor, { highlightSwatch: true });

  // Configurar avatars para selección
  avatars.forEach(avatar => {
    avatar.setAttribute('tabindex', '0');
    avatar.setAttribute('role', 'option');
    avatar.setAttribute('aria-selected', 'false');

    avatar.addEventListener('click', () => {
      selectAvatar(avatar, { animate: true });
      playSound(popSound);
    });
    avatar.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        avatar.click();
      }
    });
  });

  // Si la selección anterior existe, aplicarla
  if (storedAvatarSelection?.id) {
    const found = avatars.find(a => a.dataset.avatarId === storedAvatarSelection.id);
    if (found) {
      selectAvatar(found);
    }
  }

  // Si no hay avatar seleccionado, seleccionar el primero
  if (!selectedAvatar && avatars.length) {
    selectAvatar(avatars[0]);
  }

  // Configurar los botones de color
  colors.forEach(color => {
    color.setAttribute('tabindex', '0');
    color.setAttribute('role', 'radio');
    color.setAttribute('aria-checked', 'false');

    color.addEventListener('click', () => {
      userChoseColor = true;
      const chosen = color.dataset.color || defaultColor;
      highlightColorSwatch(chosen);
      applyAccentColor(chosen);
      playSound(popSound);

      color.classList.remove('pulse');
      void color.offsetWidth;
      color.classList.add('pulse');

      // Efecto de partículas al elegir color
      triggerSparklesOnElement(color, 12);
    });
    color.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        color.click();
      }
    });
  });

  // Clic al botón login
  loginBtn.addEventListener('click', () => {
    const fallbackName = t('fallbackName', 'Ami Magique');
    const name = nameInput.value.trim() || fallbackName;
    const isValidName = name.length >= 1 && name.length <= 12;
    if (!isValidName || !selectedAvatar) {
      if (errorEl) {
        errorEl.textContent = t('loginError', "Écris ton prénom et choisis un avatar ✨");
        errorEl.hidden = false;
      }
      if (nameWrapper) {
        nameWrapper.classList.add('shake');
        setTimeout(() => nameWrapper.classList.remove('shake'), 300);
      }
      return;
    }

    triggerButtonSparkle(loginBtn, 12);
    playSound(sparkleSound);

    if (errorEl) errorEl.hidden = true;

    const userProfile = {
      name,
      avatar: selectedAvatar,
      color: selectedColor || defaultColor,
      settings: {
        ...(appData?.settings || {}),
        calmMode: Boolean(appData?.calmMode)
      }
    };
    storage.saveUserProfile(userProfile);
    if (typeof window.saveAppData === 'function') {
      window.saveAppData({ calmMode: Boolean(appData?.calmMode) });
    }
    window.location.href = menuPath;
  });

  // Efecto visual al escribir el nombre
  nameInput.addEventListener('input', () => {
    if (typeof storage.saveNameDraft === 'function') {
      storage.saveNameDraft(nameInput.value);
    }
    updateSelectionPreview();
    if (errorEl) errorEl.hidden = true;
    if (!nameWrapper) return;
    nameWrapper.classList.add('typing');
    setTimeout(() => nameWrapper.classList.remove('typing'), 350);
  });
  nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginBtn.click();
    }
  });

  if (calmToggle) {
    calmToggle.addEventListener('click', () => {
      const next = calmToggle.getAttribute('aria-checked') !== 'true';
      syncCalmToggle(next);
      if (typeof window.saveAppData === 'function') {
        window.saveAppData({ calmMode: next });
      }
    });
  }

  if (parentAccess) {
    const clearHold = () => {
      parentAccess.classList.remove('is-holding');
      if (parentHoldTimer) {
        clearTimeout(parentHoldTimer);
        parentHoldTimer = null;
      }
    };

    const startHold = () => {
      clearHold();
      parentAccess.classList.add('is-holding');
      parentHoldTimer = setTimeout(() => {
        parentHoldTimer = null;
        openParentPanel();
      }, 2000);
    };

    parentAccess.addEventListener('pointerdown', startHold);
    parentAccess.addEventListener('pointerup', clearHold);
    parentAccess.addEventListener('pointerleave', clearHold);
    parentAccess.addEventListener('pointercancel', clearHold);
  }

  if (parentPanelClose) {
    parentPanelClose.addEventListener('click', closeParentPanel);
  }

  if (parentPanel) {
    parentPanel.addEventListener('click', (event) => {
      if (event.target === parentPanel) {
        closeParentPanel();
      }
    });
  }

  if (parentPanelCard) {
    parentPanelCard.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  if (parentReset) {
    parentReset.addEventListener('click', () => {
      if (typeof window.resetAppData === 'function') {
        const didReset = window.resetAppData();
        if (didReset) {
          closeParentPanel();
          window.location.reload();
        }
      }
    });
  }

  /** Funciones auxiliares abajo **/

  function playSound(audio) {
    if (!audio) return;
    if (window.audioManager?.isMuted) {
      return;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function animateAvatar(avatar) {
    avatar.classList.remove('pulse');
    void avatar.offsetWidth;  // reiniciar animación
    avatar.classList.add('pulse');
  }

  function extractAvatarData(el) {
    if (!el) return null;
    const avatarId = el.dataset.avatarId;
    const libEntry = (window.AVATAR_LIBRARY || {})[avatarId] || {};
    const nameKey = el.dataset.avatarNameKey;
    const fallbackName = el.dataset.avatarName || libEntry.name || el.title || 'Avatar';
    const resolvedName = nameKey ? t(nameKey, fallbackName) : fallbackName;
    return {
      id: avatarId || libEntry.id,
      name: resolvedName,
      iconUrl: el.dataset.avatarIcon || libEntry.iconUrl || '',
      defaultPalette: libEntry.defaultPalette || null
    };
  }

  function selectAvatar(avatarEl, { animate = false } = {}) {
    if (!avatarEl) return;

    // Remover selección anterior
    avatars.forEach(a => {
      a.classList.remove('selected');
      a.setAttribute('aria-selected', 'false');
    });

    avatarEl.classList.add('selected');
    avatarEl.setAttribute('aria-selected', 'true');

    const data = extractAvatarData(avatarEl);
    if (!data) return;

    selectedAvatar = { id: data.id, name: data.name, iconUrl: data.iconUrl };
    if (typeof storage.saveSelectedAvatar === 'function') {
      storage.saveSelectedAvatar(selectedAvatar);
    } else {
      try {
        localStorage.setItem('mathsLenaSelectedAvatar', JSON.stringify(selectedAvatar));
      } catch (e) {
        console.error('Error saving avatar locally', e);
      }
    }

    // Aplicar color del avatar si el usuario no eligió otro
    const accent = avatarEl.dataset.avatarColor || data.defaultPalette?.primary;
    if (accent && !userChoseColor) {
      applyAccentColor(accent, { highlightSwatch: true });
    }

    if (animate) {
      animateAvatar(avatarEl);
      // partículas al seleccionar avatar
      createParticleTrail(avatarEl);
    }

    updateSelectionPreview();
  }

  function updateSelectionPreview() {
    if (previewAvatarName) {
      const avatarLabel = selectedAvatar?.name || t('selectedAvatarPlaceholder', 'Choisis ton avatar');
      previewAvatarName.textContent = avatarLabel;
    }

    if (previewAvatarImg && previewAvatarWrapper) {
      const iconUrl = resolveAvatarIcon(selectedAvatar?.iconUrl);
      if (iconUrl) {
        previewAvatarImg.src = iconUrl;
        previewAvatarImg.alt = selectedAvatar?.name || t('selectedAvatarLabel', 'Avatar choisi');
        previewAvatarWrapper.classList.add('is-active');
      } else {
        previewAvatarImg.removeAttribute('src');
        previewAvatarImg.alt = '';
        previewAvatarWrapper.classList.remove('is-active');
      }
    }

    if (previewPlayerName) {
      const trimmed = (nameInput?.value || '').trim();
      previewPlayerName.textContent = trimmed || t('selectedNamePlaceholder', 'Écris ton prénom');
    }
  }

  document.addEventListener('lena:language:change', () => {
    if (selectedAvatar?.id) {
      const avatarEl = avatars.find(a => a.dataset.avatarId === selectedAvatar.id);
      if (avatarEl) {
        const data = extractAvatarData(avatarEl);
        selectedAvatar = { ...selectedAvatar, name: data.name, iconUrl: data.iconUrl };
      }
    }
    updateSelectionPreview();
  });

  function resolveAvatarIcon(iconUrl = '') {
    if (!iconUrl || typeof iconUrl !== 'string') {
      return '';
    }
    if (/^(data:|https?:|blob:)/.test(iconUrl)) {
      return iconUrl;
    }
    if (iconUrl.startsWith('../')) {
      return iconUrl;
    }
    if (iconUrl.startsWith('./')) {
      return `../${iconUrl.slice(2)}`;
    }
    const cleaned = iconUrl.replace(/^\/+/, '');
    return `../${cleaned}`;
  }

  function applyAccentColor(color, { highlightSwatch = false } = {}) {
    if (!color) return;
    selectedColor = color;
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-light', lightenColor(color, 0.22));
    document.documentElement.style.setProperty('--primary-contrast', getReadableTextColor(color));
    updatePreviewAccent(color);
    if (highlightSwatch) highlightColorSwatch(color);
  }

  function highlightColorSwatch(color) {
    colors.forEach(opt => {
      const isMatch = hexEqual(opt.dataset.color, color);
      opt.classList.toggle('selected', isMatch);
      opt.setAttribute('aria-checked', String(isMatch));
    });
  }

  function updatePreviewAccent(color) {
    if (!selectionPreview) return;
    const base = lightenColor(color, 0.42);
    const soft = lightenColor(color, 0.7);
    selectionPreview.style.setProperty('--preview-background', `linear-gradient(135deg, ${base}, ${soft})`);
    selectionPreview.style.setProperty('--preview-border', `rgba(255, 255, 255, 0.8)`);
  }

  function lightenColor(hex, amount = 0.2) {
    const normalized = normalizeHex(hex);
    if (!normalized) return hex;
    let base = normalized.slice(1);
    if (base.length === 3) {
      base = base.split('').map(c => c + c).join('');
    }
    const num = parseInt(base, 16);
    if (Number.isNaN(num)) return hex;

    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;

    const clamp = (ch) => Math.round(ch + (255 - ch) * Math.min(Math.max(amount, 0), 1));
    const nr = clamp(r), ng = clamp(g), nb = clamp(b);
    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
  }

  function normalizeHex(color) {
    if (!color || typeof color !== 'string') return '';
    let t = color.trim().toLowerCase();
    if (!t.startsWith('#')) t = `#${t}`;
    return t;
  }

  function hexEqual(a, b) {
    return normalizeHex(a) === normalizeHex(b);
  }

  function getReadableTextColor(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized || normalized.length !== 7) {
      return '#2f1d4f';
    }

    const r = parseInt(normalized.slice(1, 3), 16) / 255;
    const g = parseInt(normalized.slice(3, 5), 16) / 255;
    const b = parseInt(normalized.slice(5, 7), 16) / 255;

    const luminance = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
    return luminance > 0.65 ? '#2f1d4f' : '#ffffff';
  }

  function linearise(channel) {
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  }

  // Efecto de partículas dentro de un elemento (avatar o color)
  function triggerSparklesOnElement(el, count = 8) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      createSparkle(x, y, el);
    }
  }

  // Efecto de partículas dentro del botón (login)
  function triggerButtonSparkle(button, count = 8) {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'btn-sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      button.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  }

  function createParticleTrail(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      document.body.appendChild(particle);

      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      const hue = Math.random() * 360;
      particle.style.background = `hsl(${hue}, 100%, 70%)`;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      const angle = Math.random() * 2 * Math.PI;
      const duration = 0.5 + Math.random() * 0.5;
      const distance = 50 + Math.random() * 40;

      particle.style.setProperty('--angle', angle);
      particle.style.setProperty('--distance', distance);
      particle.style.setProperty('--duration', duration);

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
  }

  function syncCalmToggle(enabled) {
    if (!calmToggle) { return; }
    if (appData) {
      appData.calmMode = enabled;
    }
    calmToggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
    if (calmStatus) {
      calmStatus.textContent = enabled
        ? t('calmModeOn', 'Calme activé')
        : t('calmModeOff', 'Calme désactivé');
    }
    if (window.appData?.applyCalmMode) {
      window.appData.applyCalmMode(enabled);
    } else if (typeof window.saveAppData === 'function') {
      window.saveAppData({ calmMode: enabled });
    }
  }

  function openParentPanel() {
    if (!parentPanel) { return; }
    parentPanel.hidden = false;
    parentPanel.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', handleParentKeydown);
    if (parentPanelClose) {
      parentPanelClose.focus();
    }
  }

  function closeParentPanel() {
    if (!parentPanel) { return; }
    parentPanel.hidden = true;
    parentPanel.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleParentKeydown);
  }

  function handleParentKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeParentPanel();
    }
  }
});

// ========== Función global de creación de partículas ==========
// (Si deseas también que funcione fuera del DOMContentLoaded)
function createSparkle(x, y, parentEl) {
  const sparkle = document.createElement('div');
  sparkle.classList.add('btn-sparkle');
  parentEl.appendChild(sparkle);
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.addEventListener('animationend', () => sparkle.remove());
}
