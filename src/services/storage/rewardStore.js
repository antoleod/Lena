const STORAGE_KEY = 'lena:rewards:v1';

const themeRewards = [
  { id: 'theme-candy', type: 'theme', name: 'Nuage sucre', nameNl: 'Suikerwolk', price: 42, icon: '🍭', preview: ['#ff8fc6', '#ffd977', '#8dd8ff'] },
  { id: 'theme-ocean', type: 'theme', name: 'Lagune claire', nameNl: 'Heldere lagune', price: 48, icon: '🌊', preview: ['#5bc6ff', '#7be4c8', '#fff1a8'] },
  { id: 'theme-sunset', type: 'theme', name: 'Coucher dore', nameNl: 'Gouden zonsondergang', price: 52, icon: '🌇', preview: ['#ff9a76', '#ffd670', '#ff8fc6'] },
  { id: 'theme-forest', type: 'theme', name: 'Foret douce', nameNl: 'Zacht bos', price: 56, icon: '🌲', preview: ['#7dd7a1', '#d9f4a4', '#8ac7ff'] },
  { id: 'theme-galaxy', type: 'theme', name: 'Galaxie brillante', nameNl: 'Stralend heelal', price: 60, icon: '✨', preview: ['#8e8dff', '#ff9ad1', '#7ed7ff'] },
  { id: 'theme-castle', type: 'theme', name: 'Chateau pastel', nameNl: 'Pastelkasteel', price: 58, icon: '🏰', preview: ['#d1b8ff', '#ffd5ef', '#ffe79f'] },
  { id: 'theme-garden', type: 'theme', name: 'Jardin lumineux', nameNl: 'Lichte tuin', price: 54, icon: '🌸', preview: ['#7fe2bf', '#ffdba8', '#ffa9d0'] },
  { id: 'theme-comet', type: 'theme', name: 'Comete magique', nameNl: 'Magische komeet', price: 62, icon: '☄️', preview: ['#6cc9ff', '#b89eff', '#ffd780'] }
];

const wallpaperRewards = [
  { id: 'wallpaper-dreamy-sky', type: 'wallpaper', name: 'Ciel reveur', nameNl: 'Dromerige lucht', price: 24, icon: '☁️', preview: ['#fff5fe', '#eaf4ff', '#fff0c9'] },
  { id: 'wallpaper-rainbow-mist', type: 'wallpaper', name: 'Brume arc en ciel', nameNl: 'Regenboognevel', price: 28, icon: '🌈', preview: ['#ffe8f6', '#eef7ff', '#fff3ba'] },
  { id: 'wallpaper-coral-breeze', type: 'wallpaper', name: 'Brise corail', nameNl: 'Koraalbries', price: 28, icon: '🪸', preview: ['#fff1ea', '#ffe3f1', '#fef6d8'] },
  { id: 'wallpaper-mint-meadow', type: 'wallpaper', name: 'Prairie menthe', nameNl: 'Muntweide', price: 30, icon: '🍃', preview: ['#effff8', '#dff4ee', '#fff8d8'] },
  { id: 'wallpaper-star-camp', type: 'wallpaper', name: 'Camp des etoiles', nameNl: 'Sterrenkamp', price: 32, icon: '🌟', preview: ['#eef0ff', '#fbe9ff', '#fff2ba'] },
  { id: 'wallpaper-snow-glow', type: 'wallpaper', name: 'Lueur de neige', nameNl: 'Sneeuwgloed', price: 30, icon: '❄️', preview: ['#f9fdff', '#eef5ff', '#fff7fe'] }
];

const effectRewards = [
  { id: 'effect-rain', type: 'effect', name: 'Pluie douce', nameNl: 'Zachte regen', price: 38, icon: '🌧️', preview: ['rain'] },
  { id: 'effect-rainbow', type: 'effect', name: 'Arc en ciel', nameNl: 'Regenboog', price: 44, icon: '🌈', preview: ['rainbow'] },
  { id: 'effect-snow', type: 'effect', name: 'Neige legere', nameNl: 'Lichte sneeuw', price: 40, icon: '❄️', preview: ['snow'] }
];

