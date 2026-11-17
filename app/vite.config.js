import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const indexHtml = fileURLToPath(new URL('./index.html', import.meta.url))
const companionHtml = fileURLToPath(new URL('./companion.html', import.meta.url))

// base: './' keeps asset URLs relative so the bundle works both at the
// GitHub Pages root and under any subpath.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { main: indexHtml, companion: companionHtml }
    }
  }
})
