document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }

    const progress = storage.loadUserProgress(userProfile.name);

    document.getElementById('total-stars').textContent = progress.userScore.stars || 0;
    document.getElementById('total-coins').textContent = progress.userScore.coins || 0;
    const stickerSummary = document.createElement('p');
    stickerSummary.textContent = `Stickers gagnés : ${progress.userScore.stickers || 0} 🐾`;
    document.getElementById('progress-summary').appendChild(stickerSummary);

    const completedContainer = document.getElementById('completed-levels');
    const stickersContainer = document.getElementById('stickers');

    const sections = {
        math: '🧮 Mathématiques',
        francais: '📚 Français',
        geometrie: '📐 Géométrie',
        problemes: '🤔 Problèmes de logique',
        entrainement: '⚡ Entraînement rapide'
    };

    const categories = {
        additions: '➕ Additions',
        soustractions: '➖ Soustractions',
        multiplications: '✖️ Multiplications',
        'number-houses': '🏠 Maisons des Nombres',
        repartis: '🍎 Répartis & Multiplie',
        'contes-magiques': '📚 Contes Magiques',
        vowels: '🅰️ Jeu des Voyelles',
        dictee: '🧚‍♀️ Dictée Magique',
        'puzzle-magique': '🧩 Puzzle Magique',
        enigmes: "🤔 Jeu d'énigmes",
        sequences: '➡️ Jeu des Séquences',
        tri: '🗂️ Jeu de Tri',
        colors: '🎨 Les Couleurs',
        memoire: '🧠 Mémoire Magique',
        flash: '⚡ Entraînement Flash'
    };

    let completedCount = 0;
    for (const key in progress.answeredQuestions) {
        if (progress.answeredQuestions[key] === 'completed') {
            let sectionLabel = 'Section secrète';
            let categoryLabel = 'Jeu mystère';
            let levelLabel = '';

            if (key.includes(':')) {
                const [sectionKey, categoryKey, levelId] = key.split(':');
                sectionLabel = sections[sectionKey] || sectionKey || sectionLabel;
                categoryLabel = categories[categoryKey] || categoryKey || categoryLabel;
                if (levelId) {
                    const match = levelId.match(/(\d+)/);
                    levelLabel = match ? match[1] : levelId;
                }
            } else if (key.includes('-L')) {
                const [sectionKey, levelPart] = key.split('-L');
                sectionLabel = sections[sectionKey] || sectionKey || sectionLabel;
                categoryLabel = 'Niveau classique';
                levelLabel = levelPart || '';
            } else {
                const [legacyTopic, levelPart] = key.split('-');
                sectionLabel = sections[legacyTopic] || legacyTopic || sectionLabel;
                categoryLabel = legacyTopic;
                levelLabel = levelPart || '';
            }

            const item = document.createElement('div');
            item.className = 'logro-item';
            item.textContent = `${sectionLabel} · ${categoryLabel} — Niveau ${levelLabel}`;
            completedContainer.appendChild(item);
            completedCount++;
        }
    }

    if (completedContainer.children.length === 0) {
        completedContainer.innerHTML = '<p>Aucun niveau terminé pour le moment. Continue à jouer !</p>';
    }

    // Ajoute les stickers gagnés
    const stickerCount = progress.userScore.stickers || Math.floor(completedCount / 3);
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
