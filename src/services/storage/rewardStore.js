const STORAGE_KEY = 'lena:rewards:v1';

const rewardCatalog = [
  {
    id: 'theme-candy',
    type: 'theme',
    name: 'Nuage sucre',
    nameNl: 'Suikerwolk',
    price: 42,
    preview: ['#ff8fc6', '#ffd977', '#8dd8ff']
  },
  {
    id: 'theme-ocean',
    type: 'theme',
    name: 'Lagune claire',
    nameNl: 'Heldere lagune',
    price: 48,
    preview: ['#5bc6ff', '#7be4c8', '#fff1a8']
  },
  {
    id: 'theme-sunset',
    type: 'theme',
    name: 'Coucher dore',
    nameNl: 'Gouden zonsondergang',
    price: 52,
    preview: ['#ff9a76', '#ffd670', '#ff8fc6']
  },
  {
    id: 'effect-rain',
    type: 'effect',
    name: 'Pluie douce',
    nameNl: 'Zachte regen',
    price: 38,
    preview: ['rain']
  },
  {
    id: 'effect-rainbow',
    type: 'effect',
    name: 'Arc en ciel',
    nameNl: 'Regenboog',
    price: 44,
    preview: ['rainbow']
  },
  {
    id: 'effect-snow',
    type: 'effect',
    name: 'Neige legere',
    nameNl: 'Lichte sneeuw',
    price: 40,
    preview: ['snow']
  },
  {
    id: 'sticker-rainbow',
    type: 'sticker',
    name: 'Arc en ciel',
    nameNl: 'Regenboog',
    price: 24,
    assetPath: 'assets/stickers/sticker-arcenciel.svg'
  },
  {
    id: 'sticker-star',
    type: 'sticker',
    name: 'Etoile brillante',
    nameNl: 'Sterrensticker',
    price: 18,
    assetPath: 'assets/stickers/sticker-etoile.svg'
  },
  {
    id: 'sticker-gem',
    type: 'sticker',
    name: 'Gemme magique',
    nameNl: 'Magische edelsteen',
    price: 20,
    assetPath: 'assets/stickers/sticker-gemme.svg'
  },
  {
    id: 'avatar-unicorn',
    type: 'avatar',
    name: 'Licorne',
    nameNl: 'Eenhoorn',
    price: 32,
    assetPath: 'assets/avatars/licorne.svg'
  },
  {
    id: 'avatar-panda',
    type: 'avatar',
    name: 'Panda',
    nameNl: 'Panda',
    price: 28,
    assetPath: 'assets/avatars/panda.svg'
  },
  {
    id: 'avatar-dragon',
    type: 'avatar',
    name: 'Petit dragon',
    nameNl: 'Kleine draak',
    price: 36,
    assetPath: 'assets/avatars/dragon.svg'
  },
  {
    id: 'avatar-owl',
    type: 'avatar',
    name: 'Petit hibou',
    nameNl: 'Kleine uil',
    price: 30,
    assetPath: 'assets/avatars/hibou.svg'
  },
  {
    id: 'avatar-fox',
    type: 'avatar',
    name: 'Petit renard',
    nameNl: 'Kleine vos',
    price: 34,
    assetPath: 'assets/avatars/renard.svg'
  },
  {
    id: 'avatar-lion',
    type: 'avatar',
    name: 'Petit lion',
    nameNl: 'Kleine leeuw',
    price: 34,
    assetPath: 'assets/avatars/lion.svg'
  },
  {
    id: 'avatar-dolphin',
    type: 'avatar',
    name: 'Dauphin',
    nameNl: 'Dolfijn',
    price: 32,
    assetPath: 'assets/avatars/dauphin.svg'
  }
];

function defaultStore() {
  return {
    balance: 0,
    inventory: [],
    purchases: [],
    rewardsByActivity: {},
    equippedThemeId: 'theme-candy',
    equippedEffectId: 'effect-rainbow'
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultStore(), ...JSON.parse(raw) } : defaultStore();
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
