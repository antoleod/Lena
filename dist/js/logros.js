document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    if (!userProfile) {
        window.location.href = '/login';
        return;
    }

    const userProgress = sanitizeProgress(storage.loadUserProgress(userProfile.name));

    if (userProfile.avatar?.iconUrl) {
        const normalizedIcon = normalizeAssetPath(userProfile.avatar.iconUrl);
        if (normalizedIcon && normalizedIcon !== userProfile.avatar.iconUrl) {
            userProfile.avatar.iconUrl = normalizedIcon;
            storage.saveUserProfile(userProfile);
        }
    }

    const AVATAR_LIBRARY = window.AVATAR_LIBRARY || {};

    const userInfo = document.getElementById('user-info');
    const scoreStarsElements = [
        document.getElementById('scoreStars'),
        document.getElementById('stars')
    ].filter(Boolean);
    const scoreCoinsElements = [
        document.getElementById('scoreCoins'),
        document.getElementById('coins')
    ].filter(Boolean);
    const logrosContainer = document.getElementById('logros-container');
    const btnVolver = document.getElementById('btnVolver');

    let catalogueCache = null;

    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    setupUI();

    function setupUI() {
        updateWallet();
        renderUserIdentity();
        renderLogros();
    }

    function sanitizeProgress(raw) {
        const base = {
            userScore: { stars: 0, coins: 0 },
            answeredQuestions: {},
            currentLevel: 1,
            ownedItems: [],
            activeCosmetics: {}
        };

        if (!raw || typeof raw !== 'object') {
            return base;
        }

        const normalized = {
            ...base,
            ...raw,
            userScore: { ...base.userScore, ...(raw.userScore || {}) },
            answeredQuestions: { ...base.answeredQuestions, ...(raw.answeredQuestions || {}) },
            activeCosmetics: { ...base.activeCosmetics, ...(raw.activeCosmetics || {}) },
            ownedItems: Array.isArray(raw.ownedItems) ? [...new Set(raw.ownedItems)] : base.ownedItems
        };

        normalized.userScore.stars = Number.isFinite(Number(normalized.userScore.stars))
            ? Number(normalized.userScore.stars)
            : 0;
        normalized.userScore.coins = Number.isFinite(Number(normalized.userScore.coins))
            ? Number(normalized.userScore.coins)
            : 0;

        return normalized;
    }

    function updateWallet() {
        if (scoreStarsElements.length) {
            scoreStarsElements.forEach(el => { el.textContent = userProgress.userScore.stars; });
        }
        if (scoreCoinsElements.length) {
            scoreCoinsElements.forEach(el => { el.textContent = userProgress.userScore.coins; });
        }
    }

    function renderUserIdentity() {
        if (!userInfo) { return; }

        userInfo.innerHTML = '';
        const avatarMeta = AVATAR_LIBRARY[userProfile.avatar?.id] || {};
        const avatarIconUrl = normalizeAssetPath(userProfile.avatar?.iconUrl || avatarMeta?.iconUrl);
        const avatarName = userProfile.avatar?.name || avatarMeta?.name || 'Avatar';

        if (avatarIconUrl) {
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarIconUrl;
            avatarImg.alt = avatarName;
            userInfo.appendChild(avatarImg);
        } else {
            const avatarPlaceholder = document.createElement('div');
            avatarPlaceholder.className = 'user-info__avatar--placeholder';
            avatarPlaceholder.textContent = '🙂';
            userInfo.appendChild(avatarPlaceholder);
        }

        const details = document.createElement('div');
        details.className = 'user-info__details';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'user-info__name';
        nameSpan.textContent = userProfile.name || 'Explorateur';
        details.appendChild(nameSpan);

        const tagline = document.createElement('span');
        tagline.className = 'user-info__tagline';
        tagline.textContent = 'Continue de collectionner des trésors magiques !';
        details.appendChild(tagline);

        userInfo.appendChild(details);
    }

    function renderLogros() {
        if (!logrosContainer) { return; }

        logrosContainer.innerHTML = '';

        const summarySection = renderSummarySection();
        logrosContainer.appendChild(summarySection);

        const { avatars, backgrounds, others, totals } = collectOwnedItems();

        const avatarSection = renderInventorySection('Mes avatars', avatars, {
            subtitle: `${avatars.length} trésor${avatars.length > 1 ? 's' : ''} débloqué${avatars.length > 1 ? 's' : ''}`,
            onApply: applyAvatar,
            type: 'avatar'
        });
        logrosContainer.appendChild(avatarSection);

        const backgroundSection = renderInventorySection('Mes fonds magiques', backgrounds, {
            subtitle: `${backgrounds.length} décor${backgrounds.length > 1 ? 's' : ''} disponibles`,
            onApply: applyBackground,
            type: 'background'
        });
        logrosContainer.appendChild(backgroundSection);

        const othersSection = renderInventorySection('Autres trésors', others, {
            subtitle: `${others.length} récompense${others.length > 1 ? 's' : ''} à admirer`
        });
        logrosContainer.appendChild(othersSection);

        const progressSection = renderProgressSection(totals.completedTopics);
        logrosContainer.appendChild(progressSection);
    }

    function renderSummarySection() {
        const section = document.createElement('section');
        section.className = 'summary-section';

        const title = document.createElement('h1');
        title.className = 'summary-title';
        title.textContent = '🌟 Mes Succès 🌟';
        section.appendChild(title);

        const summaryGrid = document.createElement('div');
        summaryGrid.className = 'summary-grid';

        const { avatars, backgrounds, others } = collectOwnedItems();
        const totalOwned = new Set(userProgress.ownedItems || []).size;

        summaryGrid.appendChild(createSummaryCard('Étoiles totales', `${userProgress.userScore.stars} ✨`));
        summaryGrid.appendChild(createSummaryCard('Pièces totales', `${userProgress.userScore.coins} 🪙`));
        summaryGrid.appendChild(createSummaryCard('Trésors collectés', `${totalOwned}`));
        summaryGrid.appendChild(createSummaryCard('Avatars disponibles', `${avatars.length}`));
        summaryGrid.appendChild(createSummaryCard('Fonds actifs', `${backgrounds.length}`));
        summaryGrid.appendChild(createSummaryCard('Autres récompenses', `${others.length}`));

        section.appendChild(summaryGrid);
        return section;
    }

    function createSummaryCard(label, value) {
        const card = document.createElement('div');
        card.className = 'summary-card';

        const labelEl = document.createElement('span');
        labelEl.className = 'summary-card__label';
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.className = 'summary-card__value';
        valueEl.textContent = value;

        card.appendChild(labelEl);
        card.appendChild(valueEl);
        return card;
    }

    function collectOwnedItems() {
        const catalogue = buildInventoryCatalogue();
        const ownedMap = new Map();

        (userProgress.ownedItems || []).forEach(itemId => {
            const item = catalogue.get(itemId);
            if (item) {
                ownedMap.set(itemId, cloneItem(item));
            }
        });

        const activeAvatarId = userProfile.avatar?.id;
        if (activeAvatarId && !ownedMap.has(activeAvatarId)) {
            const meta = catalogue.get(activeAvatarId) || createAvatarFromLibrary(activeAvatarId);
            if (meta) {
                ownedMap.set(activeAvatarId, cloneItem(meta));
            }
        }

        const activeBackgroundId = userProgress.activeCosmetics?.background;
        if (activeBackgroundId && !ownedMap.has(activeBackgroundId)) {
            const meta = catalogue.get(activeBackgroundId);
            if (meta) {
                ownedMap.set(activeBackgroundId, cloneItem(meta));
            }
        }

        const avatars = [];
        const backgrounds = [];
        const others = [];

        ownedMap.forEach(item => {
            const normalizedPreview = normalizeAssetPath(item.previewUrl || item.iconUrl || item.image);
            item.previewUrl = normalizedPreview || item.previewUrl || item.iconUrl || item.image;
            item.iconUrl = item.iconUrl || item.previewUrl || item.image;

            const baseInfo = {
                ...item,
                isActive: false,
                lockedReason: '',
                previewUrl: item.previewUrl,
                iconUrl: item.iconUrl
            };

            if (item.type === 'avatar') {
                baseInfo.isActive = userProfile.avatar?.id === item.id;
                avatars.push(baseInfo);
            } else if (item.type === 'background') {
                baseInfo.isActive = userProgress.activeCosmetics?.background === item.id;
                const incompatible = item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id;
                if (incompatible) {
                    const avatarMeta = AVATAR_LIBRARY[item.ownerAvatarId];
                    const avatarLabel = avatarMeta?.name || 'cet avatar';
                    baseInfo.lockedReason = `Équipe ${avatarLabel} pour l'utiliser.`;
                }
                backgrounds.push(baseInfo);
            } else {
                others.push(baseInfo);
            }
        });

        avatars.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        backgrounds.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        others.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

        const completedTopics = computeCompletedTopics();

        return {
            avatars,
            backgrounds,
            others,
            totals: {
                completedTopics
            }
        };
    }

    function createAvatarFromLibrary(avatarId) {
        const meta = AVATAR_LIBRARY[avatarId];
        if (!meta) { return null; }
        return normalizeItemData({
            id: meta.id,
            type: 'avatar',
            name: meta.name,
            iconUrl: meta.iconUrl,
            previewUrl: meta.iconUrl,
            image: meta.iconUrl
        });
    }

    function renderInventorySection(title, items, options = {}) {
        const section = document.createElement('section');
        section.className = 'inventory-section';

        const header = document.createElement('div');
        header.className = 'inventory-section__header';

        const heading = document.createElement('h2');
        heading.textContent = title;
        header.appendChild(heading);

        if (options.subtitle) {
            const subtitle = document.createElement('span');
            subtitle.className = 'section-subtitle';
            subtitle.textContent = options.subtitle;
            header.appendChild(subtitle);
        }

        section.appendChild(header);

        if (!items.length) {
            const empty = document.createElement('p');
            empty.className = 'inventory-empty';
            empty.textContent = 'Pas encore de trésors ici. Continue ton aventure !';
            section.appendChild(empty);
            return section;
        }

        const grid = document.createElement('div');
        grid.className = 'inventory-grid';

        items.forEach(item => {
            const card = createInventoryCard(item, options);
            grid.appendChild(card);
        });

        section.appendChild(grid);
        return section;
    }

    function createInventoryCard(item, options = {}) {
        const card = document.createElement('div');
        card.className = 'inventory-card';
        if (item.isActive) {
            card.classList.add('is-active');
            const badge = document.createElement('span');
            badge.className = 'inventory-card__badge';
            badge.textContent = 'Actuel';
            card.appendChild(badge);
        }
        if (item.lockedReason) {
            card.classList.add('is-locked');
        }

        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'inventory-card__preview';

        const previewImg = document.createElement('img');
        previewImg.src = item.previewUrl || item.iconUrl || '../assets/stickers/sticker1.png';
        previewImg.alt = item.name;
        previewWrapper.appendChild(previewImg);
        card.appendChild(previewWrapper);

        const nameEl = document.createElement('div');
        nameEl.className = 'inventory-card__name';
        nameEl.textContent = item.name;
        card.appendChild(nameEl);

        if (item.type === 'background' && item.ownerAvatarName) {
            const metaEl = document.createElement('div');
            metaEl.className = 'inventory-card__meta';
            metaEl.textContent = `Avatar : ${item.ownerAvatarName}`;
            card.appendChild(metaEl);
        } else if (item.type && ['sticker', 'badge', 'sound'].includes(item.type)) {
            const metaEl = document.createElement('div');
            metaEl.className = 'inventory-card__meta';
            const typeLabel = item.type === 'badge' ? 'Badge' : item.type === 'sound' ? 'Son' : 'Sticker';
            metaEl.textContent = typeLabel;
            card.appendChild(metaEl);
        }

        if (typeof options.onApply === 'function' && (options.type === 'avatar' || options.type === 'background')) {
            const actions = document.createElement('div');
            actions.className = 'inventory-card__actions';

            const applyButton = document.createElement('button');
            applyButton.textContent = item.isActive ? 'Équipé' : 'Appliquer';
            applyButton.disabled = item.isActive || Boolean(item.lockedReason);
            if (options.type === 'background' && !item.isActive) {
                applyButton.classList.add('apply-secondary');
            }
            if (item.lockedReason) {
                applyButton.title = item.lockedReason;
            }

            if (!applyButton.disabled) {
                applyButton.addEventListener('click', () => {
                    options.onApply(item);
                });
            }

            actions.appendChild(applyButton);
            card.appendChild(actions);
        }

        return card;
    }

    function renderProgressSection(completedTopics) {
        const section = document.createElement('section');
        section.className = 'progress-section';

        const heading = document.createElement('h2');
        heading.textContent = 'Mon progrès';
        section.appendChild(heading);

        const progressBars = document.createElement('div');
        progressBars.className = 'progress-bars';

        Object.entries(completedTopics).forEach(([topicKey, data]) => {
            if (data.completedLevels <= 0) { return; }

            const progressItem = document.createElement('div');
            progressItem.className = 'progress-item';

            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = `${data.name} (${data.completedLevels}/${data.totalLevels})`;
            progressItem.appendChild(label);

            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar-container';
            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.style.width = `${Math.min(100, data.percentage)}%`;
            bar.textContent = `${Math.round(data.percentage)}%`;

            barContainer.appendChild(bar);
            progressItem.appendChild(barContainer);
            progressBars.appendChild(progressItem);
        });

        if (!progressBars.children.length) {
            const empty = document.createElement('p');
            empty.className = 'inventory-empty';
            empty.textContent = 'Complète des niveaux pour voir ta progression ici !';
            section.appendChild(empty);
        } else {
            section.appendChild(progressBars);
        }

        return section;
    }

    function computeCompletedTopics() {
        const topics = {
            additions: { name: 'Additions', levels: 12 },
            soustractions: { name: 'Soustractions', levels: 12 },
            multiplications: { name: 'Multiplications', levels: 12 },
            colors: { name: 'Les Couleurs', levels: 12 },
            stories: { name: 'Contes Magiques', levels: 15 },
            memory: { name: 'Mémoire Magique', levels: 12 },
            sorting: { name: 'Jeu de Tri', levels: 10 },
            riddles: { name: 'Jeu d\'énigmes', levels: 10 },
            vowels: { name: 'Jeu des Voyelles', levels: 10 },
            sequences: { name: 'Jeu des Séquences', levels: 10 },
            'puzzle-magique': { name: 'Puzzle Magique', levels: 10 },
            repartis: { name: 'Répartis & Multiplie', levels: 10 },
            dictee: { name: 'Dictée Magique', levels: 10 },
            'math-blitz': { name: 'Maths Sprint', levels: 10 },
            'lecture-magique': { name: 'Lecture Magique', levels: 10 },
            raisonnement: { name: 'Raisonnement Magique', levels: 10 }
        };

        const result = {};
        Object.entries(topics).forEach(([key, info]) => {
            const completedLevels = Object.keys(userProgress.answeredQuestions || {})
                .filter(k => k.startsWith(key) && userProgress.answeredQuestions[k] === 'completed')
                .length;
            const percentage = (completedLevels / info.levels) * 100;
            result[key] = {
                ...info,
                completedLevels,
                totalLevels: info.levels,
                percentage
            };
        });
        return result;
    }

    function applyAvatar(item) {
        const iconSource = item.iconUrl || item.previewUrl || item.image || '';
        const normalizedIcon = normalizeAssetPath(iconSource);
        userProfile.avatar = { id: item.id, name: item.name, iconUrl: normalizedIcon || iconSource };
        storage.saveUserProfile(userProfile);
        dispatchProfileUpdate();
        alert(`Tu as équipé l'avatar : ${item.name}.`);
        setupUI();
    }

    function applyBackground(item) {
        if (item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id) {
            const avatarMeta = AVATAR_LIBRARY[item.ownerAvatarId];
            const avatarLabel = avatarMeta?.name || 'cet avatar';
            alert(`Ce fond est lié à ${avatarLabel}. Équipe d'abord cet avatar.`);
            return;
        }

        const activeCosmetics = userProgress.activeCosmetics || {};
        activeCosmetics.background = item.id;
        userProgress.activeCosmetics = activeCosmetics;
        userProgress.activeTheme = item.id;

        if (!userProgress.ownedItems.includes(item.id)) {
            userProgress.ownedItems.push(item.id);
        }

        storage.saveUserProgress(userProfile.name, userProgress);
        alert(`Tu as activé le fond : ${item.name}.`);
        setupUI();
    }

    function dispatchProfileUpdate() {
        try {
            document.dispatchEvent(new CustomEvent('lena:user:update', {
                detail: { ...userProfile, userScore: userProgress.userScore }
            }));
        } catch (error) {
            console.warn('[Logros] Impossible de notifier la mise à jour du profil', error);
        }
    }

    function normalizeAssetPath(path) {
        if (!path || typeof path !== 'string') { return ''; }
        const trimmed = path.trim();
        if (/^(data:|https?:|blob:)/i.test(trimmed)) { return trimmed; }
        if (trimmed.startsWith('../')) { return trimmed.replace(/\/{2,}/g, '/'); }
        if (trimmed.startsWith('./')) {
            return `../${trimmed.slice(2)}`.replace(/\/{2,}/g, '/');
        }
        const cleaned = trimmed.replace(/^\/+/, '');
        return `../${cleaned}`.replace(/\/{2,}/g, '/');
    }

    function buildInventoryCatalogue() {
        if (catalogueCache) { return catalogueCache; }

        const catalogue = new Map();

        const boutiqueGroups = window.BOUTIQUE_ITEMS
            ? Object.values(window.BOUTIQUE_ITEMS).flat()
            : [];

        boutiqueGroups.forEach(item => addItemToCatalogue(catalogue, item));
        createBadgeItems().forEach(item => addItemToCatalogue(catalogue, item));

        Object.values(AVATAR_LIBRARY).forEach(avatar => {
            addItemToCatalogue(catalogue, {
                id: avatar.id,
                type: 'avatar',
                name: avatar.name,
                iconUrl: avatar.iconUrl,
                previewUrl: avatar.iconUrl,
                image: avatar.iconUrl
            });

            if (Array.isArray(avatar.backgrounds)) {
                avatar.backgrounds.forEach(bg => {
                    addItemToCatalogue(catalogue, {
                        id: bg.id,
                        type: 'background',
                        name: bg.name,
                        ownerAvatarId: avatar.id,
                        ownerAvatarName: avatar.name,
                        iconUrl: bg.iconUrl,
                        previewUrl: bg.previewUrl,
                        image: bg.previewUrl || bg.iconUrl,
                        priceCoins: bg.priceCoins || bg.price || 120
                    });
                });
            }
        });

        catalogueCache = catalogue;
        return catalogueCache;
    }

    function addItemToCatalogue(catalogue, rawItem) {
        if (!rawItem || !rawItem.id) { return; }
        const existing = catalogue.get(rawItem.id) || {};
        const normalized = normalizeItemData({ ...existing, ...rawItem });
        catalogue.set(normalized.id, normalized);
    }

    function normalizeItemData(item) {
        const iconSource = item.iconUrl || item.image || item.previewUrl;
        const previewSource = item.previewUrl || item.iconUrl || item.image;
        return {
            ...item,
            priceCoins: item.priceCoins ?? item.price ?? 0,
            iconUrl: normalizeAssetPath(iconSource) || iconSource,
            previewUrl: normalizeAssetPath(previewSource) || previewSource,
            image: item.image || item.iconUrl || item.previewUrl
        };
    }

    function cloneItem(item) {
        return JSON.parse(JSON.stringify(item));
    }

    function createBadgeItems() {
        const base = [
            { id: 'badge-etoile', name: 'Badge Super étoile', emoji: '🌠', priceCoins: 35, description: 'Affiche une médaille étoilée près de ton nom.', colors: { background: '#FFD93D', accent: '#FFB037', text: '#4B3200' } },
            { id: 'badge-arcenciel', name: 'Badge Arc-en-ciel', emoji: '🌈', priceCoins: 45, description: 'Ajoute un arc-en-ciel magique à ton profil.', colors: { background: '#8AB6FF', accent: '#FF9AE1', text: '#1D2A58' } },
            { id: 'badge-etoiles-filantes', name: 'Badge Étoiles Filantes', emoji: '✨', priceCoins: 55, description: 'Des étoiles filantes pour célébrer tes progrès.', colors: { background: '#AC92FF', accent: '#FFD86F', text: '#2E1D52' } },
            { id: 'badge-licorne-magique', name: 'Badge Licorne Magique', emoji: '🦄', priceCoins: 70, description: 'Un badge licorne pour les plus rêveurs.', colors: { background: '#E0BBE4', accent: '#957DAD', text: '#574B60' } },
            { id: 'badge-dragon-feu', name: 'Badge Dragon de Feu', emoji: '🐲', priceCoins: 80, description: 'Montre ta force avec ce badge dragon.', colors: { background: '#FF6B6B', accent: '#EE4035', text: '#4A0505' } },
            { id: 'badge-pingouin-glace', name: 'Badge Pingouin Glacé', emoji: '🐧', priceCoins: 40, description: 'Un badge givré pour les explorateurs polaires.', colors: { background: '#BEE3FF', accent: '#4A90E2', text: '#17426B' } },
            { id: 'badge-fee-lumineuse', name: 'Badge Fée Lumineuse', emoji: '🧚', priceCoins: 65, description: 'La poussière de fée te suit dans chaque aventure.', colors: { background: '#FFE8F6', accent: '#FF9FF3', text: '#6C1A5F' } },
            { id: 'badge-robot-genial', name: 'Badge Robot Génial', emoji: '🤖', priceCoins: 50, description: 'Pour les inventeurs curieux et malins.', colors: { background: '#E0F7FA', accent: '#00BCD4', text: '#004D54' } },
            { id: 'badge-etoile-nord', name: 'Badge Étoile du Nord', emoji: '⭐', priceCoins: 90, description: 'Une étoile brillante qui guide tes missions.', colors: { background: '#2E3359', accent: '#6C63FF', text: '#F4F4FF' } }
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
        return `data:image/svg+xml,${encodeURIComponent(svg)
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')}`;
    }
});
