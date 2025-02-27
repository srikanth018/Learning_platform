
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry'],
   
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Replace with your backend port
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf.worker')) {
            return 'pdf-worker';
          }
        },
      },
    },
  },
});





