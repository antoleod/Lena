console.log("login.js loaded");
document.addEventListener('DOMContentLoaded', () => {
    const avatars = document.querySelectorAll('.avatar-option');
    const colors = document.querySelectorAll('.color-option');
    const nameInput = document.getElementById('name-input');
    const loginBtn = document.getElementById('login-btn');
    const nameWrapper = document.querySelector('.name-input-wrapper');

    const defaultColor = '#ffffff';
    let selectedAvatar = null;
    let selectedColor = defaultColor;
    const storedAvatarSelection = typeof storage.loadSelectedAvatar === 'function'
        ? storage.loadSelectedAvatar()
        : null;

    const popSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-select-click-1109.wav');
    const sparkleSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-game-level-completed-2059.wav');
    popSound.volume = 0.35;
    sparkleSound.volume = 0.3;

    // Check if a user is already logged in
    const existingProfile = storage.loadUserProfile();
    if (existingProfile && existingProfile.name) {
        // If so, go straight to the menu
        window.location.href = 'menu.html';
    }

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            selectAvatar(avatar, { animate: true });
            playSound(popSound);
        });
    });

    if (storedAvatarSelection?.id) {
        const matchingAvatar = Array.from(avatars).find(
            (avatar) => avatar.dataset.avatarId === storedAvatarSelection.id
        );
        if (matchingAvatar) {
            selectAvatar(matchingAvatar);
        }
    }

    if (!selectedAvatar) {
        const defaultAvatarOption = avatars[0];
        if (defaultAvatarOption) {
            selectAvatar(defaultAvatarOption);
        }
    }

    const defaultColorOption = document.querySelector(`.color-option[data-color="${defaultColor}"]`);
    if (defaultColorOption) {
        defaultColorOption.classList.add('selected');
    }

    colors.forEach(color => {
        color.addEventListener('click', () => {
            colors.forEach(c => c.classList.remove('selected'));
            color.classList.add('selected');
            selectedColor = color.dataset.color || defaultColor;
            playSound(popSound);
        });
    });

    loginBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name || !selectedAvatar) {
            alert('S\'il te plaît, choisis un nom et un avatar.');
            return;
        }

        triggerButtonSparkle(loginBtn);
        playSound(sparkleSound);

        const userProfile = {
            name,
            avatar: selectedAvatar,
            color: selectedColor || defaultColor
        };

        storage.saveUserProfile(userProfile);
        window.location.href = 'menu.html';
    });

    nameInput.addEventListener('input', () => {
        if (!nameWrapper) { return; }
        nameWrapper.classList.add('typing');
        setTimeout(() => nameWrapper.classList.remove('typing'), 350);
    });

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginBtn.click();
        }
    });

    function playSound(audio) {
        if (!audio) { return; }
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    function animateAvatar(avatar) {
        avatar.classList.remove('pulse');
        void avatar.offsetWidth;
        avatar.classList.add('pulse');
    }

    function extractAvatarData(element) {
        if (!element) { return null; }
        return {
            id: element.dataset.avatarId,
            name: element.dataset.avatarName,
            iconUrl: element.dataset.avatarIcon
        };
    }

    function selectAvatar(avatarElement, { animate = false } = {}) {
        if (!avatarElement) { return; }
        avatars.forEach(a => a.classList.remove('selected'));
        avatarElement.classList.add('selected');
        selectedAvatar = extractAvatarData(avatarElement);
        if (selectedAvatar && typeof storage.saveSelectedAvatar === 'function') {
            storage.saveSelectedAvatar(selectedAvatar);
        } else if (selectedAvatar) {
            try {
                localStorage.setItem('mathsLenaSelectedAvatar', JSON.stringify(selectedAvatar));
            } catch (e) {
                console.error('Error saving selected avatar locally', e);
            }
        }
        if (animate) {
            animateAvatar(avatarElement);
        }
    }

    function triggerButtonSparkle(button) {
        const sparkleTotal = 8;
        for (let i = 0; i < sparkleTotal; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'btn-sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            button.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }
    }
});
