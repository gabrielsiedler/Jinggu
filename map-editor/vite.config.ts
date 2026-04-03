import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mapEditorApiPlugin } from './vite-plugin-map-api'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mapEditorApiPlugin()],
})
