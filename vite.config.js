import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        store: resolve(__dirname, 'store.html'),
        bookStore: resolve(__dirname, 'book-store.html'),
        magazines: resolve(__dirname, 'magazines.html'),
        digitalStore: resolve(__dirname, 'digital-store.html'),
        freeStore: resolve(__dirname, 'free-store.html'),
        contact: resolve(__dirname, 'contact.html'),
        'admin/login': resolve(__dirname, 'admin/login.html'),
        'admin/dashboard': resolve(__dirname, 'admin/dashboard.html'),
        reader: resolve(__dirname, 'reader.html'),
      },
    },
  },
});
