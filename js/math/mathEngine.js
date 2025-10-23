;(function initMathEngine(windowObject) {
    'use strict';

    const win = windowObject || (typeof window !== 'undefined' ? window : null);
    if (!win) { return; }

    const LEVEL_COUNT = 13;
    const DEFAULT_THEME = {
        id: 'math',
        icon: '🧠',
        label: 'Défi mathématique',
        accent: '#6c5ce7',
        accentSoft: '#ecebff',
        storyline: 'Résous l\'énigme numérique pour gagner des étoiles.',
        instruction: 'Lis bien la consigne puis sélectionne la bonne réponse.',
        stickers: ['✨', '🌟', '🏅'],
        optionIcons: ['✨', '⭐', '🌙', '🌈']
    };

    const usedCombinationSet = {
        additions: new Map(),
        soustractions: new Map(),
        multiplications: new Map(),
    divisions: new Map(),
    mix: new Map()
  };

  const HARD_MULTIPLICATIONS = new Set(['7x8', '8x7', '9x7', '7x9', '12x12', '12x11', '11x12', '6x8', '8x6']);

  function getConfigsForOperation(operation) {
    switch (operation) {
      case 'additions':
        return ADDITION_LEVELS.slice();
      case 'soustractions':
        return SUBTRACTION_LEVELS.slice();
      case 'multiplications':
        return MULTIPLICATION_LEVELS.slice();
      case 'divisions':
        return DIVISION_LEVELS.slice();
      default:
                return buildAdditionQuestion(resolveOperationConfig('additions', level), level);
    }
  }

  function resolveOperationConfig(operation, level) {
    const configs = getConfigsForOperation(operation);
    if (!configs.length) { return {}; }
    const index = Math.max(0, Math.min(level - 1, configs.length - 1));
    let config = configs[index];
    if (!config || config.mode === 'mix') {
      for (let i = index - 1; i >= 0; i--) {
        if (configs[i] && configs[i].mode !== 'mix') {
          config = configs[i];
          break;
        }
      }
    }
    if (!config || config.mode === 'mix') {
      config = configs.find(entry => entry && entry.mode !== 'mix') || configs[0];
    }
    return config || {};
  }

    const ADDITION_LEVELS = [
        { level: 1, minA: 1, maxA: 5, minB: 1, maxB: 5, carryProfile: 'none', maxDigits: 1, formats: ['horizontal'], storyline: 'Sommes magiques sans retenue.', prompt: 'Addition simple sans retenue.', strategy: 'Additionne les unités en comptant sur tes doigts.', visual: 'Imagine des cubes et rassemble-les.' },
        { level: 2, minA: 2, maxA: 9, minB: 1, maxB: 9, carryProfile: 'none', maxDigits: 1, formats: ['horizontal', 'missing-result'], storyline: 'Sommes jusqu\'à 18.', prompt: 'Addition sans retenue.', strategy: 'Commence par le plus grand nombre puis ajoute le second.', visual: 'Trace une suite de points pour chaque unité.' },
        { level: 3, minA: 6, maxA: 19, minB: 4, maxB: 15, carryProfile: 'single', maxDigits: 2, formats: ['horizontal', 'vertical'], storyline: 'Premières additions avec retenue.', prompt: 'Addition avec une retenue.', strategy: 'Additionne les unités, note la retenue, puis passe aux dizaines.', visual: 'Représente les dizaines avec des barres et les unités avec des cubes.' },
        { level: 4, minA: 8, maxA: 25, minB: 8, maxB: 20, carryProfile: 'single', maxDigits: 2, formats: ['vertical', 'missing-addend'], storyline: 'Complète les additions avec retenue.', prompt: 'Addition avec retenue - trouve le nombre manquant.', strategy: 'Pose l\'addition verticalement pour ne rien oublier.', visual: 'Dessine des colonnes pour aligner unités et dizaines.' },
        { level: 5, minA: 12, maxA: 48, minB: 14, maxB: 36, carryProfile: 'single', maxDigits: 2, formats: ['vertical', 'horizontal', 'missing-result'], storyline: 'Sommes jusqu\'à 80.', prompt: 'Addition avec retenue - nombres plus grands.', strategy: 'Transforme en dizaines complètes (18 = 10 + 8).', visual: 'Fais deux paquets de dizaines puis regroupe-les.' },
        { level: 6, minA: 23, maxA: 58, minB: 27, maxB: 54, carryProfile: 'double', maxDigits: 2, formats: ['vertical'], storyline: 'Double retenue : prépare-toi !', prompt: 'Addition avec double retenue.', strategy: 'Garde chaque retenue: une pour les unités, une pour les dizaines.', visual: 'Montre comment les dizaines deviennent des centaines avec des blocs.' },
        { level: 7, minA: 37, maxA: 69, minB: 42, maxB: 68, carryProfile: 'double', maxDigits: 2, formats: ['vertical', 'missing-addend'], storyline: 'Sommes jusqu\'à 3 chiffres.', prompt: 'Addition avec double retenue et nombre manquant.', strategy: 'Pose l\'addition verticalement et reporte chaque retenue.', visual: 'Utilise une grille pour aligner unités, dizaines et centaines.' },
        { level: 8, minA: 105, maxA: 285, minB: 72, maxB: 264, carryProfile: 'single-or-double', maxDigits: 3, formats: ['vertical'], storyline: 'Additionne des nombres à 3 chiffres.', prompt: 'Addition de nombres à 3 chiffres.', strategy: 'Additionne colonne par colonne en notant chaque retenue.', visual: 'Imagine des tours de 100, 10 et 1.' },
        { level: 9, minA: 180, maxA: 420, minB: 135, maxB: 380, carryProfile: 'double', maxDigits: 3, formats: ['vertical', 'missing-result'], storyline: 'Calcule les totaux de grandes collections.', prompt: 'Grandes additions avec retenues.', strategy: 'Passe des unités aux centaines sans te presser.', visual: 'Dessine un abaque 3 colonnes (unités/dizaines/centaines).' },
        { level: 10, minA: 320, maxA: 680, minB: 210, maxB: 690, carryProfile: 'double', maxDigits: 3, formats: ['vertical', 'horizontal'], storyline: 'Additionne pour construire un château numérique.', prompt: 'Addition mixte avec retenues.', strategy: 'Vérifie chaque colonne après l\'addition.', visual: 'Colorie les colonnes qui dépassent 9 pour retenir 1.' },
        { level: 11, minA: 420, maxA: 850, minB: 320, maxB: 760, carryProfile: 'double', maxDigits: 3, formats: ['vertical', 'missing-addend'], storyline: 'Trouve le nombre mystère.', prompt: 'Complète l\'addition avec retenues.', strategy: 'Transforme l\'addition en soustraction pour trouver le nombre manquant.', visual: 'Utilise un tableau de centaines pour comparer les nombres.' },
        { level: 12, minA: 540, maxA: 980, minB: 430, maxB: 910, carryProfile: 'double-or-triple', maxDigits: 3, formats: ['vertical'], storyline: 'Additionne pour achever la potion finale.', prompt: 'Addition experte avec plusieurs retenues.', strategy: 'Utilise les retenues successives sans les oublier.', visual: 'Imagine une balance : ajoute des dizaines jusqu\'au poids correct.' },
        { level: 13, mode: 'mix', storyline: 'Défi ultime : ajoute, soustrais, multiplie ou divise !', prompt: 'Choisis la bonne opération.', strategy: 'Observe les nombres pour choisir l\'opération logique.', visual: 'Rappelle-toi des liens entre +, -, x et /.' }
    ];

    const SUBTRACTION_LEVELS = [
        { level: 1, minuend: [3, 9], subtrahend: [1, 8], allowNegative: false, borrowProfile: 'none', formats: ['horizontal'], storyline: 'Retire sans devenir négatif.', prompt: 'Soustraction simple sans nombres négatifs.', strategy: 'Compte à rebours depuis le nombre le plus grand.', visual: 'Aligne des jetons et retire-en quelques-uns.' },
        { level: 2, minuend: [6, 18], subtrahend: [1, 12], allowNegative: false, borrowProfile: 'none', formats: ['horizontal', 'missing-subtrahend'], storyline: 'Soustractions jusqu\'à 20.', prompt: 'Soustraction sans nombres négatifs.', strategy: 'Pose la soustraction si besoin pour ne rien oublier.', visual: 'Trace une ligne numérique et recule.' },
        { level: 3, minuend: [12, 35], subtrahend: [4, 25], allowNegative: false, borrowProfile: 'single', formats: ['horizontal', 'vertical'], storyline: 'Premières soustractions avec retenue.', prompt: 'Soustraction avec une retenue.', strategy: 'Si tu ne peux pas soustraire les unités, emprunte une dizaine.', visual: 'Barre une dizaine et ajoute 10 unités.' },
        { level: 4, minuend: [18, 42], subtrahend: [7, 31], allowNegative: false, borrowProfile: 'single', formats: ['vertical', 'missing-minuend'], storyline: 'Cherche le nombre qui manque.', prompt: 'Soustraction avec retenue - trouve le nombre manquant.', strategy: 'Utilise l\'addition inverse pour vérifier.', visual: 'Dessine 4 dizaines, barre-en une pour emprunter.' },
        { level: 5, minuend: [24, 65], subtrahend: [12, 54], allowNegative: false, borrowProfile: 'single-or-double', formats: ['vertical'], storyline: 'Retire des dizaines et des unités.', prompt: 'Soustraction de nombres à 2 chiffres.', strategy: 'Fais la différence colonne par colonne.', visual: 'Utilise un tableau de retenues (dizaines/unités).' },
        { level: 6, minuend: [35, 92], subtrahend: [18, 74], allowNegative: false, borrowProfile: 'double', formats: ['vertical', 'horizontal'], storyline: 'Double emprunt : attention !', prompt: 'Soustraction avec double emprunt.', strategy: 'Garde la trace de la dizaine empruntée.', visual: 'Colorie les dizaines empruntées sur la droite numérique.' },
        { level: 7, minuend: [45, 120], subtrahend: [23, 96], allowNegative: false, borrowProfile: 'double', formats: ['vertical', 'missing-subtrahend'], storyline: 'Trouve la différence cachée.', prompt: 'Soustraction avancée sans résultat négatif.', strategy: 'Transforme le calcul en addition inverse pour contrôler.', visual: 'Représente les nombres avec des blocs de 100, 10, 1.' },
        { level: 8, minuend: [12, 18], subtrahend: [25, 32], allowNegative: true, borrowProfile: 'negative', formats: ['horizontal', 'number-line'], storyline: 'Découvre les résultats négatifs.', prompt: 'Soustraction avec résultats négatifs.', strategy: 'Si le résultat est négatif, compte combien tu dois encore retirer.', visual: 'Utilise une ligne numérique qui va sous zéro.' },
        { level: 9, minuend: [40, 140], subtrahend: [50, 190], allowNegative: true, borrowProfile: 'negative', formats: ['vertical', 'number-line'], storyline: 'Traverse zéro.', prompt: 'Soustraction avec passages négatifs.', strategy: 'Ajoute un signe - devant le résultat si tu passes sous zéro.', visual: 'Surligne la partie de la ligne numérique sous zéro.' },
        { level: 10, minuend: [210, 520], subtrahend: [120, 470], allowNegative: false, borrowProfile: 'double', formats: ['vertical'], storyline: 'Résolution de différences en centaines.', prompt: 'Soustraction de nombres à 3 chiffres.', strategy: 'Aligne les centaines, dizaines, unités et emprunte si besoin.', visual: 'Dessine un abaque pour montrer les emprunts.' },
        { level: 11, minuend: [310, 820], subtrahend: [280, 780], allowNegative: false, borrowProfile: 'double', formats: ['vertical', 'missing-minuend'], storyline: 'Résous le mystère des retenues.', prompt: 'Soustraction experte.', strategy: 'Vérifie ton résultat en refaisant l\'opération inverse.', visual: 'Indique les retenues au-dessus des chiffres empruntés.' },
        { level: 12, minuend: [420, 920], subtrahend: [510, 990], allowNegative: true, borrowProfile: 'negative', formats: ['vertical', 'number-line'], storyline: 'Grandes différences, parfois négatives.', prompt: 'Soustraction avancée (peut être négative).', strategy: 'Pense en termes d\'écart lorsque le résultat est négatif.', visual: 'Place les nombres sur une ligne graduée.' },
        { level: 13, mode: 'mix', storyline: 'Défi mixte : choisis la bonne opération.', prompt: 'Utilise les relations entre +, -, x et /.' }
    ];

    const MULTIPLICATION_LEVELS = [
        { level: 1, tables: [1, 2], factors: [1, 10], exclude: [], formats: ['horizontal'], storyline: 'Tables de 1 et 2.', prompt: 'Tables de 1 et 2.', strategy: 'Multiplier par 1 garde le nombre.', visual: 'Forme de petits groupes identiques.' },
        { level: 2, tables: [3], factors: [1, 10], exclude: [], formats: ['horizontal', 'array'], storyline: 'Table de 3.', prompt: 'Table de 3.', strategy: 'Additionne trois fois le même nombre.', visual: 'Groupes de 3 points.' },
        { level: 3, tables: [4], factors: [1, 10], exclude: [], formats: ['horizontal', 'array'], storyline: 'Table de 4.', prompt: 'Table de 4.', strategy: 'Double puis double encore.', visual: 'Carré de 4 colonnes.' },
        { level: 4, tables: [5, 6], factors: [1, 10], exclude: ['6x8', '8x6'], formats: ['horizontal', 'array'], storyline: 'Tables de 5 et 6.', prompt: 'Tables de 5 et 6.', strategy: 'Pour ×5 pense aux moitiés de ×10.', visual: 'Groupes alignés en lignes et colonnes.' },
        { level: 5, tables: [7, 8], factors: [1, 10], exclude: Array.from(HARD_MULTIPLICATIONS), formats: ['horizontal', 'array', 'missing-factor'], storyline: 'Tables de 7 et 8 sans combinaisons difficiles.', prompt: 'Tables de 7 et 8 (progressives).', strategy: 'Décompose : 7×8 = 7×4 + 7×4.', visual: 'Rectangles de 7 lignes.' },
        { level: 6, tables: [7, 8], factors: [1, 12], exclude: [], formats: ['horizontal', 'array'], storyline: 'Tables de 7 et 8 complètes.', prompt: 'Tables de 7 et 8 complètes.', strategy: 'Utilise les doubles ou moitiés pour te repérer.', visual: 'Rectangle 7 par 8.' },
        { level: 7, tables: [9], factors: [1, 12], exclude: [], formats: ['horizontal', 'array'], storyline: 'Table de 9.', prompt: 'Table de 9.', strategy: 'Additionne 10 fois puis retire une fois.', visual: 'Lignes de 9 éléments.' },
        { level: 8, tables: [10, 11], factors: [1, 12], exclude: [], formats: ['horizontal'], storyline: 'Tables de 10 et 11.', prompt: 'Tables de 10 et 11.', strategy: 'Pour ×10 ajoute un zéro.', visual: 'Groupes de 10.' },
        { level: 9, tables: [12, 6], factors: [1, 12], exclude: [], formats: ['horizontal', 'missing-factor'], storyline: 'Table de 12 et rappels.', prompt: 'Table de 12.', strategy: '12× = 10× + 2×.', visual: 'Rectangles de 12 colonnes.' },
        { level: 10, tables: [3, 4, 6, 8], factors: [2, 12], exclude: [], formats: ['horizontal', 'array'], storyline: 'Mélange tables 3 à 8.', prompt: 'Combinaisons mélangées.', strategy: 'Utilise la commutativité (3×8 = 8×3).', visual: 'Matrice de points.' },
        { level: 11, tables: [7, 8, 9, 12], factors: [3, 12], exclude: [], formats: ['horizontal', 'missing-factor'], storyline: 'Défis de maîtrise.', prompt: 'Défi multiplication.', strategy: 'Décompose en paquets faciles.', visual: 'Groupes de base 5 + reste.' },
        { level: 12, tables: [1, 12], factors: [2, 12], exclude: [], formats: ['horizontal', 'array', 'story'], storyline: 'Multiplications dans des problèmes.', prompt: 'Problèmes multiplicatifs.', strategy: 'Associe la multiplication à une addition répétée.', visual: 'Dessine le groupe pour le compter.' },
        { level: 13, mode: 'mix', storyline: 'Défi mixte : toutes les tables !', prompt: 'Retrouve rapidement l\'opération correcte.' }
    ];

    const DIVISION_LEVELS = [
        { level: 1, divisors: [1, 2], range: [2, 20], allowRemainder: false, formats: ['horizontal', 'sharing'], storyline: 'Partage facile.', prompt: 'Divisions exactes par 1 ou 2.', strategy: 'Division par 1 ou 2 : pense à la multiplication inverse.', visual: 'Répartis des objets en 2 groupes.' },
        { level: 2, divisors: [3], range: [6, 27], allowRemainder: false, formats: ['horizontal', 'sharing'], storyline: 'Partage en 3 groupes.', prompt: 'Divisions par 3.', strategy: 'Trouve combien de fois 3 rentre dans le nombre.', visual: 'Pose 3 paniers et distribue.' },
        { level: 3, divisors: [4], range: [8, 40], allowRemainder: false, formats: ['horizontal', 'array'], storyline: 'Divisions par 4.', prompt: 'Divisions exactes par 4.', strategy: 'Pense à 4 groupes identiques.', visual: 'Forme un rectangle 4 × ?.' },
        { level: 4, divisors: [5, 6], range: [10, 60], allowRemainder: false, formats: ['horizontal', 'array'], storyline: 'Divisions par 5 ou 6.', prompt: 'Divisions exactes par 5 et 6.', strategy: 'Utilise les tables inverses.', visual: 'Groupes en cercle.' },
        { level: 5, divisors: [7], range: [28, 84], allowRemainder: false, formats: ['horizontal'], storyline: 'Divisions par 7.', prompt: 'Divisions exactes par 7.', strategy: 'Souviens-toi des tables de 7.', visual: '7 paniers à remplir.' },
        { level: 6, divisors: [8], range: [24, 96], allowRemainder: false, formats: ['horizontal', 'array'], storyline: 'Divisions par 8.', prompt: 'Divisions exactes par 8.', strategy: 'Utilise les doublements successifs.', visual: 'Groupes de 8 cubes.' },
        { level: 7, divisors: [9], range: [27, 108], allowRemainder: false, formats: ['horizontal'], storyline: 'Divisions par 9.', prompt: 'Divisions exactes par 9.', strategy: 'Pense à la table de 9 inversée.', visual: 'Groupes serrés de 9.' },
        { level: 8, divisors: [10, 11], range: [30, 132], allowRemainder: false, formats: ['horizontal', 'story'], storyline: 'Divisions par 10 et 11.', prompt: 'Divisions exactes par 10 & 11.', strategy: 'Pour 10, enlève un zéro.', visual: 'Partage en 10 boîtes.' },
        { level: 9, divisors: [12], range: [48, 144], allowRemainder: false, formats: ['horizontal'], storyline: 'Divisions par 12.', prompt: 'Divisions exactes par 12.', strategy: 'Recherche la table de 12.', visual: '12 paniers alignés.' },
        { level: 10, divisors: [3, 4, 5, 6], range: [30, 144], allowRemainder: false, formats: ['horizontal', 'array'], storyline: 'Mélange exact (pas de reste).', prompt: 'Divisions sans reste.', strategy: 'Associe la division à une multiplication.', visual: 'Rectangles d\'égalité.' },
        { level: 11, divisors: [7, 8, 9, 12], range: [42, 180], allowRemainder: false, formats: ['horizontal', 'story'], storyline: 'Partages exacts plus complexes.', prompt: 'Divisions exactes avancées.', strategy: 'Utilise les faits de multiplication inversés.', visual: 'Partager des objets dans des paniers.' },
        { level: 12, divisors: [3, 4, 5, 6, 8, 9], range: [25, 144], allowRemainder: true, formats: ['horizontal', 'remainder', 'sharing'], storyline: 'Les restes apparaissent !', prompt: 'Divisions avec reste.', strategy: 'Cherche la multiplication la plus proche, le reste est ce qui manque.', visual: 'Distribue les objets puis regarde ceux qui restent.' },
        { level: 13, mode: 'mix', storyline: 'Défi mixte : trouve l\'opération qui convient.', prompt: 'Utilise l\'égalité inverse multiplication/division.' }
    ];

    function clearUsedCombinations(operation) {
        if (operation) {
            usedCombinationSet[operation]?.clear();
            return;
        }
        Object.values(usedCombinationSet).forEach(map => map.clear());
    }

    function claimSignature(operation, level, signature) {
        const levelKey = `L${level}`;
        const bucket = usedCombinationSet[operation] || usedCombinationSet.mix;
        const levelSet = bucket.get(levelKey) || new Set();
        if (levelSet.has(signature)) {
            return false;
        }
        if (levelSet.size >= 96) {
            levelSet.clear();
        }
        levelSet.add(signature);
        bucket.set(levelKey, levelSet);
        return true;
    }

    function randomInt(min, max) {
        const lower = Math.ceil(Math.min(min, max));
        const upper = Math.floor(Math.max(min, max));
        if (upper <= lower) { return lower; }
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    function randomChoice(list) {
        if (!Array.isArray(list) || !list.length) { return undefined; }
        return list[randomInt(0, list.length - 1)];
    }

    function shuffle(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function toDigits(number, maxDigits = 4) {
        const digits = [];
        let remainder = Math.abs(Math.floor(number));
        do {
            digits.push(remainder % 10);
            remainder = Math.floor(remainder / 10);
        } while (remainder > 0 && digits.length < maxDigits + 1);
        return digits;
    }

    function computeCarries(a, b) {
        const digitsA = toDigits(a, 4);
        const digitsB = toDigits(b, 4);
        const length = Math.max(digitsA.length, digitsB.length);
        let carry = 0;
        let carryCount = 0;
        for (let i = 0; i < length; i++) {
            const sum = (digitsA[i] || 0) + (digitsB[i] || 0) + carry;
            if (sum >= 10) {
                carry = 1;
                carryCount += 1;
            } else {
                carry = 0;
            }
        }
        return carryCount;
    }

    function ensureCarryProfile(value, profile) {
        switch (profile) {
            case 'none': return value === 0;
            case 'single': return value === 1;
            case 'single-or-double': return value === 1 || value === 2;
            case 'double': return value >= 2;
            case 'double-or-triple': return value >= 2;
            default: return true;
        }
    }

    function calculateBorrowCount(minuend, subtrahend) {
        const digitsA = toDigits(minuend, 4);
        const digitsB = toDigits(subtrahend, 4);
        const length = Math.max(digitsA.length, digitsB.length);
        let borrow = 0;
        let borrowCount = 0;
        for (let i = 0; i < length; i++) {
            const top = (digitsA[i] || 0) - borrow;
            const bottom = digitsB[i] || 0;
            if (top < bottom) {
                borrow = 1;
                borrowCount += 1;
            } else {
                borrow = 0;
            }
        }
        return borrowCount;
    }

    function ensureBorrowProfile(value, profile, allowsNegative) {
        switch (profile) {
            case 'none': return value === 0;
            case 'single': return value === 1;
            case 'single-or-double': return value === 1 || value === 2;
            case 'double': return value >= 2;
            case 'negative': return allowsNegative ? true : value >= 1;
            default: return true;
        }
    }

    function formatVerticalOperation(lhs, rhs, operator, resultPlaceholder = '&nbsp;?') {
        const width = Math.max(String(lhs).length, String(rhs).length + 1, String(resultPlaceholder).length);
        const pad = (value, prefix = '') => `${prefix}${String(value).padStart(width, '\u00a0')}`;
        const html = [
            `<pre class="math-vertical">${pad(lhs)}`,
            `${pad(operator + '\u00a0' + rhs)}`,
            `${'―'.repeat(width + 1)}`,
            `${pad(resultPlaceholder)}</pre>`
        ].join('\n');
        return html;
    }

    function arithmeticSummary(type, operands, result) {
        switch (type) {
            case 'additions':
                return `${operands.a} + ${operands.b} = ${result}`;
            case 'soustractions':
                return `${operands.a} - ${operands.b} = ${result}`;
            case 'multiplications':
                return `${operands.a} × ${operands.b} = ${result}`;
            case 'divisions':
                if (operands.remainder) {
                    return `${operands.dividend} / ${operands.divisor} = ${operands.quotient} reste ${operands.remainder}`;
                }
                return `${operands.dividend} / ${operands.divisor} = ${operands.quotient}`;
            default:
                return '';
        }
    }

    function getThemeMeta(operation, level, config) {
        const themes = win.LENA_MATH_THEMES || {};
        const theme = themes[operation] || themeFallback(operation);
        return {
            id: theme.id || operation,
            icon: theme.icon || DEFAULT_THEME.icon,
            label: theme.label || DEFAULT_THEME.label,
            accent: theme.accent || DEFAULT_THEME.accent,
            accentSoft: theme.accentSoft || DEFAULT_THEME.accentSoft,
            storyline: config?.storyline || theme.storyline || theme.storylines?.[0] || DEFAULT_THEME.storyline,
            instruction: config?.prompt || theme.instruction || DEFAULT_THEME.instruction,
            levelLabel: `Niveau ${level}`,
            optionIcons: theme.optionIcons || DEFAULT_THEME.optionIcons,
            sticker: Array.isArray(theme.stickers) ? randomChoice(theme.stickers) : theme.sticker,
            className: `operation-banner--${operation}`
        };
    }

    function themeFallback(operation) {
        return Object.assign({}, DEFAULT_THEME, {
            id: operation,
            label: `${DEFAULT_THEME.label} (${operation})`
        });
    }

    function buildAdditionQuestion(levelConfig, level) {
        const config = levelConfig || {};
        const minA = Number.isFinite(config.minA) ? config.minA : Math.max(1, level * 2 - 1);
        const maxA = Number.isFinite(config.maxA) ? config.maxA : Math.max(minA + 5, level * 8 + 4);
        const minB = Number.isFinite(config.minB) ? config.minB : Math.max(1, level * 2 - 2);
        const maxB = Number.isFinite(config.maxB) ? config.maxB : Math.max(minB + 5, level * 8 + 4);
        const carryProfile = config.carryProfile || (level <= 2 ? 'none' : level <= 5 ? 'single' : 'double');
        const tries = 40;
        let attempt = 0;
        let a;
        let b;
        let signature;
        let carryCount;
        do {
            a = randomInt(minA, maxA);
            b = randomInt(minB, maxB);
            carryCount = computeCarries(a, b);
            signature = `${Math.min(a, b)}|${Math.max(a, b)}`;
            attempt += 1;
            if (attempt > tries) { clearUsedCombinations('additions'); }
        } while ((!ensureCarryProfile(carryCount, carryProfile) || !claimSignature('additions', level, signature)) && attempt < tries * 2);

        const result = a + b;
        const formats = Array.isArray(config.formats) && config.formats.length ? config.formats : ['horizontal'];
        const format = randomChoice(formats);
    let questionText;
    let missingValue = null;
        if (format === 'vertical') {
            questionText = formatVerticalOperation(a, b, '+');
        } else if (format === 'missing-addend') {
            if (Math.random() < 0.5) {
                missingValue = 'a';
                questionText = `? + ${b} = ${result}`;
            } else {
                missingValue = 'b';
                questionText = `${a} + ? = ${result}`;
            }
        } else if (format === 'missing-result') {
            missingValue = 'result';
            questionText = `${a} + ${b} = ?`;
        } else {
            questionText = `${a} + ${b} = ?`;
        }

        const explanation = additionExplanation(a, b, result, carryCount);
        const hints = additionHints(a, b, result, carryCount, format);
        const distractors = additionDistractors(a, b, result, carryCount);

        const options = ensureResultPresent(result, distractors);
        const correctIndex = options.indexOf(result);
        const microSkill = `math:add:${[a, b].sort((x, y) => x - y).join('_')}`;

        return {
            questionText,
            options,
            correct: correctIndex,
            explanation,
            hints,
            encouragement: 'Utilise les retenues pas à pas.',
            metaSkill: microSkill,
            difficulty: level,
            reward: computeReward('additions', level),
            operationMeta: getThemeMeta('additions', level, config),
            operationData: {
                operands: { a, b },
                result,
                carryCount,
                format,
                missingValue
            }
        };
    }

    function additionExplanation(a, b, result, carryCount) {
        if (carryCount === 0) {
            return `${a} + ${b} = ${result} car on additionne simplement les unités.`;
        }
        const digitsA = toDigits(a);
        const digitsB = toDigits(b);
        const units = (digitsA[0] || 0) + (digitsB[0] || 0);
        const unitsPart = units >= 10
            ? `Les unités font ${units}, soit ${units - 10} unités et 1 dizaine à reporter.`
            : `Les unités font ${units}.`;
        const tens = (digitsA[1] || 0) + (digitsB[1] || 0) + (units >= 10 ? 1 : 0);
        const tensPart = tens >= 10
            ? `Les dizaines totalisent ${tens}, on reporte donc 1 centaine.`
            : `Les dizaines totalisent ${tens}.`;
        return `${unitsPart} ${tensPart} Le résultat final est ${result}.`;
    }

    function additionHints(a, b, result, carryCount, format) {
        const tensA = Math.floor(a / 10);
        const unitsA = a % 10;
        const tensB = Math.floor(b / 10);
        const unitsB = b % 10;
        const hints = [
            {
                id: 'strategy',
                text: carryCount
                    ? 'Additionne d\'abord les unités, note la retenue, puis calcule les dizaines.'
                    : 'Commence par le plus grand nombre et ajoute le second en comptant.'
            },
            {
                id: 'visual',
                text: carryCount
                    ? `Représente ${tensA} dizaines et ${unitsA} unités, puis ajoute ${tensB} dizaines et ${unitsB} unités. Regroupe les 10 unités en une dizaine.`
                    : `Dessine ${a} points puis ajoute ${b} points pour visualiser la somme.`
            },
            {
                id: 'guided',
                text: carryCount
                    ? `Les unités font ${unitsA} + ${unitsB} = ${unitsA + unitsB}. Écris ${result % 10} et reporte ${Math.floor((unitsA + unitsB) / 10)} sur la colonne des dizaines.`
                    : `Vérifie que ${a} + ${b} = ${result}.`
            }
        ];
        if (format === 'missing-addend') {
            hints[2].text = missingAddendHint(a, b, result);
        }
        if (format === 'missing-result') {
            hints[1].text = `Sépare ${result} en dizaines et unités pour vérifier ta réponse.`;
        }
        return hints;
    }

    function missingAddendHint(a, b, result) {
        if (result === a) { return `Quel nombre ajouté à ${b} donne ${result} ? Calcule ${result} - ${b}.`; }
        if (result === b) { return `Quel nombre ajouté à ${a} donne ${result} ? Calcule ${result} - ${a}.`; }
        return `Si ? + ${b} = ${result}, alors ? = ${result} - ${b}.`;
    }

    function additionDistractors(a, b, result, carryCount) {
        const distractors = new Set();
        distractors.add(result + 1);
        distractors.add(Math.max(0, result - 1));
        if (carryCount > 0) {
            distractors.add(result - 10);
            distractors.add((a % 10) + (b % 10));
        } else {
            distractors.add(result + 2);
            distractors.add(Math.max(0, result - 2));
        }
        distractors.add(Number(String(result).split('').reverse().join('')));
        distractors.add(a + b + 10);
        return Array.from(distractors)
            .filter(value => value !== result && value >= 0)
            .map(value => Math.round(value))
            .slice(0, 6);
    }

    function ensureResultPresent(result, distractors) {
        const combined = Array.from(new Set([result, ...distractors]));
        while (combined.length < 4) {
            combined.push(result + combined.length);
        }
        return shuffle(combined).slice(0, 4);
    }

    function buildSubtractionQuestion(levelConfig, level) {
        const config = levelConfig || {};
        const [minMinuend, maxMinuend] = Array.isArray(config.minuend) && config.minuend.length >= 2
            ? config.minuend
            : [Math.max(3, level * 2), Math.max(12, level * 10)];
        const [minSubtrahend, maxSubtrahend] = Array.isArray(config.subtrahend) && config.subtrahend.length >= 2
            ? config.subtrahend
            : [0, Math.max(6, level * 8)];
        const allowNegative = Boolean(config.allowNegative);
        const borrowProfile = config.borrowProfile || (level <= 2 ? 'none' : level <= 5 ? 'single' : level <= 8 ? 'single-or-double' : allowNegative ? 'negative' : 'double');
        const formats = Array.isArray(config.formats) && config.formats.length ? config.formats : ['horizontal'];
        const tries = 50;
        let attempt = 0;
        let minuend;
        let subtrahend;
        let result;
        let borrowCount;
        let signature;
        do {
            minuend = randomInt(minMinuend, maxMinuend);
            subtrahend = randomInt(minSubtrahend, maxSubtrahend);
            if (!allowNegative && subtrahend > minuend) {
                [minuend, subtrahend] = [Math.max(minuend, subtrahend), Math.min(minuend, subtrahend)];
            }
            result = minuend - subtrahend;
            if (!allowNegative && result < 0) { continue; }
            borrowCount = calculateBorrowCount(minuend, subtrahend);
            signature = `${minuend}-${subtrahend}`;
            attempt += 1;
            if (attempt > tries) { clearUsedCombinations('soustractions'); }
        } while ((!ensureBorrowProfile(borrowCount, borrowProfile, allowNegative) || !claimSignature('soustractions', level, signature)) && attempt < tries * 2);

        const format = randomChoice(formats);
        let questionText;
        if (format === 'vertical') {
            questionText = formatVerticalOperation(minuend, subtrahend, '-');
        } else if (format === 'missing-minuend') {
            questionText = `? - ${subtrahend} = ${result}`;
        } else if (format === 'missing-subtrahend') {
            questionText = `${minuend} - ? = ${result}`;
        } else if (format === 'number-line' && result < 0) {
            questionText = `${minuend} - ${subtrahend} = ? (Utilise une ligne numérique)`;
        } else {
            questionText = `${minuend} - ${subtrahend} = ?`;
        }

        const explanation = subtractionExplanation(minuend, subtrahend, result, borrowCount);
        const hints = subtractionHints(minuend, subtrahend, result, borrowCount, format);
        const distractors = subtractionDistractors(minuend, subtrahend, result, borrowCount);
        const options = ensureResultPresent(result, distractors);
        const correctIndex = options.indexOf(result);
        const microSkill = `math:sub:${minuend}_${subtrahend}`;

        return {
            questionText,
            options,
            correct: correctIndex,
            explanation,
            hints,
            encouragement: 'Souviens-toi d\'emprunter si besoin.',
            metaSkill: microSkill,
            difficulty: level,
            reward: computeReward('soustractions', level),
            operationMeta: getThemeMeta('soustractions', level, config),
            operationData: {
                operands: { minuend, subtrahend },
                result,
                borrowCount,
                format
            }
        };
    }

    function subtractionExplanation(minuend, subtrahend, result, borrowCount) {
        if (borrowCount === 0) {
            return `${minuend} - ${subtrahend} = ${result} car on retire les unités puis les dizaines sans emprunter.`;
        }
        if (result < 0) {
            return `${minuend} - ${subtrahend} = ${result}. Le résultat est négatif car ${subtrahend} est plus grand que ${minuend}.`;
        }
        const digitsA = toDigits(minuend);
        const digitsB = toDigits(subtrahend);
        const unitsDiff = (digitsA[0] || 0) - (digitsB[0] || 0);
        const tensDiff = (digitsA[1] || 0) - (digitsB[1] || 0) + (unitsDiff < 0 ? -1 : 0);
        return `On emprunte une dizaine : ${digitsA[0] || 0} devient ${unitsDiff < 0 ? unitsDiff + 10 : unitsDiff}. Puis on ajuste les dizaines pour obtenir ${result}.`;
    }

    function subtractionHints(minuend, subtrahend, result, borrowCount, format) {
        const hints = [
            {
                id: 'strategy',
                text: borrowCount
                    ? 'Si les unités du haut sont plus petites, emprunte une dizaine.'
                    : 'Retire les unités puis les dizaines.'
            },
            {
                id: 'visual',
                text: result < 0
                    ? `Place ${minuend} puis recule de ${subtrahend} sur une ligne numérique : tu passeras sous zéro.`
                    : `Représente ${minuend} avec des jetons et retire-en ${subtrahend}.`
            },
            {
                id: 'guided',
                text: borrowCount
                    ? `Transforme ${minuend} en ${minuend + 10} unités, retire ${subtrahend}, puis ajuste les dizaines.`
                    : `Vérifie que ${minuend} - ${subtrahend} = ${result}.`
            }
        ];
        if (format === 'missing-minuend') {
            hints[2].text = `Si ? - ${subtrahend} = ${result}, ajoute ${subtrahend} à ${result} pour trouver ?.`;
        } else if (format === 'missing-subtrahend') {
            hints[2].text = `${minuend} - ? = ${result} signifie que ? = ${minuend} - ${result}.`;
        }
        return hints;
    }

    function subtractionDistractors(minuend, subtrahend, result, borrowCount) {
        const distractors = new Set();
        distractors.add(result + 1);
        distractors.add(result - 1);
        distractors.add(minuend + subtrahend);
        distractors.add(Math.abs(result));
        if (borrowCount > 0) {
            distractors.add((minuend % 10) - (subtrahend % 10));
        }
        if (result < 0) {
            distractors.add(-result);
        }
        distractors.add(Number(String(result).split('').reverse().join('')));
        return Array.from(distractors)
            .filter(value => value !== result && Number.isFinite(value))
            .map(value => Math.round(value))
            .slice(0, 6);
    }

    function buildMultiplicationQuestion(levelConfig, level) {
        const config = levelConfig || {};
        const tableCandidates = Array.isArray(config.tables) && config.tables.length
            ? config.tables
            : [Math.max(1, Math.min(12, level))];
        const factorRange = Array.isArray(config.factors) && config.factors.length >= 2
            ? config.factors
            : [1, 12];
        const formats = Array.isArray(config.formats) && config.formats.length ? config.formats : ['horizontal'];
        const exclusions = Array.isArray(config.exclude) ? config.exclude : [];
        const tries = 50;
        let attempt = 0;
        let table;
        let factor;
        let signature;
        do {
            table = randomChoice(tableCandidates) || Math.max(1, Math.min(12, level));
            const minFactor = Number.isFinite(factorRange[0]) ? factorRange[0] : 1;
            const maxFactor = Number.isFinite(factorRange[1]) ? factorRange[1] : 12;
            factor = randomInt(minFactor, maxFactor);
            signature = `${Math.min(table, factor)}x${Math.max(table, factor)}`;
            attempt += 1;
            if (attempt > tries) { clearUsedCombinations('multiplications'); }
        } while (exclusions.includes(signature) || !claimSignature('multiplications', level, signature));

        const result = table * factor;
        const format = randomChoice(formats);
        let questionText;
        if (format === 'array') {
            questionText = `Combien de points si tu formes ${table} lignes de ${factor} points ?`;
        } else if (format === 'missing-factor') {
            questionText = Math.random() < 0.5
                ? `? × ${factor} = ${result}`
                : `${table} × ? = ${result}`;
        } else if (format === 'story') {
            questionText = `Tu as ${table} sachets avec ${factor} billes chacun. Combien de billes au total ?`;
        } else {
            questionText = `${table} × ${factor} = ?`;
        }

        const explanation = `${table} × ${factor} = ${result} car ${factor} + ${factor} + ... (${table} fois) = ${result}.`;
        const hints = [
            {
                id: 'strategy',
                text: `Utilise la commutativité : ${table} × ${factor} = ${factor} × ${table}.`
            },
            {
                id: 'visual',
                text: `Dessine ${table} lignes de ${factor} points pour visualiser le produit.`
            },
            {
                id: 'guided',
                text: `Décompose : ${table} × ${factor} = (${table} × ${Math.floor(factor / 2)}) × 2 + (${table} × ${factor % 2}).`
            }
        ];
        const distractors = multiplicationDistractors(table, factor, result);
        const options = ensureResultPresent(result, distractors);
        const correctIndex = options.indexOf(result);
        const microSkill = `math:mul:${Math.min(table, factor)}x${Math.max(table, factor)}`;

        return {
            questionText,
            options,
            correct: correctIndex,
            explanation,
            hints,
            encouragement: 'Appuie-toi sur tes tables.',
            metaSkill: microSkill,
            difficulty: level,
            reward: computeReward('multiplications', level),
            operationMeta: getThemeMeta('multiplications', level, config),
            operationData: {
                operands: { a: table, b: factor },
                result,
                format
            }
        };
    }

    function multiplicationDistractors(a, b, result) {
        const distractors = new Set();
        distractors.add(result + a);
        distractors.add(result - a);
        distractors.add(a + b);
        distractors.add(Math.abs(a - b));
        distractors.add(Number(String(result).split('').reverse().join('')));
        distractors.add(a * (b - 1));
        distractors.add(a * (b + 1));
        return Array.from(distractors)
            .filter(value => value !== result && value > 0)
            .map(value => Math.round(value))
            .slice(0, 6);
    }

    function buildDivisionQuestion(levelConfig, level) {
        const config = levelConfig || {};
        const divisors = Array.isArray(config.divisors) && config.divisors.length
            ? config.divisors
            : [Math.max(1, Math.min(12, level))];
        const range = Array.isArray(config.range) && config.range.length >= 2
            ? config.range
            : [divisors[0] * 2, divisors[0] * 12];
        const allowRemainder = Boolean(config.allowRemainder);
        const formats = Array.isArray(config.formats) && config.formats.length ? config.formats : ['horizontal'];
        const tries = 60;
        let attempt = 0;
        let divisor;
        let quotient;
        let dividend;
        let remainder = 0;
        let signature;
        do {
            divisor = randomChoice(divisors) || Math.max(1, Math.min(12, level));
            const maxDiv = divisor || 1;
            const maxRange = Number.isFinite(range[1]) ? range[1] : 144;
            quotient = randomInt(2, Math.max(2, Math.floor(maxRange / maxDiv)));
            dividend = divisor * quotient;
            if (allowRemainder && divisor > 1 && Math.random() < 0.35) {
                remainder = randomInt(1, divisor - 1);
                dividend += remainder;
            } else {
                remainder = 0;
            }
            const minRange = Number.isFinite(range[0]) ? range[0] : 0;
            if (dividend < minRange || dividend > maxRange) {
                continue;
            }
            signature = `${dividend}/${divisor}`;
            attempt += 1;
            if (attempt > tries) { clearUsedCombinations('divisions'); }
        } while (!claimSignature('divisions', level, signature) && attempt < tries * 2);

        const format = randomChoice(formats);
        let questionText;
        if (format === 'sharing') {
            questionText = `Tu as ${dividend} objets à partager également entre ${divisor} enfants. Combien chacun en reçoit-il ?`;
        } else if (format === 'remainder' && remainder) {
            questionText = `${dividend} / ${divisor} = ? (indique le reste)`;
        } else if (format === 'array') {
            questionText = `Combien de colonnes de ${divisor} peux-tu former avec ${dividend} éléments ?`;
        } else if (format === 'story') {
            questionText = `Une potion doit être versée dans des fioles de ${divisor}. Avec ${dividend}, combien de fioles complètes obtient-on ?`;
        } else {
            questionText = `${dividend} / ${divisor} = ?`;
        }

        const explanation = remainder
            ? `${dividend} / ${divisor} = ${quotient} reste ${remainder} car ${divisor} x ${quotient} = ${dividend - remainder} et il reste ${remainder}.`
            : `${dividend} / ${divisor} = ${quotient} car ${divisor} x ${quotient} = ${dividend}.`;

        const hints = [
            {
                id: 'strategy',
                text: 'Utilise la multiplication inverse : cherche le nombre qui multiplié par le diviseur donne le dividende.'
            },
            {
                id: 'visual',
                text: remainder
                    ? `Distribue ${dividend} objets en groupes de ${divisor}. Les objets restants forment le reste.`
                    : `Répartis ${dividend} objets en lignes de ${divisor}.`
            },
            {
                id: 'guided',
                text: remainder
                    ? `Calcule ${divisor} x ${quotient} = ${dividend - remainder}. Le reste est ${remainder}.`
                    : `Vérifie en multipliant : ${divisor} x ${quotient} = ${dividend}.`
            }
        ];

        const distractors = divisionDistractors(dividend, divisor, quotient, remainder).map(String);
        const correctValue = remainder ? `${quotient} r${remainder}` : String(quotient);
        const pool = new Set([correctValue, ...distractors]);
        while (pool.size < 4) {
            pool.add(String(Number(quotient) + pool.size));
        }
        const options = shuffle(Array.from(pool)).slice(0, 4);
        const correctIndex = options.indexOf(correctValue);
        const microSkill = remainder
            ? `math:div:${dividend}_${divisor}_r`
            : `math:div:${dividend}_${divisor}`;

        return {
            questionText,
            options,
            correct: correctIndex,
            explanation,
            hints,
            encouragement: 'Appuie-toi sur la multiplication inverse.',
            metaSkill: microSkill,
            difficulty: level,
            reward: computeReward('divisions', level),
            operationMeta: getThemeMeta('divisions', level, config),
            operationData: {
                operands: { dividend, divisor, quotient, remainder },
                format
            }
        };
    }

    function divisionDistractors(dividend, divisor, quotient, remainder) {
        const distractors = new Set();
        distractors.add(quotient + 1);
        distractors.add(Math.max(0, quotient - 1));
        distractors.add(divisor);
        distractors.add(Math.floor(dividend / (divisor + 1)));
        distractors.add(dividend - divisor);
        if (remainder) {
            distractors.add(`${quotient} r${Math.max(0, remainder - 1)}`);
            distractors.add(`${quotient + 1} r${Math.max(0, remainder + divisor - divisor)}`);
        }
        return Array.from(distractors)
            .filter(value => value !== quotient && value !== `${quotient} r${remainder}`)
            .map(value => (typeof value === 'number' ? value : String(value)))
            .slice(0, 6);
    }

    function computeReward(type, level) {
        const base = {
            additions: { stars: 8, coins: 4 },
            soustractions: { stars: 8, coins: 4 },
            multiplications: { stars: 10, coins: 5 },
            divisions: { stars: 11, coins: 6 }
        }[type] || { stars: 6, coins: 3 };
        return {
            stars: base.stars + Math.floor(level * 0.8),
            coins: base.coins + Math.floor(level * 0.6)
        };
    }

    function getMasteryScore(gameId) {
        try {
            const mastery = win.progressStore?.getMastery?.(gameId) || {};
            let attempts = 0;
            let success = 0;
            Object.values(mastery).forEach(entry => {
                attempts += Number(entry.attempts) || 0;
                success += Number(entry.success) || 0;
            });
            if (!attempts) { return 0.5; }
            return Math.max(0, Math.min(1, success / attempts));
        } catch (error) {
            console.warn('[mathEngine] Failed to read mastery for', gameId, error);
            return 0.5;
        }
    }

    function chooseAdaptiveOperation() {
        const operations = ['additions', 'soustractions', 'multiplications', 'divisions'];
        const weights = operations.map(op => {
            const score = getMasteryScore(op);
            return { op, weight: 1.2 + (1 - score) * 2.5 };
        });
        const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
        let ticket = Math.random() * total;
        for (const entry of weights) {
            ticket -= entry.weight;
            if (ticket <= 0) {
                return entry.op;
            }
        }
        return operations[0];
    }

    function getLevelConfig(operation) {
        return getConfigsForOperation(operation);
    }

    function resetCache(operation) {
        clearUsedCombinations(operation);
    }

    function generateMixedQuestion(level) {
        const chosenOperation = chooseAdaptiveOperation();
        const effectiveLevel = Math.max(1, Math.min(level, LEVEL_COUNT));
        const config = resolveOperationConfig(chosenOperation, effectiveLevel);
        switch (chosenOperation) {
            case 'additions':
                return buildAdditionQuestion(config, effectiveLevel);
            case 'soustractions':
                return buildSubtractionQuestion(config, effectiveLevel);
            case 'multiplications':
                return buildMultiplicationQuestion(config, effectiveLevel);
            case 'divisions':
                return buildDivisionQuestion(config, effectiveLevel);
            default:
                return buildAdditionQuestion(resolveOperationConfig('additions', effectiveLevel), effectiveLevel);
        }
    }

    function generateQuestion(operation, level) {
        if (level < 1) { level = 1; }
        if (level > LEVEL_COUNT) { level = LEVEL_COUNT; }
        const configs = getLevelConfig(operation);
        const levelIndex = Math.max(0, Math.min(level - 1, configs.length - 1));
        const rawConfig = configs[levelIndex];
        const config = (rawConfig && rawConfig.mode !== 'mix')
            ? rawConfig
            : resolveOperationConfig(operation, level);
        if (!rawConfig || rawConfig.mode === 'mix') {
            return generateMixedQuestion(level);
        }
        switch (operation) {
            case 'additions':
                return buildAdditionQuestion(resolveOperationConfig('additions', level), level);
            case 'soustractions':
                return buildSubtractionQuestion(config, level);
            case 'multiplications':
                return buildMultiplicationQuestion(config, level);
            case 'divisions':
                return buildDivisionQuestion(config, level);
            default:
                return buildAdditionQuestion(resolveOperationConfig('additions', level), level);
    }

    win.mathEngine = Object.assign({}, win.mathEngine || {}, {
        LEVEL_COUNT,
        getLevelConfig,
        generateQuestion,
        resetCache
    });
})(typeof window !== 'undefined' ? window : this);
