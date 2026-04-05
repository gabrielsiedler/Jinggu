import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spriteApiPlugin } from './vite-plugin-sprite-api'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spriteApiPlugin()],
})
