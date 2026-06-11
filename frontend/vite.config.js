import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://crispy-potato-qv76gg55rgxxc99r5-8080.app.github.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})