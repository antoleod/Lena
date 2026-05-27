export const WORLD_STYLES = [
  { emoji: '🌱', color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)', deco: '🍀' },
  { emoji: '🌊', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', deco: '🐚' },
  { emoji: '🍭', color: '#f96bbd', shadow: '#c93d90', bg: 'linear-gradient(145deg,#ffc2e8,#f96bbd)', deco: '🍬' },
  { emoji: '⚡', color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)', deco: '✨' },
  { emoji: '🌟', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', deco: '💫' },
  { emoji: '🍊', color: '#ff7e3e', shadow: '#c44f10', bg: 'linear-gradient(145deg,#ffcba8,#ff7e3e)', deco: '🌴' },
  { emoji: '💎', color: '#40d4e8', shadow: '#009fba', bg: 'linear-gradient(145deg,#aaeffa,#40d4e8)', deco: '🔷' },
  { emoji: '🌸', color: '#ff85a1', shadow: '#c9456b', bg: 'linear-gradient(145deg,#ffc7d5,#ff85a1)', deco: '🌺' },
  { emoji: '👑', color: '#ffe24f', shadow: '#b89500', bg: 'linear-gradient(145deg,#fff4a0,#ffe24f)', deco: '🏆' },
  { emoji: '🧙', color: '#8b5cf6', shadow: '#5b21b6', bg: 'linear-gradient(145deg,#c4b5fd,#8b5cf6)', deco: '🔮' },
  { emoji: '🦋', color: '#f472b6', shadow: '#be185d', bg: 'linear-gradient(145deg,#fbcfe8,#f472b6)', deco: '🌈' },
  { emoji: '🐉', color: '#ef4444', shadow: '#991b1b', bg: 'linear-gradient(145deg,#fca5a5,#ef4444)', deco: '🔥' },
  { emoji: '🌙', color: '#6366f1', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#6366f1)', deco: '⭐' },
  { emoji: '🦄', color: '#ec4899', shadow: '#9d174d', bg: 'linear-gradient(145deg,#fbcfe8,#ec4899)', deco: '🌟' },
  { emoji: '🏔️', color: '#64748b', shadow: '#334155', bg: 'linear-gradient(145deg,#cbd5e1,#64748b)', deco: '❄️' },
];

export function getWorldTheme(worldOrder) {
  return WORLD_STYLES[(worldOrder - 1) % WORLD_STYLES.length];
}
