import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core UI Framework
            if (id.includes('@mui/material')) {
              return 'vendor-mui-material';
            }
            if (id.includes('@mui/icons-material')) {
              return 'vendor-mui-icons';
            }

            // Heavy Editors and Renderers
            if (id.includes('react-quill-new')) {
              return 'vendor-quill';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'vendor-markdown';
            }

            // PDF Generation (Split internal heavy dependencies)
            if (id.includes('jspdf')) {
              return 'vendor-jspdf';
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            if (id.includes('html2pdf.js')) {
              return 'vendor-html2pdf-wrapper';
            }

            // Framework Core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react-core';
            }

            // Common Utilities
            if (id.includes('zod') || id.includes('date-fns') || id.includes('axios')) {
              return 'vendor-utils';
            }
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd';
            }

            // Other UI libs
            if (id.includes('react-select') || id.includes('react-icons') || id.includes('react-calendar-heatmap')) {
              return 'vendor-ui-extra';
            }

            // Everything else
            return 'vendor-common';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
