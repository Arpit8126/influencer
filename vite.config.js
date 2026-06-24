import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into separate chunks — loads in parallel
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-gsap': ['gsap'],
          'vendor-framer': ['framer-motion'],
          'vendor-react': ['react', 'react-dom'],
        }
      }
    },
    // Increase warning limit for three.js (it's big but code-split)
    chunkSizeWarningLimit: 700
  }
})
