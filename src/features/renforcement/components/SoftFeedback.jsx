export default function SoftFeedback({ message, detail }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        marginTop: 12,
        padding: '14px 16px',
        borderRadius: 18,
        border: '1px solid rgba(255, 207, 116, 0.35)',
        background: 'rgba(255, 207, 116, 0.15)'
      }}
    >
      <strong>{message}</strong>
      {detail ? <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: '0.95rem' }}>{detail}</p> : null}
    </div>
  );
}

