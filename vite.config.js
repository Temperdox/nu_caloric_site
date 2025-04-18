import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Create aliases for common directories
      '@': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public')
    }
  },
  // Define public directory explicitly
  publicDir: 'public',
  // Base path for all assets
  base: '/',
  // Configure asset handling
  build: {
    assetsDir: 'assets',
    outDir: 'dist'
  }
})