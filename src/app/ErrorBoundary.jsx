import { Component } from 'react';

/**
 * Catches any unhandled React render error and shows a friendly
 * recovery screen instead of a blank/crashed page.
 * Auto-redirects to "/" after 4 seconds.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: null };
    this._timer = null;
  }

  static getDerivedStateFromError(error) {
    return { crashed: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Lena] Erreur inattendue :', error, info?.componentStack ?? '');
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.crashed && !prevState.crashed) {
      this._timer = setTimeout(() => {
        this.setState({ crashed: false, error: null });
        try { window.location.replace('/'); } catch (_) {}
      }, 4000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  handleGoHome() {
    clearTimeout(this._timer);
    this.setState({ crashed: false, error: null });
    try { window.location.replace('/'); } catch (_) {}
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    return (
      <div style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '32px 20px',
        background: 'linear-gradient(160deg,#0d1b2a,#0f2318)',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: '4rem' }}>🥷</span>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>
          Oups ! Quelque chose s&apos;est cassé.
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6, maxWidth: 320 }}>
          Ne t&apos;inquiète pas, on te ramène à l&apos;accueil automatiquement…
        </p>
        <button
          type="button"
          onClick={() => this.handleGoHome()}
          style={{
            marginTop: 8,
            padding: '14px 36px',
            borderRadius: 18,
            border: 'none',
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(34,197,94,.4)',
          }}
        >
          🏠 Retour à l&apos;accueil
        </button>
      </div>
    );
  }
}
