import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "./",   // ✅ Required for Vercel or any static hosting
  server: {
    port: 5173
  }
})
