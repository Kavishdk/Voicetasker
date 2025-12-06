import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Force restart
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});