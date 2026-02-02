export const mathBlitzGame = {
  id: 'math-blitz',
  title: 'Maths Sprint',
  subtitle: 'Calcul mental rapide.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: '6 + 7 = ?', options: ['12','13','14'], answer: '13' },
      { prompt: '15 - 8 = ?', options: ['7','8','9'], answer: '7' },
      { prompt: '9 + 5 = ?', options: ['13','14','15'], answer: '14' },
      { prompt: '20 - 9 = ?', options: ['11','10','12'], answer: '11' },
      { prompt: '8 + 8 = ?', options: ['16','14','15'], answer: '16' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: '27 + 18 = ?', options: ['45','46','44'], answer: '45' },
      { prompt: '64 - 27 = ?', options: ['37','36','39'], answer: '37' },
      { prompt: '7 × 6 = ?', options: ['42','36','48'], answer: '42' },
      { prompt: '72 ÷ 8 = ?', options: ['9','8','10'], answer: '9' },
      { prompt: '35 + 46 = ?', options: ['81','79','82'], answer: '81' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '128 + 47 = ?', options: ['175','165','185'], answer: '175' },
      { prompt: '204 - 68 = ?', options: ['136','126','146'], answer: '136' },
      { prompt: '9 × 8 = ?', options: ['72','81','64'], answer: '72' },
      { prompt: '96 ÷ 12 = ?', options: ['8','7','9'], answer: '8' },
      { prompt: '250 + 75 = ?', options: ['325','315','335'], answer: '325' }
    ]}
  ]
};
