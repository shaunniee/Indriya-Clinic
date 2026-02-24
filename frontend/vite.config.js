import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target browsers with good ES2019+ support:
    // Chrome 87, Firefox 78 (ESR), Safari 14, Edge 88
    // This ensures optional chaining, nullish coalescing, etc. are transpiled correctly
    target: ['chrome87', 'firefox78', 'safari14', 'edge88'],
  },
})
