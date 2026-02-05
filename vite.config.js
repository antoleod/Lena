import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { GAMES, YEARS } from './src/data/games.js';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const inputs = {
    home: path.resolve('index.html'),
    juegos: path.resolve('juegos/index.html')
  };

  YEARS.forEach((year) => {
    inputs[`year-${year.slug}`] = path.resolve('juegos', year.slug, 'index.html');
  });

  GAMES.forEach((game) => {
    inputs[`game-${game.slug}`] = path.resolve('juegos', game.slug, 'index.html');
  });

  return defineConfig({
    base: env.GITHUB_PAGES ? '/Lena/' : '/',
    plugins: [react()],
    build: {
      rollupOptions: {
        input: inputs
      }
    },
    server: {
      port: 5173
    }
  });
}
