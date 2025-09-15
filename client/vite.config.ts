import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import * as path from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared/src")
    }
  }
})
