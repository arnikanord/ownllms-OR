import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    open: true
  },
  envPrefix: 'APP_',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
