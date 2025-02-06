import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
