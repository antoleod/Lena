export const mesuresGame = {
  id: 'mesures-magiques',
  title: 'Mesures magiques',
  subtitle: 'Choisir la bonne unité.',
  levels: [
    { level: 1, grade: 2, exercises: [
      { prompt: 'On mesure la longueur d\'un crayon en…', options: ['cm','m','km'], answer: 'cm' },
      { prompt: 'On mesure la taille d\'une classe en…', options: ['m','cm','km'], answer: 'm' },
      { prompt: 'On mesure une petite bouteille en…', options: ['ml','l','kg'], answer: 'ml' },
      { prompt: 'On mesure le poids d\'une pomme en…', options: ['g','kg','l'], answer: 'g' }
    ]},
    { level: 2, grade: 3, exercises: [
      { prompt: 'On mesure la distance entre villes en…', options: ['km','m','cm'], answer: 'km' },
      { prompt: 'On mesure le poids d\'un sac d\'école en…', options: ['kg','g','ml'], answer: 'kg' },
      { prompt: 'On mesure la capacité d\'un seau en…', options: ['l','ml','kg'], answer: 'l' },
      { prompt: 'On mesure la largeur d\'une porte en…', options: ['cm','m','km'], answer: 'cm' }
    ]},
    { level: 3, grade: 4, exercises: [
      { prompt: '3 m = … cm', options: ['300','30','3000'], answer: '300' },
      { prompt: '1,5 l = … ml', options: ['1500','150','15000'], answer: '1500' },
      { prompt: '2 kg = … g', options: ['2000','200','20'], answer: '2000' },
      { prompt: '750 ml = … l', options: ['0,75','7,5','0,075'], answer: '0,75' }
    ]}
  ]
};
