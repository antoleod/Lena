export default function StarReward({ stars = 1 }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', gap: 6 }}>
      {Array.from({ length: 3 }, (_, idx) => (
        <span key={idx} style={{ opacity: idx < stars ? 1 : 0.3 }}>⭐</span>
      ))}
    </span>
  );
}

