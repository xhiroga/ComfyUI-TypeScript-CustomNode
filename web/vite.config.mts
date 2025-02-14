import { defineConfig } from 'vite'

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
      external: (id) => {
        return id.startsWith('@comfyorg/comfyui-frontend')
      },
      output: {
        paths: (id) => {
          if (id.startsWith('@comfyorg/comfyui-frontend/src/scripts/')) {
            const parts = id.split('/');
            const moduleName = parts[parts.length - 1];
            return `../../scripts/${moduleName}.js`;
          }
          return id;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
})
