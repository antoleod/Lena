export function computeReward({ correct, difficulty, streak, timeMs }) {
  if (!correct) {
    return { coins: 0, stars: 0, summary: "🔁" };
  }
  const base = 4 + difficulty;
  const speedBonus = timeMs && timeMs < 8000 ? 2 : 0;
  const streakBonus = Math.min(3, Math.floor((streak || 0) / 2));
  const coins = base + speedBonus + streakBonus;
  const stars = streak >= 3 ? 1 : 0;
  return {
    coins,
    stars,
    summary: `🪙 +${coins}${stars ? " ⭐ +1" : ""}`
  };
}

export function nextRewardProgress(coins, step = 25) {
  const need = step - (coins % step || step);
  return { need, step };
}
