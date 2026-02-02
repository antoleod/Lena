export const fractionsGame = {
  id: 'fractions',
  title: 'Fractions fantastiques',
  subtitle: 'Comparer, reconnaître et choisir la bonne fraction.',
  levels: [
    {
      level: 1,
      grade: 3,
      exercises: [
        { prompt: 'Quelle fraction représente 1 part sur 2 ?', options: ['1/2','1/3','2/3'], answer: '1/2' },
        { prompt: 'Quelle fraction représente 1 part sur 4 ?', options: ['1/4','1/2','3/4'], answer: '1/4' },
        { prompt: 'Choisis la fraction : 2 parts sur 3.', options: ['2/3','3/2','1/3'], answer: '2/3' },
        { prompt: 'Choisis la fraction : 3 parts sur 4.', options: ['3/4','1/4','4/3'], answer: '3/4' },
        { prompt: 'Quelle fraction est égale à un demi ?', options: ['2/4','1/4','3/4'], answer: '2/4' },
        { prompt: 'Quelle fraction est égale à un demi ?', options: ['3/6','1/6','5/6'], answer: '3/6' }
      ]
    },
    {
      level: 2,
      grade: 3,
      exercises: [
        { prompt: 'Quelle fraction est plus grande ?', options: ['3/4','2/4','1/4'], answer: '3/4' },
        { prompt: 'Quelle fraction est plus grande ?', options: ['2/3','1/3','1/6'], answer: '2/3' },
        { prompt: 'Quelle fraction est plus petite ?', options: ['1/5','3/5','4/5'], answer: '1/5' },
        { prompt: 'Choisis une fraction équivalente à 1/2.', options: ['4/8','1/8','3/8'], answer: '4/8' },
        { prompt: 'Choisis une fraction équivalente à 2/3.', options: ['4/6','2/6','6/4'], answer: '4/6' },
        { prompt: 'Choisis une fraction équivalente à 3/4.', options: ['6/8','2/8','5/8'], answer: '6/8' }
      ]
    },
    {
      level: 3,
      grade: 4,
      exercises: [
        { prompt: 'Quelle fraction est plus grande ?', options: ['5/8','3/8','2/8'], answer: '5/8' },
        { prompt: 'Quelle fraction est plus grande ?', options: ['7/10','3/10','5/10'], answer: '7/10' },
        { prompt: 'Quelle fraction est plus petite ?', options: ['2/9','5/9','7/9'], answer: '2/9' },
        { prompt: 'Choisis une fraction équivalente à 3/5.', options: ['6/10','2/10','9/10'], answer: '6/10' },
        { prompt: 'Choisis une fraction équivalente à 4/6.', options: ['2/3','4/9','6/4'], answer: '2/3' },
        { prompt: 'Choisis une fraction équivalente à 5/10.', options: ['1/2','2/10','9/10'], answer: '1/2' }
      ]
    }
  ]
};
