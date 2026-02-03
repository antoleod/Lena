import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    base: env.GITHUB_PAGES ? '/Lena/' : '/',
    plugins: [react()],
    server: {
      port: 5173
    }
  });
}