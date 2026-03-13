import { useEffect, useMemo, useState } from 'react';
import { buyReward, equipEffect, equipTheme, equipWallpaper, getRewardCatalog, getRewardState } from '../../services/storage/rewardStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function ShopPage() {
  const { locale, t } = useLocale();
  const { themeId } = useTheme();
  const [shopState, setShopState] = useState(() => getRewardState());
  const [message, setMessage] = useState('');
  const catalog = getRewardCatalog();
  const sections = useMemo(() => ([
    { key: 'wallpaper', title: locale === 'nl' ? 'Achtergronden' : locale === 'es' ? 'Fondos' : locale === 'en' ? 'Wallpapers' : 'Fonds', items: catalog.filter((item) => item.type === 'wallpaper') },
    { key: 'theme', title: t('shopThemes'), items: catalog.filter((item) => item.type === 'theme') },
    { key: 'effect', title: locale === 'nl' ? 'Effecten' : locale === 'es' ? 'Efectos' : locale === 'en' ? 'Effects' : 'Effets', items: catalog.filter((item) => item.type === 'effect') },
    { key: 'avatar', title: locale === 'nl' ? 'Avatars' : locale === 'es' ? 'Avatares' : locale === 'en' ? 'Avatars' : 'Avatars', items: catalog.filter((item) => item.type === 'avatar') },
    { key: 'accessory', title: locale === 'nl' ? 'Accessoires' : locale === 'es' ? 'Accesorios' : locale === 'en' ? 'Accessories' : 'Accessoires', items: catalog.filter((item) => item.type === 'accessory') },
    { key: 'pet', title: locale === 'nl' ? 'Vriendjes' : locale === 'es' ? 'Mascotas' : locale === 'en' ? 'Pets' : 'Compagnons', items: catalog.filter((item) => item.type === 'pet') },
    { key: 'sticker', title: locale === 'nl' ? 'Stickers' : locale === 'es' ? 'Pegatinas' : locale === 'en' ? 'Stickers' : 'Stickers', items: catalog.filter((item) => item.type === 'sticker') }
  ]), [catalog, locale, t]);

  useEffect(() => {
    function sync() {
      setShopState(getRewardState());
    }
    window.addEventListener('lena-rewards-change', sync);
    return () => window.removeEventListener('lena-rewards-change', sync);
  }, []);

  function handleBuy(itemId) {
    const result = buyReward(itemId);
    if (result.ok) {
      setShopState(getRewardState());
      setMessage(t('shopBought'));
      return;
    }
    if (result.reason === 'owned-item') {
      setMessage(t('shopOwned'));
      return;
    }
    setMessage(t('shopNeedMore'));
  }

  function handleEquip(itemId) {
    const result = equipTheme(itemId);
    if (result.ok) {
      setShopState(getRewardState());
      setMessage(t('shopThemeApplied'));
    }
  }

  function handleEquipEffect(itemId) {
    const result = equipEffect(itemId);
    if (result.ok) {
      setShopState(getRewardState());
      setMessage(t('shopThemeApplied'));
    }
  }

  function handleEquipWallpaper(itemId) {
    const result = equipWallpaper(itemId);
    if (result.ok) {
      setShopState(getRewardState());
      setMessage(t('shopThemeApplied'));
    }
  }

  function getLabel(item) {
    return locale === 'nl' ? item.nameNl || item.name : item.name;
  }

  function isOwned(item) {
    if (item.id === 'theme-candy' || item.id === 'effect-rainbow' || item.id === 'wallpaper-dreamy-sky') {
      return true;
    }
    return shopState.inventory.includes(item.id);
  }

  function isActive(item) {
    if (item.type === 'theme') {
      return themeId === item.id;
    }
    if (item.type === 'effect') {
      return shopState.equippedEffectId === item.id;
    }
    if (item.type === 'wallpaper') {
      return shopState.equippedWallpaperId === item.id;
    }
    return false;
  }

  function handleUse(item) {
    if (item.type === 'theme') {
      handleEquip(item.id);
    } else if (item.type === 'effect') {
      handleEquipEffect(item.id);
    } else if (item.type === 'wallpaper') {
      handleEquipWallpaper(item.id);
    } else {
      handleBuy(item.id);
    }
  }

  function renderVisual(item) {
    if (item.assetPath) {
      return <img className="reward-card__image" src={assetUrl(item.assetPath)} alt="" />;
    }

    if (item.type === 'effect') {
      return <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`}></div>;
    }

    if (item.type === 'theme' || item.type === 'wallpaper') {
      return (
        <div className={`theme-preview${item.type === 'wallpaper' ? ' theme-preview--wallpaper' : ''}`}>
          <span className="theme-preview__icon">{item.icon}</span>
          {item.preview.map((color) => (
            <span key={color} style={{ backgroundColor: color }}></span>
          ))}
        </div>
      );
    }

    return <div className="reward-card__icon">{item.icon || '✨'}</div>;
  }

  return (
    <div className="page-stack page-stack--compact">
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
        <section key={section.key} className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{section.title}</span>
              <h3>{section.title}</h3>
            </div>
            <span className="pill">{section.items.length}</span>
          </div>
          <div className="reward-grid reward-grid--compact">
            {section.items.map((item) => {
              const owned = isOwned(item);
              const active = isActive(item);
              const equipable = item.type === 'theme' || item.type === 'effect' || item.type === 'wallpaper';
              return (
                <article key={item.id} className={`reward-card reward-card--compact reward-card--${item.type}${active ? ' is-active' : ''}`}>
                  {renderVisual(item)}
                  <div className="reward-card__body">
                    <h4>{getLabel(item)}</h4>
                    <p>{item.price} {t('crystals')}</p>
                  </div>
                  <button
                    className={owned ? (active ? 'secondary-action' : 'primary-action') : 'primary-action'}
                    type="button"
                    onClick={() => (owned && !equipable ? null : handleUse(item))}
                    disabled={owned && !equipable}
                  >
                    {!owned ? t('shopBuy') : active ? t('shopEquipped') : (equipable ? t('shopEquip') : t('shopOwned'))}
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
