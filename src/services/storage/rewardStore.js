const STORAGE_KEY = 'lena:rewards:v1';

const themeRewards = [
  { id: 'theme-minimal',  type: 'theme', name: 'Style épuré',        nameNl: 'Strak design',           price: 0,  icon: '🍎', rarity: 'common',    preview: ['#f2f2f7', '#ffffff', '#007aff'] },
  { id: 'theme-candy',    type: 'theme', name: 'Nuage sucré',         nameNl: 'Suikerwolk',             price: 68, icon: '🍭', rarity: 'epic',      preview: ['#ff8fc6', '#ffd977', '#8dd8ff'] },
  { id: 'theme-ocean',    type: 'theme', name: 'Lagune claire',       nameNl: 'Heldere lagune',         price: 74, icon: '🌊', rarity: 'legendary', preview: ['#5bc6ff', '#7be4c8', '#fff1a8'] },
  { id: 'theme-sunset',   type: 'theme', name: 'Coucher doré',        nameNl: 'Gouden zonsondergang',   price: 78, icon: '🌇', rarity: 'legendary', preview: ['#ff9a76', '#ffd670', '#ff8fc6'] },
  { id: 'theme-forest',   type: 'theme', name: 'Forêt douce',         nameNl: 'Zacht bos',              price: 82, icon: '🌲', rarity: 'legendary', preview: ['#7dd7a1', '#d9f4a4', '#8ac7ff'] },
  { id: 'theme-galaxy',   type: 'theme', name: 'Galaxie brillante',   nameNl: 'Stralend heelal',        price: 88, icon: '✨', rarity: 'legendary', preview: ['#8e8dff', '#ff9ad1', '#7ed7ff'], featured: true },
  { id: 'theme-castle',   type: 'theme', name: 'Château pastel',      nameNl: 'Pastelkasteel',          price: 84, icon: '🏰', rarity: 'legendary', preview: ['#d1b8ff', '#ffd5ef', '#ffe79f'] },
  { id: 'theme-garden',   type: 'theme', name: 'Jardin lumineux',     nameNl: 'Lichte tuin',            price: 80, icon: '🌸', rarity: 'legendary', preview: ['#7fe2bf', '#ffdba8', '#ffa9d0'] },
  { id: 'theme-comet',    type: 'theme', name: 'Comète magique',      nameNl: 'Magische komeet',        price: 92, icon: '☄️', rarity: 'mythic',    preview: ['#6cc9ff', '#b89eff', '#ffd780'] },
  { id: 'theme-cherry',   type: 'theme', name: 'Cerise rubis',        nameNl: 'Robijnkers',             price: 86, icon: '🍒', rarity: 'legendary', preview: ['#f06080', '#ffb3c8', '#ffd5a0'] },
  { id: 'theme-aurora',   type: 'theme', name: 'Aurore polaire',      nameNl: 'Poolaurora',             price: 90, icon: '🌌', rarity: 'mythic',    preview: ['#3dcce0', '#a78bfa', '#34d399'] },
  { id: 'theme-lemon',    type: 'theme', name: 'Citron pressé',       nameNl: 'Vers citroen',           price: 76, icon: '🍋', rarity: 'legendary', preview: ['#e8e800', '#a8e800', '#ffe060'] },
];

const wallpaperRewards = [
  { id: 'wallpaper-dreamy-sky',    type: 'wallpaper', name: 'Ciel rêveur',        nameNl: 'Dromerige lucht',  price: 42, icon: '☁️', rarity: 'rare', preview: ['#fff5fe', '#eaf4ff', '#fff0c9'] },
  { id: 'wallpaper-rainbow-mist',  type: 'wallpaper', name: 'Brume arc-en-ciel',  nameNl: 'Regenboognevel',   price: 46, icon: '🌈', rarity: 'rare', preview: ['#ffe8f6', '#eef7ff', '#fff3ba'] },
  { id: 'wallpaper-coral-breeze',  type: 'wallpaper', name: 'Brise corail',       nameNl: 'Koraalbries',      price: 46, icon: '🪸', rarity: 'rare', preview: ['#fff1ea', '#ffe3f1', '#fef6d8'] },
  { id: 'wallpaper-mint-meadow',   type: 'wallpaper', name: 'Prairie menthe',     nameNl: 'Muntweide',        price: 48, icon: '🍃', rarity: 'rare', preview: ['#effff8', '#dff4ee', '#fff8d8'] },
  { id: 'wallpaper-star-camp',     type: 'wallpaper', name: 'Camp des étoiles',   nameNl: 'Sterrenkamp',      price: 52, icon: '🌟', rarity: 'rare', preview: ['#eef0ff', '#fbe9ff', '#fff2ba'], featured: true },
  { id: 'wallpaper-snow-glow',     type: 'wallpaper', name: 'Lueur de neige',     nameNl: 'Sneeuwgloed',      price: 48, icon: '❄️', rarity: 'rare', preview: ['#f9fdff', '#eef5ff', '#fff7fe'] },
];

