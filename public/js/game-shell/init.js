import { createState } from "./state.js";
import { adjustDifficulty, describeDifficulty } from "./difficulty.js";
import { computeReward, nextRewardProgress } from "./rewards.js";
import * as persistent from "./storage.js";
import { attachFeedback, sparkles } from "./feedback.js";
import { bindButtons, renderHud, setQuestion, renderOptions, toggleButtons } from "./ui.js";

const shellRoot = document.getElementById("game-shell-root");
if (shellRoot) {
  bootstrap(shellRoot);
}

function bootstrap(root) {
  const gameId = root.dataset.gameId || "demo-maths";
  const state = createState({ gameId, storage: persistent });
  const buttons = bindButtons(root);
  const feedback = attachFeedback(root);
  const machineFactory = window.LenaStateMachine?.createStateMachine;
  const throttleAction = window.LenaStateMachine?.throttleAction || ((fn) => fn);
  const machine = machineFactory
    ? machineFactory({ initial: "IDLE", onRender: renderMachine })
    : null;
  const devMode = new URLSearchParams(window.location.search).get("dev") === "1";
  const legacyProfile = safeLegacyProfile();
  let activeQuestion = null;
  let playerAnswer = null;
  let roundStart = null;
  let hasHinted = false;

  const questions = buildQuestionBank();

  const legacyCoins = safeLegacyCoins(legacyProfile);
  if (legacyCoins !== null) {
    state.update({ coins: legacyCoins });
  }

  const renderState = () => {
    const data = state.getState();
    renderHud(root, data, {
      difficultyLabel: describeDifficulty(data.difficulty),
      nextReward: nextRewardProgress(data.coins)
    });
  };

  state.subscribe(renderState);
  renderState();

  function nextQuestion() {
    activeQuestion = pickQuestion(questions, state.getState());
    playerAnswer = null;
    hasHinted = false;
    setQuestion(root, activeQuestion);
    renderOptions(root, activeQuestion, (answer) => {
      playerAnswer = answer;
      if (machine) {
        machine.setState("ANSWER_SELECTED");
      }
    });
    root.classList.remove("gs-shell--feedback");
    state.resetRound();
    roundStart = performance.now();
    if (machine) {
      machine.setState("PLAYING");
    } else {
      toggleButtons(buttons, { canValidate: false, canNext: false, canStart: false, showHint: false });
    }
  }

  buttons.start?.addEventListener("click", throttleAction(() => {
    nextQuestion();
  }));

  buttons.validate?.addEventListener("click", throttleAction(() => {
    if (playerAnswer === null || activeQuestion === null) return;
    const elapsed = performance.now() - (roundStart || performance.now());
    const correct = checkAnswer(activeQuestion, playerAnswer);
    const newDiff = adjustDifficulty(state.getState().difficulty, correct ? state.getState().streak + 1 : 0, correct ? 0 : state.getState().wrongStreak + 1);
    state.update({ difficulty: newDiff });
    state.applyOutcome({ correct, timeMs: elapsed });
    const reward = computeReward({
      correct,
      difficulty: newDiff,
      streak: state.getState().streak,
      timeMs: elapsed
    });
    if (reward.coins) {
      const newCoins = state.getState().coins + reward.coins;
      state.update({ coins: newCoins, stars: state.getState().stars + reward.stars, progress: Math.min(100, state.getState().progress + 8) });
      syncLegacyCoins(legacyProfile, newCoins);
      sparkles(root.querySelector(".gs-chip"));
    }
    feedback.show({
      type: correct ? "correct" : "retry",
      summary: reward.summary,
      coins: reward.coins,
      stars: reward.stars
    });
    if (machine) {
      machine.setState("VALIDATED");
    } else {
      toggleButtons(buttons, { canValidate: false, canNext: true, canStart: false, showHint: !correct && activeQuestion?.hint });
    }
  }));

  buttons.next?.addEventListener("click", throttleAction(() => {
    feedback.hide();
    nextQuestion();
    if (machine) {
      machine.setState("PLAYING");
    } else {
      toggleButtons(buttons, { canValidate: false, canNext: false, canStart: false, showHint: false });
    }
  }));

  buttons.hint?.addEventListener("click", throttleAction(() => {
    if (!activeQuestion?.hint || hasHinted) return;
    hasHinted = true;
    const hintArea = root.querySelector("[data-hint]");
    if (hintArea) {
      hintArea.textContent = activeQuestion.hint;
      hintArea.hidden = false;
    }
    if (machine) {
      machine.setState("ANSWER_SELECTED");
    }
  }));

  buttons.calm?.addEventListener("click", throttleAction(() => {
    const current = state.getState().calmMode;
    state.update({ calmMode: !current });
    root.classList.toggle("gs-calm", !current);
    if (typeof window.saveAppData === "function") {
      window.saveAppData({ calmMode: !current });
    }
  }));

  if (devMode) {
    mountDevPanel(root, state);
  }

  // time-to-fun: show first question immediately
  nextQuestion();
  if (machine) {
    machine.setState("PLAYING");
  } else {
    toggleButtons(buttons, { canValidate: false, canNext: false, canStart: true, showHint: false });
  }

  function renderMachine(snapshot) {
    const stateKey = snapshot.state;
    const hintReady = Boolean(activeQuestion?.hint && !hasHinted);
    if (!buttons) { return; }
    if (stateKey === "IDLE") {
      toggleButtons(buttons, { canValidate: false, canNext: false, canStart: true, showHint: false });
    } else if (stateKey === "PLAYING") {
      toggleButtons(buttons, { canValidate: false, canNext: false, canStart: false, showHint: false });
    } else if (stateKey === "ANSWER_SELECTED") {
      toggleButtons(buttons, { canValidate: true, canNext: false, canStart: false, showHint: hintReady });
    } else if (stateKey === "VALIDATED") {
      toggleButtons(buttons, { canValidate: false, canNext: true, canStart: false, showHint: hintReady });
    } else if (stateKey === "NEXT_READY") {
      toggleButtons(buttons, { canValidate: false, canNext: true, canStart: false, showHint: false });
    }
  }
}

