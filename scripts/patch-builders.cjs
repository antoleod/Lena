/* One-shot script: patch exam-builders.mjs to add locale fields. */
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'exam-builders.mjs');
let c = fs.readFileSync(file, 'utf8');

// 1. Update mc/tf/fb helpers to accept extra locale fields
c = c
  .replace(
    "const mc = (prompt, options, answer, correction) => ({ id: Q(), type: 'mcq', prompt, options, answer: String(answer), correction });",
    "const mc = (prompt, options, answer, correction, x) => ({ id: Q(), type: 'mcq', prompt, options, answer: String(answer), correction, ...(x||{}) });"
  )
  .replace(
    "const tf = (prompt, answer, correction) => ({ id: Q(), type: 'true_false', prompt, answer, correction });",
    "const tf = (prompt, answer, correction, x) => ({ id: Q(), type: 'true_false', prompt, answer, correction, ...(x||{}) });"
  )
  .replace(
    "const fb = (prompt, answer, correction, accept) => ({ id: Q(), type: 'fill_blank', prompt, answer: String(answer), accept, correction });",
    "const fb = (prompt, answer, correction, accept, x) => ({ id: Q(), type: 'fill_blank', prompt, answer: String(answer), accept, correction, ...(x||{}) });"
  );

// 2. Mesures: add locale field to push calls
const mesOld = `        if (kind === 'cm-mm') { answer = x * 10; prompt = \`Convertis \${x} cm en mm.\`; accept = [\`\${answer}\`, \`\${answer} mm\`]; corr = \`1 cm = 10 mm → \${answer} mm.\`; }
        else if (kind === 'm-cm') { answer = x * 100; prompt = \`Convertis \${x} m en cm.\`; accept = [\`\${answer}\`, \`\${answer} cm\`]; corr = \`1 m = 100 cm → \${answer} cm.\`; }
        else if (kind === 'kg-g') { answer = x * 1000; prompt = \`Convertis \${x} kg en g.\`; accept = [\`\${answer}\`, \`\${answer} g\`]; corr = \`1 kg = 1000 g → \${answer} g.\`; }
        else if (kind === 'euro') { answer = x * 100; prompt = \`Convertis \${x} € en centimes.\`; accept = [\`\${answer}\`, \`\${answer} centimes\`, \`\${answer} c\`]; corr = \`1 € = 100 c → \${answer} centimes.\`; }
        else { answer = x * 60; prompt = \`Convertis \${x} heure(s) en minutes.\`; accept = [\`\${answer}\`, \`\${answer} min\`]; corr = \`1 h = 60 min → \${answer} min.\`; }
        qs.push(i % 3 === 1
          ? fb(prompt, String(answer), corr, accept)
          : mc(prompt, numOpts(rng, answer, Math.max(2, Math.round(answer / 5))), answer, corr));`;
