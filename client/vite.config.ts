import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core React & Routing
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/react-router/') ||
              id.includes('/node_modules/react-router-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react-core';
            }

            // MUI - Merged to avoid circular dependencies and simplify
            if (
              id.includes('/node_modules/@mui/material/') ||
              id.includes('/node_modules/@mui/system/') ||
              id.includes('/node_modules/@mui/styled-engine/') ||
              id.includes('/node_modules/@mui/utils/') ||
              id.includes('/node_modules/@mui/base/') ||
              id.includes('/node_modules/@emotion/styled/') ||
              id.includes('/node_modules/@emotion/react/')
            ) {
              return 'vendor-mui-material';
            }

            if (id.includes('/node_modules/@mui/icons-material/')) {
              return 'vendor-mui-icons';
            }

            // Socket.io
            if (
              id.includes('/node_modules/socket.io-client/') ||
              id.includes('/node_modules/socket.io-parser/') ||
              id.includes('/node_modules/engine.io-client/')
            ) {
              return 'vendor-socket';
            }

            // PDF Generation
            if (id.includes('/node_modules/jspdf/')) {
              return 'vendor-jspdf';
            }
            if (id.includes('/node_modules/html2canvas/')) {
              return 'vendor-html2canvas';
            }
            if (
              id.includes('/node_modules/html2pdf.js/') ||
              id.includes('/node_modules/html-to-image/') ||
              id.includes('/node_modules/canvg/') ||
              id.includes('/node_modules/dompurify/')
            ) {
              return 'vendor-pdf-tools';
            }

            // Large UI Components
            if (id.includes('/node_modules/react-quill-new/')) {
              return 'vendor-quill';
            }
            if (id.includes('/node_modules/react-markdown/') || id.includes('/node_modules/remark-gfm/')) {
              return 'vendor-markdown';
            }
            if (id.includes('/node_modules/@dnd-kit/')) {
              return 'vendor-dnd';
            }

            // Form & Validation
            if (id.includes('/node_modules/react-hook-form/') || id.includes('/node_modules/@hookform/resolvers/')) {
              return 'vendor-hook-form';
            }
            if (id.includes('/node_modules/zod/')) {
              return 'vendor-zod';
            }

            // Utilities
            if (id.includes('/node_modules/axios/') || id.includes('/node_modules/date-fns/')) {
              return 'vendor-utils';
            }

            // Other extras
            if (
              id.includes('/node_modules/react-select/') ||
              id.includes('/node_modules/react-icons/') ||
              id.includes('/node_modules/react-calendar-heatmap/') ||
              id.includes('/node_modules/react-error-boundary/')
            ) {
              return 'vendor-ui-extra';
            }

            return 'vendor-common';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
