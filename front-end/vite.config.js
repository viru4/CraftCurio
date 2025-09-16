import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

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
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
