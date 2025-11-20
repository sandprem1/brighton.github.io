import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/brighton.gethub.io/', // This matches your repository name
  define: {
    'process.env': {
      // REPLACE THIS WITH YOUR ACTUAL API KEY FOR THE BUILD
      API_KEY: "YOUR_GEMINI_API_KEY_HERE" 
    }
  }
});