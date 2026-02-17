
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you deploy under a subpath later, set base accordingly. For local dev keep default.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,            // optional
    open: true,            // optional
    proxy: {
      // mirrors your CRA "proxy": "http://localhost:5000/"
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    middlewareMode: false,
  },
  // If you used absolute imports like "@/..." you can add:
  // resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
});
