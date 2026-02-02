export const tablesGame = {
  id: 'tables-defi',
  title: 'Tables Défi',
  subtitle: 'Multiplications en séries.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: '2 × 3 = ?', options: ['6','5','8'], answer: '6' },
      { prompt: '2 × 4 = ?', options: ['8','6','10'], answer: '8' },
      { prompt: '2 × 5 = ?', options: ['10','12','8'], answer: '10' },
      { prompt: '2 × 6 = ?', options: ['12','14','10'], answer: '12' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: '3 × 7 = ?', options: ['21','24','18'], answer: '21' },
      { prompt: '4 × 6 = ?', options: ['24','20','28'], answer: '24' },
      { prompt: '5 × 8 = ?', options: ['40','45','35'], answer: '40' },
      { prompt: '6 × 7 = ?', options: ['42','48','36'], answer: '42' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '7 × 8 = ?', options: ['56','64','48'], answer: '56' },
      { prompt: '9 × 6 = ?', options: ['54','45','63'], answer: '54' },
      { prompt: '8 × 9 = ?', options: ['72','81','64'], answer: '72' },
      { prompt: '7 × 9 = ?', options: ['63','72','54'], answer: '63' }
    ]}
  ]
};
