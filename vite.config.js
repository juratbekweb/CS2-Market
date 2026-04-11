import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make sure .jfif image imports are treated as static assets
  assetsInclude: [/\.jfif$/],
  resolve: {
    // Allow importing .jfif files directly
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.jfif'],
  },
  server: {
    host: '0.0.0.0',
    port: 3003,
    strictPort: true,
    open: true,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

