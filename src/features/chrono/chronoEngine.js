// Generate a random hour (0-23)
export function randomHour(max = 23) {
  return Math.floor(Math.random() * (max + 1));
}

// Generate a random minute, optionally rounded
export function randomMinute(type = 'any') {
  if (type === 'full') return 0;
  if (type === 'half') return 30;
  if (type === 'quarter') return [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  if (type === 'five') return Math.floor(Math.random() * 12) * 5;
  return Math.floor(Math.random() * 60);
}

// Format time as digital string: "08:00"
export function formatDigital(h, m) {
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

// Format time as French spoken string: "8 heures", "8 heures 30", "midi"
export function formatFrench(h, m) {
  const hour = h === 12 ? 'midi' : h === 0 ? 'minuit' : h + ' heure' + (h > 1 ? 's' : '');
  if (m === 0) return hour;
  if (m === 30) return hour + ' et demie';
  if (m === 15) return hour + ' et quart';
  if (m === 45) return hour + ' moins le quart';
  return hour + ' ' + String(m).padStart(2, '0');
}

// Get moment of day
export function getMomentOfDay(h) {
  if (h >= 6 && h < 12) return { label: 'matin', emoji: '🌅' };
  if (h === 12) return { label: 'midi', emoji: '☀️' };
  if (h > 12 && h < 18) return { label: 'apres-midi', emoji: '🌤️' };
  if (h >= 18 && h < 21) return { label: 'soir', emoji: '🌆' };
  return { label: 'nuit', emoji: '🌙' };
}

// Generate clock exercise
export function genClockExercise(level = 1) {
  let h, m;
  if (level <= 2) { h = 1 + Math.floor(Math.random() * 12); m = 0; }
  else if (level <= 4) { h = 1 + Math.floor(Math.random() * 12); m = randomMinute('half'); }
  else if (level <= 6) { h = Math.floor(Math.random() * 24); m = randomMinute('quarter'); }
  else { h = Math.floor(Math.random() * 24); m = randomMinute('five'); }
  return { h, m, digital: formatDigital(h, m), french: formatFrench(h, m) };
}

// Multiple choice options (wrong ones)
export function genChoices(correct, count = 4) {
  const choices = new Set([correct]);
  while (choices.size < count) {
    const h = 1 + Math.floor(Math.random() * 12);
    const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const d = formatDigital(h, m);
    if (d !== correct) choices.add(d);
  }
  return [...choices].sort(() => Math.random() - .5);
}

// Duration problems
export function genDurationProblem() {
  const startH = 6 + Math.floor(Math.random() * 10);
  const startM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  const durationMins = [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)];
  const totalMins = startH * 60 + startM + durationMins;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;
  return {
    startH, startM, endH, endM, durationMins,
    startDigital: formatDigital(startH, startM),
    endDigital: formatDigital(endH, endM),
    durationLabel: durationMins >= 60 ? (durationMins / 60) + 'h' : durationMins + ' minutes',
  };
}

// Daily scenarios for Mode 8 (La Journee de Lena)
export const DAILY_EVENTS = [
  { label: 'Reveil', emoji: '⏰', defaultH: 7, defaultM: 0 },
  { label: 'Petit-dejeuner', emoji: '🥐', defaultH: 7, defaultM: 30 },
  { label: 'Ecole commence', emoji: '🏫', defaultH: 8, defaultM: 30 },
  { label: 'Recreation', emoji: '⚽', defaultH: 10, defaultM: 15 },
  { label: 'Repas de midi', emoji: '🍽️', defaultH: 12, defaultM: 0 },
  { label: 'Repas fini', emoji: '✅', defaultH: 13, defaultM: 0 },
  { label: 'Retour a la maison', emoji: '🏠', defaultH: 15, defaultM: 30 },
  { label: 'Devoirs', emoji: '📚', defaultH: 16, defaultM: 0 },
  { label: 'Jeux', emoji: '🎮', defaultH: 17, defaultM: 0 },
  { label: 'Souper', emoji: '🍴', defaultH: 18, defaultM: 30 },
  { label: 'Bain', emoji: '🛁', defaultH: 19, defaultM: 30 },
  { label: 'Coucher', emoji: '😴', defaultH: 20, defaultM: 30 },
];

// Detective time problem templates
export const DETECTIVE_TEMPLATES = [
  { text: 'Tom mange a midi.', answer: '12:00', choices: ['08:00', '12:00', '21:00', '15:00'], emoji: '🍽️' },
  { text: 'Lena se reveille le matin a 7 heures.', answer: '07:00', choices: ['07:00', '19:00', '12:00', '03:00'], emoji: '⏰' },
  { text: 'L\'ecole commence a 8 heures et demie.', answer: '08:30', choices: ['08:00', '08:30', '08:15', '09:00'], emoji: '🏫' },
  { text: 'Le soleil se couche le soir.', answer: '20:00', choices: ['12:00', '15:00', '20:00', '08:00'], emoji: '🌆' },
  { text: 'Papa va au travail le matin.', answer: '08:00', choices: ['20:00', '08:00', '14:00', '06:00'], emoji: '💼' },
  { text: 'Les enfants jouent apres l\'ecole.', answer: '16:00', choices: ['08:00', '12:00', '16:00', '22:00'], emoji: '⚽' },
  { text: 'Tout le monde dort la nuit.', answer: '22:00', choices: ['12:00', '18:00', '22:00', '06:00'], emoji: '🌙' },
  { text: 'La recreation est a 10 heures.', answer: '10:00', choices: ['10:00', '02:00', '22:00', '15:00'], emoji: '⚽' },
  { text: 'Le souper est a 18 heures 30.', answer: '18:30', choices: ['06:30', '12:30', '18:30', '20:00'], emoji: '🍴' },
  { text: 'Maman lit une histoire avant le dodo.', answer: '20:00', choices: ['08:00', '14:00', '20:00', '12:00'], emoji: '📚' },
  { text: 'Le marche du matin ouvre a 7 heures.', answer: '07:00', choices: ['07:00', '17:00', '12:00', '19:00'], emoji: '🛒' },
  { text: 'Le film du soir commence a 20 heures.', answer: '20:00', choices: ['08:00', '12:00', '16:00', '20:00'], emoji: '🎬' },
];

// Badges
export const CHRONO_BADGES = [
  { id: 'petit-horloger', label: 'Petit Horloger', emoji: '⏰', threshold: 5 },
  { id: 'gardien-temps', label: 'Gardien du Temps', emoji: '⌚', threshold: 20 },
  { id: 'chrono-expert', label: 'Chrono Expert', emoji: '🕰️', threshold: 50 },
  { id: 'maitre-horloger', label: 'Maitre Horloger', emoji: '🏆', threshold: 100 },
  { id: 'roi-temps', label: 'Roi du Temps', emoji: '👑', threshold: 200 },
];

// ADHD-friendly encouragements
export const ENCOURAGEMENTS = [
  'Essaie encore ! Tu y es presque !',
  'Regarde bien les aiguilles !',
  'Tu progresses super bien ! ✨',
  'Presque ! Recommence !',
  'Super effort ! Continue ! 🌟',
  'Tu es un vrai horloger ! ⏰',
];
