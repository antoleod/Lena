function buildBackgroundCatalogue() {
    const library = window.AVATAR_LIBRARY || {};
    const items = [];

    Object.values(library).forEach(avatar => {
        if (!avatar || !Array.isArray(avatar.backgrounds)) {
            return;
        }

        avatar.backgrounds.forEach(background => {
            const price = background.priceCoins || background.price || 120;
            items.push({
                id: background.id,
                name: `${background.name} (${avatar.name})`,
                price,
                priceCoins: price,
                image: background.previewUrl || background.iconUrl,
                iconUrl: background.iconUrl,
                previewUrl: background.previewUrl,
                palette: background.palette,
                motif: background.motif,
                ownerAvatarId: avatar.id,
                ownerAvatarName: avatar.name,
                type: 'background',
                rare: price >= 150
            });
        });
    });

    if (items.length) {
        return items;
    }

    // Fallback simple items if avatars are not loaded.
    return [
        { id: 'background-glow', name: 'Fond Magique', price: 140, image: '../assets/stickers/sticker1.png', type: 'background', rare: true }
    ];
}

const BOUTIQUE_ITEMS = (() => {
    const catalogue = {
        avatares: [
            { id: 'ananas', name: 'Ananas', price: 100, image: '../assets/avatars/ananas.svg', type: 'avatar' },
            { id: 'banane', name: 'Banane', price: 100, image: '../assets/avatars/banane.svg', type: 'avatar' },
            { id: 'dauphin', name: 'Dauphin', price: 150, image: '../assets/avatars/dauphin.svg', rare: true, type: 'avatar' },
            { id: 'dragon', name: 'Dragon', price: 200, image: '../assets/avatars/dragon.svg', rare: true, type: 'avatar' },
            { id: 'fraise', name: 'Fraise', price: 100, image: '../assets/avatars/fraise.svg', type: 'avatar' },
            { id: 'grenouille', name: 'Grenouille', price: 100, image: '../assets/avatars/grenouille.svg', type: 'avatar' },
            { id: 'hibou', name: 'Hibou', price: 150, image: '../assets/avatars/hibou.svg', type: 'avatar' },
            { id: 'licorne', name: 'Licorne', price: 250, image: '../assets/avatars/licorne.svg', rare: true, type: 'avatar' },
            { id: 'lion', name: 'Lion', price: 150, image: '../assets/avatars/lion.svg', type: 'avatar' },
            { id: 'panda', name: 'Panda', price: 150, image: '../assets/avatars/panda.svg', type: 'avatar' },
            { id: 'pingouin', name: 'Pingouin', price: 150, image: '../assets/avatars/pingouin.svg', type: 'avatar' },
            { id: 'pomme', name: 'Pomme', price: 100, image: '../assets/avatars/pomme.svg', type: 'avatar' },
            { id: 'renard', name: 'Renard', price: 150, image: '../assets/avatars/renard.svg', type: 'avatar' }
        ],
        stickers: [
            { id: 'sticker1', name: 'Autocollant 1', price: 50, image: '../assets/stickers/sticker1.png', type: 'sticker' },
            { id: 'sticker2', name: 'Autocollant 2', price: 50, image: '../assets/stickers/sticker2.png', type: 'sticker' },
            { id: 'sticker3', name: 'Autocollant 3', price: 75, image: '../assets/stickers/sticker3.png', rare: true, type: 'sticker' }
        ],
        sounds: [
            { id: 'correct', name: 'Son Correct', price: 100, audio: '../assets/sounds/correct.wav', type: 'sound' },
            { id: 'level-up', name: 'Son Niveau Supérieur', price: 150, audio: '../assets/sounds/level-up.wav', type: 'sound' },
            { id: 'bling', name: 'Son Bling', price: 120, audio: '../assets/sounds/bling.wav', type: 'sound' }
        ]
    };

    catalogue.backgrounds = buildBackgroundCatalogue();
    return catalogue;
})();
