import { useEffect, useMemo, useState } from 'react';
import {
  buyReward,
  equipEffect,
  equipTheme,
  equipWallpaper,
  getRewardCatalog,
  getRewardState
} from '../../services/storage/rewardStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

// Daily deal: rotate based on day of year
function getDailyDealId(catalog) {
  const day = Math.floor(Date.now() / 86400000);
  const buyable = catalog.filter(i => i.price > 0);
  return buyable[day % buyable.length]?.id || null;
}

const CATEGORY_TABS = [
  { key: 'all',       label: 'Tout',          emoji: '🌟' },
  { key: 'theme',     label: 'Thèmes',        emoji: '🎨' },
  { key: 'avatar',    label: 'Avatars',       emoji: '🐾' },
  { key: 'effect',    label: 'Effets',        emoji: '✨' },
  { key: 'sticker',   label: 'Autocollants',  emoji: '🏷️' },
  { key: 'accessory', label: 'Accessoires',   emoji: '🎀' },
  { key: 'badge',     label: 'Badges',        emoji: '🏅' },
  { key: 'wallpaper', label: 'Fonds',         emoji: '🖼️' },
  { key: 'pet',       label: 'Animaux',       emoji: '🐶' },
];

const BUY_REACTIONS = [
  '🎉 Super choix !', '✨ Tu vas adorer !', '🌟 Excellent !', '🎊 Bravo !', '💫 Fantastique !'
];

