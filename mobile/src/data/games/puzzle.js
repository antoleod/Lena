export const puzzleGame = {
  id: 'puzzle',
  title: 'Puzzle magique',
  subtitle: 'Trouver l\'équation qui manque.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: '2 + 3 = __', options: ['5','6','4'], answer: '5' },
      { prompt: '7 - 4 = __', options: ['3','2','4'], answer: '3' },
      { prompt: '5 + 4 = __', options: ['9','8','7'], answer: '9' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: '6 × 4 = __', options: ['24','20','28'], answer: '24' },
      { prompt: '18 ÷ 3 = __', options: ['6','5','7'], answer: '6' },
      { prompt: '9 + 8 = __', options: ['17','16','18'], answer: '17' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '7 × 6 = __', options: ['42','36','48'], answer: '42' },
      { prompt: '56 ÷ 7 = __', options: ['8','7','9'], answer: '8' },
      { prompt: '125 - 47 = __', options: ['78','68','88'], answer: '78' }
    ]}
  ]
};
