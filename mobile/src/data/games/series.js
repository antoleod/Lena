export const seriesGame = {
  id: 'series-numeriques',
  title: 'Séries numériques',
  subtitle: 'Trouver la suite.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: '2, 4, 6, __', options: ['8','9','10'], answer: '8' },
      { prompt: '5, 10, 15, __', options: ['20','18','25'], answer: '20' },
      { prompt: '1, 3, 5, __', options: ['7','6','8'], answer: '7' },
      { prompt: '10, 8, 6, __', options: ['4','5','2'], answer: '4' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: '3, 6, 9, __', options: ['12','15','10'], answer: '12' },
      { prompt: '20, 17, 14, __', options: ['11','12','10'], answer: '11' },
      { prompt: '4, 8, 12, __', options: ['16','14','20'], answer: '16' },
      { prompt: '2, 5, 8, __', options: ['11','10','12'], answer: '11' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '5, 10, 20, __', options: ['40','30','35'], answer: '40' },
      { prompt: '81, 72, 63, __', options: ['54','51','45'], answer: '54' },
      { prompt: '6, 12, 18, __', options: ['24','30','20'], answer: '24' },
      { prompt: '100, 90, 80, __', options: ['70','75','60'], answer: '70' }
    ]}
  ]
};
