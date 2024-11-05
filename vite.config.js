import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000', // Adjust the path and URL accordingly,
    },
    // Enable historyApiFallback for client-side routing
    historyApiFallback: true
  },
});
