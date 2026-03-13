import { useEffect, useState } from 'react';
import { buyReward, equipTheme, getRewardCatalog, getRewardState } from '../../services/storage/rewardStore.js';
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
  const rewards = catalog.filter((item) => item.type !== 'theme');

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

  return (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-panel hero-panel--primary">
          <span className="eyebrow">{t('shop')}</span>
          <h2>{t('shopTitle')}</h2>
          <p>{t('shopText')}</p>
          <div className="hero-badges">
            <span className="pill">{t('crystals')}: {shopState.balance}</span>
            <span className="pill">{t('shopOwnedItems')}: {shopState.inventory.length}</span>
            <span className="pill">{t('theme')}: {themeId}</span>
          </div>
          {message ? <div className="feedback-panel is-success"><p>{message}</p></div> : null}
        </div>
        <div className="hero-panel hero-panel--stats">
          <div className="stat-card">
            <span>{t('crystals')}</span>
            <strong>{shopState.balance}</strong>
          </div>
          <div className="stat-card">
            <span>{t('shopOwnedItems')}</span>
            <strong>{shopState.inventory.length}</strong>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('shopThemes')}</span>
            <h3>{t('shopChooseReward')}</h3>
          </div>
        </div>
        <div className="reward-grid">
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
                  <span className="pill">{t('theme')}</span>
                  <h4>{label}</h4>
                  <p>{item.price} {t('crystals')}</p>
                </div>
                {!owned ? (
                  <button className="primary-action" type="button" onClick={() => handleBuy(item.id)}>
                    {t('shopBuy')}
                  </button>
                ) : (
                  <button
                    className={active ? 'secondary-action' : 'primary-action'}
                    type="button"
                    onClick={() => handleEquip(item.id)}
                  >
                    {active ? t('shopEquipped') : t('shopEquip')}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('shop')}</span>
            <h3>{t('shopChooseReward')}</h3>
          </div>
        </div>
        <div className="reward-grid">
          {rewards.map((item) => {
            const owned = shopState.inventory.includes(item.id);
            const label = locale === 'nl' ? item.nameNl || item.name : item.name;

            return (
              <article key={item.id} className="reward-card">
                <img className="reward-card__image" src={assetUrl(item.assetPath)} alt="" />
                <div className="reward-card__body">
                  <span className="pill">{item.type}</span>
                  <h4>{label}</h4>
                  <p>{item.price} {t('crystals')}</p>
                </div>
                <button
                  className={owned ? 'secondary-action' : 'primary-action'}
                  type="button"
                  onClick={() => handleBuy(item.id)}
                >
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
