const STORAGE_KEY = 'lena:rewards:v1';

const themeRewards = [
  { id: 'theme-candy', type: 'theme', name: 'Nuage sucre', nameNl: 'Suikerwolk', price: 68, icon: '🍭', preview: ['#ff8fc6', '#ffd977', '#8dd8ff'] },
  { id: 'theme-ocean', type: 'theme', name: 'Lagune claire', nameNl: 'Heldere lagune', price: 74, icon: '🌊', preview: ['#5bc6ff', '#7be4c8', '#fff1a8'] },
  { id: 'theme-sunset', type: 'theme', name: 'Coucher dore', nameNl: 'Gouden zonsondergang', price: 78, icon: '🌇', preview: ['#ff9a76', '#ffd670', '#ff8fc6'] },
  { id: 'theme-forest', type: 'theme', name: 'Foret douce', nameNl: 'Zacht bos', price: 82, icon: '🌲', preview: ['#7dd7a1', '#d9f4a4', '#8ac7ff'] },
  { id: 'theme-galaxy', type: 'theme', name: 'Galaxie brillante', nameNl: 'Stralend heelal', price: 88, icon: '✨', preview: ['#8e8dff', '#ff9ad1', '#7ed7ff'] },
  { id: 'theme-castle', type: 'theme', name: 'Chateau pastel', nameNl: 'Pastelkasteel', price: 84, icon: '🏰', preview: ['#d1b8ff', '#ffd5ef', '#ffe79f'] },
  { id: 'theme-garden', type: 'theme', name: 'Jardin lumineux', nameNl: 'Lichte tuin', price: 80, icon: '🌸', preview: ['#7fe2bf', '#ffdba8', '#ffa9d0'] },
  { id: 'theme-comet', type: 'theme', name: 'Comete magique', nameNl: 'Magische komeet', price: 92, icon: '☄️', preview: ['#6cc9ff', '#b89eff', '#ffd780'] }
];

const wallpaperRewards = [
  { id: 'wallpaper-dreamy-sky', type: 'wallpaper', name: 'Ciel reveur', nameNl: 'Dromerige lucht', price: 42, icon: '☁️', preview: ['#fff5fe', '#eaf4ff', '#fff0c9'] },
  { id: 'wallpaper-rainbow-mist', type: 'wallpaper', name: 'Brume arc en ciel', nameNl: 'Regenboognevel', price: 46, icon: '🌈', preview: ['#ffe8f6', '#eef7ff', '#fff3ba'] },
  { id: 'wallpaper-coral-breeze', type: 'wallpaper', name: 'Brise corail', nameNl: 'Koraalbries', price: 46, icon: '🪸', preview: ['#fff1ea', '#ffe3f1', '#fef6d8'] },
  { id: 'wallpaper-mint-meadow', type: 'wallpaper', name: 'Prairie menthe', nameNl: 'Muntweide', price: 48, icon: '🍃', preview: ['#effff8', '#dff4ee', '#fff8d8'] },
  { id: 'wallpaper-star-camp', type: 'wallpaper', name: 'Camp des etoiles', nameNl: 'Sterrenkamp', price: 52, icon: '🌟', preview: ['#eef0ff', '#fbe9ff', '#fff2ba'] },
  { id: 'wallpaper-snow-glow', type: 'wallpaper', name: 'Lueur de neige', nameNl: 'Sneeuwgloed', price: 48, icon: '❄️', preview: ['#f9fdff', '#eef5ff', '#fff7fe'] }
];

const effectRewards = [
  { id: 'effect-rain', type: 'effect', name: 'Pluie douce', nameNl: 'Zachte regen', price: 58, icon: '🌧️', preview: ['rain'] },
  { id: 'effect-rainbow', type: 'effect', name: 'Arc en ciel', nameNl: 'Regenboog', price: 64, icon: '🌈', preview: ['rainbow'] },
  { id: 'effect-snow', type: 'effect', name: 'Neige legere', nameNl: 'Lichte sneeuw', price: 60, icon: '❄️', preview: ['snow'] }
];

