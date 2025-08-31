// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // escucha en 0.0.0.0
    port: 3001,              // mismo puerto que tu túnel
    // ✅ permite cualquier subdominio de tunnelmole.net
    allowedHosts: ['.tunnelmole.net']
    // — o si quieres más restrictivo:
    // allowedHosts: ['vrfuse-ip-187-190-175-18.tunnelmole.net']
  }
})