const effectRewards = [
  { id: 'effect-rain',      type: 'effect', name: 'Pluie douce',        nameNl: 'Zachte regen',           price: 58, icon: '🌧️', rarity: 'epic', preview: ['rain'] },
  { id: 'effect-rainbow',   type: 'effect', name: 'Arc-en-ciel',        nameNl: 'Regenboog',              price: 64, icon: '🌈', rarity: 'epic', preview: ['rainbow'] },
  { id: 'effect-snow',      type: 'effect', name: 'Neige légère',       nameNl: 'Lichte sneeuw',          price: 60, icon: '❄️', rarity: 'epic', preview: ['snow'] },
  { id: 'effect-stars',     type: 'effect', name: 'Étoiles filantes',   nameNl: 'Vallende sterren',       price: 62, icon: '⭐', rarity: 'epic', preview: ['stars'] },
  { id: 'effect-bubbles',   type: 'effect', name: 'Bulles magiques',    nameNl: 'Magische bellen',        price: 58, icon: '🫧', rarity: 'epic', preview: ['bubbles'] },
  { id: 'effect-fireflies', type: 'effect', name: 'Lucioles douces',    nameNl: 'Zachte vuurvliegjes',    price: 66, icon: '🪲', rarity: 'epic', preview: ['fireflies'] },
  { id: 'effect-petals',    type: 'effect', name: 'Pluie de pétales',   nameNl: 'Bloemblaadjesregen',     price: 64, icon: '🌸', rarity: 'epic', preview: ['petals'] },
  { id: 'effect-aurora',    type: 'effect', name: 'Aurore boréal',      nameNl: 'Noorderlicht',           price: 72, icon: '🌌', rarity: 'epic', preview: ['aurora'], featured: true },
];

const stickerRewards = [
  { id: 'sticker-rainbow',  type: 'sticker', name: 'Arc-en-ciel',      nameNl: 'Regenboog',        price: 30, rarity: 'common', assetPath: 'assets/stickers/sticker-arcenciel.svg' },
  { id: 'sticker-star',     type: 'sticker', name: 'Étoile brillante', nameNl: 'Sterrensticker',   price: 26, rarity: 'common', assetPath: 'assets/stickers/sticker-etoile.svg' },
  { id: 'sticker-gem',      type: 'sticker', name: 'Gemme magique',    nameNl: 'Magische edelsteen', price: 28, rarity: 'common', assetPath: 'assets/stickers/sticker-gemme.svg' },
  { id: 'sticker-potion',   type: 'sticker', name: 'Potion douce',     nameNl: 'Zachte toverdrank', price: 30, rarity: 'common', assetPath: 'assets/stickers/sticker-potion.svg' },
  { id: 'sticker-sunshine', type: 'sticker', name: 'Soleil joyeux',    nameNl: 'Blije zon',        price: 24, rarity: 'common', icon: '☀️' },
  { id: 'sticker-heart',    type: 'sticker', name: 'Cœur tendre',      nameNl: 'Lief hart',        price: 24, rarity: 'common', icon: '💖' },
  { id: 'sticker-cloud',    type: 'sticker', name: 'Nuage moelleux',   nameNl: 'Wolkje',           price: 22, rarity: 'common', icon: '☁️' },
  { id: 'sticker-moon',     type: 'sticker', name: 'Lune pastel',      nameNl: 'Pastelmaan',       price: 23, rarity: 'common', icon: '🌙' },
];