const stickerRewards = [
  { id: 'sticker-rainbow', type: 'sticker', name: 'Arc en ciel', nameNl: 'Regenboog', price: 30, assetPath: 'assets/stickers/sticker-arcenciel.svg' },
  { id: 'sticker-star', type: 'sticker', name: 'Etoile brillante', nameNl: 'Sterrensticker', price: 26, assetPath: 'assets/stickers/sticker-etoile.svg' },
  { id: 'sticker-gem', type: 'sticker', name: 'Gemme magique', nameNl: 'Magische edelsteen', price: 28, assetPath: 'assets/stickers/sticker-gemme.svg' },
  { id: 'sticker-potion', type: 'sticker', name: 'Potion douce', nameNl: 'Zachte toverdrank', price: 30, assetPath: 'assets/stickers/sticker-potion.svg' },
  { id: 'sticker-sunshine', type: 'sticker', name: 'Soleil joyeux', nameNl: 'Blije zon', price: 24, icon: '☀️' },
  { id: 'sticker-heart', type: 'sticker', name: 'Coeur tendre', nameNl: 'Lief hart', price: 24, icon: '💖' },
  { id: 'sticker-cloud', type: 'sticker', name: 'Nuage moelleux', nameNl: 'Wolkje', price: 22, icon: '☁️' },
  { id: 'sticker-moon', type: 'sticker', name: 'Lune pastel', nameNl: 'Pastelmaan', price: 23, icon: '🌙' }
];

const avatarRewards = [
  { id: 'avatar-unicorn', type: 'avatar', name: 'Licorne', nameNl: 'Eenhoorn', price: 52, assetPath: 'assets/avatars/licorne.svg' },
  { id: 'avatar-panda', type: 'avatar', name: 'Panda', nameNl: 'Panda', price: 46, assetPath: 'assets/avatars/panda.svg' },
  { id: 'avatar-dragon', type: 'avatar', name: 'Petit dragon', nameNl: 'Kleine draak', price: 58, assetPath: 'assets/avatars/dragon.svg' },
  { id: 'avatar-owl', type: 'avatar', name: 'Petit hibou', nameNl: 'Kleine uil', price: 48, assetPath: 'assets/avatars/hibou.svg' },
  { id: 'avatar-fox', type: 'avatar', name: 'Petit renard', nameNl: 'Kleine vos', price: 54, assetPath: 'assets/avatars/renard.svg' },
  { id: 'avatar-lion', type: 'avatar', name: 'Petit lion', nameNl: 'Kleine leeuw', price: 54, assetPath: 'assets/avatars/lion.svg' },
  { id: 'avatar-dolphin', type: 'avatar', name: 'Dauphin', nameNl: 'Dolfijn', price: 50, assetPath: 'assets/avatars/dauphin.svg' },
  { id: 'avatar-frog', type: 'avatar', name: 'Grenouille', nameNl: 'Kikker', price: 42, assetPath: 'assets/avatars/grenouille.svg' },
  { id: 'avatar-penguin', type: 'avatar', name: 'Pingouin', nameNl: 'Pinguin', price: 46, assetPath: 'assets/avatars/pingouin.svg' },
  { id: 'avatar-apple', type: 'avatar', name: 'Pomme', nameNl: 'Appel', price: 40, assetPath: 'assets/avatars/pomme.svg' },
  { id: 'avatar-banana', type: 'avatar', name: 'Banane', nameNl: 'Banaan', price: 40, assetPath: 'assets/avatars/banane.svg' },
  { id: 'avatar-pineapple', type: 'avatar', name: 'Ananas', nameNl: 'Ananas', price: 40, assetPath: 'assets/avatars/ananas.svg' },
  { id: 'avatar-strawberry', type: 'avatar', name: 'Fraise', nameNl: 'Aardbei', price: 40, assetPath: 'assets/avatars/fraise.svg' }
];