function pickQuestion(bank, state) {
  const level = state.level || 1;
  const pool = bank.filter((q) => q.difficulty <= state.difficulty + 1);
  const list = pool.length ? pool : bank;
  return list[(level + state.streak) % list.length];
}

function buildQuestionBank() {
  return [
    {
      id: "add-1",
      type: "mcq",
      difficulty: 1,
      prompt: "3 + 4 = ?",
      answer: "7",
      options: [{ label: "7", value: "7" }, { label: "8", value: "8" }, { label: "6", value: "6" }],
      hint: "Compte tes doigts 🖐️✌️"
    },
    {
      id: "order-1",
      type: "order",
      difficulty: 2,
      prompt: "Classe du plus petit au plus grand",
      answer: ["2", "5", "9"],
      items: [{ label: "2", value: "2" }, { label: "9", value: "9" }, { label: "5", value: "5" }],
      hint: "Cherche le plus petit d'abord"
    },
    {
      id: "fill-1",
      type: "fill",
      difficulty: 3,
      prompt: "12 - 5 = ?",
      answer: "7",
      hint: "Compte en arriere"
    },
    {
      id: "mcq-emoji",
      type: "mcq",
      difficulty: 2,
      prompt: "Combien de lunes ? 🌙🌙🌙",
      answer: "3",
      options: [{ label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" }]
    }
  ];
}

function checkAnswer(question, answer) {
  if (question.type === "order") {
    return Array.isArray(answer) && answer.join(",") === question.answer.join(",");
  }
  return String(answer).trim() === String(question.answer).trim();
}

function mountDevPanel(root, state) {
  const panel = document.createElement("div");
  panel.className = "gs-dev";
  let last = performance.now();
  let frames = 0;
  function loop(now) {
    frames++;
    if (now - last >= 1000) {
      const fps = frames;
      const s = state.getState();
      panel.textContent = `dev\nfps:${fps}\ndiff:${s.difficulty}\nstreak:${s.streak}`;
      frames = 0;
      last = now;
    }
    requestAnimationFrame(loop);
  }
  loop(last);
  document.body.appendChild(panel);
}

function safeLegacyProfile() {
  try {
    return window.storage && typeof window.storage.loadUserProfile === "function"
      ? window.storage.loadUserProfile()
      : null;
  } catch {
    return null;
  }
}

function safeLegacyCoins(profile) {
  try {
    if (!profile || !window.storage || typeof window.storage.loadUserProgress !== "function") return null;
    const progress = window.storage.loadUserProgress(profile.name || profile.username || profile.id || "default");
    return progress?.userScore?.coins ?? null;
  } catch {
    return null;
  }
}

function syncLegacyCoins(profile, coins) {
  try {
    if (!profile || !window.storage || typeof window.storage.saveUserProgress !== "function" || typeof window.storage.loadUserProgress !== "function") return;
    const key = profile.name || profile.username || profile.id || "default";
    const current = window.storage.loadUserProgress(key) || { userScore: {} };
    current.userScore = Object.assign({}, current.userScore, { coins });
    window.storage.saveUserProgress(key, current);
  } catch {
    // ignore
  }
}
