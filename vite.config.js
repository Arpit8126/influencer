import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into separate chunks — loads in parallel
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          }
        }
      }
    },
    // Increase warning limit for three.js (it's big but code-split)
    chunkSizeWarningLimit: 700
  }
})
