import { defineConfig } from 'vite';
import { resolve } from 'path';

const entry = process.env.ENTRY || 'content';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: entry === 'content',
    rollupOptions: {
      input: resolve(__dirname, `src/${entry}/index.ts`),
      output: {
        entryFileNames: `${entry}.js`,
      },
    },
  },
});
