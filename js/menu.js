document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getActiveUser();
    
    if (!activeUser) {
        // Si no hay usuario activo, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    const userData = getUserData(activeUser);

    if (!userData) {
        // Si los datos del usuario no existen, algo fue mal
        alert('No se encontraron los datos del usuario. Por favor, inicia sesión de nuevo.');
        window.location.href = 'login.html';
        return;
    }

    // Personalizamos la página con los datos del usuario
    const userGreeting = document.getElementById('user-greeting');
    const userAvatar = document.getElementById('user-avatar');
    const levelsCompleted = document.getElementById('levels-completed');
    const timePlayed = document.getElementById('time-played');
    const body = document.querySelector('body');

    userGreeting.textContent = `¡Hola, ${activeUser}!`;
    renderAvatar(userAvatar, userData.avatar);
    
    // Aplicamos el color favorito del usuario a la página
    if (userData.color) {
        body.style.setProperty('--primary-color', userData.color);
    }

    // Mostramos el progreso
    if (userData.progress) {
        levelsCompleted.textContent = userData.progress.levelsCompleted.length;
        timePlayed.textContent = Math.floor(userData.progress.timePlayed / 60); // en minutos
    }
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

    const img = document.createElement('img');
    img.src = avatarData.iconUrl;
    img.alt = avatarData.name || 'Avatar';
    img.loading = 'lazy';
    wrapper.appendChild(img);

    const label = document.createElement('span');
    label.className = 'menu-avatar__label';
    label.textContent = avatarData.name || '';
    wrapper.appendChild(label);

    container.appendChild(wrapper);
}
