import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'; // Import 'path' module

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
    react()],
  resolve: {
    alias: {
      // Set up the alias for '@' to point to your 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});
