# LénaLand V1 → V2 — Audit & Phased Plan

> Status: **Audit complete** (2026-06-11). No code changed yet.
> Mandate: build *one coherent adventure journey*, not improve individual screens.

---

## 1. How the journey actually flows today

Reading the router + screens, the real first-use path is **tangled and doubles back**:

```
App "/" ──(profile incomplete & not guest)──▶ /login
   /login (LoginPage) "welcome" step
        ├─ "Créer un compte" ▶ creer-enfant (name)
        │        ▶ setup-pin ▶ confirm-pin ▶ save-prompt(link Google?)
        │        ▶ /onboarding
        │              (language ▶ name AGAIN ▶ age/grade ▶ theme/world)
        │              ▶ handleStartAdventure ▶ navigates BACK to /login
        │                                       (to "set emoji PIN")  ⟲ LOOP
        ├─ "Code secret" ▶ pin entry
        └─ "Jouer sans compte" ▶ guest ▶ / (HomePage)
```

### The core problems (matches the contract's "disconnected" complaint)

1. **PIN is created twice / in the wrong place.** `LoginPage` creates+confirms the secret code *before* onboarding. Then `OnboardingFlow.handleStartAdventure` navigates *back to `/login`* "so the child can set their emoji PIN" — a step already done. The two flows don't know about each other. → confusing loop, name asked twice (login `creer-enfant` AND onboarding step 2).

2. **No single "journey" — three entry surfaces compete.**
   - `/` → `HomePage` (greeting + quick tiles + adventure dashboard)
   - `/apprendre` → `ApprendreHubPage` (hero + Grand Voyage card + 12 subject worlds + academies)
   - `/map` → `MapPage` (the actual Grand Voyage map)
   The child lands on `HomePage`, but Grand Voyage (contract says it must be *the center*) lives as a **card inside a different page** (`/apprendre`) that links to `/map`. Grand Voyage is demoted to a banner — exactly what the contract forbids.

3. **No reward is ever granted during onboarding.** The contract requires a reward before the journey starts. Today onboarding ends → loops to login → home. The "🎁 Ton premier cadeau t'attend" text on the welcome card is a *label*, not an actual reward grant.

4. **Mascot is inconsistent and used as decoration.** Three different mascot patterns:
   - `MascotHero` (LoginPage) — raw `<img>` of `mascot-happy/celebrate.svg`, swapped ad-hoc per step.
   - `Mascot.jsx` (in-activity) — full interactive mascot with bubbles, 5 states, click messages, dico button.
   - `ApprendreHubPage` hero, `OnboardingFlow` hero band — each hard-codes its own `mascot-happy.svg` `<img>`.
   - `PetMascot.jsx` — an unrelated equipped-pet emoji.
   There is **no canonical mascot component**. Expressions are chosen by `if (step===4)` literals scattered across files. The contract's "same face, same silhouette, only expressions change, used with intention" is not enforced anywhere.

5. **Login has too many doors.** Welcome step shows: Continue/Resume, Google, Email, Secret code, Create account, Play as guest, Customise mascot, Parents space, safety line. The contract asks for essentially two: 🔑 *Enter with code* (returning) / 🚀 *Start adventure* (new). Parent/Google complexity should be hidden behind a parents door.

6. **Secret code is framed as a form, not magic.** Copy: "Choisis 4 images faciles à retenir" / "Crée ton code secret". Functional, not a "choose your magical symbols / this is your magical key" moment. Pad labels say "Choisir {label}".

---

## 2. What is already good (preserve / build on)

- **Asset set exists**: `mascot-focused / happy / sad / celebrate.svg` + world art (`world-forest/ocean/sunset/galaxy`). Enough expressions for a canonical mascot.
- **Icon PIN system** (`PinIcons.jsx`, hash/save/load) works and is child-appropriate — keep the mechanism, re-skin the *experience*.
- **Reward store exists** (`rewardStore.js`, crystals/pets catalog) — a real "first reward" can be granted, not faked.
- **Grand Voyage map exists** (`/map`, `MapPage`, `worldMapData.js`) — needs promotion, not rebuilding from scratch.
- **Adaptive foundation already in progress** — see [[mission-impossible-project]] and [[adaptive-learning-project]] in memory; the "Learning Brain preparation" the contract asks for partly exists. Don't duplicate it.
- **i18n** is consistent (fr/nl/en/es) — any new copy must go through `useLocale`/`t`.

