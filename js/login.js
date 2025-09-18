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

    const popSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-select-click-1109.wav');
    const sparkleSound = new Audio('https://assets.mixkit.co/sfx/download/mixkit-game-level-completed-2059.wav');
    popSound.volume = 0.35;
    sparkleSound.volume = 0.3;

    // Check if a user is already logged in
    const existingProfile = storage.loadUserProfile();
    if (existingProfile && existingProfile.name) {
        // If so, go straight to the game
        window.location.href = 'juego.html';
    }

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(a => a.classList.remove('selected'));
            avatar.classList.add('selected');
            selectedAvatar = avatar.dataset.avatar;
            animateAvatar(avatar);
            playSound(popSound);
        });
    });

    const defaultAvatarOption = avatars[0];
    if (defaultAvatarOption) {
        defaultAvatarOption.classList.add('selected');
        selectedAvatar = defaultAvatarOption.dataset.avatar;
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
            name: name,
            avatar: selectedAvatar,
            color: selectedColor || defaultColor
        };

        storage.saveUserProfile(userProfile);
        window.location.href = 'juego.html';
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
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 400);
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
