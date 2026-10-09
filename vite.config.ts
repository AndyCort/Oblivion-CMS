import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|styled-components|stylis|@emotion)\//.test(id)) return "ui-runtime";
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
