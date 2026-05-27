import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.GITHUB_PAGES ? '/Lena/' : '/';

  return defineConfig({
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        base,
        includeAssets: [
          'assets/iconos/*.png',
          'assets/i18n/*.json',
          'assets/sounds/*.wav',
          'offline.html',
        ],
        manifest: {
          name: 'Lena Learning Adventure',
          short_name: 'Lena',
          id: '/',
          lang: 'fr',
          dir: 'ltr',
          start_url: './',
          scope: './',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          display: 'standalone',
          orientation: 'portrait-primary',
          background_color: '#fff8fd',
          theme_color: '#ff8fc6',
          description: 'Interactive learning adventure for primary school children.',
          categories: ['education', 'kids', 'games'],
          shortcuts: [
            {
              name: 'Continuer',
              short_name: 'Continuer',
              url: './continue',
              icons: [{ src: 'assets/iconos/icon-192.png', type: 'image/png', sizes: '192x192' }],
            },
            {
              name: 'Grand Voyage',
              short_name: 'Carte',
              url: './map',
              icons: [{ src: 'assets/iconos/icon-192.png', type: 'image/png', sizes: '192x192' }],
            },
            {
              name: 'Matieres',
              short_name: 'Matieres',
              url: './subjects',
              icons: [{ src: 'assets/iconos/icon-192.png', type: 'image/png', sizes: '192x192' }],
            },
          ],
          icons: [
            { src: 'assets/iconos/icon-32.png', type: 'image/png', sizes: '32x32' },
            { src: 'assets/iconos/icon-180.png', type: 'image/png', sizes: '180x180' },
            { src: 'assets/iconos/icon-192.png', type: 'image/png', sizes: '192x192' },
            {
              src: 'assets/iconos/icon-512.png',
              type: 'image/png',
              sizes: '512x512',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,json,wav}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/offline\.html$/],
          runtimeCaching: [
            {
              // Google Fonts stylesheets
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              // Google Fonts actual font files
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
          cleanupOutdatedCaches: true,
          skipWaiting: false,
          clientsClaim: true,
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    server: {
      port: 5173,
    },
  });
};
