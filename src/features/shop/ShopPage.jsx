import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buyReward, equipAvatar, equipEffect, equipPet, equipTheme, equipWallpaper,
  equipMascotColor,
  getRewardCatalog, getRewardState, getDailyDealId, openChest,
} from '../../services/storage/rewardStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';
import { assetUrl } from '../../shared/assets/assetUrl.js';

// ── Rarity config ────────────────────────────────────────────────────────────
const RARITY = {
  common:    { label: 'Commun',     emoji: '⚪', color: '#9ca3af', glow: 'rgba(156,163,175,0.3)' },
  rare:      { label: 'Rare',       emoji: '🟢', color: '#22c55e', glow: 'rgba(34,197,94,0.35)' },
  epic:      { label: 'Épique',     emoji: '🔵', color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
  legendary: { label: 'Légendaire', emoji: '🟣', color: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  mythic:    { label: 'Mythique',   emoji: '🟡', color: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
};

// ── Art backgrounds per type/id ───────────────────────────────────────────────
const TYPE_BG = {
  avatar:    'linear-gradient(145deg,#ff9ad1,#ff6eb4)',
  theme:     'linear-gradient(145deg,#8dd8ff,#5fb8ff)',
  wallpaper: 'linear-gradient(145deg,#a3e635,#65a30d)',
  effect:    'linear-gradient(145deg,#fb923c,#ea580c)',
  pet:       'linear-gradient(145deg,#c084fc,#9333ea)',
  accessory: 'linear-gradient(145deg,#fde68a,#f59e0b)',
  badge:     'linear-gradient(145deg,#6ee7b7,#059669)',
  frame:     'linear-gradient(145deg,#fda4af,#e11d48)',
  sticker:   'linear-gradient(145deg,#fef08a,#ca8a04)',
  title:     'linear-gradient(145deg,#c4b5fd,#7c3aed)',
  mascotColor: 'linear-gradient(145deg,#ff9ecf,#a855f7)',
};
const CHEST_BG = {
  bronze:    'linear-gradient(145deg,#d97706,#92400e)',
  silver:    'linear-gradient(145deg,#94a3b8,#475569)',
  gold:      'linear-gradient(145deg,#fbbf24,#d97706)',
  legendary: 'linear-gradient(145deg,#a855f7,#6d28d9)',
};

// ── Category tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { key: 'all',       emoji: '🌟', label: 'Tout' },
  { key: 'chest',     emoji: '🎁', label: 'Coffres' },
  { key: 'mascotColor', emoji: '🎨', label: 'Couleurs' },
  { key: 'avatar',    emoji: '🐾', label: 'Avatars' },
  { key: 'theme',     emoji: '🎨', label: 'Thèmes' },
  { key: 'wallpaper', emoji: '🌈', label: 'Fonds' },
  { key: 'effect',    emoji: '✨', label: 'Effets' },
  { key: 'pet',       emoji: '🐶', label: 'Animaux' },
  { key: 'accessory', emoji: '🎀', label: 'Accessoires' },
  { key: 'badge',     emoji: '🏅', label: 'Badges' },
  { key: 'frame',     emoji: '🪞', label: 'Cadres' },
  { key: 'title',     emoji: '📜', label: 'Titres' },
  { key: 'sticker',   emoji: '🏷️', label: 'Stickers' },
];

// ── Item visual ────────────────────────────────────────────────────────────────
function ItemIcon({ item, size = 52 }) {
  if (item.assetPath) {
    return <img src={assetUrl(item.assetPath)} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  return <span style={{ fontSize: size * 0.72, lineHeight: 1 }}>{item.icon || '?'}</span>;
}

function getDisplayName(item, locale) {
  return locale === 'nl' && item.nameNl ? item.nameNl : item.name;
}

// ── Chest open modal ──────────────────────────────────────────────────────────
function ChestModal({ item, locale, onClose }) {
  const r = RARITY[item.rarity] || RARITY.common;
  const displayName = getDisplayName(item, locale);
  return (
    <div className="bq-overlay" onClick={onClose}>
      <div className="bq-chest-modal" onClick={e => e.stopPropagation()}>
        <div className="bq-chest-modal__burst" style={{ '--rarity-glow': r.glow }} />
        <div className="bq-chest-modal__icon">
          <ItemIcon item={item} size={80} />
        </div>
        <p className="bq-chest-modal__label">{r.emoji} {r.label}</p>
        <h2 className="bq-chest-modal__name">{displayName}</h2>
        <p className="bq-chest-modal__sub">Tu as gagné un nouvel objet !</p>
        <button className="bq-chest-modal__btn" onClick={onClose}>🎉 Super !</button>
      </div>
    </div>
  );
}

// ── Preview modal ─────────────────────────────────────────────────────────────
function PreviewModal({ item, locale, balance, owned, active, affordable, dealPrice, onClose, onAction }) {
  const r = RARITY[item.rarity] || RARITY.common;
  const bg = item.type === 'chest'
    ? (CHEST_BG[item.chestTier] || CHEST_BG.bronze)
    : (TYPE_BG[item.type] || 'linear-gradient(145deg,#e0e7ff,#6366f1)');
  const price = dealPrice ?? item.price;
  const missing = Math.max(0, price - balance);
  const displayName = getDisplayName(item, locale);

  const actionLabel = !owned
    ? `Acheter — ${price} 💎`
    : active ? '✓ Équipé' : canEquipType(item.type) ? 'Équiper' : '✓ Acquis';

  return (
    <div className="bq-overlay" onClick={onClose}>
      <div className="bq-preview" onClick={e => e.stopPropagation()}>
        <div className="bq-preview__art" style={{ background: bg }}>
          <span className="bq-preview__spark bq-preview__spark--one" />
          <span className="bq-preview__spark bq-preview__spark--two" />
          <span className="bq-preview__spark bq-preview__spark--three" />
          <ItemIcon item={item} size={96} />
        </div>
        <div className="bq-preview__body">
          <span className="bq-preview__rarity" style={{ color: r.color }}>{r.emoji} {r.label}</span>
          <h2 className="bq-preview__name">{displayName}</h2>
          {item.desc && <p className="bq-preview__desc">{item.desc}</p>}
          {!owned && (
            <p className="bq-preview__price">
              {dealPrice != null && <s className="bq-preview__old">{item.price} 💎</s>}
              <strong>{price} 💎</strong>
              {!affordable && <span className="bq-preview__lack"> (manque {missing} 💎)</span>}
            </p>
          )}
          <div className="bq-preview__actions">
            <button className="bq-preview__close" onClick={onClose}>Fermer</button>
            <button
              className="bq-preview__buy"
              onClick={onAction}
              disabled={!owned && !affordable}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function canEquipType(type) {
  return ['theme', 'effect', 'wallpaper', 'pet', 'avatar', 'mascotColor'].includes(type);
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { locale } = useLocale();
  const { themeId } = useTheme();

  const catalog = useMemo(() => getRewardCatalog(), []);
  const dailyId = useMemo(() => getDailyDealId(), []);

  const [shopState, setShopState] = useState(() => getRewardState());
  const [activeTab, setActiveTab] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const [chestResult, setChestResult] = useState(null);
  const [justBought, setJustBought] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function refresh() { setShopState(getRewardState()); }

  useEffect(() => {
    window.addEventListener('lena-rewards-change', refresh);
    return () => window.removeEventListener('lena-rewards-change', refresh);
  }, []);

  function showToast(msg, type = 'success') {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  function isOwned(id) {
    if (['theme-candy', 'effect-rainbow', 'wallpaper-dreamy-sky', 'mascot-pink', 'mascot-blue'].includes(id)) return true;
    return shopState.inventory.includes(id);
  }

  function isActive(item) {
    if (item.type === 'theme') return themeId === item.id;
    if (item.type === 'effect') return shopState.equippedEffectId === item.id;
    if (item.type === 'wallpaper') return shopState.equippedWallpaperId === item.id;
    if (item.type === 'pet') return shopState.equippedPetId === item.id;
    if (item.type === 'avatar') return shopState.equippedAvatarId === item.id;
    if (item.type === 'mascotColor') return (shopState.equippedMascotColorId || 'mascot-pink') === item.id;
    return false;
  }

  function getDealPrice(item) {
    return item.id === dailyId ? Math.floor(item.price * 0.8) : null;
  }

  function handleAction(item) {
    const owned = isOwned(item.id);
    if (!owned) {
      if (item.type === 'chest') {
        const res = openChest(item.id);
        if (res.ok) { refresh(); setChestResult(res.item); setPreviewItem(null); }
        else showToast('Pas assez de 💎 !', 'warn');
        return;
      }
      const dealPrice = getDealPrice(item);
      const price = dealPrice ?? item.price;
      if (shopState.balance < price) { showToast(`Manque ${price - shopState.balance} 💎`, 'warn'); return; }
      const res = buyReward(item.id);
      if (res.ok) {
        refresh();
        setJustBought(item.id);
        setTimeout(() => setJustBought(null), 1300);
        showToast(`🎉 ${item.name} débloqué !`);
        setPreviewItem(null);
      }
    } else {
      if (item.type === 'theme') equipTheme(item.id);
      else if (item.type === 'effect') equipEffect(item.id);
      else if (item.type === 'wallpaper') equipWallpaper(item.id);
      else if (item.type === 'pet') equipPet(item.id);
      else if (item.type === 'avatar') equipAvatar(item.id);
      else if (item.type === 'mascotColor') equipMascotColor(item.id);
      else { showToast('✓ Déjà acquis', 'info'); return; }
      refresh();
      showToast('✨ Équipé !', 'info');
      setPreviewItem(null);
    }
  }

  const visibleItems = useMemo(() => {
    const base = activeTab === 'all' ? catalog : catalog.filter(i => i.type === activeTab);
    return [...base].sort((a, b) => {
      if (a.id === dailyId) return -1;
      if (b.id === dailyId) return 1;
      const ao = isOwned(a.id), bo = isOwned(b.id);
      if (ao !== bo) return ao ? 1 : -1;
      return 0;
    });
  }, [catalog, activeTab, shopState, dailyId]);

  const featuredItems = useMemo(() => catalog.filter(i => i.featured && i.type !== 'chest'), [catalog]);
  const dailyItem = catalog.find(i => i.id === dailyId);
  const ownedCount = catalog.filter(i => isOwned(i.id)).length;
  const pct = Math.round(ownedCount / catalog.length * 100);
  const activeTabLabel = TABS.find(tab => tab.key === activeTab)?.label || 'Tout';

  const tabCounts = useMemo(() => {
    const m = {};
    catalog.forEach(i => { m[i.type] = (m[i.type] || 0) + 1; });
    return m;
  }, [catalog]);

  return (
    <div className="bq-page">

      {/* ── Header ── */}
      <div className="bq-header">
        <div className="bq-header__left">
          <h1 className="bq-header__title">🏪 Boutique</h1>
          <p className="bq-header__prog">{ownedCount}/{catalog.length} débloqués · {pct}%</p>
        </div>
        <div className="bq-header__balance">
          <span className="bq-header__gem">💎</span>
          <strong className="bq-header__amount">{shopState.balance}</strong>
        </div>
      </div>

      <section className="bq-hero" style={{ '--bq-progress': `${pct}%` }}>
        <div className="bq-hero__aurora" aria-hidden="true" />
        <div className="bq-hero__sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="bq-hero__copy">
          <span className="bq-hero__eyebrow">Collection magique</span>
          <h2 className="bq-hero__title">Débloque, équipe, fais briller ton aventure.</h2>
          <p className="bq-hero__text">Thèmes, avatars, effets et trésors sont classés pour acheter vite et voir ce qui reste à gagner.</p>
        </div>
        <div className="bq-hero__panel">
          <div className="bq-hero__meter">
            <span>Progression</span>
            <strong>{pct}%</strong>
            <i />
          </div>
          <div className="bq-hero__stats">
            <span><strong>{ownedCount}</strong><small>acquis</small></span>
            <span><strong>{catalog.length - ownedCount}</strong><small>restants</small></span>
            <span><strong>{activeTabLabel}</strong><small>filtre</small></span>
          </div>
        </div>
      </section>

      {/* ── Daily deal ── */}
      {dailyItem && !isOwned(dailyItem.id) && (
        <div className="bq-deal">
          <div className="bq-deal__left">
            <span className="bq-deal__badge">⚡ OFFRE DU JOUR</span>
            <strong className="bq-deal__name">{getDisplayName(dailyItem, locale)}</strong>
            <span className="bq-deal__tag">−20% aujourd'hui seulement !</span>
          </div>
          <div className="bq-deal__right">
            <div className="bq-deal__prices">
              <s className="bq-deal__old">{dailyItem.price} 💎</s>
              <span className="bq-deal__new">{Math.floor(dailyItem.price * 0.8)} 💎</span>
            </div>
            <button
              className="bq-deal__btn"
              disabled={shopState.balance < Math.floor(dailyItem.price * 0.8)}
              onClick={() => handleAction(dailyItem)}
            >
              Acheter
            </button>
          </div>
        </div>
      )}

      {/* ── Featured ── */}
      {featuredItems.length > 0 && (
        <div className="bq-featured">
          <h2 className="bq-featured__title">⭐ Objets en vedette</h2>
          <div className="bq-featured__scroll">
            {featuredItems.map((item, index) => {
              const r = RARITY[item.rarity] || RARITY.common;
              const owned = isOwned(item.id);
              return (
                <button
                  key={item.id}
                  className={`bq-feat-card${owned ? ' bq-feat-card--owned' : ''}`}
                  style={{ '--feat-glow': r.glow, '--feat-index': Math.min(index, 10) }}
                  onClick={() => setPreviewItem(item)}
                >
                  <div className="bq-feat-card__art" style={{ background: TYPE_BG[item.type] || '' }}>
                    <ItemIcon item={item} size={44} />
                  </div>
                  <span className="bq-feat-card__name">{getDisplayName(item, locale)}</span>
                  <span className="bq-feat-card__rarity" style={{ color: r.color }}>{r.emoji}</span>
                  {!owned && <span className="bq-feat-card__price">{item.price} 💎</span>}
                  {owned && <span className="bq-feat-card__owned">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="bq-tabs">
        {TABS.map(tab => {
          const count = tab.key === 'all' ? catalog.length : (tabCounts[tab.key] || 0);
          if (tab.key !== 'all' && count === 0) return null;
          return (
            <button
              key={tab.key}
              className={`bq-tab${activeTab === tab.key ? ' bq-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.emoji} {tab.label}
              {count > 0 && <span className="bq-tab__count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Grid ── */}
      <div className="bq-grid">
        {visibleItems.map((item, index) => {
          const r = RARITY[item.rarity] || RARITY.common;
          const owned = isOwned(item.id);
          const active = isActive(item);
          const isDaily = item.id === dailyId && !owned;
          const canEquip = canEquipType(item.type);
          const dealPrice = isDaily ? Math.floor(item.price * 0.8) : null;
          const price = dealPrice ?? item.price;
          const affordable = shopState.balance >= price;
          const justGot = justBought === item.id;

          const artBg = item.type === 'chest'
            ? (CHEST_BG[item.chestTier] || CHEST_BG.bronze)
            : (TYPE_BG[item.type] || 'linear-gradient(145deg,#e0e7ff,#6366f1)');

          const rarityGlow = (item.rarity === 'legendary' || item.rarity === 'mythic')
            ? `0 0 20px ${r.glow}, 0 0 6px ${r.glow}`
            : undefined;

          const btnLabel = !owned
            ? `${price} 💎`
            : active ? '✓ Équipé'
            : canEquip ? 'Équiper'
            : '✓ Acquis';

          return (
            <article
              key={item.id}
              className={[
                'bq-card',
                owned ? 'bq-card--owned' : '',
                active ? 'bq-card--active' : '',
                isDaily ? 'bq-card--deal' : '',
                justGot ? 'bq-card--burst' : '',
                !owned && !affordable ? 'bq-card--locked' : '',
              ].filter(Boolean).join(' ')}
              style={{
                '--bq-card-index': Math.min(index, 16),
                '--rarity-color': r.color,
                '--rarity-glow': r.glow,
                ...(rarityGlow ? { boxShadow: rarityGlow } : {}),
              }}
            >
              {isDaily && <span className="bq-card__deal-tag">⚡ −20%</span>}
              {active && <span className="bq-card__equipped-ring" aria-hidden="true" />}

              <button className="bq-card__art" style={{ background: artBg }} onClick={() => setPreviewItem(item)}>
                <span className="bq-card__shine" aria-hidden="true" />
                <span className="bq-card__rarity-dot" style={{ background: r.color }} title={r.label} />
                <ItemIcon item={item} size={54} />
                {owned && <span className="bq-card__owned-badge">✓</span>}
              </button>

              <div className="bq-card__body">
                <p className="bq-card__name">{getDisplayName(item, locale)}</p>
                <p className="bq-card__rarity" style={{ color: r.color }}>{r.emoji} {r.label}</p>
                {!owned && (
                  <p className={`bq-card__price${!affordable ? ' bq-card__price--red' : ''}`}>
                    {isDaily && <s className="bq-card__old">{item.price}</s>}
                    {price} 💎
                  </p>
                )}
              </div>

              <button
                className={[
                  'bq-card__btn',
                  active ? 'bq-card__btn--equipped' : '',
                  owned && !active && canEquip ? 'bq-card__btn--equip' : '',
                  owned && !canEquip ? 'bq-card__btn--owned' : '',
                  !owned && !affordable ? 'bq-card__btn--cant' : '',
                ].filter(Boolean).join(' ')}
                disabled={(owned && !canEquip) || (!owned && !affordable)}
                onClick={() => handleAction(item)}
              >
                {btnLabel}
              </button>
            </article>
          );
        })}
      </div>

      {/* ── Modals ── */}
      {previewItem && (
        <PreviewModal
          item={previewItem}
          locale={locale}
          balance={shopState.balance}
          owned={isOwned(previewItem.id)}
          active={isActive(previewItem)}
          affordable={shopState.balance >= (getDealPrice(previewItem) ?? previewItem.price)}
          dealPrice={getDealPrice(previewItem)}
          onClose={() => setPreviewItem(null)}
          onAction={() => handleAction(previewItem)}
        />
      )}
      {chestResult && (
        <ChestModal item={chestResult} locale={locale} onClose={() => setChestResult(null)} />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`bq-toast bq-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
