import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Specific core packages to avoid circular dependencies and over-bundling
            if (id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/react-router-dom/')) {
              return 'vendor-react-core';
            }
            if (id.includes('/node_modules/@mui/material/')) {
              // Further split MUI if it's still large
              if (id.includes('/node_modules/@mui/material/styles/') ||
                id.includes('/node_modules/@mui/material/transitions/') ||
                id.includes('/node_modules/@mui/material/colors/')) {
                return 'vendor-mui-core-internal';
              }
              if (id.includes('/node_modules/@mui/material/Box/') ||
                id.includes('/node_modules/@mui/material/Stack/') ||
                id.includes('/node_modules/@mui/material/Typography/')) {
                return 'vendor-mui-layout-components';
              }
              return 'vendor-mui-material';
            }
            if (id.includes('/node_modules/@mui/system/') || id.includes('/node_modules/@mui/styled-engine/')) {
              return 'vendor-mui-system';
            }
            if (id.includes('/node_modules/@mui/icons-material/')) {
              return 'vendor-mui-icons';
            }
            if (id.includes('/node_modules/@mui/')) {
              return 'vendor-mui-other';
            }

            // Large PDF Generation Dependencies
            if (id.includes('/node_modules/jspdf/')) {
              return 'vendor-jspdf';
            }
            if (id.includes('/node_modules/html2canvas/')) {
              return 'vendor-html2canvas';
            }
            if (id.includes('/node_modules/html2pdf.js/')) {
              return 'vendor-html2pdf-wrapper';
            }

            // Heavy Dependencies
            if (id.includes('/node_modules/react-quill-new/')) {
              return 'vendor-quill';
            }
            if (id.includes('/node_modules/react-markdown/') || id.includes('/node_modules/remark-gfm/')) {
              return 'vendor-markdown';
            }
            if (id.includes('/node_modules/@dnd-kit/')) {
              return 'vendor-dnd';
            }
            if (id.includes('/node_modules/@emotion/')) {
              return 'vendor-emotion';
            }
            if (id.includes('/node_modules/react-hook-form/') || id.includes('/node_modules/@hookform/')) {
              return 'vendor-hook-form';
            }
            // Catch other UI extras and group them
            if (id.includes('/node_modules/react-select/') ||
              id.includes('/node_modules/react-icons/') ||
              id.includes('/node_modules/react-calendar-heatmap/') ||
              id.includes('/node_modules/react-error-boundary/')) {
              return 'vendor-ui-extra';
            }

            // Utilities
            if (id.includes('/node_modules/zod/') ||
              id.includes('/node_modules/date-fns/') ||
              id.includes('/node_modules/axios/')) {
              return 'vendor-utils';
            }

            // Everything else in node_modules
            return 'vendor-common';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
