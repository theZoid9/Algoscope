import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  resolve: { preserveSymlinks: true },
  optimizeDeps: { esbuildOptions: { preserveSymlinks: true } },
});
