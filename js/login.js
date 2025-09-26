console.log("login.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  const avatars = Array.from(document.querySelectorAll('.avatar-option'));
  const colors = Array.from(document.querySelectorAll('.color-option'));
  const nameInput = document.getElementById('name-input');
  const loginBtn = document.getElementById('login-btn');
  const nameWrapper = document.querySelector('.name-input-wrapper');

  const defaultColor = colors[0]?.dataset.color || '#ffc6ff';

  // Intentar recuperar la selección anterior si existe
  const storedAvatarSelection = (typeof storage.loadSelectedAvatar === 'function')
    ? storage.loadSelectedAvatar()
    : null;

  let selectedAvatar = null;
  let selectedColor = defaultColor;
  let userChoseColor = false;

  // Sonidos para clic y brillo
  const popSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-select-click-1109.wav');
  const sparkleSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-game-level-completed-2059.wav');
  popSound.volume = 0.35;
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
    const name = nameInput.value.trim();
    if (!name || !selectedAvatar) {
      alert("S'il te plaît, choisis un nom et un avatar.");
      return;
    }

    triggerButtonSparkle(loginBtn, 12);
    playSound(sparkleSound);

    const userProfile = {
      name,
      avatar: selectedAvatar,
      color: selectedColor || defaultColor
    };
    storage.saveUserProfile(userProfile);
    window.location.href = menuPath;
  });

  // Efecto visual al escribir el nombre
  nameInput.addEventListener('input', () => {
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

  /** Funciones auxiliares abajo **/

  function playSound(audio) {
    if (!audio) return;
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
    return {
      id: avatarId || libEntry.id,
      name: el.dataset.avatarName || libEntry.name || el.title || 'Avatar',
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
      triggerSparklesOnElement(avatarEl, 10);
    }
  }

  function applyAccentColor(color, { highlightSwatch = false } = {}) {
    if (!color) return;
    selectedColor = color;
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-light', lightenColor(color, 0.22));
    if (highlightSwatch) highlightColorSwatch(color);
  }

  function highlightColorSwatch(color) {
    colors.forEach(opt => {
      const isMatch = hexEqual(opt.dataset.color, color);
      opt.classList.toggle('selected', isMatch);
      opt.setAttribute('aria-checked', String(isMatch));
    });
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