export default function ShopPage() {
  const { locale, t } = useLocale();
  const { themeId } = useTheme();
  const [shopState, setShopState] = useState(() => getRewardState());
  const [toast, setToast] = useState('');
  const [toastKind, setToastKind] = useState('info'); // 'success' | 'info' | 'warn'
  const [activeCategory, setActiveCategory] = useState('all');
  const [justBought, setJustBought] = useState(null);
  const catalog = getRewardCatalog();
  const dailyDealId = useMemo(() => getDailyDealId(catalog), [catalog]);

  useEffect(() => {
    function sync() { setShopState(getRewardState()); }
    window.addEventListener('lena-rewards-change', sync);
    return () => window.removeEventListener('lena-rewards-change', sync);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const visibleItems = useMemo(() => {
    const base = activeCategory === 'all' ? catalog : catalog.filter(i => i.type === activeCategory);
    // Daily deal first, then unowned, then owned
    return [...base].sort((a, b) => {
      if (a.id === dailyDealId) return -1;
      if (b.id === dailyDealId) return 1;
      const ao = isOwnedId(a.id), bo = isOwnedId(b.id);
      if (ao !== bo) return ao ? 1 : -1;
      return 0;
    });
  }, [catalog, activeCategory, shopState, dailyDealId]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    catalog.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  const ownedCount = useMemo(() => {
    return catalog.filter(i => isOwnedId(i.id)).length;
  }, [shopState, catalog]);

  function getLabel(item) {
    if (locale === 'nl') return item.nameNl || item.name;
    return item.name;
  }

  function isOwnedId(id) {
    if (id === 'theme-candy' || id === 'effect-rainbow' || id === 'wallpaper-dreamy-sky') return true;
    return shopState.inventory.includes(id);
  }

  function isOwned(item) { return isOwnedId(item.id); }

  function isActive(item) {
    if (item.type === 'theme') return themeId === item.id;
    if (item.type === 'effect') return shopState.equippedEffectId === item.id;
    if (item.type === 'wallpaper') return shopState.equippedWallpaperId === item.id;
    return false;
  }

  function handleItemAction(item) {
    if (!isOwned(item)) {
      const isDeal = item.id === dailyDealId;
      const result = buyReward(item.id, isDeal ? Math.floor(item.price * 0.8) : undefined);
      if (result.ok) {
        setShopState(getRewardState());
        setJustBought(item.id);
        setToastKind('success');
        const reaction = BUY_REACTIONS[Math.floor(Math.random() * BUY_REACTIONS.length)];
        setToast(`${reaction} Tu as débloqué : ${getLabel(item)}`);
        setTimeout(() => setJustBought(null), 1200);
      } else {
        setToastKind(result.reason === 'owned-item' ? 'info' : 'warn');
        setToast(result.reason === 'owned-item' ? t('shopOwned') : `Il te faut ${item.price} 💎`);
      }
      return;
    }

    let result = { ok: false };
    if (item.type === 'theme') result = equipTheme(item.id);
    if (item.type === 'effect') result = equipEffect(item.id);
    if (item.type === 'wallpaper') result = equipWallpaper(item.id);

    if (result.ok) {
      setShopState(getRewardState());
      setToastKind('success');
      setToast(`🎨 Thème appliqué !`);
    }
  }

  function renderVisual(item) {
    if (item.assetPath) {
      return <img className="shop-card__image" src={assetUrl(item.assetPath)} alt="" />;
    }
    if (item.type === 'effect') {
      return <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`} />;
    }
    if (item.preview?.length > 0 && !['rain','snow','rainbow'].includes(item.preview[0])) {
      return (
        <div className="shop-card__theme-preview">
          {item.preview.map(color => <span key={color} style={{ backgroundColor: color }} />)}
          <span className="shop-card__theme-icon">{item.icon}</span>
        </div>
      );
    }
    return <span className="shop-card__emoji">{item.icon}</span>;
  }

  const dailyDealItem = catalog.find(i => i.id === dailyDealId);
  const canAfford = (price) => shopState.balance >= price;

  return (
    <div className="shop-page" data-testid="shop-page">

      {/* Hero balance header */}
      <div className="shop-hero">
        <div className="shop-hero__left">
          <span className="shop-hero__title">🛍️ Boutique</span>
          <span className="shop-hero__sub">{ownedCount} / {catalog.length} objets débloqués</span>
          <div className="shop-hero__progress">
            <div className="shop-hero__progress-fill" style={{ width: `${Math.round(ownedCount / catalog.length * 100)}%` }} />
          </div>
        </div>
        <div className="shop-hero__balance">
          <span className="shop-hero__gem">💎</span>
          <strong>{shopState.balance}</strong>
          <small>cristaux</small>
        </div>
      </div>

      {/* Daily deal banner */}
      {dailyDealItem && !isOwnedId(dailyDealItem.id) && (
        <div className="shop-deal-banner">
          <div className="shop-deal-banner__left">
            <span className="shop-deal-banner__badge">⚡ OFFRE DU JOUR</span>
            <strong className="shop-deal-banner__name">{getLabel(dailyDealItem)}</strong>
            <span className="shop-deal-banner__discount">−20% aujourd'hui seulement !</span>
          </div>
          <div className="shop-deal-banner__right">
            <span className="shop-deal-banner__old-price">{dailyDealItem.price} 💎</span>
            <span className="shop-deal-banner__new-price">{Math.floor(dailyDealItem.price * 0.8)} 💎</span>
            <button
              className="shop-deal-banner__btn"
              type="button"
              onClick={() => handleItemAction(dailyDealItem)}
              disabled={!canAfford(Math.floor(dailyDealItem.price * 0.8))}
            >
              Acheter
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`shop-toast shop-toast--${toastKind}`} role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {/* Category tabs */}
      <div className="shop-tabs" role="tablist" aria-label="Catégories">
        {CATEGORY_TABS.map(tab => {
          const count = tab.key === 'all' ? catalog.length : (categoryCounts[tab.key] || 0);
          return (
            <button
              key={tab.key}
              className={`shop-tab${activeCategory === tab.key ? ' shop-tab--active' : ''}`}
              role="tab"
              aria-selected={activeCategory === tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
            >
              <span className="shop-tab__emoji">{tab.emoji}</span>
              <span className="shop-tab__label">{tab.label}</span>
              {count > 0 && <span className="shop-tab__count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Item grid */}
      <div className="shop-grid" data-testid={`shop-section-${activeCategory}`}>
        {visibleItems.map(item => {
          const owned = isOwned(item);
          const active = isActive(item);
          const isDaily = item.id === dailyDealId;
          const canEquip = item.type === 'theme' || item.type === 'effect' || item.type === 'wallpaper';
          const disabled = owned && !canEquip;
          const displayPrice = isDaily && !owned ? Math.floor(item.price * 0.8) : item.price;
          const affordable = canAfford(displayPrice);
          const justGot = justBought === item.id;

          const btnLabel = !owned
            ? `${displayPrice} 💎`
            : active ? '✓ Équipé' : canEquip ? t('shopEquip') : '✓';

          return (
            <article
              key={item.id}
              className={[
                'shop-card',
                owned ? 'shop-card--owned' : '',
                active ? 'shop-card--active' : '',
                isDaily && !owned ? 'shop-card--deal' : '',
                justGot ? 'shop-card--just-bought' : '',
                !owned && !affordable ? 'shop-card--unaffordable' : '',
              ].filter(Boolean).join(' ')}
              data-testid={`shop-item-${item.id}`}
            >
              {isDaily && !owned && <span className="shop-card__deal-tag">⚡ −20%</span>}
              {active && <span className="shop-card__active-ring" aria-hidden="true" />}

              <div className="shop-card__visual">
                {renderVisual(item)}
                {owned && <span className="shop-card__owned-badge" aria-label="Possédé">✓</span>}
              </div>

              <p className="shop-card__name">{getLabel(item)}</p>

              {!owned && (
                <p className={`shop-card__price${!affordable ? ' shop-card__price--low' : ''}`}>
                  {isDaily && <s className="shop-card__old-price">{item.price}</s>}
                  {displayPrice} 💎
                  {!affordable && <span className="shop-card__need"> · manque {displayPrice - shopState.balance}</span>}
                </p>
              )}

              <button
                className={`shop-card__btn${owned && !canEquip ? ' shop-card__btn--owned' : ''}${active ? ' shop-card__btn--active' : ''}`}
                type="button"
                onClick={() => handleItemAction(item)}
                disabled={disabled || (!owned && !affordable)}
                data-testid={`shop-action-${item.id}`}
              >
                {btnLabel}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
