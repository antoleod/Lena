export const tempsGame = {
  id: 'temps-horloges',
  title: 'Temps & Horloges',
  subtitle: 'Lire l’heure.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'Quelle heure est-il ? 3:00', options: ['3 heures','4 heures','2 heures'], answer: '3 heures' },
      { prompt: 'Quelle heure est-il ? 7:30', options: ['7 heures et demie','7 heures','6 heures et demie'], answer: '7 heures et demie' },
      { prompt: 'Quelle heure est-il ? 9:15', options: ['9 heures et quart','9 heures','8 heures et quart'], answer: '9 heures et quart' },
      { prompt: 'Quelle heure est-il ? 12:00', options: ['12 heures','11 heures','1 heure'], answer: '12 heures' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: 'Quelle heure est-il ? 14:30', options: ['14 h 30','14 h 00','15 h 30'], answer: '14 h 30' },
      { prompt: 'Quelle heure est-il ? 16:45', options: ['16 h 45','16 h 15','15 h 45'], answer: '16 h 45' },
      { prompt: 'Quelle heure est-il ? 8:05', options: ['8 h 05','8 h 50','7 h 05'], answer: '8 h 05' },
      { prompt: 'Quelle heure est-il ? 19:20', options: ['19 h 20','19 h 02','18 h 20'], answer: '19 h 20' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: 'Convertis : 2 h 40 = ?', options: ['160 min','140 min','180 min'], answer: '160 min' },
      { prompt: 'Convertis : 95 min = ?', options: ['1 h 35','1 h 25','1 h 45'], answer: '1 h 35' },
      { prompt: 'Quelle heure est-il ? 21:10', options: ['21 h 10','21 h 01','20 h 10'], answer: '21 h 10' },
      { prompt: 'Durée : 14:00 à 14:45 = ?', options: ['45 min','35 min','55 min'], answer: '45 min' }
    ]}
  ]
};
