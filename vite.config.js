// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://zenjournalbe.vercel.app',
        changeOrigin: true,
        secure: true,
        // If your backend does NOT expect /api in the path, uncomment the next line:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})