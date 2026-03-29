import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

/**
 * Automatically finds all HTML files in the project to configure them as MPA inputs.
 * This ensures that index.html, magazines.html, magazine-detail.html, and others 
 * are all processed by Vite.
 */
function getHtmlInputs() {
  const inputs = {};
  
  // Root level HTML files
  const rootFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
  rootFiles.forEach(file => {
    const name = file.replace('.html', '');
    inputs[name === 'index' ? 'main' : name] = resolve(__dirname, file);
  });

  // Admin level HTML files
  const adminDir = resolve(__dirname, 'admin');
  if (fs.existsSync(adminDir)) {
    const adminFiles = fs.readdirSync(adminDir).filter(file => file.endsWith('.html'));
    adminFiles.forEach(file => {
      const name = `admin/${file.replace('.html', '')}`;
      inputs[name] = resolve(adminDir, file);
    });
  }

  return inputs;
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: getHtmlInputs(),
      output: {
        // Organize build output into clear subdirectories
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (!name) return `assets/[name]-[hash][extname]`;
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Ensure all assets are relatively linked for static hosting compatibility
    assetsInlineLimit: 4096, 
  },
  // Ensure we serve from root
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
