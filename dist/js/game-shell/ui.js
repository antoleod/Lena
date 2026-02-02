export function bindButtons(root) {
  const buttons = {
    start: root.querySelector('[data-action="start"]'),
    validate: root.querySelector('[data-action="validate"]'),
    next: root.querySelector('[data-action="next"]'),
    hint: root.querySelector('[data-action="hint"]'),
    calm: root.querySelector('[data-action="calm"]')
  };
  return buttons;
}

const t = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);

export function renderHud(root, state, meta = {}) {
  const levelEl = root.querySelector("[data-level]");
  const coinsEl = root.querySelector("[data-coins]");
  const progressBar = root.querySelector(".gs-progress__bar");
  const starsEl = root.querySelector("[data-stars]");
  const diffEl = root.querySelector("[data-diff]");
  const rewardEl = root.querySelector("[data-reward-hint]");
  if (levelEl) levelEl.textContent = state.level;
  if (coinsEl) coinsEl.textContent = state.coins;
  if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, state.progress))}%`;
  if (starsEl) starsEl.textContent = "⭐".repeat(Math.min(3, state.stars || 0)) || "☆";
  if (diffEl) diffEl.textContent = meta.difficultyLabel || "";
  if (rewardEl && meta.nextReward) {
    rewardEl.textContent = `🪙 ${meta.nextReward.need} -> 🎁`;
  }
}

export function setQuestion(root, question) {
  const label = root.querySelector("[data-question]");
  if (label) label.textContent = question.prompt;
}

export function renderOptions(root, question, onSelect) {
  const container = root.querySelector("[data-options]");
  const dragArea = root.querySelector("[data-order-area]");
  if (!container) return;
  container.innerHTML = "";
  dragArea && (dragArea.innerHTML = "");
  if (question.type === "mcq") {
    question.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gs-option";
      btn.textContent = option.label;
      btn.setAttribute("aria-label", option.label);
      btn.addEventListener("click", () => {
        container.querySelectorAll(".gs-option").forEach((el) => el.dataset.selected = "false");
        btn.dataset.selected = "true";
        onSelect(option.value);
      });
      container.appendChild(btn);
    });
  } else if (question.type === "order" && dragArea) {
    dragArea.hidden = false;
    const picked = [];
    question.items.forEach((item) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "gs-order__pill";
      pill.textContent = item.label;
      pill.setAttribute("aria-label", item.label);
      pill.addEventListener("click", () => {
        pill.dataset.active = pill.dataset.active === "true" ? "false" : "true";
        if (pill.dataset.active === "true") {
          picked.push(item.value);
        } else {
          const idx = picked.indexOf(item.value);
          if (idx >= 0) picked.splice(idx, 1);
        }
        onSelect(picked.slice());
      });
      dragArea.appendChild(pill);
    });
  } else if (question.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "gs-option";
    input.placeholder = t("gameAnswerPlaceholder", "Ta réponse");
    input.setAttribute("aria-label", t("gameAnswerPlaceholder", "Ta réponse"));
    input.addEventListener("input", () => onSelect(input.value.trim()));
    container.appendChild(input);
  }
}

export function toggleButtons(buttons, state) {
  buttons.validate && (buttons.validate.disabled = !state.canValidate);
  buttons.next && (buttons.next.disabled = !state.canNext);
  buttons.start && (buttons.start.disabled = !state.canStart);
  if (buttons.hint) buttons.hint.hidden = !state.showHint;
}
