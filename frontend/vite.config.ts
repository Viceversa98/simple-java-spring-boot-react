/**
 * WHY: Vite build tooling for the React+TS frontend. Default React plugin
 * is enough; server host/port are passed on the CLI for this demo.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
