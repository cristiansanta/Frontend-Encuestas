import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
    react({
      // Habilita Fast Refresh (HMR para React)
      fastRefresh: true,
    }),
  ],
  server: {
    // Configura el servidor para detectar cambios de manera más eficiente
    watch: {
      usePolling: true,
    },
    // Configura HMR
    hmr: {
      overlay: true,
    },
  },
})