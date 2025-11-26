import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

// __dirname is not defined in ESM; compute it for path.resolve
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isHttpsHosted = process.env.VITE_HMR_WSS === '1' || mode === 'production';
  return {
    plugins: [react(), tailwind()],
    server: {
      host: true,
      // Only force WSS HMR when explicitly requested (e.g., hosted envs)
      hmr: isHttpsHosted
        ? { protocol: 'wss', clientPort: 443 }
        : undefined,
      // Proxy API calls to backend server
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react']
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000
    }
  };
});
