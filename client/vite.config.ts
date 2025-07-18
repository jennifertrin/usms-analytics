import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    sourcemap: false,
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['plotly.js-dist-min', 'react-plotly.js']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    target: 'es2015',
    minify: 'terser'
  },
  base: '',
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: [
        '**/backend/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/flask_session/**',
        '**/*.session',
        '**/*.log',
        '**/venv/**',
        '**/__pycache__/**',
        '**/*.pyc',
        '**/*.pyo',
        '**/*.pyd'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['backend', 'venv']
  }
})