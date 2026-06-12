/**
 * Génère un set d'avatars enfants (DiceBear · avataaars) — 3 axes personnalisables
 * demandés : couleur de peau, vêtements, lunettes. Presets « enfant joyeux »
 * (sourire, pas de barbe, cheveux d'enfant, habits colorés).
 *
 *   node scripts/gen-avatars.mjs
 *
 * Sortie : public/assets/characters/avatars/avatar-01.svg … avatar-12.svg
 * DiceBear est une devDependency ; avataaars est libre d'usage commercial.
 */
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = 'public/assets/characters/avatars';
mkdirSync(OUT, { recursive: true });

// Palettes (hex sans #)
const SKIN  = { porcelaine:'ffe0bd', clair:'f1c27d', dore:'e8b87f', hale:'c68642', brun:'8d5524', fonce:'5c3a21' };
const HAIR  = { brun:'4a312c', noir:'1f1a17', blond:'e6b34d', roux:'c0492b', chocolat:'724133', clair:'b58143' };
const CLOTHE= { indigo:'5b6cf0', teal:'22b8c2', rose:'ff6fae', ambre:'ffb13b', vert:'6fd06a', orange:'ff8a5b' };

// 12 combos qui montrent la variété (peau × cheveux × habit × lunettes on/off)
const COMBOS = [
  { skin:SKIN.porcelaine, top:'shortFlat',   hair:HAIR.brun,     cloth:'hoodie',        cc:CLOTHE.indigo, glasses:null },
  { skin:SKIN.clair,      top:'bob',          hair:HAIR.blond,    cloth:'shirtCrewNeck', cc:CLOTHE.rose,   glasses:'round' },
  { skin:SKIN.dore,       top:'shortCurly',   hair:HAIR.noir,     cloth:'overall',       cc:CLOTHE.teal,   glasses:null },
  { skin:SKIN.dore,       top:'fro',          hair:HAIR.roux,     cloth:'graphicShirt',  cc:CLOTHE.ambre,  glasses:'sunglasses' },
  { skin:SKIN.hale,       top:'bigHair',      hair:HAIR.chocolat, cloth:'hoodie',        cc:CLOTHE.indigo, glasses:'prescription02' },
  { skin:SKIN.brun,       top:'shortWaved',   hair:HAIR.noir,     cloth:'shirtVNeck',    cc:CLOTHE.vert,   glasses:null },
  { skin:SKIN.brun,       top:'straight02',   hair:HAIR.blond,    cloth:'shirtCrewNeck', cc:CLOTHE.orange, glasses:'wayfarers' },
  { skin:SKIN.porcelaine, top:'shavedSides',  hair:HAIR.brun,     cloth:'hoodie',        cc:CLOTHE.rose,   glasses:null },
  { skin:SKIN.clair,      top:'bun',          hair:HAIR.clair,    cloth:'overall',       cc:CLOTHE.indigo, glasses:'round' },
  { skin:SKIN.fonce,      top:'dreads',       hair:HAIR.noir,     cloth:'hoodie',        cc:CLOTHE.teal,   glasses:null },
  { skin:SKIN.hale,       top:'shortRound',   hair:HAIR.chocolat, cloth:'graphicShirt',  cc:CLOTHE.vert,   glasses:'prescription01' },
  { skin:SKIN.clair,      top:'curly',        hair:HAIR.roux,     cloth:'shirtCrewNeck', cc:CLOTHE.ambre,  glasses:null },
];

let n = 0;
for (const c of COMBOS) {
  n += 1;
  const svg = createAvatar(avataaars, {
    seed: `lena-avatar-${n}`,
    backgroundColor: ['transparent'],
    radius: 0,
    // axes
    skinColor: [c.skin],
    top: [c.top],
    hairColor: [c.hair],
    clothing: [c.cloth],
    clothesColor: [c.cc],
    accessories: c.glasses ? [c.glasses] : [],
    accessoriesProbability: c.glasses ? 100 : 0,
    // presets « enfant joyeux »
    eyes: ['default', 'happy', 'wink'],
    eyebrows: ['default', 'raisedExcited'],
    mouth: ['smile', 'twinkle'],
    facialHairProbability: 0,
  }).toString();
  const id = String(n).padStart(2, '0');
  writeFileSync(`${OUT}/avatar-${id}.svg`, svg);
}
console.log(`generated ${n} avatars in ${OUT}`);
