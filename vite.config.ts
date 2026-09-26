import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
      }
    }
  }
})