const accessoryRewards = [
  { id: 'accessory-crown', type: 'accessory', name: 'Couronne de sucre', nameNl: 'Suikerkroon', price: 34, icon: '👑' },
  { id: 'accessory-wand', type: 'accessory', name: 'Baguette magique', nameNl: 'Toverstaf', price: 36, icon: '🪄' },
  { id: 'accessory-backpack', type: 'accessory', name: 'Sac d explorateur', nameNl: 'Ontdekkersrugzak', price: 32, icon: '🎒' },
  { id: 'accessory-bow', type: 'accessory', name: 'Noeud pastel', nameNl: 'Pastelstrik', price: 28, icon: '🎀' },
  { id: 'accessory-glasses', type: 'accessory', name: 'Lunettes etoilees', nameNl: 'Sterrenbril', price: 30, icon: '🕶️' },
  { id: 'accessory-cape', type: 'accessory', name: 'Cape douce', nameNl: 'Zachte cape', price: 34, icon: '🦸' },
  { id: 'accessory-boots', type: 'accessory', name: 'Bottes de pluie', nameNl: 'Regenlaarsjes', price: 28, icon: '🥾' },
  { id: 'accessory-lantern', type: 'accessory', name: 'Lanterne brillante', nameNl: 'Lichtlantaarn', price: 31, icon: '🏮' }
];

const badgeRewards = [
  { id: 'badge-spark-reader', type: 'badge', name: 'Lecteur etincelle', nameNl: 'Sprankellezer', price: 34, icon: '📖' },
  { id: 'badge-math-star', type: 'badge', name: 'Etoile des nombres', nameNl: 'Cijferster', price: 36, icon: '⭐' },
  { id: 'badge-kind-heart', type: 'badge', name: 'Coeur courageux', nameNl: 'Moedig hart', price: 32, icon: '💛' },
  { id: 'badge-logic-light', type: 'badge', name: 'Lueur logique', nameNl: 'Logisch licht', price: 38, icon: '🧠' },
  { id: 'badge-story-crown', type: 'badge', name: 'Couronne des recits', nameNl: 'Verhaalkroon', price: 38, icon: '👑' },
  { id: 'badge-ocean-friend', type: 'badge', name: 'Ami des vagues', nameNl: 'Vriend van de golven', price: 33, icon: '🌊' }
];

const frameRewards = [
  { id: 'frame-gold-stars', type: 'frame', name: 'Cadre etoiles dorees', nameNl: 'Gouden sterrenrand', price: 44, icon: '✨', preview: ['#ffe08b', '#fff6d6', '#ffcf74'] },
  { id: 'frame-coral-dream', type: 'frame', name: 'Cadre corail reveur', nameNl: 'Dromerige koraalrand', price: 42, icon: '🪸', preview: ['#ffb9a7', '#ffe2d8', '#ffd28c'] },
  { id: 'frame-ocean-bubbles', type: 'frame', name: 'Cadre bulles oceaniques', nameNl: 'Oceanische bellenrand', price: 42, icon: '🫧', preview: ['#8dd8ff', '#dff6ff', '#bff2e3'] },
  { id: 'frame-moon-glow', type: 'frame', name: 'Cadre lune douce', nameNl: 'Zachte maanrand', price: 43, icon: '🌙', preview: ['#d7d1ff', '#f7f4ff', '#ffe8f8'] },
  { id: 'frame-rainbow-trail', type: 'frame', name: 'Cadre arc joyeux', nameNl: 'Vrolijke regenboogrand', price: 46, icon: '🌈', preview: ['#ffb8d8', '#ffe38c', '#9fd7ff'] },
  { id: 'frame-forest-twirl', type: 'frame', name: 'Cadre foret tendre', nameNl: 'Zachte bosrand', price: 43, icon: '🌿', preview: ['#bce6cc', '#e9f7d0', '#d8efff'] }
];

const petRewards = [
  { id: 'pet-cloudy', type: 'pet', name: 'Nuage ami', nameNl: 'Wolkmaatje', price: 48, icon: '☁️' },
  { id: 'pet-spark', type: 'pet', name: 'Etincelle', nameNl: 'Sprankel', price: 52, icon: '✨' },
  { id: 'pet-shell', type: 'pet', name: 'Coquillage', nameNl: 'Schelpie', price: 44, icon: '🐚' },
  { id: 'pet-berry', type: 'pet', name: 'Baie magique', nameNl: 'Magische bes', price: 44, icon: '🫐' },
  { id: 'pet-comet', type: 'pet', name: 'Mini comete', nameNl: 'Mini komeet', price: 56, icon: '🌠' }
];

const rewardCatalog = [
  ...themeRewards,
  ...wallpaperRewards,
  ...effectRewards,
  ...stickerRewards,
  ...avatarRewards,
  ...accessoryRewards,
  ...badgeRewards,
  ...frameRewards,
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
