/** SVG illustrations for the Fun section — one per type + theme. */

function IllusBlague({ theme }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
      {/* face */}
      <circle cx="60" cy="50" r="38" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" />
      {/* eyes — happy */}
      <ellipse cx="44" cy="43" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="76" cy="43" rx="5" ry="6" fill="#1e293b" />
      {/* eye shine */}
      <circle cx="46" cy="41" r="2" fill="white" />
      <circle cx="78" cy="41" r="2" fill="white" />
      {/* big laugh mouth */}
      <path d="M38 57 Q60 78 82 57" fill="#f43f5e" stroke="#c2385e" strokeWidth="1.5" />
      <path d="M38 57 Q60 68 82 57" fill="white" />
      {/* tears of joy */}
      <ellipse cx="32" cy="50" rx="3" ry="5" fill="#93c5fd" opacity=".8" />
      <ellipse cx="88" cy="50" rx="3" ry="5" fill="#93c5fd" opacity=".8" />
      {/* stars around */}
      <text x="8"  y="22" fontSize="16">✨</text>
      <text x="96" y="22" fontSize="16">✨</text>
      <text x="52" y="10" fontSize="14">😂</text>
    </svg>
  );
}

function IllusDevinette({ theme }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
      {/* magnifying glass handle */}
      <line x1="76" y1="72" x2="100" y2="96" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
      {/* glass circle */}
      <circle cx="52" cy="48" r="34" fill="#eff6ff" stroke="#8b5cf6" strokeWidth="4" />
      {/* big question mark */}
      <text x="38" y="66" fontSize="44" fill="#8b5cf6" fontWeight="900">?</text>
      {/* sparkles */}
      <text x="88" y="20" fontSize="14">✨</text>
      <text x="4"  y="16" fontSize="12">💡</text>
    </svg>
  );
}

function IllusProverbe({ theme }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
      {/* scroll body */}
      <rect x="18" y="22" width="84" height="58" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
      {/* scroll rolls */}
      <ellipse cx="18" cy="51" rx="10" ry="29" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
      <ellipse cx="102" cy="51" rx="10" ry="29" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
      {/* lines of text */}
      <line x1="30" y1="38" x2="90" y2="38" stroke="#d97706" strokeWidth="2" opacity=".6" />
      <line x1="30" y1="48" x2="90" y2="48" stroke="#d97706" strokeWidth="2" opacity=".6" />
      <line x1="30" y1="58" x2="75" y2="58" stroke="#d97706" strokeWidth="2" opacity=".6" />
      <line x1="30" y1="68" x2="84" y2="68" stroke="#d97706" strokeWidth="2" opacity=".6" />
      {/* quill */}
      <text x="72" y="88" fontSize="22">🖋️</text>
    </svg>
  );
}

function IllusPoeme({ theme }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
      {/* open book */}
      <path d="M12 20 Q60 12 60 20 L60 82 Q12 90 12 82 Z" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
      <path d="M108 20 Q60 12 60 20 L60 82 Q108 90 108 82 Z" fill="#fff" stroke="#ec4899" strokeWidth="2" />
      <line x1="60" y1="20" x2="60" y2="82" stroke="#ec4899" strokeWidth="2.5" />
      {/* lines on left page */}
      <line x1="22" y1="36" x2="54" y2="34" stroke="#f9a8d4" strokeWidth="1.8" />
      <line x1="22" y1="45" x2="50" y2="43" stroke="#f9a8d4" strokeWidth="1.8" />
      <line x1="22" y1="54" x2="54" y2="52" stroke="#f9a8d4" strokeWidth="1.8" />
      <line x1="22" y1="63" x2="46" y2="61" stroke="#f9a8d4" strokeWidth="1.8" />
      {/* flower on right page */}
      <text x="72" y="62" fontSize="36">🌸</text>
    </svg>
  );
}

function IllusConte({ theme }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
      {/* castle */}
      <rect x="30" y="48" width="60" height="42" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="2" />
      {/* towers */}
      <rect x="22" y="36" width="20" height="54" fill="#bae6fd" stroke="#06b6d4" strokeWidth="2" />
      <rect x="78" y="36" width="20" height="54" fill="#bae6fd" stroke="#06b6d4" strokeWidth="2" />
      {/* battlements left */}
      <rect x="22" y="28" width="5" height="10" fill="#0ea5e9" />
      <rect x="30" y="28" width="5" height="10" fill="#0ea5e9" />
      <rect x="38" y="28" width="5" height="10" fill="#0ea5e9" />
      {/* battlements right */}
      <rect x="78" y="28" width="5" height="10" fill="#0ea5e9" />
      <rect x="86" y="28" width="5" height="10" fill="#0ea5e9" />
      <rect x="94" y="28" width="5" height="10" fill="#0ea5e9" />
      {/* door */}
      <path d="M50 90 L50 66 Q60 58 70 66 L70 90 Z" fill="#0369a1" />
      {/* windows */}
      <rect x="35" y="52" width="10" height="12" rx="5" fill="#7dd3fc" />
      <rect x="75" y="52" width="10" height="12" rx="5" fill="#7dd3fc" />
      {/* star */}
      <text x="51" y="22" fontSize="20">⭐</text>
    </svg>
  );
}

const ILLUSTRATORS = {
  blague:    IllusBlague,
  devinette: IllusDevinette,
  proverbe:  IllusProverbe,
  poeme:     IllusPoeme,
  conte:     IllusConte,
};

export default function FunIllustration({ type, theme, size = 'normal' }) {
  const Comp = ILLUSTRATORS[type] || IllusBlague;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <Comp theme={theme} size={size} />
    </div>
  );
}
