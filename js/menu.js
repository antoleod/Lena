const SECTION_DATA = {
    math: {
        iconSet: ['🧮', '🎲', '🧊', '📏'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-fast-double-click-on-mouse-275.wav',
        theme: ['var(--menu-forest-start)', 'var(--menu-forest-end)'],
        label: "Mission Mathématiques"
    },
    francais: {
        iconSet: ['📚', '✏️', '🐱', '🔤'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-quick-win-video-game-notification-269.wav',
        theme: ['var(--menu-castle-start)', 'var(--menu-castle-end)'],
        label: "Nuage du Français"
    },
    geometrie: {
        iconSet: ['📐', '🔺', '🧊', '📏'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-sci-fi-positive-notification-266.wav',
        theme: ['var(--menu-space-start)', 'var(--menu-space-end)'],
        label: "Laboratoire Géométrie"
    },
    problemes: {
        iconSet: ['🔍', '⚖️', '🧩', '💡'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-unlock-game-notification-253.wav',
        theme: ['var(--menu-mystery-start)', 'var(--menu-mystery-end)'],
        label: "Club des Détectives"
    },
    entrainement: {
        iconSet: ['⚡', '⏱️', '🎯', '💥'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-game-level-completed-2059.wav',
        theme: ['var(--menu-lightning-start)', 'var(--menu-lightning-end)'],
        label: "Sprint Entraînement"
    },
    puzzles: {
        iconSet: ['🧩', '🤔', '💡', '✨'],
        sound: 'https://assets.mixkit.co/sfx/download/mixkit-game-level-completed-2059.wav',
        theme: ['var(--menu-creative-start)', 'var(--menu-creative-end)'],
        label: "Atelier des Puzzles"
    }
};

const menuState = {
    activeTheme: null,
    audioCache: {}
};

document.addEventListener('DOMContentLoaded', () => {
    const profile = storage.loadUserProfile();
    if (!profile) {
        window.location.replace('login.html');
        return;
    }

    const progress = storage.loadUserProgress(profile.name || '');
    hydrateProfileCard(profile, progress);
    setupAvatarModal(profile);
    setupLogout();
    setupSectionCards();
    sprinkleFloatingIcons();
});

function hydrateProfileCard(profile, progress) {
    const greetingElt = document.getElementById('user-greeting');
    const avatarContainer = document.getElementById('user-avatar');
    const levelsElt = document.getElementById('levels-completed');
    const timeElt = document.getElementById('time-played');

    if (greetingElt) {
        greetingElt.textContent = `Bonjour, ${profile.name} !`;
    }

    if (levelsElt) {
        const completed = progress?.answeredQuestions ? Object.values(progress.answeredQuestions).filter(status => status === 'completed').length : 0;
        levelsElt.textContent = completed;
    }

    if (timeElt) {
        const minutes = Math.max(0, Math.floor((progress?.timePlayed || 0) / 60));
        timeElt.textContent = minutes;
    }

    renderAvatar(avatarContainer, profile.avatar);
}

function setupAvatarModal(profile) {
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const modal = document.getElementById('avatar-selection-modal');
    const closeBtn = modal?.querySelector('.close-button');
    const avatarContainer = document.getElementById('avatar-options-container');

    if (!changeAvatarBtn || !modal || !avatarContainer) { return; }

    changeAvatarBtn.addEventListener('click', () => {
        populateAvatarOptions(avatarContainer, profile?.avatar?.id);
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
    });

    closeBtn?.addEventListener('click', () => hideModal(modal));

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            hideModal(modal);
        }
    });

    avatarContainer.addEventListener('click', event => {
        const option = event.target.closest('.avatar-option');
        if (!option) { return; }
        const newAvatarId = option.dataset.avatarId;
        const meta = getAvatarMeta(newAvatarId) || {
            id: newAvatarId,
            name: option.dataset.name,
            iconUrl: option.dataset.avatar
        };
        storage.saveSelectedAvatar(meta);
        const updatedProfile = {
            ...profile,
            avatar: simplifyAvatar(meta)
        };
        profile.avatar = updatedProfile.avatar;
        storage.saveUserProfile(updatedProfile);
        renderAvatar(document.getElementById('user-avatar'), updatedProfile.avatar);
        populateAvatarOptions(avatarContainer, newAvatarId);
        hideModal(modal);
    });
}

function hideModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) { return; }
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('mathsLenaUserProfile');
        window.location.replace('login.html');
    });
}

function setupSectionCards() {
    const cards = document.querySelectorAll('.section-card');
    const buttons = document.querySelectorAll('button[data-navigate]');

    cards.forEach(card => {
        const sectionId = card.dataset.section;
        injectIconOrbit(card, sectionId);

        card.addEventListener('mouseenter', () => {
            applyTheme(sectionId, card.dataset.gradientStart, card.dataset.gradientEnd);
            playHoverSound(sectionId);
        });

        card.addEventListener('focusin', () => {
            applyTheme(sectionId, card.dataset.gradientStart, card.dataset.gradientEnd);
        });

        card.addEventListener('mouseleave', restoreBaseTheme);
        card.addEventListener('focusout', restoreBaseTheme);
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.navigate;
            if (!sectionId) { return; }
            window.location.href = `juego.html?section=${encodeURIComponent(sectionId)}`;
        });
    });
}

