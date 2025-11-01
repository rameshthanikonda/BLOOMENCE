import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bloomence-99-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        // do not rewrite; backend already expects /api prefix
      }
    }
  }
})
