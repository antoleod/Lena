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

function getSectionTitle(key, t) {
  return {
    avatar: t('shopSectionAvatars'),
    theme: t('shopSectionThemes'),
    wallpaper: t('shopSectionWallpapers'),
    effect: t('shopSectionEffects'),
    sticker: t('shopSectionStickers'),
    accessory: t('shopSectionAccessories'),
    badge: t('shopSectionBadges'),
    frame: t('shopSectionFrames'),
    pet: t('shopSectionPets')
  }[key];
}

export default function ShopPage() {
  const { locale, t } = useLocale();
  const { themeId } = useTheme();
  const [shopState, setShopState] = useState(() => getRewardState());
  const [message, setMessage] = useState('');
  const catalog = getRewardCatalog();

  const sections = useMemo(() => ([
    { key: 'avatar', items: catalog.filter((item) => item.type === 'avatar').slice(0, 8) },
    { key: 'theme', items: catalog.filter((item) => item.type === 'theme').slice(0, 6) },
    { key: 'wallpaper', items: catalog.filter((item) => item.type === 'wallpaper').slice(0, 6) },
    { key: 'effect', items: catalog.filter((item) => item.type === 'effect').slice(0, 4) },
    { key: 'sticker', items: catalog.filter((item) => item.type === 'sticker').slice(0, 8) },
    { key: 'accessory', items: catalog.filter((item) => item.type === 'accessory').slice(0, 8) },
    { key: 'badge', items: catalog.filter((item) => item.type === 'badge').slice(0, 6) },
    { key: 'frame', items: catalog.filter((item) => item.type === 'frame').slice(0, 6) },
    { key: 'pet', items: catalog.filter((item) => item.type === 'pet').slice(0, 6) }
  ]).filter((section) => section.items.length), [catalog]);

  useEffect(() => {
    function sync() {
      setShopState(getRewardState());
    }
    window.addEventListener('lena-rewards-change', sync);
    return () => window.removeEventListener('lena-rewards-change', sync);
  }, []);

  function getLabel(item) {
    if (locale === 'nl') {
      return item.nameNl || item.name;
    }
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
      setMessage(result.ok ? t('shopBought') : result.reason === 'owned-item' ? t('shopOwned') : t('shopNeedMore'));
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
      setMessage(t('shopThemeApplied'));
    }
  }

  function renderVisual(item) {
    if (item.assetPath) {
      return <img className="reward-card__image" src={assetUrl(item.assetPath)} alt="" />;
    }

    if (item.type === 'effect') {
      return <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`}></div>;
    }

    return (
      <div className={`theme-preview${item.type === 'wallpaper' ? ' theme-preview--wallpaper' : ''}`}>
        <span className="theme-preview__icon">{item.icon}</span>
        {(item.preview || []).map((color) => (
          <span key={color} style={{ backgroundColor: color }}></span>
        ))}
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--compact" data-testid="shop-page">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('shop')}</span>
            <h2>{t('shopTitle')}</h2>
          </div>
          <span className="pill">{shopState.balance} {t('crystals')}</span>
        </div>
        <p className="panel__copy">{t('shopText')}</p>
        {message ? <div className="feedback-strip is-success"><strong>{message}</strong></div> : null}
      </section>

      {sections.map((section) => (
        <section key={section.key} className="panel panel--tight" data-testid={`shop-section-${section.key}`}>
          <div className="panel__header">
            <div>
              <span className="eyebrow">{getSectionTitle(section.key, t)}</span>
              <h3>{getSectionTitle(section.key, t)}</h3>
            </div>
          </div>
          <div className="reward-grid reward-grid--compact">
            {section.items.map((item) => {
              const owned = isOwned(item);
              const active = isActive(item);
              const canEquip = item.type === 'theme' || item.type === 'effect' || item.type === 'wallpaper';
              const disabled = owned && !canEquip;
              const label = !owned ? t('shopBuy') : active ? t('shopEquipped') : canEquip ? t('shopEquip') : t('shopOwned');
              const icon = !owned ? '💎' : active ? '✓' : canEquip ? '✨' : '🎁';

              return (
                <article key={item.id} className={`reward-card reward-card--compact${active ? ' is-active' : ''}`} data-testid={`shop-item-${item.id}`}>
                  {renderVisual(item)}
                  <div className="reward-card__body">
                    <h4>{getLabel(item)}</h4>
                    <p>{owned ? label : `${item.price} ${t('crystals')}`}</p>
                  </div>
                  <button
                    className={owned && active ? 'secondary-action' : 'primary-action'}
                    type="button"
                    onClick={() => handleItemAction(item)}
                    disabled={disabled}
                    data-testid={`shop-action-${item.id}`}
                  >
                    <span className="button-icon" aria-hidden="true">{icon}</span>
                    <span>{label}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
