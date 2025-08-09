import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          query: ['@tanstack/react-query'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },

    sourcemap: true,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@tanstack/react-query',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'axios',
    ],
  },

  server: {
    port: 3000,
    open: true,

    hmr: true,
  },
});