---

## 3. Phased plan (each phase independently shippable)

### Phase 0 — Finish the in-flight login work (already dirty in tree)
`LoginPage.jsx` + `app.css` are modified (tablet/iPad keypad commit). Land/verify that first so the audit work starts from a clean base. **No new scope.**

### Phase 1 — Canonical Mascot (foundation, unblocks everything)
- Create `src/shared/ui/LenaMascot.jsx`: one component, props `{ expression, size, accessory?, floating?, glow? }`.
  - `expression` ∈ idle | happy | thinking | sad | celebrate (maps to the existing 4 SVGs; idle=focused).
  - Owns the glow/breathe/float/sparkle shells currently duplicated in `MascotHero` and the hub hero.
- Refactor `MascotHero` (LoginPage), `OnboardingFlow` hero band, `ApprendreHubPage` hero, and in-activity `Mascot.jsx` to render `LenaMascot` for the *visual* (Mascot.jsx keeps its bubble/dico logic, delegates the body).
- **Acceptance**: grep shows no remaining raw `mascot-*.svg` `<img>` outside `LenaMascot`.

### Phase 2 — One linear First-Time Journey (kills the loop)
Target order from the contract: **Welcome → Meet Mascot → Choose Adventure → Create Secret Code → First Reward → Enter Grand Voyage.**
- Make a single ordered flow (extend `OnboardingFlow` as the spine; `/login` becomes only: returning-code entry + parents door).
- Remove the duplicate name prompt and the duplicate PIN creation. PIN is created **once**, inside the journey, as the "Create Secret Code" beat.
- Delete the `onboarding → /login` back-navigation. End of journey routes straight to Grand Voyage.
- Keep guest + Google/email, but behind a single discreet "Parents" entry.
- **Acceptance**: a new child never sees the same question twice and never bounces back to a prior screen.

### Phase 3 — Secret Code becomes magic
- Reframe copy: "Choisis tes symboles magiques" / "Voici ta clé magique de LénaLand". Reveal/seal animation on confirm. Mascot reacts (celebrate expression) when the key is sealed.
- Mechanism unchanged (icon PIN), only the experience + copy + mascot beat.

### Phase 4 — First Reward (never finish onboarding without one)
- On completing the journey, actually grant a starter reward via `rewardStore` (e.g. first crystal + a starter accessory/pet) and show a claim moment with the mascot. Persist it so it shows up in the hub afterwards.

### Phase 5 — Grand Voyage becomes the center
- Make Grand Voyage (`/map`) the primary post-login destination (landing or unmistakable hero CTA), not a card buried in `/apprendre`.
- Resolve the `HomePage` vs `ApprendreHubPage` vs `MapPage` three-hub overlap: pick one home, make Grand Voyage the spine, everything else (subjects, academies, games) hangs off it. The child always sees: where am I / what's unlocked / what's next.

### Phase 6 — Consistency audit pass
- Per the contract's "understand each screen in 3 seconds": remove duplicated buttons, unify reward cards, ensure mascot expressions are intentional, prune visual noise on welcome/hub.

---

## 4. Open decisions for the user (before Phase 2+)
- **Single home**: should the post-journey landing BE the Grand Voyage map, or a slim home whose hero IS Grand Voyage? (affects how much of HomePage/ApprendreHubPage we merge/retire)
- **Account model**: keep Google/email link prompt in the child journey at all, or move it entirely into the Parents space?
- **First reward**: crystal only, or crystal + first accessory/pet (uses existing catalog)?

---

## 5. Risk notes
- This touches the auth/route guard (`AppRouter` `needsOnboarding`/guest logic) — easy to strip a child of access on cold load. Any flow change must keep: anon/guest profiles, returning-code re-entry, and the `user===null` no-flash guard.
- `app.css` is large and shared; new mascot/journey styles should be additive, not rewrites of existing `.login-*` until Phase 6.
