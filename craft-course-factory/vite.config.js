import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('🚨 [Vite Proxy Error]:', err.message);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('📤 [Vite Proxy Request]:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 [Vite Proxy Response]:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
