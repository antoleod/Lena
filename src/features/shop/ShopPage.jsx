import { useEffect, useState } from 'react';
import { buyReward, equipEffect, equipTheme, getRewardCatalog, getRewardState } from '../../services/storage/rewardStore.js';
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
  const themes = catalog.filter((item) => item.type === 'theme');
  const effects = catalog.filter((item) => item.type === 'effect');
  const rewards = catalog.filter((item) => item.type !== 'theme' && item.type !== 'effect');

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

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Effects</span>
            <h3>Background effects</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {effects.map((item) => {
            const owned = item.id === 'effect-rainbow' || shopState.inventory.includes(item.id);
            const active = shopState.equippedEffectId === item.id;
            const label = locale === 'nl' ? item.nameNl || item.name : item.name;

            return (
              <article key={item.id} className="reward-card reward-card--effect">
                <div className={`effect-preview effect-preview--${item.id.replace('effect-', '')}`}></div>
                <div className="reward-card__body">
                  <h4>{label}</h4>
                  <p>{item.price} {t('crystals')}</p>
                </div>
                {!owned ? (
                  <button className="primary-action" type="button" onClick={() => handleBuy(item.id)}>
                    {t('shopBuy')}
                  </button>
                ) : (
                  <button className={active ? 'secondary-action' : 'primary-action'} type="button" onClick={() => handleEquipEffect(item.id)}>
                    {active ? t('shopEquipped') : t('shopEquip')}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('shopThemes')}</span>
            <h3>{t('theme')}</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {themes.map((item) => {
            const owned = item.id === 'theme-candy' || shopState.inventory.includes(item.id);
            const active = themeId === item.id;
            const label = locale === 'nl' ? item.nameNl || item.name : item.name;

            return (
              <article key={item.id} className="reward-card reward-card--theme">
                <div className="theme-preview">
                  {item.preview.map((color) => (
                    <span key={color} style={{ backgroundColor: color }}></span>
                  ))}
                </div>
                <div className="reward-card__body">
                  <h4>{label}</h4>
                  <p>{item.price} {t('crystals')}</p>
                </div>
                {!owned ? (
                  <button className="primary-action" type="button" onClick={() => handleBuy(item.id)}>
                    {t('shopBuy')}
                  </button>
                ) : (
                  <button className={active ? 'secondary-action' : 'primary-action'} type="button" onClick={() => handleEquip(item.id)}>
                    {active ? t('shopEquipped') : t('shopEquip')}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('shop')}</span>
            <h3>{t('shopChooseReward')}</h3>
          </div>
        </div>
        <div className="reward-grid reward-grid--compact">
          {rewards.map((item) => {
            const owned = shopState.inventory.includes(item.id);
            const label = locale === 'nl' ? item.nameNl || item.name : item.name;

            return (
              <article key={item.id} className="reward-card reward-card--compact">
                <img className="reward-card__image" src={assetUrl(item.assetPath)} alt="" />
                <div className="reward-card__body">
                  <h4>{label}</h4>
                  <p>{item.price} {t('crystals')}</p>
                </div>
                <button className={owned ? 'secondary-action' : 'primary-action'} type="button" onClick={() => handleBuy(item.id)}>
                  {owned ? t('shopOwned') : t('shopBuy')}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
