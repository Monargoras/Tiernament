import { defineConfig } from 'vite'
import react from 'vite-preset-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
  }
})