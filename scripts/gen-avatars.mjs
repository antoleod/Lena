/**
 * Génère un set d'avatars enfants (DiceBear · miniavs) — style mignon/enfantin.
 * Axes personnalisables : couleur de peau, vêtement (corps + couleur), lunettes,
 * cheveux. Presets « enfant » : joues roses, yeux joyeux, dent manquante.
 *
 *   node scripts/gen-avatars.mjs
 *
 * Sortie : public/assets/characters/avatars/avatar-01.svg … avatar-12.svg
 * DiceBear est une devDependency.
 */
import { createAvatar } from '@dicebear/core';
import { miniavs } from '@dicebear/collection';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = 'public/assets/characters/avatars';
mkdirSync(OUT, { recursive: true });

// Palettes (hex sans #)
const SKIN   = { porcelaine:'ffe0bd', clair:'f1c27d', dore:'e8b87f', hale:'c68642', brun:'8d5524', fonce:'5c3a21' };
const HAIR   = { brun:'4a312c', noir:'1f1a17', blond:'e6b34d', roux:'c0492b', chocolat:'724133', clair:'b58143' };
const CLOTHE = { indigo:'5b6cf0', teal:'22b8c2', rose:'ff6fae', ambre:'ffb13b', vert:'6fd06a', orange:'ff8a5b' };

// 12 combos (peau × cheveux × vêtement+couleur × lunettes on/off)
const COMBOS = [
  { skin:SKIN.porcelaine, hair:'classic01', hc:HAIR.brun,     body:'tShirt', cc:CLOTHE.indigo, glasses:false },
  { skin:SKIN.clair,      hair:'ponyTail',  hc:HAIR.blond,    body:'tShirt', cc:CLOTHE.rose,   glasses:true  },
  { skin:SKIN.dore,       hair:'curly',     hc:HAIR.noir,     body:'golf',   cc:CLOTHE.teal,   glasses:false },
  { skin:SKIN.dore,       hair:'stylish',   hc:HAIR.roux,     body:'tShirt', cc:CLOTHE.ambre,  glasses:true  },
  { skin:SKIN.hale,       hair:'long',      hc:HAIR.chocolat, body:'tShirt', cc:CLOTHE.indigo, glasses:false },
  { skin:SKIN.brun,       hair:'classic02', hc:HAIR.noir,     body:'golf',   cc:CLOTHE.vert,   glasses:false },
  { skin:SKIN.brun,       hair:'ponyTail',  hc:HAIR.blond,    body:'tShirt', cc:CLOTHE.orange, glasses:true  },
  { skin:SKIN.porcelaine, hair:'stylish',   hc:HAIR.brun,     body:'tShirt', cc:CLOTHE.rose,   glasses:false },
  { skin:SKIN.clair,      hair:'long',      hc:HAIR.clair,    body:'golf',   cc:CLOTHE.indigo, glasses:true  },
  { skin:SKIN.fonce,      hair:'curly',     hc:HAIR.noir,     body:'tShirt', cc:CLOTHE.teal,   glasses:false },
  { skin:SKIN.hale,       hair:'classic01', hc:HAIR.chocolat, body:'tShirt', cc:CLOTHE.vert,   glasses:true  },
  { skin:SKIN.clair,      hair:'curly',     hc:HAIR.roux,     body:'golf',   cc:CLOTHE.ambre,  glasses:false },
];

let n = 0;
for (const c of COMBOS) {
  n += 1;
  const svg = createAvatar(miniavs, {
    seed: `lena-avatar-${n}`,
    backgroundColor: ['transparent'],
    // axes
    skinColor: [c.skin],
    hair: [c.hair],
    hairColor: [c.hc],
    body: [c.body],
    bodyColor: [c.cc],
    glasses: ['normal'],
    glassesProbability: c.glasses ? 100 : 0,
    // presets « enfant joyeux »
    head: ['normal', 'wide'],
    eyes: ['happy', 'normal'],
    mouth: ['default', 'missingTooth'],
    blushesProbability: 100,
    mustacheProbability: 0,
  }).toString();
  const id = String(n).padStart(2, '0');
  writeFileSync(`${OUT}/avatar-${id}.svg`, svg);
}
console.log(`generated ${n} miniavs avatars in ${OUT}`);
