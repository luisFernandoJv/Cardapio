import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        short_name: 'Posto Cidade',
        name: 'Posto Cidade - Pedidos Online',
        description: 'Faça pedidos online no Posto Cidade de forma rápida e fácil.',
        icons: [
          {
            src: '/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        scope: '/',
        orientation: 'portrait',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'], // Inclui todos os arquivos necessários
      },
    }),
  ],
  server: {
    port: 5173,
  },
});