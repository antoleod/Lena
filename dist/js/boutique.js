document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    if (!userProfile) {
        window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
        return;
    }

    if (userProfile.avatar?.iconUrl) {
        const normalizedAvatarIcon = normalizeAssetPath(userProfile.avatar.iconUrl);
        if (normalizedAvatarIcon && normalizedAvatarIcon !== userProfile.avatar.iconUrl) {
            userProfile.avatar.iconUrl = normalizedAvatarIcon;
            storage.saveUserProfile(userProfile);
        }
    }

    // Assurer que AVATAR_LIBRARY est chargé
    if (typeof window.AVATAR_LIBRARY === 'undefined') {
        console.error('AVATAR_LIBRARY non trouvé. Vérifiez le chargement de avatarData.js');
        const t = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);
        // Afficher un message d'erreur à l'utilisateur
        const container = document.getElementById('magic-shop-container');
        if (container) {
            const title = t('shopLoadErrorTitle', 'Erreur de chargement de la boutique !');
            const body = t('shopLoadErrorBody', 'Veuillez vérifier la console pour les erreurs et rafraîchir la page.');
            container.innerHTML = `<h1 style="color: red; text-align: center;">${title}</h1><p style="text-align: center;">${body}</p>`;
        }
        return; // Bloquer l'exécution pour éviter d'autres erreurs
    }

    let userProgress = storage.loadUserProgress(userProfile.name);
    let progressUpdated = false;
    if (!userProgress || typeof userProgress !== 'object') {
        userProgress = {
            userScore: { stars: 0, coins: 0 },
            ownedItems: [],
            activeCosmetics: {},
            answeredQuestions: {}
        };
        progressUpdated = true;
    }
    if (!userProgress.userScore || typeof userProgress.userScore !== 'object') {
        userProgress.userScore = { stars: 0, coins: 0 };
        progressUpdated = true;
    }
    userProgress.userScore.stars = Number.isFinite(Number(userProgress.userScore.stars))
        ? Number(userProgress.userScore.stars)
        : 0;
    userProgress.userScore.coins = Number.isFinite(Number(userProgress.userScore.coins))
        ? Number(userProgress.userScore.coins)
        : 0;
    if (!Array.isArray(userProgress.ownedItems)) {
        userProgress.ownedItems = [];
        progressUpdated = true;
    }
    if (!userProgress.activeCosmetics || typeof userProgress.activeCosmetics !== 'object') {
        userProgress.activeCosmetics = {};
        progressUpdated = true;
    }
    if (userProgress.activeTheme && !userProgress.activeCosmetics.background) {
        userProgress.activeCosmetics.background = userProgress.activeTheme;
        progressUpdated = true;
    }
    if (progressUpdated) {
        storage.saveUserProgress(userProfile.name, userProgress);
    }

    applyUserTheme(userProfile.color);

    // --- Éléments DOM ---
    const userInfo = document.getElementById('user-info');
    const scoreStarsElements = [
        document.getElementById('scoreStars'),
        document.getElementById('stars')
    ].filter(Boolean);
    const scoreCoinsElements = [
        document.getElementById('scoreCoins'),
        document.getElementById('coins')
    ].filter(Boolean);
    const rareItemsContainer = document.getElementById('rare-items-container');
    const shopItemsContainer = document.getElementById('shop-items-container');
    const myTreasuresContainer = document.getElementById('my-treasures-container');
    const btnVolver = document.getElementById('btnVolver');
    const buySound = document.getElementById('buy-sound');
    window.audioManager?.bind(buySound);
    const particlesCanvas = document.getElementById('magic-particles');
    const ctx = particlesCanvas.getContext('2d');
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn')) || [];
    let activeFilter = 'all';

    // --- Bonus de Bienvenue ---
    function grantWelcomeBonus() {
        if (!userProgress.shopVisited) {
            userProgress.userScore.coins += 50;
            userProgress.shopVisited = true;
            storage.saveUserProgress(userProfile.name, userProgress);
            alert('Bienvenue à la Boutique Magique ! ✨ Tu as reçu 50 pièces en cadeau.');
        }
    }


    function matchesFilter(item, owned) {
        if (activeFilter === 'all') { return true; }
        if (activeFilter === 'owned') { return owned; }
        return item.type === activeFilter;
    }

    function setEmptyState(container, message) {
        if (!container) { return; }
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = message;
        container.appendChild(empty);
    }

    function normalizeAssetPath(path) {
        if (!path || typeof path !== 'string') { return ''; }
        const trimmed = path.trim();
        if (/^(data:|https?:|blob:)/.test(trimmed)) { return trimmed; }
        if (trimmed.startsWith('../')) { return trimmed.replace(/\/{2,}/g, '/'); }
        if (trimmed.startsWith('./')) {
            return `../${trimmed.slice(2)}`.replace(/\/{2,}/g, '/');
        }
        const cleaned = trimmed.replace(/^\/+/, '');
        return `../${cleaned}`.replace(/\/{2,}/g, '/');
    }

    function setupFilters() {
        if (!filterButtons.length) { return; }
        const defaultButton = filterButtons.find(btn => btn.classList.contains('is-active')) || filterButtons[0] || null;
        activeFilter = defaultButton && defaultButton.dataset ? (defaultButton.dataset.filter || 'all') : 'all';
        filterButtons.forEach(btn => btn.classList.toggle('is-active', btn === defaultButton));
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetFilter = button.dataset.filter || 'all';
                if (activeFilter === targetFilter) { return; }
                activeFilter = targetFilter;
                filterButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
                renderAllItems();
                if (activeFilter === 'owned') {
                    const treasuresSection = document.querySelector('.my-treasures');
                    if (treasuresSection && typeof treasuresSection.scrollIntoView === 'function') {
                        treasuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    function setupUI() {
        grantWelcomeBonus();
        renderUserInfo();
        setupFilters();
        renderAllItems();
        setupParticles();
    }

    function renderUserInfo() {
        if (userInfo) {
            userInfo.innerHTML = '';
            const avatarId = userProfile.avatar?.id || 'ananas';
            userInfo.dataset.avatarId = avatarId;

            const avatarMeta = window.AVATAR_LIBRARY[avatarId] || window.AVATAR_LIBRARY['ananas'];
            const avatarIconUrl = userProfile.avatar?.iconUrl || avatarMeta?.iconUrl;
            const avatarName = userProfile.avatar?.name || avatarMeta?.name || 'Avatar';

            if (avatarIconUrl) {
                const avatarImg = document.createElement('img');
                const normalizedIcon = normalizeAssetPath(avatarIconUrl) || avatarIconUrl;
                avatarImg.src = normalizedIcon;
                avatarImg.alt = avatarName;
                avatarImg.className = 'user-info__avatar';
                userInfo.appendChild(avatarImg);
            } else {
                const avatarPlaceholder = document.createElement('div');
                avatarPlaceholder.className = 'user-info__avatar user-info__avatar--placeholder';
                avatarPlaceholder.textContent = '🙂';
                userInfo.appendChild(avatarPlaceholder);
            }

            const nameSpan = document.createElement('span');
            nameSpan.className = 'user-info__name';
            nameSpan.textContent = userProfile.name || 'Explorateur';
            userInfo.appendChild(nameSpan);

            const tagline = document.createElement('span');
            tagline.className = 'user-info__tagline';
            tagline.textContent = 'Pret pour de nouvelles trouvailles !';
            userInfo.appendChild(tagline);
        }

        if (scoreStarsElements.length) {
            const stars = userProgress.userScore.stars;
            scoreStarsElements.forEach(el => { el.textContent = stars; });
        }
        if (scoreCoinsElements.length) {
            const coins = userProgress.userScore.coins;
            scoreCoinsElements.forEach(el => { el.textContent = coins; });
        }
    }



    function renderAllItems() {
        if (!rareItemsContainer || !shopItemsContainer || !myTreasuresContainer) { return; }
        rareItemsContainer.innerHTML = '';
        shopItemsContainer.innerHTML = '';
        myTreasuresContainer.innerHTML = '';

        const allItems = Object.values(BOUTIQUE_ITEMS).flat();
        const isOwnedFilter = activeFilter === 'owned';
        let rareCount = 0;
        let shopCount = 0;
        let ownedCount = 0;

        allItems.forEach(item => {
            const owned = userProgress.ownedItems.includes(item.id);
            if (!matchesFilter(item, owned)) { return; }
            const card = createItemCard(item, owned ? 'owned' : 'shop');
            if (!card) { return; }

            if (owned) {
                myTreasuresContainer.appendChild(card);
                ownedCount += 1;
            } else if (item.rare) {
                rareItemsContainer.appendChild(card);
                rareCount += 1;
            } else {
                shopItemsContainer.appendChild(card);
                shopCount += 1;
            }
        });

        if (!rareCount && !isOwnedFilter) { setEmptyState(rareItemsContainer, "Aucun objet rare pour le moment, reviens demain !"); }
        if (!shopCount && !isOwnedFilter) { setEmptyState(shopItemsContainer, "Aucun article ne correspond a ce filtre."); }
        if (!ownedCount) { setEmptyState(myTreasuresContainer, "Tu n'as pas encore d'objet dans cette categorie."); }
    }

    function createItemCard(item, context) {
        if (!item || !item.id) {
            return null;
        }

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        if (item.rare) {
            itemCard.classList.add('rare');
        }

        const itemImage = document.createElement('img');
        itemImage.src = item.image || '../assets/stickers/sticker1.png';
        itemImage.alt = item.name;
        itemCard.appendChild(itemImage);

        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        itemCard.appendChild(itemName);

        if (item.type === 'background' && item.ownerAvatarName) {
            const ownerTag = document.createElement('div');
            ownerTag.className = 'item-tag';
            ownerTag.textContent = `Avatar : ${item.ownerAvatarName}`;
            itemCard.appendChild(ownerTag);
        }

        const itemButtons = document.createElement('div');
        itemButtons.className = 'item-buttons';

        if (context === 'shop') {
            const itemPrice = document.createElement('div');
            itemPrice.className = 'item-price';
            itemPrice.innerHTML = `<span class="price-value">${item.price}</span><span aria-hidden="true">\uD83E\uDE99</span>`;
            itemPrice.setAttribute('aria-label', `${item.price} pi\u00E8ces`);
            itemCard.appendChild(itemPrice);

            const buyButton = document.createElement('button');
            buyButton.className = 'btn-action';
            buyButton.textContent = 'Acheter';
            buyButton.onclick = (event) => { event.stopPropagation(); buyItem(item); };
            if (userProgress.userScore.coins < item.price) {
                buyButton.disabled = true;
                buyButton.textContent = 'Pi\u00E8ces insuffisantes';
            }
            itemButtons.appendChild(buyButton);
        } else if (context === 'owned') {
            const useButton = document.createElement('button');
            const activeCosmetics = userProgress.activeCosmetics || {};
            const isCurrentAvatar = item.type === 'avatar' && userProfile.avatar?.id === item.id;
            const isCurrentTheme = item.type === 'theme' && userProgress.activeTheme === item.id;
            const isCurrentBackground = item.type === 'background' && activeCosmetics.background === item.id;
            const incompatibleBackground = item.type === 'background'
                && item.ownerAvatarId
                && item.ownerAvatarId !== userProfile.avatar?.id;

            if (isCurrentAvatar || isCurrentBackground) {
                useButton.className = 'btn-action';
                useButton.textContent = '\u00C9quip\u00E9';
                useButton.disabled = true;
            } else if (['avatar', 'theme', 'background', 'sticker', 'sound'].includes(item.type)) {
                useButton.className = 'btn-action use';
                if (incompatibleBackground) {
                    useButton.textContent = 'Avatar requis';
                    useButton.disabled = true;
                    useButton.title = '\u00C9quipe d\'abord l\'avatar li\u00E9 pour utiliser ce fond.';
                } else {
                    useButton.textContent = 'Utiliser';
                    useButton.onclick = (event) => { event.stopPropagation(); useItem(item); };
                }
            } else {
                useButton.className = 'btn-action';
                useButton.disabled = true;
                useButton.title = 'Utilisation bient\u00F4t disponible !';
            }
            itemButtons.appendChild(useButton);

            const sellButton = document.createElement('button');
            sellButton.className = 'btn-action sell';
            const sellPrice = Math.ceil(item.price * 0.5);
            sellButton.textContent = `Revendre (+${sellPrice} \uD83E\uDE99)`;
            sellButton.onclick = (event) => {
                event.stopPropagation();
                if (confirm(`Es-tu s\u00FBr(e) de vouloir vendre ${item.name} pour ${sellPrice} pi\u00E8ces ?`)) {
                    sellItem(item, sellPrice);
                }
            };
            itemButtons.appendChild(sellButton);
        }

        itemCard.appendChild(itemButtons);
        return itemCard;
    }

    function buyItem(item) {
        if (userProgress.userScore.coins >= item.price) {
            userProgress.userScore.coins -= item.price;
            if (!userProgress.ownedItems.includes(item.id)) {
                userProgress.ownedItems.push(item.id);
            }
            storage.saveUserProgress(userProfile.name, userProgress);

            if (buySound && typeof buySound.play === 'function') {
                try {
                    buySound.currentTime = 0;
                    buySound.play().catch(() => {});
                } catch (error) {
                    console.warn('Audio playback failed', error);
                }
            }
            triggerMagicEffect();

            alert(`Tu as acheté ${item.name} !`);
            renderAllItems();
            renderUserInfo();
        } else {
            alert('Tu n\'as pas assez de pièces.');
        }
    }

    function sellItem(item, sellPrice) {
        userProgress.userScore.coins += sellPrice;
        userProgress.ownedItems = userProgress.ownedItems.filter(id => id !== item.id);

        if (item.type === 'avatar' && userProfile.avatar?.id === item.id) {
            userProfile.avatar = {
                id: 'ananas',
                name: 'Ananas',
                iconUrl: normalizeAssetPath('../assets/avatars/ananas.svg')
            };
            storage.saveUserProfile(userProfile);
        }

        if (item.type === 'theme' && userProgress.activeTheme === item.id) {
            userProgress.activeTheme = null;
        }

        if (item.type === 'background') {
            const activeCosmetics = userProgress.activeCosmetics || {};
            if (activeCosmetics.background === item.id) {
                activeCosmetics.background = null;
            }
            userProgress.activeCosmetics = activeCosmetics;
        }

        storage.saveUserProgress(userProfile.name, userProgress);

        alert(`Tu as vendu ${item.name} pour ${sellPrice} pièces !`);
        renderAllItems();
        renderUserInfo();
    }

    function useItem(item) {
        if (item.type === 'avatar') {
            const iconSource = item.iconUrl || item.image || '';
            const normalizedIcon = normalizeAssetPath(iconSource);
            userProfile.avatar = { id: item.id, name: item.name, iconUrl: normalizedIcon };
            storage.saveUserProfile(userProfile);
            applyUserTheme(userProfile.color);
            alert(`Tu as équipé l'avatar: ${item.name}. Super look !`);
            renderAllItems();
            renderUserInfo();
        } else if (item.type === 'theme') {
            userProgress.activeTheme = item.id;
            storage.saveUserProgress(userProfile.name, userProgress);
            alert(`Tu as activé le thème: ${item.name}. Magique !`);
            renderAllItems();
        } else if (item.type === 'background') {
            const activeCosmetics = userProgress.activeCosmetics || {};
            const needsMatchingAvatar = item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id;
            if (needsMatchingAvatar) {
                const avatarMeta = window.AVATAR_LIBRARY?.[item.ownerAvatarId];
                const avatarLabel = avatarMeta?.name || 'cet avatar';
                alert(`Ce fond est lié à ${avatarLabel}. Change d'avatar pour l'utiliser.`);
                return;
            }
            activeCosmetics.background = item.id;
            userProgress.activeCosmetics = activeCosmetics;
            userProgress.activeTheme = item.id;
            storage.saveUserProgress(userProfile.name, userProgress);
            alert(`Tu as activé le fond: ${item.name}. Magique !`);
            renderAllItems();
        } else if (item.type === 'sticker') {
            alert(`L'autocollant "${item.name}" est dans ta collection ! Tu peux le voir dans tes trésors et sur la page des réussites.`);
            renderAllItems();
        } else if (item.type === 'sound') {
            if (item.audio) {
                const sound = new Audio(item.audio);
                sound.play();
            }
            alert(`Tu as écouté : ${item.name}`);
        } else {
            alert(`L'utilisation de cet objet n'est pas encore disponible.`);
        }
    }

    function applyUserTheme(color) {
        const accent = color || '#a890f0';
        document.documentElement.style.setProperty('--primary', accent);
        document.documentElement.style.setProperty('--primary-light', lightenColor(accent, 0.22));
        document.documentElement.style.setProperty('--primary-contrast', getReadableTextColor(accent));
    }

    function lightenColor(hex, amount = 0.2) {
        if (!hex || typeof hex !== 'string') { return '#ffffff'; }
        const normalized = normalizeHex(hex);
        if (!normalized) { return '#ffffff'; }

        let ratio = amount;
        if (!Number.isFinite(ratio)) { ratio = 0.2; }
        if (ratio > 1) { ratio = ratio / 100; }
        ratio = Math.min(Math.max(ratio, 0), 1);

        const r = parseInt(normalized.slice(1, 3), 16);
        const g = parseInt(normalized.slice(3, 5), 16);
        const b = parseInt(normalized.slice(5, 7), 16);

        const mix = channel => Math.round(channel + (255 - channel) * ratio)
            .toString(16)
            .padStart(2, '0');

        return `#${mix(r)}${mix(g)}${mix(b)}`;
    }

    function getReadableTextColor(hex) {
        const normalized = normalizeHex(hex);
        if (!normalized) { return '#2f1d4f'; }

        const r = parseInt(normalized.slice(1, 3), 16) / 255;
        const g = parseInt(normalized.slice(3, 5), 16) / 255;
        const b = parseInt(normalized.slice(5, 7), 16) / 255;

        const luminance = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
        return luminance > 0.65 ? '#2f1d4f' : '#ffffff';
    }

    function normalizeHex(color) {
        if (!color || typeof color !== 'string') { return ''; }
        let value = color.trim().toLowerCase();
        if (!value.startsWith('#')) { value = `#${value}`; }
        if (value.length === 4) {
            value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
        }
        return value.length === 7 ? value : '';
    }

    function linearise(channel) {
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    }

    // --- Effets Magiques ---
    let particles = [];
    function setupParticles() {
        if (!particlesCanvas) return;
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        });
    }

    function triggerMagicEffect() {
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * particlesCanvas.width,
                y: Math.random() * particlesCanvas.height,
                size: Math.random() * 5 + 2,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: `hsl(${Math.random() * 360}, 100%, 75%)`,
                life: 100
            });
        }
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life--;

            if (p.life > 0) {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    }

    btnVolver.addEventListener('click', () => {
        window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
    });

    // Initialiser
    setupUI();
    animateParticles();
});