const mesNew = `        let _x = {};
        if (kind === 'cm-mm') { answer = x * 10; prompt = \`Convertis \${x} cm en mm.\`; accept = [\`\${answer}\`, \`\${answer} mm\`]; corr = \`1 cm = 10 mm → \${answer} mm.\`; _x = { prompt_nl: \`Zet \${x} cm om naar mm.\`, prompt_en: \`Convert \${x} cm to mm.\`, prompt_es: \`Convierte \${x} cm a mm.\`, correction_nl: \`1 cm = 10 mm → \${answer} mm.\`, correction_en: \`1 cm = 10 mm → \${answer} mm.\`, correction_es: \`1 cm = 10 mm → \${answer} mm.\` }; }
        else if (kind === 'm-cm') { answer = x * 100; prompt = \`Convertis \${x} m en cm.\`; accept = [\`\${answer}\`, \`\${answer} cm\`]; corr = \`1 m = 100 cm → \${answer} cm.\`; _x = { prompt_nl: \`Zet \${x} m om naar cm.\`, prompt_en: \`Convert \${x} m to cm.\`, prompt_es: \`Convierte \${x} m a cm.\`, correction_nl: \`1 m = 100 cm → \${answer} cm.\`, correction_en: \`1 m = 100 cm → \${answer} cm.\`, correction_es: \`1 m = 100 cm → \${answer} cm.\` }; }
        else if (kind === 'kg-g') { answer = x * 1000; prompt = \`Convertis \${x} kg en g.\`; accept = [\`\${answer}\`, \`\${answer} g\`]; corr = \`1 kg = 1000 g → \${answer} g.\`; _x = { prompt_nl: \`Zet \${x} kg om naar g.\`, prompt_en: \`Convert \${x} kg to g.\`, prompt_es: \`Convierte \${x} kg a g.\`, correction_nl: \`1 kg = 1000 g → \${answer} g.\`, correction_en: \`1 kg = 1000 g → \${answer} g.\`, correction_es: \`1 kg = 1000 g → \${answer} g.\` }; }
        else if (kind === 'euro') { answer = x * 100; prompt = \`Convertis \${x} € en centimes.\`; accept = [\`\${answer}\`, \`\${answer} centimes\`, \`\${answer} c\`]; corr = \`1 € = 100 c → \${answer} centimes.\`; _x = { prompt_nl: \`Zet \${x} € om naar centen.\`, prompt_en: \`Convert \${x} € to cents.\`, prompt_es: \`Convierte \${x} € a céntimos.\`, correction_nl: \`1 € = 100 cent → \${answer} cent.\`, correction_en: \`1 € = 100 cents → \${answer} cents.\`, correction_es: \`1 € = 100 céntimos → \${answer} céntimos.\` }; }
        else { answer = x * 60; prompt = \`Convertis \${x} heure(s) en minutes.\`; accept = [\`\${answer}\`, \`\${answer} min\`]; corr = \`1 h = 60 min → \${answer} min.\`; _x = { prompt_nl: \`Zet \${x} uur om naar minuten.\`, prompt_en: \`Convert \${x} hour(s) to minutes.\`, prompt_es: \`Convierte \${x} hora(s) a minutos.\`, correction_nl: \`1 u = 60 min → \${answer} min.\`, correction_en: \`1 h = 60 min → \${answer} min.\`, correction_es: \`1 h = 60 min → \${answer} min.\` }; }
        qs.push(i % 3 === 1
          ? fb(prompt, String(answer), corr, accept, _x)
          : mc(prompt, numOpts(rng, answer, Math.max(2, Math.round(answer / 5))), answer, corr, _x));`;
if (c.includes(mesOld)) {
  c = c.replace(mesOld, mesNew);
  console.log('Mesures: patched');
} else {
  console.log('Mesures: old pattern NOT FOUND');
}

// 3. Logique: add locale to sequence question
const logOld = "qs.push(mc(`Continue la suite : ${s.join(', ')}, …`, numOpts(rng, answer, step + 2), answer, `On ajoute ${step} à chaque fois : ${answer}.`));";
const logNew = "qs.push(mc(`Continue la suite : ${s.join(', ')}, …`, numOpts(rng, answer, step + 2), answer, `On ajoute ${step} à chaque fois : ${answer}.`, { prompt_nl: `Maak de rij af: ${s.join(', ')}, …`, prompt_en: `Continue the sequence: ${s.join(', ')}, …`, prompt_es: `Continúa la serie: ${s.join(', ')}, …`, correction_nl: `Elke keer +${step}: ${answer}.`, correction_en: `Add ${step} each time: ${answer}.`, correction_es: `Se suma ${step} cada vez: ${answer}.` }));";
if (c.includes(logOld)) {
  c = c.replace(logOld, logNew);
  console.log('Logique: patched');
} else {
  console.log('Logique: old pattern NOT FOUND');
  // show what's there
  const idx = c.indexOf('Continue la suite');
  if (idx >= 0) console.log('Found at:', c.substring(idx-10, idx+120));
}

// 4. Geometrie: add locale extra objects to the bank
// Find the geometrie bank lines and add extra objects
// Pattern: each mc/tf/fb call in buildGeometrie needs an extra object appended

