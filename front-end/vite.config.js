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
  const isDev = mode === 'development';
  
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
          target: 'http://localhost:8000',
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
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'ui-components': [
              'lucide-react', 
              '@radix-ui/react-avatar', 
              '@radix-ui/react-dialog', 
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-slot'
            ],
            'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'utils': ['axios', 'date-fns'],
            'socket': ['socket.io-client'],
            'carousel': ['embla-carousel', 'embla-carousel-react']
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Optimize build output
      minify: 'esbuild',
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Sourcemaps for production debugging (can be disabled for smaller builds)
      sourcemap: isDev,
      // Optimize dependencies
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'socket.io-client'
      ],
      exclude: ['@tailwindcss/vite']
    }
  };
});
