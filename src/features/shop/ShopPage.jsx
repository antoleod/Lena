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

const CATEGORY_TABS = [
  { key: 'all',       label: 'Tout' },
  { key: 'theme',     label: 'Thèmes' },
  { key: 'avatar',    label: 'Avatars' },
  { key: 'effect',    label: 'Effets' },
  { key: 'sticker',   label: 'Autocollants' },
  { key: 'accessory', label: 'Accessoires' },
  { key: 'badge',     label: 'Badges' },
  { key: 'wallpaper', label: 'Fonds' },
  { key: 'pet',       label: 'Animaux' },
];

export default function ShopPage() {
  const { locale, t } = useLocale();
  const { themeId } = useTheme();
  const [shopState, setShopState] = useState(() => getRewardState());
  const [toast, setToast] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const catalog = getRewardCatalog();

  useEffect(() => {
    function sync() {
      setShopState(getRewardState());
    }
    window.addEventListener('lena-rewards-change', sync);
    return () => window.removeEventListener('lena-rewards-change', sync);
  }, []);

  // Auto-dismiss toast after 2s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const visibleItems = useMemo(() => {
    if (activeCategory === 'all') return catalog;
    return catalog.filter((item) => item.type === activeCategory);
  }, [catalog, activeCategory]);

  function getLabel(item) {
    if (locale === 'nl') return item.nameNl || item.name;
    return item.name;
  }

  function isOwned(item) {
    if (item.id === 'theme-candy' || item.id === 'effect-rainbow' || item.id === 'wallpaper-dreamy-sky') {
      return true;
    }
    return shopState.inventory.includes(item.id);
  }

  function isActive(item) {
    if (item.type === 'theme') return themeId === item.id;
    if (item.type === 'effect') return shopState.equippedEffectId === item.id;
    if (item.type === 'wallpaper') return shopState.equippedWallpaperId === item.id;
    return false;
  }

  function handleItemAction(item) {
    if (!isOwned(item)) {
      const result = buyReward(item.id);
      setToast(result.ok ? t('shopBought') : result.reason === 'owned-item' ? t('shopOwned') : t('shopNeedMore'));
      if (result.ok) {
        setShopState(getRewardState());
      }
      return;
    }

    let result = { ok: false };
    if (item.type === 'theme') result = equipTheme(item.id);
    if (item.type === 'effect') result = equipEffect(item.id);
    if (item.type === 'wallpaper') result = equipWallpaper(item.id);

    if (result.ok) {
      setShopState(getRewardState());
      setToast(t('shopThemeApplied'));
    }
  }

  function renderVisual(item) {
    if (item.assetPath) {
      return <img className="shop-card__image" src={assetUrl(item.assetPath)} alt="" />;
    }
    if (item.type === 'effect') {
      return <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`} />;
    }
    if (item.preview && item.preview.length > 0 && item.preview[0] !== 'rain' && item.preview[0] !== 'snow' && item.preview[0] !== 'rainbow') {
      return (
        <div className="shop-card__theme-preview">
          {item.preview.map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
          <span className="shop-card__theme-icon">{item.icon}</span>
        </div>
      );
    }
    return <span className="shop-card__emoji">{item.icon}</span>;
  }

  return (
    <div className="shop-page" data-testid="shop-page">
      {/* Top balance bar */}
      <div className="shop-topbar">
        <span className="shop-topbar__balance">
          <span className="shop-topbar__crystal" aria-hidden="true">💎</span>
          <strong>{shopState.balance}</strong>
          <span className="shop-topbar__label">{t('crystals')}</span>
        </span>
      </div>

      {/* Auto-dismiss toast */}
      {toast && (
        <div className="shop-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {/* Category tabs */}
      <div className="shop-tabs" role="tablist" aria-label="Catégories">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`shop-tab${activeCategory === tab.key ? ' shop-tab--active' : ''}`}
            role="tab"
            aria-selected={activeCategory === tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flat item grid */}
      <div className="shop-grid" data-testid={`shop-section-${activeCategory}`}>
        {visibleItems.map((item) => {
          const owned = isOwned(item);
          const active = isActive(item);
          const canEquip = item.type === 'theme' || item.type === 'effect' || item.type === 'wallpaper';
          const disabled = owned && !canEquip;
          const btnLabel = !owned
            ? `Acheter ${item.price}💎`
            : active
            ? `Équipé ✓`
            : canEquip
            ? t('shopEquip')
            : t('shopOwned');

          return (
            <article
              key={item.id}
              className={`shop-card${owned ? ' shop-card--owned' : ''}${active ? ' shop-card--active' : ''}`}
              data-testid={`shop-item-${item.id}`}
            >
              <div className="shop-card__visual">
                {renderVisual(item)}
                {owned && <span className="shop-card__owned-badge" aria-label="Possédé">✓</span>}
              </div>
              <p className="shop-card__name">{getLabel(item)}</p>
              <p className="shop-card__price">
                {owned ? <span className="shop-card__owned-text">✓ Possédé</span> : `${item.price} 💎`}
              </p>
              <button
                className="shop-card__btn"
                type="button"
                onClick={() => handleItemAction(item)}
                disabled={disabled}
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