const avatarRewards = [
  { id: 'avatar-unicorn',    type: 'avatar', name: 'Licorne',           nameNl: 'Eenhoorn',             price: 52, rarity: 'rare', assetPath: 'assets/avatars/licorne.svg',   featured: true },
  { id: 'avatar-panda',      type: 'avatar', name: 'Panda',             nameNl: 'Panda',                price: 46, rarity: 'rare', assetPath: 'assets/avatars/panda.svg' },
  { id: 'avatar-dragon',     type: 'avatar', name: 'Petit dragon',      nameNl: 'Kleine draak',         price: 58, rarity: 'epic', assetPath: 'assets/avatars/dragon.svg' },
  { id: 'avatar-owl',        type: 'avatar', name: 'Petit hibou',       nameNl: 'Kleine uil',           price: 48, rarity: 'rare', assetPath: 'assets/avatars/hibou.svg' },
  { id: 'avatar-fox',        type: 'avatar', name: 'Petit renard',      nameNl: 'Kleine vos',           price: 54, rarity: 'rare', assetPath: 'assets/avatars/renard.svg' },
  { id: 'avatar-lion',       type: 'avatar', name: 'Petit lion',        nameNl: 'Kleine leeuw',         price: 54, rarity: 'rare', assetPath: 'assets/avatars/lion.svg' },
  { id: 'avatar-dolphin',    type: 'avatar', name: 'Dauphin',           nameNl: 'Dolfijn',              price: 50, rarity: 'rare', assetPath: 'assets/avatars/dauphin.svg' },
  { id: 'avatar-frog',       type: 'avatar', name: 'Grenouille',        nameNl: 'Kikker',               price: 42, rarity: 'rare', assetPath: 'assets/avatars/grenouille.svg' },
  { id: 'avatar-penguin',    type: 'avatar', name: 'Pingouin',          nameNl: 'Pinguin',              price: 46, rarity: 'rare', assetPath: 'assets/avatars/pingouin.svg' },
  { id: 'avatar-apple',      type: 'avatar', name: 'Pomme',             nameNl: 'Appel',                price: 40, rarity: 'rare', assetPath: 'assets/avatars/pomme.svg' },
  { id: 'avatar-banana',     type: 'avatar', name: 'Banane',            nameNl: 'Banaan',               price: 40, rarity: 'rare', assetPath: 'assets/avatars/banane.svg' },
  { id: 'avatar-pineapple',  type: 'avatar', name: 'Ananas',            nameNl: 'Ananas',               price: 40, rarity: 'rare', assetPath: 'assets/avatars/ananas.svg' },
  { id: 'avatar-strawberry', type: 'avatar', name: 'Fraise',            nameNl: 'Aardbei',              price: 40, rarity: 'rare', assetPath: 'assets/avatars/fraise.svg' },
  { id: 'avatar-cat',        type: 'avatar', name: 'Petit chat',        nameNl: 'Kleine kat',           price: 44, rarity: 'rare', icon: '🐱' },
  { id: 'avatar-rabbit',     type: 'avatar', name: 'Lapin rieur',       nameNl: 'Lachend konijn',       price: 44, rarity: 'rare', icon: '🐰' },
  { id: 'avatar-bear',       type: 'avatar', name: 'Petit ours',        nameNl: 'Kleine beer',          price: 48, rarity: 'rare', icon: '🐻' },
  { id: 'avatar-butterfly',  type: 'avatar', name: 'Papillon magique',  nameNl: 'Magische vlinder',     price: 52, rarity: 'rare', icon: '🦋' },
  { id: 'avatar-turtle',     type: 'avatar', name: 'Tortue sage',       nameNl: 'Wijze schildpad',      price: 46, rarity: 'rare', icon: '🐢' },
];

