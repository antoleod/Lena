console.log("shopManager.js loaded");

/**
 * Manages the shop logic, including catalogue, purchases, and inventory.
 * This is designed to be a singleton instance.
 */
const shopManager = (() => {
    const AVATAR_LIBRARY = window.AVATAR_LIBRARY || {};
    let SHOP_CATALOG = null;
    let SHOP_BADGES = null;

    function svgDataUri(svg) {
        return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;
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
        return svgDataUri(svg);
    }

    function createBadgeItems() {
        if (SHOP_BADGES) return SHOP_BADGES;
        const base = [
            { id: 'badge-etoile', name: 'Badge Super Étoile', emoji: '🌟', priceCoins: 35, description: 'Affiche une médaille étoilée près de ton nom.', colors: { background: '#FFD93D', accent: '#FFB037', text: '#4B3200' } },
            { id: 'badge-arcenciel', name: 'Badge Arc-en-ciel', emoji: '🌈', priceCoins: 45, description: 'Ajoute un arc-en-ciel magique à ton profil.', colors: { background: '#8AB6FF', accent: '#FF9AE1', text: '#1D2A58' } },
            { id: 'badge-etoiles-filantes', name: 'Badge Étoiles Filantes', emoji: '💫', priceCoins: 55, description: 'Des étoiles filantes pour célébrer tes progrès.', colors: { background: '#AC92FF', accent: '#FFD86F', text: '#2E1D52' } },
            { id: 'badge-licorne-magique', name: 'Badge Licorne Magique', emoji: '🦄', priceCoins: 70, description: 'Un badge licorne pour les plus rêveurs.', colors: { background: '#E0BBE4', accent: '#957DAD', text: '#574B60' } },
            { id: 'badge-dragon-feu', name: 'Badge Dragon de Feu', emoji: '🐉', priceCoins: 80, description: 'Montre ta force avec ce badge dragon.', colors: { background: '#FF6B6B', accent: '#EE4035', text: '#4A0505' } },
            { id: 'badge-pingouin-glace', name: 'Badge Pingouin Glacé', emoji: '🐧', priceCoins: 40, description: 'Un badge givré pour les explorateurs polaires.', colors: { background: '#BEE3FF', accent: '#4A90E2', text: '#17426B' } },
            { id: 'badge-fee-lumineuse', name: 'Badge Fée Lumineuse', emoji: '🧚‍♀️', priceCoins: 65, description: 'La poussière de fée te suit dans chaque aventure.', colors: { background: '#FFE8F6', accent: '#FF9FF3', text: '#6C1A5F' } },
            { id: 'badge-robot-genial', name: 'Badge Robot Génial', emoji: '🤖', priceCoins: 50, description: 'Pour les inventeurs curieux et malins.', colors: { background: '#E0F7FA', accent: '#00BCD4', text: '#004D54' } },
            { id: 'badge-etoile-nord', name: 'Badge Étoile du Nord', emoji: '🌌', priceCoins: 90, description: 'Une étoile brillante qui guide tes missions.', colors: { background: '#2E3359', accent: '#6C63FF', text: '#F4F4FF' } }
        ];

        SHOP_BADGES = base.map(spec => ({
            ...spec,
            type: 'badge',
            iconUrl: generateBadgePreview(spec, 88),
            previewUrl: generateBadgePreview(spec, 144)
        }));
        return SHOP_BADGES;
    }

    function buildShopCatalogue() {
        if (SHOP_CATALOG) return SHOP_CATALOG;
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
        SHOP_CATALOG = catalogue;
        return SHOP_CATALOG;
    }

    function findShopItem(itemId) {
        if (!itemId) return null;
        if (!SHOP_CATALOG) buildShopCatalogue();
        return SHOP_CATALOG.get(itemId) || null;
    }

    function getShopItemsForAvatar(avatarId) {
        if (!SHOP_CATALOG) buildShopCatalogue();
        const items = [];
        if (avatarId && AVATAR_LIBRARY[avatarId]) {
            AVATAR_LIBRARY[avatarId].backgrounds?.forEach(bg => {
                const item = SHOP_CATALOG.get(bg.id);
                if (item) { items.push(item); }
            });
        }
        createBadgeItems().forEach(badge => items.push(badge));
        return items;
    }

    function getAvatarMeta(avatarId) {
        if (!avatarId) return null;
        return AVATAR_LIBRARY[avatarId] || null;
    }

    /**
     * Creates a game context for other modules to interact with the core app state.
     * @param {object} dependencies - Required dependencies { userProfile, userProgress, saveProgress, updateUI, showSuccessMessage, showErrorMessage, playSound }
     * @returns {object} - The public API for managing the shop.
     */
    function createShopInterface(dependencies) {
        const {
            userProfile,
            userProgress,
            saveProgress,
            updateUI,
            showSuccessMessage,
            showErrorMessage,
            playSound
        } = dependencies;

        if (!userProfile || !userProgress || !saveProgress || !updateUI) {
            throw new Error("ShopInterface requires userProfile, userProgress, saveProgress, and updateUI dependencies.");
        }

        function purchaseItem(itemId) {
            const item = findShopItem(itemId);
            if (!item) {
                showErrorMessage('Cet article n\'existe pas.', '');
                return;
            }
            if (userProgress.ownedItems.includes(item.id)) {
                showSuccessMessage('Tu possèdes déjà cette récompense.');
                return;
            }
            if (userProgress.userScore.coins < item.priceCoins) {
                showErrorMessage('Pas assez de pièces pour cette récompense 💰.', item.priceCoins);
                return;
            }

            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - item.priceCoins);
            userProgress.ownedItems.push(item.id);
            
            // Automatically activate the new item
            activateItem(item.id, { silent: true });

            showSuccessMessage('Nouvelle récompense débloquée ✨');
            if (playSound) playSound('coins');
            
            updateUI(); // This will trigger re-renders
            saveProgress();
        }

        function activateItem(itemId, { silent = false } = {}) {
            const item = findShopItem(itemId);
            if (!item) return;

            if (item.type === 'background' && item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id) {
                showErrorMessage('Ce fond appartient à un autre avatar.', '');
                return;
            }

            if (!userProgress.ownedItems.includes(item.id)) {
                userProgress.ownedItems.push(item.id);
            }

            userProgress.activeCosmetics[item.type] = item.id;
            
            updateUI(); // This will trigger re-renders
            saveProgress();

            if (!silent) {
                showSuccessMessage('Récompense activée ✨');
            }
        }

        function sellItem(itemId) {
            const item = findShopItem(itemId);
            if (!item) return;

            const sellPrice = Math.round(item.priceCoins * 0.5);
            userProgress.userScore.coins += sellPrice;

            userProgress.ownedItems = userProgress.ownedItems.filter(id => id !== itemId);

            // Optional: Increase price for repurchase
            const newPrice = Math.round(item.priceCoins * 1.4);
            const updatedItem = { ...item, priceCoins: newPrice };
            if (SHOP_CATALOG) SHOP_CATALOG.set(itemId, updatedItem);

            if (userProgress.activeCosmetics[item.type] === item.id) {
                userProgress.activeCosmetics[item.type] = null;
            }

            showSuccessMessage(`Tu as vendu ${item.name} pour ${sellPrice} pièces.`);
            
            updateUI();
            saveProgress();
        }

        return {
            purchaseItem,
            activateItem,
            sellItem,
        };
    }

    // Initialize catalogue on load
    buildShopCatalogue();

    // Public API
    return {
        buildShopCatalogue,
        createBadgeItems,
        findShopItem,
        getShopItemsForAvatar,
        getAvatarMeta,
        createShopInterface
    };
})();

window.shopManager = shopManager;