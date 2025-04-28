import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,              // or whatever you like
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})