const accessoryRewards = [
  { id: 'accessory-crown',      type: 'accessory', name: 'Couronne de sucre',   nameNl: 'Suikerkroon',         price: 34, rarity: 'common', icon: '👑' },
  { id: 'accessory-wand',       type: 'accessory', name: 'Baguette magique',    nameNl: 'Toverstaf',           price: 36, rarity: 'rare',   icon: '🪄', featured: true },
  { id: 'accessory-backpack',   type: 'accessory', name: "Sac d'explorateur",   nameNl: 'Ontdekkersrugzak',    price: 32, rarity: 'common', icon: '🎒' },
  { id: 'accessory-bow',        type: 'accessory', name: 'Nœud pastel',         nameNl: 'Pastelstrik',         price: 28, rarity: 'common', icon: '🎀' },
  { id: 'accessory-glasses',    type: 'accessory', name: 'Lunettes étoilées',   nameNl: 'Sterrenbril',         price: 30, rarity: 'common', icon: '🕶️' },
  { id: 'accessory-cape',       type: 'accessory', name: 'Cape douce',          nameNl: 'Zachte cape',         price: 34, rarity: 'common', icon: '🦸' },
  { id: 'accessory-boots',      type: 'accessory', name: 'Bottes de pluie',     nameNl: 'Regenlaarsjes',       price: 28, rarity: 'common', icon: '🥾' },
  { id: 'accessory-lantern',    type: 'accessory', name: 'Lanterne brillante',  nameNl: 'Lichtlantaarn',       price: 31, rarity: 'common', icon: '🏮' },
  { id: 'accessory-wizard-hat', type: 'accessory', name: 'Chapeau de sorcier',  nameNl: 'Tovenaarshoed',       price: 38, rarity: 'rare',   icon: '🎩' },
  { id: 'accessory-shield',     type: 'accessory', name: 'Bouclier brave',      nameNl: 'Dappere schild',      price: 35, rarity: 'common', icon: '🛡️' },
  { id: 'accessory-trophy',     type: 'accessory', name: 'Trophée champion',    nameNl: 'Kampioensbeker',      price: 40, rarity: 'rare',   icon: '🏆' },
];

const badgeRewards = [
  { id: 'badge-spark-reader', type: 'badge', name: 'Lecteur étincelle',   nameNl: 'Sprankellezer',              price: 34, rarity: 'common', icon: '📖' },
  { id: 'badge-math-star',    type: 'badge', name: 'Étoile des nombres',  nameNl: 'Cijferster',                 price: 36, rarity: 'rare',   icon: '⭐' },
  { id: 'badge-kind-heart',   type: 'badge', name: 'Cœur courageux',      nameNl: 'Moedig hart',                price: 32, rarity: 'common', icon: '💛' },
  { id: 'badge-logic-light',  type: 'badge', name: 'Lueur logique',       nameNl: 'Logisch licht',              price: 38, rarity: 'rare',   icon: '🧠' },
  { id: 'badge-story-crown',  type: 'badge', name: 'Couronne des récits', nameNl: 'Verhaalkroon',               price: 38, rarity: 'rare',   icon: '👑' },
  { id: 'badge-ocean-friend', type: 'badge', name: 'Ami des vagues',      nameNl: 'Vriend van de golven',       price: 33, rarity: 'common', icon: '🌊' },
];

const frameRewards = [
  { id: 'frame-gold-stars',     type: 'frame', name: 'Cadre étoiles dorées',     nameNl: 'Gouden sterrenrand',      price: 44, rarity: 'rare', icon: '✨', preview: ['#ffe08b', '#fff6d6', '#ffcf74'] },
  { id: 'frame-coral-dream',    type: 'frame', name: 'Cadre corail rêveur',       nameNl: 'Dromerige koraalrand',    price: 42, rarity: 'rare', icon: '🪸', preview: ['#ffb9a7', '#ffe2d8', '#ffd28c'] },
  { id: 'frame-ocean-bubbles',  type: 'frame', name: 'Cadre bulles océaniques',   nameNl: 'Oceanische bellenrand',   price: 42, rarity: 'rare', icon: '🫧', preview: ['#8dd8ff', '#dff6ff', '#bff2e3'] },
  { id: 'frame-moon-glow',      type: 'frame', name: 'Cadre lune douce',          nameNl: 'Zachte maanrand',         price: 43, rarity: 'rare', icon: '🌙', preview: ['#d7d1ff', '#f7f4ff', '#ffe8f8'] },
  { id: 'frame-rainbow-trail',  type: 'frame', name: 'Cadre arc joyeux',          nameNl: 'Vrolijke regenboogrand',  price: 46, rarity: 'rare', icon: '🌈', preview: ['#ffb8d8', '#ffe38c', '#9fd7ff'] },
  { id: 'frame-forest-twirl',   type: 'frame', name: 'Cadre forêt tendre',        nameNl: 'Zachte bosrand',          price: 43, rarity: 'rare', icon: '🌿', preview: ['#bce6cc', '#e9f7d0', '#d8efff'] },
];