// We do targeted string replacements for each geometrie question
const geoReplacements = [
  ["mc('Combien de côtés a un carré ?', ['4', '3', '5'], '4', 'Le carré a 4 côtés égaux.')",
   "mc('Combien de côtés a un carré ?', ['4', '3', '5'], '4', 'Le carré a 4 côtés égaux.', { prompt_nl: 'Hoeveel zijden heeft een vierkant?', prompt_en: 'How many sides does a square have?', prompt_es: '¿Cuántos lados tiene un cuadrado?', correction_nl: 'Een vierkant heeft 4 gelijke zijden.', correction_en: 'A square has 4 equal sides.', correction_es: 'Un cuadrado tiene 4 lados iguales.' })"],
  ["mc('Combien de côtés a un triangle ?', ['3', '4', '5'], '3', 'Le triangle a 3 côtés.')",
   "mc('Combien de côtés a un triangle ?', ['3', '4', '5'], '3', 'Le triangle a 3 côtés.', { prompt_nl: 'Hoeveel zijden heeft een driehoek?', prompt_en: 'How many sides does a triangle have?', prompt_es: '¿Cuántos lados tiene un triángulo?', correction_nl: 'Een driehoek heeft 3 zijden.', correction_en: 'A triangle has 3 sides.', correction_es: 'Un triángulo tiene 3 lados.' })"],
  ["mc('Un rectangle a combien de côtés ?', ['4', '3', '6'], '4', 'Le rectangle a 4 côtés.')",
   "mc('Un rectangle a combien de côtés ?', ['4', '3', '6'], '4', 'Le rectangle a 4 côtés.', { prompt_nl: 'Hoeveel zijden heeft een rechthoek?', prompt_en: 'How many sides does a rectangle have?', prompt_es: '¿Cuántos lados tiene un rectángulo?', correction_nl: 'Een rechthoek heeft 4 zijden.', correction_en: 'A rectangle has 4 sides.', correction_es: 'Un rectángulo tiene 4 lados.' })"],
  ["tf('Un carré a tous ses côtés égaux.', true, 'Oui, 4 côtés égaux.')",
   "tf('Un carré a tous ses côtés égaux.', true, 'Oui, 4 côtés égaux.', { prompt_nl: 'Een vierkant heeft alle zijden gelijk.', prompt_en: 'A square has all equal sides.', prompt_es: 'Un cuadrado tiene todos los lados iguales.', correction_nl: 'Ja, 4 gelijke zijden.', correction_en: 'Yes, 4 equal sides.', correction_es: 'Sí, 4 lados iguales.' })"],
  ["tf('Un triangle a 4 côtés.', false, 'Le triangle a 3 côtés.')",
   "tf('Un triangle a 4 côtés.', false, 'Le triangle a 3 côtés.', { prompt_nl: 'Een driehoek heeft 4 zijden.', prompt_en: 'A triangle has 4 sides.', prompt_es: 'Un triángulo tiene 4 lados.', correction_nl: 'Een driehoek heeft 3 zijden.', correction_en: 'A triangle has 3 sides.', correction_es: 'Un triángulo tiene 3 lados.' })"],
  ["mc('Combien de coins a un carré ?', ['4', '3', '0'], '4', 'Le carré a 4 coins.')",
   "mc('Combien de coins a un carré ?', ['4', '3', '0'], '4', 'Le carré a 4 coins.', { prompt_nl: 'Hoeveel hoeken heeft een vierkant?', prompt_en: 'How many corners does a square have?', prompt_es: '¿Cuántos vértices tiene un cuadrado?', correction_nl: 'Een vierkant heeft 4 hoeken.', correction_en: 'A square has 4 corners.', correction_es: 'Un cuadrado tiene 4 vértices.' })"],
  ["mc('Quelle forme a 3 coins ?', ['le triangle', 'le carré', 'le cercle'], 'le triangle', 'Le triangle a 3 coins.')",
   "mc('Quelle forme a 3 coins ?', ['le triangle', 'le carré', 'le cercle'], 'le triangle', 'Le triangle a 3 coins.', { prompt_nl: 'Welke vorm heeft 3 hoeken?', prompt_en: 'Which shape has 3 corners?', prompt_es: '¿Qué forma tiene 3 vértices?', correction_nl: 'De driehoek heeft 3 hoeken.', correction_en: 'The triangle has 3 corners.', correction_es: 'El triángulo tiene 3 vértices.' })"],
  ["mc('Le rectangle a :', ['des côtés longs et courts', 'tous les côtés égaux', 'aucun côté'], 'des côtés longs et courts', 'Rectangle : longs et courts.')",
   "mc('Le rectangle a :', ['des côtés longs et courts', 'tous les côtés égaux', 'aucun côté'], 'des côtés longs et courts', 'Rectangle : longs et courts.', { prompt_nl: 'Een rechthoek heeft:', prompt_en: 'A rectangle has:', prompt_es: 'Un rectángulo tiene:', correction_nl: 'Lange en korte zijden.', correction_en: 'Long and short sides.', correction_es: 'Lados largos y cortos.' })"],
];

