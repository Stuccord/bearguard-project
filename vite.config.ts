import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Custom domain (bearguardss.com) serves from root — always use '/' as base.
  // Do NOT use '/bearguard-project/' here; that sub-path only applies when
  // hosting at stuccord.github.io/bearguard-project without a custom domain.
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
