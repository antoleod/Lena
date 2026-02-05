﻿const tr = (fr, en, es, nl) => ({ fr, en, es, nl });
const gameData = {
    MEMORY_GAME_LEVELS: [
        { level: 1, pairs: 2, grid: '2x2', timeLimit: null, traps: 0 },
        { level: 2, pairs: 4, grid: '2x4', timeLimit: null, traps: 0 },
        { level: 3, pairs: 6, grid: '3x4', timeLimit: null, traps: 0 },
        { level: 4, pairs: 8, grid: '4x4', timeLimit: 90, traps: 0 },
        { level: 5, pairs: 10, grid: '4x5', timeLimit: 100, traps: 2 },
        { level: 6, pairs: 12, grid: '4x6', timeLimit: 120, traps: 2 },
        { level: 7, pairs: 14, grid: '4x7', timeLimit: 130, traps: 3 },
        { level: 8, pairs: 16, grid: '4x8', timeLimit: 140, traps: 4 },
        { level: 9, pairs: 18, grid: '5x8', timeLimit: 150, traps: 4 },
        { level: 10, pairs: 20, grid: '5x8', timeLimit: 160, traps: 5 },
        { level: 11, pairs: 22, grid: '4x11', timeLimit: 170, traps: 6 },
        { level: 12, pairs: 24, grid: '6x8', timeLimit: 180, traps: 6 }
    ],
        vowelLevels: [
        {
            level: 1,
            masked: 'ch_t',
            answer: 'a',
            options: ['a', 'e', 'i'],
            hint: tr('Un animal qui ronronne.', 'An animal that purrs.', 'Un animal que ronronea.', 'Een dier dat spint.')
        }
    ],
    COLOR_MIX_LIBRARY: [
        {
            id: 'mix-blue-yellow',
            inputs: [tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw'), tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel')],
            result: tr('🟢 Vert', '🟢 Green', '🟢 Verde', '🟢 Groen'),
            explanation: tr('Le bleu et le jaune deviennent un joli vert.', 'Blue and yellow become a nice green.', 'El azul y el amarillo se vuelven un bonito verde.', 'Blauw en geel worden samen een mooie groen.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-yellow',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel')],
            result: tr('🟠 Orange', '🟠 Orange', '🟠 Naranja', '🟠 Oranje'),
            explanation: tr('Le rouge et le jaune donnent de l orange.', 'Red and yellow make orange.', 'El rojo y el amarillo hacen naranja.', 'Rood en geel maken oranje.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-blue',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw')],
            result: tr('🟣 Violet', '🟣 Purple', '🟣 Morado', '🟣 Paars'),
            explanation: tr('Le rouge et le bleu donnent du violet.', 'Red and blue make purple.', 'El rojo y el azul hacen morado.', 'Rood en blauw maken paars.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-blue-white',
            inputs: [tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🩵 Bleu clair', '🩵 Light blue', '🩵 Azul claro', '🩵 Lichtblauw'),
            explanation: tr('Le bleu avec du blanc devient plus clair.', 'Blue mixed with white becomes lighter.', 'El azul con blanco se vuelve más claro.', 'Blauw met wit wordt lichter.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-red-white',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('💗 Rose', '💗 Pink', '💗 Rosa', '💗 Roze'),
            explanation: tr('Le rouge avec du blanc devient rose.', 'Red mixed with white becomes pink.', 'El rojo con blanco se vuelve rosa.', 'Rood met wit wordt roze.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-yellow-white',
            inputs: [tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🌼 Jaune clair', '🌼 Light yellow', '🌼 Amarillo claro', '🌼 Lichtgeel'),
            explanation: tr('Le jaune avec du blanc devient jaune clair.', 'Yellow mixed with white becomes light yellow.', 'El amarillo con blanco se vuelve amarillo claro.', 'Geel met wit wordt lichtgeel.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-green-white',
            inputs: [tr('🟢 Vert', '🟢 Green', '🟢 Verde', '🟢 Groen'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🍃 Vert clair', '🍃 Light green', '🍃 Verde claro', '🍃 Lichtgroen'),
            explanation: tr('Le vert avec du blanc devient vert clair.', 'Green mixed with white becomes light green.', 'El verde con blanco se vuelve verde claro.', 'Groen met wit wordt lichtgroen.'),
            minLevel: 4,
            maxLevel: 12
        }
    ]
};

if (typeof window !== 'undefined') {
    window.gameData = gameData;
}
