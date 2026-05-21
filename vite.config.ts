import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // GitHub Pages base URL
    base: '/islomebe/',
    server: {
      port: 3000,
    },
  };
});