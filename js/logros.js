document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }

    const progress = storage.loadUserProgress(userProfile.name);

    document.getElementById('total-stars').textContent = progress.userScore.stars;
    document.getElementById('total-coins').textContent = progress.userScore.coins;

    const completedContainer = document.getElementById('completed-levels');
    const stickersContainer = document.getElementById('stickers');

    const topics = {
        additions: '➕ Additions',
        soustractions: '➖ Soustractions',
        multiplications: '✖️ Multiplications',
        'number-houses': '🏠 Maisons des Nombres',
        colors: '🎨 Les Couleurs',
        stories: '📚 Contes Magiques',
        memory: '🧠 Mémoire Magique',
        sorting: '🗂️ Jeu de Tri',
        riddles: '🤔 Jeu d\'énigmes',
        vowels: '🅰️ Jeu des Vocales',
        sequences: '➡️ Jeu des Séquences',
    };

    let completedCount = 0;
    for (const key in progress.answeredQuestions) {
        if (progress.answeredQuestions[key] === 'completed') {
            const [topic, level] = key.split('-');
            const item = document.createElement('div');
            item.className = 'logro-item';
            item.textContent = `${topics[topic] || topic} - Niveau ${level}`;
            completedContainer.appendChild(item);
            completedCount++;
        }
    }

    if (completedContainer.children.length === 0) {
        completedContainer.innerHTML = '<p>Aucun niveau terminé pour le moment. Continue à jouer !</p>';
    }

    // Add stickers based on completed levels
    const stickerCount = Math.floor(completedCount / 3); // 1 sticker for every 3 levels completed
    for (let i = 1; i <= stickerCount; i++) {
        const stickerImg = document.createElement('img');
        // Assuming there are stickers named sticker1.png, sticker2.png, etc.
        const stickerNum = ((i - 1) % 3) + 1; // Cycle through stickers 1, 2, 3
        stickerImg.src = `../assets/stickers/sticker${stickerNum}.png`;
        stickerImg.alt = `Sticker ${i}`;
        const stickerWrapper = document.createElement('div');
        stickerWrapper.className = 'sticker-item';
        stickerWrapper.appendChild(stickerImg);
        stickersContainer.appendChild(stickerWrapper);
    }

    if (stickersContainer.children.length === 0) {
        stickersContainer.innerHTML = '<p>Complète plus de niveaux pour gagner des stickers !</p>';
    }


    const backToGameBtn = document.getElementById('back-to-game');
    if (backToGameBtn) {
        backToGameBtn.addEventListener('click', () => {
            window.location.href = 'juego.html';
        });
    }
});
