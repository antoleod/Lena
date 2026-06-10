import { useFullScreen } from '../hooks/useFullScreen.js';
import { useLocale } from '../i18n/LocaleContext.jsx';

const FS_LABELS = {
  fr: { enter: '⛶ Plein écran', exit: '✕ Quitter plein écran' },
  nl: { enter: '⛶ Volledig scherm', exit: '✕ Volledig scherm verlaten' },
  en: { enter: '⛶ Full screen', exit: '✕ Exit full screen' },
  es: { enter: '⛶ Pantalla completa', exit: '✕ Salir de pantalla completa' },
};

export default function GameFullScreenWrapper({ children, className = '' }) {
  const { locale } = useLocale();
  const { isFullScreen, toggle, elementRef } = useFullScreen();
  const labels = FS_LABELS[locale] || FS_LABELS.fr;

  return (
    <div ref={elementRef} className={`gfs-wrapper ${isFullScreen ? 'gfs-wrapper--fullscreen' : ''} ${className}`}>
      {children}
      <button
        className="gfs-btn"
        onClick={toggle}
        aria-label={isFullScreen ? labels.exit : labels.enter}
        title={isFullScreen ? labels.exit : labels.enter}
      >
        {isFullScreen ? '⊡' : '⛶'}
      </button>
    </div>
  );
}
