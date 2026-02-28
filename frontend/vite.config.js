import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Converts render-blocking CSS <link> tags to async preloads.
 * Safe because index.html already inlines all critical above-the-fold CSS.
 */
function asyncCssPlugin() {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1" crossorigin onload="this.onload=null;this.rel=\'stylesheet\'">' +
        '<noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
  build: {
    // Target browsers with good ES2019+ support:
    // Chrome 87, Firefox 78 (ESR), Safari 14, Edge 88
    // This ensures optional chaining, nullish coalescing, etc. are transpiled correctly
    target: ['chrome87', 'firefox78', 'safari14', 'edge88'],
    // Enable CSS code splitting so lazy-loaded routes load their own CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'router': ['react-router-dom'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