const stickerRewards = [
  { id: 'sticker-rainbow', type: 'sticker', name: 'Arc en ciel', nameNl: 'Regenboog', price: 24, assetPath: 'assets/stickers/sticker-arcenciel.svg' },
  { id: 'sticker-star', type: 'sticker', name: 'Etoile brillante', nameNl: 'Sterrensticker', price: 18, assetPath: 'assets/stickers/sticker-etoile.svg' },
  { id: 'sticker-gem', type: 'sticker', name: 'Gemme magique', nameNl: 'Magische edelsteen', price: 20, assetPath: 'assets/stickers/sticker-gemme.svg' },
  { id: 'sticker-potion', type: 'sticker', name: 'Potion douce', nameNl: 'Zachte toverdrank', price: 22, assetPath: 'assets/stickers/sticker-potion.svg' },
  { id: 'sticker-sunshine', type: 'sticker', name: 'Soleil joyeux', nameNl: 'Blije zon', price: 16, icon: '☀️' },
  { id: 'sticker-heart', type: 'sticker', name: 'Coeur tendre', nameNl: 'Lief hart', price: 16, icon: '💖' },
  { id: 'sticker-cloud', type: 'sticker', name: 'Nuage moelleux', nameNl: 'Wolkje', price: 15, icon: '☁️' },
  { id: 'sticker-moon', type: 'sticker', name: 'Lune pastel', nameNl: 'Pastelmaan', price: 17, icon: '🌙' }
];

const avatarRewards = [
  { id: 'avatar-unicorn', type: 'avatar', name: 'Licorne', nameNl: 'Eenhoorn', price: 32, assetPath: 'assets/avatars/licorne.svg' },
  { id: 'avatar-panda', type: 'avatar', name: 'Panda', nameNl: 'Panda', price: 28, assetPath: 'assets/avatars/panda.svg' },
  { id: 'avatar-dragon', type: 'avatar', name: 'Petit dragon', nameNl: 'Kleine draak', price: 36, assetPath: 'assets/avatars/dragon.svg' },
  { id: 'avatar-owl', type: 'avatar', name: 'Petit hibou', nameNl: 'Kleine uil', price: 30, assetPath: 'assets/avatars/hibou.svg' },
  { id: 'avatar-fox', type: 'avatar', name: 'Petit renard', nameNl: 'Kleine vos', price: 34, assetPath: 'assets/avatars/renard.svg' },
  { id: 'avatar-lion', type: 'avatar', name: 'Petit lion', nameNl: 'Kleine leeuw', price: 34, assetPath: 'assets/avatars/lion.svg' },
  { id: 'avatar-dolphin', type: 'avatar', name: 'Dauphin', nameNl: 'Dolfijn', price: 32, assetPath: 'assets/avatars/dauphin.svg' },
  { id: 'avatar-frog', type: 'avatar', name: 'Grenouille', nameNl: 'Kikker', price: 26, assetPath: 'assets/avatars/grenouille.svg' },
  { id: 'avatar-penguin', type: 'avatar', name: 'Pingouin', nameNl: 'Pinguin', price: 28, assetPath: 'assets/avatars/pingouin.svg' },
  { id: 'avatar-apple', type: 'avatar', name: 'Pomme', nameNl: 'Appel', price: 24, assetPath: 'assets/avatars/pomme.svg' },
  { id: 'avatar-banana', type: 'avatar', name: 'Banane', nameNl: 'Banaan', price: 24, assetPath: 'assets/avatars/banane.svg' },
  { id: 'avatar-pineapple', type: 'avatar', name: 'Ananas', nameNl: 'Ananas', price: 24, assetPath: 'assets/avatars/ananas.svg' },
  { id: 'avatar-strawberry', type: 'avatar', name: 'Fraise', nameNl: 'Aardbei', price: 24, assetPath: 'assets/avatars/fraise.svg' }
];

const accessoryRewards = [
  { id: 'accessory-crown', type: 'accessory', name: 'Couronne de sucre', nameNl: 'Suikerkroon', price: 20, icon: '👑' },
  { id: 'accessory-wand', type: 'accessory', name: 'Baguette magique', nameNl: 'Toverstaf', price: 22, icon: '🪄' },
  { id: 'accessory-backpack', type: 'accessory', name: 'Sac d explorateur', nameNl: 'Ontdekkersrugzak', price: 18, icon: '🎒' },
  { id: 'accessory-bow', type: 'accessory', name: 'Noeud pastel', nameNl: 'Pastelstrik', price: 14, icon: '🎀' },
  { id: 'accessory-glasses', type: 'accessory', name: 'Lunettes etoilees', nameNl: 'Sterrenbril', price: 16, icon: '🕶️' },
  { id: 'accessory-cape', type: 'accessory', name: 'Cape douce', nameNl: 'Zachte cape', price: 20, icon: '🦸' },
  { id: 'accessory-boots', type: 'accessory', name: 'Bottes de pluie', nameNl: 'Regenlaarsjes', price: 15, icon: '🥾' },
  { id: 'accessory-lantern', type: 'accessory', name: 'Lanterne brillante', nameNl: 'Lichtlantaarn', price: 19, icon: '🏮' }
];

