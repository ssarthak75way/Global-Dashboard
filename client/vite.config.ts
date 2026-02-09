import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor-utils': ['axios', 'date-fns', 'zod', 'react-hook-form', 'react-error-boundary'],
          'vendor-ui': ['react-icons', 'react-markdown', 'react-quill-new', 'react-select', 'remark-gfm']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Optional: increase warning limit if chunks are still slightly over 500kb but much better than before
  }
})
