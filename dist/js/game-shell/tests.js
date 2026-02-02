import { adjustDifficulty } from "./difficulty.js";
import { computeReward } from "./rewards.js";
import * as storage from "./storage.js";

export function runSmokeTests() {
  const results = [];
  results.push(["diff-up", adjustDifficulty(1, 3, 0) === 2]);
  results.push(["diff-down", adjustDifficulty(3, 0, 2) === 2]);
  const reward = computeReward({ correct: true, difficulty: 2, streak: 4, timeMs: 5000 });
  results.push(["reward", reward.coins > 0]);
  storage.saveGameState("test", { coins: 10 });
  const loaded = storage.loadGameState("test");
  results.push(["storage", loaded && loaded.coins === 10]);
  return results;
}

if (new URLSearchParams(window.location.search).get("dev") === "1") {
  console.info("[gameshell tests]", runSmokeTests());
}