const petRewards = [
  { id: 'pet-cloudy', type: 'pet', name: 'Nuage ami', nameNl: 'Wolkmaatje', price: 28, icon: '☁️' },
  { id: 'pet-spark', type: 'pet', name: 'Etincelle', nameNl: 'Sprankel', price: 30, icon: '✨' },
  { id: 'pet-shell', type: 'pet', name: 'Coquillage', nameNl: 'Schelpie', price: 26, icon: '🐚' },
  { id: 'pet-berry', type: 'pet', name: 'Baie magique', nameNl: 'Magische bes', price: 26, icon: '🫐' },
  { id: 'pet-comet', type: 'pet', name: 'Mini comete', nameNl: 'Mini komeet', price: 32, icon: '🌠' }
];

const rewardCatalog = [
  ...themeRewards,
  ...wallpaperRewards,
  ...effectRewards,
  ...stickerRewards,
  ...avatarRewards,
  ...accessoryRewards,
  ...petRewards
];

function defaultStore() {
  return {
    balance: 0,
    inventory: [],
    purchases: [],
    rewardsByActivity: {},
    missionRewards: {},
    equippedThemeId: 'theme-candy',
    equippedEffectId: 'effect-rainbow',
    equippedWallpaperId: 'wallpaper-dreamy-sky'
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStore();
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultStore(),
      ...parsed,
      missionRewards: parsed.missionRewards || {}
    };
  } catch {
    return defaultStore();
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event('lena-rewards-change'));
  } catch {
    // ignore persistence failures
  }
}

export function getRewardCatalog() {
  return rewardCatalog;
}

export function getRewardState() {
  return readStore();
}

export function rewardActivityCompletion(activityId, result) {
  const store = readStore();
  const previousReward = store.rewardsByActivity[activityId] || 0;
  const score = result.lastScore || 0;
  const bonus = result.completed ? 6 : 0;
  const crystals = Math.max(4, score + bonus);
  const delta = Math.max(0, crystals - previousReward);

  store.balance += delta;
  store.rewardsByActivity[activityId] = Math.max(previousReward, crystals);
  writeStore(store);

  return {
    awarded: delta,
    balance: store.balance
  };
}

export function rewardMissionCompletion(missionKey, { perfect = false } = {}) {
  const store = readStore();
  if (store.missionRewards[missionKey]) {
    return {
      awarded: 0,
      balance: store.balance
    };
  }

  const crystals = perfect ? 24 : 18;
  store.balance += crystals;
  store.missionRewards[missionKey] = {
    awarded: crystals,
    perfect,
    completedAt: Date.now()
  };
  writeStore(store);

  return {
    awarded: crystals,
    balance: store.balance
  };
}

export function buyReward(itemId) {
  const store = readStore();
  const item = rewardCatalog.find((entry) => entry.id === itemId);

  if (!item) {
    return { ok: false, reason: 'missing-item' };
  }

  if (store.inventory.includes(itemId)) {
    return { ok: false, reason: 'owned-item' };
  }

  if (store.balance < item.price) {
    return { ok: false, reason: 'not-enough-crystals' };
  }

  store.balance -= item.price;
  store.inventory.push(itemId);
  store.purchases.push({
    itemId,
    purchasedAt: Date.now()
  });

  if (item.type === 'theme' && !store.equippedThemeId) {
    store.equippedThemeId = item.id;
  }

  writeStore(store);

  return {
    ok: true,
    balance: store.balance
  };
}

export function equipTheme(themeId) {
  const store = readStore();

  if (themeId !== 'theme-candy' && !store.inventory.includes(themeId)) {
    return { ok: false, reason: 'theme-not-owned' };
  }

  store.equippedThemeId = themeId;
  writeStore(store);
  return { ok: true, themeId };
}

export function equipEffect(effectId) {
  const store = readStore();
  if (effectId !== 'effect-rainbow' && !store.inventory.includes(effectId)) {
    return { ok: false, reason: 'effect-not-owned' };
  }
  store.equippedEffectId = effectId;
  writeStore(store);
  return { ok: true, effectId };
}

export function equipWallpaper(wallpaperId) {
  const store = readStore();
  if (wallpaperId !== 'wallpaper-dreamy-sky' && !store.inventory.includes(wallpaperId)) {
    return { ok: false, reason: 'wallpaper-not-owned' };
  }
  store.equippedWallpaperId = wallpaperId;
  writeStore(store);
  return { ok: true, wallpaperId };
}
