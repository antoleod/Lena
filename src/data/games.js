export const YEARS = [
  {
    id: 2,
    slug: 'segundo',
    label: '2o ano',
    title: '2o de primaria',
    description: 'Matematicas, lectura y logica para 2o de primaria.'
  },
  {
    id: 3,
    slug: 'tercero',
    label: '3o ano',
    title: '3o de primaria',
    description: 'Retos avanzados con problemas, fracciones y razonamiento.'
  }
];

export const GAMES = [
  {
    id: 'build-number',
    slug: 'componer-descomponer',
    year: 2,
    title: 'Construir numeros',
    description: 'Decenas y unidades con bloques base 10.',
    tags: ['numeros', 'valor-posicional', 'visual'],
    mode: 'engine'
  },
  {
    id: 'number-line',
    slug: 'recta-numerica',
    year: 2,
    title: 'Recta numerica',
    description: 'Avanza o retrocede segun la operacion.',
    tags: ['suma', 'resta', 'visual'],
    mode: 'engine'
  },
  {
    id: 'place-value',
    slug: 'valor-posicional',
    year: 3,
    title: 'Valor posicional',
    description: 'Componer y descomponer numeros con apoyo visual.',
    tags: ['numeros', 'valor-posicional'],
    mode: 'engine'
  },
  {
    id: 'subtract-transform',
    slug: 'resta-visual',
    year: 3,
    title: 'Transformar y restar',
    description: 'Restas con cambios de decenas y unidades.',
    tags: ['resta', 'estrategias'],
    mode: 'engine'
  },
  {
    id: 'half-game',
    slug: 'mitades',
    year: 3,
    title: 'Mitades rapidas',
    description: 'Mitades y dobles con preguntas dinamicas.',
    tags: ['mitades', 'calculo-mental'],
    mode: 'engine'
  },
  {
    id: 'mult-div-families',
    slug: 'familias-multiplicar',
    year: 3,
    title: 'Familias de multiplicar',
    description: 'Relaciona multiplicaciones y divisiones.',
    tags: ['multiplicacion', 'division'],
    mode: 'engine'
  },
  {
    id: 'word-problems',
    slug: 'problemas-texto',
    year: 3,
    title: 'Problemas en texto',
    description: 'Lee y elige la operacion correcta.',
    tags: ['lectura', 'razonamiento'],
    mode: 'engine'
  },
  {
    id: 'possessives',
    slug: 'posesivos',
    year: 2,
    title: 'Determinantes posesivos',
    description: 'Elige el determinante correcto segun el contexto.',
    tags: ['lengua', 'gramatica'],
    mode: 'engine'
  }
];

export function getYearById(yearId) {
  return YEARS.find((year) => year.id === yearId) || null;
}

export function getGameBySlug(slug) {
  return GAMES.find((game) => game.slug === slug) || null;
}

export function getGamesByYear(yearId) {
  return GAMES.filter((game) => game.year === yearId);
}