function applyTheme(sectionId, startColor, endColor) {
    if (!sectionId) { return; }
    const body = document.body;
    const [fallbackStart, fallbackEnd] = SECTION_DATA[sectionId]?.theme || ['#fdf4ff', '#f6f2ff'];
    const gradientStart = startColor || fallbackStart;
    const gradientEnd = endColor || fallbackEnd;

    if (menuState.activeTheme === sectionId) { return; }
    body.style.background = `linear-gradient(150deg, ${gradientStart} 0%, ${gradientEnd} 100%)`;
    body.dataset.activeTheme = sectionId;
    menuState.activeTheme = sectionId;
}

function restoreBaseTheme() {
    const body = document.body;
    delete body.dataset.activeTheme;
    body.style.background = 'linear-gradient(160deg, #fdf4ff 0%, #f6f2ff 45%, #f0f4ff 100%)';
    menuState.activeTheme = null;
}

function injectIconOrbit(card, sectionId) {
    const definition = SECTION_DATA[sectionId];
    if (!definition || card.querySelector('.section-orbit')) { return; }

    const orbit = document.createElement('div');
    orbit.className = 'section-orbit';
    orbit.setAttribute('aria-hidden', 'true');

    definition.iconSet.forEach((emoji, index) => {
        const span = document.createElement('span');
        span.className = 'section-orbit__icon';
        span.textContent = emoji;
        span.style.setProperty('--index', index.toString());
        const angle = (Math.PI * 2 * index) / Math.max(1, definition.iconSet.length);
        const radiusX = 32;
        const radiusY = 24;
        span.style.left = `${50 + Math.cos(angle) * radiusX}%`;
        span.style.top = `${55 + Math.sin(angle) * radiusY}%`;
        orbit.appendChild(span);
    });

    card.appendChild(orbit);
}

function sprinkleFloatingIcons() {
    const decorContainer = document.createElement('div');
    decorContainer.id = 'menuDecor';
    decorContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(decorContainer);

    const iconPools = Object.values(SECTION_DATA).flatMap(section => section.iconSet);
    const totalIcons = 16;

    for (let i = 0; i < totalIcons; i++) {
        const icon = document.createElement('span');
        icon.className = 'menu-decor-icon';
        icon.textContent = iconPools[i % iconPools.length];
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;
        icon.style.setProperty('--duration', `${12 + Math.random() * 10}s`);
        icon.style.setProperty('--delay', `${Math.random() * 6}s`);
        decorContainer.appendChild(icon);
    }
}

function playHoverSound(sectionId) {
    const data = SECTION_DATA[sectionId];
    if (!data || !data.sound) { return; }
    if (!menuState.audioCache[sectionId]) {
        const audio = new Audio(data.sound);
        audio.volume = 0.35;
        menuState.audioCache[sectionId] = audio;
    }
    const audio = menuState.audioCache[sectionId];
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function renderAvatar(container, avatarData) {
    if (!container) { return; }
    container.innerHTML = '';
    const avatar = avatarData || storage.loadSelectedAvatar() || getAvatarMeta('licorne');
    if (!avatar) { return; }

    const wrapper = document.createElement('div');
    wrapper.className = 'profile-avatar-wrapper';

    if (avatar.iconUrl) {
        const img = document.createElement('img');
        img.src = avatar.iconUrl;
        img.alt = avatar.name || 'Avatar';
        img.loading = 'lazy';
        wrapper.appendChild(img);
    } else {
        const span = document.createElement('span');
        span.textContent = avatar.icon || '🦄';
        span.className = 'profile-avatar-emoji';
        wrapper.appendChild(span);
    }

    const label = document.createElement('span');
    label.className = 'profile-avatar-name';
    label.textContent = avatar.name || '';

    container.appendChild(wrapper);
    container.appendChild(label);
}

function populateAvatarOptions(container, currentSelectedId) {
    container.innerHTML = '';
    const library = window.AVATAR_LIBRARY || {};
    Object.values(library).forEach(avatar => {
        const option = document.createElement('div');
        option.className = 'avatar-option';
        option.dataset.avatarId = avatar.id;
        option.dataset.avatar = avatar.iconUrl;
        option.dataset.name = avatar.name;

        if (avatar.id === currentSelectedId) {
            option.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = avatar.iconUrl;
        img.alt = avatar.name;
        img.loading = 'lazy';

        const name = document.createElement('span');
        name.textContent = avatar.name;

        option.appendChild(img);
        option.appendChild(name);
        container.appendChild(option);
    });
}

function getAvatarMeta(avatarId) {
    const library = window.AVATAR_LIBRARY || {};
    return library[avatarId] || null;
}

function simplifyAvatar(avatar) {
    if (!avatar) { return null; }
    return {
        id: avatar.id,
        name: avatar.name,
        iconUrl: avatar.iconUrl
    };
}
