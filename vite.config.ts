
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Ersetze 'REPO_NAME' durch deinen tatsächlichen Repository-Namen auf GitHub
  // Wenn es die Haupt-Seite ist (username.github.io), lass es bei '/'
  base: './', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
  },
});
