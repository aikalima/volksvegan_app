import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    // Generate sourcemaps for better debugging
    sourcemap: true
  },
  // Handle SPA routing
  server: {
    host: true
  }
})
