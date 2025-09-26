document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    const userProgress = storage.loadUserProgress(userProfile.name);

    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }

    // --- DOM Elements ---
    const userInfo = document.getElementById('user-info');
    const scoreStars = document.getElementById('scoreStars');
    const scoreCoins = document.getElementById('scoreCoins');
    const logrosContainer = document.getElementById('logros-container');
    const btnVolver = document.getElementById('btnVolver');

    // --- Game Data ---
    const AVATAR_LIBRARY = window.AVATAR_LIBRARY || {};

    function setupUI() {
        renderUserIdentity();
        scoreStars.textContent = userProgress.userScore.stars;
        scoreCoins.textContent = userProgress.userScore.coins;
        renderLogros();
    }

    function renderUserIdentity() {
        if (!userInfo) { return; }

        userInfo.innerHTML = '';
        const avatarMeta = AVATAR_LIBRARY[userProfile.avatar?.id] || {};
        const avatarIconUrl = userProfile.avatar?.iconUrl || avatarMeta?.iconUrl;
        const avatarName = userProfile.avatar?.name || avatarMeta?.name || 'Avatar';

        if (avatarIconUrl) {
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarIconUrl;
            avatarImg.alt = avatarName;
            avatarImg.className = 'user-info__avatar';
            userInfo.appendChild(avatarImg);
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'user-info__name';
        nameSpan.textContent = userProfile.name || 'Explorateur';
        userInfo.appendChild(nameSpan);
    }

    function renderLogros() {
        logrosContainer.innerHTML = '';

        // Rewards Section
        const rewardsSection = document.createElement('div');
        rewardsSection.className = 'rewards-section';
        const rewardsTitle = document.createElement('h2');
        rewardsTitle.textContent = 'Mis Recompensas';
        rewardsSection.appendChild(rewardsTitle);

        const rewardsGrid = document.createElement('div');
        rewardsGrid.className = 'rewards-grid';

        const ownedItems = userProgress.ownedItems || [];
        if (ownedItems.length > 0) {
            const SHOP_CATALOG = buildShopCatalogue();
            ownedItems.forEach(itemId => {
                const item = SHOP_CATALOG.get(itemId);
                if (item) {
                    const rewardItem = document.createElement('div');
                    rewardItem.className = 'reward-item';
                    const rewardImg = document.createElement('img');
                    rewardImg.src = item.iconUrl;
                    rewardImg.alt = item.name;
                    const rewardName = document.createElement('span');
                    rewardName.textContent = item.name;
                    rewardItem.appendChild(rewardImg);
                    rewardItem.appendChild(rewardName);
                    rewardsGrid.appendChild(rewardItem);
                }
            });
        } else {
            const noRewards = document.createElement('p');
            noRewards.textContent = 'No tienes recompensas todavía. ¡Sigue jugando para conseguir!';
            rewardsGrid.appendChild(noRewards);
        }

        rewardsSection.appendChild(rewardsGrid);
        logrosContainer.appendChild(rewardsSection);

        // Progress Section
        const progressSection = document.createElement('div');
        progressSection.className = 'progress-section';
        const progressTitle = document.createElement('h2');
        progressTitle.textContent = 'Mi Progreso';
        progressSection.appendChild(progressTitle);

        const progressBars = document.createElement('div');
        progressBars.className = 'progress-bars';

        const allTopics = {
            'additions': { name: 'Additions', levels: 12 },
            'soustractions': { name: 'Soustractions', levels: 12 },
            'multiplications': { name: 'Multiplications', levels: 12 },
            'colors': { name: 'Les Couleurs', levels: 12 },
            'stories': { name: 'Contes Magiques', levels: 15 },
            'memory': { name: 'Mémoire Magique', levels: 12 },
            'sorting': { name: 'Jeu de Tri', levels: 10 },
            'riddles': { name: 'Jeu d\'énigmes', levels: 10 },
            'vowels': { name: 'Jeu des Voyelles', levels: 10 },
            'sequences': { name: 'Jeu des Séquences', levels: 10 },
            'puzzle-magique': { name: 'Puzzle Magique', levels: 10 },
            'repartis': { name: 'Répartis & Multiplie', levels: 10 },
            'dictee': { name: 'Dictée Magique', levels: 10 },
            'math-blitz': { name: 'Maths Sprint', levels: 10 },
            'lecture-magique': { name: 'Lecture Magique', levels: 10 },
            'raisonnement': { name: 'Raisonnement Magique', levels: 10 },
        };

        for (const topicId in allTopics) {
            const topic = allTopics[topicId];
            const completedLevels = Object.keys(userProgress.answeredQuestions).filter(key => key.startsWith(topicId) && userProgress.answeredQuestions[key] === 'completed').length;
            const percentage = (completedLevels / topic.levels) * 100;

            if (completedLevels > 0) {
                const progressItem = document.createElement('div');
                progressItem.className = 'progress-item';

                const label = document.createElement('div');
                label.className = 'label';
                label.textContent = `${topic.name} (${completedLevels}/${topic.levels})`;
                progressItem.appendChild(label);

                const progressBarContainer = document.createElement('div');
                progressBarContainer.className = 'progress-bar-container';
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.style.width = `${percentage}%`;
                progressBar.textContent = `${Math.round(percentage)}%`;
                progressBarContainer.appendChild(progressBar);
                progressItem.appendChild(progressBarContainer);
                progressBars.appendChild(progressItem);
            }
        }

        progressSection.appendChild(progressBars);
        logrosContainer.appendChild(progressSection);
    }

    function buildShopCatalogue() {
        const catalogue = new Map();
        createBadgeItems().forEach(item => catalogue.set(item.id, item));
        Object.values(AVATAR_LIBRARY).forEach(avatar => {
            if (!avatar?.backgrounds) { return; }
            avatar.backgrounds.forEach(bg => {
                const backgroundItem = {
                    id: bg.id,
                    type: 'background',
                    ownerAvatarId: avatar.id,
                    name: bg.name,
                    priceCoins: bg.priceCoins || bg.price || 120,
                    description: bg.description,
                    palette: bg.palette,
                    iconUrl: bg.iconUrl,
                    previewUrl: bg.previewUrl,
                    motif: bg.motif || '✨'
                };
                catalogue.set(backgroundItem.id, backgroundItem);
            });
        });
        return catalogue;
    }

    function createBadgeItems() {
        const base = [
            {
                id: 'badge-etoile',
                name: 'Badge Super Étoile',
                emoji: '🌟',
                priceCoins: 35,
                description: 'Affiche une médaille étoilée près de ton nom.',
                colors: { background: '#FFD93D', accent: '#FFB037', text: '#4B3200' }
            },
            {
                id: 'badge-arcenciel',
                name: 'Badge Arc-en-ciel',
                emoji: '🌈',
                priceCoins: 45,
                description: 'Ajoute un arc-en-ciel magique à ton profil.',
                colors: { background: '#8AB6FF', accent: '#FF9AE1', text: '#1D2A58' }
            },
            {
                id: 'badge-etoiles-filantes',
                name: 'Badge Étoiles Filantes',
                emoji: '💫',
                priceCoins: 55,
                description: 'Des étoiles filantes pour célébrer tes progrès.',
                colors: { background: '#AC92FF', accent: '#FFD86F', text: '#2E1D52' }
            },
            {
                id: 'badge-licorne-magique',
                name: 'Badge Licorne Magique',
                emoji: '🦄',
                priceCoins: 70,
                description: 'Un badge licorne pour les plus rêveurs.',
                colors: { background: '#E0BBE4', accent: '#957DAD', text: '#574B60' }
            },
            {
                id: 'badge-dragon-feu',
                name: 'Badge Dragon de Feu',
                emoji: '🐉',
                priceCoins: 80,
                description: 'Montre ta force avec ce badge dragon.',
                colors: { background: '#FF6B6B', accent: '#EE4035', text: '#4A0505' }
            },
            {
                id: 'badge-pingouin-glace',
                name: 'Badge Pingouin Glacé',
                emoji: '🐧',
                priceCoins: 40,
                description: 'Un badge givré pour les explorateurs polaires.',
                colors: { background: '#BEE3FF', accent: '#4A90E2', text: '#17426B' }
            },
            {
                id: 'badge-fee-lumineuse',
                name: 'Badge Fée Lumineuse',
                emoji: '🧚‍♀️',
                priceCoins: 65,
                description: 'La poussière de fée te suit dans chaque aventure.',
                colors: { background: '#FFE8F6', accent: '#FF9FF3', text: '#6C1A5F' }
            },
            {
                id: 'badge-robot-genial',
                name: 'Badge Robot Génial',
                emoji: '🤖',
                priceCoins: 50,
                description: 'Pour les inventeurs curieux et malins.',
                colors: { background: '#E0F7FA', accent: '#00BCD4', text: '#004D54' }
            },
            {
                id: 'badge-etoile-nord',
                name: 'Badge Étoile du Nord',
                emoji: '🌌',
                priceCoins: 90,
                description: 'Une étoile brillante qui guide tes missions.',
                colors: { background: '#2E3359', accent: '#6C63FF', text: '#F4F4FF' }
            }
        ];

        return base.map(spec => ({
            ...spec,
            type: 'badge',
            iconUrl: generateBadgePreview(spec, 88),
            previewUrl: generateBadgePreview(spec, 144)
        }));
    }

    function generateBadgePreview(spec, size) {
        const radius = size / 2 - size * 0.08;
        const bg = spec.colors?.background || '#FFD93D';
        const accent = spec.colors?.accent || '#FFB037';
        const text = spec.colors?.text || '#4B3200';
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="badgeGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="url(#badgeGlow)"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius - size * 0.08}" fill="${bg}" opacity="0.85"/>
  <text x="50%" y="52%" font-family="'Fredoka', 'Nunito', sans-serif" font-weight="700" font-size="${size * 0.45}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${spec.emoji}</text>
</svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;
    }

    btnVolver.addEventListener('click', () => {
        window.location.href = 'html/juego.html';
    });

    setupUI();
});