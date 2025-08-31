
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: ['@vercel/analytics/react']
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        external: [],
      }
    },
    server: {
      port: 3000,
      open: true
    }
  })