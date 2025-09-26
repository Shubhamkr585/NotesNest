import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  //set-up for ngrok
//  server: {
//     host: true, // Listen on all addresses
//     allowedHosts: [
//       'd2c9edb5a9e3.ngrok-free.app', // Replace with your actual ngrok URL (without https://)
//     ],
//   }
})
