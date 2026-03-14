import { useState } from 'react';
import { useWebInstallPrompt } from '../hooks/useWebInstallPrompt.js';

export default function InstallAppButton({ className = 'secondary-action', compact = false }) {
  const { canInstall, isStandalone, install } = useWebInstallPrompt();
  const [busy, setBusy] = useState(false);

  if (isStandalone || !canInstall) {
    return null;
  }

  async function handleInstall() {
    setBusy(true);
    await install();
    setBusy(false);
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleInstall}
      disabled={busy}
      data-testid={compact ? 'install-app-compact' : 'install-app'}
    >
      <span className="button-icon" aria-hidden="true">⬇</span>
      <span>{busy ? 'Installation...' : 'Installer l app'}</span>
    </button>
  );
}
