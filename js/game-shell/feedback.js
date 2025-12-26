export function attachFeedback(root) {
  const overlay = root.querySelector(".gs-feedback");
  const iconEl = root.querySelector("[data-feedback-icon]");
  const summaryEl = root.querySelector("[data-feedback-summary]");
  const coinsEl = root.querySelector("[data-feedback-coins]");
  const starsEl = root.querySelector("[data-feedback-stars]");

  function show({ type = "neutral", summary = "", coins = 0, stars = 0 }) {
    if (!overlay) return;
    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    overlay.hidden = false;
    iconEl.textContent = type === "correct" ? "✅" : type === "almost" ? "❗" : "🔁";
    summaryEl.textContent = summary || "";
    coinsEl.textContent = coins ? `🪙 ${coins}` : "";
    starsEl.textContent = stars ? `⭐ ${stars}` : "";
    if (!prefersReduce) {
      overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
    }
  }

  function hide() {
    if (!overlay) return;
    overlay.hidden = true;
  }

  return { show, hide };
}

export function sparkles(target) {
  if (!target) return;
  const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return;
  const el = document.createElement("div");
  el.className = "gs-floating-coins";
  el.textContent = "✨";
  const rect = target.getBoundingClientRect();
  el.style.left = `${rect.left + rect.width / 2}px`;
  el.style.top = `${rect.top}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}
