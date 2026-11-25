import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  // GitHub Pages project site: https://lendherm.github.io/wdd330-globeprep/
  base: process.env.GITHUB_ACTIONS ? '/wdd330-globeprep/' : '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        saved: resolve(__dirname, 'src/saved.html'),
      },
    },
  },
});