const petRewards = [
  { id: 'pet-cloudy',    type: 'pet', name: 'Nuage ami',        nameNl: 'Wolkmaatje',                   price: 48, rarity: 'rare', icon: '☁️' },
  { id: 'pet-spark',     type: 'pet', name: 'Étincelle',        nameNl: 'Sprankel',                     price: 52, rarity: 'rare', icon: '✨' },
  { id: 'pet-shell',     type: 'pet', name: 'Coquillage',       nameNl: 'Schelpie',                     price: 44, rarity: 'rare', icon: '🐚' },
  { id: 'pet-berry',     type: 'pet', name: 'Baie magique',     nameNl: 'Magische bes',                 price: 44, rarity: 'rare', icon: '🫐' },
  { id: 'pet-comet',     type: 'pet', name: 'Mini comète',      nameNl: 'Mini komeet',                  price: 56, rarity: 'epic', icon: '🌠', featured: true },
  { id: 'pet-firefly',   type: 'pet', name: 'Luciole',          nameNl: 'Glimworm',                     price: 50, rarity: 'rare', icon: '🪲' },
  { id: 'pet-mushroom',  type: 'pet', name: 'Champignon ami',   nameNl: 'Vriendelijke paddenstoel',     price: 44, rarity: 'rare', icon: '🍄' },
  { id: 'pet-ghost',     type: 'pet', name: 'Mini fantôme',     nameNl: 'Mini spook',                   price: 48, rarity: 'rare', icon: '👻' },
];

const titleRewards = [
  { id: 'title-explorer', type: 'title', name: 'Explorateur',         nameNl: 'Ontdekker',     price: 30, rarity: 'common', icon: '🗺️' },
  { id: 'title-champion', type: 'title', name: 'Champion',            nameNl: 'Kampioen',      price: 36, rarity: 'rare',   icon: '🏆' },
  { id: 'title-wizard',   type: 'title', name: 'Grand Sorcier',       nameNl: 'Grote Tovenaar', price: 38, rarity: 'rare',  icon: '🧙' },
  { id: 'title-star',     type: 'title', name: 'Étoile Brillante',    nameNl: 'Stralende Ster', price: 32, rarity: 'common', icon: '⭐' },
  { id: 'title-dragon',   type: 'title', name: 'Dompteur de Dragons', nameNl: 'Drakentammer',  price: 42, rarity: 'rare',   icon: '🐉' },
];

const chestRewards = [
  { id: 'chest-bronze',    type: 'chest', name: 'Coffre Bronze',    nameNl: 'Bronzen kist',   price: 15, rarity: 'common',    icon: '📦', chestTier: 'bronze',    desc: 'Contient 1 objet Commun ou Rare' },
  { id: 'chest-silver',    type: 'chest', name: 'Coffre Argent',    nameNl: 'Zilveren kist',  price: 35, rarity: 'rare',      icon: '🎁', chestTier: 'silver',    desc: 'Contient 1 objet Rare ou Épique' },
  { id: 'chest-gold',      type: 'chest', name: 'Coffre Or',        nameNl: 'Gouden kist',    price: 65, rarity: 'epic',      icon: '🏆', chestTier: 'gold',      desc: 'Contient 1 objet Épique ou Légendaire' },
  { id: 'chest-legendary', type: 'chest', name: 'Coffre Légendaire', nameNl: 'Legendarische kist', price: 99, rarity: 'legendary', icon: '👑', chestTier: 'legendary', desc: 'Contient 1 objet Légendaire garanti !' },
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
  ...petRewards,
  ...titleRewards,
  ...chestRewards,
];

