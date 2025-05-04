import path from "path"
import { fileURLToPath } from 'url' // Import fileURLToPath
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // Use import.meta.url to get the current file's URL, convert it to a path,
      // get the directory name, and then resolve the 'src' directory relative to that.
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})
