import { createExercise, sample, uniqueOptions } from './generatorUtils.js';

// ─── CULTURE GÉNÉRALE — 120+ questions ────────────────────────────────────
// Catégories : sciences, géographie, animaux, histoire, corps humain, nature, arts

const QUESTIONS = [
  // ── Sciences ──
  { q: 'Quelle planète est la plus proche du Soleil ?', a: 'Mercure', w: ['Vénus', 'Mars', 'Terre'], e: 'Mercure est la première planète du système solaire.' },
  { q: 'Combien de planètes y a-t-il dans le système solaire ?', a: '8', w: ['7', '9', '10'], e: 'Depuis 2006, le système solaire compte 8 planètes (Pluton est un planète naine).' },
  { q: 'Quelle est la planète la plus grande ?', a: 'Jupiter', w: ['Saturne', 'Neptune', 'Uranus'], e: 'Jupiter est la plus grande planète du système solaire.' },
  { q: 'Qu\'est-ce que la photosynthèse ?', a: 'Les plantes fabriquent de la nourriture avec la lumière', w: ['Les animaux respirent', 'L\'eau monte dans les nuages', 'Les feuilles tombent'], e: 'La photosynthèse permet aux plantes de fabriquer leur nourriture grâce à la lumière du soleil.' },
  { q: 'De quoi les plantes ont-elles besoin pour pousser ?', a: 'Eau, lumière et sol', w: ['Seulement de l\'eau', 'Seulement de la lumière', 'Seulement du vent'], e: 'Les plantes ont besoin d\'eau, de lumière solaire et de nutriments du sol.' },
  { q: 'Qu\'est-ce qu\'un volcan ?', a: 'Une montagne qui crache de la lave', w: ['Un type de nuage', 'Un animal marin', 'Une rivière souterraine'], e: 'Un volcan est une ouverture dans la croûte terrestre d\'où sort de la lave en fusion.' },
  { q: 'Quelle est la force qui attire les objets vers le sol ?', a: 'La gravité', w: ['Le magnétisme', 'L\'électricité', 'La friction'], e: 'La gravité (ou pesanteur) est la force qui attire les objets vers le centre de la Terre.' },
  { q: 'À quelle température l\'eau bout-elle ?', a: '100 °C', w: ['50 °C', '80 °C', '120 °C'], e: 'L\'eau bout à 100 degrés Celsius à pression normale.' },
  { q: 'À quelle température l\'eau gèle-t-elle ?', a: '0 °C', w: ['-10 °C', '10 °C', '5 °C'], e: 'L\'eau se transforme en glace à 0 °C.' },
  { q: 'Qu\'est-ce qu\'une éclipse solaire ?', a: 'La Lune cache le Soleil', w: ['Le Soleil cache la Lune', 'La Terre cache le Soleil', 'Une comète passe'], e: 'Lors d\'une éclipse solaire, la Lune se place entre la Terre et le Soleil.' },
  { q: 'De quelle couleur est le Soleil vu depuis l\'espace ?', a: 'Blanc', w: ['Jaune', 'Orange', 'Rouge'], e: 'Le Soleil est blanc depuis l\'espace. Il nous semble jaune à cause de l\'atmosphère.' },
  { q: 'Qu\'est-ce qu\'un fossile ?', a: 'Les restes d\'un être vivant d\'autrefois', w: ['Un type de roche', 'Un cristal brillant', 'Une plante rare'], e: 'Un fossile est l\'empreinte ou les restes d\'un organisme qui a vécu il y a très longtemps.' },

  // ── Géographie ──
  { q: 'Quelle est la capitale de la France ?', a: 'Paris', w: ['Lyon', 'Marseille', 'Bordeaux'], e: 'Paris est la capitale et la plus grande ville de France.' },
  { q: 'Quel est le plus long fleuve du monde ?', a: 'Le Nil', w: ['L\'Amazone', 'Le Mississippi', 'Le Danube'], e: 'Le Nil, en Afrique, est généralement considéré comme le plus long fleuve.' },
  { q: 'Quel est le plus grand océan du monde ?', a: 'L\'océan Pacifique', w: ['L\'océan Atlantique', 'L\'océan Indien', 'L\'océan Arctique'], e: 'Le Pacifique couvre plus d\'un tiers de la surface de la Terre.' },
  { q: 'Sur quel continent se trouve l\'Égypte ?', a: 'Afrique', w: ['Asie', 'Europe', 'Amérique'], e: 'L\'Égypte est un pays situé au nord-est de l\'Afrique.' },
  { q: 'Combien y a-t-il de continents sur Terre ?', a: '7', w: ['5', '6', '8'], e: 'Les 7 continents : Afrique, Asie, Europe, Amérique du Nord, Amérique du Sud, Océanie, Antarctique.' },
  { q: 'Quel est le plus haut sommet du monde ?', a: 'L\'Everest', w: ['Le Mont-Blanc', 'Le Kilimandjaro', 'Le McKinley'], e: 'L\'Everest (8 849 m) en Asie est le sommet le plus élevé du monde.' },
  { q: 'Quelle est la capitale de la Belgique ?', a: 'Bruxelles', w: ['Bruges', 'Liège', 'Anvers'], e: 'Bruxelles est la capitale et la plus grande ville de Belgique.' },
  { q: 'Quel pays est le plus grand du monde ?', a: 'La Russie', w: ['Le Canada', 'La Chine', 'Les États-Unis'], e: 'La Russie s\'étend sur 17 millions de km², soit le pays le plus vaste.' },
  { q: 'Dans quel pays se trouve la Tour Eiffel ?', a: 'France', w: ['Espagne', 'Italie', 'Belgique'], e: 'La Tour Eiffel se trouve à Paris, en France.' },
  { q: 'Quel pays est appelé « le Pays du Soleil Levant » ?', a: 'Le Japon', w: ['La Chine', 'La Corée', 'La Thaïlande'], e: 'Le Japon est surnommé "le Pays du Soleil Levant" car il est à l\'est.' },
  { q: 'Quelle mer sépare l\'Europe de l\'Afrique ?', a: 'La mer Méditerranée', w: ['La mer du Nord', 'La mer Rouge', 'La mer Noire'], e: 'La Méditerranée sépare l\'Europe et l\'Afrique.' },

  // ── Animaux ──
  { q: 'Quel est le plus grand animal terrestre ?', a: 'L\'éléphant', w: ['Le rhinocéros', 'L\'hippopotame', 'La girafe'], e: 'L\'éléphant d\'Afrique est le plus grand animal terrestre.' },
  { q: 'Quel est l\'animal le plus rapide du monde ?', a: 'Le guépard', w: ['Le lion', 'L\'aigle', 'Le dauphin'], e: 'Le guépard peut courir jusqu\'à 110 km/h, c\'est le plus rapide.' },
  { q: 'Quel est le plus grand animal marin ?', a: 'La baleine bleue', w: ['Le requin blanc', 'Le dauphin', 'Le cachalot'], e: 'La baleine bleue est le plus grand animal de la planète.' },
  { q: 'Comment appelle-t-on le petit de la vache ?', a: 'Veau', w: ['Agneau', 'Poulain', 'Chaton'], e: 'Le petit de la vache est un veau.' },
  { q: 'Quel animal est connu pour son cou très long ?', a: 'La girafe', w: ['L\'éléphant', 'L\'autruche', 'Le chameau'], e: 'La girafe est le plus grand animal à pattes, avec son cou immense.' },
  { q: 'Combien de pattes a une araignée ?', a: '8', w: ['6', '4', '10'], e: 'Les araignées sont des arachnides et ont 8 pattes.' },
  { q: 'Quel animal peut vivre le plus longtemps ?', a: 'La tortue des Galápagos', w: ['L\'éléphant', 'Le perroquet', 'Le requin'], e: 'Certaines tortues des Galápagos vivent plus de 150 ans.' },
  { q: 'Comment appelle-t-on le son du lion ?', a: 'Rugissement', w: ['Aboiement', 'Bêlement', 'Miaulement'], e: 'Le lion rugit.' },
  { q: 'Quel animal fabrique du miel ?', a: 'L\'abeille', w: ['Le bourdon', 'La guêpe', 'La fourmi'], e: 'Les abeilles fabriquent du miel à partir du nectar des fleurs.' },
  { q: 'Quel oiseau ne peut pas voler ?', a: 'L\'autruche', w: ['L\'aigle', 'La mouette', 'Le pélican'], e: 'L\'autruche est trop lourde pour voler, mais elle court très vite.' },
  { q: 'Qu\'est-ce qu\'un mammifère ?', a: 'Un animal qui allaite ses petits', w: ['Un animal à plumes', 'Un animal qui pond des œufs', 'Un animal à sang froid'], e: 'Les mammifères allaitent leurs petits avec du lait maternel.' },
  { q: 'Quel animal change de couleur selon son environnement ?', a: 'Le caméléon', w: ['Le zèbre', 'Le léopard', 'L\'ours'], e: 'Le caméléon change de couleur pour se camoufler et communiquer.' },

  // ── Corps humain ──
  { q: 'Combien d\'os y a-t-il dans le corps humain adulte ?', a: '206', w: ['150', '300', '255'], e: 'Un adulte possède 206 os.' },
  { q: 'Quel organe pompe le sang dans notre corps ?', a: 'Le cœur', w: ['Le foie', 'Les poumons', 'Le cerveau'], e: 'Le cœur est le moteur qui fait circuler le sang dans tout le corps.' },
  { q: 'Quel est le rôle des poumons ?', a: 'Respirer et oxygéner le sang', w: ['Pomper le sang', 'Digérer les aliments', 'Produire de l\'énergie'], e: 'Les poumons permettent d\'inspirer l\'oxygène et d\'expirer le CO₂.' },
  { q: 'Combien de dents de lait a un enfant ?', a: '20', w: ['24', '16', '28'], e: 'Les enfants ont 20 dents de lait avant leurs dents définitives.' },
  { q: 'Quel sens est associé au nez ?', a: 'L\'odorat', w: ['La vue', 'L\'ouïe', 'Le goût'], e: 'Le nez nous permet de sentir les odeurs (odorat).' },
  { q: 'Quelle est la partie du corps qui contrôle tout ?', a: 'Le cerveau', w: ['Le cœur', 'Les poumons', 'L\'estomac'], e: 'Le cerveau est le centre de contrôle du corps humain.' },
  { q: 'Combien de doigts a une main humaine ?', a: '5', w: ['4', '6', '3'], e: 'Chaque main a 5 doigts.' },

  // ── Histoire ──
  { q: 'Qui était Napoléon Bonaparte ?', a: 'Un empereur français', w: ['Un roi anglais', 'Un explorateur espagnol', 'Un scientifique'], e: 'Napoléon Bonaparte fut Empereur des Français de 1804 à 1814 et 1815.' },
  { q: 'Qui a inventé la lampe électrique ?', a: 'Thomas Edison', w: ['Albert Einstein', 'Marie Curie', 'Nikola Tesla'], e: 'Thomas Edison a inventé et commercialisé la lampe à incandescence en 1879.' },
  { q: 'En quelle année a eu lieu la Révolution Française ?', a: '1789', w: ['1776', '1800', '1815'], e: 'La Révolution Française a commencé en 1789 avec la prise de la Bastille.' },
  { q: 'Qui a peint la Joconde ?', a: 'Léonard de Vinci', w: ['Michel-Ange', 'Picasso', 'Rembrandt'], e: 'La Joconde (Mona Lisa) a été peinte par Léonard de Vinci vers 1503-1506.' },
  { q: 'Que représente la Tour Eiffel construite en ?', a: '1889', w: ['1900', '1870', '1920'], e: 'La Tour Eiffel a été construite pour l\'Exposition universelle de Paris en 1889.' },
  { q: 'Quel était le nom du premier homme sur la Lune ?', a: 'Neil Armstrong', w: ['Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], e: 'Neil Armstrong a marché sur la Lune le 21 juillet 1969.' },

  // ── Nature et environnement ──
  { q: 'Combien de saisons y a-t-il dans une année ?', a: '4', w: ['3', '2', '6'], e: 'Les 4 saisons sont : printemps, été, automne, hiver.' },
  { q: 'De quoi est composé l\'air que nous respirons principalement ?', a: 'Azote et oxygène', w: ['Seulement d\'oxygène', 'CO₂ et vapeur', 'Hélium et argon'], e: 'L\'air contient environ 78% d\'azote et 21% d\'oxygène.' },
  { q: 'Qu\'est-ce que la pollinisation ?', a: 'Le transport du pollen entre les fleurs', w: ['La croissance des racines', 'La chute des feuilles', 'La montée de la sève'], e: 'La pollinisation permet la reproduction des plantes grâce aux insectes, au vent ou à l\'eau.' },
  { q: 'Quelle planète est surnommée « la planète rouge » ?', a: 'Mars', w: ['Jupiter', 'Venus', 'Saturne'], e: 'Mars est appelée la planète rouge à cause de la couleur de son sol riche en fer.' },
  { q: 'Combien de temps met la Terre pour tourner autour du Soleil ?', a: '365 jours (1 an)', w: ['24 heures', '30 jours', '100 jours'], e: 'La Terre fait le tour du Soleil en environ 365 jours, soit 1 année.' },
  { q: 'Que sont les aurores boréales ?', a: 'Des lumières colorées dans le ciel polaire', w: ['Des éclairs dans les nuages', 'Des comètes qui tombent', 'Des feux de forêt'], e: 'Les aurores boréales sont causées par des particules solaires interagissant avec l\'atmosphère.' },

  // ── Arts et culture ──
  { q: 'Quel instrument a 88 touches ?', a: 'Le piano', w: ['La harpe', 'Le xylophone', 'L\'accordéon'], e: 'Le piano standard possède 88 touches (52 blanches et 36 noires).' },
  { q: 'Combien de cordes a un violon ?', a: '4', w: ['6', '3', '5'], e: 'Le violon a 4 cordes : sol, ré, la, mi.' },
  { q: 'Dans quel pays est né Mozart ?', a: 'Autriche', w: ['Allemagne', 'France', 'Italie'], e: 'Wolfgang Amadeus Mozart est né à Salzbourg, en Autriche, en 1756.' },
  { q: 'Quel est le roman de Victor Hugo avec le bossu de Notre-Dame ?', a: 'Notre-Dame de Paris', w: ['Les Misérables', 'Le Comte de Monte-Cristo', 'Germinal'], e: '"Notre-Dame de Paris" (1831) de Victor Hugo présente Quasimodo.' },
];

export function generateGeneralKnowledgeExercise({ category } = {}) {
  const pool = category ? QUESTIONS.filter((q) => q.cat === category) : QUESTIONS;
  const item = sample(pool.length > 0 ? pool : QUESTIONS);
  return createExercise({
    question: item.q,
    options: uniqueOptions(item.a, item.w),
    correct: item.a,
    type: 'general_knowledge',
    level: 'culture',
    explanation: item.e
  });
}
