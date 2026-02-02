document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getActiveUser();
    
    if (!activeUser) {
        window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
        return;
    }

    const userData = getUserData(activeUser);

    if (!userData) {
        alert('No se encontraron los datos del usuario. Por favor, inicia sesión de nuevo.');
        window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
        return;
    }

    const userGreeting = document.getElementById('user-greeting');
    const userAvatarDisplay = document.getElementById('user-avatar');
    const levelsCompleted = document.getElementById('levels-completed');
    const timePlayed = document.getElementById('time-played');
    const body = document.querySelector('body');

    userGreeting.textContent = `¡Hola, ${activeUser}!`;
    
    // Load and render the selected avatar
    let selectedAvatar = storage.loadSelectedAvatar();
    if (!selectedAvatar) {
        const fallbackAvatar = getAvatarMeta('licorne') || {
            id: 'licorne',
            name: 'Licorne',
            iconUrl: '../assets/avatars/licorne.svg'
        };
        storage.saveSelectedAvatar(fallbackAvatar);
        selectedAvatar = fallbackAvatar;
    }
    const currentAvatarMeta = getAvatarMeta(selectedAvatar.id) || selectedAvatar;
    renderAvatar(userAvatarDisplay, currentAvatarMeta);
    let selectedAvatarId = currentAvatarMeta?.id || 'licorne';

    if (userData.color) {
        body.style.setProperty('--primary-color', userData.color);
    }

    if (userData.progress) {
        levelsCompleted.textContent = userData.progress.levelsCompleted.length;
        timePlayed.textContent = Math.floor(userData.progress.timePlayed / 60);
    }

    // Avatar Selection Modal Logic
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarSelectionModal = document.getElementById('avatar-selection-modal');
    const closeButton = avatarSelectionModal.querySelector('.close-button');
    const avatarOptionsContainer = document.getElementById('avatar-options-container');

    changeAvatarBtn.addEventListener('click', () => {
        avatarSelectionModal.style.display = 'flex';
        populateAvatarOptions(avatarOptionsContainer, selectedAvatarId);
    });

    closeButton.addEventListener('click', () => {
        avatarSelectionModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === avatarSelectionModal) {
            avatarSelectionModal.style.display = 'none';
        }
    });

    avatarOptionsContainer.addEventListener('click', (event) => {
        const avatarOption = event.target.closest('.avatar-option');
        if (avatarOption) {
            const newAvatarId = avatarOption.dataset.avatarId;
            if (newAvatarId) {
                const optionMeta = {
                    id: newAvatarId,
                    name: avatarOption.dataset.name,
                    iconUrl: avatarOption.dataset.avatar
                };
                const newAvatarMeta = getAvatarMeta(newAvatarId) || optionMeta;
                storage.saveSelectedAvatar(newAvatarMeta);
                updateUserProfileAvatar(newAvatarMeta);
                renderAvatar(userAvatarDisplay, newAvatarMeta);
                if (newAvatarMeta?.defaultPalette?.primary) {
                    document.body?.style.setProperty('--primary-color', newAvatarMeta.defaultPalette.primary);
                }
                selectedAvatarId = newAvatarId;
                avatarOptionsContainer
                    .querySelectorAll('.avatar-option')
                    .forEach(option => option.classList.toggle('selected', option.dataset.avatarId === newAvatarId));
                avatarSelectionModal.style.display = 'none';
            }
        }
    });
});

function getActiveUser() {
    const profile = storage.loadUserProfile();
    return profile?.name || null;
}

function getUserData(activeName) {
    if (!activeName) { return null; }
    const profile = storage.loadUserProfile();
    if (!profile || profile.name !== activeName) { return null; }
    const progress = storage.loadUserProgress(activeName);
    return {
        ...profile,
        progress
    };
}

function renderAvatar(container, avatarData) {
    if (!container) { return; }
    container.innerHTML = '';
    if (!avatarData) { return; }

    const wrapper = document.createElement('div');
    wrapper.className = 'menu-avatar';
    if (avatarData.id) {
        wrapper.dataset.avatarId = avatarData.id;
    }
    if (avatarData.iconUrl) {
        wrapper.dataset.avatar = avatarData.iconUrl;
    }
    if (avatarData.name) {
        wrapper.dataset.avatarName = avatarData.name;
    }

    const img = document.createElement('img');
    img.src = avatarData.iconUrl || '../assets/avatars/licorne.svg';
    img.alt = avatarData.name || 'Avatar';
    img.loading = 'lazy';
    wrapper.appendChild(img);

    const label = document.createElement('span');
    label.className = 'menu-avatar__label';
    label.textContent = avatarData.name || '';
    wrapper.appendChild(label);

    container.appendChild(wrapper);
}

function populateAvatarOptions(container, currentSelectedId) {
    container.innerHTML = ''; // Clear previous options
    for (const avatarId in window.AVATAR_LIBRARY) {
        const avatar = window.AVATAR_LIBRARY[avatarId];
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option';
        avatarOption.dataset.avatarId = avatar.id;
        avatarOption.dataset.avatar = avatar.iconUrl || '';
        avatarOption.dataset.name = avatar.name;

        if (avatar.id === currentSelectedId) {
            avatarOption.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = avatar.iconUrl;
        img.alt = avatar.name;
        img.loading = 'lazy';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = avatar.name;

        avatarOption.appendChild(img);
        avatarOption.appendChild(nameSpan);
        container.appendChild(avatarOption);
    }
}

// Helper function to get avatar metadata (from storage.js or avatarData.js)
function getAvatarMeta(avatarId) {
    const library = window.AVATAR_LIBRARY || {};
    return library[avatarId] || null;
}

function updateUserProfileAvatar(avatarMeta) {
    if (!avatarMeta || !avatarMeta.id) { return; }
    const currentProfile = storage.loadUserProfile();
    if (!currentProfile) { return; }
    const sanitizedProfile = {
        ...currentProfile,
        avatar: {
            id: avatarMeta.id,
            name: avatarMeta.name,
            iconUrl: avatarMeta.iconUrl
        }
    };
    storage.saveUserProfile(sanitizedProfile);
}
