document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }

    // Assurer que AVATAR_LIBRARY est chargé
    if (typeof window.AVATAR_LIBRARY === 'undefined') {
        console.error('AVATAR_LIBRARY non trouvé. Vérifiez le chargement de avatarData.js');
        // Afficher un message d'erreur à l'utilisateur
        const container = document.getElementById('magic-shop-container');
        if (container) {
            container.innerHTML = '<h1 style="color: red; text-align: center;">Erreur de chargement de la boutique !</h1><p style="text-align: center;">Veuillez vérifier la console pour les erreurs et rafraîchir la page.</p>';
        }
        return; // Bloquer l'exécution pour éviter d'autres erreurs
    }

    let userProgress = storage.loadUserProgress(userProfile.name);
    if (!userProgress.activeCosmetics || typeof userProgress.activeCosmetics !== 'object') {
        userProgress.activeCosmetics = {};
    }
    if (userProgress.activeTheme && !userProgress.activeCosmetics.background) {
        userProgress.activeCosmetics.background = userProgress.activeTheme;
    }

    applyUserTheme(userProfile.color);

    // --- Éléments DOM ---
    const userInfo = document.getElementById('user-info');
    const scoreStars = document.getElementById('scoreStars');
    const scoreCoins = document.getElementById('scoreCoins');
    const rareItemsContainer = document.getElementById('rare-items-container');
    const shopItemsContainer = document.getElementById('shop-items-container');
    const myTreasuresContainer = document.getElementById('my-treasures-container');
    const btnVolver = document.getElementById('btnVolver');
    const buySound = document.getElementById('buy-sound');
    window.audioManager?.bind(buySound);
    const particlesCanvas = document.getElementById('magic-particles');
    const ctx = particlesCanvas.getContext('2d');

    // --- Bonus de Bienvenue ---
    function grantWelcomeBonus() {
        if (!userProgress.shopVisited) {
            userProgress.userScore.coins += 50;
            userProgress.shopVisited = true;
            storage.saveUserProgress(userProfile.name, userProgress);
            alert('Bienvenue à la Boutique Magique ! ✨ Tu as reçu 50 pièces en cadeau.');
        }
    }

    function setupUI() {
        grantWelcomeBonus();
        renderUserInfo();
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
                let correctPath = avatarIconUrl.startsWith('..') ? avatarIconUrl : `../${avatarIconUrl}`;
                correctPath = correctPath.replace(/\/\//g, '/');
                avatarImg.src = correctPath;
                avatarImg.alt = avatarName;
                avatarImg.className = 'user-info__avatar';
                userInfo.appendChild(avatarImg);
            }

            const nameSpan = document.createElement('span');
            nameSpan.className = 'user-info__name';
            nameSpan.textContent = userProfile.name || 'Explorateur';
            userInfo.appendChild(nameSpan);
        }

        if (scoreStars) scoreStars.textContent = userProgress.userScore.stars;
        if (scoreCoins) scoreCoins.textContent = userProgress.userScore.coins;
    }

    function renderAllItems() {
        rareItemsContainer.innerHTML = '';
        shopItemsContainer.innerHTML = '';
        myTreasuresContainer.innerHTML = '';

        const allItems = Object.values(BOUTIQUE_ITEMS).flat();

        allItems.forEach(item => {
            const owned = userProgress.ownedItems.includes(item.id);
            const card = createItemCard(item, owned ? 'owned' : 'shop');
            if (!card) return;

            if (owned) {
                myTreasuresContainer.appendChild(card);
            } else if (item.rare) {
                rareItemsContainer.appendChild(card);
            } else {
                shopItemsContainer.appendChild(card);
            }
        });
    }

    function createItemCard(item, context) {
        if (!item || !item.id) return null;

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        if (item.rare) itemCard.classList.add('rare');

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
            itemPrice.textContent = `${item.price} 🪙`;
            itemCard.appendChild(itemPrice);

            const buyButton = document.createElement('button');
            buyButton.className = 'btn-action';
            buyButton.textContent = 'Acheter';
            buyButton.onclick = (e) => { e.stopPropagation(); buyItem(item); };
            itemButtons.appendChild(buyButton);

        } else if (context === 'owned') {
            const useButton = document.createElement('button');
            useButton.className = 'btn-action use';
            useButton.textContent = 'Utiliser';
            const activeCosmetics = userProgress.activeCosmetics || {};
            const isCurrentAvatar = item.type === 'avatar' && userProfile.avatar?.id === item.id;
            const isCurrentTheme = item.type === 'theme' && userProgress.activeTheme === item.id;
            const isCurrentBackground = item.type === 'background' && activeCosmetics.background === item.id;
            const incompatibleBackground = item.type === 'background'
                && item.ownerAvatarId
                && item.ownerAvatarId !== userProfile.avatar?.id;

            if (isCurrentAvatar || isCurrentTheme || isCurrentBackground) {
                useButton.textContent = 'Équipé';
                useButton.disabled = true;
            } else if (item.type === 'avatar' || item.type === 'theme' || item.type === 'background') {
                if (incompatibleBackground) {
                    useButton.textContent = 'Avatar requis';
                    useButton.disabled = true;
                    useButton.title = 'Equipe d\'abord l\'avatar lié pour utiliser ce fond.';
                } else {
                    useButton.onclick = (e) => { e.stopPropagation(); useItem(item); };
                }
            } else {
                useButton.disabled = true;
                useButton.title = 'Utilisation bientôt disponible !';
            }
            itemButtons.appendChild(useButton);

            const sellButton = document.createElement('button');
            sellButton.className = 'btn-action sell';
            const sellPrice = Math.ceil(item.price * 0.5);
            sellButton.textContent = `Vendre (+${sellPrice} 🪙)`;
            sellButton.onclick = (e) => { e.stopPropagation(); sellItem(item, sellPrice); };
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
            
            if (!window.audioManager?.isMuted) {
                buySound.play();
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
            userProfile.avatar = { id: 'ananas', name: 'Ananas', iconUrl: 'assets/avatars/ananas.svg' };
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
            const normalizedIcon = iconSource.startsWith('../') ? iconSource.replace('../', '') : iconSource;
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
        window.location.href = '../index.html';
    });

    // Initialiser
    setupUI();
    animateParticles();
});
