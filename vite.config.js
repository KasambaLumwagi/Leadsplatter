import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy for HubSpot API to avoid CORS and hide logic slightly during dev
        '/api/hubspot': {
          target: 'https://api.hubapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hubspot/, ''),
        },
        // Proxy for Hugging Face Inference API
        '/api/ai': {
          target: 'https://api-inference.huggingface.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''),
        }
      }
    }
  }
})
