import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths, so the same build works at a GitHub Pages project
  // subpath (/trial/), at a domain root, and from a local `preview` — without
  // hardcoding the repository name anywhere.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // three.js and gsap are the heaviest dependencies — split them so the
        // document paints before the WebGL layers arrive.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
