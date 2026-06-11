// ─────────────────────────────────────────────────────────────────────────────
// Grade model — canonical primary-school grade keys + age/label mapping.
//
// Canonical keys are Belgian "primaire": P1..P6. The same ladder is rendered with
// the localized label for the child's country system (BE-fr / BE-nl / FR).
//
// This is the shared source of truth used by onboarding (Phase A), the difficulty
// matrix (Phase C) and the adaptive engine (Phase E). Keep it pure & dependency-free.
// ─────────────────────────────────────────────────────────────────────────────

/** Ordered canonical grade keys. */
export const GRADE_KEYS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

/** Typical age for each grade (used to reconcile age vs grade). */
export const GRADE_TYPICAL_AGE = { P1: 6, P2: 7, P3: 8, P4: 9, P5: 10, P6: 11 };

/** Localized labels per country system. */
const GRADE_LABELS = {
  'BE-fr': { P1: '1ère primaire', P2: '2ème primaire', P3: '3ème primaire', P4: '4ème primaire', P5: '5ème primaire', P6: '6ème primaire' },
  'BE-nl': { P1: '1ste leerjaar', P2: '2de leerjaar', P3: '3de leerjaar', P4: '4de leerjaar', P5: '5de leerjaar', P6: '6de leerjaar' },
  'FR':    { P1: 'CP', P2: 'CE1', P3: 'CE2', P4: 'CM1', P5: 'CM2', P6: '6e' },
};

/** Default country system inferred from the child's UI language. */
export function defaultCountrySystem(language) {
  if (language === 'nl') return 'BE-nl';
  return 'BE-fr';
}

/** Render the localized label for a canonical grade key. */
export function gradeLabel(gradeKey, countrySystem = 'BE-fr') {
  const set = GRADE_LABELS[countrySystem] || GRADE_LABELS['BE-fr'];
  return set[gradeKey] || gradeKey;
}

/** Map an age to the grade a child of that age is typically in. */
export function gradeFromAge(age) {
  const a = Number(age) || 0;
  if (a <= 6) return 'P1';
  if (a >= 11) return 'P6';
  // P1=6, P2=7, … P6=11
  const key = `P${a - 5}`;
  return GRADE_KEYS.includes(key) ? key : 'P3';
}

/** Numeric index (1-based) of a grade key, for comparisons. */
export function gradeIndex(gradeKey) {
  const i = GRADE_KEYS.indexOf(gradeKey);
  return i === -1 ? null : i + 1;
}

/** Build [{ key, label, age }] options for pickers. */
export function gradeOptions(countrySystem = 'BE-fr') {
  return GRADE_KEYS.map((key) => ({
    key,
    label: gradeLabel(key, countrySystem),
    age: GRADE_TYPICAL_AGE[key],
  }));
}
