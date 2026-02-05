export const PRACTICES = [
  {
    id: 'build-number',
    title: 'Construir numeros',
    category: 'Fundamentos numericos',
    levelRange: 'Nivel 1-10',
    duration: '6-10 min',
    focus: ['Decenas y unidades', 'Representacion visual', 'Composicion de numeros'],
    description: 'Trabaja el valor posicional con bloques base 10 y construccion guiada.',
    accent: '#1f6feb'
  },
  {
    id: 'place-value',
    title: 'Valor posicional',
    category: 'Fundamentos numericos',
    levelRange: 'Nivel 1-10',
    duration: '6-10 min',
    focus: ['Descomposicion', 'Lectura de numeros', 'Comparacion rapida'],
    description: 'Compone y descompone numeros con apoyo visual y ejemplos claros.',
    accent: '#0ea5e9'
  },
  {
    id: 'number-line',
    title: 'Recta numerica',
    category: 'Fundamentos numericos',
    levelRange: 'Nivel 1-10',
    duration: '5-9 min',
    focus: ['Saltos controlados', 'Sumas y restas', 'Estimacion'],
    description: 'Avanza o retrocede en la recta segun la operacion indicada.',
    accent: '#14b8a6'
  },
  {
    id: 'subtract-transform',
    title: 'Transformar y restar',
    category: 'Operaciones',
    levelRange: 'Nivel 1-10',
    duration: '7-12 min',
    focus: ['Restas con transformacion', 'Estrategias de calculo', 'Precision'],
    description: 'Restas con cambios de decenas y unidades para afianzar el calculo mental.',
    accent: '#f97316'
  },
  {
    id: 'half-game',
    title: 'Mitades rapidas',
    category: 'Operaciones',
    levelRange: 'Nivel 1-10',
    duration: '5-8 min',
    focus: ['Mitades y dobles', 'Calculo veloz', 'Patrones'],
    description: 'Mitades y dobles con preguntas dinamicas y retroalimentacion inmediata.',
    accent: '#e11d48'
  },
  {
    id: 'mult-div-families',
    title: 'Familias de multiplicar',
    category: 'Operaciones',
    levelRange: 'Nivel 1-10',
    duration: '6-10 min',
    focus: ['Multiplicaciones', 'Divisiones', 'Relaciones'],
    description: 'Relaciona multiplicaciones y divisiones para consolidar familias.',
    accent: '#7c3aed'
  },
  {
    id: 'word-problems',
    title: 'Problemas en texto',
    category: 'Razonamiento',
    levelRange: 'Nivel 1-10',
    duration: '7-12 min',
    focus: ['Comprension lectora', 'Seleccion de operacion', 'Logica'],
    description: 'Lee y elige la operacion correcta para resolver el problema.',
    accent: '#0f766e'
  },
  {
    id: 'possessives',
    title: 'Determinantes posesivos',
    category: 'Lengua',
    levelRange: 'Nivel 1-12',
    duration: '6-10 min',
    focus: ['Uso correcto', 'Concordancia', 'Contexto'],
    description: 'Selecciona el determinante correcto segun el contexto.',
    accent: '#f59e0b'
  }
];

export const PRACTICE_CATEGORIES = [
  {
    id: 'fundamentos',
    title: 'Fundamentos numericos',
    description: 'Construye base solida en numeracion, recta numerica y valor posicional.',
    accent: '#1f6feb'
  },
  {
    id: 'operaciones',
    title: 'Operaciones',
    description: 'Sumas, restas, mitades y relaciones entre multiplicacion y division.',
    accent: '#f97316'
  },
  {
    id: 'razonamiento',
    title: 'Razonamiento',
    description: 'Problemas en texto para aplicar lo aprendido con criterio.',
    accent: '#0f766e'
  },
  {
    id: 'lengua',
    title: 'Lengua',
    description: 'Comprension gramatical y uso correcto de determinantes.',
    accent: '#f59e0b'
  }
];

export const PRACTICE_BY_ID = PRACTICES.reduce((acc, practice) => {
  acc[practice.id] = practice;
  return acc;
}, {});
