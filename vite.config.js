import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8800", 
        changeOrigin: true
      },
      "/users": {
        target: "http://localhost:8800", 
        changeOrigin: true
      },
      "/awards": {
        target: "http://localhost:8800", 
        changeOrigin: true
      },
      "/posts": {
        target: "http://localhost:8800", 
        changeOrigin: true  
      },
      "/comments": {
        target: "http://localhost:8800", 
        changeOrigin: true  
      }
    }
  }
})