let geoCount = 0;
for (const [oldStr, newStr] of geoReplacements) {
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    geoCount++;
  } else {
    console.log('GEO: pattern NOT FOUND:', oldStr.substring(0, 50));
  }
}
console.log(`Geometrie: ${geoCount}/${geoReplacements.length} patterns patched`);

// Handle the two geometrie patterns with typographic apostrophes in content
// 'Quelle forme n'a pas de coin ?' — the ' in n'a is U+2019
const n_a = 'Quelle forme n’a pas de coin ?';
if (c.includes(n_a)) {
  c = c.replace(
    `mc('${n_a}', ['le cercle', 'le carré', 'le triangle'], 'le cercle', 'Le cercle est rond, sans coin.')`,
    `mc('${n_a}', ['le cercle', 'le carré', 'le triangle'], 'le cercle', 'Le cercle est rond, sans coin.', { prompt_nl: 'Welke vorm heeft geen hoek?', prompt_en: 'Which shape has no corner?', prompt_es: '¿Qué forma no tiene esquina?', correction_nl: 'De cirkel is rond, zonder hoeken.', correction_en: 'A circle is round, with no corners.', correction_es: 'El círculo es redondo, sin esquinas.' })`
  );
  console.log('Geo n’a: patched');
}
const d_un = 'Une balle a la forme d’un :';
if (c.includes(d_un)) {
  c = c.replace(
    `mc('${d_un}', ['cercle', 'carré', 'triangle'], 'cercle', 'La balle est ronde.')`,
    `mc('${d_un}', ['cercle', 'carré', 'triangle'], 'cercle', 'La balle est ronde.', { prompt_nl: 'Een bal heeft de vorm van een:', prompt_en: 'A ball has the shape of a:', prompt_es: 'Una pelota tiene forma de:', correction_nl: 'Een bal is rond (cirkel).', correction_en: 'A ball is round (circle).', correction_es: 'Una pelota es redonda (círculo).' })`
  );
  console.log('Geo d’un balle: patched');
}
const d_un2 = 'Une fenêtre a souvent la forme d’un :';
if (c.includes(d_un2)) {
  c = c.replace(
    `mc('${d_un2}', ['rectangle', 'cercle', 'triangle'], 'rectangle', 'Souvent un rectangle.')`,
    `mc('${d_un2}', ['rectangle', 'cercle', 'triangle'], 'rectangle', 'Souvent un rectangle.', { prompt_nl: 'Een raam heeft vaak de vorm van een:', prompt_en: 'A window often has the shape of a:', prompt_es: 'Una ventana suele tener forma de:', correction_nl: 'Vaak een rechthoek.', correction_en: 'Usually a rectangle.', correction_es: 'Normalmente un rectángulo.' })`
  );
  console.log('Geo d’un fenêtre: patched');
}
const s_appelle = 'La forme ronde s’appelle le ___ .';
if (c.includes(s_appelle)) {
  c = c.replace(
    `fb('${s_appelle}', 'cercle', 'C’est le cercle.', ['cercle'])`,
    `fb('${s_appelle}', 'cercle', 'C’est le cercle.', ['cercle'], { prompt_nl: 'De ronde vorm heet de ___ .', prompt_en: 'The round shape is called a ___ .', prompt_es: 'La forma redonda se llama ___ .', correction_nl: 'Het is de cirkel.', correction_en: 'It is the circle.', correction_es: 'Es el círculo.' })`
  );
  console.log('Geo s’appelle: patched');
}

fs.writeFileSync(file, c, 'utf8');
console.log('\nAll done!');