function defaultStore() {
  return {
    balance: 0,
    inventory: [],
    purchases: [],
    rewardsByActivity: {},
    missionRewards: {},
    equippedThemeId: 'theme-minimal',
    equippedEffectId: 'effect-rainbow',
    equippedWallpaperId: 'wallpaper-dreamy-sky',
    equippedPetId: null,
    equippedAvatarId: null,
  };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw);
    const merged = {
      ...defaultStore(),
      ...parsed,
      missionRewards: parsed.missionRewards || {}
    };
    if (merged.equippedThemeId === 'theme-candy' && !parsed.userChoseTheme) {
      merged.equippedThemeId = 'theme-minimal';
    }
    return merged;
  } catch {
    return defaultStore();
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event('lena-rewards-change'));
  } catch {}
}

export function getRewardCatalog() {
  return rewardCatalog;
}

export function getRewardState() {
  return readStore();
}

export function getDailyDealId() {
  const day = Math.floor(Date.now() / 86400000);
  const buyable = rewardCatalog.filter(i => i.price > 0 && i.type !== 'chest');
  return buyable[day % buyable.length]?.id || null;
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
  return { awarded: delta, balance: store.balance };
}

export function rewardMissionCompletion(missionKey, { perfect = false } = {}) {
  const store = readStore();
  if (store.missionRewards[missionKey]) {
    return { awarded: 0, balance: store.balance };
  }
  const crystals = perfect ? 24 : 18;
  store.balance += crystals;
  store.missionRewards[missionKey] = { awarded: crystals, perfect, completedAt: Date.now() };
  writeStore(store);
  return { awarded: crystals, balance: store.balance };
}

export function buyReward(itemId) {
  const store = readStore();
  const item = rewardCatalog.find(e => e.id === itemId);
  if (!item) return { ok: false, reason: 'missing-item' };
  if (store.inventory.includes(itemId)) return { ok: false, reason: 'owned-item' };
  if (store.balance < item.price) return { ok: false, reason: 'not-enough-crystals' };

  store.balance -= item.price;
  store.inventory.push(itemId);
  store.purchases.push({ itemId, purchasedAt: Date.now() });
  if (item.type === 'theme' && !store.equippedThemeId) store.equippedThemeId = item.id;
  writeStore(store);
  return { ok: true, balance: store.balance };
}

export function openChest(chestId) {
  const store = readStore();
  const chest = rewardCatalog.find(i => i.id === chestId);
  if (!chest || chest.type !== 'chest') return { ok: false, reason: 'missing-chest' };
  if (store.balance < chest.price) return { ok: false, reason: 'not-enough-crystals' };

  const tierRarities = {
    bronze:    ['common', 'rare'],
    silver:    ['rare', 'epic'],
    gold:      ['epic', 'legendary'],
    legendary: ['legendary', 'mythic'],
  };
  const eligible = tierRarities[chest.chestTier] || ['common'];
  const pool = rewardCatalog.filter(i =>
    i.type !== 'chest' &&
    eligible.includes(i.rarity) &&
    !store.inventory.includes(i.id)
  );
  if (pool.length === 0) return { ok: false, reason: 'no-items-available' };

  const won = pool[Math.floor(Math.random() * pool.length)];
  store.balance -= chest.price;
  store.inventory.push(won.id);
  store.purchases.push({ itemId: won.id, purchasedAt: Date.now(), fromChest: chestId });
  writeStore(store);
  return { ok: true, item: won, balance: store.balance };
}

export function equipTheme(themeId) {
  const store = readStore();
  const freeThemes = ['theme-candy', 'theme-minimal'];
  if (!freeThemes.includes(themeId) && !store.inventory.includes(themeId)) {
    return { ok: false, reason: 'theme-not-owned' };
  }
  store.equippedThemeId = themeId;
  store.userChoseTheme = true;
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

export function equipPet(petId) {
  const store = readStore();
  if (!store.inventory.includes(petId)) {
    return { ok: false, reason: 'pet-not-owned' };
  }
  store.equippedPetId = store.equippedPetId === petId ? null : petId;
  writeStore(store);
  return { ok: true, petId: store.equippedPetId };
}

export function equipAvatar(avatarId) {
  const store = readStore();
  const freeAvatars = [];
  if (!freeAvatars.includes(avatarId) && !store.inventory.includes(avatarId)) {
    return { ok: false, reason: 'avatar-not-owned' };
  }
  store.equippedAvatarId = avatarId;
  writeStore(store);
  return { ok: true, avatarId };
}
