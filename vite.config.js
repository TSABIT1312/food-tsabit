// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // <-- penting untuk Vercel agar tidak salah path
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
