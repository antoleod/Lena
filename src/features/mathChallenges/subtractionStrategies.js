// ─────────────────────────────────────────────────────────────────────────────
// Step-by-step French explanations for two-digit subtraction, including the
// "borrow a ten" strategy — written the way a primary teacher would say it.
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a child-friendly, step-by-step explanation string for a − b. */
export function explainSubtraction(a, b) {
  if (a < b) {
    const diff = b - a;
    return `${a} − ${b} donne un nombre négatif, car ${a} est plus petit que ${b}. ` +
      `La réponse est −${diff}.`;
  }
  const au = a % 10, ad = Math.floor(a / 10);
  const bu = b % 10, bd = Math.floor(b / 10);

  if (b < 10) {
    return `${a} − ${b} = ${a - b}.`;
  }

  if (au >= bu) {
    // no borrow
    return `On commence par les unités : ${au} − ${bu} = ${au - bu}. ` +
      `Puis les dizaines : ${ad} − ${bd} = ${ad - bd}. ` +
      `Donc ${a} − ${b} = ${a - b}.`;
  }

  // borrow
  const newU = au + 10;
  const newD = ad - 1;
  return `Je ne peux pas faire ${au} − ${bu}. Alors je prends une dizaine : ` +
    `${ad} dizaines deviennent ${newD} dizaines, et ${au} unités deviennent ${newU} unités. ` +
    `${newU} − ${bu} = ${newU - bu}. Puis ${newD} − ${bd} = ${newD - bd}. ` +
    `Donc ${a} − ${b} = ${a - b}.`;
}

/** True if a − b needs a borrow (unit of a smaller than unit of b). */
export function needsBorrow(a, b) {
  return (a % 10) < (b % 10) && a >= b && b >= 10;
}

/** Short hint that does NOT reveal the answer. */
export function subtractionHint(a, b) {
  if (needsBorrow(a, b)) return 'Regarde les unités : si le chiffre du haut est plus petit, prends une dizaine.';
  return 'Calcule les unités d’abord, puis les dizaines.';
}
