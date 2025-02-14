import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject';

export default defineConfig({
  base: '',
  build: {
    outDir: 'js',
    lib: {
      entry: '/src/index.ts',
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`
    },
    sourcemap: true,
    target: 'es2022',
    minify: false,
    rollupOptions: {
      external: (id) => id.startsWith('../../scripts/'),
      plugins: [
        inject({
          app: ['../../scripts/app.js', 'app']
        })
      ],
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
})
